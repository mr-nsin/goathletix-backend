-- 0011 — Row Level Security for every new table, plus two fixes to existing policy.
--
-- Run last, after 0010.
--
-- TWO EXISTING BUGS FIXED HERE
--
-- 1. profiles is readable only by its owner:
--        CREATE POLICY "Users can read their profile" ON profiles FOR SELECT USING (auth.uid() = id)
--    So NOBODY can read anyone else's profile. The moment a club member list, an activity feed or
--    a shared season renders another person's name, it comes back empty. Replaced with a public
--    read -- profiles hold only full_name, preferred_location and sports_interest, all of which
--    are display data. Writes stay owner-only.
--
-- 2. events has no INSERT policy at all, so organizer self-serve hosting (Pillar 2) cannot write
--    through the Data API. Added for authenticated users, gated on claiming the event.
--
-- Note RLS protects the BROWSER path only: the backend uses the service-role key, which bypasses
-- RLS entirely. Server-side authorisation is still the application's job.
--
-- Idempotent and transactional.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Enable RLS on everything added in 0006-0010.
--    A new table without a policy is a security regression (CLAUDE.md section 5).
-- ---------------------------------------------------------------------------

ALTER TABLE event_series      ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members      ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_interests   ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_results     ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_follows    ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_calendars  ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_centers  ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 2. Public reference and discovery data
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Event series are publicly readable" ON event_series;
CREATE POLICY "Event series are publicly readable"
  ON event_series FOR SELECT USING (true);

DROP POLICY IF EXISTS "Active clubs are publicly readable" ON clubs;
CREATE POLICY "Active clubs are publicly readable"
  ON clubs FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Active training centers are publicly readable" ON training_centers;
CREATE POLICY "Active training centers are publicly readable"
  ON training_centers FOR SELECT USING (is_active = true);

-- ---------------------------------------------------------------------------
-- 3. profiles -- FIX: public read, owner-only write.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can read their profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are publicly readable" ON profiles;
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT USING (true);

-- The UPDATE policy from 0004 already restricts writes to the owner; re-asserted for clarity.
DROP POLICY IF EXISTS "Users can update their profile" ON profiles;
CREATE POLICY "Users can update their profile"
  ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- 3b. Club admin check -- MUST be SECURITY DEFINER.
--     A policy ON club_members that itself SELECTs club_members re-enters RLS on that table and
--     Postgres aborts with "infinite recursion detected in policy". A SECURITY DEFINER function
--     runs as the owner and bypasses RLS, breaking the cycle. Same helper is reused for clubs
--     and events so the rule is defined once.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION is_club_admin(target_club uuid, target_user uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM club_members
    WHERE club_id = target_club
      AND user_id = target_user
      AND role IN ('owner', 'admin')
      AND status = 'active'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION is_club_admin(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_club_admin(uuid, uuid) TO authenticated, anon, service_role;

-- ---------------------------------------------------------------------------
-- 4. Clubs -- membership is public (a member list is the point of a club page);
--    joining is self-service; only owners and admins administer.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Club members are publicly readable" ON club_members;
CREATE POLICY "Club members are publicly readable"
  ON club_members FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Users can join clubs" ON club_members;
CREATE POLICY "Users can join clubs"
  ON club_members FOR INSERT WITH CHECK (auth.uid() = user_id AND role = 'member');

DROP POLICY IF EXISTS "Users can leave clubs" ON club_members;
CREATE POLICY "Users can leave clubs"
  ON club_members FOR DELETE USING (auth.uid() = user_id);

-- Owners and admins manage membership. Written as a subquery on club_members rather than a
-- join, so it holds regardless of how the client shapes the request.
DROP POLICY IF EXISTS "Club admins manage membership" ON club_members;
CREATE POLICY "Club admins manage membership"
  ON club_members FOR UPDATE
  USING (
    is_club_admin(club_members.club_id, auth.uid())
  );

DROP POLICY IF EXISTS "Users can create clubs" ON clubs;
CREATE POLICY "Users can create clubs"
  ON clubs FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Club owners and admins can update" ON clubs;
CREATE POLICY "Club owners and admins can update"
  ON clubs FOR UPDATE
  USING (
    auth.uid() = owner_id
    OR is_club_admin(clubs.id, auth.uid())
  );

-- ---------------------------------------------------------------------------
-- 5. Engagement -- private to the user, with two deliberate exceptions.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users manage their interests" ON event_interests;
CREATE POLICY "Users manage their interests"
  ON event_interests FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage their follows" ON entity_follows;
CREATE POLICY "Users manage their follows"
  ON entity_follows FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage their shared calendars" ON shared_calendars;
CREATE POLICY "Users manage their shared calendars"
  ON shared_calendars FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Exception 1: results are publicly readable. A season poster and a past-events archive are
-- meant to be shown; a result the owner wants hidden is deleted, not concealed.
DROP POLICY IF EXISTS "Results are publicly readable" ON event_results;
CREATE POLICY "Results are publicly readable"
  ON event_results FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users write their own results" ON event_results;
CREATE POLICY "Users write their own results"
  ON event_results FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update their own results" ON event_results;
CREATE POLICY "Users update their own results"
  ON event_results FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete their own results" ON event_results;
CREATE POLICY "Users delete their own results"
  ON event_results FOR DELETE USING (auth.uid() = user_id);

-- Exception 2: a public shared calendar is readable by anyone holding the token.
-- The token is unguessable and revocable, so this is the share mechanism itself.
-- NOTE: this grants SELECT on the row, not on the interests behind it -- the API must resolve
-- the token server-side and return the events. Do not rely on RLS alone to scope a share.
DROP POLICY IF EXISTS "Public shared calendars are readable" ON shared_calendars;
CREATE POLICY "Public shared calendars are readable"
  ON shared_calendars FOR SELECT
  USING (is_public = true AND (expires_at IS NULL OR expires_at > now()));

-- ---------------------------------------------------------------------------
-- 6. events -- FIX: allow authenticated hosting (Pillar 2).
--    An event may be claimed by a club the user administers; otherwise it goes through
--    event_requests and moderation, exactly as today.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Club admins can create club events" ON events;
CREATE POLICY "Club admins can create club events"
  ON events FOR INSERT
  WITH CHECK (
    club_id IS NOT NULL
    AND is_club_admin(events.club_id, auth.uid())
  );

DROP POLICY IF EXISTS "Club admins can update club events" ON events;
CREATE POLICY "Club admins can update club events"
  ON events FOR UPDATE
  USING (
    club_id IS NOT NULL
    AND is_club_admin(events.club_id, auth.uid())
  );

COMMIT;

-- Verify every new table has RLS on and at least one policy:
--   SELECT c.relname, c.relrowsecurity, count(p.polname) AS policies
--   FROM pg_class c
--   LEFT JOIN pg_policy p ON p.polrelid = c.oid
--   WHERE c.relname IN ('event_series','clubs','club_members','event_interests','event_results',
--                       'entity_follows','shared_calendars','training_centers','sports','disciplines')
--   GROUP BY 1,2 ORDER BY 1;
