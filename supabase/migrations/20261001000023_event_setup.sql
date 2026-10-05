-- 0023 · Organiser event setup — everything an organiser fills in to create, sell and run an event.
--
-- Requirement #60 (docs/05-feature-inventory.md) and spec §14: the organiser setup wizard
--   1 Basics · 2 Schedule · 3 Venue · 4 Tickets & eligibility · 5 Registration form · 6 Policies & waiver
--   7 Tax & payout · 8 Support, safety & amenities · 9 Media, sponsors & FAQs · 10 Compliance documents
--   11 Visibility & publish
-- Most of steps 4-5 and 11 already exist (event_categories, event_price_tiers, event_waves,
-- event_form_fields, visibility — 0014/0022). This file adds the rest, plus the rule that a paid event cannot
-- go live without its minimum details and a KYC-verified organiser.
--
-- Requires 0013-0022. Idempotent and transactional.

BEGIN;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $upd$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$upd$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. Event-level setup fields
-- ---------------------------------------------------------------------------

ALTER TABLE events
  -- Step 1 · Basics
  ADD COLUMN IF NOT EXISTS tagline              text CHECK (char_length(tagline) <= 140),   -- card + SEO line
  ADD COLUMN IF NOT EXISTS banner_url           text,                                       -- wide banner (poster_url is portrait)
  ADD COLUMN IF NOT EXISTS website_url          text,
  -- Step 2 · Schedule (start_date/end_date/start_time/timezone exist)
  ADD COLUMN IF NOT EXISTS end_time             time,
  ADD COLUMN IF NOT EXISTS reporting_time       time,                                       -- gates open / report by
  -- Step 3 · Venue (city/state/venue/geo_location exist)
  ADD COLUMN IF NOT EXISTS address_line         text,
  ADD COLUMN IF NOT EXISTS pincode              text CHECK (pincode IS NULL OR pincode ~ '^[1-9][0-9]{5}$'),
  ADD COLUMN IF NOT EXISTS venue_notes          text,                                       -- parking, transport, accessibility
  -- Step 6 · Policies & waiver (refund_policy exists, 0022)
  ADD COLUMN IF NOT EXISTS transfer_policy      text,                                       -- name change / transfer to another athlete
  ADD COLUMN IF NOT EXISTS deferral_policy      text,                                       -- roll entry to next edition
  ADD COLUMN IF NOT EXISTS cancellation_policy  text,                                       -- what happens if the organiser cancels
  ADD COLUMN IF NOT EXISTS terms_text           text,
  ADD COLUMN IF NOT EXISTS waiver_text          text,                                       -- participant liability waiver
  ADD COLUMN IF NOT EXISTS waiver_version       integer NOT NULL DEFAULT 1 CHECK (waiver_version > 0),
  -- Step 7 · Tax (payout details live in organizer_private, 0022)
  ADD COLUMN IF NOT EXISTS tax_mode             text NOT NULL DEFAULT 'inclusive' CHECK (tax_mode IN ('inclusive', 'exclusive')),
  ADD COLUMN IF NOT EXISTS gst_rate             numeric(4,2) CHECK (gst_rate BETWEEN 0 AND 40),
  ADD COLUMN IF NOT EXISTS waitlist_enabled     boolean NOT NULL DEFAULT false,
  -- Step 8 · Support, safety & amenities
  ADD COLUMN IF NOT EXISTS contact_email        text CHECK (contact_email IS NULL OR contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD COLUMN IF NOT EXISTS contact_phone        text,
  ADD COLUMN IF NOT EXISTS whatsapp_url         text,
  ADD COLUMN IF NOT EXISTS safety_info          text,                                       -- medical support, ambulance, emergency plan
  ADD COLUMN IF NOT EXISTS aid_stations         jsonb,                                      -- [{"km": 5, "offers": ["water","electrolyte"]}]
  ADD COLUMN IF NOT EXISTS amenities            text[] NOT NULL DEFAULT '{}',
  -- Lifecycle
  ADD COLUMN IF NOT EXISTS cancelled_at         timestamptz,
  ADD COLUMN IF NOT EXISTS cancellation_reason  text,
  -- Wizard progress so an organiser can save a draft and resume: {"basics": true, "tickets": false, ...}
  ADD COLUMN IF NOT EXISTS setup_progress       jsonb NOT NULL DEFAULT '{}';

DO $$ BEGIN
  ALTER TABLE events ADD CONSTRAINT events_amenities_known CHECK (amenities <@ ARRAY[
    'parking', 'baggage_counter', 'changing_rooms', 'toilets', 'hydration', 'medical', 'pacers',
    'photography', 'live_tracking', 'timing_chip', 'finisher_medal', 'tshirt', 'breakfast', 'shuttle',
    'wheelchair_access', 'creche'
  ]::text[]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE events ADD CONSTRAINT events_end_after_start
    CHECK (end_time IS NULL OR start_time IS NULL OR end_date > start_date OR end_time >= start_time);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- 2. Eligibility per ticket type (step 4) — event_categories is the ticket type
-- ---------------------------------------------------------------------------

ALTER TABLE event_categories
  ADD COLUMN IF NOT EXISTS min_age             smallint CHECK (min_age BETWEEN 0 AND 120),
  ADD COLUMN IF NOT EXISTS max_age             smallint CHECK (max_age BETWEEN 0 AND 120),
  -- Age is measured on this date (federations use e.g. 31 Dec of the season); NULL = on event day.
  ADD COLUMN IF NOT EXISTS age_as_on_date      date,
  ADD COLUMN IF NOT EXISTS required_documents  text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS qualifying_standard text,                 -- 'Sub 2:00 half marathon in the last 24 months'
  ADD COLUMN IF NOT EXISTS team_size_min       smallint CHECK (team_size_min BETWEEN 1 AND 50),
  ADD COLUMN IF NOT EXISTS team_size_max       smallint CHECK (team_size_max BETWEEN 1 AND 50),
  ADD COLUMN IF NOT EXISTS eligibility_notes   text;

DO $$ BEGIN
  ALTER TABLE event_categories ADD CONSTRAINT event_categories_age_range
    CHECK (min_age IS NULL OR max_age IS NULL OR max_age >= min_age);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE event_categories ADD CONSTRAINT event_categories_team_range
    CHECK (team_size_min IS NULL OR team_size_max IS NULL OR team_size_max >= team_size_min);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE event_categories ADD CONSTRAINT event_categories_documents_known CHECK (required_documents <@ ARRAY[
    'govt_id', 'federation_id', 'medical_certificate', 'qualifying_proof', 'school_id',
    'parental_consent', 'club_letter', 'photo'
  ]::text[]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- 3. Ticket-holder consent and minors (step 6). A ticket records exactly which waiver version was accepted;
--    under-18 attendees carry a guardian.
-- ---------------------------------------------------------------------------

ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS waiver_version      integer,
  ADD COLUMN IF NOT EXISTS waiver_accepted_at  timestamptz,
  ADD COLUMN IF NOT EXISTS terms_accepted_at   timestamptz,
  ADD COLUMN IF NOT EXISTS team_name           text,
  ADD COLUMN IF NOT EXISTS guardian_name       text,
  ADD COLUMN IF NOT EXISTS guardian_phone      text,
  ADD COLUMN IF NOT EXISTS guardian_relation   text,
  ADD COLUMN IF NOT EXISTS documents           jsonb NOT NULL DEFAULT '{}';   -- {"medical_certificate": "<storage path>"}

DO $$ BEGIN
  ALTER TABLE tickets ADD CONSTRAINT tickets_confirmed_needs_waiver
    CHECK (status NOT IN ('confirmed', 'checked_in') OR waiver_accepted_at IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- 4. Schedule / agenda (step 2) — expo, bib collection, flag-off per category, prize ceremony
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS event_schedule_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  category_id uuid REFERENCES event_categories (id) ON DELETE CASCADE,   -- e.g. flag-off for one distance
  kind        text NOT NULL DEFAULT 'session'
              CHECK (kind IN ('expo', 'bib_collection', 'reporting', 'flag_off', 'session', 'ceremony', 'other')),
  title       text NOT NULL,
  starts_at   timestamptz NOT NULL,
  ends_at     timestamptz,
  location    text,
  notes       text,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR ends_at >= starts_at)
);

CREATE INDEX IF NOT EXISTS idx_event_schedule_items ON event_schedule_items (event_id, starts_at);

-- ---------------------------------------------------------------------------
-- 5. Sponsors and FAQs (step 9)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS event_sponsors (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  name       text NOT NULL,
  tier       text NOT NULL DEFAULT 'partner' CHECK (tier IN ('title', 'presenting', 'gold', 'silver', 'partner', 'media')),
  logo_url   text,
  website_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_faqs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  question   text NOT NULL CHECK (char_length(question) <= 300),
  answer     text NOT NULL CHECK (char_length(answer) <= 4000),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_sponsors ON event_sponsors (event_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_event_faqs     ON event_faqs (event_id, sort_order);

-- ---------------------------------------------------------------------------
-- 6. Compliance documents (step 10) — permits, venue NOC, insurance, federation sanction. Private:
--    only the organiser team and GoAthletix moderators can see them; only moderators can verify.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS event_documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  doc_type    text NOT NULL CHECK (doc_type IN ('police_permission', 'venue_noc', 'insurance', 'federation_sanction',
                                                'medical_tieup', 'municipal_permission', 'other')),
  file_path   text NOT NULL,                  -- Supabase Storage path in a private bucket, never a public URL
  status      text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'verified', 'rejected', 'expired')),
  valid_until date,
  review_note text,
  reviewed_by uuid REFERENCES profiles (id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  uploaded_by uuid REFERENCES profiles (id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_documents_event ON event_documents (event_id);

CREATE OR REPLACE FUNCTION guard_event_document_review()
RETURNS trigger AS $$
BEGIN
  IF NOT is_staff_session() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.status := 'submitted';
      NEW.reviewed_by := NULL; NEW.reviewed_at := NULL; NEW.review_note := NULL;
    ELSE
      NEW.status := OLD.status;
      NEW.reviewed_by := OLD.reviewed_by; NEW.reviewed_at := OLD.reviewed_at; NEW.review_note := OLD.review_note;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_event_document_review_trg ON event_documents;
CREATE TRIGGER guard_event_document_review_trg
  BEFORE INSERT OR UPDATE ON event_documents FOR EACH ROW EXECUTE FUNCTION guard_event_document_review();

-- ---------------------------------------------------------------------------
-- 7. RLS
-- ---------------------------------------------------------------------------

ALTER TABLE event_schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sponsors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_faqs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_documents      ENABLE ROW LEVEL SECURITY;

-- Public content follows the parent event's visibility (0022); the organiser team edits it.
DROP POLICY IF EXISTS "Schedule follows event visibility" ON event_schedule_items;
CREATE POLICY "Schedule follows event visibility"
  ON event_schedule_items FOR SELECT USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_schedule_items.event_id));
DROP POLICY IF EXISTS "Organisers manage the schedule" ON event_schedule_items;
CREATE POLICY "Organisers manage the schedule"
  ON event_schedule_items FOR ALL
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_schedule_items.event_id AND is_organizer_admin(e.organizer_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM events e WHERE e.id = event_schedule_items.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

DROP POLICY IF EXISTS "Sponsors follow event visibility" ON event_sponsors;
CREATE POLICY "Sponsors follow event visibility"
  ON event_sponsors FOR SELECT USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_sponsors.event_id));
DROP POLICY IF EXISTS "Organisers manage sponsors" ON event_sponsors;
CREATE POLICY "Organisers manage sponsors"
  ON event_sponsors FOR ALL
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_sponsors.event_id AND is_organizer_admin(e.organizer_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM events e WHERE e.id = event_sponsors.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

DROP POLICY IF EXISTS "FAQs follow event visibility" ON event_faqs;
CREATE POLICY "FAQs follow event visibility"
  ON event_faqs FOR SELECT USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_faqs.event_id));
DROP POLICY IF EXISTS "Organisers manage FAQs" ON event_faqs;
CREATE POLICY "Organisers manage FAQs"
  ON event_faqs FOR ALL
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_faqs.event_id AND is_organizer_admin(e.organizer_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM events e WHERE e.id = event_faqs.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

DROP POLICY IF EXISTS "Organisers and moderators read compliance documents" ON event_documents;
CREATE POLICY "Organisers and moderators read compliance documents"
  ON event_documents FOR SELECT
  USING (has_role(auth.uid(), 'moderator') OR EXISTS (
    SELECT 1 FROM events e WHERE e.id = event_documents.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));
DROP POLICY IF EXISTS "Organisers upload compliance documents" ON event_documents;
CREATE POLICY "Organisers upload compliance documents"
  ON event_documents FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM events e WHERE e.id = event_documents.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));
DROP POLICY IF EXISTS "Organisers remove unverified documents" ON event_documents;
CREATE POLICY "Organisers remove unverified documents"
  ON event_documents FOR DELETE
  USING (status <> 'verified' AND EXISTS (
    SELECT 1 FROM events e WHERE e.id = event_documents.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

-- ---------------------------------------------------------------------------
-- 8. Publish guard — the minimum an event needs before it goes live.
--    Every event: name, date, city, venue, sport (already NOT NULL), and for external listings a
--    registration link (0022 constraint). A PAID platform event additionally needs, before publishing:
--      · a KYC-verified organiser (no payouts to an unverified account)
--      · at least one ticket type with a price
--      · refund policy, contact email, and a waiver (athletes must accept one to confirm a ticket)
--    Staff can still publish from the dashboard (is_staff_session) — e.g. for the seeded test data.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION check_event_publishable()
RETURNS trigger AS $$
DECLARE
  missing text[] := '{}';
BEGIN
  IF NEW.publication_status <> 'published' OR NEW.ticketing_mode <> 'platform' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.publication_status = 'published' AND OLD.ticketing_mode = 'platform' THEN
    RETURN NEW;   -- already live; editing a live event is not re-gated here
  END IF;
  -- Exempt only the dashboard SQL editor and GoAthletix moderators. NOT the service role: the backend
  -- publishes on an organiser's behalf, so it must pass the same gate. (Deliberately not is_staff_session(),
  -- which treats the service role as staff.)
  IF current_user IN ('postgres', 'supabase_admin') OR has_role(auth.uid(), 'moderator') THEN
    RETURN NEW;
  END IF;

  IF NEW.organizer_id IS NULL OR NOT EXISTS (
       SELECT 1 FROM organizer_private op WHERE op.organizer_id = NEW.organizer_id AND op.kyc_status = 'verified') THEN
    missing := missing || 'verified organiser KYC';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM event_categories c WHERE c.event_id = NEW.id AND c.price_inr IS NOT NULL) THEN
    missing := missing || 'a priced ticket type';
  END IF;
  IF coalesce(btrim(NEW.refund_policy), '') = '' THEN missing := missing || 'refund policy'; END IF;
  IF NEW.contact_email IS NULL THEN missing := missing || 'contact email'; END IF;
  IF coalesce(btrim(NEW.waiver_text), '') = '' THEN missing := missing || 'participant waiver'; END IF;

  IF array_length(missing, 1) > 0 THEN
    RAISE EXCEPTION 'Event cannot be published yet. Missing: %', array_to_string(missing, ', ')
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
-- SECURITY INVOKER on purpose: as SECURITY DEFINER, current_user would always be the owner (postgres) and the
-- exemption above would let everyone through. Under RLS the organiser can still read their own KYC row and
-- ticket types, and the service role reads everything.
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS check_event_publishable_trg ON events;
CREATE TRIGGER check_event_publishable_trg
  BEFORE INSERT OR UPDATE OF publication_status, ticketing_mode ON events
  FOR EACH ROW EXECUTE FUNCTION check_event_publishable();

COMMIT;
