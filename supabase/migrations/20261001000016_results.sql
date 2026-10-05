-- 0016 · Official results and claim-your-result.
--
-- Requirements: #23 past events archive, #53 official event results, #54 claim your result.
--
-- Spec §4b: official entries must NOT go into event_results. That table is user-owned and RLS-scoped to
-- auth.uid() (self-reported diary); official entries are public, unowned and arrive in bulk from a timing
-- partner. Two ownership models, two tables.
--
-- Phase 1 (cheap, ship first): events.results_url + results_status -> a "Results →" link out.
-- Phase 3: event_result_entries filled by ingestion; Phase 4: result_claims.
-- Idempotent and transactional.

BEGIN;

DO $$ BEGIN
  CREATE TYPE results_status AS ENUM ('none', 'announced', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE finish_status AS ENUM ('finished', 'dnf', 'dns', 'dq');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- 1. Phase 1 — link out to wherever the results live today
-- ---------------------------------------------------------------------------

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS results_url          text,
  ADD COLUMN IF NOT EXISTS results_status       results_status NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS results_published_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_events_results_published
  ON events (results_published_at DESC) WHERE results_status = 'published';

-- ---------------------------------------------------------------------------
-- 2. Official finisher list
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS event_result_entries (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id          uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  category_id       uuid REFERENCES event_categories (id) ON DELETE SET NULL,
  category_label    text,                     -- as printed by the timing partner: '21.1K Men 35-39'
  bib               text,
  athlete_name      text NOT NULL,
  gender            text CHECK (gender IN ('female', 'male', 'other')),
  age_group         text,
  club_name         text,
  city              text,
  finish_status     finish_status NOT NULL DEFAULT 'finished',
  gun_time          interval,
  chip_time         interval,
  position_overall  integer CHECK (position_overall > 0),
  position_gender   integer CHECK (position_gender > 0),
  position_category integer CHECK (position_category > 0),
  -- Provenance: 'timing_partner:<name>', 'organiser_upload', 'manual'. Never present a row as official
  -- unless it came from the organiser or their timing partner.
  source            text NOT NULL,
  -- md5 of the normalised source row. NOT NULL on purpose: NULLs are distinct in a UNIQUE constraint,
  -- so a nullable hash would let re-imports duplicate every row.
  source_row_hash   text NOT NULL,
  -- Right-to-be-forgotten requests hide a row without breaking positions (DPDP Act 2023).
  is_hidden         boolean NOT NULL DEFAULT false,
  claimed_by        uuid REFERENCES profiles (id) ON DELETE SET NULL,
  claimed_at        timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, source, source_row_hash)
);

CREATE INDEX IF NOT EXISTS idx_result_entries_rank ON event_result_entries (event_id, position_overall);
CREATE INDEX IF NOT EXISTS idx_result_entries_bib  ON event_result_entries (event_id, bib);
-- Prefix search by name within an event ("ana" -> "Anand"). For cross-event fuzzy search add pg_trgm later.
CREATE INDEX IF NOT EXISTS idx_result_entries_name
  ON event_result_entries (event_id, lower(athlete_name) text_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_result_entries_claimed
  ON event_result_entries (claimed_by) WHERE claimed_by IS NOT NULL;

ALTER TABLE event_result_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Official results are publicly readable" ON event_result_entries;
CREATE POLICY "Official results are publicly readable"
  ON event_result_entries FOR SELECT USING (NOT is_hidden);
-- Writes: ingestion / backend (service role) only.

-- ---------------------------------------------------------------------------
-- 3. Claim your result (#54). Approval (by staff or an automated bib + name match) sets
--    event_result_entries.claimed_by; the backend may then copy it into event_results.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS result_claims (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id      uuid NOT NULL REFERENCES event_result_entries (id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  status        request_status NOT NULL DEFAULT 'pending',
  evidence_note text,
  reviewed_by   uuid REFERENCES profiles (id) ON DELETE SET NULL,
  reviewed_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (entry_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_result_claims_pending ON result_claims (created_at) WHERE status = 'pending';

ALTER TABLE result_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read their own claims" ON result_claims;
CREATE POLICY "Users read their own claims"
  ON result_claims FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'moderator'));

DROP POLICY IF EXISTS "Users file their own claims" ON result_claims;
CREATE POLICY "Users file their own claims"
  ON result_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

DROP POLICY IF EXISTS "Users withdraw pending claims" ON result_claims;
CREATE POLICY "Users withdraw pending claims"
  ON result_claims FOR DELETE
  USING (auth.uid() = user_id AND status = 'pending');

COMMIT;
