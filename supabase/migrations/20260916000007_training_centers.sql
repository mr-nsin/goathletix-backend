-- 0007 — training_centers: the academies/coaches directory (Services pillar).
--
-- Run after 0005 and 0006 (uses sport_category and age_category).
--
-- Kids' competitions imply training demand: a parent who finds a skating meet for a 10-year-old
-- needs the rink that coaches for it. This is the "Services" pillar entry in
-- docs/21-platform-expansion-vision.md section 4.4, and the lowest-ops one -- a directory uses the
-- same muscle as event discovery.
--
-- Idempotent and transactional.

BEGIN;

CREATE TABLE IF NOT EXISTS training_centers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text UNIQUE,
  description     text,

  -- A centre usually coaches several sports and several age groups.
  sport_types     sport_category[] NOT NULL DEFAULT '{}',
  age_categories  age_category[]   NOT NULL DEFAULT '{open}',

  city            text NOT NULL,
  state           text NOT NULL,
  address         text,
  -- PostGIS is already enabled (migration 0000). Nullable: most rows will be geocoded later.
  geo_location    geography(Point, 4326),

  contact_phone   text,
  contact_email   text,
  website_url     text,
  logo_url        text,

  -- Same trust model as organizers: a human-verified flag, never self-asserted.
  is_certified    boolean NOT NULL DEFAULT false,
  is_active       boolean NOT NULL DEFAULT true,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE training_centers IS
  'Academies, rinks, dojos and coaches. Powers "Training centers near you" and "Academies for <sport>".';

CREATE INDEX IF NOT EXISTS idx_training_centers_city       ON training_centers (city);
CREATE INDEX IF NOT EXISTS idx_training_centers_state      ON training_centers (state);
CREATE INDEX IF NOT EXISTS idx_training_centers_sports     ON training_centers USING GIN (sport_types);
CREATE INDEX IF NOT EXISTS idx_training_centers_ages       ON training_centers USING GIN (age_categories);
CREATE INDEX IF NOT EXISTS idx_training_centers_geo        ON training_centers USING GIST (geo_location);

DROP TRIGGER IF EXISTS update_training_centers_modtime ON training_centers;
CREATE TRIGGER update_training_centers_modtime
  BEFORE UPDATE ON training_centers
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- RLS: public read of active centres only; no anonymous writes.
ALTER TABLE training_centers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active training centers are publicly readable" ON training_centers;
CREATE POLICY "Active training centers are publicly readable"
  ON training_centers FOR SELECT USING (is_active = true);

COMMIT;

-- Verify:
--   SELECT count(*) FROM training_centers;
--   SELECT relrowsecurity FROM pg_class WHERE relname = 'training_centers';  -- expect t
