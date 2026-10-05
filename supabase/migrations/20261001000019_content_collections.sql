-- 0019 · Curated collections and composed chips, guides/articles, site announcements, challenges.
--
-- Requirements: #28 curated collections, #40 challenges, #48 content/blog, spec §2 composed chips
-- ("U12 Skating", "Certified 21K near me"), mockup announcement bar and "Train smarter" rail.
--
-- Editors (app_role 'editor', from 0013) manage all of it from an admin UI; the public reads only what is
-- published and inside its date window. Idempotent and transactional.

BEGIN;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $upd$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$upd$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. Collections. kind 'manual' = hand-picked events; kind 'rule' = a saved directory query, e.g.
--    {"sport":"running","disciplines":["half_marathon"],"certified":true,"radiusKm":100}.
--    A rule collection with show_as_chip = true is a homepage composed chip.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS collections (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text NOT NULL UNIQUE,
  title        text NOT NULL,
  subtitle     text,
  description  text,
  cover_url    text,
  kind         text NOT NULL DEFAULT 'manual' CHECK (kind IN ('manual', 'rule')),
  rule         jsonb,
  show_as_chip boolean NOT NULL DEFAULT false,
  chip_label   text,
  chip_emoji   text,
  sort_order   integer NOT NULL DEFAULT 100,
  is_published boolean NOT NULL DEFAULT false,
  starts_at    timestamptz,
  ends_at      timestamptz,
  created_by   uuid REFERENCES profiles (id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CHECK (kind <> 'rule' OR rule IS NOT NULL),
  CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS collection_events (
  collection_id uuid NOT NULL REFERENCES collections (id) ON DELETE CASCADE,
  event_id      uuid NOT NULL REFERENCES events (id)      ON DELETE CASCADE,
  position      integer NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_collections_live ON collections (sort_order) WHERE is_published;
CREATE INDEX IF NOT EXISTS idx_collection_events_order ON collection_events (collection_id, position);

DROP TRIGGER IF EXISTS update_collections_modtime ON collections;
CREATE TRIGGER update_collections_modtime
  BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_modified_column();

ALTER TABLE collections       ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Live collections are publicly readable" ON collections;
CREATE POLICY "Live collections are publicly readable"
  ON collections FOR SELECT
  USING ((is_published AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at > now()))
         OR has_role(auth.uid(), 'editor'));

DROP POLICY IF EXISTS "Editors manage collections" ON collections;
CREATE POLICY "Editors manage collections"
  ON collections FOR ALL
  USING (has_role(auth.uid(), 'editor')) WITH CHECK (has_role(auth.uid(), 'editor'));

DROP POLICY IF EXISTS "Collection events are publicly readable" ON collection_events;
CREATE POLICY "Collection events are publicly readable"
  ON collection_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM collections c WHERE c.id = collection_events.collection_id));

DROP POLICY IF EXISTS "Editors manage collection events" ON collection_events;
CREATE POLICY "Editors manage collection events"
  ON collection_events FOR ALL
  USING (has_role(auth.uid(), 'editor')) WITH CHECK (has_role(auth.uid(), 'editor'));

-- ---------------------------------------------------------------------------
-- 2. Articles — guides, race reports, checklists (#48, "Train smarter").
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS articles (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text NOT NULL UNIQUE,
  title            text NOT NULL,
  excerpt          text,
  body_md          text,
  cover_url        text,
  kind             text NOT NULL DEFAULT 'guide'
                   CHECK (kind IN ('guide', 'race_report', 'checklist', 'explainer', 'news')),
  sport_types      sport_category[] NOT NULL DEFAULT '{}',
  discipline_slugs text[]           NOT NULL DEFAULT '{}',
  age_categories   age_category[]   NOT NULL DEFAULT '{}',
  related_event_id uuid REFERENCES events (id) ON DELETE SET NULL,
  author_id        uuid REFERENCES profiles (id) ON DELETE SET NULL,
  author_name      text,
  read_minutes     smallint CHECK (read_minutes > 0),
  status           text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at     timestamptz,
  seo_title        text,
  seo_description  text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_published ON articles (published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_articles_sports    ON articles USING GIN (sport_types);

DROP TRIGGER IF EXISTS update_articles_modtime ON articles;
CREATE TRIGGER update_articles_modtime
  BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_modified_column();

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published articles are publicly readable" ON articles;
CREATE POLICY "Published articles are publicly readable"
  ON articles FOR SELECT
  USING ((status = 'published' AND published_at <= now()) OR has_role(auth.uid(), 'editor'));

DROP POLICY IF EXISTS "Editors manage articles" ON articles;
CREATE POLICY "Editors manage articles"
  ON articles FOR ALL
  USING (has_role(auth.uid(), 'editor')) WITH CHECK (has_role(auth.uid(), 'editor'));

-- ---------------------------------------------------------------------------
-- 3. Announcement bar — one live, time-boxed message at the top of every page.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS site_announcements (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message    text NOT NULL CHECK (char_length(message) <= 160),
  link_url   text,
  link_label text,
  event_id   uuid REFERENCES events (id) ON DELETE CASCADE,
  priority   integer NOT NULL DEFAULT 0,
  is_active  boolean NOT NULL DEFAULT true,
  starts_at  timestamptz NOT NULL DEFAULT now(),
  ends_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR ends_at > starts_at)
);

ALTER TABLE site_announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Live announcements are publicly readable" ON site_announcements;
CREATE POLICY "Live announcements are publicly readable"
  ON site_announcements FOR SELECT
  USING ((is_active AND starts_at <= now() AND (ends_at IS NULL OR ends_at > now()))
         OR has_role(auth.uid(), 'editor'));

DROP POLICY IF EXISTS "Editors manage announcements" ON site_announcements;
CREATE POLICY "Editors manage announcements"
  ON site_announcements FOR ALL
  USING (has_role(auth.uid(), 'editor')) WITH CHECK (has_role(auth.uid(), 'editor'));

-- ---------------------------------------------------------------------------
-- 4. Challenges (#40) — "Run 100 km in January". Progress is written by the backend from logged
--    results/activities, never by the participant, so the leaderboard cannot be self-edited.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS challenges (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text NOT NULL UNIQUE,
  title        text NOT NULL,
  description  text,
  cover_url    text,
  sport_types  sport_category[] NOT NULL DEFAULT '{}',
  metric       text NOT NULL CHECK (metric IN ('distance_km', 'events_completed', 'elevation_m', 'activities')),
  target       numeric NOT NULL CHECK (target > 0),
  starts_on    date NOT NULL,
  ends_on      date NOT NULL,
  organizer_id uuid REFERENCES organizers (id) ON DELETE SET NULL,   -- sponsored challenges
  is_published boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_on >= starts_on)
);

CREATE TABLE IF NOT EXISTS challenge_participants (
  challenge_id uuid NOT NULL REFERENCES challenges (id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES profiles (id)   ON DELETE CASCADE,
  progress     numeric NOT NULL DEFAULT 0 CHECK (progress >= 0),
  joined_at    timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  PRIMARY KEY (challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_leaderboard ON challenge_participants (challenge_id, progress DESC);

DROP TRIGGER IF EXISTS update_challenges_modtime ON challenges;
CREATE TRIGGER update_challenges_modtime
  BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION update_modified_column();

ALTER TABLE challenges             ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published challenges are publicly readable" ON challenges;
CREATE POLICY "Published challenges are publicly readable"
  ON challenges FOR SELECT USING (is_published OR has_role(auth.uid(), 'editor'));

DROP POLICY IF EXISTS "Editors manage challenges" ON challenges;
CREATE POLICY "Editors manage challenges"
  ON challenges FOR ALL
  USING (has_role(auth.uid(), 'editor')) WITH CHECK (has_role(auth.uid(), 'editor'));

DROP POLICY IF EXISTS "Challenge leaderboards are publicly readable" ON challenge_participants;
CREATE POLICY "Challenge leaderboards are publicly readable"
  ON challenge_participants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users join challenges" ON challenge_participants;
CREATE POLICY "Users join challenges"
  ON challenge_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id AND progress = 0 AND completed_at IS NULL);

DROP POLICY IF EXISTS "Users leave challenges" ON challenge_participants;
CREATE POLICY "Users leave challenges"
  ON challenge_participants FOR DELETE USING (auth.uid() = user_id);

COMMIT;
