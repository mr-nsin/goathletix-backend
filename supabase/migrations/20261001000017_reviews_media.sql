-- 0017 · Reviews & ratings, event photo galleries, and the moderation guard they share.
--
-- Requirements: #18 organiser rating, #19 event reviews & ratings, #23 archive, #33 photo galleries.
-- Event-platform research #6: a rating tied to a named past edition ("★ 4.6 from 312 finishers · 2025").
--
-- Storage is NOT created here: decide the Supabase Storage bucket and its policies separately (pending).
-- Requires 0013 (has_role, is_staff_session). Idempotent and transactional.

BEGIN;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $upd$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$upd$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TYPE moderation_status AS ENUM ('pending', 'published', 'hidden');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Generic guard: a non-staff session can never choose or change `status` (or helpful_count), so a
-- user cannot republish something a moderator hid. TG_ARGV[0] is the status a user's new row gets.
CREATE OR REPLACE FUNCTION guard_moderation_status()
RETURNS trigger AS $$
BEGIN
  IF is_staff_session() THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.status := TG_ARGV[0]::moderation_status;
  ELSE
    NEW.status := OLD.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- ---------------------------------------------------------------------------
-- 1. Reviews — one per athlete per event; post-moderated (published at once, moderators can hide).
--    Backend rule (not enforceable here): only allow a review after the event's end_date.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS event_reviews (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       uuid NOT NULL REFERENCES events (id)   ON DELETE CASCADE,
  user_id        uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  rating         smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title          text CHECK (char_length(title) <= 120),
  body           text CHECK (char_length(body)  <= 4000),
  edition_year   smallint CHECK (edition_year BETWEEN 1990 AND 2100),
  category_label text,                                  -- which distance they ran
  status         moderation_status NOT NULL DEFAULT 'published',
  helpful_count  integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_reviews_event ON event_reviews (event_id, created_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_event_reviews_user  ON event_reviews (user_id);

DROP TRIGGER IF EXISTS update_event_reviews_modtime ON event_reviews;
CREATE TRIGGER update_event_reviews_modtime
  BEFORE UPDATE ON event_reviews FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS guard_event_reviews_status ON event_reviews;
CREATE TRIGGER guard_event_reviews_status
  BEFORE INSERT OR UPDATE ON event_reviews
  FOR EACH ROW EXECUTE FUNCTION guard_moderation_status('published');

-- Users cannot inflate helpful_count either.
CREATE OR REPLACE FUNCTION guard_review_counters()
RETURNS trigger AS $$
BEGIN
  IF NOT is_staff_session() THEN
    NEW.helpful_count := CASE WHEN TG_OP = 'INSERT' THEN 0 ELSE OLD.helpful_count END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_event_reviews_counters ON event_reviews;
CREATE TRIGGER guard_event_reviews_counters
  BEFORE INSERT OR UPDATE ON event_reviews
  FOR EACH ROW EXECUTE FUNCTION guard_review_counters();

-- Keep events.rating_avg / rating_count (0014) and organizers.rating_avg / rating_count (0013) right.
CREATE OR REPLACE FUNCTION refresh_event_rating()
RETURNS trigger AS $$
DECLARE
  ev  uuid := COALESCE(NEW.event_id, OLD.event_id);
  org uuid;
BEGIN
  UPDATE events e
  SET rating_count = s.n,
      rating_avg   = CASE WHEN s.n = 0 THEN NULL ELSE round(s.avg_rating, 1) END
  FROM (SELECT count(*) AS n, avg(rating)::numeric AS avg_rating
        FROM event_reviews WHERE event_id = ev AND status = 'published') s
  WHERE e.id = ev
  RETURNING e.organizer_id INTO org;

  IF org IS NOT NULL THEN
    UPDATE organizers o
    SET rating_count = s.n,
        rating_avg   = CASE WHEN s.n = 0 THEN NULL ELSE round(s.avg_rating, 1) END
    FROM (SELECT count(*) AS n, avg(r.rating)::numeric AS avg_rating
          FROM event_reviews r JOIN events e ON e.id = r.event_id
          WHERE e.organizer_id = org AND r.status = 'published') s
    WHERE o.id = org;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS refresh_event_rating_trg ON event_reviews;
CREATE TRIGGER refresh_event_rating_trg
  AFTER INSERT OR DELETE OR UPDATE OF rating, status ON event_reviews
  FOR EACH ROW EXECUTE FUNCTION refresh_event_rating();

ALTER TABLE event_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published reviews are publicly readable" ON event_reviews;
CREATE POLICY "Published reviews are publicly readable"
  ON event_reviews FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id OR has_role(auth.uid(), 'moderator'));

DROP POLICY IF EXISTS "Users write their own review" ON event_reviews;
CREATE POLICY "Users write their own review"
  ON event_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users edit their own review" ON event_reviews;
CREATE POLICY "Users edit their own review"
  ON event_reviews FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete their own review" ON event_reviews;
CREATE POLICY "Users delete their own review"
  ON event_reviews FOR DELETE USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 2. Photo / video galleries — pre-moderated: uploads stay 'pending' until a moderator publishes.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS event_media (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES profiles (id) ON DELETE SET NULL,
  url         text NOT NULL,
  kind        text NOT NULL DEFAULT 'photo' CHECK (kind IN ('photo', 'video')),
  caption     text CHECK (char_length(caption) <= 300),
  credit      text,
  edition_year smallint CHECK (edition_year BETWEEN 1990 AND 2100),
  is_cover    boolean NOT NULL DEFAULT false,
  status      moderation_status NOT NULL DEFAULT 'pending',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_media_event ON event_media (event_id, created_at DESC) WHERE status = 'published';

DROP TRIGGER IF EXISTS guard_event_media_status ON event_media;
CREATE TRIGGER guard_event_media_status
  BEFORE INSERT OR UPDATE ON event_media
  FOR EACH ROW EXECUTE FUNCTION guard_moderation_status('pending');

ALTER TABLE event_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published media is publicly readable" ON event_media;
CREATE POLICY "Published media is publicly readable"
  ON event_media FOR SELECT
  USING (status = 'published' OR auth.uid() = uploaded_by OR has_role(auth.uid(), 'moderator'));

DROP POLICY IF EXISTS "Users upload media" ON event_media;
CREATE POLICY "Users upload media"
  ON event_media FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

DROP POLICY IF EXISTS "Users delete their own media" ON event_media;
CREATE POLICY "Users delete their own media"
  ON event_media FOR DELETE USING (auth.uid() = uploaded_by);

COMMIT;
