-- 0006 — The two taxonomy axes (ADR-006) plus the age-group axis.
--
-- RUN 0005 FIRST, IN A SEPARATE EXECUTION. This file USES the enum values 0005 adds, and Postgres
-- rejects that inside the same transaction as the ALTER TYPE.
--
-- Adds:
--   1. sport_family  + event_model enums      -- the two axes
--   2. sports lookup table                    -- axis values as DATA, not as code
--   3. age_category enum + events.age_categories  -- the "WHO" axis (kids .. masters)
--
-- Idempotent and transactional.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. The two axes
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sport_family') THEN
    CREATE TYPE sport_family AS ENUM (
      'athletics',       -- track & field, road running, cross-country, race walking
      'endurance',       -- cycling, triathlon, swimming, ultra
      'skill_artistic',  -- skating, gymnastics
      'combat',          -- karate, taekwondo, judo, boxing, wrestling, fencing
      'racquet',         -- badminton, TT, tennis, squash, pickleball
      'outdoor',         -- trekking, expeditions, camps, rallies, snow
      'fitness',         -- CrossFit, functional, yoga, expos
      'team',            -- cricket, hockey, football, basketball, kabaddi
      'mind'             -- chess and scholastic board circuits
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_model') THEN
    CREATE TYPE event_model AS ENUM (
      'mass_participation', -- everyone enters, ranked by time
      'meet',               -- multi-discipline, age-group heats
      'bracket',            -- knockout / tournament by age or weight category
      'batch_departure',    -- many departure dates (treks) -- NOT on the entry rails yet
      'non_competitive',    -- expos, festivals, fun runs
      'league_fixture'      -- team vs team; not an entry product, separate surface
    );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 2. sports lookup -- one row per sport_category value
--    `phase` drives ingestion + homepage ordering; `is_active` gates visibility.
--    Athletics is phase 1 -- this ordering IS the athletics-first positioning.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sports (
  slug          sport_category PRIMARY KEY,
  display_name  text         NOT NULL,
  family        sport_family NOT NULL,
  event_model   event_model  NOT NULL,
  phase         smallint     NOT NULL DEFAULT 9,
  is_active     boolean      NOT NULL DEFAULT false,
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now()
);

COMMENT ON TABLE sports IS
  'Sport taxonomy (ADR-006). Two axes: family = what kind of sport; event_model = how it is entered. '
  'Grouping and ordering are read from here, never hardcoded in application code.';

INSERT INTO sports (slug, display_name, family, event_model, phase, is_active) VALUES
  ('athletics',    'Athletics',      'athletics',      'meet',               1, true),
  ('running',      'Running',        'athletics',      'mass_participation', 1, true),
  ('cycling',      'Cycling',        'endurance',      'mass_participation', 2, true),
  ('triathlon',    'Triathlon',      'endurance',      'mass_participation', 3, true),
  ('water',        'Water Sports',   'endurance',      'mass_participation', 3, true),
  ('skating',      'Skating',        'skill_artistic', 'meet',               2, true),
  ('gymnastics',   'Gymnastics',     'skill_artistic', 'meet',               2, true),
  ('martial_arts', 'Martial Arts',   'combat',         'bracket',            2, true),
  ('racquet',      'Racquet Sports', 'racquet',        'bracket',            3, true),
  ('trekking',     'Trekking',       'outdoor',        'batch_departure',    3, true),
  ('adventure',    'Adventure',      'outdoor',        'mass_participation', 3, true),
  ('fitness',      'Fitness',        'fitness',        'non_competitive',    4, true),
  ('team_sports',  'Team Sports',    'team',           'league_fixture',     5, false),
  ('mind_sports',  'Mind Sports',    'mind',           'bracket',            5, false)
ON CONFLICT (slug) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  family       = EXCLUDED.family,
  event_model  = EXCLUDED.event_model,
  phase        = EXCLUDED.phase,
  updated_at   = now();
-- NB: is_active is deliberately NOT overwritten on conflict, so re-running this file
-- never silently re-enables a sport that was turned off on purpose.

DROP TRIGGER IF EXISTS update_sports_modtime ON sports;
CREATE TRIGGER update_sports_modtime
  BEFORE UPDATE ON sports
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE INDEX IF NOT EXISTS idx_sports_family_phase ON sports (family, phase);

-- ---------------------------------------------------------------------------
-- 3. The WHO axis -- age categories
--    An event usually spans several groups, so this is an ARRAY, not a scalar.
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'age_category') THEN
    CREATE TYPE age_category AS ENUM (
      'kids',        -- U8 / U10 / U12
      'sub_junior',
      'junior',
      'youth',
      'open',        -- adult / all ages
      'masters'      -- veterans
    );
  END IF;
END $$;

ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS age_categories age_category[] NOT NULL DEFAULT '{open}';

COMMENT ON COLUMN events.age_categories IS
  'The WHO eligibility axis. Existing rows default to {open}; ingestion must set this properly for '
  'age-group meets, which are the whole point of the youth scope.';

-- GIN supports the overlap operator (&&), which is how "events for kids OR juniors" is queried.
CREATE INDEX IF NOT EXISTS idx_events_age_categories ON events USING GIN (age_categories);

-- ---------------------------------------------------------------------------
-- 4. RLS -- sports is public reference data, readable by anyone, writable by no one.
--    A new table without a policy is a security regression (CLAUDE.md section 5).
-- ---------------------------------------------------------------------------

ALTER TABLE sports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sports are publicly readable" ON sports;
CREATE POLICY "Sports are publicly readable" ON sports FOR SELECT USING (true);

COMMIT;

-- Verify:
--   SELECT family, count(*), min(phase) FROM sports WHERE is_active GROUP BY family ORDER BY 3;
--   SELECT age_categories, count(*) FROM events GROUP BY 1;
