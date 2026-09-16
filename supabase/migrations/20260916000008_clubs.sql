-- 0008 — Clubs and communities (Pillar 3 foundation).
--
-- Run after 0007.
--
-- SCOPE, taken from docs/21-platform-expansion-vision.md section 4.2:
--   "Club/Community pages: profile, members, recurring meetups, upcoming events, join button."
--
-- Deliberately NOT built here: the WhatsApp CRM (broadcast lists, segments, message templates).
-- That is Phase 3 and depends on the WhatsApp Business Cloud API. Doc 21 section 6 states the rule
-- directly — "never show an empty pillar" — and the same applies to empty tables: they invite
-- half-built features and they age badly before the API contract is known.
--
-- Club-hosted runs go into `events` with club_id set, NOT into a parallel activities table.
-- A club run IS an event; a separate table would mean duplicating every filter, rail and card.
-- Recurring meetups use the event_series mechanism from 0007.
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

-- geography(Point,4326) below needs PostGIS; declared in 0000, guarded here for the same reason.
CREATE EXTENSION IF NOT EXISTS postgis;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'club_role') THEN
    CREATE TYPE club_role AS ENUM ('owner', 'admin', 'member');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_status') THEN
    -- 'pending' supports clubs that approve joins; 'left'/'removed' keep history rather than
    -- deleting rows, so member counts and activity remain auditable.
    CREATE TYPE membership_status AS ENUM ('pending', 'active', 'left', 'removed');
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- clubs
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS clubs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  slug           text UNIQUE NOT NULL,
  description    text,

  -- A club is usually multi-sport ("run + cycle"), so both taxonomy levels are arrays.
  sport_types    sport_category[] NOT NULL DEFAULT '{}',
  discipline_slugs text[]         NOT NULL DEFAULT '{}',
  -- Clubs with junior squads need to be findable by parents, same axis as events.
  age_categories age_category[]   NOT NULL DEFAULT '{open}',

  city           text NOT NULL,
  state          text NOT NULL,
  -- Where the club actually meets. PostGIS is enabled in 0000; nullable, geocoded later.
  meeting_point  text,
  geo_location   geography(Point, 4326),

  logo_url       text,
  cover_url      text,
  website_url    text,
  instagram_url  text,
  -- The join path most Indian clubs actually use. Never expose a personal number publicly
  -- without consent -- the API must gate this behind membership.
  whatsapp_invite_url text,
  contact_email  text,

  -- The creator. SET NULL rather than CASCADE: deleting a person must not delete their club.
  owner_id       uuid REFERENCES profiles (id) ON DELETE SET NULL,

  is_verified    boolean NOT NULL DEFAULT false,
  is_active      boolean NOT NULL DEFAULT true,
  -- Denormalised counter, maintained by trigger below. Reading count(*) per card does not scale.
  member_count   integer NOT NULL DEFAULT 0,

  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE clubs IS
  'Local run clubs and sports communities. Club-hosted events live in events.club_id; recurring '
  'meetups use event_series.';

CREATE INDEX IF NOT EXISTS idx_clubs_city        ON clubs (city);
CREATE INDEX IF NOT EXISTS idx_clubs_state       ON clubs (state);
CREATE INDEX IF NOT EXISTS idx_clubs_sports      ON clubs USING GIN (sport_types);
CREATE INDEX IF NOT EXISTS idx_clubs_disciplines ON clubs USING GIN (discipline_slugs);
CREATE INDEX IF NOT EXISTS idx_clubs_ages        ON clubs USING GIN (age_categories);
CREATE INDEX IF NOT EXISTS idx_clubs_geo         ON clubs USING GIST (geo_location);

DROP TRIGGER IF EXISTS update_clubs_modtime ON clubs;
CREATE TRIGGER update_clubs_modtime BEFORE UPDATE ON clubs
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ---------------------------------------------------------------------------
-- club_members
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS club_members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id    uuid NOT NULL REFERENCES clubs (id)    ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  role       club_role         NOT NULL DEFAULT 'member',
  status     membership_status NOT NULL DEFAULT 'active',
  joined_at  timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT unique_club_member UNIQUE (club_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_club_members_user ON club_members (user_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_club_members_club ON club_members (club_id) WHERE status = 'active';

DROP TRIGGER IF EXISTS update_club_members_modtime ON club_members;
CREATE TRIGGER update_club_members_modtime BEFORE UPDATE ON club_members
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Keep clubs.member_count accurate without a count(*) per card.
CREATE OR REPLACE FUNCTION refresh_club_member_count()
RETURNS TRIGGER AS $$
DECLARE
  target uuid := COALESCE(NEW.club_id, OLD.club_id);
BEGIN
  UPDATE clubs
  SET member_count = (
    SELECT count(*) FROM club_members WHERE club_id = target AND status = 'active'
  )
  WHERE id = target;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS refresh_club_member_count_trg ON club_members;
CREATE TRIGGER refresh_club_member_count_trg
  AFTER INSERT OR UPDATE OF status OR DELETE ON club_members
  FOR EACH ROW EXECUTE FUNCTION refresh_club_member_count();

-- ---------------------------------------------------------------------------
-- Link events to clubs. Both organizer_id and club_id are nullable and independent:
-- a club event may also have a commercial organiser, and most events have neither.
-- ---------------------------------------------------------------------------

ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS club_id uuid REFERENCES clubs (id) ON DELETE SET NULL,
  -- Club meetups are free and have no external registration page. registration_url is NOT NULL
  -- on events, so this flag lets the UI show "Join the club" instead of "Register".
  ADD COLUMN IF NOT EXISTS is_club_activity boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_events_club ON events (club_id) WHERE club_id IS NOT NULL;

ALTER TABLE IF EXISTS event_series
  ADD COLUMN IF NOT EXISTS club_id uuid REFERENCES clubs (id) ON DELETE CASCADE;

COMMIT;

-- Verify:
--   SELECT count(*) FROM clubs;
--   SELECT relrowsecurity FROM pg_class WHERE relname IN ('clubs','club_members'); -- set in 0011
