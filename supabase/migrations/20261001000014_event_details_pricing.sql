-- 0014 · Event detail fields, calibre, featured ordering, numeric prices, race categories and
--        early-bird price tiers, taxonomy display order and imagery.
--
-- Requirements: #3 filter by distance/price, #6 detail page (start time, course map), #27 difficulty,
-- #51 altitude, #55 featured ordering, spec §2b calibre (certified / chip-timed / ranking), spec §4b
-- card ("From ₹X", start time), event-platform research (price per distance, "price rises in N days").
--
-- Featured events reuse the existing is_popular flag (GA-020 decision) — this adds rank and expiry only.
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
-- 1. Event-level columns
-- ---------------------------------------------------------------------------

ALTER TABLE events
  -- The card shows "⏰ 5:30 AM"; there was nowhere to store it.
  ADD COLUMN IF NOT EXISTS start_time         time,
  ADD COLUMN IF NOT EXISTS timezone           text    NOT NULL DEFAULT 'Asia/Kolkata',
  -- Calibre: the axis a competing athlete decides on (spec §2b).
  ADD COLUMN IF NOT EXISTS is_certified       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS certifying_body    text
    CHECK (certifying_body IN ('AIMS', 'World Athletics', 'AFI', 'state_association', 'national_federation', 'other')),
  ADD COLUMN IF NOT EXISTS is_chip_timed      boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS counts_for_ranking boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS timing_partner     text,
  -- Featured = is_popular (existing). Rank orders the banner; until expires it automatically.
  ADD COLUMN IF NOT EXISTS featured_rank      integer,
  ADD COLUMN IF NOT EXISTS featured_until     date,
  -- Numeric price bounds parsed from price_range, so "Under ₹500" and "From ₹X" are queryable.
  ADD COLUMN IF NOT EXISTS price_min_inr      integer CHECK (price_min_inr >= 0),
  ADD COLUMN IF NOT EXISTS price_max_inr      integer CHECK (price_max_inr >= 0),
  ADD COLUMN IF NOT EXISTS altitude_m         integer,
  ADD COLUMN IF NOT EXISTS course_map_url     text,
  -- Review aggregates, maintained by the trigger in 0017.
  ADD COLUMN IF NOT EXISTS rating_avg         numeric(2,1),
  ADD COLUMN IF NOT EXISTS rating_count       integer NOT NULL DEFAULT 0;

-- price_range is free text ("₹800 - ₹2000", "₹1,200", "Free"). Take every number in it; lowest is the
-- floor, highest the ceiling. Only fills rows not yet parsed, so re-running is a no-op.
WITH nums AS (
  SELECT e.id, replace(m[1], ',', '')::integer AS n
  FROM events e
  -- At most 8 characters ("1,00,000"): a longer digit run would overflow integer and abort the file.
  CROSS JOIN LATERAL regexp_matches(e.price_range, '([0-9][0-9,]{0,7})', 'g') AS m
  WHERE e.price_range IS NOT NULL AND e.price_min_inr IS NULL
),
agg AS (
  SELECT id, min(n) AS lo, max(n) AS hi FROM nums GROUP BY id
)
UPDATE events e
SET price_min_inr = agg.lo, price_max_inr = agg.hi
FROM agg
WHERE e.id = agg.id;

UPDATE events
SET price_min_inr = 0, price_max_inr = 0
WHERE price_min_inr IS NULL AND price_range ~* '^\s*free\s*$';

CREATE INDEX IF NOT EXISTS idx_events_price_min ON events (price_min_inr);
CREATE INDEX IF NOT EXISTS idx_events_featured  ON events (featured_rank) WHERE is_popular;
CREATE INDEX IF NOT EXISTS idx_events_certified ON events (start_date) WHERE is_certified;

-- ---------------------------------------------------------------------------
-- 2. Race categories — one row per distance / age group / weight class an event offers.
--    distance_options (text[]) stays for back-compat and ingestion; this is the structured form.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS event_categories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  label           text NOT NULL,                       -- '21.1K', 'U12 100m', 'Kumite -45kg'
  discipline_slug text REFERENCES disciplines (slug) ON DELETE SET NULL,
  distance_km     numeric(7,3) CHECK (distance_km > 0),
  age_categories  age_category[] NOT NULL DEFAULT '{}',
  gender          text NOT NULL DEFAULT 'open' CHECK (gender IN ('open', 'female', 'male', 'mixed')),
  start_time      time,
  cutoff_minutes  integer CHECK (cutoff_minutes > 0),
  capacity        integer CHECK (capacity > 0),
  slots_taken     integer CHECK (slots_taken >= 0),
  price_inr       integer CHECK (price_inr >= 0),      -- current price; history lives in tiers
  is_sold_out     boolean NOT NULL DEFAULT false,
  sort_order      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, label)
);

CREATE INDEX IF NOT EXISTS idx_event_categories_event      ON event_categories (event_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_event_categories_discipline ON event_categories (discipline_slug);

DROP TRIGGER IF EXISTS update_event_categories_modtime ON event_categories;
CREATE TRIGGER update_event_categories_modtime
  BEFORE UPDATE ON event_categories FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Early-bird / regular / late pricing per category. Drives "Price rises in 3 days".
CREATE TABLE IF NOT EXISTS event_price_tiers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES event_categories (id) ON DELETE CASCADE,
  label       text    NOT NULL,                        -- 'Early bird', 'Regular', 'Late'
  price_inr   integer NOT NULL CHECK (price_inr >= 0),
  valid_from  date,
  valid_until date,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (valid_from IS NULL OR valid_until IS NULL OR valid_until >= valid_from)
);

CREATE INDEX IF NOT EXISTS idx_event_price_tiers_category ON event_price_tiers (category_id, valid_from);

ALTER TABLE event_categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_price_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Event categories are publicly readable" ON event_categories;
CREATE POLICY "Event categories are publicly readable" ON event_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Price tiers are publicly readable" ON event_price_tiers;
CREATE POLICY "Price tiers are publicly readable" ON event_price_tiers FOR SELECT USING (true);
-- Writes: backend (service role) and ingestion only.

-- ---------------------------------------------------------------------------
-- 3. Taxonomy presentation. Spec §6: athletics chips led with field events because the API sorted
--    alphabetically. Curation, not an algorithm: an explicit display order.
-- ---------------------------------------------------------------------------

ALTER TABLE disciplines
  ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS is_featured   boolean NOT NULL DEFAULT false;

UPDATE disciplines d
SET display_order = v.ord, is_featured = v.ord <= 30
FROM (VALUES
  ('sprints', 10), ('relays', 20), ('middle_distance', 30), ('long_distance_track', 40),
  ('hurdles', 50), ('long_jump', 60), ('high_jump', 70), ('triple_jump', 80),
  ('shot_put', 90), ('discus_throw', 91), ('javelin_throw', 92), ('hammer_throw', 93),
  ('pole_vault', 94), ('steeplechase', 95), ('race_walking', 96), ('cross_country', 97),
  ('combined_events', 98)
) AS v (slug, ord)
WHERE d.slug = v.slug AND d.display_order = 100;

CREATE INDEX IF NOT EXISTS idx_disciplines_order ON disciplines (sport_type, display_order);

-- ADR-005 (imagery): somewhere for a real sport image and a short blurb for sport landing pages (#5).
ALTER TABLE sports
  ADD COLUMN IF NOT EXISTS hero_image_url text,
  ADD COLUMN IF NOT EXISTS icon           text,
  ADD COLUMN IF NOT EXISTS description    text;

COMMIT;
