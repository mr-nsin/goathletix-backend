-- 0001 · GA-051 · Showcase dummy data for the migration-0026 event-page fields.
--
-- Four events (one per sport family) are populated across the new columns on
-- events / event_categories / organizers (social links) and across the five
-- new child tables (event_awards, event_checkpoints, event_resources,
-- event_offers, event_itinerary_days). The page is almost blank today; this
-- seed fills enough to demo every panel.
--
-- Every tagline carries the suffix "[Sample]" so the owner can tell at a glance
-- what came from this seed.
--
-- Apply:
--   Supabase dashboard -> SQL editor -> paste this whole file -> Run.
--
-- Idempotency: INSERTs use deterministic UUIDs (md5('ga-051-...')::uuid) with
-- ON CONFLICT DO NOTHING; UPDATEs are COALESCE-guarded or scoped with
-- WHERE col IS NULL / WHERE col = '{}'. A second run is a no-op. One
-- BEGIN/COMMIT. No DROP, no TRUNCATE, no DELETE, no ALTER. Write-only.
--
-- Showcase events (verified 2026-10-19 via REST, all four exist, all four have
-- zero rows in event_categories today):
--   fe2f7043-1889-4b31-b7bb-07bc9c26685d  Ultimate Goa Ultra Marathon 2026   (running)
--   dee4ce05-e00e-46f3-9d4b-808457f8adbd  Star Goa Gravel Race 2026          (cycling)
--   b6951a6a-a872-45a0-9377-738549a876ea  Monsoon Goa Mountain Challenge 2027 (trekking)
--   4011e73d-a3df-4dde-94ea-72c58619d966  Star Goa Tennis Tournament 2026    (racquet)

BEGIN;

-- ===========================================================================
-- 1. events: top up each panel the detail page reads (0023, 0025, 0026).
-- ===========================================================================

-- --- Ultimate Goa Ultra Marathon 2026 (running / ultra) --------------------
UPDATE events SET
  tagline               = COALESCE(tagline, 'Four distances along the Goan coast, from a seaside 10K to a 100K ultra. [Sample]'),
  safety_info           = COALESCE(safety_info, 'Two mobile ambulances, three medical posts with doctor + paramedic, emergency hotline staffed 05:00-23:00 on race day.'),
  contact_email         = COALESCE(contact_email, 'race@ultimategoaultra.sample.in'),
  contact_phone         = COALESCE(contact_phone, '+91 90000 10001'),
  whatsapp_url          = COALESCE(whatsapp_url, 'https://chat.whatsapp.com/sample-ultra-goa-2026'),
  refund_policy         = COALESCE(refund_policy, 'Full refund (minus gateway fee) up to 60 days before race day. 50% refund up to 30 days before. No refund thereafter.'),
  transfer_policy       = COALESCE(transfer_policy, 'Bib transfer to another runner allowed up to 14 days before race day for a fee of INR 500. One transfer per bib.'),
  deferral_policy       = COALESCE(deferral_policy, 'Deferral to the 2027 edition allowed once, up to 21 days before race day, for INR 750. Not combinable with transfer.'),
  cancellation_policy   = COALESCE(cancellation_policy, 'If the organiser cancels for weather, government order or force majeure, participants receive either a 70% refund or a free deferral.'),
  terms_text            = COALESCE(terms_text, 'By registering you agree to abide by the race rules, follow marshal instructions and accept the organiser''s decision as final. The organiser may reroute or shorten the course for safety.'),
  waiver_text           = COALESCE(waiver_text, 'I acknowledge the inherent risks of long-distance running and release the organiser, its sponsors and volunteers from any claim arising from my participation. I confirm I am medically fit to run the distance I have entered.'),
  gst_rate              = COALESCE(gst_rate, 0.18),
  bib_expo_opens_at     = COALESCE(bib_expo_opens_at,  '2026-11-25 10:00:00+05:30'::timestamptz),
  bib_expo_closes_at    = COALESCE(bib_expo_closes_at, '2026-11-26 20:00:00+05:30'::timestamptz),
  results_url           = COALESCE(results_url, 'https://results.ultimategoaultra.sample.in/2026'),
  fitness_requirement   = COALESCE(fitness_requirement, '50K / 100K entrants must have finished a timed marathon within the last 24 months; 100K entrants: sub-5h30 required at bib collection.'),
  changes_allowed_until = COALESCE(changes_allowed_until, '2026-11-20 23:59:00+05:30'::timestamptz),
  gpx_url               = COALESCE(gpx_url, 'https://cdn.goathletix.sample/gpx/ultra-goa-2026-100k.gpx'),
  sanction_reference    = COALESCE(sanction_reference, 'AIMS course measurement cert IND-2026-0471; AFI event permit AFI/EV/2026/114'),
  edition_number        = COALESCE(edition_number, 7),
  sponsorship_contact   = COALESCE(sponsorship_contact, 'sponsors@ultimategoaultra.sample.in'),
  closes_when_sold_out  = COALESCE(closes_when_sold_out, true),
  instagram_url         = COALESCE(instagram_url, 'https://instagram.com/ultimategoaultra'),
  facebook_url          = COALESCE(facebook_url,  'https://facebook.com/ultimategoaultra'),
  youtube_url           = COALESCE(youtube_url,   'https://youtube.com/@ultimategoaultra'),
  x_url                 = COALESCE(x_url,         'https://x.com/ugoaultra'),
  linkedin_url          = COALESCE(linkedin_url,  'https://linkedin.com/company/ultimate-goa-ultra'),
  strava_url            = COALESCE(strava_url,    'https://strava.com/clubs/ultimategoaultra'),
  hashtag               = COALESCE(hashtag, 'UltimateGoaUltra2026'),
  kit_collection_mandatory = COALESCE(kit_collection_mandatory, true),
  race_day_collection      = COALESCE(race_day_collection, false)
WHERE id = 'fe2f7043-1889-4b31-b7bb-07bc9c26685d';

UPDATE events SET sport_details = jsonb_build_object('v',1,'course_type','point_to_point')
  WHERE id = 'fe2f7043-1889-4b31-b7bb-07bc9c26685d' AND sport_details = '{}'::jsonb;
UPDATE events SET amenities = ARRAY['parking','hydration','toilets','medical','baggage_counter','changing_rooms','timing_chip','finisher_medal','tshirt','pacers','live_tracking']::text[]
  WHERE id = 'fe2f7043-1889-4b31-b7bb-07bc9c26685d' AND amenities = '{}'::text[];
UPDATE events SET mandatory_gear = ARRAY['Race bib pinned front','Timing chip','Reflective vest (100K only)','Headlamp (100K only)']::text[]
  WHERE id = 'fe2f7043-1889-4b31-b7bb-07bc9c26685d' AND mandatory_gear = '{}'::text[];
UPDATE events SET recommended_gear = ARRAY['Hydration pack','Anti-chafe balm','Sun cap','Electrolyte tabs']::text[]
  WHERE id = 'fe2f7043-1889-4b31-b7bb-07bc9c26685d' AND recommended_gear = '{}'::text[];
UPDATE events SET women_safety = ARRAY['female_medics','female_volunteers','women_only_wave','separate_changing','well_lit_route']::text[]
  WHERE id = 'fe2f7043-1889-4b31-b7bb-07bc9c26685d' AND women_safety = '{}'::text[];
UPDATE events SET aid_stations = '[
  {"km": 5,  "items": ["water","electrolyte","banana"]},
  {"km": 10, "items": ["water","electrolyte","orange","gel"]},
  {"km": 21, "items": ["water","electrolyte","banana","salted biscuits"]},
  {"km": 35, "items": ["water","electrolyte","gel","dates","soup"]},
  {"km": 50, "items": ["water","electrolyte","noodles","orange","drop bag"]},
  {"km": 75, "items": ["water","electrolyte","soup","gel","medical"]}
]'::jsonb
  WHERE id = 'fe2f7043-1889-4b31-b7bb-07bc9c26685d' AND aid_stations IS NULL;

-- --- Star Goa Gravel Race 2026 (cycling / endurance) -----------------------
UPDATE events SET
  tagline               = COALESCE(tagline, 'Three gravel loops through the Western Ghats laterite trails, from a 50 km fellowship ride to a 150 km race. [Sample]'),
  safety_info           = COALESCE(safety_info, 'Two medical ambulances sweep the course. Marshals at every junction. Mandatory bike check at bib collection; riders without working brakes or helmet will not be flagged off.'),
  contact_email         = COALESCE(contact_email, 'race@stargoagravel.sample.in'),
  contact_phone         = COALESCE(contact_phone, '+91 90000 10002'),
  whatsapp_url          = COALESCE(whatsapp_url, 'https://chat.whatsapp.com/sample-stargoa-gravel'),
  refund_policy         = COALESCE(refund_policy, '70% refund up to 45 days before start, 40% up to 15 days before, no refund within 14 days.'),
  transfer_policy       = COALESCE(transfer_policy, 'Transfer to another rider allowed up to 10 days before, INR 400 admin fee.'),
  deferral_policy       = COALESCE(deferral_policy, 'One free deferral to the 2027 edition allowed up to 15 days before start.'),
  cancellation_policy   = COALESCE(cancellation_policy, 'If the organiser cancels, 70% refund or free deferral to next edition.'),
  terms_text            = COALESCE(terms_text, 'All riders must comply with Indian road traffic rules and ride on the correct side of the road at all times. Doping tests may be conducted on podium finishers.'),
  waiver_text           = COALESCE(waiver_text, 'I accept the risks of cycling on open roads and gravel tracks and release the organiser from any claim for injury, loss or damage during the event.'),
  gst_rate              = COALESCE(gst_rate, 0.18),
  bib_expo_opens_at     = COALESCE(bib_expo_opens_at,  '2026-02-27 11:00:00+05:30'::timestamptz),
  bib_expo_closes_at    = COALESCE(bib_expo_closes_at, '2026-02-28 20:00:00+05:30'::timestamptz),
  results_url           = COALESCE(results_url, 'https://results.stargoagravel.sample.in/2026'),
  fitness_requirement   = COALESCE(fitness_requirement, 'Finish a 60 km ride in under 3h30 within the last 12 months. 150 km entrants: a 100 km finish required.'),
  changes_allowed_until = COALESCE(changes_allowed_until, '2026-02-20 23:59:00+05:30'::timestamptz),
  gpx_url               = COALESCE(gpx_url, 'https://cdn.goathletix.sample/gpx/stargoa-gravel-2026-150k.gpx'),
  sanction_reference    = COALESCE(sanction_reference, 'ACP brevet homologation ACP-IN-2026-0088; CFI endorsement CFI/2026/042'),
  edition_number        = COALESCE(edition_number, 4),
  sponsorship_contact   = COALESCE(sponsorship_contact, 'sponsors@stargoagravel.sample.in'),
  closes_when_sold_out  = COALESCE(closes_when_sold_out, true),
  instagram_url         = COALESCE(instagram_url, 'https://instagram.com/stargoagravel'),
  facebook_url          = COALESCE(facebook_url,  'https://facebook.com/stargoagravel'),
  youtube_url           = COALESCE(youtube_url,   'https://youtube.com/@stargoagravel'),
  x_url                 = COALESCE(x_url,         'https://x.com/stargoagravel'),
  linkedin_url          = COALESCE(linkedin_url,  'https://linkedin.com/company/star-goa-gravel'),
  strava_url            = COALESCE(strava_url,    'https://strava.com/clubs/stargoagravel'),
  hashtag               = COALESCE(hashtag, 'StarGoaGravel2026'),
  kit_collection_mandatory = COALESCE(kit_collection_mandatory, true),
  race_day_collection      = COALESCE(race_day_collection, false)
WHERE id = 'dee4ce05-e00e-46f3-9d4b-808457f8adbd';

UPDATE events SET sport_details = jsonb_build_object(
  'v',1,'ride_format','gran_fondo','support_level','supported',
  'proof_of_passage','Timing chip + QR scan at each control',
  'bike_types_allowed', jsonb_build_array('mtb','hybrid','any'),
  'night_riding', false,
  'rider_number_display','Number plate on handlebar + bib on jersey'
) WHERE id = 'dee4ce05-e00e-46f3-9d4b-808457f8adbd' AND sport_details = '{}'::jsonb;
UPDATE events SET amenities = ARRAY['parking','hydration','toilets','medical','baggage_counter','timing_chip','finisher_medal','live_tracking','photography','breakfast']::text[]
  WHERE id = 'dee4ce05-e00e-46f3-9d4b-808457f8adbd' AND amenities = '{}'::text[];
UPDATE events SET mandatory_gear = ARRAY['CPSC/ISI certified helmet','Front white light','Rear red light','Reflective vest','Spare tube and pump']::text[]
  WHERE id = 'dee4ce05-e00e-46f3-9d4b-808457f8adbd' AND mandatory_gear = '{}'::text[];
UPDATE events SET recommended_gear = ARRAY['Gravel tyres >=38mm','Hydration vest','Chain lube','Multi-tool','Energy gels']::text[]
  WHERE id = 'dee4ce05-e00e-46f3-9d4b-808457f8adbd' AND recommended_gear = '{}'::text[];
UPDATE events SET women_safety = ARRAY['female_marshals','female_volunteers','women_only_category','women_helpline','safe_transport']::text[]
  WHERE id = 'dee4ce05-e00e-46f3-9d4b-808457f8adbd' AND women_safety = '{}'::text[];
UPDATE events SET aid_stations = '[
  {"km": 25,  "items": ["water","electrolyte","banana","mechanic"]},
  {"km": 60,  "items": ["water","electrolyte","sandwich","mechanic","medical"]},
  {"km": 100, "items": ["water","electrolyte","soup","orange","mechanic"]},
  {"km": 130, "items": ["water","electrolyte","gel","medical"]}
]'::jsonb
  WHERE id = 'dee4ce05-e00e-46f3-9d4b-808457f8adbd' AND aid_stations IS NULL;

-- --- Monsoon Goa Mountain Challenge 2027 (trekking / multi-day) ------------
UPDATE events SET
  tagline               = COALESCE(tagline, 'A five-day monsoon trek across the Dudhsagar ridge, with waterfalls, bamboo groves and a 1,023 m summit day. [Sample]'),
  safety_info           = COALESCE(safety_info, 'Certified mountain leader per 10 participants, satellite phone with the sweep guide, pre-trek fitness screening, evacuation plan filed with the Forest Dept.'),
  contact_email         = COALESCE(contact_email, 'treks@monsoongoamountain.sample.in'),
  contact_phone         = COALESCE(contact_phone, '+91 90000 10003'),
  whatsapp_url          = COALESCE(whatsapp_url, 'https://chat.whatsapp.com/sample-monsoon-goa-trek'),
  refund_policy         = COALESCE(refund_policy, 'Full refund up to 45 days before departure, 50% up to 21 days, no refund within 14 days. Trek credits may be issued at the organiser''s discretion.'),
  transfer_policy       = COALESCE(transfer_policy, 'Transfer to another trekker allowed up to 10 days before departure (INR 500 fee). Transfer to a different batch allowed up to 15 days before, subject to availability.'),
  deferral_policy       = COALESCE(deferral_policy, 'One free deferral to the next scheduled batch within 12 months, up to 21 days before departure.'),
  cancellation_policy   = COALESCE(cancellation_policy, 'If the organiser cancels for weather, landslide or Forest Dept order, participants receive a full refund minus non-refundable permits (approx INR 1,500) or a free rebooking.'),
  terms_text            = COALESCE(terms_text, 'Participants must obey the trek leader at all times. Alcohol and smoking are not permitted on the trail. The leader may turn back any participant whose pace or health threatens group safety.'),
  waiver_text           = COALESCE(waiver_text, 'I confirm I am medically fit for a multi-day high-altitude trek, I have declared any pre-existing conditions truthfully, and I release the organiser from liability for any injury, loss or damage arising from this trek.'),
  gst_rate              = COALESCE(gst_rate, 0.05),
  results_url           = COALESCE(results_url, NULL),
  fitness_requirement   = COALESCE(fitness_requirement, 'Able to walk 10 km in 2h30 at sea level and climb three flights of stairs without rest. BMI 18-30. No uncontrolled hypertension, asthma or cardiac history.'),
  changes_allowed_until = COALESCE(changes_allowed_until, '2027-10-25 23:59:00+05:30'::timestamptz),
  gpx_url               = COALESCE(gpx_url, 'https://cdn.goathletix.sample/gpx/monsoon-goa-trek-2027.gpx'),
  sanction_reference    = COALESCE(sanction_reference, 'IMF trek registration IMF/WG/2027/0019; Goa Forest Dept permit FOR/EC/2027/114'),
  edition_number        = COALESCE(edition_number, 9),
  sponsorship_contact   = COALESCE(sponsorship_contact, 'partners@monsoongoamountain.sample.in'),
  closes_when_sold_out  = COALESCE(closes_when_sold_out, true),
  instagram_url         = COALESCE(instagram_url, 'https://instagram.com/monsoongoamountain'),
  facebook_url          = COALESCE(facebook_url,  'https://facebook.com/monsoongoamountain'),
  youtube_url           = COALESCE(youtube_url,   'https://youtube.com/@monsoongoamountain'),
  x_url                 = COALESCE(x_url,         'https://x.com/mgoatrek'),
  linkedin_url          = COALESCE(linkedin_url,  'https://linkedin.com/company/monsoon-goa-mountain'),
  strava_url            = COALESCE(strava_url,    'https://strava.com/clubs/monsoongoamountain'),
  hashtag               = COALESCE(hashtag, 'MonsoonGoaTrek2027'),
  kit_collection_mandatory = COALESCE(kit_collection_mandatory, false),
  race_day_collection      = COALESCE(race_day_collection, true)
WHERE id = 'b6951a6a-a872-45a0-9377-738549a876ea';

UPDATE events SET sport_details = jsonb_build_object(
  'v',1,'duration_days',5,'duration_nights',4,
  'base_camp_altitude_m',620,'trek_distance_km',48,
  'start_point','Collem railway station',
  'end_point','Castle Rock',
  'pickup_point','Collem station, 09:00 IST',
  'pickup_time','09:00 IST, Day 1',
  'group_size_max',14,
  'gender_ratio','Open; women-only departures on request (min 6 pax)',
  'stay','Alpine tents (3 sharing) Days 1-3; forest guesthouse Day 4',
  'meals','Veg + egg; Jain / vegan on request at booking',
  'permits', jsonb_build_array('Mollem National Park entry','Castle Rock trail pass'),
  'connectivity','Mobile signal only at Collem and Castle Rock; sat phone with sweep',
  'best_season','October to February'
) WHERE id = 'b6951a6a-a872-45a0-9377-738549a876ea' AND sport_details = '{}'::jsonb;
UPDATE events SET amenities = ARRAY['parking','hydration','toilets','medical','baggage_counter','photography','shuttle']::text[]
  WHERE id = 'b6951a6a-a872-45a0-9377-738549a876ea' AND amenities = '{}'::text[];
UPDATE events SET mandatory_gear = ARRAY['Trekking shoes with ankle support','Rain jacket + poncho','3-litre water carry','Headlamp with spare batteries','Govt photo ID','Personal medication']::text[]
  WHERE id = 'b6951a6a-a872-45a0-9377-738549a876ea' AND mandatory_gear = '{}'::text[];
UPDATE events SET recommended_gear = ARRAY['50-60L backpack','Trekking poles','Quick-dry layers','Dry bag for electronics','Sunscreen SPF 50+','Insect repellent']::text[]
  WHERE id = 'b6951a6a-a872-45a0-9377-738549a876ea' AND recommended_gear = '{}'::text[];
UPDATE events SET women_safety = ARRAY['female_marshals','female_volunteers','same_gender_tents','separate_changing','women_helpline']::text[]
  WHERE id = 'b6951a6a-a872-45a0-9377-738549a876ea' AND women_safety = '{}'::text[];

-- --- Star Goa Tennis Tournament 2026 (racquet) -----------------------------
UPDATE events SET
  tagline               = COALESCE(tagline, 'An AITA-sanctioned open tennis tournament with singles, doubles and mixed draws across six hard courts. [Sample]'),
  safety_info           = COALESCE(safety_info, 'Doctor on-site during match hours; physio room available for registered players. First-aid kit at every court.'),
  contact_email         = COALESCE(contact_email, 'desk@stargoatennis.sample.in'),
  contact_phone         = COALESCE(contact_phone, '+91 90000 10004'),
  whatsapp_url          = COALESCE(whatsapp_url, 'https://chat.whatsapp.com/sample-stargoa-tennis'),
  refund_policy         = COALESCE(refund_policy, 'Entry fees are non-refundable once draws are published. Withdrawals before draw release receive a full refund minus INR 200 gateway fee.'),
  transfer_policy       = COALESCE(transfer_policy, 'Draw entries are personal and non-transferable per AITA regulations.'),
  deferral_policy       = COALESCE(deferral_policy, 'Not available for tournament entries.'),
  cancellation_policy   = COALESCE(cancellation_policy, 'If the tournament is cancelled before start of play, full refund. If cancelled mid-tournament, pro-rated refund by rounds played.'),
  terms_text            = COALESCE(terms_text, 'Players must report 30 minutes before scheduled match time; a 15-minute grace is permitted after which a walkover is awarded. Code of conduct per AITA rulebook applies.'),
  waiver_text           = COALESCE(waiver_text, 'I confirm I am medically fit to compete and release the organiser from any claim for injury, loss or damage during the tournament.'),
  gst_rate              = COALESCE(gst_rate, 0.18),
  results_url           = COALESCE(results_url, 'https://draws.stargoatennis.sample.in/2026'),
  fitness_requirement   = COALESCE(fitness_requirement, 'Match-fit for best-of-three sets. Juniors require parent / guardian consent at check-in.'),
  changes_allowed_until = COALESCE(changes_allowed_until, '2026-10-10 23:59:00+05:30'::timestamptz),
  sanction_reference    = COALESCE(sanction_reference, 'AITA calendar tournament AITA/2026/CS/0421; Goa State Tennis Association approval GSTA/2026/18'),
  edition_number        = COALESCE(edition_number, 12),
  sponsorship_contact   = COALESCE(sponsorship_contact, 'sponsors@stargoatennis.sample.in'),
  closes_when_sold_out  = COALESCE(closes_when_sold_out, true),
  instagram_url         = COALESCE(instagram_url, 'https://instagram.com/stargoatennis'),
  facebook_url          = COALESCE(facebook_url,  'https://facebook.com/stargoatennis'),
  youtube_url           = COALESCE(youtube_url,   'https://youtube.com/@stargoatennis'),
  x_url                 = COALESCE(x_url,         'https://x.com/stargoatennis'),
  linkedin_url          = COALESCE(linkedin_url,  'https://linkedin.com/company/star-goa-tennis'),
  hashtag               = COALESCE(hashtag, 'StarGoaTennis2026'),
  kit_collection_mandatory = COALESCE(kit_collection_mandatory, false),
  race_day_collection      = COALESCE(race_day_collection, true)
WHERE id = '4011e73d-a3df-4dde-94ea-72c58619d966';

UPDATE events SET sport_details = jsonb_build_object(
  'v',1,'tournament_format','knockout','courts',6,'court_surface','hard'
) WHERE id = '4011e73d-a3df-4dde-94ea-72c58619d966' AND sport_details = '{}'::jsonb;
UPDATE events SET amenities = ARRAY['parking','hydration','toilets','medical','changing_rooms','photography','live_tracking','wheelchair_access']::text[]
  WHERE id = '4011e73d-a3df-4dde-94ea-72c58619d966' AND amenities = '{}'::text[];
UPDATE events SET mandatory_gear = ARRAY['Non-marking tennis shoes','White or coloured match attire','Player ID']::text[]
  WHERE id = '4011e73d-a3df-4dde-94ea-72c58619d966' AND mandatory_gear = '{}'::text[];
UPDATE events SET recommended_gear = ARRAY['Two match-ready racquets','Sweatbands','Spare grips','Electrolyte drink']::text[]
  WHERE id = '4011e73d-a3df-4dde-94ea-72c58619d966' AND recommended_gear = '{}'::text[];
UPDATE events SET women_safety = ARRAY['female_marshals','female_volunteers','separate_changing','women_helpline']::text[]
  WHERE id = '4011e73d-a3df-4dde-94ea-72c58619d966' AND women_safety = '{}'::text[];

-- ===========================================================================
-- 2. organizers: social links. COALESCE so existing values are kept.
-- ===========================================================================

UPDATE organizers SET
  facebook_url = COALESCE(facebook_url, 'https://facebook.com/ultimategoaultra'),
  youtube_url  = COALESCE(youtube_url,  'https://youtube.com/@ultimategoaultra'),
  x_url        = COALESCE(x_url,        'https://x.com/ugoaultra'),
  linkedin_url = COALESCE(linkedin_url, 'https://linkedin.com/company/ultimate-goa-ultra'),
  strava_url   = COALESCE(strava_url,   'https://strava.com/clubs/ultimategoaultra'),
  whatsapp_url = COALESCE(whatsapp_url, 'https://chat.whatsapp.com/sample-ultra-goa-2026')
WHERE id = '5e419773-f40e-47b3-ab1a-ecfcb2446cc9';

UPDATE organizers SET
  facebook_url = COALESCE(facebook_url, 'https://facebook.com/stargoagravel'),
  youtube_url  = COALESCE(youtube_url,  'https://youtube.com/@stargoagravel'),
  x_url        = COALESCE(x_url,        'https://x.com/stargoagravel'),
  linkedin_url = COALESCE(linkedin_url, 'https://linkedin.com/company/star-goa-gravel'),
  strava_url   = COALESCE(strava_url,   'https://strava.com/clubs/stargoagravel'),
  whatsapp_url = COALESCE(whatsapp_url, 'https://chat.whatsapp.com/sample-stargoa-gravel')
WHERE id = 'aeb855bd-ca39-4596-a6a8-185e13c61a6e';

UPDATE organizers SET
  facebook_url = COALESCE(facebook_url, 'https://facebook.com/monsoongoamountain'),
  youtube_url  = COALESCE(youtube_url,  'https://youtube.com/@monsoongoamountain'),
  x_url        = COALESCE(x_url,        'https://x.com/mgoatrek'),
  linkedin_url = COALESCE(linkedin_url, 'https://linkedin.com/company/monsoon-goa-mountain'),
  strava_url   = COALESCE(strava_url,   'https://strava.com/clubs/monsoongoamountain'),
  whatsapp_url = COALESCE(whatsapp_url, 'https://chat.whatsapp.com/sample-monsoon-goa-trek')
WHERE id = '0a62084c-1d43-4937-81c4-2c836c6a2990';

UPDATE organizers SET
  facebook_url = COALESCE(facebook_url, 'https://facebook.com/stargoatennis'),
  youtube_url  = COALESCE(youtube_url,  'https://youtube.com/@stargoatennis'),
  x_url        = COALESCE(x_url,        'https://x.com/stargoatennis'),
  linkedin_url = COALESCE(linkedin_url, 'https://linkedin.com/company/star-goa-tennis'),
  strava_url   = COALESCE(strava_url,   'https://strava.com/clubs/star-goa-tennis'),
  whatsapp_url = COALESCE(whatsapp_url, 'https://chat.whatsapp.com/sample-stargoa-tennis')
WHERE id = '4cdfbae1-338f-450d-bd5f-895d76b6f280';

-- ===========================================================================
-- 3. event_categories: live DB has 0 rows for all 4 events, so we create them.
--    ON CONFLICT (id) DO NOTHING with deterministic UUIDs keeps re-runs safe.
--    UNIQUE (event_id, label) is also enforced by the table.
-- ===========================================================================

-- --- Ultimate Goa Ultra Marathon 2026: 4 running categories ---------------
INSERT INTO event_categories (
  id, event_id, label, discipline_slug, distance_km, gender, start_time,
  cutoff_minutes, capacity, price_inr, compare_at_price_inr, is_timed,
  ticket_kind, sort_order, sport_details, excludes
) VALUES
  (md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:10K')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d', '10K', 'ten_k', 10.0, 'open',
   '06:00', 90, 800, 900, 1200, true, 'participant', 1,
   jsonb_build_object('v',1,'pacers', jsonb_build_array('55:00','1:00:00','1:10:00')),
   ARRAY['Finisher medal is 10K-specific']::text[]),
  (md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:21K')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d', '21K', 'half_marathon', 21.097, 'open',
   '05:30', 180, 1500, 1600, 2200, true, 'participant', 2,
   jsonb_build_object('v',1,'pacers', jsonb_build_array('1:45','2:00','2:15','2:30')),
   ARRAY['No pacer above 2:30 group']::text[]),
  (md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:50K')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d', '50K', 'ultra_marathon', 50.0, 'open',
   '05:00', 480, 400, 3800, 4500, true, 'participant', 3,
   jsonb_build_object('v',1,'itra_points',2),
   ARRAY['No bib pickup on race day']::text[]),
  (md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:100K')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d', '100K', 'ultra_marathon', 100.0, 'open',
   '03:00', 900, 200, 6800, 7900, true, 'participant', 4,
   jsonb_build_object('v',1,'itra_points',4,'utmb_index',null),
   ARRAY['Crew pacers not allowed','No earphones in last 5 km']::text[])
ON CONFLICT (id) DO NOTHING;

UPDATE event_categories SET
  description = COALESCE(description, 'Flat seaside 10 km on tarmac, ideal for first-time racers. Chip timing, electronic bib.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Finisher medal','Timing chip','Bib + safety pins','Hydration at 5 km','Finisher refreshments','Baggage counter']::text[] ELSE includes END,
  max_per_order = COALESCE(max_per_order, 5),
  min_age = COALESCE(min_age, 12), max_age = COALESCE(max_age, 75),
  age_as_on_date = COALESCE(age_as_on_date, '2026-11-27'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['govt_id','parental_consent']::text[] ELSE required_documents END,
  eligibility_notes = COALESCE(eligibility_notes, 'Open to all; strollers and dogs not permitted on course.'),
  course_map_url = COALESCE(course_map_url, 'https://cdn.goathletix.sample/maps/ultra-goa-2026-10k.pdf')
WHERE id = md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:10K')::uuid;

UPDATE event_categories SET
  description = COALESCE(description, 'Rolling half marathon that follows the coastline from Miramar to Dona Paula and back.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Finisher medal','Timing chip','Bib + safety pins','5 aid stations','Finisher refreshments','Baggage counter','Event tee']::text[] ELSE includes END,
  max_per_order = COALESCE(max_per_order, 5),
  min_age = COALESCE(min_age, 16), max_age = COALESCE(max_age, 75),
  age_as_on_date = COALESCE(age_as_on_date, '2026-11-27'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['govt_id','parental_consent']::text[] ELSE required_documents END,
  eligibility_notes = COALESCE(eligibility_notes, 'Minimum sub-2h45 recent 21K finish recommended but not required.'),
  course_map_url = COALESCE(course_map_url, 'https://cdn.goathletix.sample/maps/ultra-goa-2026-21k.pdf')
WHERE id = md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:21K')::uuid;

UPDATE event_categories SET
  description = COALESCE(description, '50 km coastal ultra with two major climbs. Six aid stations, drop-bag at 25 km.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Finisher medal and tee','Timing chip','Bib','6 aid stations','Drop bag','Live tracking link','Post-race meal']::text[] ELSE includes END,
  max_per_order = COALESCE(max_per_order, 3),
  min_age = COALESCE(min_age, 18), max_age = COALESCE(max_age, 70),
  age_as_on_date = COALESCE(age_as_on_date, '2026-11-27'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['govt_id','qualifying_proof']::text[] ELSE required_documents END,
  qualifying_standard = COALESCE(qualifying_standard, 'Marathon sub 5h00 within last 24 months, or 50K < 7h00.'),
  eligibility_notes = COALESCE(eligibility_notes, 'Mandatory pre-race briefing on race day minus one.'),
  course_map_url = COALESCE(course_map_url, 'https://cdn.goathletix.sample/maps/ultra-goa-2026-50k.pdf')
WHERE id = md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:50K')::uuid;

UPDATE event_categories SET
  description = COALESCE(description, 'Flagship 100 km ultra along the Konkan coast with a 15-hour cutoff and night-running section.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Finisher medal, trophy and tee','Timing chip','Bib','8 aid stations','Two drop bags','Live tracking','Pacer allowed from 60 km','Post-race meal and massage']::text[] ELSE includes END,
  max_per_order = COALESCE(max_per_order, 2),
  min_age = COALESCE(min_age, 21), max_age = COALESCE(max_age, 70),
  age_as_on_date = COALESCE(age_as_on_date, '2026-11-27'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['govt_id','qualifying_proof','medical_certificate']::text[] ELSE required_documents END,
  qualifying_standard = COALESCE(qualifying_standard, 'Marathon sub 5h30 OR 50K sub 7h00 within the last 24 months.'),
  eligibility_notes = COALESCE(eligibility_notes, 'Mandatory kit check at bib collection. Non-compliance = no bib.'),
  course_map_url = COALESCE(course_map_url, 'https://cdn.goathletix.sample/maps/ultra-goa-2026-100k.pdf')
WHERE id = md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:100K')::uuid;

-- --- Star Goa Gravel Race 2026: 3 cycling categories ----------------------
INSERT INTO event_categories (
  id, event_id, label, discipline_slug, distance_km, gender, start_time,
  cutoff_minutes, capacity, price_inr, compare_at_price_inr, is_timed,
  ticket_kind, sort_order, sport_details, excludes
) VALUES
  (md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:50K Fellowship')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd', '50K Fellowship', 'gravel', 50.0, 'open',
   '07:00', 300, 300, 1800, 2400, false, 'participant', 1,
   jsonb_build_object('v',1,'bike_types_allowed', jsonb_build_array('mtb','hybrid','any')),
   ARRAY['Non-competitive','No podium']::text[]),
  (md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:100K Gran Fondo')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd', '100K Gran Fondo', 'gran_fondo', 100.0, 'open',
   '06:30', 540, 400, 3200, 3900, true, 'participant', 2,
   jsonb_build_object('v',1,'bike_types_allowed', jsonb_build_array('mtb','hybrid')),
   ARRAY['E-bikes not allowed','No drafting cars']::text[]),
  (md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:150K Race')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd', '150K Race', 'gran_fondo', 150.0, 'open',
   '06:00', 720, 200, 4800, 5900, true, 'participant', 3,
   jsonb_build_object('v',1,'bike_types_allowed', jsonb_build_array('mtb','hybrid'),'qualifying_window', jsonb_build_object('from','2025-01-01','to','2026-02-14')),
   ARRAY['E-bikes not allowed','No drafting cars','No aerobars']::text[])
ON CONFLICT (id) DO NOTHING;

UPDATE event_categories SET
  description = COALESCE(description, 'Fellowship ride on gravel-and-tar farm roads. Mechanical and medical support throughout.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Finisher medal','Bib + number plate','3 aid stations','Mechanical support','Breakfast and post-ride meal']::text[] ELSE includes END,
  max_per_order = COALESCE(max_per_order, 4),
  min_age = COALESCE(min_age, 14), max_age = COALESCE(max_age, 70),
  age_as_on_date = COALESCE(age_as_on_date, '2026-03-01'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['govt_id','parental_consent']::text[] ELSE required_documents END,
  eligibility_notes = COALESCE(eligibility_notes, 'Open to all with a roadworthy MTB or hybrid.'),
  course_map_url = COALESCE(course_map_url, 'https://cdn.goathletix.sample/maps/stargoa-gravel-2026-50k.pdf')
WHERE id = md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:50K Fellowship')::uuid;

UPDATE event_categories SET
  description = COALESCE(description, 'Gran fondo loop with two major climbs. Chip timed, podium per gender.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Finisher medal and tee','Chip timing','Bib + number plate','4 aid stations','Mechanical and medical support','Post-ride meal']::text[] ELSE includes END,
  max_per_order = COALESCE(max_per_order, 3),
  min_age = COALESCE(min_age, 18), max_age = COALESCE(max_age, 65),
  age_as_on_date = COALESCE(age_as_on_date, '2026-03-01'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['govt_id']::text[] ELSE required_documents END,
  eligibility_notes = COALESCE(eligibility_notes, 'Participants must complete a bike check at the expo.'),
  course_map_url = COALESCE(course_map_url, 'https://cdn.goathletix.sample/maps/stargoa-gravel-2026-100k.pdf')
WHERE id = md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:100K Gran Fondo')::uuid;

UPDATE event_categories SET
  description = COALESCE(description, 'The flagship 150 km race with four control points, 12 h cutoff, cash prizes to podium.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Finisher medal, trophy and tee','Chip timing','Bib + number plate','4 aid + 4 control points','Mechanical and medical sweep','Live tracking','Post-ride meal + massage']::text[] ELSE includes END,
  max_per_order = COALESCE(max_per_order, 2),
  min_age = COALESCE(min_age, 19), max_age = COALESCE(max_age, 60),
  age_as_on_date = COALESCE(age_as_on_date, '2026-03-01'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['govt_id','qualifying_proof','medical_certificate']::text[] ELSE required_documents END,
  qualifying_standard = COALESCE(qualifying_standard, 'Finish of any 100K cycling event within the last 12 months.'),
  eligibility_notes = COALESCE(eligibility_notes, 'Mandatory briefing on race day minus one. Riders must carry proof of qualifying ride.'),
  course_map_url = COALESCE(course_map_url, 'https://cdn.goathletix.sample/maps/stargoa-gravel-2026-150k.pdf')
WHERE id = md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:150K Race')::uuid;

-- --- Monsoon Goa Mountain Challenge 2027: 3 trek batches ------------------
INSERT INTO event_categories (
  id, event_id, label, distance_km, gender, capacity, price_inr,
  compare_at_price_inr, ticket_kind, sort_order, sport_details,
  session_starts_on, session_ends_on, deposit_inr, balance_due_days
) VALUES
  (md5('ga-051-cat:b6951a6a-a872-45a0-9377-738549a876ea:Standard Batch')::uuid,
   'b6951a6a-a872-45a0-9377-738549a876ea', 'Standard Batch', 48.0, 'open', 14, 18500,
   22500, 'participant', 1,
   jsonb_build_object('v',1,'age_medical_rule','Participants above 55 must submit a stress test from a cardiologist within 90 days.'),
   '2027-11-13'::date, '2027-11-17'::date, 5000, 30),
  (md5('ga-051-cat:b6951a6a-a872-45a0-9377-738549a876ea:Women-Only Batch')::uuid,
   'b6951a6a-a872-45a0-9377-738549a876ea', 'Women-Only Batch', 48.0, 'female', 10, 19500,
   24000, 'participant', 2,
   jsonb_build_object('v',1,'age_medical_rule','Participants above 55 must submit a stress test from a cardiologist within 90 days.'),
   '2027-11-20'::date, '2027-11-24'::date, 5000, 30),
  (md5('ga-051-cat:b6951a6a-a872-45a0-9377-738549a876ea:Student Batch')::uuid,
   'b6951a6a-a872-45a0-9377-738549a876ea', 'Student Batch', 48.0, 'open', 14, 14500,
   18500, 'participant', 3,
   jsonb_build_object('v',1,'age_medical_rule','18-25 only. Student ID required at check-in.'),
   '2027-11-27'::date, '2027-12-01'::date, 4000, 21)
ON CONFLICT (id) DO NOTHING;

UPDATE event_categories SET
  description = COALESCE(description, 'The main five-day departure with mixed-gender tents (3 sharing). All food, permits, guides and transport from Collem included.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Certified mountain guide','All veg + egg meals Day 1 dinner to Day 5 breakfast','Forest permits and camping fees','Tented accommodation Days 1-3','Guesthouse Day 4','Sleeping bag and mat','Medical kit and sweep']::text[] ELSE includes END,
  excludes = CASE WHEN excludes = '{}'::text[] THEN ARRAY['Transport to/from Collem','Personal insurance','Porter for personal bag (optional add-on)']::text[] ELSE excludes END,
  max_per_order = COALESCE(max_per_order, 4),
  min_age = COALESCE(min_age, 15), max_age = COALESCE(max_age, 60),
  age_as_on_date = COALESCE(age_as_on_date, '2027-11-13'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['govt_id','medical_certificate','parental_consent']::text[] ELSE required_documents END,
  eligibility_notes = COALESCE(eligibility_notes, 'Pre-trek briefing call scheduled 10 days before departure.')
WHERE id = md5('ga-051-cat:b6951a6a-a872-45a0-9377-738549a876ea:Standard Batch')::uuid;

UPDATE event_categories SET
  description = COALESCE(description, 'A women-only departure with female guide, same-gender tents and a dedicated women-safety protocol.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Female lead guide + assistant','All meals','Forest permits','Same-gender tents (2-3 sharing)','Sleeping bag and mat','Women-safety briefing','Medical kit']::text[] ELSE includes END,
  excludes = CASE WHEN excludes = '{}'::text[] THEN ARRAY['Transport to/from Collem','Personal insurance']::text[] ELSE excludes END,
  max_per_order = COALESCE(max_per_order, 4),
  min_age = COALESCE(min_age, 15), max_age = COALESCE(max_age, 60),
  age_as_on_date = COALESCE(age_as_on_date, '2027-11-20'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['govt_id','medical_certificate']::text[] ELSE required_documents END,
  eligibility_notes = COALESCE(eligibility_notes, 'Open to self-identifying women. Pre-trek fitness call mandatory.')
WHERE id = md5('ga-051-cat:b6951a6a-a872-45a0-9377-738549a876ea:Women-Only Batch')::uuid;

UPDATE event_categories SET
  description = COALESCE(description, 'A subsidised student batch for 18-25 year olds in full-time education. Shared dorm transfer and reduced porter support.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Guide','All meals','Forest permits','Shared tents (3-4 sharing)','Sleeping bag and mat','Medical kit']::text[] ELSE includes END,
  excludes = CASE WHEN excludes = '{}'::text[] THEN ARRAY['Transport','Insurance','Personal porter']::text[] ELSE excludes END,
  max_per_order = COALESCE(max_per_order, 4),
  min_age = COALESCE(min_age, 18), max_age = COALESCE(max_age, 25),
  age_as_on_date = COALESCE(age_as_on_date, '2027-11-27'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['govt_id','school_id','medical_certificate']::text[] ELSE required_documents END,
  eligibility_notes = COALESCE(eligibility_notes, 'Student status is checked at check-in; mismatched IDs forfeit the discount.')
WHERE id = md5('ga-051-cat:b6951a6a-a872-45a0-9377-738549a876ea:Student Batch')::uuid;

-- --- Star Goa Tennis Tournament 2026: 4 draws -----------------------------
INSERT INTO event_categories (
  id, event_id, label, discipline_slug, gender, capacity, price_inr,
  compare_at_price_inr, ticket_kind, sort_order, sport_details, team_composition
) VALUES
  (md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Mens Singles')::uuid,
   '4011e73d-a3df-4dde-94ea-72c58619d966', 'Mens Singles', 'tennis', 'male', 64, 1500,
   1900, 'participant', 1,
   jsonb_build_object('v',1,'event_type','singles','shuttle_or_ball','Dunlop Fort','price_unit','per_player'),
   NULL),
  (md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Womens Singles')::uuid,
   '4011e73d-a3df-4dde-94ea-72c58619d966', 'Womens Singles', 'tennis', 'female', 32, 1500,
   1900, 'participant', 2,
   jsonb_build_object('v',1,'event_type','singles','shuttle_or_ball','Dunlop Fort','price_unit','per_player'),
   NULL),
  (md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Mens Doubles')::uuid,
   '4011e73d-a3df-4dde-94ea-72c58619d966', 'Mens Doubles', 'tennis', 'male', 32, 2400,
   2800, 'team', 3,
   jsonb_build_object('v',1,'event_type','doubles','shuttle_or_ball','Dunlop Fort','price_unit','per_pair'),
   'Two male players, combined age may not exceed 90.'),
  (md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Mixed Doubles')::uuid,
   '4011e73d-a3df-4dde-94ea-72c58619d966', 'Mixed Doubles', 'tennis', 'mixed', 32, 2400,
   2800, 'team', 4,
   jsonb_build_object('v',1,'event_type','mixed_doubles','shuttle_or_ball','Dunlop Fort','price_unit','per_pair','combined_min_age',32),
   'One male, one female. At least one player 32 or older.')
ON CONFLICT (id) DO NOTHING;

UPDATE event_categories SET
  description = COALESCE(description, 'AITA-sanctioned open mens singles knockout draw. Best of three sets, final-set tiebreak.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Draw entry','AITA points at main round','Player goodie bag','Access to physio room']::text[] ELSE includes END,
  max_per_order = COALESCE(max_per_order, 1),
  min_age = COALESCE(min_age, 16), max_age = COALESCE(max_age, 65),
  age_as_on_date = COALESCE(age_as_on_date, '2026-10-18'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['federation_id','govt_id']::text[] ELSE required_documents END,
  qualifying_standard = COALESCE(qualifying_standard, 'Open to all AITA-registered or unrated players; qualifiers held one day before main draw.'),
  team_size_min = COALESCE(team_size_min, 1), team_size_max = COALESCE(team_size_max, 1)
WHERE id = md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Mens Singles')::uuid;

UPDATE event_categories SET
  description = COALESCE(description, 'Womens singles knockout draw, best of three sets with final-set tiebreak.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Draw entry','AITA points at main round','Player goodie bag','Access to physio room']::text[] ELSE includes END,
  max_per_order = COALESCE(max_per_order, 1),
  min_age = COALESCE(min_age, 14), max_age = COALESCE(max_age, 65),
  age_as_on_date = COALESCE(age_as_on_date, '2026-10-18'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['federation_id','govt_id']::text[] ELSE required_documents END,
  team_size_min = COALESCE(team_size_min, 1), team_size_max = COALESCE(team_size_max, 1)
WHERE id = md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Womens Singles')::uuid;

UPDATE event_categories SET
  description = COALESCE(description, 'Mens doubles draw with no-ad scoring and super tiebreak in deciding set.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Pair entry (two players)','Player goodie bag per player','Access to physio room']::text[] ELSE includes END,
  max_per_order = COALESCE(max_per_order, 1),
  min_age = COALESCE(min_age, 16), max_age = COALESCE(max_age, 70),
  age_as_on_date = COALESCE(age_as_on_date, '2026-10-18'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['federation_id','govt_id']::text[] ELSE required_documents END,
  eligibility_notes = COALESCE(eligibility_notes, 'Both players must be registered by one entrant; partner changes allowed only before draw release.'),
  team_size_min = COALESCE(team_size_min, 2), team_size_max = COALESCE(team_size_max, 2)
WHERE id = md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Mens Doubles')::uuid;

UPDATE event_categories SET
  description = COALESCE(description, 'Mixed doubles draw. Minimum combined age 32. No-ad scoring, super tiebreak in deciding set.'),
  includes = CASE WHEN includes = '{}'::text[] THEN ARRAY['Pair entry (two players)','Player goodie bag per player','Access to physio room']::text[] ELSE includes END,
  max_per_order = COALESCE(max_per_order, 1),
  min_age = COALESCE(min_age, 16), max_age = COALESCE(max_age, 70),
  age_as_on_date = COALESCE(age_as_on_date, '2026-10-18'::date),
  required_documents = CASE WHEN required_documents = '{}'::text[] THEN ARRAY['federation_id','govt_id']::text[] ELSE required_documents END,
  eligibility_notes = COALESCE(eligibility_notes, 'Combined age minimum of 32 verified at check-in.'),
  team_size_min = COALESCE(team_size_min, 2), team_size_max = COALESCE(team_size_max, 2)
WHERE id = md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Mixed Doubles')::uuid;

-- ===========================================================================
-- 4. event_awards. Running: age bands + overall; cycling: top 3 overall;
--    racquet: trophies; trek: none.
-- ===========================================================================

INSERT INTO event_awards (id, event_id, category_id, scope, age_band, gender,
                          position_from, position_to, cash_inr, prize_text, sort_order)
VALUES
-- Ultra 50K: top 3 open per gender
  (md5('ga-051-award:fe2f7043:50K:open-male-1')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d',
   md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:50K')::uuid,
   'overall', NULL, 'male', 1, 3, 25000, 'Medal + trophy + cash', 1),
  (md5('ga-051-award:fe2f7043:50K:open-female-1')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d',
   md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:50K')::uuid,
   'overall', NULL, 'female', 1, 3, 25000, 'Medal + trophy + cash', 2),
  (md5('ga-051-award:fe2f7043:50K:35-45-male')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d',
   md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:50K')::uuid,
   'age_band', '35-<45', 'male', 1, 3, 5000, 'Age-band podium', 3),
  (md5('ga-051-award:fe2f7043:50K:45-plus-female')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d',
   md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:50K')::uuid,
   'age_band', '45+', 'female', 1, 3, 5000, 'Age-band podium', 4),
-- Ultra 100K: top 3 open per gender
  (md5('ga-051-award:fe2f7043:100K:open-male-1')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d',
   md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:100K')::uuid,
   'overall', NULL, 'male', 1, 3, 75000, 'Medal + trophy + cash', 1),
  (md5('ga-051-award:fe2f7043:100K:open-female-1')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d',
   md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:100K')::uuid,
   'overall', NULL, 'female', 1, 3, 75000, 'Medal + trophy + cash', 2),
-- Cycling 100K: top 3 open per gender
  (md5('ga-051-award:dee4ce05:100K:open-male')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd',
   md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:100K Gran Fondo')::uuid,
   'overall', NULL, 'male', 1, 3, 30000, 'Trophy + cash', 1),
  (md5('ga-051-award:dee4ce05:100K:open-female')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd',
   md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:100K Gran Fondo')::uuid,
   'overall', NULL, 'female', 1, 3, 30000, 'Trophy + cash', 2),
-- Cycling 150K: top 3 overall per gender + special
  (md5('ga-051-award:dee4ce05:150K:open-male')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd',
   md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:150K Race')::uuid,
   'overall', NULL, 'male', 1, 3, 60000, 'Trophy + cash + jersey', 1),
  (md5('ga-051-award:dee4ce05:150K:open-female')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd',
   md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:150K Race')::uuid,
   'overall', NULL, 'female', 1, 3, 60000, 'Trophy + cash + jersey', 2),
  (md5('ga-051-award:dee4ce05:150K:kom')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd',
   md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:150K Race')::uuid,
   'special', NULL, 'open', 1, 1, 10000, 'King/Queen of the Mountains polka-dot jersey', 3),
-- Tennis trophies
  (md5('ga-051-award:4011e73d:MS:winner')::uuid,
   '4011e73d-a3df-4dde-94ea-72c58619d966',
   md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Mens Singles')::uuid,
   'overall', NULL, 'male', 1, 1, 40000, 'Winner trophy + cash', 1),
  (md5('ga-051-award:4011e73d:MS:runner')::uuid,
   '4011e73d-a3df-4dde-94ea-72c58619d966',
   md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Mens Singles')::uuid,
   'overall', NULL, 'male', 2, 2, 20000, 'Runner-up trophy + cash', 2),
  (md5('ga-051-award:4011e73d:WS:winner')::uuid,
   '4011e73d-a3df-4dde-94ea-72c58619d966',
   md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Womens Singles')::uuid,
   'overall', NULL, 'female', 1, 1, 40000, 'Winner trophy + cash', 3),
  (md5('ga-051-award:4011e73d:WS:runner')::uuid,
   '4011e73d-a3df-4dde-94ea-72c58619d966',
   md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Womens Singles')::uuid,
   'overall', NULL, 'female', 2, 2, 20000, 'Runner-up trophy + cash', 4),
  (md5('ga-051-award:4011e73d:MD:winner')::uuid,
   '4011e73d-a3df-4dde-94ea-72c58619d966',
   md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Mens Doubles')::uuid,
   'team', NULL, 'male', 1, 1, 50000, 'Winner trophy + cash per pair', 5),
  (md5('ga-051-award:4011e73d:MX:winner')::uuid,
   '4011e73d-a3df-4dde-94ea-72c58619d966',
   md5('ga-051-cat:4011e73d-a3df-4dde-94ea-72c58619d966:Mixed Doubles')::uuid,
   'team', NULL, 'mixed', 1, 1, 50000, 'Winner trophy + cash per pair', 6)
ON CONFLICT (id) DO NOTHING;

-- ===========================================================================
-- 5. event_checkpoints. Running: 2 aid-station cutoffs on 100K; cycling: 4
--    control points on 150K; trek + racquet: none.
-- ===========================================================================

INSERT INTO event_checkpoints (id, event_id, category_id, seq, name, km, location,
                               cutoff_after_minutes, services, notes)
VALUES
-- Ultra 100K cutoff aid stations
  (md5('ga-051-ckpt:fe2f7043:100K:AS50')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d',
   md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:100K')::uuid,
   1, 'Aid Station 50K', 50.0, 'Betul fishing jetty', 540,
   ARRAY['water','electrolyte','food','medical','drop_bag','timing_mat']::text[],
   'Missed cut-off = DNF, transport back to finish.'),
  (md5('ga-051-ckpt:fe2f7043:100K:AS75')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d',
   md5('ga-051-cat:fe2f7043-1889-4b31-b7bb-07bc9c26685d:100K')::uuid,
   2, 'Aid Station 75K', 75.0, 'Agonda beach access', 780,
   ARRAY['water','electrolyte','food','medical','timing_mat','toilets']::text[],
   'Headlamps mandatory from this point onward.'),
-- Gravel 150K 4 control points
  (md5('ga-051-ckpt:dee4ce05:150K:CP1')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd',
   md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:150K Race')::uuid,
   1, 'CP1 Loutolim', 35.0, 'Loutolim village square', 150,
   ARRAY['water','electrolyte','food','mechanical','timing_mat']::text[], 'Brevet-style control, QR scan.'),
  (md5('ga-051-ckpt:dee4ce05:150K:CP2')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd',
   md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:150K Race')::uuid,
   2, 'CP2 Chandor', 70.0, 'Chandor heritage house', 330,
   ARRAY['water','electrolyte','food','mechanical','medical','timing_mat']::text[], NULL),
  (md5('ga-051-ckpt:dee4ce05:150K:CP3')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd',
   md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:150K Race')::uuid,
   3, 'CP3 Netravali', 110.0, 'Netravali wildlife checkpoint', 510,
   ARRAY['water','electrolyte','food','medical','timing_mat']::text[], 'Climb into the ghats.'),
  (md5('ga-051-ckpt:dee4ce05:150K:CP4')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd',
   md5('ga-051-cat:dee4ce05-e00e-46f3-9d4b-808457f8adbd:150K Race')::uuid,
   4, 'CP4 Rivona', 135.0, 'Rivona church ground', 660,
   ARRAY['water','electrolyte','food','medical','mechanical','timing_mat']::text[], 'Final control before finish.')
ON CONFLICT (id) DO NOTHING;

-- ===========================================================================
-- 6. event_resources. 3-4 per event.
-- ===========================================================================

INSERT INTO event_resources (id, event_id, kind, label, url, sort_order)
VALUES
-- Ultra
  (md5('ga-051-res:fe2f7043:rules')::uuid,         'fe2f7043-1889-4b31-b7bb-07bc9c26685d', 'rules',         'Race rules 2026 (PDF)',       'https://cdn.goathletix.sample/docs/ultra-goa-2026-rules.pdf', 1),
  (md5('ga-051-res:fe2f7043:athlete')::uuid,       'fe2f7043-1889-4b31-b7bb-07bc9c26685d', 'athlete_guide', 'Athlete guide 2026 (PDF)',    'https://cdn.goathletix.sample/docs/ultra-goa-2026-guide.pdf', 2),
  (md5('ga-051-res:fe2f7043:waiver')::uuid,        'fe2f7043-1889-4b31-b7bb-07bc9c26685d', 'waiver_pdf',    'Participant waiver (PDF)',    'https://cdn.goathletix.sample/docs/ultra-goa-2026-waiver.pdf', 3),
  (md5('ga-051-res:fe2f7043:gpx')::uuid,           'fe2f7043-1889-4b31-b7bb-07bc9c26685d', 'gpx',           '100K course GPX',             'https://cdn.goathletix.sample/gpx/ultra-goa-2026-100k.gpx', 4),
-- Gravel
  (md5('ga-051-res:dee4ce05:rules')::uuid,         'dee4ce05-e00e-46f3-9d4b-808457f8adbd', 'rules',         'Race rules 2026 (PDF)',       'https://cdn.goathletix.sample/docs/stargoa-gravel-2026-rules.pdf', 1),
  (md5('ga-051-res:dee4ce05:athlete')::uuid,       'dee4ce05-e00e-46f3-9d4b-808457f8adbd', 'athlete_guide', 'Rider guide 2026 (PDF)',      'https://cdn.goathletix.sample/docs/stargoa-gravel-2026-guide.pdf', 2),
  (md5('ga-051-res:dee4ce05:waiver')::uuid,        'dee4ce05-e00e-46f3-9d4b-808457f8adbd', 'waiver_pdf',    'Rider waiver (PDF)',          'https://cdn.goathletix.sample/docs/stargoa-gravel-2026-waiver.pdf', 3),
  (md5('ga-051-res:dee4ce05:gpx')::uuid,           'dee4ce05-e00e-46f3-9d4b-808457f8adbd', 'gpx',           '150K course GPX',             'https://cdn.goathletix.sample/gpx/stargoa-gravel-2026-150k.gpx', 4),
-- Trek
  (md5('ga-051-res:b6951a6a:rules')::uuid,         'b6951a6a-a872-45a0-9377-738549a876ea', 'rules',         'Trek regulations 2027 (PDF)', 'https://cdn.goathletix.sample/docs/monsoon-goa-trek-2027-rules.pdf', 1),
  (md5('ga-051-res:b6951a6a:athlete')::uuid,       'b6951a6a-a872-45a0-9377-738549a876ea', 'athlete_guide', 'Participant handbook (PDF)',  'https://cdn.goathletix.sample/docs/monsoon-goa-trek-2027-handbook.pdf', 2),
  (md5('ga-051-res:b6951a6a:waiver')::uuid,        'b6951a6a-a872-45a0-9377-738549a876ea', 'waiver_pdf',    'Liability waiver (PDF)',      'https://cdn.goathletix.sample/docs/monsoon-goa-trek-2027-waiver.pdf', 3),
  (md5('ga-051-res:b6951a6a:gpx')::uuid,           'b6951a6a-a872-45a0-9377-738549a876ea', 'gpx',           'Trek route GPX',              'https://cdn.goathletix.sample/gpx/monsoon-goa-trek-2027.gpx', 4),
-- Tennis
  (md5('ga-051-res:4011e73d:rules')::uuid,         '4011e73d-a3df-4dde-94ea-72c58619d966', 'rules',         'AITA tournament rulebook',    'https://cdn.goathletix.sample/docs/stargoa-tennis-2026-rules.pdf', 1),
  (md5('ga-051-res:4011e73d:prospectus')::uuid,    '4011e73d-a3df-4dde-94ea-72c58619d966', 'prospectus',    'Tournament prospectus (PDF)', 'https://cdn.goathletix.sample/docs/stargoa-tennis-2026-prospectus.pdf', 2),
  (md5('ga-051-res:4011e73d:waiver')::uuid,        '4011e73d-a3df-4dde-94ea-72c58619d966', 'waiver_pdf',    'Player waiver (PDF)',         'https://cdn.goathletix.sample/docs/stargoa-tennis-2026-waiver.pdf', 3)
ON CONFLICT (id) DO NOTHING;

-- ===========================================================================
-- 7. event_offers. 1-2 per event.
-- ===========================================================================

INSERT INTO event_offers (id, event_id, label, audience, discount_type, discount_value,
                          min_qty, terms, is_active, sort_order)
VALUES
  (md5('ga-051-off:fe2f7043:group')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d', 'Group of 5 or more: 15% off',  'group',   'percent', 15, 5,
   'All five entries must be bought in one order; group discount is non-combinable with student discount.',
   true, 1),
  (md5('ga-051-off:fe2f7043:women')::uuid,
   'fe2f7043-1889-4b31-b7bb-07bc9c26685d', 'Women entrants: 10% off',       'women',   'percent', 10, 1,
   'Applied automatically to all women entrants.', true, 2),
  (md5('ga-051-off:dee4ce05:group')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd', 'Team of 4 riders: INR 400 off', 'group',   'flat', 400, 4,
   'All four entries in one order. Flat INR 400 off each entry.', true, 1),
  (md5('ga-051-off:dee4ce05:women')::uuid,
   'dee4ce05-e00e-46f3-9d4b-808457f8adbd', 'Women riders: 12% off',         'women',   'percent', 12, 1,
   'Applied automatically to all women riders.', true, 2),
  (md5('ga-051-off:b6951a6a:group')::uuid,
   'b6951a6a-a872-45a0-9377-738549a876ea', 'Group of 4 trekkers: 10% off',  'group',   'percent', 10, 4,
   'Group booked in one order.', true, 1),
  (md5('ga-051-off:b6951a6a:student')::uuid,
   'b6951a6a-a872-45a0-9377-738549a876ea', 'Student discount already applied in the Student Batch', 'student', 'flat', 1,
   1, 'Not combinable with the Standard Batch.', true, 2),
  (md5('ga-051-off:4011e73d:early')::uuid,
   '4011e73d-a3df-4dde-94ea-72c58619d966', 'Early-bird 15% off until 10 Oct', 'everyone', 'percent', 15, 1,
   'Applied automatically to all entries confirmed on or before 10 October 2026.', true, 1),
  (md5('ga-051-off:4011e73d:student')::uuid,
   '4011e73d-a3df-4dde-94ea-72c58619d966', 'Students 10% off',               'student', 'percent', 10, 1,
   'Carry a valid student ID at check-in.', true, 2)
ON CONFLICT (id) DO NOTHING;

-- ===========================================================================
-- 8. event_itinerary_days. Trek: 5 days. Others: none.
-- ===========================================================================

INSERT INTO event_itinerary_days (id, event_id, day_no, title, description,
                                  distance_km, duration_text, start_altitude_m,
                                  end_altitude_m, meals, stay, sort_order)
VALUES
  (md5('ga-051-itin:b6951a6a:1')::uuid,
   'b6951a6a-a872-45a0-9377-738549a876ea', 1,
   'Collem to Base Camp (Tambdi Surla)',
   'Pickup at Collem station, short jeep transfer to the trail head, 6 km warm-up walk to the Tambdi Surla base camp.',
   6.0, '3-4 h', 100, 620,
   ARRAY['lunch','dinner']::text[], 'Alpine tents, 3 sharing', 1),
  (md5('ga-051-itin:b6951a6a:2')::uuid,
   'b6951a6a-a872-45a0-9377-738549a876ea', 2,
   'Tambdi Surla to Vagheri Ridge',
   'Steady climb through sacred groves and bamboo thickets to the Vagheri ridge campsite.',
   10.5, '5-6 h', 620, 970,
   ARRAY['breakfast','packed_lunch','dinner']::text[], 'Alpine tents, 3 sharing', 2),
  (md5('ga-051-itin:b6951a6a:3')::uuid,
   'b6951a6a-a872-45a0-9377-738549a876ea', 3,
   'Vagheri summit day + Dudhsagar viewpoint',
   'Pre-dawn start to summit Vagheri (1,023 m) and descend to Dudhsagar viewpoint for a late lunch.',
   12.0, '7-8 h', 970, 820,
   ARRAY['breakfast','packed_lunch','dinner']::text[], 'Alpine tents, 3 sharing', 3),
  (md5('ga-051-itin:b6951a6a:4')::uuid,
   'b6951a6a-a872-45a0-9377-738549a876ea', 4,
   'Dudhsagar to Castle Rock forest guesthouse',
   'Long descending traverse through moist deciduous forest to Castle Rock. Hot showers and beds tonight.',
   13.5, '6-7 h', 820, 540,
   ARRAY['breakfast','packed_lunch','dinner']::text[], 'Forest guesthouse, 2 sharing', 4),
  (md5('ga-051-itin:b6951a6a:5')::uuid,
   'b6951a6a-a872-45a0-9377-738549a876ea', 5,
   'Castle Rock closing walk and departure',
   'A relaxed 6 km closing walk to the station, debrief, certificates, departure by noon.',
   6.0, '2-3 h', 540, 540,
   ARRAY['breakfast']::text[], 'Trek ends after breakfast', 5)
ON CONFLICT (id) DO NOTHING;

COMMIT;
