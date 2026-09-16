-- 0010 — training_centers: the academies, rinks, dojos and coaches directory.
--
-- Run after 0009.
--
-- Kids' competitions imply training demand: a parent who finds a skating meet for a 10-year-old
-- needs the rink that coaches for it. This is the Services pillar entry in
-- docs/21-platform-expansion-vision.md section 4.4, and the lowest-ops part of it -- a directory
-- uses the same muscle as event discovery.
--
-- Idempotent and transactional.

BEGIN;

CREATE TABLE IF NOT EXISTS training_centers (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  slug             text UNIQUE NOT NULL,
  description      text,

  -- Same two taxonomy levels as clubs, so "academies for badminton" works, not just "racquet".
  sport_types      sport_category[] NOT NULL DEFAULT '{}',
  discipline_slugs text[]           NOT NULL DEFAULT '{}',
  -- The axis that matters most here: parents filter by the age group they coach.
  age_categories   age_category[]   NOT NULL DEFAULT '{open}',

  city             text NOT NULL,
  state            text NOT NULL,
  address          text,
  geo_location     geography(Point, 4326),

  contact_phone    text,
  contact_email    text,
  website_url      text,
  logo_url         text,
  cover_url        text,

  -- Coaching is a trust purchase for a parent, so both flags are human-set, never self-asserted.
  is_certified     boolean NOT NULL DEFAULT false,
  is_verified      boolean NOT NULL DEFAULT false,
  is_active        boolean NOT NULL DEFAULT true,

  -- The claim path, mirroring organizers: a centre can be seeded by ingestion and claimed later.
  owner_id         uuid REFERENCES profiles (id) ON DELETE SET NULL,

  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE training_centers IS
  'Academies, rinks, dojos and coaches. Powers "Training centers near you" and '
  '"Academies for <sport>". Followable via entity_follows (target_type = training_center).';

CREATE INDEX IF NOT EXISTS idx_training_centers_city        ON training_centers (city);
CREATE INDEX IF NOT EXISTS idx_training_centers_state       ON training_centers (state);
CREATE INDEX IF NOT EXISTS idx_training_centers_sports      ON training_centers USING GIN (sport_types);
CREATE INDEX IF NOT EXISTS idx_training_centers_disciplines ON training_centers USING GIN (discipline_slugs);
CREATE INDEX IF NOT EXISTS idx_training_centers_ages        ON training_centers USING GIN (age_categories);
CREATE INDEX IF NOT EXISTS idx_training_centers_geo         ON training_centers USING GIST (geo_location);

DROP TRIGGER IF EXISTS update_training_centers_modtime ON training_centers;
CREATE TRIGGER update_training_centers_modtime BEFORE UPDATE ON training_centers
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Orphan cleanup for the FK-less follow table (see 0009).
DROP TRIGGER IF EXISTS cleanup_follows_training_centers ON training_centers;
CREATE TRIGGER cleanup_follows_training_centers AFTER DELETE ON training_centers
  FOR EACH ROW EXECUTE FUNCTION cleanup_entity_follows('training_center');

COMMIT;

-- Verify:
--   SELECT count(*) FROM training_centers;
