-- 0013 · Platform roles, organiser accounts, public/private profile split, moderated submissions.
--
-- Requirements: #9 manual ingestion, #12 accounts, #16 organiser accounts, #17 submission form,
-- #18 organiser pages, #32 verified badges, #36 user profiles, #37 follow organisers, #52 claim profile,
-- footer "report an incorrect listing".
--
-- Requires 0012 to be applied first. Idempotent and transactional.

BEGIN;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $upd$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$upd$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. Platform roles. Organiser and seller rights are per-entity (sections 3 and 0020), not here.
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('admin', 'editor', 'moderator');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id    uuid     NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  role       app_role NOT NULL,
  granted_by uuid     REFERENCES profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role)
);

-- SECURITY DEFINER so policies on user_roles itself can call it without recursing (same reason as
-- is_club_admin in 0011). 'admin' implies every other role.
CREATE OR REPLACE FUNCTION has_role(target_user uuid, wanted app_role)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = target_user AND (role = wanted OR role = 'admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

-- True for trusted sessions: the dashboard SQL editor, the backend's service-role key, or a signed-in
-- moderator. Deliberately NOT security definer -- current_user must be the caller's role.
-- Used by guard triggers that stop users promoting their own rows (moderation status, verification).
CREATE OR REPLACE FUNCTION is_staff_session()
RETURNS boolean AS $$
  SELECT current_user IN ('postgres', 'supabase_admin', 'service_role')
      OR coalesce(auth.role(), '') = 'service_role'
      OR has_role(auth.uid(), 'moderator');
$$ LANGUAGE sql STABLE SET search_path = public, pg_temp;

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read their own roles" ON user_roles;
CREATE POLICY "Users read their own roles"
  ON user_roles FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));
-- No client write policy: roles are granted from the dashboard or by the backend (service role).

-- ---------------------------------------------------------------------------
-- 2. Organisers: public page fields, counters, verification timestamps.
-- ---------------------------------------------------------------------------

ALTER TABLE organizers
  ADD COLUMN IF NOT EXISTS slug           text,
  ADD COLUMN IF NOT EXISTS description    text,
  ADD COLUMN IF NOT EXISTS city           text,
  ADD COLUMN IF NOT EXISTS state          text,
  ADD COLUMN IF NOT EXISTS contact_email  text,
  ADD COLUMN IF NOT EXISTS contact_phone  text,
  ADD COLUMN IF NOT EXISTS instagram_url  text,
  ADD COLUMN IF NOT EXISTS cover_url      text,
  ADD COLUMN IF NOT EXISTS sport_types    sport_category[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS verified_at    timestamptz,
  ADD COLUMN IF NOT EXISTS claimed_at     timestamptz,
  ADD COLUMN IF NOT EXISTS follower_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS event_count    integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_avg     numeric(2,1),
  ADD COLUMN IF NOT EXISTS rating_count   integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at     timestamptz NOT NULL DEFAULT now();

-- Slug backfill: name -> kebab case, id suffix only on collision (same approach as events.slug, 0007).
UPDATE organizers o
SET slug = s.base || CASE WHEN s.rn > 1 THEN '-' || left(o.id::text, 6) ELSE '' END
FROM (
  SELECT id, base, row_number() OVER (PARTITION BY base ORDER BY created_at, id) AS rn
  FROM (
    SELECT id, created_at,
           coalesce(nullif(trim(both '-' FROM lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))), ''),
                    'organizer') AS base
    FROM organizers
  ) b
) s
WHERE o.id = s.id AND o.slug IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS organizers_slug_key ON organizers (slug);

UPDATE organizers o
SET event_count = (SELECT count(*) FROM events e WHERE e.organizer_id = o.id);

UPDATE organizers SET verified_at = created_at WHERE is_verified AND verified_at IS NULL;

DROP TRIGGER IF EXISTS update_organizers_modtime ON organizers;
CREATE TRIGGER update_organizers_modtime
  BEFORE UPDATE ON organizers FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Keep organizers.event_count right as events are added, removed or re-assigned.
CREATE OR REPLACE FUNCTION refresh_organizer_event_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') AND OLD.organizer_id IS NOT NULL THEN
    UPDATE organizers SET event_count = (SELECT count(*) FROM events WHERE organizer_id = OLD.organizer_id)
    WHERE id = OLD.organizer_id;
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE') AND NEW.organizer_id IS NOT NULL THEN
    UPDATE organizers SET event_count = (SELECT count(*) FROM events WHERE organizer_id = NEW.organizer_id)
    WHERE id = NEW.organizer_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS refresh_organizer_event_count_trg ON events;
CREATE TRIGGER refresh_organizer_event_count_trg
  AFTER INSERT OR DELETE OR UPDATE OF organizer_id ON events
  FOR EACH ROW EXECUTE FUNCTION refresh_organizer_event_count();

-- Keep organizers.follower_count right (entity_follows from 0009 is the follow table).
CREATE OR REPLACE FUNCTION refresh_organizer_follower_count()
RETURNS trigger AS $$
DECLARE
  target uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.target_type <> 'organizer' THEN RETURN OLD; END IF;
    target := OLD.target_id;
  ELSE
    IF NEW.target_type <> 'organizer' THEN RETURN NEW; END IF;
    target := NEW.target_id;
  END IF;
  UPDATE organizers
  SET follower_count = (SELECT count(*) FROM entity_follows
                        WHERE target_type = 'organizer' AND target_id = target)
  WHERE id = target;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS refresh_organizer_follower_count_trg ON entity_follows;
CREATE TRIGGER refresh_organizer_follower_count_trg
  AFTER INSERT OR DELETE ON entity_follows
  FOR EACH ROW EXECUTE FUNCTION refresh_organizer_follower_count();

-- Organiser admins can edit their page (policy in section 3) but cannot verify themselves or touch
-- the counters, which only the triggers above maintain. Those triggers are SECURITY DEFINER, so they
-- run as the owner and pass is_staff_session().
CREATE OR REPLACE FUNCTION guard_organizer_verification()
RETURNS trigger AS $$
BEGIN
  IF NOT is_staff_session() THEN
    NEW.is_verified    := OLD.is_verified;
    NEW.verified_at    := OLD.verified_at;
    NEW.claimed_at     := OLD.claimed_at;
    NEW.follower_count := OLD.follower_count;
    NEW.event_count    := OLD.event_count;
    NEW.rating_avg     := OLD.rating_avg;
    NEW.rating_count   := OLD.rating_count;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_organizer_verification_trg ON organizers;
CREATE TRIGGER guard_organizer_verification_trg
  BEFORE UPDATE ON organizers FOR EACH ROW EXECUTE FUNCTION guard_organizer_verification();

-- ---------------------------------------------------------------------------
-- 3. Organiser team membership — claim a page (#52), manage it (#16).
--    A claim is a row with status 'pending'; staff approve it by setting status 'active'.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS organizer_members (
  organizer_id uuid              NOT NULL REFERENCES organizers (id) ON DELETE CASCADE,
  user_id      uuid              NOT NULL REFERENCES profiles (id)   ON DELETE CASCADE,
  role         club_role         NOT NULL DEFAULT 'member',
  status       membership_status NOT NULL DEFAULT 'pending',
  claim_note   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organizer_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_organizer_members_user ON organizer_members (user_id);

DROP TRIGGER IF EXISTS update_organizer_members_modtime ON organizer_members;
CREATE TRIGGER update_organizer_members_modtime
  BEFORE UPDATE ON organizer_members FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE OR REPLACE FUNCTION is_organizer_admin(target_organizer uuid, target_user uuid)
RETURNS boolean AS $$
  SELECT has_role(target_user, 'admin') OR EXISTS (
    SELECT 1 FROM organizer_members
    WHERE organizer_id = target_organizer AND user_id = target_user
      AND role IN ('owner', 'admin') AND status = 'active'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

ALTER TABLE organizer_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members and organiser admins read membership" ON organizer_members;
CREATE POLICY "Members and organiser admins read membership"
  ON organizer_members FOR SELECT
  USING (auth.uid() = user_id OR is_organizer_admin(organizer_id, auth.uid()));

-- A user may only *request*: their own row, pending. Approval is a staff/service-role update.
DROP POLICY IF EXISTS "Users request organiser membership" ON organizer_members;
CREATE POLICY "Users request organiser membership"
  ON organizer_members FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

DROP POLICY IF EXISTS "Users withdraw their membership" ON organizer_members;
CREATE POLICY "Users withdraw their membership"
  ON organizer_members FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Organiser admins manage membership" ON organizer_members;
CREATE POLICY "Organiser admins manage membership"
  ON organizer_members FOR UPDATE
  USING (is_organizer_admin(organizer_id, auth.uid()))
  WITH CHECK (is_organizer_admin(organizer_id, auth.uid()));

-- Organiser admins may edit their own organiser's public page (verification is guarded above).
DROP POLICY IF EXISTS "Organiser admins update their organiser" ON organizers;
CREATE POLICY "Organiser admins update their organiser"
  ON organizers FOR UPDATE
  USING (is_organizer_admin(id, auth.uid()))
  WITH CHECK (is_organizer_admin(id, auth.uid()));

-- ---------------------------------------------------------------------------
-- 4. Profiles. profiles is publicly readable (0011, so club member lists work), therefore ONLY
--    public-safe fields go on it. Anything personal goes in profile_private (owner-only).
-- ---------------------------------------------------------------------------

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS username   text,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS bio        text,
  ADD COLUMN IF NOT EXISTS city       text,
  ADD COLUMN IF NOT EXISTS state      text,
  -- Opt-in for a public athlete page with event history (#36). Off by default.
  ADD COLUMN IF NOT EXISTS is_public  boolean NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_key
  ON profiles (lower(username)) WHERE username IS NOT NULL;

DO $$ BEGIN
  ALTER TABLE profiles ADD CONSTRAINT profiles_username_format
    CHECK (username IS NULL OR username ~ '^[a-zA-Z0-9_.]{3,30}$');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS profile_private (
  id                 uuid PRIMARY KEY REFERENCES profiles (id) ON DELETE CASCADE,
  -- Birth year, not date of birth: enough to derive an age category, far less sensitive.
  birth_year         smallint CHECK (birth_year BETWEEN 1900 AND 2100),
  gender             text CHECK (gender IN ('female', 'male', 'non_binary', 'prefer_not_to_say')),
  phone              text,
  email_opt_in       boolean NOT NULL DEFAULT false,
  whatsapp_opt_in    boolean NOT NULL DEFAULT false,
  consent_updated_at timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS update_profile_private_modtime ON profile_private;
CREATE TRIGGER update_profile_private_modtime
  BEFORE UPDATE ON profile_private FOR EACH ROW EXECUTE FUNCTION update_modified_column();

ALTER TABLE profile_private ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their private profile" ON profile_private;
CREATE POLICY "Users manage their private profile"
  ON profile_private FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- 5. Event submission (#17): richer requests, review trail, link to the event they became.
-- ---------------------------------------------------------------------------

ALTER TABLE event_requests
  ADD COLUMN IF NOT EXISTS organizer_id     uuid REFERENCES organizers (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS distance_options text[]         NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS price_range      text,
  ADD COLUMN IF NOT EXISTS poster_url       text,
  ADD COLUMN IF NOT EXISTS start_time       time,
  ADD COLUMN IF NOT EXISTS age_categories   age_category[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS discipline_slugs text[]         NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS contact_email    text,
  ADD COLUMN IF NOT EXISTS reviewed_by      uuid REFERENCES profiles (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at      timestamptz,
  ADD COLUMN IF NOT EXISTS review_notes     text,
  ADD COLUMN IF NOT EXISTS created_event_id uuid REFERENCES events (id) ON DELETE SET NULL;

DROP POLICY IF EXISTS "Users read their own event requests" ON event_requests;
CREATE POLICY "Users read their own event requests"
  ON event_requests FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'editor'));

-- ---------------------------------------------------------------------------
-- 6. Listing corrections: feedback can point at the event it is about.
-- ---------------------------------------------------------------------------

ALTER TABLE user_feedbacks
  ADD COLUMN IF NOT EXISTS event_id uuid REFERENCES events (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS page_url text;

CREATE INDEX IF NOT EXISTS idx_user_feedbacks_event ON user_feedbacks (event_id) WHERE event_id IS NOT NULL;

COMMIT;
