-- 0018 · Engagement stats (trending + organiser analytics), notifications, alerts sign-up, push
--        subscriptions, and the live activity feed wired to the tables the new UI actually writes.
--
-- Requirements: #15 registration reminders, #25 trending, #29 notification centre, #30 PWA push,
-- #31 organiser analytics, #34 email digest, #38/#50 activity feed, homepage "Never miss race day".
--
-- Requires 0012 (activity_action values) and 0013 (has_role, is_organizer_admin).
-- Idempotent and transactional.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Daily per-event stats. Raw numbers are private to the organiser; the public only ever sees the
--    ranking produced by trending_events().
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS event_daily_stats (
  event_id        uuid    NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  day             date    NOT NULL DEFAULT current_date,
  views           integer NOT NULL DEFAULT 0,
  saves           integer NOT NULL DEFAULT 0,
  interests       integer NOT NULL DEFAULT 0,
  shares          integer NOT NULL DEFAULT 0,
  register_clicks integer NOT NULL DEFAULT 0,
  registrations   integer NOT NULL DEFAULT 0,   -- confirmed platform tickets (0022)
  PRIMARY KEY (event_id, day)
);

CREATE INDEX IF NOT EXISTS idx_event_daily_stats_day ON event_daily_stats (day);

ALTER TABLE event_daily_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Organisers read their event stats" ON event_daily_stats;
CREATE POLICY "Organisers read their event stats"
  ON event_daily_stats FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM events e
    WHERE e.id = event_daily_stats.event_id
      AND (is_organizer_admin(e.organizer_id, auth.uid()) OR has_role(auth.uid(), 'admin'))
  ));

-- The only write path. Service role only: if anon could call it, anyone could inflate a ranking.
CREATE OR REPLACE FUNCTION record_event_stat(p_event_id uuid, p_metric text, p_amount integer DEFAULT 1)
RETURNS void AS $$
BEGIN
  IF p_metric NOT IN ('views', 'saves', 'interests', 'shares', 'register_clicks', 'registrations') THEN
    RAISE EXCEPTION 'record_event_stat: unknown metric %', p_metric;
  END IF;
  IF p_amount IS NULL OR p_amount < 1 OR p_amount > 10000 THEN
    RAISE EXCEPTION 'record_event_stat: amount out of range';
  END IF;

  INSERT INTO event_daily_stats AS s (event_id, day, views, saves, interests, shares, register_clicks, registrations)
  VALUES (p_event_id, current_date,
          CASE WHEN p_metric = 'views'           THEN p_amount ELSE 0 END,
          CASE WHEN p_metric = 'saves'           THEN p_amount ELSE 0 END,
          CASE WHEN p_metric = 'interests'       THEN p_amount ELSE 0 END,
          CASE WHEN p_metric = 'shares'          THEN p_amount ELSE 0 END,
          CASE WHEN p_metric = 'register_clicks' THEN p_amount ELSE 0 END,
          CASE WHEN p_metric = 'registrations'   THEN p_amount ELSE 0 END)
  ON CONFLICT (event_id, day) DO UPDATE SET
    views           = s.views           + EXCLUDED.views,
    saves           = s.saves           + EXCLUDED.saves,
    interests       = s.interests       + EXCLUDED.interests,
    shares          = s.shares          + EXCLUDED.shares,
    register_clicks = s.register_clicks + EXCLUDED.register_clicks,
    registrations   = s.registrations   + EXCLUDED.registrations;

  IF p_metric = 'views' THEN
    UPDATE events SET view_count = coalesce(view_count, 0) + p_amount WHERE id = p_event_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION record_event_stat(uuid, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION record_event_stat(uuid, text, integer) TO service_role;

-- "Popular right now" (#25): upcoming events ranked by weighted engagement over a trailing window.
-- SECURITY DEFINER so anonymous visitors get the ranking without reading raw organiser analytics.
CREATE OR REPLACE FUNCTION trending_events(p_days integer DEFAULT 14, p_limit integer DEFAULT 12)
RETURNS SETOF events AS $$
  SELECT e.*
  FROM events e
  JOIN (
    SELECT event_id,
           sum(registrations * 5 + saves * 3 + interests * 2 + shares * 2 + register_clicks * 2 + views) AS score
    FROM event_daily_stats
    WHERE day >= current_date - LEAST(GREATEST(coalesce(p_days, 14), 1), 90)
    GROUP BY event_id
  ) s ON s.event_id = e.id
  WHERE e.end_date >= current_date
    AND e.status IN ('upcoming', 'postponed')
  ORDER BY s.score DESC, e.start_date
  LIMIT LEAST(GREATEST(coalesce(p_limit, 12), 1), 50);
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION trending_events(integer, integer) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Notifications: in-app centre, per-channel preferences, push subscriptions.
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'push', 'whatsapp');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_topic AS ENUM (
    'registration_opens', 'registration_closing', 'event_reminder', 'followed_new_event',
    'results_published', 'weekly_digest', 'review_reply', 'account',
    -- Marketplace (0021): buyer-side and seller-side order lifecycle, and product moderation.
    'order_placed', 'order_shipped', 'order_delivered', 'return_update', 'refund_issued',
    'seller_new_order', 'seller_low_stock', 'seller_payout',
    'product_approved', 'product_rejected', 'product_changes_requested',
    -- Ticketing (0022): athlete, organiser and private-event lifecycle.
    'ticket_confirmed', 'ticket_cancelled', 'event_updated', 'event_cancelled', 'checkin_reminder',
    'certificate_ready', 'event_invite', 'organizer_new_registration', 'organizer_payout'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  topic       notification_topic NOT NULL,
  title       text NOT NULL,
  body        text,
  link_url    text,
  entity_type text,
  entity_id   uuid,
  read_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications (user_id, created_at DESC) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_user   ON notifications (user_id, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read their notifications" ON notifications;
CREATE POLICY "Users read their notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users mark their notifications read" ON notifications;
CREATE POLICY "Users mark their notifications read"
  ON notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users dismiss their notifications" ON notifications;
CREATE POLICY "Users dismiss their notifications"
  ON notifications FOR DELETE USING (auth.uid() = user_id);
-- Inserts: backend (service role) only.

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id    uuid                 NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  channel    notification_channel NOT NULL,
  topic      notification_topic   NOT NULL,
  enabled    boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, channel, topic)
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their notification preferences" ON notification_preferences;
CREATE POLICY "Users manage their notification preferences"
  ON notification_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  endpoint     text NOT NULL UNIQUE,
  p256dh       text NOT NULL,
  auth_key     text NOT NULL,
  user_agent   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions (user_id);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their push subscriptions" ON push_subscriptions;
CREATE POLICY "Users manage their push subscriptions"
  ON push_subscriptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Reminders (0001) gain a channel and a scheduled send time.
ALTER TABLE reminders
  ADD COLUMN IF NOT EXISTS channel notification_channel NOT NULL DEFAULT 'in_app',
  ADD COLUMN IF NOT EXISTS send_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_reminders_due ON reminders (send_at) WHERE NOT is_triggered;

-- ---------------------------------------------------------------------------
-- 3. "Never miss race day" sign-up — works without an account, so the insert is anonymous.
--    Personal data under the DPDP Act 2023: double opt-in (confirmed_at) before sending anything.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS alert_subscriptions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES profiles (id) ON DELETE CASCADE,
  email             text CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone             text,
  channel           notification_channel NOT NULL DEFAULT 'email',
  city              text,
  sport_types       sport_category[] NOT NULL DEFAULT '{}',
  confirmed_at      timestamptz,
  unsubscribe_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at        timestamptz NOT NULL DEFAULT now(),
  CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS alert_subscriptions_email_key
  ON alert_subscriptions (lower(email)) WHERE email IS NOT NULL;

ALTER TABLE alert_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can subscribe to alerts" ON alert_subscriptions;
CREATE POLICY "Anyone can subscribe to alerts"
  ON alert_subscriptions FOR INSERT
  WITH CHECK ((user_id IS NULL OR auth.uid() = user_id) AND confirmed_at IS NULL);
DROP POLICY IF EXISTS "Users read their alert subscriptions" ON alert_subscriptions;
CREATE POLICY "Users read their alert subscriptions"
  ON alert_subscriptions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users remove their alert subscriptions" ON alert_subscriptions;
CREATE POLICY "Users remove their alert subscriptions"
  ON alert_subscriptions FOR DELETE USING (auth.uid() = user_id);
-- Confirmation and token-based unsubscribe go through the backend (service role).

-- ---------------------------------------------------------------------------
-- 4. Live activity feed. The 0002 triggers log from user_calendars and follows — tables the new UI no
--    longer writes. These log from event_interests and entity_follows instead.
--    Anonymised by default: the feed shows "A runner in Pune …". user_id is stored only when the
--    athlete has made their profile public.
-- ---------------------------------------------------------------------------

ALTER TABLE activity_logs
  ADD COLUMN IF NOT EXISTS actor_city text,
  ADD COLUMN IF NOT EXISTS is_public  boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_activity_logs_recent ON activity_logs (created_at DESC) WHERE is_public;

CREATE OR REPLACE FUNCTION log_interest_activity()
RETURNS trigger AS $$
DECLARE
  v_public boolean;
  v_city   text;
  v_name   text;
BEGIN
  IF NEW.status::text NOT IN ('interested', 'going') THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  SELECT is_public, city INTO v_public, v_city FROM profiles WHERE id = NEW.user_id;
  SELECT event_name INTO v_name FROM events WHERE id = NEW.event_id;

  INSERT INTO activity_logs (user_id, user_display_name, action_type, target_id, target_name, actor_city, is_public)
  VALUES (CASE WHEN v_public THEN NEW.user_id END,
          NULL,
          CASE WHEN NEW.status::text = 'going' THEN 'going'::activity_action ELSE 'interest'::activity_action END,
          NEW.event_id,
          coalesce(v_name, 'an event'),
          v_city,
          true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS log_interest_activity_trg ON event_interests;
CREATE TRIGGER log_interest_activity_trg
  AFTER INSERT OR UPDATE OF status ON event_interests
  FOR EACH ROW EXECUTE FUNCTION log_interest_activity();

CREATE OR REPLACE FUNCTION log_follow_activity()
RETURNS trigger AS $$
DECLARE
  v_public boolean;
  v_city   text;
  v_name   text;
BEGIN
  IF NEW.target_type <> 'organizer' THEN
    RETURN NEW;
  END IF;
  SELECT is_public, city INTO v_public, v_city FROM profiles WHERE id = NEW.user_id;
  SELECT name INTO v_name FROM organizers WHERE id = NEW.target_id;
  IF v_name IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO activity_logs (user_id, user_display_name, action_type, target_id, target_name, actor_city, is_public)
  VALUES (CASE WHEN v_public THEN NEW.user_id END, NULL, 'follow', NEW.target_id, v_name, v_city, true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS log_follow_activity_trg ON entity_follows;
CREATE TRIGGER log_follow_activity_trg
  AFTER INSERT ON entity_follows
  FOR EACH ROW EXECUTE FUNCTION log_follow_activity();

COMMIT;
