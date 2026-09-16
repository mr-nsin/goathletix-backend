-- 0008 — disciplines: the searchable leaf level of the taxonomy.
--
-- Run after 0005, 0006, 0007.
--
-- WHY THIS EXISTS
-- 0006 gave us two axes (family, event_model) over 14 sport_category values. But those 14 are
-- CATEGORIES, not sports: 'racquet' silently contains badminton, tennis, table tennis, squash and
-- pickleball; 'team_sports' contains cricket, football, hockey, kabaddi and kho-kho. Nobody
-- searches for "racquet" — they search for "badminton". Without this table those words exist
-- nowhere in the database and return nothing.
--
-- This is also the `tags` column the PRD specified and that was never built. Only
-- events.distance_options ever shipped, and that only covers running distances.
--
-- TWO KINDS OF LEAF, DELIBERATELY DISTINGUISHED
-- doc 17 mixes them, and they behave differently in the UI:
--   'sport'  — a distinct sport within a category. Badminton is not a format of squash.
--   'format' — a way of running one sport. A marathon is a format of running, not its own sport.
-- The homepage shows sports as filter chips; formats belong with distance/level filters.
--
-- Idempotent and transactional.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discipline_kind') THEN
    CREATE TYPE discipline_kind AS ENUM ('sport', 'format');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS disciplines (
  slug          text PRIMARY KEY,
  display_name  text            NOT NULL,
  sport_type    sport_category  NOT NULL REFERENCES sports (slug),
  kind          discipline_kind NOT NULL DEFAULT 'sport',
  -- Search synonyms and Indian spelling variants: 'track and field', 'TT', 'kho kho'.
  aliases       text[]          NOT NULL DEFAULT '{}',
  is_active     boolean         NOT NULL DEFAULT true,
  created_at    timestamptz     NOT NULL DEFAULT now(),
  updated_at    timestamptz     NOT NULL DEFAULT now()
);

COMMENT ON TABLE disciplines IS
  'Leaf level of the sport taxonomy (ADR-006). kind=sport is a distinct sport within a category; '
  'kind=format is a way of running one sport (marathon, gran fondo). This is what users search by.';

INSERT INTO disciplines (slug, display_name, sport_type, kind, aliases) VALUES
  -- ATHLETICS (track & field) — the wedge
  ('sprints',              'Sprints',                'athletics',    'format', '{"100m","200m","400m"}'),
  ('hurdles',              'Hurdles',                'athletics',    'format', '{}'),
  ('middle_distance',      'Middle Distance',        'athletics',    'format', '{"800m","1500m"}'),
  ('long_distance_track',  'Long Distance (Track)',  'athletics',    'format', '{"5000m","10000m"}'),
  ('steeplechase',         'Steeplechase',           'athletics',    'format', '{}'),
  ('relays',               'Relays',                 'athletics',    'format', '{"4x100","4x400"}'),
  ('high_jump',            'High Jump',              'athletics',    'sport',  '{"jumps"}'),
  ('long_jump',            'Long Jump',              'athletics',    'sport',  '{"jumps"}'),
  ('triple_jump',          'Triple Jump',            'athletics',    'sport',  '{"jumps"}'),
  ('pole_vault',           'Pole Vault',             'athletics',    'sport',  '{"jumps"}'),
  ('shot_put',             'Shot Put',               'athletics',    'sport',  '{"throws"}'),
  ('discus_throw',         'Discus Throw',           'athletics',    'sport',  '{"throws"}'),
  ('javelin_throw',        'Javelin Throw',          'athletics',    'sport',  '{"throws"}'),
  ('hammer_throw',         'Hammer Throw',           'athletics',    'sport',  '{"throws"}'),
  ('race_walking',         'Race Walking',           'athletics',    'sport',  '{"walk"}'),
  ('cross_country',        'Cross Country',          'athletics',    'format', '{"XC"}'),
  ('combined_events',      'Combined Events',        'athletics',    'format', '{"decathlon","heptathlon"}'),

  -- RUNNING (road / trail) — formats of one sport
  ('marathon',             'Marathon',               'running',      'format', '{"42K","full marathon"}'),
  ('half_marathon',        'Half Marathon',          'running',      'format', '{"21K","21.1K"}'),
  ('ten_k',                '10K',                    'running',      'format', '{"10 km"}'),
  ('five_k',               '5K',                     'running',      'format', '{"5 km"}'),
  ('ultra_marathon',       'Ultra Marathon',         'running',      'format', '{"ultra","50K","100K"}'),
  ('trail_run',            'Trail Run',              'running',      'format', '{"trail running"}'),
  ('night_run',            'Night Run',              'running',      'format', '{}'),
  ('charity_run',          'Charity Run',            'running',      'format', '{"cause run"}'),
  ('corporate_run',        'Corporate Run',          'running',      'format', '{}'),
  ('walkathon',            'Walkathon',              'running',      'format', '{"walk"}'),
  ('fun_run',              'Fun Run',                'running',      'format', '{"beginner run"}'),

  -- CYCLING
  ('road_race',            'Road Race',              'cycling',      'format', '{}'),
  ('gran_fondo',           'Gran Fondo',             'cycling',      'format', '{"fondo"}'),
  ('mtb',                  'Mountain Biking',        'cycling',      'sport',  '{"MTB","off road"}'),
  ('gravel',               'Gravel Race',            'cycling',      'format', '{}'),
  ('brevet',               'Brevet / Audax',         'cycling',      'format', '{"BRM","randonneur","audax"}'),
  ('cyclothon',            'Cyclothon',              'cycling',      'format', '{}'),
  ('bike_tour',            'Bike Tour',              'cycling',      'format', '{"cycle tour"}'),
  ('track_cycling',        'Track Cycling',          'cycling',      'sport',  '{"velodrome"}'),

  -- TRIATHLON & MULTISPORT
  ('triathlon',            'Triathlon',              'triathlon',    'sport',  '{"tri"}'),
  ('duathlon',             'Duathlon',               'triathlon',    'sport',  '{}'),
  ('aquathlon',            'Aquathlon',              'triathlon',    'sport',  '{}'),
  ('ironman',              'Ironman',                'triathlon',    'format', '{"70.3","140.6"}'),
  ('obstacle_race',        'Obstacle Race',          'triathlon',    'sport',  '{"OCR","spartan","mud run"}'),
  ('adventure_race',       'Adventure Race',         'triathlon',    'sport',  '{}'),

  -- SKATING
  ('inline_speed_skating', 'Inline Speed Skating',   'skating',      'sport',  '{"roller speed","inline"}'),
  ('quad_skating',         'Quad Skating',           'skating',      'sport',  '{}'),
  ('artistic_skating',     'Artistic Skating',       'skating',      'sport',  '{"figure skating"}'),
  ('roller_hockey',        'Roller Hockey',          'skating',      'sport',  '{}'),
  ('skateboarding',        'Skateboarding',          'skating',      'sport',  '{"skate park"}'),
  ('ice_skating',          'Ice Skating',            'skating',      'sport',  '{}'),

  -- GYMNASTICS
  ('artistic_gymnastics',  'Artistic Gymnastics',    'gymnastics',   'sport',  '{}'),
  ('rhythmic_gymnastics',  'Rhythmic Gymnastics',    'gymnastics',   'sport',  '{}'),
  ('aerobic_gymnastics',   'Aerobic Gymnastics',     'gymnastics',   'sport',  '{}'),
  ('trampoline',           'Trampoline',             'gymnastics',   'sport',  '{}'),

  -- MARTIAL ARTS
  ('karate',               'Karate',                 'martial_arts', 'sport',  '{}'),
  ('taekwondo',            'Taekwondo',              'martial_arts', 'sport',  '{"TKD"}'),
  ('judo',                 'Judo',                   'martial_arts', 'sport',  '{}'),
  ('boxing',               'Boxing',                 'martial_arts', 'sport',  '{}'),
  ('wrestling',            'Wrestling',              'martial_arts', 'sport',  '{"kushti"}'),
  ('fencing',              'Fencing',                'martial_arts', 'sport',  '{}'),
  ('kalaripayattu',        'Kalaripayattu',          'martial_arts', 'sport',  '{"kalari"}'),
  ('kickboxing',           'Kickboxing',             'martial_arts', 'sport',  '{}'),
  ('mixed_martial_arts',   'Mixed Martial Arts',     'martial_arts', 'sport',  '{"MMA"}'),

  -- RACQUET — five distinct sports, previously one row
  ('badminton',            'Badminton',              'racquet',      'sport',  '{}'),
  ('tennis',               'Tennis',                 'racquet',      'sport',  '{"lawn tennis"}'),
  ('table_tennis',         'Table Tennis',           'racquet',      'sport',  '{"TT","ping pong"}'),
  ('squash',               'Squash',                 'racquet',      'sport',  '{}'),
  ('pickleball',           'Pickleball',             'racquet',      'sport',  '{}'),

  -- WATER
  ('pool_swimming',        'Pool Swimming',          'water',        'sport',  '{"swimming"}'),
  ('open_water_swimming',  'Open Water Swimming',    'water',        'sport',  '{"sea swim"}'),
  ('kayaking',             'Kayaking',               'water',        'sport',  '{}'),
  ('rowing',               'Rowing',                 'water',        'sport',  '{}'),
  ('surfing',              'Surfing',                'water',        'sport',  '{}'),
  ('sailing',              'Sailing',                'water',        'sport',  '{"yachting"}'),
  ('water_polo',           'Water Polo',             'water',        'sport',  '{}'),
  ('diving',               'Diving',                 'water',        'sport',  '{}'),

  -- TREKKING & OUTDOOR
  ('trek',                 'Trek',                   'trekking',     'sport',  '{"trekking"}'),
  ('expedition',           'Expedition',             'trekking',     'format', '{}'),
  ('hiking',               'Hiking',                 'trekking',     'sport',  '{}'),
  ('peak_climbing',        'Peak Climbing',          'trekking',     'sport',  '{"summit"}'),
  ('adventure_camp',       'Adventure Camp',         'trekking',     'format', '{"camping"}'),
  ('nature_trail',         'Nature Trail',           'trekking',     'format', '{}'),

  -- ADVENTURE
  ('skiing',               'Skiing',                 'adventure',    'sport',  '{}'),
  ('snowboarding',         'Snowboarding',           'adventure',    'sport',  '{}'),
  ('ice_marathon',         'Ice Marathon',           'adventure',    'format', '{}'),
  ('desert_rally',         'Desert Rally',           'adventure',    'format', '{}'),
  ('rock_climbing',        'Rock Climbing',          'adventure',    'sport',  '{"bouldering"}'),
  ('paragliding',          'Paragliding',            'adventure',    'sport',  '{}'),

  -- FITNESS
  ('crossfit',             'CrossFit',               'fitness',      'sport',  '{}'),
  ('functional_fitness',   'Functional Fitness',     'fitness',      'sport',  '{}'),
  ('powerlifting',         'Powerlifting',           'fitness',      'sport',  '{}'),
  ('bodybuilding',         'Bodybuilding',           'fitness',      'sport',  '{}'),
  ('yoga_festival',        'Yoga Festival',          'fitness',      'format', '{"yoga"}'),
  ('fitness_expo',         'Fitness Expo',           'fitness',      'format', '{"expo"}'),
  ('wellness_retreat',     'Wellness Retreat',       'fitness',      'format', '{}'),

  -- TEAM SPORTS (phase 5 — inactive until the fixture surface exists)
  ('cricket',              'Cricket',                'team_sports',  'sport',  '{}'),
  ('football',             'Football',               'team_sports',  'sport',  '{"soccer"}'),
  ('hockey',               'Hockey',                 'team_sports',  'sport',  '{"field hockey"}'),
  ('basketball',           'Basketball',             'team_sports',  'sport',  '{}'),
  ('volleyball',           'Volleyball',             'team_sports',  'sport',  '{}'),
  ('kabaddi',              'Kabaddi',                'team_sports',  'sport',  '{}'),
  ('kho_kho',              'Kho-Kho',                'team_sports',  'sport',  '{"kho kho"}'),
  ('throwball',            'Throwball',              'team_sports',  'sport',  '{}'),
  ('handball',             'Handball',               'team_sports',  'sport',  '{}'),
  ('rugby',                'Rugby',                  'team_sports',  'sport',  '{}'),

  -- MIND SPORTS (phase 5)
  ('chess',                'Chess',                  'mind_sports',  'sport',  '{}'),
  ('carrom',               'Carrom',                 'mind_sports',  'sport',  '{}')
ON CONFLICT (slug) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  sport_type   = EXCLUDED.sport_type,
  kind         = EXCLUDED.kind,
  aliases      = EXCLUDED.aliases,
  updated_at   = now();

CREATE INDEX IF NOT EXISTS idx_disciplines_sport_type ON disciplines (sport_type);
CREATE INDEX IF NOT EXISTS idx_disciplines_aliases    ON disciplines USING GIN (aliases);

DROP TRIGGER IF EXISTS update_disciplines_modtime ON disciplines;
CREATE TRIGGER update_disciplines_modtime
  BEFORE UPDATE ON disciplines
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Team and mind sports are listed but not yet discoverable: league fixtures are a different
-- record type and have no entry surface (ADR-006).
UPDATE disciplines SET is_active = false
  WHERE sport_type IN ('team_sports', 'mind_sports');

-- ---------------------------------------------------------------------------
-- Tag events with their disciplines. This is the PRD's missing `tags` column.
-- ---------------------------------------------------------------------------

ALTER TABLE IF EXISTS events
  ADD COLUMN IF NOT EXISTS discipline_slugs text[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN events.discipline_slugs IS
  'Leaf taxonomy tags, e.g. {marathon} or {badminton}. Empty on legacy rows; ingestion must '
  'populate it. Query with the overlap operator &&.';

CREATE INDEX IF NOT EXISTS idx_events_discipline_slugs ON events USING GIN (discipline_slugs);

-- RLS: public reference data, read-only.
ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Disciplines are publicly readable" ON disciplines;
CREATE POLICY "Disciplines are publicly readable" ON disciplines FOR SELECT USING (true);

COMMIT;

-- Verify:
--   SELECT sport_type, count(*) FROM disciplines GROUP BY 1 ORDER BY 2 DESC;   -- expect 14 groups
--   SELECT count(*) FROM disciplines;                                          -- expect 105
--   SELECT count(*) FROM disciplines WHERE is_active;                          -- expect 92
