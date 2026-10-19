-- 0026 · Detail-page fields: events, ticket types, organiser and event social links, clubs and academies,
--        and gear (product) detail pages. GA-047, ADR-009 (proposed).
--
-- Sources:
--   01 Product/Event detail fields by sport.md (GA-046)      -> sections 1-6 (events, categories, event child tables)
--   01 Product/Club and academy listing research.md (GA-032) -> sections 8-10 (clubs, training centres, centre tables)
--   Owner scope extension 2026-10-19                          -> social links (section 7), gear (section 11)
--
-- Only objects that do not exist in 0000-0025 are added. Already present, therefore NOT re-added:
--   events.course_map_url (0014), events.website_url / whatsapp_url / amenities (0023),
--   event_categories.includes (0022), organizers.website_url (0000), organizers.instagram_url (0013),
--   clubs.website_url / instagram_url / whatsapp_invite_url / contact_email (0008),
--   training_centers.website_url / contact_phone / contact_email / address (0010),
--   products.brand / image_urls (0020), products.rating_avg / rating_count / weight_grams (0021).
--
-- Rules followed: idempotent (IF NOT EXISTS, DROP ... IF EXISTS before CREATE, duplicate_object guards),
-- one transaction, additive only: no DROP of a table or column, no TRUNCATE, no DELETE, no type change.
-- Every new column is nullable or has a default, so existing rows stay valid. RLS is enabled with policies on
-- every new table in this same file.
--
-- NOT APPLIED from the repository. Apply by hand: Supabase dashboard -> SQL editor -> paste this whole file -> Run.
-- Requires 0000-0025 (has_role, is_staff_session, is_organizer_admin, is_club_admin, guard_moderation_status,
-- moderation_status, age_category, disciplines, event_categories, products, guard_product_review).

BEGIN;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $upd$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$upd$ LANGUAGE plpgsql;

CREATE EXTENSION IF NOT EXISTS postgis;

-- ---------------------------------------------------------------------------
-- 1. events: event-page fields (GA-046 sections 1-2)
-- ---------------------------------------------------------------------------

ALTER TABLE events
  -- Format panel, validated per sport in code (shape documented in the COMMENT below and in ADR-009).
  ADD COLUMN IF NOT EXISTS sport_details             jsonb   NOT NULL DEFAULT '{}',
  -- Requirements
  ADD COLUMN IF NOT EXISTS mandatory_gear            text[]  NOT NULL DEFAULT '{}',   -- helmet, rear red light, reflective vest
  ADD COLUMN IF NOT EXISTS recommended_gear          text[]  NOT NULL DEFAULT '{}',   -- 50-60 L backpack, trekking poles
  ADD COLUMN IF NOT EXISTS fitness_requirement       text,                            -- 'Run 5 km in 38 min'
  -- Policies
  ADD COLUMN IF NOT EXISTS changes_allowed_until     timestamptz,                     -- last moment for edits / transfers
  -- Kit collection. NULL = organiser has not said (different from false).
  ADD COLUMN IF NOT EXISTS kit_collection_mandatory  boolean,
  ADD COLUMN IF NOT EXISTS race_day_collection       boolean,
  -- Course
  ADD COLUMN IF NOT EXISTS gpx_url                   text,
  ADD COLUMN IF NOT EXISTS elevation_gain_m          integer CHECK (elevation_gain_m BETWEEN 0 AND 20000),  -- filterable twin of text elevation_gain
  -- Badges and identity
  ADD COLUMN IF NOT EXISTS sanction_reference        text,                            -- 'BRM sanctioned by ACP, approved by AIR' / cert no.
  ADD COLUMN IF NOT EXISTS edition_number            smallint CHECK (edition_number BETWEEN 1 AND 1000),
  -- Safety: its own vocabulary, not folded into amenities (ADR-009 decision 4).
  ADD COLUMN IF NOT EXISTS women_safety              text[]  NOT NULL DEFAULT '{}',
  -- Organiser and urgency
  ADD COLUMN IF NOT EXISTS sponsorship_contact       text,
  ADD COLUMN IF NOT EXISTS closes_when_sold_out      boolean;                         -- NULL = not stated

DO $$ BEGIN
  ALTER TABLE events ADD CONSTRAINT events_sport_details_object CHECK (jsonb_typeof(sport_details) = 'object');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE events ADD CONSTRAINT events_women_safety_known CHECK (women_safety <@ ARRAY[
    'female_medics', 'female_marshals', 'female_volunteers', 'women_only_wave', 'women_only_category',
    'same_gender_tents', 'separate_changing', 'women_helpline', 'well_lit_route', 'safe_transport'
  ]::text[]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Backfill elevation_gain_m from the free-text elevation_gain only where it is a plain metre figure
-- ('150', '150m', '1,200 m', '850 metres'). Anything else ('Flat', '500 ft', '100-200m') stays NULL.
-- At most 6 characters of digits and commas, so the cast cannot overflow or break the CHECK above 20000.
-- Only touches rows not yet filled: re-running is a no-op.
WITH parsed AS (
  SELECT id,
         replace(substring(lower(elevation_gain)
                 FROM '^\s*([0-9][0-9,]{0,5})\s*(?:m|mtr|mtrs|meter|meters|metre|metres)?\s*$'), ',', '') AS n
  FROM events
  WHERE elevation_gain_m IS NULL AND elevation_gain IS NOT NULL
)
UPDATE events e
SET elevation_gain_m = p.n::integer
FROM parsed p
WHERE e.id = p.id
  AND p.n IS NOT NULL
  AND length(p.n) BETWEEN 1 AND 5
  AND p.n::integer <= 20000;

CREATE INDEX IF NOT EXISTS idx_events_elevation_gain_m ON events (elevation_gain_m) WHERE elevation_gain_m IS NOT NULL;

COMMENT ON COLUMN events.sport_details IS
  'Per-sport facts for the Format panel. JSON object keyed by events.sport_type; validated in code. '
  'Optional "v": 1 schema version. Shapes (all keys optional): '
  'running {course_type: loop|out_and_back|point_to_point}; '
  'cycling {ride_format: brevet|gran_fondo|race|fellowship_ride, support_level: self_supported|supported, '
  'proof_of_passage: text, bike_types_allowed: [road|mtb|hybrid|any], night_riding: bool, rider_number_display: text}; '
  'triathlon {swim_venue_type: sea|river|lake|pool, water_temp_c: num, wetsuit_rule: allowed|optional|banned, '
  'drafting: legal|illegal, transition_location: text, qualifier_slots: text}; '
  'water {water_body: sea|lake|river|pool, tide_dependent_start: bool, water_temp_c: num, wetsuit_rule: text, '
  'safety_cover: [text], cap_and_chip: text}; '
  'trekking {duration_days: int, duration_nights: int, base_camp_altitude_m: int, trek_distance_km: num, '
  'start_point, end_point, pickup_point, pickup_time: text, group_size_max: int, gender_ratio: text, stay: text, '
  'meals: text, permits: [text], connectivity: text, best_season: text} (day-by-day plan: event_itinerary_days); '
  'skating {judging: {judges: int, criteria: [text]}, qualifies_for: text}; '
  'athletics {max_events_per_athlete: int, entries_per_unit: text, entry_mode: athlete_online|via_association|via_federation}; '
  'martial_arts {style: text, rules_body: text, reporting_minutes_before: int}; '
  'racquet {tournament_format: knockout|round_robin_knockout|league|swiss, courts: int, court_surface: text}; '
  'fitness {workout_format: text, stations: [text]}; '
  'adventure {disciplines: [text], navigation: text, non_stop: bool, qualifier: text}.';

COMMENT ON COLUMN events.kit_collection_mandatory IS 'NULL = not stated by the organiser; false = optional.';
COMMENT ON COLUMN events.elevation_gain_m IS 'Integer metres for filtering. events.elevation_gain (text) stays for display and ingestion.';

-- ---------------------------------------------------------------------------
-- 2. event_categories (ticket types): GA-046 section 3
-- ---------------------------------------------------------------------------

ALTER TABLE event_categories
  ADD COLUMN IF NOT EXISTS sport_details        jsonb   NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_timed             boolean,                       -- NULL = inherit events.is_chip_timed
  ADD COLUMN IF NOT EXISTS compare_at_price_inr integer CHECK (compare_at_price_inr >= 0),   -- struck-out price
  ADD COLUMN IF NOT EXISTS excludes             text[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS team_composition     text,                          -- 'at least 1 woman per team'
  ADD COLUMN IF NOT EXISTS ticket_kind          text    NOT NULL DEFAULT 'participant'
    CHECK (ticket_kind IN ('participant', 'team', 'spectator', 'add_on')),
  ADD COLUMN IF NOT EXISTS session_starts_on    date,                          -- trek batch / tournament day
  ADD COLUMN IF NOT EXISTS session_ends_on      date,
  ADD COLUMN IF NOT EXISTS deposit_inr          integer CHECK (deposit_inr >= 0),
  ADD COLUMN IF NOT EXISTS balance_due_days     smallint CHECK (balance_due_days BETWEEN 0 AND 365),  -- days before start
  ADD COLUMN IF NOT EXISTS course_map_url       text;                          -- per-distance map

DO $$ BEGIN
  ALTER TABLE event_categories ADD CONSTRAINT event_categories_sport_details_object
    CHECK (jsonb_typeof(sport_details) = 'object');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE event_categories ADD CONSTRAINT event_categories_compare_above_price
    CHECK (compare_at_price_inr IS NULL OR price_inr IS NULL OR compare_at_price_inr > price_inr);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE event_categories ADD CONSTRAINT event_categories_session_range
    CHECK (session_starts_on IS NULL OR session_ends_on IS NULL OR session_ends_on >= session_starts_on);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE event_categories ADD CONSTRAINT event_categories_deposit_within_price
    CHECK (deposit_inr IS NULL OR price_inr IS NULL OR deposit_inr <= price_inr);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

COMMENT ON COLUMN event_categories.sport_details IS
  'Per-sport facts for one ticket type, keyed by the parent events.sport_type; validated in code. Optional "v": 1. '
  'running {pacers: [text], qualifying_window: {from: date, to: date}, itra_points: int, utmb_index: int}; '
  'triathlon {legs: [{sport: swim|bike|run, km: num, cutoff_minutes: int}]}; '
  'water {swim_ability_declaration_m: int}; '
  'trekking {age_medical_rule: text}; '
  'skating {discipline: speed_rink|speed_road|artistic|inline_freestyle|skateboard_street|park|vert, '
  'skate_type: quad|recreational_inline|professional_inline, federation_age_group: text, race_events: [text]}; '
  'athletics {event: text, implement_spec: text, entry_fee_per_event_inr: int, masters_age_band: text}; '
  'martial_arts {event_type: kata|kumite|team_kata|team_kumite, weight_class_kg: {min: num, max: num}, '
  'belt_min: text, belt_max: text, allowed_katas: [text], bout_format: text}; '
  'racquet {event_type: singles|doubles|mixed_doubles|team, shuttle_or_ball: text, price_unit: per_player|per_pair|per_team, '
  'combined_min_age: int}; '
  'fitness {division: text, standards: object, price_per_athlete: bool}; '
  'adventure {course_length_km: num, time_limit_hours: num}.';
COMMENT ON COLUMN event_categories.is_timed IS 'NULL = inherit events.is_chip_timed.';

-- ---------------------------------------------------------------------------
-- 3. New event child tables (GA-046 section 2, child tables)
-- ---------------------------------------------------------------------------

-- Prizes and podiums. One row per prize line: "Top 3 per age band, medal + trophy" or "1st, Rs 10,000".
CREATE TABLE IF NOT EXISTS event_awards (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id           uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  category_id        uuid REFERENCES event_categories (id) ON DELETE CASCADE,     -- NULL = all categories
  scope              text NOT NULL DEFAULT 'overall' CHECK (scope IN ('overall', 'age_band', 'team', 'special')),
  age_band           text,                                                        -- '36-<45', '70+'
  gender             text CHECK (gender IN ('open', 'female', 'male', 'mixed')),
  position_from      smallint NOT NULL DEFAULT 1 CHECK (position_from BETWEEN 1 AND 100),
  position_to        smallint NOT NULL DEFAULT 1 CHECK (position_to BETWEEN 1 AND 100),
  cash_inr           integer CHECK (cash_inr >= 0),                               -- per position in the range
  prize_text         text,                                                        -- 'Medal + trophy'
  min_entries_female smallint CHECK (min_entries_female >= 0),                    -- award only if at least N entries
  min_entries_male   smallint CHECK (min_entries_male >= 0),
  sort_order         integer NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CHECK (position_to >= position_from)
);
CREATE INDEX IF NOT EXISTS idx_event_awards ON event_awards (event_id, sort_order);

-- Checkpoints / controls / aid stations with their own cut-offs (Audax CPs, IRONMAN leg cut-offs).
CREATE TABLE IF NOT EXISTS event_checkpoints (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id             uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  category_id          uuid REFERENCES event_categories (id) ON DELETE CASCADE,   -- NULL = shared by all distances
  seq                  smallint NOT NULL DEFAULT 1 CHECK (seq >= 0),
  name                 text NOT NULL,                                             -- 'CP2', 'T1', 'Aid station 3'
  km                   numeric(7,3) CHECK (km >= 0),
  location             text,
  geo_location         geography(Point, 4326),
  cutoff_at            timestamptz,
  cutoff_after_minutes integer CHECK (cutoff_after_minutes > 0),                  -- from the category start
  services             text[] NOT NULL DEFAULT '{}',
  notes                text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  CHECK (cutoff_at IS NULL OR cutoff_after_minutes IS NULL),
  CHECK (services <@ ARRAY['water', 'electrolyte', 'food', 'medical', 'crew_access', 'timing_mat', 'toilets',
                           'drop_bag', 'mechanical', 'shelter']::text[])
);
CREATE INDEX IF NOT EXISTS idx_event_checkpoints ON event_checkpoints (event_id, seq);

-- Public documents and links (rules PDF, athlete guide, circular, waiver PDF, GPX). event_documents (0023)
-- is private compliance paperwork and stays separate.
CREATE TABLE IF NOT EXISTS event_resources (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  category_id uuid REFERENCES event_categories (id) ON DELETE CASCADE,   -- e.g. a GPX for one distance
  kind        text NOT NULL DEFAULT 'other' CHECK (kind IN ('rules', 'athlete_guide', 'circular', 'waiver_pdf', 'gpx',
                                                           'route_map', 'prospectus', 'results', 'other')),
  label       text NOT NULL CHECK (char_length(label) <= 200),
  url         text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_event_resources ON event_resources (event_id, sort_order);

-- Public audience offers (women 50% off, group of 10, corporate). Display data; private promo codes stay in
-- coupons. Checkout enforcement of an offer is backend work, not this table's job.
CREATE TABLE IF NOT EXISTS event_offers (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  category_id    uuid REFERENCES event_categories (id) ON DELETE CASCADE,   -- NULL = every ticket type
  label          text NOT NULL CHECK (char_length(label) <= 200),
  audience       text NOT NULL DEFAULT 'everyone' CHECK (audience IN ('everyone', 'women', 'senior', 'group', 'corporate',
                                                                     'student', 'club', 'defence', 'kids')),
  discount_type  text NOT NULL CHECK (discount_type IN ('percent', 'flat')),
  discount_value integer NOT NULL CHECK (discount_value > 0),
  min_qty        smallint NOT NULL DEFAULT 1 CHECK (min_qty >= 1),
  valid_from     timestamptz,
  valid_until    timestamptz,
  terms          text,                                                       -- 'Carry a student ID at bib collection'
  is_active      boolean NOT NULL DEFAULT true,
  sort_order     integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  CHECK (discount_type <> 'percent' OR discount_value <= 100),
  CHECK (valid_from IS NULL OR valid_until IS NULL OR valid_until >= valid_from)
);
CREATE INDEX IF NOT EXISTS idx_event_offers ON event_offers (event_id, sort_order);

-- Day-by-day plan for treks, multi-day rides and stage races.
CREATE TABLE IF NOT EXISTS event_itinerary_days (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id         uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  day_no           smallint NOT NULL CHECK (day_no BETWEEN 1 AND 60),
  title            text NOT NULL,                                -- 'Sankri to Juda ka Talab'
  description      text,
  distance_km      numeric(6,2) CHECK (distance_km >= 0),
  duration_text    text,                                         -- '4-5 h'
  start_altitude_m integer CHECK (start_altitude_m BETWEEN -500 AND 9000),
  end_altitude_m   integer CHECK (end_altitude_m BETWEEN -500 AND 9000),
  meals            text[] NOT NULL DEFAULT '{}',
  stay             text,                                         -- 'Tents, 3 sharing'
  sort_order       integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, day_no),
  CHECK (meals <@ ARRAY['breakfast', 'lunch', 'dinner', 'snacks', 'packed_lunch']::text[])
);
CREATE INDEX IF NOT EXISTS idx_event_itinerary_days ON event_itinerary_days (event_id, sort_order);

DROP TRIGGER IF EXISTS update_event_awards_modtime ON event_awards;
CREATE TRIGGER update_event_awards_modtime BEFORE UPDATE ON event_awards
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
DROP TRIGGER IF EXISTS update_event_checkpoints_modtime ON event_checkpoints;
CREATE TRIGGER update_event_checkpoints_modtime BEFORE UPDATE ON event_checkpoints
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
DROP TRIGGER IF EXISTS update_event_resources_modtime ON event_resources;
CREATE TRIGGER update_event_resources_modtime BEFORE UPDATE ON event_resources
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
DROP TRIGGER IF EXISTS update_event_offers_modtime ON event_offers;
CREATE TRIGGER update_event_offers_modtime BEFORE UPDATE ON event_offers
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
DROP TRIGGER IF EXISTS update_event_itinerary_days_modtime ON event_itinerary_days;
CREATE TRIGGER update_event_itinerary_days_modtime BEFORE UPDATE ON event_itinerary_days
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ---------------------------------------------------------------------------
-- 4. RLS for the event child tables. Same model as 0023: public read follows the parent event's
--    visibility (events RLS from 0022 lets anon see only published + public, or unlisted / invited private);
--    the organiser team manages rows. The backend's service role bypasses RLS and must filter itself.
-- ---------------------------------------------------------------------------

ALTER TABLE event_awards         ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_checkpoints    ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_resources      ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_offers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_itinerary_days ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Awards follow event visibility" ON event_awards;
CREATE POLICY "Awards follow event visibility"
  ON event_awards FOR SELECT USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_awards.event_id));
DROP POLICY IF EXISTS "Organisers manage awards" ON event_awards;
CREATE POLICY "Organisers manage awards"
  ON event_awards FOR ALL
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_awards.event_id AND is_organizer_admin(e.organizer_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM events e WHERE e.id = event_awards.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

DROP POLICY IF EXISTS "Checkpoints follow event visibility" ON event_checkpoints;
CREATE POLICY "Checkpoints follow event visibility"
  ON event_checkpoints FOR SELECT USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_checkpoints.event_id));
DROP POLICY IF EXISTS "Organisers manage checkpoints" ON event_checkpoints;
CREATE POLICY "Organisers manage checkpoints"
  ON event_checkpoints FOR ALL
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_checkpoints.event_id AND is_organizer_admin(e.organizer_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM events e WHERE e.id = event_checkpoints.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

DROP POLICY IF EXISTS "Resources follow event visibility" ON event_resources;
CREATE POLICY "Resources follow event visibility"
  ON event_resources FOR SELECT USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_resources.event_id));
DROP POLICY IF EXISTS "Organisers manage resources" ON event_resources;
CREATE POLICY "Organisers manage resources"
  ON event_resources FOR ALL
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_resources.event_id AND is_organizer_admin(e.organizer_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM events e WHERE e.id = event_resources.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

-- Offers: the public sees active offers only; the organiser team (FOR ALL) also sees paused ones.
DROP POLICY IF EXISTS "Active offers follow event visibility" ON event_offers;
CREATE POLICY "Active offers follow event visibility"
  ON event_offers FOR SELECT
  USING (is_active AND EXISTS (SELECT 1 FROM events e WHERE e.id = event_offers.event_id));
DROP POLICY IF EXISTS "Organisers manage offers" ON event_offers;
CREATE POLICY "Organisers manage offers"
  ON event_offers FOR ALL
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_offers.event_id AND is_organizer_admin(e.organizer_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM events e WHERE e.id = event_offers.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

DROP POLICY IF EXISTS "Itinerary follows event visibility" ON event_itinerary_days;
CREATE POLICY "Itinerary follows event visibility"
  ON event_itinerary_days FOR SELECT USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_itinerary_days.event_id));
DROP POLICY IF EXISTS "Organisers manage the itinerary" ON event_itinerary_days;
CREATE POLICY "Organisers manage the itinerary"
  ON event_itinerary_days FOR ALL
  USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_itinerary_days.event_id AND is_organizer_admin(e.organizer_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM events e WHERE e.id = event_itinerary_days.event_id AND is_organizer_admin(e.organizer_id, auth.uid())));

-- ---------------------------------------------------------------------------
-- 5. Social links: explicit typed columns on organizers and events (ADR-009 decision 5).
--    Stored as full URLs; the hashtag without the leading '#'.
-- ---------------------------------------------------------------------------

ALTER TABLE organizers
  ADD COLUMN IF NOT EXISTS facebook_url  text,
  ADD COLUMN IF NOT EXISTS youtube_url   text,
  ADD COLUMN IF NOT EXISTS x_url         text,
  ADD COLUMN IF NOT EXISTS linkedin_url  text,
  ADD COLUMN IF NOT EXISTS strava_url    text,
  ADD COLUMN IF NOT EXISTS whatsapp_url  text;

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS facebook_url  text,
  ADD COLUMN IF NOT EXISTS youtube_url   text,
  ADD COLUMN IF NOT EXISTS x_url         text,
  ADD COLUMN IF NOT EXISTS linkedin_url  text,
  ADD COLUMN IF NOT EXISTS strava_url    text,
  ADD COLUMN IF NOT EXISTS hashtag       text;

DO $$ BEGIN
  ALTER TABLE events ADD CONSTRAINT events_hashtag_format CHECK (hashtag IS NULL OR hashtag ~ '^[A-Za-z0-9_]{1,100}$');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- 6. Clubs and training centres (academies, coaches, rinks, dojos): detail-page columns (GA-032).
--    Trust fields (verification, safeguarding, affiliation_verified, ratings) are staff-set and guarded below.
-- ---------------------------------------------------------------------------

ALTER TABLE clubs
  ADD COLUMN IF NOT EXISTS locality                text,                       -- 'Baner'
  ADD COLUMN IF NOT EXISTS address                 text,
  ADD COLUMN IF NOT EXISTS pincode                 text CHECK (pincode IS NULL OR pincode ~ '^[1-9][0-9]{5}$'),
  ADD COLUMN IF NOT EXISTS contact_phone           text,
  ADD COLUMN IF NOT EXISTS facebook_url            text,
  ADD COLUMN IF NOT EXISTS youtube_url             text,
  ADD COLUMN IF NOT EXISTS x_url                   text,
  ADD COLUMN IF NOT EXISTS linkedin_url            text,
  ADD COLUMN IF NOT EXISTS strava_url              text,
  ADD COLUMN IF NOT EXISTS levels                  text[]   NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS languages               text[]   NOT NULL DEFAULT '{}',   -- lowercase English names: hindi, marathi
  ADD COLUMN IF NOT EXISTS established_year        smallint CHECK (established_year BETWEEN 1850 AND 2100),
  ADD COLUMN IF NOT EXISTS fee_from_inr            integer  CHECK (fee_from_inr >= 0),  -- NULL = "Ask for fees"
  ADD COLUMN IF NOT EXISTS fee_unit                text,
  ADD COLUMN IF NOT EXISTS trial_available         boolean  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS trial_fee_inr           integer  CHECK (trial_fee_inr >= 0), -- 0 = free trial
  ADD COLUMN IF NOT EXISTS trial_notes             text,
  ADD COLUMN IF NOT EXISTS facilities              text[]   NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS affiliation_body        text,                       -- free text: federations differ by sport
  ADD COLUMN IF NOT EXISTS affiliation_number      text,
  ADD COLUMN IF NOT EXISTS affiliation_verified    boolean  NOT NULL DEFAULT false,   -- staff
  ADD COLUMN IF NOT EXISTS verified_at             timestamptz,                -- staff
  ADD COLUMN IF NOT EXISTS verification_checks     text[]   NOT NULL DEFAULT '{}',   -- staff: what was checked
  ADD COLUMN IF NOT EXISTS safeguarding_status     text     NOT NULL DEFAULT 'not_declared',  -- staff
  ADD COLUMN IF NOT EXISTS safeguarding_checked_at timestamptz,                -- staff
  ADD COLUMN IF NOT EXISTS rating_avg              numeric(2,1),               -- trigger-maintained
  ADD COLUMN IF NOT EXISTS rating_count            integer  NOT NULL DEFAULT 0;

ALTER TABLE training_centers
  ADD COLUMN IF NOT EXISTS center_type             text     NOT NULL DEFAULT 'academy',
  ADD COLUMN IF NOT EXISTS locality                text,
  ADD COLUMN IF NOT EXISTS pincode                 text CHECK (pincode IS NULL OR pincode ~ '^[1-9][0-9]{5}$'),
  ADD COLUMN IF NOT EXISTS venue_notes             text,                       -- parking, transport, entrance
  ADD COLUMN IF NOT EXISTS whatsapp_url            text,
  ADD COLUMN IF NOT EXISTS instagram_url           text,
  ADD COLUMN IF NOT EXISTS facebook_url            text,
  ADD COLUMN IF NOT EXISTS youtube_url             text,
  ADD COLUMN IF NOT EXISTS x_url                   text,
  ADD COLUMN IF NOT EXISTS linkedin_url            text,
  ADD COLUMN IF NOT EXISTS strava_url              text,
  ADD COLUMN IF NOT EXISTS levels                  text[]   NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS languages               text[]   NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS delivery_modes          text[]   NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS established_year        smallint CHECK (established_year BETWEEN 1850 AND 2100),
  ADD COLUMN IF NOT EXISTS fee_from_inr            integer  CHECK (fee_from_inr >= 0),
  ADD COLUMN IF NOT EXISTS fee_unit                text,
  ADD COLUMN IF NOT EXISTS trial_available         boolean  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS trial_fee_inr           integer  CHECK (trial_fee_inr >= 0),
  ADD COLUMN IF NOT EXISTS trial_notes             text,
  ADD COLUMN IF NOT EXISTS facilities              text[]   NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS makeup_policy           text,                       -- missed-class make-up
  ADD COLUMN IF NOT EXISTS cancellation_policy     text,
  ADD COLUMN IF NOT EXISTS refund_policy           text,
  ADD COLUMN IF NOT EXISTS affiliation_body        text,
  ADD COLUMN IF NOT EXISTS affiliation_number      text,
  ADD COLUMN IF NOT EXISTS affiliation_verified    boolean  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verified_at             timestamptz,
  ADD COLUMN IF NOT EXISTS verification_checks     text[]   NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS safeguarding_status     text     NOT NULL DEFAULT 'not_declared',
  ADD COLUMN IF NOT EXISTS safeguarding_checked_at timestamptz,
  ADD COLUMN IF NOT EXISTS rating_avg              numeric(2,1),
  ADD COLUMN IF NOT EXISTS rating_count            integer  NOT NULL DEFAULT 0;

-- Vocabularies, shared by both tables. Named constraints so re-runs are no-ops.
DO $$ BEGIN
  ALTER TABLE clubs ADD CONSTRAINT clubs_levels_known
    CHECK (levels <@ ARRAY['beginner', 'intermediate', 'advanced', 'elite']::text[]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE training_centers ADD CONSTRAINT training_centers_levels_known
    CHECK (levels <@ ARRAY['beginner', 'intermediate', 'advanced', 'elite']::text[]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE clubs ADD CONSTRAINT clubs_fee_unit_known CHECK (fee_unit IS NULL OR fee_unit IN
    ('per_session', 'per_month', 'per_quarter', 'per_year', 'per_pack', 'per_programme'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE training_centers ADD CONSTRAINT training_centers_fee_unit_known CHECK (fee_unit IS NULL OR fee_unit IN
    ('per_session', 'per_month', 'per_quarter', 'per_year', 'per_pack', 'per_programme'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE clubs ADD CONSTRAINT clubs_facilities_known CHECK (facilities <@ ARRAY[
    'parking', 'changing_rooms', 'showers', 'toilets', 'drinking_water', 'lockers', 'first_aid', 'cafe',
    'floodlights', 'indoor', 'outdoor', 'synthetic_track', 'turf', 'rink', 'pool', 'gym', 'wheelchair_access',
    'waiting_area', 'equipment_rental']::text[]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE training_centers ADD CONSTRAINT training_centers_facilities_known CHECK (facilities <@ ARRAY[
    'parking', 'changing_rooms', 'showers', 'toilets', 'drinking_water', 'lockers', 'first_aid', 'cafe',
    'floodlights', 'indoor', 'outdoor', 'synthetic_track', 'turf', 'rink', 'pool', 'gym', 'wheelchair_access',
    'waiting_area', 'equipment_rental']::text[]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE clubs ADD CONSTRAINT clubs_verification_checks_known CHECK (verification_checks <@ ARRAY[
    'phone', 'email', 'govt_id', 'address', 'affiliation', 'coach_credentials', 'site_visit', 'police_verification']::text[]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE training_centers ADD CONSTRAINT training_centers_verification_checks_known CHECK (verification_checks <@ ARRAY[
    'phone', 'email', 'govt_id', 'address', 'affiliation', 'coach_credentials', 'site_visit', 'police_verification']::text[]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE clubs ADD CONSTRAINT clubs_safeguarding_status_known
    CHECK (safeguarding_status IN ('not_declared', 'declared', 'verified', 'expired'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE training_centers ADD CONSTRAINT training_centers_safeguarding_status_known
    CHECK (safeguarding_status IN ('not_declared', 'declared', 'verified', 'expired'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE training_centers ADD CONSTRAINT training_centers_center_type_known
    CHECK (center_type IN ('academy', 'coach', 'club', 'rink', 'dojo', 'studio', 'pool', 'venue', 'other'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE training_centers ADD CONSTRAINT training_centers_delivery_modes_known
    CHECK (delivery_modes <@ ARRAY['in_person', 'online', 'at_home']::text[]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_clubs_levels            ON clubs            USING GIN (levels);
CREATE INDEX IF NOT EXISTS idx_training_centers_levels ON training_centers USING GIN (levels);
CREATE INDEX IF NOT EXISTS idx_training_centers_trial  ON training_centers (city) WHERE trial_available;

COMMENT ON COLUMN training_centers.safeguarding_status IS
  'Staff-set. Do not display to the public until the legal evidence standard for coaches of under-18s is decided (ADR-008).';
COMMENT ON COLUMN clubs.safeguarding_status IS
  'Staff-set. Do not display to the public until the legal evidence standard for coaches of under-18s is decided (ADR-008).';

-- Staff-only trust fields. A non-staff session (club owner, club admin) cannot set or change them.
-- Also closes an existing gap: since 0011 a club owner could set clubs.is_verified and member_count directly.
CREATE OR REPLACE FUNCTION guard_club_trust_fields()
RETURNS trigger AS $$
BEGIN
  IF NOT is_staff_session() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.is_verified := false; NEW.member_count := 0;
      NEW.verified_at := NULL; NEW.verification_checks := '{}';
      NEW.safeguarding_status := 'not_declared'; NEW.safeguarding_checked_at := NULL;
      NEW.affiliation_verified := false; NEW.rating_avg := NULL; NEW.rating_count := 0;
    ELSE
      NEW.is_verified := OLD.is_verified; NEW.member_count := OLD.member_count;
      NEW.verified_at := OLD.verified_at; NEW.verification_checks := OLD.verification_checks;
      NEW.safeguarding_status := OLD.safeguarding_status; NEW.safeguarding_checked_at := OLD.safeguarding_checked_at;
      NEW.affiliation_verified := OLD.affiliation_verified;
      NEW.rating_avg := OLD.rating_avg; NEW.rating_count := OLD.rating_count;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_club_trust_fields_trg ON clubs;
CREATE TRIGGER guard_club_trust_fields_trg
  BEFORE INSERT OR UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION guard_club_trust_fields();

CREATE OR REPLACE FUNCTION guard_training_center_trust_fields()
RETURNS trigger AS $$
BEGIN
  IF NOT is_staff_session() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.is_verified := false; NEW.is_certified := false;
      NEW.verified_at := NULL; NEW.verification_checks := '{}';
      NEW.safeguarding_status := 'not_declared'; NEW.safeguarding_checked_at := NULL;
      NEW.affiliation_verified := false; NEW.rating_avg := NULL; NEW.rating_count := 0;
    ELSE
      NEW.is_verified := OLD.is_verified; NEW.is_certified := OLD.is_certified;
      NEW.verified_at := OLD.verified_at; NEW.verification_checks := OLD.verification_checks;
      NEW.safeguarding_status := OLD.safeguarding_status; NEW.safeguarding_checked_at := OLD.safeguarding_checked_at;
      NEW.affiliation_verified := OLD.affiliation_verified;
      NEW.rating_avg := OLD.rating_avg; NEW.rating_count := OLD.rating_count;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_training_center_trust_fields_trg ON training_centers;
CREATE TRIGGER guard_training_center_trust_fields_trg
  BEFORE INSERT OR UPDATE ON training_centers FOR EACH ROW EXECUTE FUNCTION guard_training_center_trust_fields();

-- No new write policy on training_centers: since 0011 only staff and the backend (service role) write centres.
-- Whether a claimed owner may self-edit is an open item in ADR-009; the guard above is ready for it.

-- ---------------------------------------------------------------------------
-- 7. Listing helpers for the centre child tables. A child row belongs to exactly one parent:
--    a training centre OR a club.
-- ---------------------------------------------------------------------------

-- SECURITY DEFINER so it can see inactive parents and club_members without RLS recursion (same reason as
-- is_club_admin in 0011). It only answers yes/no for the calling user.
CREATE OR REPLACE FUNCTION can_manage_listing(p_training_center uuid, p_club uuid)
RETURNS boolean AS $$
  SELECT has_role(auth.uid(), 'moderator')
      OR EXISTS (SELECT 1 FROM training_centers t
                 WHERE t.id = p_training_center AND t.owner_id IS NOT NULL AND t.owner_id = auth.uid())
      OR EXISTS (SELECT 1 FROM clubs c
                 WHERE c.id = p_club AND ((c.owner_id IS NOT NULL AND c.owner_id = auth.uid())
                                          OR is_club_admin(c.id, auth.uid())));
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION can_manage_listing(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION can_manage_listing(uuid, uuid) TO authenticated, anon, service_role;

-- Invoker rights on purpose: it reads parents through their own RLS (active rows only for the public).
CREATE OR REPLACE FUNCTION listing_is_active(p_training_center uuid, p_club uuid)
RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM training_centers t WHERE t.id = p_training_center AND t.is_active)
      OR EXISTS (SELECT 1 FROM clubs c WHERE c.id = p_club AND c.is_active);
$$ LANGUAGE sql STABLE SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION listing_is_active(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION listing_is_active(uuid, uuid) TO authenticated, anon, service_role;

-- ---------------------------------------------------------------------------
-- 8. Centre child tables: batches, coaches, media, reviews
-- ---------------------------------------------------------------------------

-- Batches and timings shown on the profile (Phase 1 "find a coach", ADR-008). Not bookable: enrolment
-- (ADR-008 training_enrolments) is not created here.
CREATE TABLE IF NOT EXISTS center_batches (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_center_id uuid REFERENCES training_centers (id) ON DELETE CASCADE,
  club_id            uuid REFERENCES clubs (id) ON DELETE CASCADE,
  title              text NOT NULL,                                -- 'Junior sprint group'
  discipline_slug    text REFERENCES disciplines (slug) ON DELETE SET NULL,
  level              text CHECK (level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  age_categories     age_category[] NOT NULL DEFAULT '{}',
  min_age            smallint CHECK (min_age BETWEEN 0 AND 120),
  max_age            smallint CHECK (max_age BETWEEN 0 AND 120),
  gender             text NOT NULL DEFAULT 'open' CHECK (gender IN ('open', 'female', 'male', 'mixed')),  -- female = girls/women-only
  days_of_week       smallint[] NOT NULL DEFAULT '{}',             -- ISO: 1 = Monday ... 7 = Sunday
  start_time         time,
  end_time           time,
  venue              text,                                         -- when not the main address
  fee_inr            integer CHECK (fee_inr >= 0),                 -- NULL = "Ask for fees"
  fee_unit           text CHECK (fee_unit IN ('per_session', 'per_month', 'per_quarter', 'per_year', 'per_pack', 'per_programme')),
  capacity           integer CHECK (capacity > 0),
  trial_available    boolean NOT NULL DEFAULT false,
  is_active          boolean NOT NULL DEFAULT true,
  sort_order         integer NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(training_center_id, club_id) = 1),
  CHECK (min_age IS NULL OR max_age IS NULL OR max_age >= min_age),
  CHECK (days_of_week <@ ARRAY[1, 2, 3, 4, 5, 6, 7]::smallint[])
);
CREATE INDEX IF NOT EXISTS idx_center_batches_center ON center_batches (training_center_id, sort_order) WHERE training_center_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_center_batches_club   ON center_batches (club_id, sort_order)            WHERE club_id IS NOT NULL;

-- Coaches with credentials. credential_verified is staff-set (guard below).
CREATE TABLE IF NOT EXISTS center_coaches (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_center_id  uuid REFERENCES training_centers (id) ON DELETE CASCADE,
  club_id             uuid REFERENCES clubs (id) ON DELETE CASCADE,
  profile_id          uuid REFERENCES profiles (id) ON DELETE SET NULL,   -- when the coach has an account
  name                text NOT NULL,
  role_title          text,                                               -- 'Head coach'
  bio                 text CHECK (char_length(bio) <= 2000),
  photo_url           text,
  credential          text,                                               -- 'AFI Level-1 coach'
  certifying_body     text,                                               -- 'AFI', 'NIS Patiala', 'BAI'
  credential_verified boolean NOT NULL DEFAULT false,
  years_experience    smallint CHECK (years_experience BETWEEN 0 AND 80),
  languages           text[] NOT NULL DEFAULT '{}',
  sort_order          integer NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(training_center_id, club_id) = 1)
);
CREATE INDEX IF NOT EXISTS idx_center_coaches_center ON center_coaches (training_center_id, sort_order) WHERE training_center_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_center_coaches_club   ON center_coaches (club_id, sort_order)            WHERE club_id IS NOT NULL;

-- Gallery, pre-moderated like event_media (0017): uploads stay 'pending' until a moderator publishes.
CREATE TABLE IF NOT EXISTS center_media (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_center_id uuid REFERENCES training_centers (id) ON DELETE CASCADE,
  club_id            uuid REFERENCES clubs (id) ON DELETE CASCADE,
  uploaded_by        uuid REFERENCES profiles (id) ON DELETE SET NULL,
  url                text NOT NULL,
  kind               text NOT NULL DEFAULT 'photo' CHECK (kind IN ('photo', 'video')),
  caption            text CHECK (char_length(caption) <= 300),
  credit             text,
  is_cover           boolean NOT NULL DEFAULT false,
  status             moderation_status NOT NULL DEFAULT 'pending',
  sort_order         integer NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(training_center_id, club_id) = 1)
);
CREATE INDEX IF NOT EXISTS idx_center_media_center ON center_media (training_center_id, sort_order) WHERE training_center_id IS NOT NULL AND status = 'published';
CREATE INDEX IF NOT EXISTS idx_center_media_club   ON center_media (club_id, sort_order)            WHERE club_id IS NOT NULL AND status = 'published';

-- Reviews, post-moderated like event_reviews (0017). No review table existed for clubs or centres.
-- Plain UNIQUE constraints: NULLs are distinct, so each enforces one review per user per parent.
CREATE TABLE IF NOT EXISTS center_reviews (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_center_id uuid REFERENCES training_centers (id) ON DELETE CASCADE,
  club_id            uuid REFERENCES clubs (id) ON DELETE CASCADE,
  user_id            uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  rating             smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title              text CHECK (char_length(title) <= 120),
  body               text CHECK (char_length(body) <= 4000),
  status             moderation_status NOT NULL DEFAULT 'published',
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(training_center_id, club_id) = 1),
  CONSTRAINT center_reviews_center_user_key UNIQUE (training_center_id, user_id),
  CONSTRAINT center_reviews_club_user_key   UNIQUE (club_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_center_reviews_club ON center_reviews (club_id) WHERE club_id IS NOT NULL;

DROP TRIGGER IF EXISTS update_center_batches_modtime ON center_batches;
CREATE TRIGGER update_center_batches_modtime BEFORE UPDATE ON center_batches
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
DROP TRIGGER IF EXISTS update_center_coaches_modtime ON center_coaches;
CREATE TRIGGER update_center_coaches_modtime BEFORE UPDATE ON center_coaches
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
DROP TRIGGER IF EXISTS update_center_media_modtime ON center_media;
CREATE TRIGGER update_center_media_modtime BEFORE UPDATE ON center_media
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
DROP TRIGGER IF EXISTS update_center_reviews_modtime ON center_reviews;
CREATE TRIGGER update_center_reviews_modtime BEFORE UPDATE ON center_reviews
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Moderation guards (guard_moderation_status from 0017: a non-staff session cannot choose or change status).
DROP TRIGGER IF EXISTS guard_center_media_status ON center_media;
CREATE TRIGGER guard_center_media_status
  BEFORE INSERT OR UPDATE ON center_media FOR EACH ROW EXECUTE FUNCTION guard_moderation_status('pending');
DROP TRIGGER IF EXISTS guard_center_reviews_status ON center_reviews;
CREATE TRIGGER guard_center_reviews_status
  BEFORE INSERT OR UPDATE ON center_reviews FOR EACH ROW EXECUTE FUNCTION guard_moderation_status('published');

CREATE OR REPLACE FUNCTION guard_center_coach_verification()
RETURNS trigger AS $$
BEGIN
  IF NOT is_staff_session() THEN
    NEW.credential_verified := CASE WHEN TG_OP = 'INSERT' THEN false ELSE OLD.credential_verified END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_center_coach_verification_trg ON center_coaches;
CREATE TRIGGER guard_center_coach_verification_trg
  BEFORE INSERT OR UPDATE ON center_coaches FOR EACH ROW EXECUTE FUNCTION guard_center_coach_verification();

-- Keep clubs / training_centers rating_avg and rating_count right. SECURITY DEFINER (as refresh_event_rating in
-- 0017): reviewers cannot update the parent, and running as the owner passes the trust-field guards above.
CREATE OR REPLACE FUNCTION refresh_center_rating()
RETURNS trigger AS $$
DECLARE
  tc uuid := COALESCE(NEW.training_center_id, OLD.training_center_id);
  cl uuid := COALESCE(NEW.club_id, OLD.club_id);
BEGIN
  IF tc IS NOT NULL THEN
    UPDATE training_centers t
    SET rating_count = s.n,
        rating_avg   = CASE WHEN s.n = 0 THEN NULL ELSE round(s.avg_rating, 1) END
    FROM (SELECT count(*) AS n, avg(rating)::numeric AS avg_rating
          FROM center_reviews WHERE training_center_id = tc AND status = 'published') s
    WHERE t.id = tc;
  END IF;
  IF cl IS NOT NULL THEN
    UPDATE clubs c
    SET rating_count = s.n,
        rating_avg   = CASE WHEN s.n = 0 THEN NULL ELSE round(s.avg_rating, 1) END
    FROM (SELECT count(*) AS n, avg(rating)::numeric AS avg_rating
          FROM center_reviews WHERE club_id = cl AND status = 'published') s
    WHERE c.id = cl;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION refresh_center_rating() FROM PUBLIC;

DROP TRIGGER IF EXISTS refresh_center_rating_trg ON center_reviews;
CREATE TRIGGER refresh_center_rating_trg
  AFTER INSERT OR DELETE OR UPDATE OF rating, status ON center_reviews
  FOR EACH ROW EXECUTE FUNCTION refresh_center_rating();

-- RLS ---------------------------------------------------------------------------------------------
ALTER TABLE center_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_media   ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active batches of active listings are readable" ON center_batches;
CREATE POLICY "Active batches of active listings are readable"
  ON center_batches FOR SELECT USING (is_active AND listing_is_active(training_center_id, club_id));
DROP POLICY IF EXISTS "Listing managers manage batches" ON center_batches;
CREATE POLICY "Listing managers manage batches"
  ON center_batches FOR ALL
  USING (can_manage_listing(training_center_id, club_id))
  WITH CHECK (can_manage_listing(training_center_id, club_id));

DROP POLICY IF EXISTS "Coaches of active listings are readable" ON center_coaches;
CREATE POLICY "Coaches of active listings are readable"
  ON center_coaches FOR SELECT USING (listing_is_active(training_center_id, club_id));
DROP POLICY IF EXISTS "Listing managers manage coaches" ON center_coaches;
CREATE POLICY "Listing managers manage coaches"
  ON center_coaches FOR ALL
  USING (can_manage_listing(training_center_id, club_id))
  WITH CHECK (can_manage_listing(training_center_id, club_id));

DROP POLICY IF EXISTS "Published media of active listings is readable" ON center_media;
CREATE POLICY "Published media of active listings is readable"
  ON center_media FOR SELECT
  USING ((status = 'published' AND listing_is_active(training_center_id, club_id))
         OR auth.uid() = uploaded_by OR has_role(auth.uid(), 'moderator')
         OR can_manage_listing(training_center_id, club_id));
DROP POLICY IF EXISTS "Listing managers upload media" ON center_media;
CREATE POLICY "Listing managers upload media"
  ON center_media FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by AND can_manage_listing(training_center_id, club_id));
DROP POLICY IF EXISTS "Listing managers edit media" ON center_media;
CREATE POLICY "Listing managers edit media"
  ON center_media FOR UPDATE
  USING (can_manage_listing(training_center_id, club_id))
  WITH CHECK (can_manage_listing(training_center_id, club_id));
DROP POLICY IF EXISTS "Uploaders and listing managers delete media" ON center_media;
CREATE POLICY "Uploaders and listing managers delete media"
  ON center_media FOR DELETE
  USING (auth.uid() = uploaded_by OR can_manage_listing(training_center_id, club_id));

DROP POLICY IF EXISTS "Published reviews of active listings are readable" ON center_reviews;
CREATE POLICY "Published reviews of active listings are readable"
  ON center_reviews FOR SELECT
  USING ((status = 'published' AND listing_is_active(training_center_id, club_id))
         OR auth.uid() = user_id OR has_role(auth.uid(), 'moderator'));
DROP POLICY IF EXISTS "Users write their own centre review" ON center_reviews;
CREATE POLICY "Users write their own centre review"
  ON center_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id AND listing_is_active(training_center_id, club_id));
DROP POLICY IF EXISTS "Users edit their own centre review" ON center_reviews;
CREATE POLICY "Users edit their own centre review"
  ON center_reviews FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users delete their own centre review" ON center_reviews;
CREATE POLICY "Users delete their own centre review"
  ON center_reviews FOR DELETE USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 9. Gear: product detail-page fields still missing (0020/0021 have brand, image_urls, sport_types,
--     discipline_slugs, age_categories, mrp_inr, weight_grams, ratings; sellers have return/shipping policy).
-- ---------------------------------------------------------------------------

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS specs                  jsonb    NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS size_chart             jsonb,
  ADD COLUMN IF NOT EXISTS highlights             text[]   NOT NULL DEFAULT '{}',   -- 3-6 short bullet points
  ADD COLUMN IF NOT EXISTS video_urls             text[]   NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gender                 text CHECK (gender IN ('men', 'women', 'unisex', 'boys', 'girls', 'kids')),
  -- "Gear for your event": match against event_categories.distance_km.
  ADD COLUMN IF NOT EXISTS suited_distance_min_km numeric(7,3) CHECK (suited_distance_min_km >= 0),
  ADD COLUMN IF NOT EXISTS suited_distance_max_km numeric(7,3) CHECK (suited_distance_max_km >= 0),
  ADD COLUMN IF NOT EXISTS suited_terrains        text[]   NOT NULL DEFAULT '{}',   -- road, trail, track, ...
  -- Delivery, returns, warranty: product-level, overriding the seller defaults when set.
  ADD COLUMN IF NOT EXISTS delivery_info          text,
  ADD COLUMN IF NOT EXISTS is_returnable          boolean,                          -- NULL = seller policy applies
  ADD COLUMN IF NOT EXISTS return_window_days     smallint CHECK (return_window_days BETWEEN 0 AND 365),
  ADD COLUMN IF NOT EXISTS returns_info           text,
  ADD COLUMN IF NOT EXISTS warranty_months        smallint CHECK (warranty_months BETWEEN 0 AND 240),
  ADD COLUMN IF NOT EXISTS warranty_info          text,
  -- India Legal Metrology (Packaged Commodities) declarations for e-commerce listings.
  ADD COLUMN IF NOT EXISTS country_of_origin      text,
  ADD COLUMN IF NOT EXISTS manufacturer_info      text;

DO $$ BEGIN
  ALTER TABLE products ADD CONSTRAINT products_specs_object CHECK (jsonb_typeof(specs) = 'object');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE products ADD CONSTRAINT products_size_chart_object
    CHECK (size_chart IS NULL OR jsonb_typeof(size_chart) = 'object');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE products ADD CONSTRAINT products_suited_distance_range
    CHECK (suited_distance_min_km IS NULL OR suited_distance_max_km IS NULL OR suited_distance_max_km >= suited_distance_min_km);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE products ADD CONSTRAINT products_suited_terrains_known CHECK (suited_terrains <@ ARRAY[
    'road', 'trail', 'track', 'treadmill', 'mixed', 'gym', 'court', 'pool', 'open_water', 'snow', 'rink']::text[]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

COMMENT ON COLUMN products.specs IS
  'Spec table for the product page. {"groups": [{"name": "Fit", "items": [{"key": "drop_mm", "label": "Heel-to-toe drop", '
  '"value": 8, "unit": "mm"}]}]}. Suggested keys: shoes drop_mm, stack_height_mm, weight_g, cushioning, width, '
  'upper, outsole, plate; apparel fabric, fit, gsm, reflective; wearables battery_hours, water_rating, gps; '
  'nutrition serving_g, carbs_g, caffeine_mg, sodium_mg, veg (bool).';
COMMENT ON COLUMN products.size_chart IS
  '{"unit": "cm"|"in", "columns": ["UK", "US", "EU", "Foot length (cm)"], "rows": [["6", "7", "40", "25.0"]], '
  '"notes": "Runs half a size small"}.';

-- Editing what a shopper sees on an approved product sends it back to review (0021 rule), now including the
-- new content fields. A separate trigger, named to fire AFTER guard_product_review_trg (triggers fire in name
-- order), so 0021's status-transition check is left untouched.
CREATE OR REPLACE FUNCTION guard_product_detail_review()
RETURNS trigger AS $$
BEGIN
  IF is_staff_session() THEN
    RETURN NEW;
  END IF;
  IF OLD.review_status = 'approved' AND NEW.review_status = 'approved' AND (
       NEW.specs IS DISTINCT FROM OLD.specs OR NEW.size_chart IS DISTINCT FROM OLD.size_chart
    OR NEW.highlights IS DISTINCT FROM OLD.highlights OR NEW.video_urls IS DISTINCT FROM OLD.video_urls
    OR NEW.gender IS DISTINCT FROM OLD.gender
    OR NEW.suited_distance_min_km IS DISTINCT FROM OLD.suited_distance_min_km
    OR NEW.suited_distance_max_km IS DISTINCT FROM OLD.suited_distance_max_km
    OR NEW.suited_terrains IS DISTINCT FROM OLD.suited_terrains
    OR NEW.returns_info IS DISTINCT FROM OLD.returns_info OR NEW.is_returnable IS DISTINCT FROM OLD.is_returnable
    OR NEW.return_window_days IS DISTINCT FROM OLD.return_window_days
    OR NEW.warranty_months IS DISTINCT FROM OLD.warranty_months OR NEW.warranty_info IS DISTINCT FROM OLD.warranty_info
    OR NEW.delivery_info IS DISTINCT FROM OLD.delivery_info
    OR NEW.country_of_origin IS DISTINCT FROM OLD.country_of_origin
    OR NEW.manufacturer_info IS DISTINCT FROM OLD.manufacturer_info) THEN
    NEW.review_status := 'pending_review';
    NEW.submitted_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_product_review_zz_detail_trg ON products;
CREATE TRIGGER guard_product_review_zz_detail_trg
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION guard_product_detail_review();

-- ---------------------------------------------------------------------------
-- 10. Migration history (table created by 0024). Guarded so the file still runs if it is absent.
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  IF to_regclass('supabase_migrations.schema_migrations') IS NOT NULL THEN
    INSERT INTO supabase_migrations.schema_migrations (version, name)
    VALUES ('20261019000026', 'event_page_fields')
    ON CONFLICT (version) DO NOTHING;
  END IF;
END $$;

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification: run AFTER applying (select and run these separately; they change nothing).
-- ---------------------------------------------------------------------------
--
-- 1) Every new column exists. Expect ZERO rows (any row printed is a missing column). 114 columns checked:
--    events 21, event_categories 11, organizers 6, clubs 27, training_centers 33, products 16.
-- WITH expected(t, cols) AS (VALUES
--   ('events', ARRAY['sport_details','mandatory_gear','recommended_gear','fitness_requirement','changes_allowed_until',
--     'kit_collection_mandatory','race_day_collection','gpx_url','elevation_gain_m','sanction_reference','edition_number',
--     'women_safety','sponsorship_contact','closes_when_sold_out','instagram_url','facebook_url','youtube_url','x_url',
--     'linkedin_url','strava_url','hashtag']),
--   ('event_categories', ARRAY['sport_details','is_timed','compare_at_price_inr','excludes','team_composition','ticket_kind',
--     'session_starts_on','session_ends_on','deposit_inr','balance_due_days','course_map_url']),
--   ('organizers', ARRAY['facebook_url','youtube_url','x_url','linkedin_url','strava_url','whatsapp_url']),
--   ('clubs', ARRAY['locality','address','pincode','contact_phone','facebook_url','youtube_url','x_url','linkedin_url',
--     'strava_url','levels','languages','established_year','fee_from_inr','fee_unit','trial_available','trial_fee_inr',
--     'trial_notes','facilities','affiliation_body','affiliation_number','affiliation_verified','verified_at',
--     'verification_checks','safeguarding_status','safeguarding_checked_at','rating_avg','rating_count']),
--   ('training_centers', ARRAY['center_type','locality','pincode','venue_notes','whatsapp_url','instagram_url','facebook_url',
--     'youtube_url','x_url','linkedin_url','strava_url','levels','languages','delivery_modes','established_year',
--     'fee_from_inr','fee_unit','trial_available','trial_fee_inr','trial_notes','facilities','makeup_policy',
--     'cancellation_policy','refund_policy','affiliation_body','affiliation_number','affiliation_verified','verified_at',
--     'verification_checks','safeguarding_status','safeguarding_checked_at','rating_avg','rating_count']),
--   ('products', ARRAY['specs','size_chart','highlights','video_urls','gender','suited_distance_min_km',
--     'suited_distance_max_km','suited_terrains','delivery_info','is_returnable','return_window_days','returns_info',
--     'warranty_months','warranty_info','country_of_origin','manufacturer_info'])
-- )
-- SELECT e.t AS table_name, c AS missing_column
-- FROM expected e CROSS JOIN LATERAL unnest(e.cols) AS c
-- WHERE NOT EXISTS (SELECT 1 FROM information_schema.columns ic
--                   WHERE ic.table_schema = 'public' AND ic.table_name = e.t AND ic.column_name = c);
--
-- 2) New tables exist with RLS on. Expect 9 rows, all relrowsecurity = true.
-- SELECT c.relname, c.relrowsecurity
-- FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
-- WHERE n.nspname = 'public' AND c.relname IN ('event_awards','event_checkpoints','event_resources','event_offers',
--   'event_itinerary_days','center_batches','center_coaches','center_media','center_reviews')
-- ORDER BY c.relname;
--
-- 3) Policies. Expect 22 rows: 2 per event table (10), 2 batches, 2 coaches, 4 media, 4 reviews.
-- SELECT tablename, policyname, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public' AND (tablename IN ('event_awards','event_checkpoints','event_resources','event_offers',
--   'event_itinerary_days','center_batches','center_coaches','center_media','center_reviews'))
-- ORDER BY tablename, policyname;
--
-- 4) Triggers and helper functions.
-- SELECT event_object_table, trigger_name FROM information_schema.triggers
-- WHERE trigger_schema = 'public' AND trigger_name IN ('guard_club_trust_fields_trg','guard_training_center_trust_fields_trg',
--   'guard_center_coach_verification_trg','guard_center_media_status','guard_center_reviews_status',
--   'refresh_center_rating_trg','guard_product_review_zz_detail_trg')
-- ORDER BY 1, 2;
-- SELECT proname FROM pg_proc WHERE proname IN ('can_manage_listing','listing_is_active','refresh_center_rating',
--   'guard_club_trust_fields','guard_training_center_trust_fields','guard_center_coach_verification','guard_product_detail_review');
--
-- 5) Backfill sanity: how many events got a numeric elevation.
-- SELECT count(*) FILTER (WHERE elevation_gain_m IS NOT NULL) AS parsed, count(*) FILTER (WHERE elevation_gain IS NOT NULL) AS with_text
-- FROM events;
--
-- 6) Recorded in migration history.
-- SELECT version, name FROM supabase_migrations.schema_migrations WHERE version = '20261019000026';
