-- Read-only checks for migrations 0012-0023. Paste into the Supabase SQL editor AFTER applying them.
-- Changes nothing. Every row should read ok = true; anything false names what is missing.

WITH expected_tables(t) AS (VALUES
  ('user_roles'), ('organizer_members'), ('profile_private'),
  ('event_categories'), ('event_price_tiers'), ('cities'),
  ('event_result_entries'), ('result_claims'), ('event_reviews'), ('event_media'),
  ('event_daily_stats'), ('notifications'), ('notification_preferences'), ('push_subscriptions'),
  ('alert_subscriptions'), ('collections'), ('collection_events'), ('articles'),
  ('site_announcements'), ('challenges'), ('challenge_participants'),
  ('sellers'), ('products'), ('product_daily_stats'),
  -- 0021 seller commerce
  ('seller_members'), ('seller_private'), ('product_variants'), ('merchandising_rules'),
  ('product_clicks'), ('user_addresses'), ('product_saves'), ('carts'), ('cart_items'),
  ('orders'), ('seller_orders'), ('order_items'), ('payments'), ('refunds'), ('shipments'),
  ('return_requests'), ('coupons'), ('coupon_redemptions'), ('seller_payouts'),
  ('seller_payout_items'), ('product_reviews'), ('product_moderation_log'),
  -- 0022 ticketing + private events
  ('organizer_private'), ('event_waves'), ('event_form_fields'), ('event_staff'), ('event_invites'),
  ('tickets'), ('organizer_payouts'), ('organizer_payout_items'), ('organizer_broadcasts'),
  -- 0023 organiser event setup
  ('event_schedule_items'), ('event_sponsors'), ('event_faqs'), ('event_documents')
)
SELECT 'table + RLS: ' || t AS check_name,
       coalesce(c.relrowsecurity, false) AS ok
FROM expected_tables e
LEFT JOIN pg_class c ON c.relname = e.t AND c.relnamespace = 'public'::regnamespace

UNION ALL
SELECT 'column: ' || x.tbl || '.' || x.col,
       EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_schema = 'public' AND table_name = x.tbl AND column_name = x.col)
FROM (VALUES
  ('events', 'start_time'), ('events', 'is_certified'), ('events', 'is_chip_timed'),
  ('events', 'featured_rank'), ('events', 'price_min_inr'), ('events', 'rating_avg'),
  ('events', 'results_status'), ('events', 'geo_precision'),
  ('organizers', 'slug'), ('organizers', 'follower_count'), ('profiles', 'username'),
  ('profiles', 'is_public'), ('event_requests', 'created_event_id'), ('user_feedbacks', 'event_id'),
  ('disciplines', 'display_order'), ('sports', 'hero_image_url'), ('activity_logs', 'actor_city'),
  ('reminders', 'send_at'), ('products', 'review_status'), ('orders', 'fee_inr'),
  ('events', 'visibility'), ('events', 'publication_status'), ('events', 'ticketing_mode'), ('events', 'access_token'),
  ('coupons', 'organizer_id'), ('event_categories', 'sales_end_at'),
  ('events', 'waiver_text'), ('events', 'tax_mode'), ('events', 'setup_progress'), ('event_categories', 'min_age'),
  ('event_categories', 'required_documents'), ('tickets', 'waiver_accepted_at'), ('tickets', 'guardian_name')
) AS x (tbl, col)

UNION ALL
SELECT 'enum value: ' || x.typ || '.' || x.val,
       EXISTS (SELECT 1 FROM pg_enum en JOIN pg_type ty ON ty.oid = en.enumtypid
               WHERE ty.typname = x.typ AND en.enumlabel = x.val)
FROM (VALUES
  ('activity_action', 'interest'), ('activity_action', 'going'), ('feedback_type', 'listing_correction'),
  ('event_status', 'postponed'), ('interest_status', 'waitlisted'), ('follow_entity', 'seller'),
  ('activity_action', 'registered')
) AS x (typ, val)

UNION ALL
SELECT 'function: ' || f,
       EXISTS (SELECT 1 FROM pg_proc WHERE proname = f AND pronamespace = 'public'::regnamespace)
FROM (VALUES
  ('has_role'), ('is_staff_session'), ('is_organizer_admin'), ('is_seller_owner'),
  ('events_near'), ('event_counts'), ('trending_events'), ('record_event_stat'), ('record_product_stat'),
  ('can_view_private_event'), ('is_event_staff'), ('request_event_token'), ('enforce_ticket_capacity'),
  ('check_event_publishable')
) AS x (f)

UNION ALL
SELECT 'anon cannot call record_event_stat',
       NOT has_function_privilege('anon', 'record_event_stat(uuid, text, integer)', 'EXECUTE')

UNION ALL
SELECT 'old public-read rule on events is gone',
       NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Public can read events')

UNION ALL
SELECT 'cities seeded (expect 53)', (SELECT count(*) FROM cities) = 53

ORDER BY 2, 1;

-- Backfill coverage — informational, not pass/fail.
SELECT
  count(*)                                          AS events_total,
  count(*) FILTER (WHERE geo_location IS NOT NULL)  AS with_coordinates,
  count(*) FILTER (WHERE geo_precision = 'city')    AS city_precision,
  count(*) FILTER (WHERE price_min_inr IS NOT NULL) AS with_numeric_price,
  count(*) FILTER (WHERE price_min_inr = 0)         AS free_events
FROM events;

-- Events whose city is not in `cities` (no coordinates yet) — add these cities, then re-run 0015's backfill.
SELECT city, state, count(*) AS events
FROM events
WHERE geo_location IS NULL
GROUP BY city, state
ORDER BY events DESC
LIMIT 20;

-- Smoke-test the RPCs.
SELECT * FROM event_counts('month', current_date, NULL) LIMIT 12;
SELECT count(*) AS within_100km_of_bengaluru FROM events_near(12.9716, 77.5946, 100);

-- LEAK CHECK for private events: every SELECT rule on events. Rules are OR-ed together, so ANY rule other
-- than "Events are readable by visibility" (and the club-admin ones) that says USING (true) exposes private
-- events. Expected: no row with qual = 'true'.
SELECT policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'events' AND cmd IN ('SELECT', 'ALL')
ORDER BY policyname;
