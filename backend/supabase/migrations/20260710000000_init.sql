-- Enable PostGIS extension for geo-spatial radius searches
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create Enums for Sports and Event States
CREATE TYPE sport_category AS ENUM (
  'running',
  'cycling',
  'triathlon',
  'trekking',
  'fitness',
  'racquet',
  'water',
  'adventure'
);

CREATE TYPE event_status AS ENUM (
  'upcoming',
  'closed',
  'completed',
  'cancelled'
);

CREATE TYPE difficulty_level AS ENUM (
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
);

-- 2. Create Organizers Table
CREATE TABLE IF NOT EXISTS organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT UNIQUE NOT NULL, -- Format: 'townscript_123', 'indierunning_456' for scraper conflict resolution
  event_name TEXT NOT NULL,
  sport_type sport_category NOT NULL,
  event_date DATE NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  venue TEXT NOT NULL,
  geo_location GEOGRAPHY(Point, 4326), -- PostGIS coordinates
  distance_options TEXT[] NOT NULL, -- e.g. ['5K', '10K', '21.1K']
  elevation_gain TEXT, -- e.g. '150m'
  difficulty difficulty_level DEFAULT 'Intermediate'::difficulty_level,
  price_range TEXT, -- e.g. '₹800 - ₹2000'
  registration_url TEXT NOT NULL,
  organizer_id UUID REFERENCES organizers(id) ON DELETE SET NULL,
  terrain TEXT, -- e.g. 'Trail', 'Road'
  is_virtual BOOLEAN DEFAULT FALSE,
  status event_status DEFAULT 'upcoming'::event_status NOT NULL,
  md5_payload_hash TEXT NOT NULL, -- Used by crawlers to detect updates on page content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Performance and Geo Indexes
CREATE INDEX IF NOT EXISTS idx_events_sport_type ON events(sport_type);
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- GIST Index for PostGIS proximity queries
CREATE INDEX IF NOT EXISTS idx_events_geo_location ON events USING GIST(geo_location);

-- 5. Auto-update Trigger for updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_modtime
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
