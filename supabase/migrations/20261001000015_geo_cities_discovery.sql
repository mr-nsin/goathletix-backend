-- 0015 · Cities, "near me" radius search, and the discovery RPCs the homepage needs.
--
-- Requirements: #4 city landing pages, #25 trending, #26 near me, GA-020 Phase 4 (one counts call for
-- hero stats / Plan your season / city cards / menu counts).
--
-- events.geo_location GEOGRAPHY(Point) has existed since 0000 but was never populated. This file seeds
-- city centroids and backfills it, so radius search works now at city precision; ingestion can later
-- write venue coordinates, which the trigger below marks as 'venue' precision and never overwrites.
--
-- PostGIS may live in `public` or `extensions` on Supabase, hence the search_path on the functions.
-- Idempotent and transactional.

BEGIN;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $upd$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$upd$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. Cities — the 53 cities present in events (same list as goathletix-frontend/src/lib/locations.ts).
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS cities (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  state          text NOT NULL,
  slug           text NOT NULL UNIQUE,
  latitude       double precision CHECK (latitude  BETWEEN -90  AND 90),
  longitude      double precision CHECK (longitude BETWEEN -180 AND 180),
  hero_image_url text,
  description    text,
  is_featured    boolean NOT NULL DEFAULT false,
  display_order  integer NOT NULL DEFAULT 100,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (name, state)
);

DROP TRIGGER IF EXISTS update_cities_modtime ON cities;
CREATE TRIGGER update_cities_modtime
  BEFORE UPDATE ON cities FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- City-centre coordinates (approximate, ~1 km) — precise enough for 25-200 km radius search.
-- Srinagar appears twice (J&K and Uttarakhand), hence (name, state) uniqueness and a distinct slug.
INSERT INTO cities (name, state, slug, latitude, longitude, is_featured, display_order) VALUES
  ('Bengaluru',          'Karnataka',        'bengaluru',            12.9716, 77.5946, true,  1),
  ('Mumbai',             'Maharashtra',      'mumbai',               19.0760, 72.8777, true,  2),
  ('New Delhi',          'Delhi',            'new-delhi',            28.6139, 77.2090, true,  3),
  ('Pune',               'Maharashtra',      'pune',                 18.5204, 73.8567, true,  4),
  ('Hyderabad',          'Telangana',        'hyderabad',            17.3850, 78.4867, true,  5),
  ('Chennai',            'Tamil Nadu',       'chennai',              13.0827, 80.2707, true,  6),
  ('Kolkata',            'West Bengal',      'kolkata',              22.5726, 88.3639, true,  7),
  ('Ahmedabad',          'Gujarat',          'ahmedabad',            23.0225, 72.5714, true,  8),
  ('Jaipur',             'Rajasthan',        'jaipur',               26.9124, 75.7873, true,  9),
  ('Goa',                'Goa',              'goa',                  15.2993, 74.1240, true, 10),
  ('Vijayawada',         'Andhra Pradesh',   'vijayawada',           16.5062, 80.6480, false, 100),
  ('Visakhapatnam',      'Andhra Pradesh',   'visakhapatnam',        17.6868, 83.2185, false, 100),
  ('Guwahati',           'Assam',            'guwahati',             26.1445, 91.7362, false, 100),
  ('Patna',              'Bihar',            'patna',                25.5941, 85.1376, false, 100),
  ('Raipur',             'Chhattisgarh',     'raipur',               21.2514, 81.6296, false, 100),
  ('Panaji',             'Goa',              'panaji',               15.4909, 73.8278, false, 100),
  ('Rajkot',             'Gujarat',          'rajkot',               22.3039, 70.8022, false, 100),
  ('Surat',              'Gujarat',          'surat',                21.1702, 72.8311, false, 100),
  ('Vadodara',           'Gujarat',          'vadodara',             22.3072, 73.1812, false, 100),
  ('Gurugram',           'Haryana',          'gurugram',             28.4595, 77.0266, false, 100),
  ('Manali',             'Himachal Pradesh', 'manali',               32.2432, 77.1892, false, 100),
  ('Shimla',             'Himachal Pradesh', 'shimla',               31.1048, 77.1734, false, 100),
  ('Srinagar',           'Jammu & Kashmir',  'srinagar',             34.0837, 74.7973, false, 100),
  ('Ranchi',             'Jharkhand',        'ranchi',               23.3441, 85.3096, false, 100),
  ('Mysuru',             'Karnataka',        'mysuru',               12.2958, 76.6394, false, 100),
  ('Udupi',              'Karnataka',        'udupi',                13.3409, 74.7421, false, 100),
  ('Kochi',              'Kerala',           'kochi',                 9.9312, 76.2673, false, 100),
  ('Munnar',             'Kerala',           'munnar',               10.0889, 77.0595, false, 100),
  ('Thiruvananthapuram', 'Kerala',           'thiruvananthapuram',    8.5241, 76.9366, false, 100),
  ('Leh',                'Ladakh',           'leh',                  34.1526, 77.5771, false, 100),
  ('Bhopal',             'Madhya Pradesh',   'bhopal',               23.2599, 77.4126, false, 100),
  ('Gwalior',            'Madhya Pradesh',   'gwalior',              26.2183, 78.1828, false, 100),
  ('Indore',             'Madhya Pradesh',   'indore',               22.7196, 75.8577, false, 100),
  ('Nagpur',             'Maharashtra',      'nagpur',               21.1458, 79.0882, false, 100),
  ('Nashik',             'Maharashtra',      'nashik',               19.9975, 73.7898, false, 100),
  ('Bhubaneswar',        'Odisha',           'bhubaneswar',          20.2961, 85.8245, false, 100),
  ('Amritsar',           'Punjab',           'amritsar',             31.6340, 74.8723, false, 100),
  ('Chandigarh',         'Punjab',           'chandigarh',           30.7333, 76.7794, false, 100),
  ('Jalandhar',          'Punjab',           'jalandhar',            31.3260, 75.5762, false, 100),
  ('Ludhiana',           'Punjab',           'ludhiana',             30.9010, 75.8573, false, 100),
  ('Jodhpur',            'Rajasthan',        'jodhpur',              26.2389, 73.0243, false, 100),
  ('Mount Abu',          'Rajasthan',        'mount-abu',            24.5926, 72.7156, false, 100),
  ('Coimbatore',         'Tamil Nadu',       'coimbatore',           11.0168, 76.9558, false, 100),
  ('Madurai',            'Tamil Nadu',       'madurai',               9.9252, 78.1198, false, 100),
  ('Ooty',               'Tamil Nadu',       'ooty',                 11.4102, 76.6950, false, 100),
  ('Agra',               'Uttar Pradesh',    'agra',                 27.1767, 78.0081, false, 100),
  ('Allahabad',          'Uttar Pradesh',    'allahabad',            25.4358, 81.8463, false, 100),
  ('Kanpur',             'Uttar Pradesh',    'kanpur',               26.4499, 80.3319, false, 100),
  ('Lucknow',            'Uttar Pradesh',    'lucknow',              26.8467, 80.9462, false, 100),
  ('Noida',              'Uttar Pradesh',    'noida',                28.5355, 77.3910, false, 100),
  ('Varanasi',           'Uttar Pradesh',    'varanasi',             25.3176, 82.9739, false, 100),
  ('Dehradun',           'Uttarakhand',      'dehradun',             30.3165, 78.0322, false, 100),
  ('Rishikesh',          'Uttarakhand',      'rishikesh',            30.0869, 78.2676, false, 100),
  ('Srinagar',           'Uttarakhand',      'srinagar-uttarakhand', 30.2196, 78.7810, false, 100)
ON CONFLICT (name, state) DO NOTHING;

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cities are publicly readable" ON cities;
CREATE POLICY "Cities are publicly readable" ON cities FOR SELECT USING (true);

-- ---------------------------------------------------------------------------
-- 2. Backfill events.geo_location from city centres, and keep it filled.
-- ---------------------------------------------------------------------------

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS geo_precision text CHECK (geo_precision IN ('venue', 'city'));

-- Any coordinates already present came from a source, so treat them as venue-precise.
UPDATE events SET geo_precision = 'venue'
WHERE geo_location IS NOT NULL AND geo_precision IS NULL;

UPDATE events e
SET geo_location  = ST_SetSRID(ST_MakePoint(c.longitude, c.latitude), 4326)::geography,
    geo_precision = 'city'
FROM cities c
WHERE e.geo_location IS NULL
  AND lower(e.city)  = lower(c.name)
  AND lower(e.state) = lower(c.state)
  AND c.latitude IS NOT NULL;

-- New or moved events get a city centre automatically. Coordinates written by a caller always win:
-- they are marked 'venue' and never replaced by a centroid.
CREATE OR REPLACE FUNCTION fill_event_geo_from_city()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.geo_location IS NOT NULL
     AND NEW.geo_location IS DISTINCT FROM OLD.geo_location THEN
    IF NEW.geo_precision IS NOT DISTINCT FROM OLD.geo_precision THEN
      NEW.geo_precision := 'venue';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.geo_location IS NULL OR NEW.geo_precision = 'city' THEN
    NEW.geo_location := (
      SELECT ST_SetSRID(ST_MakePoint(c.longitude, c.latitude), 4326)::geography
      FROM cities c
      WHERE lower(c.name) = lower(NEW.city) AND lower(c.state) = lower(NEW.state)
        AND c.latitude IS NOT NULL
      LIMIT 1
    );
    NEW.geo_precision := CASE WHEN NEW.geo_location IS NULL THEN NULL ELSE 'city' END;
  ELSIF NEW.geo_precision IS NULL THEN
    NEW.geo_precision := 'venue';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, extensions, pg_temp;

DROP TRIGGER IF EXISTS fill_event_geo_from_city_trg ON events;
CREATE TRIGGER fill_event_geo_from_city_trg
  BEFORE INSERT OR UPDATE OF city, state, geo_location ON events
  FOR EACH ROW EXECUTE FUNCTION fill_event_geo_from_city();

-- ---------------------------------------------------------------------------
-- 3. Discovery RPCs — called by the backend with .rpc(); PostgREST filters, ordering and range()
--    chain onto SETOF results, and embedded joins (organizer:organizers(...)) still work.
-- ---------------------------------------------------------------------------

-- "Near me" (#26). Radius is clamped to 1-500 km so a bad parameter cannot scan the whole table.
CREATE OR REPLACE FUNCTION events_near(
  p_lat       double precision,
  p_lng       double precision,
  p_radius_km double precision DEFAULT 100
)
RETURNS SETOF events AS $$
  SELECT e.*
  FROM events e
  WHERE e.geo_location IS NOT NULL
    AND p_lat BETWEEN -90 AND 90
    AND p_lng BETWEEN -180 AND 180
    AND ST_DWithin(
          e.geo_location,
          ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
          LEAST(GREATEST(coalesce(p_radius_km, 100), 1), 500) * 1000
        );
$$ LANGUAGE sql STABLE SET search_path = public, extensions, pg_temp;

-- One call for every count on the homepage: GROUP BY month | city | state | sport.
-- Cancelled events are excluded; an unknown p_group_by returns no rows rather than an error.
CREATE OR REPLACE FUNCTION event_counts(
  p_group_by text,
  p_from     date DEFAULT NULL,
  p_to       date DEFAULT NULL,
  p_sport    text DEFAULT NULL,
  p_city     text DEFAULT NULL,
  p_state    text DEFAULT NULL
)
RETURNS TABLE (bucket text, total bigint) AS $$
  SELECT CASE p_group_by
           WHEN 'month' THEN to_char(e.start_date, 'YYYY-MM')
           WHEN 'city'  THEN e.city
           WHEN 'state' THEN e.state
           WHEN 'sport' THEN e.sport_type::text
         END AS bucket,
         count(*) AS total
  FROM events e
  WHERE p_group_by IN ('month', 'city', 'state', 'sport')
    AND e.status <> 'cancelled'
    AND (p_from  IS NULL OR e.end_date   >= p_from)
    AND (p_to    IS NULL OR e.start_date <= p_to)
    AND (p_sport IS NULL OR e.sport_type::text = p_sport)
    AND (p_city  IS NULL OR lower(e.city)  = lower(p_city))
    AND (p_state IS NULL OR lower(e.state) = lower(p_state))
  GROUP BY 1
  ORDER BY 2 DESC, 1;
$$ LANGUAGE sql STABLE SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION events_near(double precision, double precision, double precision) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION event_counts(text, date, date, text, text, text) TO anon, authenticated;

COMMIT;
