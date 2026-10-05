-- 0022 · Ticketing, and public / unlisted / private events.
--
-- Decision 2026-10-05 (ADR-007): GoAthletix is a discovery + TICKETING platform, ticketing first. Organisers
-- sell entries on GoAthletix; discovery of external events continues alongside. The 10,100 seeded events are
-- test data.
--
-- Requirements: productContext "For Organizers" (ticket tiers, custom registration forms, waves/capacity,
-- check-in, promo codes, segmented broadcasts, live analytics, certificates) and "For Athletes" (book for
-- friends and family, QR check-in, certificates); #45 in-app registration; owner: "events published by
-- organisers can be private or public".
--
-- Visibility model:
--   public   — listed in discovery and search; readable by anyone.
--   unlisted — not listed; readable only with the event's share link (access token).
--   private  — readable only by invitees, ticket holders, event staff and the organiser team.
-- The browser path is enforced here by RLS. The backend uses the service role and bypasses RLS, so EVERY
-- backend list/search query must filter `visibility = 'public' AND publication_status = 'published'`
-- itself — that code change ships together with this migration (GA-020 Phase 4).
--
-- Money: one `orders` row (0021) per checkout; each participant is one `tickets` row. Payments, refunds and
-- coupons are shared with the marketplace. Writes to orders/tickets/payments come from the backend only.
--
-- Requires 0012-0021 (enum values, has_role, is_organizer_admin, guard_seller_kyc, orders, coupons).
-- Idempotent and transactional.

BEGIN;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $upd$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$upd$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. Events: visibility, publication workflow, ticketing mode
-- ---------------------------------------------------------------------------

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS visibility          text NOT NULL DEFAULT 'public'
    CHECK (visibility IN ('public', 'unlisted', 'private')),
  ADD COLUMN IF NOT EXISTS publication_status  text NOT NULL DEFAULT 'published'
    CHECK (publication_status IN ('draft', 'published', 'archived')),
  ADD COLUMN IF NOT EXISTS published_at        timestamptz,
  -- Share-link secret for unlisted/private events. Rotate it to revoke old links.
  ADD COLUMN IF NOT EXISTS access_token        text NOT NULL DEFAULT encode(gen_random_bytes(12), 'hex'),
  ADD COLUMN IF NOT EXISTS created_by          uuid REFERENCES profiles (id) ON DELETE SET NULL,
  -- 'external' = discovery listing, Register links out (registration_url).
  -- 'platform' = entries sold on GoAthletix through `tickets`.
  ADD COLUMN IF NOT EXISTS ticketing_mode      text NOT NULL DEFAULT 'external'
    CHECK (ticketing_mode IN ('external', 'platform')),
  ADD COLUMN IF NOT EXISTS max_tickets_per_order integer NOT NULL DEFAULT 10 CHECK (max_tickets_per_order BETWEEN 1 AND 50),
  ADD COLUMN IF NOT EXISTS platform_fee_pct    numeric(5,2) CHECK (platform_fee_pct BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS fee_paid_by         text NOT NULL DEFAULT 'buyer' CHECK (fee_paid_by IN ('buyer', 'organizer')),
  ADD COLUMN IF NOT EXISTS refund_policy       text,
  ADD COLUMN IF NOT EXISTS certificate_template jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS events_access_token_key ON events (access_token);
CREATE INDEX IF NOT EXISTS idx_events_discoverable
  ON events (start_date) WHERE visibility = 'public' AND publication_status = 'published';

UPDATE events SET published_at = created_at WHERE publication_status = 'published' AND published_at IS NULL;

-- Platform-ticketed events have no outbound registration link.
ALTER TABLE events ALTER COLUMN registration_url DROP NOT NULL;
DO $$ BEGIN
  ALTER TABLE events ADD CONSTRAINT events_registration_target
    CHECK (ticketing_mode = 'platform' OR registration_url IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Stamp published_at the first time an event goes live.
CREATE OR REPLACE FUNCTION stamp_event_published()
RETURNS trigger AS $$
BEGIN
  IF NEW.publication_status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS stamp_event_published_trg ON events;
CREATE TRIGGER stamp_event_published_trg
  BEFORE INSERT OR UPDATE OF publication_status ON events FOR EACH ROW EXECUTE FUNCTION stamp_event_published();

-- ---------------------------------------------------------------------------
-- 2. Organiser onboarding for payouts (same shape and guard as seller_private, 0021)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS organizer_private (
  organizer_id          uuid PRIMARY KEY REFERENCES organizers (id) ON DELETE CASCADE,
  legal_name            text,
  business_type         text CHECK (business_type IN ('individual', 'proprietorship', 'partnership', 'llp', 'private_limited', 'public_limited', 'trust_society', 'other')),
  gstin                 text CHECK (gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'),
  pan                   text CHECK (pan   IS NULL OR pan   ~ '^[A-Z]{5}[0-9]{4}[A-Z]$'),
  registered_address    jsonb,
  kyc_status            text NOT NULL DEFAULT 'not_started'
                        CHECK (kyc_status IN ('not_started', 'submitted', 'verified', 'rejected')),
  kyc_verified_at       timestamptz,
  kyc_notes             text,
  payout_provider       text CHECK (payout_provider IN ('razorpay', 'stripe', 'cashfree', 'manual')),
  payout_account_id     text,
  agreement_version     text,
  agreement_accepted_at timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS update_organizer_private_modtime ON organizer_private;
CREATE TRIGGER update_organizer_private_modtime
  BEFORE UPDATE ON organizer_private FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- guard_seller_kyc (0021) only touches kyc_status / kyc_verified_at / kyc_notes / payout_account_id,
-- which this table shares, so it is reused rather than duplicated.
DROP TRIGGER IF EXISTS guard_organizer_kyc_trg ON organizer_private;
CREATE TRIGGER guard_organizer_kyc_trg
  BEFORE INSERT OR UPDATE ON organizer_private FOR EACH ROW EXECUTE FUNCTION guard_seller_kyc();

ALTER TABLE organizer_private ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Organiser admins manage their KYC" ON organizer_private;
CREATE POLICY "Organiser admins manage their KYC"
  ON organizer_private FOR ALL
  USING (is_organizer_admin(organizer_id, auth.uid())) WITH CHECK (is_organizer_admin(organizer_id, auth.uid()));

-- ---------------------------------------------------------------------------
-- 3. Ticket types, waves and the registration form
--    event_categories (0014) already is the ticket type: label, distance, price, capacity, slots_taken.
-- ---------------------------------------------------------------------------

ALTER TABLE event_categories
  ADD COLUMN IF NOT EXISTS description    text,
  ADD COLUMN IF NOT EXISTS includes       text[] NOT NULL DEFAULT '{}',   -- 'T-shirt', 'Medal', 'Timing chip'
  ADD COLUMN IF NOT EXISTS sales_start_at timestamptz,
  ADD COLUMN IF NOT EXISTS sales_end_at   timestamptz,
  ADD COLUMN IF NOT EXISTS max_per_order  integer CHECK (max_per_order > 0),
  -- Hidden ticket types are sold only through a promo/access code (e.g. club or corporate entries).
  ADD COLUMN IF NOT EXISTS is_hidden      boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS event_waves (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES event_categories (id) ON DELETE CASCADE,
  label       text NOT NULL,                       -- 'Wave A — sub 1:45', 'Batch 2'
  start_time  time,
  capacity    integer CHECK (capacity > 0),
  slots_taken integer NOT NULL DEFAULT 0 CHECK (slots_taken >= 0),
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, label)
);

CREATE TABLE IF NOT EXISTS event_form_fields (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  category_id uuid REFERENCES event_categories (id) ON DELETE CASCADE,   -- NULL = every ticket type
  field_key   text NOT NULL CHECK (field_key ~ '^[a-z][a-z0-9_]{1,40}$'),
  label       text NOT NULL,
  field_type  text NOT NULL CHECK (field_type IN (
                'text', 'textarea', 'number', 'date', 'select', 'multiselect', 'checkbox',
                'tshirt_size', 'phone', 'email', 'emergency_contact', 'blood_group', 'club', 'file')),
  options     jsonb,                                -- choices for select / multiselect / tshirt_size
  is_required boolean NOT NULL DEFAULT false,
  help_text   text,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, field_key)
);

-- ---------------------------------------------------------------------------
-- 4. Private-event access: staff and invitations
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS event_staff (
  event_id   uuid NOT NULL REFERENCES events (id)   ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  role       text NOT NULL DEFAULT 'volunteer' CHECK (role IN ('admin', 'checkin', 'volunteer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);

CREATE TABLE IF NOT EXISTS event_invites (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  email      text CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  user_id    uuid REFERENCES profiles (id) ON DELETE CASCADE,
  invited_by uuid REFERENCES profiles (id) ON DELETE SET NULL,
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'revoked')),
  token      text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (email IS NOT NULL OR user_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_event_invites_event ON event_invites (event_id);
CREATE INDEX IF NOT EXISTS idx_event_invites_email ON event_invites (lower(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_event_invites_user  ON event_invites (user_id)      WHERE user_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 5. Tickets — one row per participant. A buyer can register friends and family (attendee_* fields).
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('reserved', 'confirmed', 'checked_in', 'cancelled', 'refunded', 'transferred', 'no_show');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS tickets (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid NOT NULL REFERENCES orders (id) ON DELETE RESTRICT,
  event_id            uuid NOT NULL REFERENCES events (id) ON DELETE RESTRICT,
  category_id         uuid NOT NULL REFERENCES event_categories (id) ON DELETE RESTRICT,
  wave_id             uuid REFERENCES event_waves (id) ON DELETE SET NULL,
  price_tier_id       uuid REFERENCES event_price_tiers (id) ON DELETE SET NULL,
  buyer_id            uuid NOT NULL REFERENCES profiles (id) ON DELETE RESTRICT,
  attendee_user_id    uuid REFERENCES profiles (id) ON DELETE SET NULL,     -- set when the attendee has an account
  attendee_name       text NOT NULL,
  attendee_email      text,
  attendee_phone      text,
  attendee_gender     text CHECK (attendee_gender IN ('female', 'male', 'non_binary', 'prefer_not_to_say')),
  attendee_birth_year smallint CHECK (attendee_birth_year BETWEEN 1900 AND 2100),
  form_answers        jsonb NOT NULL DEFAULT '{}',                           -- answers keyed by event_form_fields.field_key
  bib_number          text,
  status              ticket_status NOT NULL DEFAULT 'reserved',
  -- Seat hold while payment is in progress; the backend releases expired holds.
  reserved_until      timestamptz,
  -- What the QR code encodes at check-in. Random, never derived from the ticket id.
  qr_token            text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  price_inr           integer NOT NULL CHECK (price_inr >= 0),
  fee_inr             integer NOT NULL DEFAULT 0 CHECK (fee_inr >= 0),
  discount_inr        integer NOT NULL DEFAULT 0 CHECK (discount_inr >= 0),
  checked_in_at       timestamptz,
  checked_in_by       uuid REFERENCES profiles (id) ON DELETE SET NULL,
  certificate_url     text,
  transferred_to      uuid REFERENCES tickets (id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS tickets_bib_per_event ON tickets (event_id, bib_number) WHERE bib_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_event_status ON tickets (event_id, status);
CREATE INDEX IF NOT EXISTS idx_tickets_buyer        ON tickets (buyer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_attendee     ON tickets (attendee_user_id) WHERE attendee_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_order        ON tickets (order_id);

DROP TRIGGER IF EXISTS update_tickets_modtime ON tickets;
CREATE TRIGGER update_tickets_modtime
  BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Capacity is enforced in the database, not only in the UI: a sold-out category or wave rejects the insert.
-- Locking the category row serialises concurrent checkouts for the same ticket type, so two buyers can never
-- take the last seat.
CREATE OR REPLACE FUNCTION enforce_ticket_capacity()
RETURNS trigger AS $$
DECLARE
  cap  integer;
  used integer;
BEGIN
  IF NEW.status NOT IN ('reserved', 'confirmed', 'checked_in') THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status IN ('reserved', 'confirmed', 'checked_in')
     AND NEW.category_id = OLD.category_id AND NEW.wave_id IS NOT DISTINCT FROM OLD.wave_id THEN
    RETURN NEW;   -- already counted
  END IF;

  SELECT capacity INTO cap FROM event_categories WHERE id = NEW.category_id FOR UPDATE;
  IF cap IS NOT NULL THEN
    SELECT count(*) INTO used FROM tickets
    WHERE category_id = NEW.category_id AND status IN ('reserved', 'confirmed', 'checked_in') AND id <> NEW.id;
    IF used >= cap THEN
      RAISE EXCEPTION 'Ticket type % is sold out', NEW.category_id USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  IF NEW.wave_id IS NOT NULL THEN
    SELECT capacity INTO cap FROM event_waves WHERE id = NEW.wave_id FOR UPDATE;
    IF cap IS NOT NULL THEN
      SELECT count(*) INTO used FROM tickets
      WHERE wave_id = NEW.wave_id AND status IN ('reserved', 'confirmed', 'checked_in') AND id <> NEW.id;
      IF used >= cap THEN
        RAISE EXCEPTION 'Wave % is full', NEW.wave_id USING ERRCODE = 'check_violation';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS enforce_ticket_capacity_trg ON tickets;
CREATE TRIGGER enforce_ticket_capacity_trg
  BEFORE INSERT OR UPDATE OF status, category_id, wave_id ON tickets
  FOR EACH ROW EXECUTE FUNCTION enforce_ticket_capacity();

-- Keep slots_taken on categories and waves right — these drive the "92% full" bar honestly.
CREATE OR REPLACE FUNCTION refresh_ticket_counts()
RETURNS trigger AS $$
DECLARE
  cats  uuid[] := ARRAY[]::uuid[];
  waves uuid[] := ARRAY[]::uuid[];
BEGIN
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    cats := cats || NEW.category_id;
    IF NEW.wave_id IS NOT NULL THEN waves := waves || NEW.wave_id; END IF;
  END IF;
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    cats := cats || OLD.category_id;
    IF OLD.wave_id IS NOT NULL THEN waves := waves || OLD.wave_id; END IF;
  END IF;

  UPDATE event_categories c
  SET slots_taken = (SELECT count(*) FROM tickets t
                     WHERE t.category_id = c.id AND t.status IN ('reserved', 'confirmed', 'checked_in')),
      is_sold_out = c.capacity IS NOT NULL AND (SELECT count(*) FROM tickets t
                     WHERE t.category_id = c.id AND t.status IN ('reserved', 'confirmed', 'checked_in')) >= c.capacity
  WHERE c.id = ANY (cats);

  UPDATE event_waves w
  SET slots_taken = (SELECT count(*) FROM tickets t
                     WHERE t.wave_id = w.id AND t.status IN ('reserved', 'confirmed', 'checked_in'))
  WHERE w.id = ANY (waves);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS refresh_ticket_counts_trg ON tickets;
CREATE TRIGGER refresh_ticket_counts_trg
  AFTER INSERT OR DELETE OR UPDATE OF status, category_id, wave_id ON tickets
  FOR EACH ROW EXECUTE FUNCTION refresh_ticket_counts();

-- Anonymised feed entry when a registration is confirmed on a public event ("A runner in Pune registered…").
CREATE OR REPLACE FUNCTION log_ticket_activity()
RETURNS trigger AS $$
DECLARE
  v_public boolean;
  v_city   text;
  v_name   text;
  v_vis    text;
BEGIN
  IF NEW.status <> 'confirmed' OR (TG_OP = 'UPDATE' AND OLD.status = 'confirmed') THEN
    RETURN NEW;
  END IF;
  SELECT event_name, visibility INTO v_name, v_vis FROM events WHERE id = NEW.event_id;
  IF v_vis IS DISTINCT FROM 'public' THEN
    RETURN NEW;   -- never announce registrations for unlisted or private events
  END IF;
  SELECT is_public, city INTO v_public, v_city FROM profiles WHERE id = NEW.buyer_id;
  INSERT INTO activity_logs (user_id, user_display_name, action_type, target_id, target_name, actor_city, is_public)
  VALUES (CASE WHEN v_public THEN NEW.buyer_id END, NULL, 'registered', NEW.event_id, coalesce(v_name, 'an event'), v_city, true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS log_ticket_activity_trg ON tickets;
CREATE TRIGGER log_ticket_activity_trg
  AFTER INSERT OR UPDATE OF status ON tickets FOR EACH ROW EXECUTE FUNCTION log_ticket_activity();

-- ---------------------------------------------------------------------------
-- 6. Access helpers and the new events read rule
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION is_event_staff(target_event uuid, target_user uuid)
RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM event_staff WHERE event_id = target_event AND user_id = target_user);
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

-- The share-link token a browser sends in the `x-event-access-token` header (PostgREST exposes headers).
CREATE OR REPLACE FUNCTION request_event_token()
RETURNS text AS $$
  SELECT nullif(current_setting('request.headers', true), '')::json ->> 'x-event-access-token';
$$ LANGUAGE sql STABLE SET search_path = public, pg_temp;

-- Invitee, ticket holder or staff of a private event.
CREATE OR REPLACE FUNCTION can_view_private_event(target_event uuid, target_user uuid)
RETURNS boolean AS $$
  SELECT target_user IS NOT NULL AND (
       EXISTS (SELECT 1 FROM event_invites i
               WHERE i.event_id = target_event AND i.status IN ('pending', 'accepted')
                 AND (i.user_id = target_user
                      OR lower(i.email) = (SELECT lower(u.email) FROM auth.users u WHERE u.id = target_user)))
    OR EXISTS (SELECT 1 FROM tickets t
               WHERE t.event_id = target_event AND (t.buyer_id = target_user OR t.attendee_user_id = target_user))
    OR EXISTS (SELECT 1 FROM event_staff s WHERE s.event_id = target_event AND s.user_id = target_user));
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

-- Replaces 0004's "Public can read events" (USING true), which would expose every private event.
DROP POLICY IF EXISTS "Public can read events" ON events;
DROP POLICY IF EXISTS "Events are readable by visibility" ON events;
CREATE POLICY "Events are readable by visibility"
  ON events FOR SELECT
  USING (
       (publication_status = 'published' AND visibility = 'public')
    OR (publication_status = 'published' AND visibility IN ('unlisted', 'private')
        AND access_token = request_event_token()
        AND (visibility = 'unlisted' OR can_view_private_event(id, auth.uid())))
    OR (publication_status = 'published' AND visibility = 'private' AND can_view_private_event(id, auth.uid()))
    OR is_organizer_admin(organizer_id, auth.uid())
    OR has_role(auth.uid(), 'editor')
  );

-- Child tables follow the parent event's visibility instead of being readable by everyone (0014/0016/0017).
DROP POLICY IF EXISTS "Event categories are publicly readable" ON event_categories;
DROP POLICY IF EXISTS "Event categories follow event visibility" ON event_categories;
CREATE POLICY "Event categories follow event visibility"
  ON event_categories FOR SELECT
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_categories.event_id));

DROP POLICY IF EXISTS "Price tiers are publicly readable" ON event_price_tiers;
DROP POLICY IF EXISTS "Price tiers follow event visibility" ON event_price_tiers;
CREATE POLICY "Price tiers follow event visibility"
  ON event_price_tiers FOR SELECT
  USING (EXISTS (SELECT 1 FROM event_categories c WHERE c.id = event_price_tiers.category_id));

DROP POLICY IF EXISTS "Official results are publicly readable" ON event_result_entries;
DROP POLICY IF EXISTS "Official results follow event visibility" ON event_result_entries;
CREATE POLICY "Official results follow event visibility"
  ON event_result_entries FOR SELECT
  USING (NOT is_hidden AND EXISTS (SELECT 1 FROM events e WHERE e.id = event_result_entries.event_id));

DROP POLICY IF EXISTS "Published reviews are publicly readable" ON event_reviews;
CREATE POLICY "Published reviews are publicly readable"
  ON event_reviews FOR SELECT
  USING ((status = 'published' AND EXISTS (SELECT 1 FROM events e WHERE e.id = event_reviews.event_id))
         OR auth.uid() = user_id OR has_role(auth.uid(), 'moderator'));

DROP POLICY IF EXISTS "Published media is publicly readable" ON event_media;
CREATE POLICY "Published media is publicly readable"
  ON event_media FOR SELECT
  USING ((status = 'published' AND EXISTS (SELECT 1 FROM events e WHERE e.id = event_media.event_id))
         OR auth.uid() = uploaded_by OR has_role(auth.uid(), 'moderator'));

-- ---------------------------------------------------------------------------
-- 7. RLS for the new ticketing tables
-- ---------------------------------------------------------------------------

ALTER TABLE event_waves       ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_staff       ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_invites     ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets           ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Waves follow event visibility" ON event_waves;
CREATE POLICY "Waves follow event visibility"
  ON event_waves FOR SELECT
  USING (EXISTS (SELECT 1 FROM event_categories c WHERE c.id = event_waves.category_id));

DROP POLICY IF EXISTS "Registration forms follow event visibility" ON event_form_fields;
CREATE POLICY "Registration forms follow event visibility"
  ON event_form_fields FOR SELECT
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_form_fields.event_id));

DROP POLICY IF EXISTS "Organisers and staff read event staff" ON event_staff;
CREATE POLICY "Organisers and staff read event staff"
  ON event_staff FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM events e WHERE e.id = event_staff.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

DROP POLICY IF EXISTS "Organisers manage event staff" ON event_staff;
CREATE POLICY "Organisers manage event staff"
  ON event_staff FOR ALL
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_staff.event_id AND is_organizer_admin(e.organizer_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM events e WHERE e.id = event_staff.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

DROP POLICY IF EXISTS "Organisers manage invites" ON event_invites;
CREATE POLICY "Organisers manage invites"
  ON event_invites FOR ALL
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_invites.event_id AND is_organizer_admin(e.organizer_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM events e WHERE e.id = event_invites.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

DROP POLICY IF EXISTS "Invitees read their invites" ON event_invites;
CREATE POLICY "Invitees read their invites"
  ON event_invites FOR SELECT
  USING (auth.uid() = user_id
         OR lower(email) = (SELECT lower(u.email) FROM auth.users u WHERE u.id = auth.uid()));

-- Buyer, attendee, the organiser team and event staff (for check-in) can read a ticket. Writes: backend only.
DROP POLICY IF EXISTS "Ticket holders, organisers and staff read tickets" ON tickets;
CREATE POLICY "Ticket holders, organisers and staff read tickets"
  ON tickets FOR SELECT
  USING (auth.uid() = buyer_id
         OR auth.uid() = attendee_user_id
         OR is_event_staff(event_id, auth.uid())
         OR EXISTS (SELECT 1 FROM events e WHERE e.id = tickets.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

-- ---------------------------------------------------------------------------
-- 8. Promo codes for events — coupons (0021) gain an organiser / event scope
-- ---------------------------------------------------------------------------

ALTER TABLE coupons
  ADD COLUMN IF NOT EXISTS organizer_id uuid REFERENCES organizers (id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS event_id     uuid REFERENCES events (id)     ON DELETE CASCADE,
  -- Optional: unlock a hidden ticket type (event_categories.is_hidden) with this code.
  ADD COLUMN IF NOT EXISTS unlocks_category_id uuid REFERENCES event_categories (id) ON DELETE SET NULL;

DO $$ BEGIN
  ALTER TABLE coupons ADD CONSTRAINT coupons_single_owner
    CHECK (num_nonnulls(seller_id, organizer_id) <= 1);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DROP POLICY IF EXISTS "Organisers manage their promo codes" ON coupons;
CREATE POLICY "Organisers manage their promo codes"
  ON coupons FOR ALL
  USING (organizer_id IS NOT NULL AND is_organizer_admin(organizer_id, auth.uid()))
  WITH CHECK (organizer_id IS NOT NULL AND is_organizer_admin(organizer_id, auth.uid()));

-- ---------------------------------------------------------------------------
-- 9. Organiser payouts (entry fees collected minus platform fee, refunds, TDS)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS organizer_payouts (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id         uuid NOT NULL REFERENCES organizers (id) ON DELETE RESTRICT,
  event_id             uuid REFERENCES events (id) ON DELETE SET NULL,
  period_start         date NOT NULL,
  period_end           date NOT NULL,
  gross_inr            integer NOT NULL CHECK (gross_inr >= 0),
  platform_fee_inr     integer NOT NULL DEFAULT 0 CHECK (platform_fee_inr >= 0),
  refunds_inr          integer NOT NULL DEFAULT 0 CHECK (refunds_inr >= 0),
  tcs_inr              integer NOT NULL DEFAULT 0 CHECK (tcs_inr >= 0),
  tds_inr              integer NOT NULL DEFAULT 0 CHECK (tds_inr >= 0),
  net_inr              integer NOT NULL,
  status               text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'processing', 'paid', 'failed', 'on_hold')),
  provider_transfer_id text UNIQUE,
  paid_at              timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  CHECK (period_end >= period_start),
  CHECK (net_inr = gross_inr - platform_fee_inr - refunds_inr - tcs_inr - tds_inr)
);

CREATE TABLE IF NOT EXISTS organizer_payout_items (
  payout_id  uuid NOT NULL REFERENCES organizer_payouts (id) ON DELETE CASCADE,
  ticket_id  uuid NOT NULL REFERENCES tickets (id)           ON DELETE RESTRICT,
  amount_inr integer NOT NULL,
  PRIMARY KEY (payout_id, ticket_id)
);

-- A ticket's money is paid out at most once.
CREATE UNIQUE INDEX IF NOT EXISTS organizer_payout_items_once ON organizer_payout_items (ticket_id);

ALTER TABLE organizer_payouts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_payout_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Organisers read their payouts" ON organizer_payouts;
CREATE POLICY "Organisers read their payouts"
  ON organizer_payouts FOR SELECT USING (is_organizer_admin(organizer_id, auth.uid()));
DROP POLICY IF EXISTS "Organisers read their payout items" ON organizer_payout_items;
CREATE POLICY "Organisers read their payout items"
  ON organizer_payout_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM organizer_payouts p WHERE p.id = organizer_payout_items.payout_id AND is_organizer_admin(p.organizer_id, auth.uid())));

-- ---------------------------------------------------------------------------
-- 10. Organiser broadcasts — segmented messages to registrants, followers, waitlist
--     (WhatsApp delivery needs a Business API provider and approved templates — pending.)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS organizer_broadcasts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id    uuid NOT NULL REFERENCES organizers (id) ON DELETE CASCADE,
  event_id        uuid REFERENCES events (id) ON DELETE CASCADE,
  channel         notification_channel NOT NULL,
  audience        text NOT NULL CHECK (audience IN ('registrants', 'checked_in', 'waitlist', 'followers', 'interested')),
  segment         jsonb NOT NULL DEFAULT '{}',          -- e.g. {"category_id": "...", "city": "Pune"}
  subject         text,
  body            text NOT NULL CHECK (char_length(body) <= 4000),
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled')),
  scheduled_at    timestamptz,
  sent_at         timestamptz,
  recipient_count integer,
  created_by      uuid REFERENCES profiles (id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS update_organizer_broadcasts_modtime ON organizer_broadcasts;
CREATE TRIGGER update_organizer_broadcasts_modtime
  BEFORE UPDATE ON organizer_broadcasts FOR EACH ROW EXECUTE FUNCTION update_modified_column();

ALTER TABLE organizer_broadcasts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Organisers manage their broadcasts" ON organizer_broadcasts;
CREATE POLICY "Organisers manage their broadcasts"
  ON organizer_broadcasts FOR ALL
  USING (is_organizer_admin(organizer_id, auth.uid())) WITH CHECK (is_organizer_admin(organizer_id, auth.uid()));
-- Sending (status -> sending/sent, recipient_count) is done by the backend worker (service role).

COMMIT;
