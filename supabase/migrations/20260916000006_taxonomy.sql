-- 0006 — Sport taxonomy: three levels, two axes, plus the age-group axis.
--
-- RUN 0005 FIRST, AS ITS OWN EXECUTION. This file USES the enum values 0005 adds, and Postgres
-- rejects that inside the same transaction as the ALTER TYPE.
--
-- THREE LEVELS (ADR-006)
--   family      9 groups       -- what kind of sport: athletics, endurance, combat, team...
--   category   14 values       -- the sport_category enum stored on events
--   discipline 105 rows        -- what people actually search for: "badminton", not "racquet"
--
-- TWO AXES, because they cross-cut and a flat list cannot express either:
--   family       drives browse, SEO, and the athletics-first ordering
--   event_model  drives card layout, required fields, and homepage rail eligibility
-- Badminton (racquet) and karate (combat) are different families but both bracket tournaments.
-- Running and speed skating are different families but both mass-participation.
--
-- Idempotent and transactional.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. The two axes
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sport_family') THEN
    CREATE TYPE sport_family AS ENUM (
      'athletics', 'endurance', 'skill_artistic', 'combat',
      'racquet', 'outdoor', 'fitness', 'team', 'mind'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_model') THEN
    CREATE TYPE event_model AS ENUM (
      'mass_participation', -- everyone enters, ranked by time
      'meet',               -- multi-discipline, age-group heats
      'bracket',            -- knockout by age or weight category
      'batch_departure',    -- many departure dates (treks)
      'non_competitive',    -- expos, festivals, fun runs
      'league_fixture'      -- team vs team; not an entry product
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discipline_kind') THEN
    -- 'sport'  — a distinct sport within a category. Badminton is not a format of squash.
    -- 'format' — a way of running one sport. A marathon is a format of running.
    -- They belong in different filter groups in the UI; doc 17 conflates them.
    CREATE TYPE discipline_kind AS ENUM ('sport', 'format');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'age_category') THEN
    CREATE TYPE age_category AS ENUM (
      'kids', 'sub_junior', 'junior', 'youth', 'open', 'masters'
    );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 2. sports — one row per sport_category value.
--    `phase` drives ingestion priority and homepage ordering. Athletics is phase 1:
--    this ordering IS the athletics-first positioning, held as data rather than code.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sports (
  slug          sport_category PRIMARY KEY,
  display_name  text         NOT NULL,
  family        sport_family NOT NULL,
  event_model   event_model  NOT NULL,
  phase         smallint     NOT NULL DEFAULT 9,
  is_active     boolean      NOT NULL DEFAULT false,
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now()
);

COMMENT ON TABLE sports IS
  'Category level of the taxonomy (ADR-006). Grouping and ordering are read from here, '
  'never hardcoded in application code.';

INSERT INTO sports (slug, display_name, family, event_model, phase, is_active) VALUES
  ('athletics',    'Athletics',      'athletics',      'meet',               1, true),
  ('running',      'Running',        'athletics',      'mass_participation', 1, true),
  ('cycling',      'Cycling',        'endurance',      'mass_participation', 2, true),
  ('triathlon',    'Triathlon',      'endurance',      'mass_participation', 3, true),
  ('water',        'Water Sports',   'endurance',      'mass_participation', 3, true),
  ('skating',      'Skating',        'skill_artistic', 'meet',               2, true),
  ('gymnastics',   'Gymnastics',     'skill_artistic', 'meet',               2, true),
  ('martial_arts', 'Martial Arts',   'combat',         'bracket',            2, true),
  ('racquet',      'Racquet Sports', 'racquet',        'bracket',            3, true),
  ('trekking',     'Trekking',       'outdoor',        'batch_departure',    3, true),
  ('adventure',    'Adventure',      'outdoor',        'mass_participation', 3, true),
  ('fitness',      'Fitness',        'fitness',        'non_competitive',    4, true),
  ('team_sports',  'Team Sports',    'team',           'league_fixture',     5, false),
  ('mind_sports',  'Mind Sports',    'mind',           'bracket',            5, false)
ON CONFLICT (slug) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  family       = EXCLUDED.family,
  event_model  = EXCLUDED.event_model,
  phase        = EXCLUDED.phase,
  updated_at   = now();
-- is_active is deliberately NOT overwritten, so re-running never silently re-enables
-- a sport that was switched off on purpose.

CREATE INDEX IF NOT EXISTS idx_sports_family_phase ON sports (family, phase);

DROP TRIGGER IF EXISTS update_sports_modtime ON sports;
CREATE TRIGGER update_sports_modtime BEFORE UPDATE ON sports
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ---------------------------------------------------------------------------
-- 3. disciplines — the searchable leaf. The 14 categories above are CATEGORIES:
--    'racquet' silently contains badminton, tennis, table tennis, squash and pickleball.
--    Nobody searches for "racquet". This is also the `tags` level the PRD specified
--    and that was never built (only distance_options shipped, running distances only).
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS disciplines (
  slug          text PRIMARY KEY,
  display_name  text            NOT NULL,
  sport_type    sport_category  NOT NULL REFERENCES sports (slug),
  kind          discipline_kind NOT NULL DEFAULT 'sport',
  aliases       text[]          NOT NULL DEFAULT '{}', -- search synonyms: 'TT', 'kushti', 'BRM'
  is_active     boolean         NOT NULL DEFAULT true,
  created_at    timestamptz     NOT NULL DEFAULT now(),
  updated_at    timestamptz     NOT NULL DEFAULT now()
);

INSERT INTO disciplines (slug, display_name, sport_type, kind, aliases) VALUES
  -- ATHLETICS (track & field) — the wedge
  ('sprints','Sprints','athletics','format','{"100m","200m","400m"}'),
  ('hurdles','Hurdles','athletics','format','{}'),
  ('middle_distance','Middle Distance','athletics','format','{"800m","1500m"}'),
  ('long_distance_track','Long Distance (Track)','athletics','format','{"5000m","10000m"}'),
  ('steeplechase','Steeplechase','athletics','format','{}'),
  ('relays','Relays','athletics','format','{"4x100","4x400"}'),
  ('high_jump','High Jump','athletics','sport','{"jumps"}'),
  ('long_jump','Long Jump','athletics','sport','{"jumps"}'),
  ('triple_jump','Triple Jump','athletics','sport','{"jumps"}'),
  ('pole_vault','Pole Vault','athletics','sport','{"jumps"}'),
  ('shot_put','Shot Put','athletics','sport','{"throws"}'),
  ('discus_throw','Discus Throw','athletics','sport','{"throws"}'),
  ('javelin_throw','Javelin Throw','athletics','sport','{"throws"}'),
  ('hammer_throw','Hammer Throw','athletics','sport','{"throws"}'),
  ('race_walking','Race Walking','athletics','sport','{"walk"}'),
  ('cross_country','Cross Country','athletics','format','{"XC"}'),
  ('combined_events','Combined Events','athletics','format','{"decathlon","heptathlon"}'),
  -- RUNNING (road / trail)
  ('marathon','Marathon','running','format','{"42K","full marathon"}'),
  ('half_marathon','Half Marathon','running','format','{"21K","21.1K"}'),
  ('ten_k','10K','running','format','{"10 km"}'),
  ('five_k','5K','running','format','{"5 km"}'),
  ('ultra_marathon','Ultra Marathon','running','format','{"ultra","50K","100K"}'),
  ('trail_run','Trail Run','running','format','{"trail running"}'),
  ('night_run','Night Run','running','format','{}'),
  ('charity_run','Charity Run','running','format','{"cause run"}'),
  ('corporate_run','Corporate Run','running','format','{}'),
  ('walkathon','Walkathon','running','format','{"walk"}'),
  ('fun_run','Fun Run','running','format','{"beginner run"}'),
  -- CYCLING
  ('road_race','Road Race','cycling','format','{}'),
  ('gran_fondo','Gran Fondo','cycling','format','{"fondo"}'),
  ('mtb','Mountain Biking','cycling','sport','{"MTB","off road"}'),
  ('gravel','Gravel Race','cycling','format','{}'),
  ('brevet','Brevet / Audax','cycling','format','{"BRM","randonneur","audax"}'),
  ('cyclothon','Cyclothon','cycling','format','{}'),
  ('bike_tour','Bike Tour','cycling','format','{"cycle tour"}'),
  ('track_cycling','Track Cycling','cycling','sport','{"velodrome"}'),
  -- TRIATHLON & MULTISPORT
  ('triathlon','Triathlon','triathlon','sport','{"tri"}'),
  ('duathlon','Duathlon','triathlon','sport','{}'),
  ('aquathlon','Aquathlon','triathlon','sport','{}'),
  ('ironman','Ironman','triathlon','format','{"70.3","140.6"}'),
  ('obstacle_race','Obstacle Race','triathlon','sport','{"OCR","spartan","mud run"}'),
  ('adventure_race','Adventure Race','triathlon','sport','{}'),
  -- SKATING
  ('inline_speed_skating','Inline Speed Skating','skating','sport','{"roller speed","inline"}'),
  ('quad_skating','Quad Skating','skating','sport','{}'),
  ('artistic_skating','Artistic Skating','skating','sport','{"figure skating"}'),
  ('roller_hockey','Roller Hockey','skating','sport','{}'),
  ('skateboarding','Skateboarding','skating','sport','{"skate park"}'),
  ('ice_skating','Ice Skating','skating','sport','{}'),
  -- GYMNASTICS
  ('artistic_gymnastics','Artistic Gymnastics','gymnastics','sport','{}'),
  ('rhythmic_gymnastics','Rhythmic Gymnastics','gymnastics','sport','{}'),
  ('aerobic_gymnastics','Aerobic Gymnastics','gymnastics','sport','{}'),
  ('trampoline','Trampoline','gymnastics','sport','{}'),
  -- MARTIAL ARTS
  ('karate','Karate','martial_arts','sport','{}'),
  ('taekwondo','Taekwondo','martial_arts','sport','{"TKD"}'),
  ('judo','Judo','martial_arts','sport','{}'),
  ('boxing','Boxing','martial_arts','sport','{}'),
  ('wrestling','Wrestling','martial_arts','sport','{"kushti"}'),
  ('fencing','Fencing','martial_arts','sport','{}'),
  ('kalaripayattu','Kalaripayattu','martial_arts','sport','{"kalari"}'),
  ('kickboxing','Kickboxing','martial_arts','sport','{}'),
  ('mixed_martial_arts','Mixed Martial Arts','martial_arts','sport','{"MMA"}'),
  -- RACQUET — five distinct sports
  ('badminton','Badminton','racquet','sport','{}'),
  ('tennis','Tennis','racquet','sport','{"lawn tennis"}'),
  ('table_tennis','Table Tennis','racquet','sport','{"TT","ping pong"}'),
  ('squash','Squash','racquet','sport','{}'),
  ('pickleball','Pickleball','racquet','sport','{}'),
  -- WATER
  ('pool_swimming','Pool Swimming','water','sport','{"swimming"}'),
  ('open_water_swimming','Open Water Swimming','water','sport','{"sea swim"}'),
  ('kayaking','Kayaking','water','sport','{}'),
  ('rowing','Rowing','water','sport','{}'),
  ('surfing','Surfing','water','sport','{}'),
  ('sailing','Sailing','water','sport','{"yachting"}'),
  ('water_polo','Water Polo','water','sport','{}'),
  ('diving','Diving','water','sport','{}'),
  -- TREKKING & OUTDOOR
  ('trek','Trek','trekking','sport','{"trekking"}'),
  ('expedition','Expedition','trekking','format','{}'),
  ('hiking','Hiking','trekking','sport','{}'),
  ('peak_climbing','Peak Climbing','trekking','sport','{"summit"}'),
  ('adventure_camp','Adventure Camp','trekking','format','{"camping"}'),
  ('nature_trail','Nature Trail','trekking','format','{}'),
  -- ADVENTURE
  ('skiing','Skiing','adventure','sport','{}'),
  ('snowboarding','Snowboarding','adventure','sport','{}'),
  ('ice_marathon','Ice Marathon','adventure','format','{}'),
  ('desert_rally','Desert Rally','adventure','format','{}'),
  ('rock_climbing','Rock Climbing','adventure','sport','{"bouldering"}'),
  ('paragliding','Paragliding','adventure','sport','{}'),
  -- FITNESS
  ('crossfit','CrossFit','fitness','sport','{}'),
  ('functional_fitness','Functional Fitness','fitness','sport','{}'),
  ('powerlifting','Powerlifting','fitness','sport','{}'),
  ('bodybuilding','Bodybuilding','fitness','sport','{}'),
  ('yoga_festival','Yoga Festival','fitness','format','{"yoga"}'),
  ('fitness_expo','Fitness Expo','fitness','format','{"expo"}'),
  ('wellness_retreat','Wellness Retreat','fitness','format','{}'),
  -- TEAM SPORTS (phase 5)
  ('cricket','Cricket','team_sports','sport','{}'),
  ('football','Football','team_sports','sport','{"soccer"}'),
  ('hockey','Hockey','team_sports','sport','{"field hockey"}'),
  ('basketball','Basketball','team_sports','sport','{}'),
  ('volleyball','Volleyball','team_sports','sport','{}'),
  ('kabaddi','Kabaddi','team_sports','sport','{}'),
  ('kho_kho','Kho-Kho','team_sports','sport','{"kho kho"}'),
  ('throwball','Throwball','team_sports','sport','{}'),
  ('handball','Handball','team_sports','sport','{}'),
  ('rugby','Rugby','team_sports','sport','{}'),
  -- MIND SPORTS (phase 5)
  ('chess','Chess','mind_sports','sport','{}'),
  ('carrom','Carrom','mind_sports','sport','{}')
ON CONFLICT (slug) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  sport_type   = EXCLUDED.sport_type,
  kind         = EXCLUDED.kind,
  aliases      = EXCLUDED.aliases,
  updated_at   = now();

-- Team and mind sports are listed but not discoverable: league fixtures are a different
-- record type with no entry surface (ADR-006).
UPDATE disciplines SET is_active = false WHERE sport_type IN ('team_sports', 'mind_sports');

CREATE INDEX IF NOT EXISTS idx_disciplines_sport_type ON disciplines (sport_type);
CREATE INDEX IF NOT EXISTS idx_disciplines_aliases    ON disciplines USING GIN (aliases);

DROP TRIGGER IF EXISTS update_disciplines_modtime ON disciplines;
CREATE TRIGGER update_disciplines_modtime BEFORE UPDATE ON disciplines
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ---------------------------------------------------------------------------
-- 4. Taxonomy + eligibility columns on events
-- ---------------------------------------------------------------------------

ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS age_categories   age_category[] NOT NULL DEFAULT '{open}',
  ADD COLUMN IF NOT EXISTS discipline_slugs text[]         NOT NULL DEFAULT '{}';

COMMENT ON COLUMN events.age_categories IS
  'The WHO eligibility axis. Legacy rows default to {open}; ingestion must set this properly for '
  'age-group meets, which are the point of the youth scope. Query with the overlap operator &&.';
COMMENT ON COLUMN events.discipline_slugs IS
  'Leaf taxonomy tags, e.g. {marathon} or {badminton}. Empty on legacy rows.';

CREATE INDEX IF NOT EXISTS idx_events_age_categories   ON events USING GIN (age_categories);
CREATE INDEX IF NOT EXISTS idx_events_discipline_slugs ON events USING GIN (discipline_slugs);

-- Reference data: world-readable, writable by no one through the Data API.
ALTER TABLE sports      ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sports are publicly readable" ON sports;
CREATE POLICY "Sports are publicly readable" ON sports FOR SELECT USING (true);
DROP POLICY IF EXISTS "Disciplines are publicly readable" ON disciplines;
CREATE POLICY "Disciplines are publicly readable" ON disciplines FOR SELECT USING (true);

COMMIT;

-- Verify:
--   SELECT count(*) FROM sports;                        -- 14
--   SELECT count(*) FROM disciplines;                   -- 105
--   SELECT count(*) FROM disciplines WHERE is_active;   -- 92
