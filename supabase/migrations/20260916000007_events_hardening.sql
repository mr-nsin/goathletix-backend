-- 0007 — Events: the columns a discovery product cannot work without, plus recurrence.
--
-- Run after 0006.
--
-- WHAT THIS FIXES
--   1. events has NO description and NO slug. event_requests has a description; events never got
--      one. A discovery product cannot render a detail page or an SEO URL without both.
--   2. No recurrence model. A club's weekly Tuesday run and a trek's 12 batch departures both
--      break start_date/end_date. ADR-006 deferred this; clubs make it unavoidable.
--   3. Organiser and discipline search are impossible. PostgREST cannot reference an embedded
--      column inside or() (PGRST100), so `search` can never match organizer.name today.
--
-- RECURRENCE: SERIES, NOT OCCURRENCES (decision A)
--   A weekly club run is N event rows sharing a series_id; a trek with 12 departures is 12 rows
--   sharing a series_id. The alternative — splitting events into template + occurrences — is
--   cleaner on paper but would rewrite every query, the API envelope and the frontend normalizer,
--   and all 10,100 existing rows. Series keeps every date filter, rail and card working unchanged.
--
-- Idempotent and transactional.

BEGIN;

-- Guard: update_modified_column() is declared in migration 0000, but the live database was not
-- provisioned from that file -- it is missing there (2026-09-16). Recreated here, identical to
-- 0000, so each migration stands on its own. CREATE OR REPLACE is idempotent.
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $upd$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$upd$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. event_series — the recurring parent. Nullable on events: a one-off race has no series.
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'recurrence_kind') THEN
    CREATE TYPE recurrence_kind AS ENUM (
      'none',      -- a one-off that still groups (e.g. annual editions of one race)
      'weekly',    -- club meetups
      'monthly',
      'seasonal',  -- trek departures clustered in a season
      'annual'     -- the 2026 / 2027 / 2028 editions of the same marathon
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS event_series (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text UNIQUE,
  description   text,
  sport_type    sport_category NOT NULL REFERENCES sports (slug),
  recurrence    recurrence_kind NOT NULL DEFAULT 'none',
  -- Human-readable rule ("Every Tuesday 6am"); deliberately not an RRULE parser. Occurrence
  -- rows are generated ahead of time, so nothing needs to evaluate this at query time.
  recurrence_note text,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE event_series IS
  'Groups recurring occurrences: club weekly runs, trek batch departures, annual race editions. '
  'Each occurrence is its own events row carrying its own dates.';

DROP TRIGGER IF EXISTS update_event_series_modtime ON event_series;
CREATE TRIGGER update_event_series_modtime BEFORE UPDATE ON event_series
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ---------------------------------------------------------------------------
-- 2. The missing event columns
-- ---------------------------------------------------------------------------

ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS description     text,
  ADD COLUMN IF NOT EXISTS slug            text,
  ADD COLUMN IF NOT EXISTS series_id       uuid REFERENCES event_series (id) ON DELETE SET NULL,
  -- Denormalised so PostgREST can match it inside or(). Kept in step by the trigger below;
  -- organizer_id remains the source of truth.
  ADD COLUMN IF NOT EXISTS organizer_name  text,
  -- Registration window: "Closing soon" is a homepage rail and there is nothing to derive it from.
  ADD COLUMN IF NOT EXISTS registration_opens_at  timestamptz,
  ADD COLUMN IF NOT EXISTS registration_closes_at timestamptz,
  -- Counters for social proof and organiser analytics (feature #31). Updated by the app.
  ADD COLUMN IF NOT EXISTS interest_count  integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS view_count      integer NOT NULL DEFAULT 0;

-- Backfill the denormalised organiser name for existing rows.
UPDATE events e
SET organizer_name = o.name
FROM organizers o
WHERE e.organizer_id = o.id AND e.organizer_name IS DISTINCT FROM o.name;

-- Keep it in step on write. A separate trigger on organizers handles renames.
CREATE OR REPLACE FUNCTION sync_event_organizer_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.organizer_id IS NULL THEN
    NEW.organizer_name := NULL;
  ELSE
    SELECT name INTO NEW.organizer_name FROM organizers WHERE id = NEW.organizer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS sync_event_organizer_name_trg ON events;
CREATE TRIGGER sync_event_organizer_name_trg
  BEFORE INSERT OR UPDATE OF organizer_id ON events
  FOR EACH ROW EXECUTE FUNCTION sync_event_organizer_name();

CREATE OR REPLACE FUNCTION propagate_organizer_rename()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.name IS DISTINCT FROM OLD.name THEN
    UPDATE events SET organizer_name = NEW.name WHERE organizer_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS propagate_organizer_rename_trg ON organizers;
CREATE TRIGGER propagate_organizer_rename_trg
  AFTER UPDATE OF name ON organizers
  FOR EACH ROW EXECUTE FUNCTION propagate_organizer_rename();

-- ---------------------------------------------------------------------------
-- 3. Slugs — unique, SEO-shaped, derived once from name + city + year.
--    Collisions get the id suffix rather than failing the migration.
-- ---------------------------------------------------------------------------

UPDATE events SET slug = NULL WHERE slug = '';

WITH candidate AS (
  SELECT
    id,
    regexp_replace(
      lower(trim(event_name || '-' || city || '-' || extract(year FROM start_date)::text)),
      '[^a-z0-9]+', '-', 'g'
    ) AS base
  FROM events
  WHERE slug IS NULL
),
numbered AS (
  SELECT id, trim(both '-' from base) AS base,
         row_number() OVER (PARTITION BY base ORDER BY id) AS rn
  FROM candidate
)
UPDATE events e
SET slug = CASE WHEN n.rn = 1 THEN n.base
                ELSE n.base || '-' || left(e.id::text, 8) END
FROM numbered n
WHERE e.id = n.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_events_slug ON events (slug) WHERE slug IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 4. Full-text search — fixes organiser and discipline search in one move.
--    A generated column cannot be immutable over a join, so organizer_name is denormalised
--    above precisely so it can participate here.
-- ---------------------------------------------------------------------------

ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(event_name, '')),      'A') ||
    setweight(to_tsvector('simple', coalesce(organizer_name, '')),  'B') ||
    setweight(to_tsvector('simple', coalesce(city, '')),            'B') ||
    setweight(to_tsvector('simple', coalesce(state, '')),           'C') ||
    setweight(to_tsvector('simple', coalesce(venue, '')),           'C')
  ) STORED;
-- discipline_slugs is deliberately NOT in this expression: array_to_string is STABLE, not
-- IMMUTABLE, and a generated column requires immutability -- including it makes the migration
-- fail outright. Discipline search is served by idx_events_discipline_slugs (GIN) with the
-- overlap operator && instead, which is the better index for it anyway.

CREATE INDEX IF NOT EXISTS idx_events_search_vector ON events USING GIN (search_vector);

CREATE INDEX IF NOT EXISTS idx_events_series        ON events (series_id) WHERE series_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_reg_closes    ON events (registration_closes_at)
  WHERE registration_closes_at IS NOT NULL;

COMMIT;

-- Verify:
--   SELECT count(*) FROM events WHERE slug IS NULL;           -- 0
--   SELECT count(*) FROM events WHERE organizer_name IS NULL; -- only events with no organizer
--   SELECT event_name FROM events WHERE search_vector @@ plainto_tsquery('simple','mumbai') LIMIT 5;
