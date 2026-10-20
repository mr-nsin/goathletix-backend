-- GA-055 Dummy media seed for the event-page showcase (GA-051 continuation).
--
-- Apply in Supabase dashboard -> SQL editor. Safe to re-run.
--
-- What this adds:
--   - event_media rows (past-year photos + a couple of YouTube videos) for the four showcase events
--   - course_map_url (image URL) on the Ultra Marathon categories, so the Course section renders
--     a thumbnail per distance instead of only text buttons
--
-- Images: picsum.photos deterministic placeholders (CC0-equivalent dummy images). Videos: Vimeo /
-- YouTube public running / cycling / trek / tennis clips. No PII, no copyrighted material embedded,
-- URLs only.
--
-- One BEGIN/COMMIT. No DROP, no TRUNCATE, no DELETE, no ALTER.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. event_media rows. Deterministic UUIDs on an md5('ga-055-media:<event>:<slug>') key, so
--    re-running is a no-op. status='published' lands directly thanks to the service-role staff session.
-- ---------------------------------------------------------------------------

-- Ultra marathon (fe2f7043-1889-4b31-b7bb-07bc9c26685d) ---------------------
INSERT INTO event_media (id, event_id, url, kind, caption, credit, edition_year, is_cover, status) VALUES
  (md5('ga-055-media:fe2f7043:ultra-2025-1')::uuid, 'fe2f7043-1889-4b31-b7bb-07bc9c26685d', 'https://picsum.photos/seed/ultra-goa-2025-startline/1200/800', 'photo', 'Start line, Panjim beach, 2025 edition. [Sample]', 'Goa Running Photo Club', 2025, false, 'published'),
  (md5('ga-055-media:fe2f7043:ultra-2025-2')::uuid, 'fe2f7043-1889-4b31-b7bb-07bc9c26685d', 'https://picsum.photos/seed/ultra-goa-2025-coast/1200/800', 'photo', 'Konkan coast around km 60, 2025. [Sample]', 'Goa Running Photo Club', 2025, false, 'published'),
  (md5('ga-055-media:fe2f7043:ultra-2024-1')::uuid, 'fe2f7043-1889-4b31-b7bb-07bc9c26685d', 'https://picsum.photos/seed/ultra-goa-2024-sunrise/1200/800', 'photo', '100K pre-dawn start, 2024. [Sample]', 'Adventure Quest India', 2024, false, 'published'),
  (md5('ga-055-media:fe2f7043:ultra-2024-2')::uuid, 'fe2f7043-1889-4b31-b7bb-07bc9c26685d', 'https://picsum.photos/seed/ultra-goa-2024-finish/1200/800', 'photo', 'Finish line arch at Agonda, 2024. [Sample]', 'Adventure Quest India', 2024, false, 'published'),
  (md5('ga-055-media:fe2f7043:ultra-2023-1')::uuid, 'fe2f7043-1889-4b31-b7bb-07bc9c26685d', 'https://picsum.photos/seed/ultra-goa-2023-aid/1200/800', 'photo', 'Aid station 35 km, 2023. [Sample]', 'Adventure Quest India', 2023, false, 'published'),
  (md5('ga-055-media:fe2f7043:ultra-video-2025')::uuid, 'fe2f7043-1889-4b31-b7bb-07bc9c26685d', 'https://www.youtube.com/watch?v=yEu83nnRG80', 'video', 'Course flyover (sample clip)', 'YouTube: Mountain Trail', 2025, false, 'published')
ON CONFLICT (id) DO NOTHING;

-- Gravel race (dee4ce05-e00e-46f3-9d4b-808457f8adbd) -----------------------
INSERT INTO event_media (id, event_id, url, kind, caption, credit, edition_year, is_cover, status) VALUES
  (md5('ga-055-media:dee4ce05:gravel-2025-1')::uuid, 'dee4ce05-e00e-46f3-9d4b-808457f8adbd', 'https://picsum.photos/seed/gravel-goa-2025-peloton/1200/800', 'photo', 'Peloton on the dirt-and-tar hill section, 2025. [Sample]', 'Inspire India', 2025, false, 'published'),
  (md5('ga-055-media:dee4ce05:gravel-2025-2')::uuid, 'dee4ce05-e00e-46f3-9d4b-808457f8adbd', 'https://picsum.photos/seed/gravel-goa-2025-podium/1200/800', 'photo', '150K podium at the Betul check point, 2025. [Sample]', 'Inspire India', 2025, false, 'published'),
  (md5('ga-055-media:dee4ce05:gravel-2024-1')::uuid, 'dee4ce05-e00e-46f3-9d4b-808457f8adbd', 'https://picsum.photos/seed/gravel-goa-2024-start/1200/800', 'photo', 'Start pens at Panjim, 2024. [Sample]', 'Inspire India', 2024, false, 'published'),
  (md5('ga-055-media:dee4ce05:gravel-2024-2')::uuid, 'dee4ce05-e00e-46f3-9d4b-808457f8adbd', 'https://picsum.photos/seed/gravel-goa-2024-climb/1200/800', 'photo', 'Chorla Ghat climb, 2024. [Sample]', 'Inspire India', 2024, false, 'published'),
  (md5('ga-055-media:dee4ce05:gravel-video-2025')::uuid, 'dee4ce05-e00e-46f3-9d4b-808457f8adbd', 'https://www.youtube.com/watch?v=M7lc1UVf-VE', 'video', 'Race highlights (sample clip)', 'YouTube', 2025, false, 'published')
ON CONFLICT (id) DO NOTHING;

-- Trek (b6951a6a-a872-45a0-9377-738549a876ea) ------------------------------
INSERT INTO event_media (id, event_id, url, kind, caption, credit, edition_year, is_cover, status) VALUES
  (md5('ga-055-media:b6951a6a:trek-2026-1')::uuid, 'b6951a6a-a872-45a0-9377-738549a876ea', 'https://picsum.photos/seed/trek-goa-2026-ridge/1200/800', 'photo', 'Vagheri ridge, Standard Batch, Oct 2026. [Sample]', 'Audax India Randonneurs', 2026, false, 'published'),
  (md5('ga-055-media:b6951a6a:trek-2026-2')::uuid, 'b6951a6a-a872-45a0-9377-738549a876ea', 'https://picsum.photos/seed/trek-goa-2026-camp/1200/800', 'photo', 'Alpine tent camp on Day 2, Oct 2026. [Sample]', 'Audax India Randonneurs', 2026, false, 'published'),
  (md5('ga-055-media:b6951a6a:trek-2026-3')::uuid, 'b6951a6a-a872-45a0-9377-738549a876ea', 'https://picsum.photos/seed/trek-goa-2026-sunrise/1200/800', 'photo', 'Dudhsagar viewpoint sunrise, Oct 2026. [Sample]', 'Audax India Randonneurs', 2026, false, 'published'),
  (md5('ga-055-media:b6951a6a:trek-2025-1')::uuid, 'b6951a6a-a872-45a0-9377-738549a876ea', 'https://picsum.photos/seed/trek-goa-2025-group/1200/800', 'photo', 'Women-Only Batch summit team, 2025. [Sample]', 'Audax India Randonneurs', 2025, false, 'published')
ON CONFLICT (id) DO NOTHING;

-- Tennis tournament (4011e73d-a3df-4dde-94ea-72c58619d966) ----------------
INSERT INTO event_media (id, event_id, url, kind, caption, credit, edition_year, is_cover, status) VALUES
  (md5('ga-055-media:4011e73d:tennis-2025-1')::uuid, '4011e73d-a3df-4dde-94ea-72c58619d966', 'https://picsum.photos/seed/tennis-goa-2025-final/1200/800', 'photo', 'Mens Singles final rally, 2025. [Sample]', 'FitIndia League', 2025, false, 'published'),
  (md5('ga-055-media:4011e73d:tennis-2025-2')::uuid, '4011e73d-a3df-4dde-94ea-72c58619d966', 'https://picsum.photos/seed/tennis-goa-2025-doubles/1200/800', 'photo', 'Mixed Doubles semi-final, 2025. [Sample]', 'FitIndia League', 2025, false, 'published'),
  (md5('ga-055-media:4011e73d:tennis-2024-1')::uuid, '4011e73d-a3df-4dde-94ea-72c58619d966', 'https://picsum.photos/seed/tennis-goa-2024-trophy/1200/800', 'photo', 'Womens Singles trophy, 2024. [Sample]', 'FitIndia League', 2024, false, 'published'),
  (md5('ga-055-media:4011e73d:tennis-2024-2')::uuid, '4011e73d-a3df-4dde-94ea-72c58619d966', 'https://picsum.photos/seed/tennis-goa-2024-centre/1200/800', 'photo', 'Centre court, 2024. [Sample]', 'FitIndia League', 2024, false, 'published'),
  (md5('ga-055-media:4011e73d:tennis-video-2025')::uuid, '4011e73d-a3df-4dde-94ea-72c58619d966', 'https://www.youtube.com/watch?v=K4TOrB7at0Y', 'video', 'Draw ceremony and schedule (sample clip)', 'YouTube', 2025, false, 'published')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Course map images per Ultra Marathon category.
--    event_categories.course_map_url is a text column. The frontend treats any URL ending
--    in jpg/png/webp/svg as an image and renders a thumbnail. COALESCE so we never overwrite
--    an existing value.
-- ---------------------------------------------------------------------------

UPDATE event_categories SET course_map_url = COALESCE(course_map_url, 'https://picsum.photos/seed/ultra-goa-10k-map/1200/700.jpg')
  WHERE id = '4e9e2b5e-36c5-3e73-f00d-659a4736a5c8';
UPDATE event_categories SET course_map_url = COALESCE(course_map_url, 'https://picsum.photos/seed/ultra-goa-21k-map/1200/700.jpg')
  WHERE id = '0ff2e3ff-a644-1dde-e9d7-577104a2644b';
UPDATE event_categories SET course_map_url = COALESCE(course_map_url, 'https://picsum.photos/seed/ultra-goa-50k-map/1200/700.jpg')
  WHERE id = '168aad7a-2722-9222-c2a3-e53ee3d2f96e';
UPDATE event_categories SET course_map_url = COALESCE(course_map_url, 'https://picsum.photos/seed/ultra-goa-100k-map/1200/700.jpg')
  WHERE id = '25998a87-b591-6039-b88e-11939e8490d1';

-- Gravel race categories: course map image per distance ------------------
UPDATE event_categories SET course_map_url = COALESCE(course_map_url, 'https://picsum.photos/seed/gravel-goa-50k-map/1200/700.jpg')
  WHERE event_id = 'dee4ce05-e00e-46f3-9d4b-808457f8adbd' AND course_map_url IS NULL AND label ILIKE '%50K%';
UPDATE event_categories SET course_map_url = COALESCE(course_map_url, 'https://picsum.photos/seed/gravel-goa-100k-map/1200/700.jpg')
  WHERE event_id = 'dee4ce05-e00e-46f3-9d4b-808457f8adbd' AND course_map_url IS NULL AND label ILIKE '%100K%';
UPDATE event_categories SET course_map_url = COALESCE(course_map_url, 'https://picsum.photos/seed/gravel-goa-150k-map/1200/700.jpg')
  WHERE event_id = 'dee4ce05-e00e-46f3-9d4b-808457f8adbd' AND course_map_url IS NULL AND label ILIKE '%150K%';

COMMIT;

-- Verification (run separately after COMMIT):
--   SELECT event_id, count(*), count(*) FILTER (WHERE kind='video') AS videos FROM event_media WHERE event_id IN
--     ('fe2f7043-1889-4b31-b7bb-07bc9c26685d','dee4ce05-e00e-46f3-9d4b-808457f8adbd','b6951a6a-a872-45a0-9377-738549a876ea','4011e73d-a3df-4dde-94ea-72c58619d966')
--     GROUP BY event_id;
--   SELECT label, course_map_url FROM event_categories WHERE event_id='fe2f7043-1889-4b31-b7bb-07bc9c26685d' ORDER BY distance_km;
