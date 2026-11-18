-- 0027: registrations.
--
-- Separates the four things a booking is made of, so each can be queried, indexed and kept on its own:
--   orders                 the booking contact and the money (one per checkout; payments, added later, hang off it)
--   tickets                one row per seat: category, price, status and the QR code
--   participants           the person on each ticket (identity), one per ticket
--   registration_answers   one row per answer to an organiser-defined question (event_form_fields), keyed by field_key
-- plus the indexes that make "find any person" fast, and one atomic function the backend calls to create a registration.
--
-- orders, tickets and event_form_fields were empty when this was written, so the NOT NULL changes below need no backfill.
-- Writes go through the backend with the service role; the new tables are readable by the participant, the organiser team and
-- event staff, like tickets (0022).

-- ---------------------------------------------------------------------------
-- 0. Extensions: trigram search ("contains" matching on names, emails, answers) and btree_gin (an event_id column inside a GIN index)
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_trgm   WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS btree_gin WITH SCHEMA extensions;

-- ---------------------------------------------------------------------------
-- 1. orders: the booking contact (guest checkout), retry safety, search
-- ---------------------------------------------------------------------------
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;     -- a guest books with a name, email and mobile; no account needed

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS buyer_name      text,
  ADD COLUMN IF NOT EXISTS buyer_email     text,
  ADD COLUMN IF NOT EXISTS buyer_phone     text,
  ADD COLUMN IF NOT EXISTS idempotency_key text,            -- a retried request returns the same order instead of booking twice
  ADD COLUMN IF NOT EXISTS buyer_phone_norm text GENERATED ALWAYS AS (right(regexp_replace(coalesce(buyer_phone, ''), '\D', '', 'g'), 10)) STORED,
  ADD COLUMN IF NOT EXISTS search_text text GENERATED ALWAYS AS (
    lower(coalesce(order_number, '') || ' ' || coalesce(buyer_name, '') || ' ' || coalesce(buyer_email, '') || ' ' ||
          right(regexp_replace(coalesce(buyer_phone, ''), '\D', '', 'g'), 10))) STORED;

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_has_buyer;
ALTER TABLE orders ADD CONSTRAINT orders_has_buyer
  CHECK (user_id IS NOT NULL OR (buyer_name IS NOT NULL AND buyer_email IS NOT NULL));

CREATE UNIQUE INDEX IF NOT EXISTS orders_idempotency_key ON orders (idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_buyer_email ON orders (lower(buyer_email)) WHERE buyer_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_buyer_phone ON orders (buyer_phone_norm)   WHERE buyer_phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_event       ON orders (event_context_id, placed_at DESC) WHERE event_context_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders (status, placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_search      ON orders USING gin (search_text extensions.gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- 2. participants: the person on a ticket
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS participants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid NOT NULL REFERENCES events (id) ON DELETE RESTRICT,
  user_id     uuid REFERENCES profiles (id) ON DELETE SET NULL,          -- when the participant has an account
  full_name   text NOT NULL CHECK (char_length(btrim(full_name)) >= 2),
  email       text,
  phone       text,
  phone_norm  text GENERATED ALWAYS AS (right(regexp_replace(coalesce(phone, ''), '\D', '', 'g'), 10)) STORED,
  gender      text CHECK (gender IN ('female', 'male', 'non_binary', 'prefer_not_to_say')),
  birth_date  date CHECK (birth_date >= DATE '1900-01-01'),
  -- One lower-cased string of everything people are looked up by, so a single trigram index answers any "contains" search.
  search_text text GENERATED ALWAYS AS (
    lower(btrim(coalesce(full_name, '') || ' ' || coalesce(email, '') || ' ' ||
                right(regexp_replace(coalesce(phone, ''), '\D', '', 'g'), 10)))) STORED,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, event_id)                                                  -- lets tickets prove their participant belongs to the same event
);

CREATE INDEX IF NOT EXISTS idx_participants_event_phone ON participants (event_id, phone_norm) WHERE phone_norm <> '';
CREATE INDEX IF NOT EXISTS idx_participants_event_email ON participants (event_id, lower(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_participants_event_name  ON participants (event_id, lower(full_name) text_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_participants_search      ON participants USING gin (event_id, search_text extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_participants_user        ON participants (user_id) WHERE user_id IS NOT NULL;

DROP TRIGGER IF EXISTS update_participants_modtime ON participants;
CREATE TRIGGER update_participants_modtime
  BEFORE UPDATE ON participants FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ---------------------------------------------------------------------------
-- 3. tickets: one per seat, the QR code, the link to its participant
-- ---------------------------------------------------------------------------
ALTER TABLE tickets ALTER COLUMN buyer_id      DROP NOT NULL;    -- guest orders have no buyer profile
ALTER TABLE tickets ALTER COLUMN attendee_name DROP NOT NULL;    -- identity now lives in participants

ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS participant_id uuid NOT NULL,
  ADD COLUMN IF NOT EXISTS ticket_number  text NOT NULL,          -- the human code printed on the ticket: <order number>-<seat>
  ADD COLUMN IF NOT EXISTS qr_payload     text,                   -- exactly what the QR encodes ('GA1.' + qr_token); scanning looks up qr_token
  ADD COLUMN IF NOT EXISTS qr_svg         text;                   -- the rendered code, ready for the ticket page, email and wallet pass

ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_participant_fk;
ALTER TABLE tickets ADD CONSTRAINT tickets_participant_fk
  FOREIGN KEY (participant_id, event_id) REFERENCES participants (id, event_id) ON DELETE RESTRICT;

CREATE UNIQUE INDEX IF NOT EXISTS tickets_one_per_participant ON tickets (participant_id);
CREATE UNIQUE INDEX IF NOT EXISTS tickets_ticket_number       ON tickets (ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_event_category ON tickets (event_id, category_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event_created  ON tickets (event_id, created_at DESC);
-- tickets.qr_token is already UNIQUE (0022): that index is the scan lookup.

COMMENT ON COLUMN tickets.attendee_name       IS 'Deprecated: the person is in participants (participant_id). Kept so older policies keep working.';
COMMENT ON COLUMN tickets.attendee_email      IS 'Deprecated: see participants.';
COMMENT ON COLUMN tickets.attendee_phone      IS 'Deprecated: see participants.';
COMMENT ON COLUMN tickets.attendee_gender     IS 'Deprecated: see participants.';
COMMENT ON COLUMN tickets.attendee_birth_year IS 'Deprecated: see participants.birth_date.';
COMMENT ON COLUMN tickets.form_answers        IS 'Deprecated: answers are rows in registration_answers.';

-- ---------------------------------------------------------------------------
-- 4. registration_answers: one row per answer to an organiser-defined question
-- ---------------------------------------------------------------------------
-- field_key is the organiser's key (event_form_fields.field_key, or a built-in preset key when the event defines none); the label and
-- type are copied here so a later rename or removal of the question never rewrites or orphans what a participant answered.
CREATE TABLE IF NOT EXISTS registration_answers (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       uuid NOT NULL REFERENCES events (id) ON DELETE RESTRICT,
  ticket_id      uuid NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
  participant_id uuid NOT NULL REFERENCES participants (id) ON DELETE CASCADE,
  field_id       uuid REFERENCES event_form_fields (id) ON DELETE SET NULL,
  field_key      text NOT NULL CHECK (field_key ~ '^[a-z][a-z0-9_]{1,40}$'),
  field_label    text NOT NULL,
  field_type     text NOT NULL CHECK (field_type IN (
                   'text', 'textarea', 'number', 'date', 'select', 'multiselect', 'checkbox',
                   'tshirt_size', 'phone', 'email', 'emergency_contact', 'blood_group', 'club', 'file')),
  value_text     text,                         -- the answer as searchable text (an emergency contact reads "name phone relation")
  value_json     jsonb,                        -- the structured answer: a boolean, a list, a contact object, a file reference
  is_sensitive   boolean NOT NULL DEFAULT false, -- medical and emergency answers: shown only to the organiser team, left out of broad exports
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ticket_id, field_key)
);

CREATE INDEX IF NOT EXISTS idx_answers_event_field   ON registration_answers (event_id, field_key, lower(value_text));
CREATE INDEX IF NOT EXISTS idx_answers_participant   ON registration_answers (participant_id);
CREATE INDEX IF NOT EXISTS idx_answers_search        ON registration_answers USING gin (event_id, (lower(value_text)) extensions.gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- 5. Row level security: reads for the participant, the organiser team and staff. Writes: backend (service role) only.
-- ---------------------------------------------------------------------------
ALTER TABLE participants         ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participants are readable by themselves, organisers and staff" ON participants;
CREATE POLICY "Participants are readable by themselves, organisers and staff"
  ON participants FOR SELECT
  USING (auth.uid() = user_id
         OR is_event_staff(event_id, auth.uid())
         OR EXISTS (SELECT 1 FROM events e WHERE e.id = participants.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

DROP POLICY IF EXISTS "Answers are readable by the organiser team; sensitive ones by organisers only" ON registration_answers;
CREATE POLICY "Answers are readable by the organiser team; sensitive ones by organisers only"
  ON registration_answers FOR SELECT
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = registration_answers.event_id AND is_organizer_admin(e.organizer_id, auth.uid()))
         OR (NOT is_sensitive AND is_event_staff(event_id, auth.uid()))
         OR EXISTS (SELECT 1 FROM participants p WHERE p.id = registration_answers.participant_id AND p.user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- 6. create_registration(p jsonb): the whole booking in one transaction
-- ---------------------------------------------------------------------------
-- The backend validates everything and computes prices; this function only writes, atomically: it holds the seats (a conditional
-- update on event_categories.slots_taken), then inserts the order, then each participant, ticket and answers. A repeated
-- idempotency key returns the order that already exists. Failures raise with a stable prefix the backend maps to an HTTP error:
--   SOLD_OUT:<category id>    the category cannot take that many more seats
--   BAD_CATEGORY:<id>         the category is not part of this event
CREATE OR REPLACE FUNCTION create_registration(p jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public, extensions
AS $$
DECLARE
  v_event    uuid := (p ->> 'event_id')::uuid;
  v_key      text := nullif(p ->> 'idempotency_key', '');
  v_order    orders%ROWTYPE;
  v_user     uuid := nullif(p #>> '{buyer,user_id}', '')::uuid;
  v_t        jsonb;
  v_a        jsonb;
  v_part     uuid;
  v_ticket   uuid;
  v_tnum     text;
  v_seat     integer := 0;
  v_cat      record;
  v_out      jsonb := '[]'::jsonb;
BEGIN
  IF v_key IS NOT NULL THEN
    SELECT * INTO v_order FROM orders WHERE idempotency_key = v_key;
    IF FOUND THEN
      RETURN jsonb_build_object(
        'order_id', v_order.id, 'order_number', v_order.order_number, 'status', v_order.status, 'total_inr', v_order.total_inr, 'repeat', true,
        'tickets', coalesce((SELECT jsonb_agg(jsonb_build_object('id', t.id, 'ticket_number', t.ticket_number, 'qr_token', t.qr_token,
                                                                 'qr_payload', t.qr_payload, 'qr_svg', t.qr_svg, 'participant_id', t.participant_id)
                                              ORDER BY length(t.ticket_number), t.ticket_number)
                              FROM tickets t WHERE t.order_id = v_order.id), '[]'::jsonb));
    END IF;
  END IF;

  -- Hold the seats first. One conditional update per category: it only succeeds while there is room, so two buyers cannot take the last seat.
  FOR v_cat IN
    SELECT (t ->> 'category_id')::uuid AS category_id, count(*)::int AS n
    FROM jsonb_array_elements(p -> 'tickets') t GROUP BY 1
  LOOP
    UPDATE event_categories
       SET slots_taken = coalesce(slots_taken, 0) + v_cat.n
     WHERE id = v_cat.category_id AND event_id = v_event
       AND (capacity IS NULL OR coalesce(slots_taken, 0) + v_cat.n <= capacity);
    IF NOT FOUND THEN
      IF EXISTS (SELECT 1 FROM event_categories WHERE id = v_cat.category_id AND event_id = v_event) THEN
        RAISE EXCEPTION 'SOLD_OUT:%', v_cat.category_id USING ERRCODE = 'P0001';
      END IF;
      RAISE EXCEPTION 'BAD_CATEGORY:%', v_cat.category_id USING ERRCODE = 'P0001';
    END IF;
  END LOOP;

  INSERT INTO orders (user_id, order_kind, status, subtotal_inr, tax_inr, fee_inr, discount_inr, total_inr, coupon_code,
                      event_context_id, buyer_name, buyer_email, buyer_phone, idempotency_key)
  VALUES (v_user, 'tickets', 'pending_payment',
          (p #>> '{order,subtotal_inr}')::int, coalesce((p #>> '{order,tax_inr}')::int, 0), coalesce((p #>> '{order,fee_inr}')::int, 0),
          coalesce((p #>> '{order,discount_inr}')::int, 0), (p #>> '{order,total_inr}')::int, nullif(p #>> '{order,coupon_code}', ''),
          v_event, p #>> '{buyer,name}', lower(p #>> '{buyer,email}'), p #>> '{buyer,phone}', v_key)
  RETURNING * INTO v_order;

  FOR v_t IN SELECT * FROM jsonb_array_elements(p -> 'tickets') LOOP
    v_seat := v_seat + 1;

    INSERT INTO participants (event_id, user_id, full_name, email, phone, gender, birth_date)
    VALUES (v_event, nullif(v_t #>> '{participant,user_id}', '')::uuid, btrim(v_t #>> '{participant,full_name}'),
            lower(nullif(v_t #>> '{participant,email}', '')), nullif(v_t #>> '{participant,phone}', ''),
            nullif(v_t #>> '{participant,gender}', ''), nullif(v_t #>> '{participant,birth_date}', '')::date)
    RETURNING id INTO v_part;

    INSERT INTO tickets (order_id, event_id, category_id, price_tier_id, buyer_id, participant_id, price_inr, fee_inr, discount_inr,
                         status, ticket_number, qr_token, qr_payload, qr_svg)
    VALUES (v_order.id, v_event, (v_t ->> 'category_id')::uuid, nullif(v_t ->> 'price_tier_id', '')::uuid, v_user, v_part,
            (v_t ->> 'price_inr')::int, 0, 0, 'reserved',
            coalesce(nullif(v_t ->> 'ticket_number', ''), v_order.order_number || '-' || v_seat),   -- <order number>-<seat>, unique by construction
            v_t ->> 'qr_token', v_t ->> 'qr_payload', v_t ->> 'qr_svg')
    RETURNING id, ticket_number INTO v_ticket, v_tnum;

    FOR v_a IN SELECT * FROM jsonb_array_elements(coalesce(v_t -> 'answers', '[]'::jsonb)) LOOP
      INSERT INTO registration_answers (event_id, ticket_id, participant_id, field_id, field_key, field_label, field_type, value_text, value_json, is_sensitive)
      VALUES (v_event, v_ticket, v_part, nullif(v_a ->> 'field_id', '')::uuid, v_a ->> 'field_key', v_a ->> 'field_label', v_a ->> 'field_type',
              v_a ->> 'value_text', v_a -> 'value_json', coalesce((v_a ->> 'is_sensitive')::boolean, false));
    END LOOP;

    v_out := v_out || jsonb_build_object('id', v_ticket, 'ticket_number', v_tnum, 'qr_token', v_t ->> 'qr_token',
                                         'qr_payload', v_t ->> 'qr_payload', 'qr_svg', v_t ->> 'qr_svg', 'participant_id', v_part);
  END LOOP;

  RETURN jsonb_build_object('order_id', v_order.id, 'order_number', v_order.order_number, 'status', v_order.status,
                            'total_inr', v_order.total_inr, 'repeat', false, 'tickets', v_out);
END;
$$;

-- ---------------------------------------------------------------------------
-- 7. search_participants(event, query): find anyone by name, email, mobile (any format, last 10 digits), ticket number, bib or order number
-- ---------------------------------------------------------------------------
-- "Contains" matching through the one trigram index on participants.search_text, scoped to the event inside the same index. Exact lookups
-- (ticket number, bib, QR token) go through their unique indexes. The query is escaped, so % and _ are matched literally.
CREATE OR REPLACE FUNCTION search_participants(p_event uuid, p_query text, p_limit integer DEFAULT 25)
RETURNS TABLE (ticket_id uuid, ticket_number text, bib_number text, status ticket_status, category_id uuid, participant_id uuid,
               full_name text, email text, phone text, order_number text, score real)
LANGUAGE sql STABLE
SET search_path = public, extensions
AS $$
  WITH q AS (
    SELECT lower(btrim(p_query)) AS t,
           replace(replace(replace(lower(btrim(p_query)), '\', '\\'), '%', '\%'), '_', '\_') AS esc,
           right(regexp_replace(p_query, '\D', '', 'g'), 10) AS digits
  )
  SELECT t.id, t.ticket_number, t.bib_number, t.status, t.category_id, p.id, p.full_name, p.email, p.phone, o.order_number,
         similarity(p.search_text, q.t) AS score
  FROM q
  JOIN participants p ON p.event_id = p_event
  JOIN tickets t      ON t.participant_id = p.id AND t.event_id = p.event_id
  JOIN orders o       ON o.id = t.order_id
  WHERE length(q.t) >= 2
    AND (p.search_text LIKE '%' || q.esc || '%'
         OR (length(q.digits) >= 6 AND p.phone_norm = q.digits)
         OR t.ticket_number = upper(btrim(p_query))
         OR t.bib_number = btrim(p_query)
         OR t.qr_token = btrim(p_query))
  ORDER BY score DESC, p.full_name
  LIMIT least(greatest(p_limit, 1), 100);
$$;

-- The backend calls both with the service role. Nobody else may: they read personal data.
REVOKE ALL ON FUNCTION create_registration(jsonb)               FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION search_participants(uuid, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION create_registration(jsonb)               TO service_role;
GRANT EXECUTE ON FUNCTION search_participants(uuid, text, integer) TO service_role;

INSERT INTO supabase_migrations.schema_migrations (version, name) VALUES ('20261112000027', 'registrations') ON CONFLICT DO NOTHING;
