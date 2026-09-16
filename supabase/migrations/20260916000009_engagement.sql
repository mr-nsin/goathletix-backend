-- 0009 — Engagement: save, show interest, participate, follow, and share a season.
--
-- Run after 0008.
--
-- WHY THE OLD SHAPE DOES NOT WORK
--   user_calendars is a bare bookmark with no state, so there is nowhere to record "I'm going",
--   let alone "I ran this". follows is polymorphic-by-columns: a target_type enum plus two
--   nullable FKs plus a CHECK, so adding clubs means a new enum value, a new column, a rewritten
--   CHECK and a new unique constraint -- then all of it again for training centers, then venues.
--
-- WHAT REPLACES IT
--   event_interests   one row per (user, event) with an evolving STATUS. Saving is a status, not
--                     a separate table: saved -> interested -> going -> attended.
--   follows           rewritten polymorphic on (target_type, target_id). Follow is a uniform,
--                     low-value relation across many entity types, so one row shape stops the
--                     table changing every time an entity type is added.
--   event_results     finish time, position, bib. Requirement #23 (Past Events Archive) and #21
--                     (Instagram share templates): a season poster with no finish time is a
--                     placeholder, not a keepsake.
--   shared_calendars  requirement #49 Buddy Sync, "share custom links with friends to align
--                     calendars" -- Sprint 3, P0. A share needs a token that is not the user id.
--
-- Idempotent and transactional. Existing user_calendars rows are migrated, not dropped.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. event_interests
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interest_status') THEN
    CREATE TYPE interest_status AS ENUM (
      'saved',      -- bookmarked for later (what user_calendars meant)
      'interested', -- soft intent, the default "show interest" action
      'going',      -- committed; drives reminders and the upcoming view
      'attended',   -- past participation; drives the archive and the season poster
      'skipped'     -- explicitly dismissed; keeps it out of recommendations
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS event_interests (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  event_id   uuid NOT NULL REFERENCES events (id)   ON DELETE CASCADE,
  status     interest_status NOT NULL DEFAULT 'saved',
  -- Private note: "book train tickets", "goal sub-2h".
  note       text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- One relationship per user per event. The status evolves; it does not accumulate rows.
  CONSTRAINT unique_user_event_interest UNIQUE (user_id, event_id)
);

COMMENT ON TABLE event_interests IS
  'A user''s relationship with an event. Saving and showing interest are statuses of one '
  'relationship, not separate tables. Supersedes user_calendars.';

CREATE INDEX IF NOT EXISTS idx_event_interests_user   ON event_interests (user_id, status);
CREATE INDEX IF NOT EXISTS idx_event_interests_event  ON event_interests (event_id, status);

DROP TRIGGER IF EXISTS update_event_interests_modtime ON event_interests;
CREATE TRIGGER update_event_interests_modtime BEFORE UPDATE ON event_interests
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Migrate existing bookmarks. Nothing in src/ reads user_calendars yet, but the rows are real.
INSERT INTO event_interests (user_id, event_id, status, created_at)
SELECT uc.user_id, uc.event_id, 'saved'::interest_status, uc.created_at
FROM user_calendars uc
ON CONFLICT (user_id, event_id) DO NOTHING;

-- user_calendars is kept, not dropped: it is the rollback path until the API cuts over.
COMMENT ON TABLE user_calendars IS
  'DEPRECATED 2026-09-16 -- superseded by event_interests (status=saved). Retained as a rollback '
  'path; drop once the API no longer references it.';

-- Denormalised social-proof counter on events (added in 0007).
CREATE OR REPLACE FUNCTION refresh_event_interest_count()
RETURNS TRIGGER AS $$
DECLARE
  target uuid := COALESCE(NEW.event_id, OLD.event_id);
BEGIN
  UPDATE events
  SET interest_count = (
    SELECT count(*) FROM event_interests
    WHERE event_id = target AND status IN ('saved', 'interested', 'going', 'attended')
  )
  WHERE id = target;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS refresh_event_interest_count_trg ON event_interests;
CREATE TRIGGER refresh_event_interest_count_trg
  AFTER INSERT OR UPDATE OF status OR DELETE ON event_interests
  FOR EACH ROW EXECUTE FUNCTION refresh_event_interest_count();

-- ---------------------------------------------------------------------------
-- 2. event_results -- what makes a past event worth showing
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS event_results (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  event_id       uuid NOT NULL REFERENCES events (id)   ON DELETE CASCADE,

  -- Which leg was entered: '21K', 'U12 100m', 'Sprint'. Free text because it spans every sport.
  category_entered text,
  bib_number     text,
  finish_time    interval,       -- 01:52:30
  position_overall integer,
  position_category integer,
  is_personal_best boolean NOT NULL DEFAULT false,
  -- Self-reported until an official results feed exists. Never present these as verified.
  is_verified    boolean NOT NULL DEFAULT false,
  notes          text,

  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Uniqueness uses coalesce rather than a table constraint: category_entered is nullable, and in
-- Postgres NULLs are distinct, so a plain UNIQUE (user_id, event_id, category_entered) would
-- happily allow unlimited duplicate rows for the common case where no category was entered.
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_event_result
  ON event_results (user_id, event_id, coalesce(category_entered, ''));

COMMENT ON TABLE event_results IS
  'Self-reported participation results. Feeds the past-events archive (#23) and the shareable '
  'season poster (#21). is_verified stays false until an official results feed exists.';

CREATE INDEX IF NOT EXISTS idx_event_results_user ON event_results (user_id);

DROP TRIGGER IF EXISTS update_event_results_modtime ON event_results;
CREATE TRIGGER update_event_results_modtime BEFORE UPDATE ON event_results
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ---------------------------------------------------------------------------
-- 3. follows -- rewritten polymorphic
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'follow_entity') THEN
    CREATE TYPE follow_entity AS ENUM ('event', 'organizer', 'club', 'training_center', 'user');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS entity_follows (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  target_type follow_entity NOT NULL,
  -- No FK: the target spans five tables. Integrity is enforced by the application and by the
  -- cleanup trigger below, which is the accepted trade for a table that never changes shape.
  target_id   uuid NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT unique_entity_follow UNIQUE (user_id, target_type, target_id)
);

COMMENT ON TABLE entity_follows IS
  'Polymorphic follow. Replaces follows, whose two-nullable-FK shape required a schema change '
  'for every new followable type.';

CREATE INDEX IF NOT EXISTS idx_entity_follows_user   ON entity_follows (user_id, target_type);
CREATE INDEX IF NOT EXISTS idx_entity_follows_target ON entity_follows (target_type, target_id);

-- Migrate the old rows.
INSERT INTO entity_follows (user_id, target_type, target_id, created_at)
SELECT f.user_id, 'organizer'::follow_entity, f.organizer_id, f.created_at
FROM follows f WHERE f.organizer_id IS NOT NULL
ON CONFLICT (user_id, target_type, target_id) DO NOTHING;

INSERT INTO entity_follows (user_id, target_type, target_id, created_at)
SELECT f.user_id, 'event'::follow_entity, f.event_id, f.created_at
FROM follows f WHERE f.event_id IS NOT NULL
ON CONFLICT (user_id, target_type, target_id) DO NOTHING;

COMMENT ON TABLE follows IS
  'DEPRECATED 2026-09-16 -- superseded by entity_follows. Retained as a rollback path.';

-- Without an FK, deleting a target would leave orphan follows. These keep it clean.
CREATE OR REPLACE FUNCTION cleanup_entity_follows()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM entity_follows
  WHERE target_type = TG_ARGV[0]::follow_entity AND target_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS cleanup_follows_events ON events;
CREATE TRIGGER cleanup_follows_events AFTER DELETE ON events
  FOR EACH ROW EXECUTE FUNCTION cleanup_entity_follows('event');

DROP TRIGGER IF EXISTS cleanup_follows_organizers ON organizers;
CREATE TRIGGER cleanup_follows_organizers AFTER DELETE ON organizers
  FOR EACH ROW EXECUTE FUNCTION cleanup_entity_follows('organizer');

DROP TRIGGER IF EXISTS cleanup_follows_clubs ON clubs;
CREATE TRIGGER cleanup_follows_clubs AFTER DELETE ON clubs
  FOR EACH ROW EXECUTE FUNCTION cleanup_entity_follows('club');

-- ---------------------------------------------------------------------------
-- 4. shared_calendars -- Buddy Sync (#49) and the season poster (#21)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS shared_calendars (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  -- Opaque token, not the user id: a share link must not expose the account, and it must be
  -- revocable by deleting the row without affecting the user.
  share_token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(12), 'hex'),
  title       text NOT NULL DEFAULT 'My season',
  -- Which statuses the share exposes. Defaults to the two that make a season: going + attended.
  included_statuses interest_status[] NOT NULL DEFAULT '{going,attended}',
  season_year integer,
  is_public   boolean NOT NULL DEFAULT true,
  view_count  integer NOT NULL DEFAULT 0,
  expires_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE shared_calendars IS
  'A revocable public view of a user''s season, addressed by share_token. Backs Buddy Sync (#49) '
  'and the shareable poster (#21). The poster image itself is rendered by the app, not stored.';

CREATE INDEX IF NOT EXISTS idx_shared_calendars_user ON shared_calendars (user_id);

DROP TRIGGER IF EXISTS update_shared_calendars_modtime ON shared_calendars;
CREATE TRIGGER update_shared_calendars_modtime BEFORE UPDATE ON shared_calendars
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

COMMIT;

-- Verify:
--   SELECT status, count(*) FROM event_interests GROUP BY 1;
--   SELECT target_type, count(*) FROM entity_follows GROUP BY 1;
--   SELECT count(*) FROM user_calendars;  -- should equal the migrated 'saved' rows
