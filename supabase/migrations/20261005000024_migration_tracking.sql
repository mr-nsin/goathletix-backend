-- Migration tracking bootstrap.
-- The DB had no migration-history table (migrations 0001-0023 were applied by hand).
-- This creates the Supabase-CLI-compatible tracking table and backfills every applied
-- version, so applied-vs-pending becomes queryable and `supabase db push` / CI can track state.

create schema if not exists supabase_migrations;

create table if not exists supabase_migrations.schema_migrations (
  version     text not null primary key,
  name        text,
  statements  text[],
  inserted_at timestamptz not null default now()
);

insert into supabase_migrations.schema_migrations (version, name) values
  ('20260710000000','init'),
  ('20260710000001','auth_features'),
  ('20260710000002','activity_feed'),
  ('20260710000003','multiday_events'),
  ('20260710000004','security_hardening'),
  ('20260915000004','add_poster_and_popular'),
  ('20260916000005','extend_sport_categories'),
  ('20260916000006','taxonomy'),
  ('20260916000007','events_hardening'),
  ('20260916000008','clubs'),
  ('20260916000009','engagement'),
  ('20260916000010','training_centers'),
  ('20260916000011','rls_policies'),
  ('20261001000012','enum_values'),
  ('20261001000013','roles_organizers_profiles'),
  ('20261001000014','event_details_pricing'),
  ('20261001000015','geo_cities_discovery'),
  ('20261001000016','results'),
  ('20261001000017','reviews_media'),
  ('20261001000018','stats_notifications_feed'),
  ('20261001000019','content_collections'),
  ('20261001000020','marketplace'),
  ('20261001000021','seller_commerce'),
  ('20261001000022','ticketing_private_events'),
  ('20261001000023','event_setup'),
  ('20261005000024','migration_tracking')
on conflict (version) do nothing;
