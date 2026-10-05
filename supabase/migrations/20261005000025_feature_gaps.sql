-- 20261005000025_feature_gaps.sql
-- Additive, idempotent gap-fill for organizer feature parity (SPORTIFI walkthrough).
-- Only genuinely-missing, clearly-needed objects. Safe: IF NOT EXISTS throughout,
-- new columns nullable, no drops/renames/type-changes, RLS enabled (deny-by-default)
-- on new tables to match migration 0011's RLS-everywhere posture.

-- 1) Event-builder fields not yet on events ------------------------------------
alter table public.events add column if not exists bib_expo_opens_at       timestamptz;
alter table public.events add column if not exists bib_expo_closes_at      timestamptz;
alter table public.events add column if not exists certificate_available_at timestamptz;
alter table public.events add column if not exists cover_image_mobile_url  text;   -- 720x900 tall hero
alter table public.events add column if not exists social_share_image_url  text;   -- 1200x630 OG image

-- 2) Organizer API keys  (/organizer/manage/api_keys) --------------------------
create table if not exists public.api_keys (
  id           uuid primary key default gen_random_uuid(),
  organizer_id uuid references public.organizers(id) on delete cascade,
  name         text not null,
  key_prefix   text not null,
  key_hash     text not null,
  scopes       text[] not null default '{}',
  last_used_at timestamptz,
  revoked_at   timestamptz,
  created_by   uuid,
  created_at   timestamptz not null default now()
);
create index if not exists idx_api_keys_org on public.api_keys(organizer_id);
alter table public.api_keys enable row level security;

-- 3) Affiliates  (/organizer/manage/affiliates) --------------------------------
create table if not exists public.affiliates (
  id                  uuid primary key default gen_random_uuid(),
  organizer_id        uuid references public.organizers(id) on delete cascade,
  event_id            uuid references public.events(id) on delete set null,
  name                text not null,
  code                text not null,
  email               text,
  phone               text,
  commission_pct      numeric(5,2) not null default 0,
  commission_flat_inr numeric(12,2),
  clicks              integer not null default 0,
  conversions         integer not null default 0,
  revenue_inr         numeric(14,2) not null default 0,
  status              text not null default 'active',
  created_at          timestamptz not null default now()
);
create unique index if not exists uq_affiliates_org_code on public.affiliates(organizer_id, code);
alter table public.affiliates enable row level security;

-- 4) Referral reward goals  (/organizer/manage/referrals + event builder step 10)
create table if not exists public.event_referral_goals (
  id                 uuid primary key default gen_random_uuid(),
  event_id           uuid references public.events(id) on delete cascade,
  organizer_id       uuid references public.organizers(id) on delete cascade,
  referrals_required integer not null,
  reward_type        text not null default 'refund_pct',  -- refund_pct | refund_flat | free_entry
  reward_value       numeric(12,2) not null default 100,
  auto_refund        boolean not null default true,
  active             boolean not null default true,
  created_at         timestamptz not null default now()
);
create index if not exists idx_referral_goals_event on public.event_referral_goals(event_id);
alter table public.event_referral_goals enable row level security;
