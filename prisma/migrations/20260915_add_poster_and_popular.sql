-- Popular Events on the main page: a poster/banner image + a flag to mark which
-- events appear in the rotating "Popular Events" carousel (max 5 shown at a time).

ALTER TABLE events ADD COLUMN IF NOT EXISTS poster_url text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_popular boolean NOT NULL DEFAULT false;

-- Seed each event with a bundled sport banner (served by the frontend from /public/posters).
UPDATE events
SET poster_url = '/posters/' || sport_type::text || '.jpg'
WHERE poster_url IS NULL;

-- Mark 5 events as popular so the main-page carousel has content.
UPDATE events
SET is_popular = true
WHERE id IN (SELECT id FROM events ORDER BY start_date DESC, event_name ASC LIMIT 5);
