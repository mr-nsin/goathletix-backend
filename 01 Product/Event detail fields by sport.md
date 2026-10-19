---
type: note
status: draft
tags: [research, events, data-model]
created: 2026-10-19
task: "[[04 Delivery/GA-046-event-detail-fields-by-sport|GA-046]]"
feeds: [GA-047, GA-048]
---

# Event detail fields by sport

What real organisers publish about an event, sport by sport, turned into one field model. The database draft
(GA-047) and the event page (GA-048) both build from this note.

- **Method.** Pages were rendered with headless Edge or fetched directly where the corporate proxy allowed it. Where a site
  was blocked, the facts come from search-engine excerpts of that page. Each source is labelled **rendered**, **fetched**
  or **excerpt only (blocked)** in [Sources](#8-sources). Nothing below is an assumption about a platform.
- **DB column legend.** `HAVE table.column` = already in a migration (0000–0025). `NEW col` = add a column.
  `NEW table` = add a table. `JSON` = goes in the proposed per-sport `sport_details` jsonb (see §4).
- **Baseline.** The reference page (Hindustan Marathon, indiarunning) is summarised in the GA-046 task note. It was re-rendered
  on 2026-10-19 and matches.

---

## 1. Summary: the 10 most important additions to our event page, in priority order

Our page already shows: cover, past editions, videos, organiser and socials, title/date/location tiles, hosted by, the register
action, about, details (distances, age groups, difficulty, terrain, elevation, start time, cut-off), schedule, FAQ, and ticket
cards (distance, age groups, gender, start, cut-off, current and next price tier, places left, sold out, quantity).

| # | Addition | Why (evidence) | DB state |
| --- | --- | --- | --- |
| 1 | **"What's included" on every ticket card**, as icons (T-shirt or jersey, medal, timed bib, e-certificate, refreshments, goodie bag), plus an event-level amenities list (hydration, medical, baggage, parking, washrooms, pacers) | Every indiarunning page lists inclusions per category (Hindustan, Pune, Mussoorie, Raipur Velo). The trek operator lists inclusions **and exclusions** | `HAVE event_categories.includes`, `HAVE events.amenities`. Add `NEW event_categories.excludes text[]` |
| 2 | **Eligibility and requirements block**: minimum or maximum age per category with the "age as on" date, documents to carry (Aadhaar or age proof), medical certificate, guardian consent for minors, qualifying standard, fitness benchmark, mandatory gear | Hindustan: 5K 10+, 10K 15+, 21.1K 18+. Raipur Velo: "age count on event date". Hudle: "carry your Aadhar card", "Minimum Age 21+". Kerala karate: age proof under 18. Indiahikes: 5 km in 38 min, TMT over 58. Audax: helmet, lights, reflective vest compulsory | Mostly `HAVE` (0023: `min_age`, `max_age`, `age_as_on_date`, `required_documents`, `qualifying_standard`, `eligibility_notes`). Add `NEW events.mandatory_gear text[]`, `NEW events.recommended_gear text[]`, `NEW events.fitness_requirement text` |
| 3 | **Policies, in plain words**: refund, transfer, deferral, the deadline for changes, what happens if the event is postponed, and a waiver summary with the full text behind a link | Hindustan: non-refundable, non-transferable, changes up to 10 days before, valid if postponed. Rumble: refund 100% / 50% / 0 by date, full refund on a medical note. Trek: deposit, balance due 7 days before | `HAVE refund_policy, transfer_policy, deferral_policy, cancellation_policy, waiver_text`. Add `NEW events.changes_allowed_until timestamptz` |
| 4 | **Prizes and awards**: podium per category and age band, cash prize, the minimum-entries rule, trophies for teams | Hindustan: top 3 male and female per age band. Mussoorie: age bands per distance, award only if at least 6 women or 10 men enter. Hudle: cash prizes and medals. Kerala karate: team trophies | `NEW table event_awards` |
| 5 | **Urgency strip**: "Registration closes 20 Oct or when sold out", slots left, "price rises on <date>" | Hindustan shows both slots left and the closing rule. indiarunning shows a struck-out price beside the current one | `HAVE registration_closes_at`, `capacity`, `slots_taken`, `event_price_tiers`. UI only |
| 6 | **Kit and bib collection**: whether it is mandatory, the window, whether it is available on race day, where (or "venue emailed a week before") | Hindustan: mandatory, not on race day, fixed window. Audax: brevet card at the start | `HAVE bib_expo_opens_at/closes_at`, `HAVE event_schedule_items(kind='bib_collection')`. Add `NEW events.kit_collection_mandatory boolean`, `NEW events.race_day_collection boolean` |
| 7 | **Honest price display**: "incl. of all taxes" or "+ GST" per price, plus struck-out original prices for audience offers (women 50% off) and group or corporate offers | Pune Marathon: women's categories at half price, shown as struck-out. Mussoorie: "+ GST". Raipur Velo: "Inc. of all taxes". Hindustan: group and corporate discounts by email | `HAVE events.tax_mode`, `gst_rate`. Add `NEW event_categories.compare_at_price_inr` and `NEW table event_offers` (public offers; `coupons` stays private) |
| 8 | **Course and checkpoints**: route map, GPX download, elevation, and checkpoints or controls with their own cut-offs and services | Audax: CP1/CP2/CP3 with km, location and closing time. IRONMAN Goa: a cut-off per leg as well as overall. Trek: day-by-day distance and altitude | `HAVE course_map_url`, `aid_stations` (jsonb), `altitude_m`. Add `NEW table event_checkpoints`, `NEW event_categories.course_map_url`, `NEW events.gpx_url` |
| 9 | **A sport-specific "Format" panel** driven by data: tournament format and shuttle or ball brand for racquet sports; day-by-day itinerary for treks; swim, bike and run legs for triathlon; stations and divisions for HYROX-style events; weight or belt classes for martial arts | See §5. Every sport studied has 3 to 10 facts that apply to no other sport | Add `NEW events.sport_details jsonb` and `NEW event_categories.sport_details jsonb`, validated per sport (§4). Treks also need `NEW table event_itinerary_days` |
| 10 | **Timed or not per category, and certification badges** (AIMS-measured, AFI-recognised, BRM sanctioned by ACP and approved by AIR, BAI-sanctioned) | Mussoorie sells timed and non-timed categories in the same event. Audax shows its BRM sanction. TMM accepts qualifying times only from AIMS-certified races or races recognised by Indian Athletics | `HAVE events.is_certified`, `certifying_body`, `is_chip_timed` (event level only). Add `NEW event_categories.is_timed boolean`, `NEW events.sanction_reference text` |

Two UI findings sit underneath all ten:

- **Category lists get long.** Raipur Velo has 13 ticket types (distance × gender × age band × state or open). The Hudle badminton
  event has 19 (U-9 to 60+, singles and doubles). A flat card list does not work at that size. Ticket selection needs a
  **category finder**: chips for distance or event, then gender, then the buyer's age, which filters the list to the 1–3
  categories that fit. This is the WHO axis from the homepage applied on the event page.
- **Organisers paste rules into the description.** Raipur Velo links a rules PDF from inside its "About" text. Audax links ACP
  and AIR rule PDFs. BAI and AFI publish everything as circular PDFs. We need a public **documents and links** list (rules,
  athlete guide, circular, waiver PDF, GPX) instead of URLs buried in prose. `event_documents` (0023) is private compliance
  paperwork, so it cannot serve this. Add `NEW table event_resources`.

---

## 2. Canonical field model: common event fields

These apply to every sport. Section names refer to the order in §6.

| Field | Type | Example | Req | Section | DB |
| --- | --- | --- | --- | --- | --- |
| event_name | text | Hindustan Marathon 12th Edition | R | Hero | HAVE events.event_name |
| tagline | text ≤140 | The mountains are calling | O | Hero, About | HAVE events.tagline |
| sport_type, discipline_slugs | enum, text[] | running, [road-half-marathon] | R | Hero chip | HAVE |
| edition_number | smallint | 12 | O | Hero | NEW (series_id exists; the number does not) |
| start_date, end_date | date | 2026-10-25 | R | Hero | HAVE |
| start_time, end_time, reporting_time | time | 05:30 / 11:00 / 04:30 | O | At a glance, Schedule | HAVE |
| timezone | text | Asia/Kolkata | R | (hidden) | HAVE |
| venue, address_line, city, state, pincode, geo_location | text, geography | JLN Stadium, … 110003 | R (venue, city) | Hero, Venue | HAVE |
| venue_notes | text | Parking at gate 14; nearest metro JLN | O | Venue | HAVE |
| description | text | long "About the event" | R | About | HAVE |
| banner_url, poster_url, cover_image_mobile_url, social_share_image_url | text | | O | Hero | HAVE |
| registration_opens_at, registration_closes_at | timestamptz | closes 2026-10-20 | R | Urgency strip | HAVE |
| closes_when_sold_out | boolean | true | O | Urgency strip | NEW (or derive from capacity) |
| waitlist_enabled | boolean | | O | Tickets | HAVE |
| is_certified, certifying_body, sanction_reference | bool, text, text | AIMS / "BRM sanctioned by ACP, approved by AIR" / course cert number | O | Hero badge, Rules | HAVE, HAVE, NEW |
| is_chip_timed, timing_partner | bool, text | | O | At a glance | HAVE |
| difficulty, terrain, elevation_gain, altitude_m | enum, text, text, int | Beginner, Road, 150m | O | At a glance | HAVE (elevation_gain is text; add `NEW elevation_gain_m int` for filtering) |
| amenities | text[] (controlled vocabulary) | hydration, medical, baggage, parking, washrooms, pacers, music, warm_up, photography | O | Included | HAVE |
| mandatory_gear, recommended_gear | text[] | helmet, rear red light, reflective vest / 50–60 L backpack | O | Requirements | NEW |
| fitness_requirement | text | Run 5 km in 38 min, 3 logged runs in the last month | O | Requirements | NEW |
| safety_info | text | ambulances, medical teams, emergency plan | O | Safety | HAVE |
| women_safety | text[] (vocabulary) | female_medics, women_only_wave, same_gender_tents, female_volunteers, separate_changing | O | Safety | NEW (or fold into `amenities` vocabulary; see §7) |
| aid_stations | jsonb | [{"km":5,"offers":["water","electrolyte"]}] | O | Course | HAVE (superseded by event_checkpoints for cut-offs) |
| course_map_url, gpx_url | text | | O | Course | HAVE, NEW |
| refund_policy, transfer_policy, deferral_policy, cancellation_policy | text | | R (refund) | Policies | HAVE |
| changes_allowed_until | timestamptz | 10 days before | O | Policies | NEW |
| terms_text, waiver_text, waiver_version | text, int | | O | Policies | HAVE |
| tax_mode, gst_rate | text, numeric | inclusive, 18 | R | Tickets | HAVE |
| kit_collection_mandatory, race_day_collection | bool | true, false | O | Schedule | NEW |
| bib_expo_opens_at, bib_expo_closes_at | timestamptz | | O | Schedule | HAVE |
| certificate_available_at, results_url, results_status | | | O | Results | HAVE |
| contact_email, contact_phone, whatsapp_url, website_url | text | | O | Organiser | HAVE |
| sponsorship_contact | text | corporate and sponsorship email | O | Organiser | NEW (or a FAQ row) |
| rating_avg, rating_count | numeric, int | 4.2 (2,237 reviews) | O | Hero | HAVE |
| sport_details | jsonb (schema per sport) | see §5 | O | Format panel | NEW |

**Child tables (event level):**

| Table | Holds | DB |
| --- | --- | --- |
| event_schedule_items | expo, bib collection, reporting, flag-off per category, sessions, ceremony | HAVE (0023) |
| event_faqs | Q&A | HAVE |
| event_sponsors | title, presenting, partners | HAVE (not yet returned by `GET /events/:id/details`) |
| event_media | photos and videos with edition_year | HAVE |
| event_reviews | ratings | HAVE |
| event_result_entries | finisher list | HAVE |
| **event_awards** | category_id (nullable), scope (`overall`, `age_band`, `team`), age_band label, places (1–3), gender, cash_inr, prize_text, min_entries_female, min_entries_male | **NEW** |
| **event_checkpoints** | category_id, seq, name, km, location text, geo, cutoff_at or cutoff_after_minutes, services text[] (water, food, medical, crew, timing mat) | **NEW** |
| **event_resources** | kind (`rules`, `athlete_guide`, `circular`, `waiver_pdf`, `gpx`, `route_map`, `prospectus`), label, url, sort_order. Public | **NEW** |
| **event_offers** | label, audience (`women`, `senior`, `group`, `corporate`, `student`, `club`, `defence`), discount_type, value, min_qty, valid_until, category_id nullable. Public, unlike `coupons` | **NEW** |
| **event_itinerary_days** | day_no, title, distance_km, duration_text, start_altitude_m, end_altitude_m, meals text[], stay text | **NEW** (treks, multi-day rides, stage races) |

---

## 3. Canonical field model: per-category (ticket type) fields

`event_categories` is the ticket type (0014, extended in 0022 and 0023).

| Field | Type | Example | Req | Shown on | DB |
| --- | --- | --- | --- | --- | --- |
| label | text | 50 KM Open Men 18–40 / Girls Singles U-13 / Kumite −45 kg | R | Ticket card | HAVE |
| description ("who it is for") | text | For first-timers aiming to finish | O | Ticket card | HAVE |
| discipline_slug | text | | O | Filter | HAVE |
| distance_km | numeric | 21.1 | O | Ticket card | HAVE |
| gender | enum | open, female, male, mixed | R | Finder | HAVE |
| age_categories, min_age, max_age, age_as_on_date | enum[], int, int, date | 18, 40, event date | O | Finder, Requirements | HAVE |
| start_time, cutoff_minutes | time, int | 05:30, 180 | O | Ticket card | HAVE |
| **is_timed** | bool | false for fun runs | O | Ticket card badge | **NEW** |
| capacity, slots_taken, is_sold_out | | | O | Urgency | HAVE |
| price_inr + event_price_tiers | int | 999; Early bird → Regular | R | Ticket card | HAVE |
| **compare_at_price_inr** | int | 2700 struck out beside 1350 | O | Ticket card | **NEW** |
| includes | text[] | jersey, timed bib, medal, e-certificate, refreshments | O | Ticket card icons | HAVE |
| **excludes** | text[] | travel to Dehradun, personal porter | O | Included section | **NEW** |
| required_documents | text[] | aadhaar, age_proof, medical_certificate, tmt_report, federation_id | O | Requirements | HAVE |
| qualifying_standard | text | Sub 2:00 HM in the last 24 months | O | Requirements | HAVE |
| team_size_min, team_size_max | int | 2, 4 | O | Ticket card | HAVE |
| **team_composition** | text | at least 1 woman per team | O | Requirements | **NEW** |
| eligibility_notes | text | Chhattisgarh residents only | O | Requirements | HAVE |
| sales_start_at, sales_end_at, max_per_order, is_hidden | | | O | Tickets | HAVE |
| **ticket_kind** | text | participant, team, spectator, add_on | R | Tickets grouping | **NEW** (HYROX and Rumble sell spectator entry; treks sell porter add-ons) |
| **session_starts_on, session_ends_on** | date | batch 01 Nov – 05 Nov; U-11 plays Saturday | O | Ticket card | **NEW** (trek batches, multi-day tournaments) |
| **deposit_inr, balance_due_days** | int | 2000, 7 | O | Ticket card | **NEW** (trek operators) |
| **course_map_url** | text | per-distance map | O | Course | **NEW** |
| event_waves | table | Wave A sub-1:45 | O | Ticket card | HAVE (0022) |
| **sport_details** | jsonb | weight class, belt, legs, division | O | Ticket card, Format | **NEW** |

---

## 4. Per-sport extension fields: storage recommendation

Each sport adds 3 to 10 fields that no other sport uses. Recommendation for GA-047:

- **One `sport_details jsonb` on `events` and one on `event_categories`**, each validated by a per-sport JSON schema held in
  code (or a `sport_detail_schemas` lookup keyed by `sport_category`). Do not add dozens of sparse columns.
- **Promote a field to a real column only when it is filtered or sorted on**: `elevation_gain_m`, `altitude_m` (have), water
  body type for swims, and team size (have).
- The event page renders the Format panel from the same schema: label, unit and icon per key. A new sport then needs a schema
  entry, not a page change.

---

## 5. Per-sport extension fields: what organisers publish

Level: E = `events.sport_details`, C = `event_categories.sport_details`. Fields already modelled as columns are not repeated.

### 5.1 Running (road, trail, ultra)

Sources: Hindustan Marathon, Bajaj Pune Marathon, Mussoorie Ultra (rendered); Tata Mumbai Marathon (excerpt only).

| Field | Lvl | Example | Notes |
| --- | --- | --- | --- |
| course_type | E | loop / out_and_back / point_to_point | |
| surface | E | road, trail, mixed | `terrain` exists; keep it |
| aims_certified | E | true | use `is_certified` + `certifying_body='AIMS'` |
| pacers | C | 2:00, 2:15 buses | |
| start_waves | C | wave by timing certificate | `event_waves` exists |
| qualifying_window | C | 26 Nov 2025 – 25 Nov 2026 | TMM elite and HM confirmation criteria |
| itra_points, utmb_index | C | 2 | trail ultras |
| cutoffs_by_distance | C | M 5:30, HM 3:00, 10K 1:30, 5K 0:45 | Pune puts these in the description; `cutoff_minutes` already holds them |
| min_age_by_distance | C | 5K 10+, 10K 15+, HM 18+ | `min_age` exists |
| age_band_awards | event_awards | 18–<36, 36–<45, 45–<60, 60–<70, 70+ | Mussoorie; bands differ for 5K |

### 5.2 Cycling (brevets, gran fondos, criteriums, MTB)

Sources: Audax India BRM 200 (fetched); The Great Raipur Velo (rendered).

| Field | Lvl | Example | Notes |
| --- | --- | --- | --- |
| ride_format | E | brevet (self-supported, non-competitive), gran_fondo, race, fellowship_ride | Raipur sells a "Fellowship Ride" beside timed categories |
| support_level | E | self_supported / supported | |
| control_points | event_checkpoints | CP2 101 km, Atithi Hotel, closes 12:44 | Audax |
| proof_of_passage | E | brevet card, ATM slip, photo in WhatsApp group | Audax |
| bike_types_allowed | E | road, MTB, hybrid, any | |
| night_riding | E | true (lights mandatory) | |
| mandatory_gear | events.mandatory_gear | helmet, headlight, red taillight, reflective vest, bank card | Audax |
| rule_sets | event_resources | ACP rules, AIR rules, additional instructions PDF | |
| residency_category | C | "Chhattisgarh State Category" | use `eligibility_notes` |
| rider_number_display | E | front and rear | |
| result_codes | results | YTC, DNS, DNF, LF | Audax public "Fellow riders" list |

### 5.3 Triathlon and duathlon

Sources: IRONMAN 70.3 Goa (excerpt only, ironman.com blocked); Tigerman Triathlon and Duathlon Pune (excerpt only, blocked).

| Field | Lvl | Example | Notes |
| --- | --- | --- | --- |
| legs | C | [{"sport":"swim","km":1.9},{"sport":"bike","km":90},{"sport":"run","km":21.1}] | Tigerman sprint: 750 m / 20 km / 5 km |
| leg_cutoffs | C / event_checkpoints | swim, bike, overall 8:30 | IRONMAN: each leg has its own cut-off |
| swim_venue_type | E | sea, river, lake, pool | |
| water_temp_c | E | 26 | |
| wetsuit_rule | E | allowed, optional, banned (with thresholds) | |
| drafting | E | legal / illegal | |
| transition_location | E | T1/T2 | |
| relay | C | team of 2–3 | Tigerman sprint relay ₹4,000 + 18% GST; use team_size |
| qualifier_slots | E | 70.3 World Championship slots | |
| min_age | C | 15+ sprint, 18+ 70.3 | |

### 5.4 Swimming and open water

Sources: OWAAF National Sea Swimming Championship, Goa (excerpt only); Den Den Sea Swimming Championship, Mangalore (excerpt only).

| Field | Lvl | Example | Notes |
| --- | --- | --- | --- |
| water_body | E | sea, lake, river, pool | promote to a column if filtered |
| distance_by_age | C | 10–11: 500 m; 12–14: 1.5 km; 15–17: 1.5 or 3 km; 18+: up to 6 km | Den Den |
| race_day_split | C | 1 km and 10 km on day 1; 2 km and 5 km on day 2 | OWAAF; use `session_starts_on` |
| tide_dependent_start | E | start time fixed a week before, from tide tables | OWAAF |
| water_temp_c, wetsuit_rule | E | | |
| safety_cover | E | kayaks, lifeguards, boats | |
| swim_cap_and_chip | E | colour-coded caps, timing chip | |
| swim_ability_declaration | C | must swim X m continuously | |

### 5.5 Trekking and hiking

Sources: Treks and Trails Kedarkantha (fetched); Indiahikes Dayara Bugyal and Gaumukh Tapovan (excerpt only, blocked).

| Field | Lvl | Example | Notes |
| --- | --- | --- | --- |
| duration_days, duration_nights | E | 5, 4 | |
| max_altitude_m, base_camp_altitude_m | E | 3810, 3430 | `altitude_m` exists for the max |
| trek_distance_km | E | ~20 | |
| start_point, end_point, pickup_point, pickup_time | E | Dehradun, Prince Chowk, 06:30 | |
| itinerary | event_itinerary_days | Day 2: Sankri → Juda ka Talab, 4 km, 4–5 h, 2,775 m | |
| batches | event_categories with session dates | 01–05 Nov, available | daily fixed departures |
| group_size_max, gender_ratio | E | 30, ~7:3 | solo trekkers share tents with the same gender |
| fitness_benchmark | events.fitness_requirement | jog 4 km in 25 min / run 5 km in 38 min | Indiahikes requires 3 logged runs |
| age_medical_rule | C | TMT report if over 58 | Indiahikes |
| stay, meals | E | guesthouse + tents, 2–3 sharing; vegetarian | |
| inclusions / exclusions | includes / excludes | | |
| rentals | add-on categories | jackets, shoes, poles | |
| permits | E | forest permit, original photo ID | |
| connectivity | E | limited signal, last ATM in Purola | |
| evacuation_plan | safety_info | descent, CHC, SDRF helicopter | |
| best_season | E | Dec–Apr | |
| payment_schedule | C | deposit ₹2,000, balance 7 days before | |

### 5.6 Skating (roller speed, artistic, skateboarding)

Sources: RSFI age groups (excerpt only); Rumble Skate, The School of Raya (fetched; fee and prize fields were placeholders on the page); Pune district championship (excerpt only, blocked).

| Field | Lvl | Example | Notes |
| --- | --- | --- | --- |
| discipline | C | speed_rink, speed_road, artistic, inline_freestyle, skateboard_street, park, vert | |
| skate_type | C | quad, recreational inline, professional inline | Pune district event |
| federation_age_group | C | Tots 6–8, Minis 8–10, Cadet 10–12, Sub-Junior 12–15, Junior 15–18, Senior 18+, Masters 35+ | RSFI, effective 1 Jan 2025 |
| age_cutoff_date | C | 31 Dec of the previous year | `age_as_on_date` exists |
| protective_gear | events.mandatory_gear | helmet and pads mandatory under 15 | Rumble |
| judging | E | 5 judges; difficulty, execution, style, progression, flow | Rumble |
| race_events | C | 500 m, 1000 m rink; 10 km road | |
| qualifies_for | E | state → national | |
| spectator_policy | ticket_kind=spectator | family free, public ticketed on finals day | Rumble |

### 5.7 Athletics meets (track and field)

Sources: AFI 2026 circulars (excerpt only; indianathletics.in blocked); Goa women's masters meet and J&K masters meet (excerpt only).

| Field | Lvl | Example | Notes |
| --- | --- | --- | --- |
| events_by_age_group | C (one category per event × age group) | U18 boys 100 m, shot put 5 kg | |
| dob_window | C | born after 08.03.2006 | `age_as_on_date` + max_age |
| max_events_per_athlete | E | 2 individual (junior zones), 3 (masters) | |
| entries_per_unit | E | 2 per state per event per age group | |
| entry_mode | E | online by the athlete only; via state association | |
| entry_fee_per_event | C | ₹500–₹1,000 per event per athlete; masters ₹300 per head | |
| entry_standard | C | qualifying mark | `qualifying_standard` exists |
| federation_id | required_documents | AFI UID, age proof | |
| implement_spec | C | 5 kg shot | |
| masters_age_bands | C | 5-year bands, 30–34 to 90+ | |
| technical_meeting, call_room_time | event_schedule_items | | |

### 5.8 Martial arts

Sources: Kerala Olympic Association karate championship 2025 (fetched); Khelo India open karate, Howrah (excerpt only).

| Field | Lvl | Example | Notes |
| --- | --- | --- | --- |
| style_and_federation | E | Shito-Ryu; Kerala Karate Association rules (not WKF) | |
| event_type | C | kata, kumite, team kata | |
| weight_class_kg | C | −45 kg | |
| belt_min, belt_max | C | below brown belt | Kerala grouped by age and belt |
| allowed_katas | C | Heian, Pinan, Gekisai … | below brown belt |
| protective_gear | events.mandatory_gear | gloves, shin guards, body protector, mouth guard, head guard, own | |
| bout_format | C | 8 per kumite pool | |
| min_age | C | 4+ | age proof under 18 |
| team_trophies | event_awards scope=team | most participants, top 3 teams by points | |
| reporting | E | 30 min before the event; coaches and players only in the hall | |
| competition_day_choice | C | teams pick a day | |

### 5.9 Racquet sports (badminton, table tennis, tennis, pickleball)

Sources: Smash Mode Open Badminton Championship 2.0, Hudle (rendered); BAI ranking circulars (excerpt only, blocked); TTFI and district TT events (excerpt only).

| Field | Lvl | Example | Notes |
| --- | --- | --- | --- |
| event_type | C | singles, doubles, mixed doubles | Hudle: singles ₹1,100, doubles ₹2,000 per pair |
| age_category | C | U-9 … U-17, Open, 30+, 40+, 45+, 50+, 60+ | Hudle "Mixed Doubles 50+, Minimum Age 21+" (combined-age rule) |
| price_unit | C | per player / per pair / per team | |
| tournament_format | E | knockout, round robin + knockout, league | |
| shuttle_or_ball | C | Yonex ACB TR feather (singles), Mavis 350 (doubles) | Hudle |
| courts | E | 6, wooden + synthetic | Hudle |
| sanction_and_ranking | E | BAI-sanctioned ranking event | use `counts_for_ranking` (have) |
| federation_id | required_documents | BAI player ID | |
| draw_and_schedule_dates | event_schedule_items | draw date, withdrawal deadline | |
| prize | event_awards | cash + medals for winner and runner-up | |
| participant_perks | includes | refreshments | |

### 5.10 Fitness competitions (HYROX-style, CrossFit-style)

Sources: HYROX Mumbai (excerpt only; hyrox.com blocked); divisions and weights from third-party explainers (excerpt only).

| Field | Lvl | Example | Notes |
| --- | --- | --- | --- |
| division | C | Open, Pro, Doubles (men, women, mixed), Relay (4), Adaptive, Elite 15 | |
| workout_format | E | 8 × 1 km run + 8 stations, fixed order | |
| stations | E | SkiErg, sled push, sled pull, burpee broad jumps, row, farmers carry, sandbag lunges, wall balls | |
| standards_by_division | C | Pro: heavier sled, wall ball 9 kg men / 6 kg women | |
| heat_slot | C / event_waves | start-time heats across 3–4 days | |
| price_per_athlete | C | Doubles and Relay buy one ticket per athlete | |
| dynamic_pricing | E | price rises as spots fill | price tiers |
| spectator_tickets | ticket_kind=spectator | | |
| age_group_ranking | C | 5-year bands for results | |

### 5.11 Adventure races

Sources: Namma Adventure Race 4.0, Adventure @ Mechukha, 4th National Champs (excerpt only; arworldseries.com blocked); Casuarina Adventure X, Bhor (excerpt only; punekarnews blocked).

| Field | Lvl | Example | Notes |
| --- | --- | --- | --- |
| course_length_km, time_limit_hours | C | 60 / 120 km, 24 h; 450 km over 5 days | |
| disciplines | E | trek, MTB, rope work, orienteering, trail run, kayak or raft, surprise | |
| team_size, team_composition | C | 2 or 4; mixed four eligible for championship slot | `team_size_*` have; `team_composition` NEW |
| team_cap | C | 30 teams | `capacity` |
| navigation | E | map and compass, GPS rules | |
| mandatory_gear | events.mandatory_gear | | |
| qualifier | E | winning mixed team qualifies for the Indian AR Championship 2027 | |
| non_stop | E | true | |
| series | E | AR World Series member race | `series_id` |

---

## 6. Recommended section order (all sports)

One order for every sport. Sport-specific content appears inside sections 6 and 7; whole sections are hidden when empty.

| # | Section | Contents | Sport-specific? |
| --- | --- | --- | --- |
| 1 | **Hero** | cover, title, edition, sport chip, dates, venue and city, rating and review count, badges (certified, verified organiser, timed) | no |
| 2 | **At a glance** strip | categories or distances, start time, price from (incl. GST or + GST), closes on, slots left, min age, difficulty or altitude | facts chosen per sport |
| 3 | **Tickets** (sticky panel on desktop, bottom bar on mobile) | category finder (event, gender, age) → cards with inclusions icons, timed badge, start, cut-off, price tier and next tier, struck-out price, slots left | no |
| 4 | **About** | tagline, description (collapsed after ~6 lines) | no |
| 5 | **What's included** | registration kit, race-day amenities, exclusions | no |
| 6 | **Format / Course** | running and cycling: map, GPX, elevation, checkpoints and cut-offs; triathlon: legs; treks: itinerary days; racquet and martial arts: format, draws, equipment, classes; fitness: stations and divisions; adventure: disciplines, navigation | **yes** |
| 7 | **Eligibility and requirements** | min age per category, documents, medical certificate, guardian consent, qualifying standard, fitness benchmark, mandatory gear and things to carry | partly |
| 8 | **Schedule** | expo and kit collection (mandatory? race day?), reporting, flag-off per category, technical meeting, ceremony | no |
| 9 | **Prizes and awards** | podiums per category and age band, cash, minimum-entries rule, team trophies | no |
| 10 | **Policies** | refund, transfer, deferral, changes-until, postponement, waiver summary + full text, rules documents (event_resources) | no |
| 11 | **Safety and support** | medical, ambulances, women's safety items, insurance, evacuation (treks) | partly |
| 12 | **Venue and getting there** | map, address, parking, transport, nearest station | no |
| 13 | **Organiser** | about, verified, past events, socials, contact, WhatsApp, sponsorship and corporate contact | no |
| 14 | **Past editions and media** | gallery by edition_year, videos | no |
| 15 | **Sponsors** | by tier | no |
| 16 | **Reviews** | | no |
| 17 | **FAQ** | | no |

After the event: **Results** moves to position 2 (results link, finisher search, certificates), and Tickets is replaced by
"Notify me about the next edition".

---

## 7. India-specific items

| Item | What organisers do | Field | DB |
| --- | --- | --- | --- |
| GST-inclusive pricing | indiarunning prints "Inc. of all taxes" (Hindustan, Pune, Raipur) **or** "+ GST" (Mussoorie). Tigerman lists "+ 18% GST". The trek operator says taxes are included | `tax_mode`, `gst_rate`; the card must print the label beside every price | HAVE |
| Minimum ages and parental consent | Per-distance minimum ages (Hindustan); "age count on event date" (Raipur); karate from age 4 with age proof under 18 | `min_age`, `max_age`, `age_as_on_date`; guardian fields on `tickets` | HAVE |
| Documents | Aadhaar at check-in (Hudle), age proof (karate), AFI UID (athletics), BAI ID (badminton), original photo ID for forest permits (treks) | `required_documents` vocabulary: aadhaar, age_proof, photo_id, medical_certificate, tmt_report, federation_id | HAVE |
| Medical certificates | Indiahikes: TMT report if over 58; YHAI: trekking medical certificate; Rumble: medical note unlocks a full refund. Hindustan's waiver includes a fitness declaration | `required_documents`, `waiver_text` | HAVE |
| Certification and sanction | AIMS course measurement and Indian Athletics recognition (TMM qualifying rule); BRM sanctioned by ACP and approved by AIR (Audax); BAI-sanctioned ranking events; AFI circulars; RSFI age groups | `is_certified`, `certifying_body`, `counts_for_ranking`; add `sanction_reference` | HAVE + NEW |
| Women's safety and participation | Pune Marathon: women's categories at half price. Treks: same-gender tents, gender ratio published. Adventure races: mixed-team rules | `event_offers` (audience=women), `women_safety` vocabulary, `team_composition` | NEW |
| Refund norms | Common pattern: non-refundable and non-transferable, refund only if the organiser cancels, registration carries over if postponed (Hindustan). Tiered refunds by date exist (Rumble). Trek deposits | `refund_policy`, `cancellation_policy`, `deferral_policy`, `changes_allowed_until`, `deposit_inr` | HAVE + NEW |
| State or residency categories | Raipur Velo: separate "Chhattisgarh State Category" | `eligibility_notes`, label | HAVE |
| Contact over WhatsApp | Audax WhatsApp group; Hindustan sponsorship over WhatsApp | `whatsapp_url` | HAVE |
| Federation-routed entry | AFI: online entry by the athlete; Khelo India: nominations only through federations or universities | `sport_details.entry_mode`, `ticketing_mode` | JSON |

---

## 8. Sources

Access: **rendered** = headless Edge, full text read; **fetched** = direct fetch; **excerpt** = search-engine excerpt only,
the page itself was blocked or unreachable from this network. Accessed 2026-10-19.

| Sport | Page | Access |
| --- | --- | --- |
| Running | [Hindustan Marathon 12th Edition (indiarunning)](https://registrations.indiarunning.com/hindustan_marathon_12th_edition_24063) | rendered |
| Running | [Bajaj Pune Marathon 2026 (indiarunning)](https://registrations.indiarunning.com/bajajpunemarathon2026-48091) | rendered |
| Running (trail ultra) | [Mussoorie Ultra 2nd Edition (indiarunning)](https://registrations.indiarunning.com/mussoorieultra2ndedition-19483) | rendered |
| Running | [Tata Mumbai Marathon entry rules](https://tatamumbaimarathon.procam.in/entry-rules-regulations), [confirmation criteria](https://tatamumbaimarathon.procam.in/race-categories/marathon/confirmation-criteria), [elite qualification](https://tatamumbaimarathon.procam.in/race-categories/elite-participation/qualification-criteria) | excerpt (403 on fetch, timeout on render) |
| Cycling | [Audax India BRM 200, Mumbai Randonneurs](https://audaxindia.in/event-e-4660) | fetched |
| Cycling | [The Great Raipur Velo 2026 (indiarunning)](https://registrations.indiarunning.com/the_great_raipur_velo_2026_32620) | rendered |
| Triathlon | IRONMAN 70.3 Goa: [ironman.com](https://www.ironman.com/races/im703-goa) blocked; facts from [Gomantak Times](https://www.gomantaktimes.com/news/sports/triathletes-from-30-countries-to-take-part-in-ironman-703-india) | excerpt |
| Triathlon / duathlon | [Tigerman Triathlon and Duathlon Pune 2026](https://ironmonk.fit/tigerman-triathlon-duathlon-pune-2026.php) | excerpt (blocked) |
| Open water | OWAAF National Sea Swimming Championship: [Daily News of Open Water Swimming](https://dailynewsofopenwaterswimming.com/?p=215358) | excerpt (blocked) |
| Open water | [Den Den Sea Swimming Championship 2025 (WION)](https://www.wionews.com/sports/over-200-swimmers-gather-for-den-den-2025-sea-swimming-championship-8651014/amp) | excerpt |
| Trekking | [Treks and Trails, Kedarkantha 4N/5D](https://treksandtrails.org/tours/kedarkantha-trek-4n-5d) | fetched |
| Trekking | [Indiahikes Dayara Bugyal](https://www.indiahikes.com/trek/dayara-bugyal-trek), [Gaumukh Tapovan](https://www.indiahikes.com/gaumukh-tapovan), [difficulty ratings](https://www.indiahikes.com/blog/difficulty-ratings-mean) | excerpt (blocked) |
| Trekking | [YHAI Kedarkantha programme](https://yhaindia.org/Progames/ProgramDetails/National_Program/National_Himalayan_Kedarkantha_Winter_Trekking_Cum_Training_Expedition_2023-24) | excerpt |
| Skating | [Rumble Skate, The School of Raya](https://www.theschoolofraya.com/rumble) (fee and prize shown as placeholders) | fetched |
| Skating | [RSFI age groups (Wikipedia, citing India Skate)](https://en.wikipedia.org/wiki/Roller_Skating_Federation_of_India) | excerpt |
| Skating | [Pune district roller skating championship (Punekar News)](https://www.punekarnews.in/?p=240739) | excerpt (blocked) |
| Athletics | AFI circulars: [Indian Open Throws 2026](https://indianathletics.in/wp-content/uploads/2026/01/Circular-No.-07-5th-Indian-Open-Throws-Competition-2026.pdf), [West Zone Junior 2026](https://indianathletics.in/wp-content/uploads/2026/08/Circular-No.-85_37th-West-Zone-Junior-Athletics-Championships-2026.pdf), [National Youth 2026](https://indianathletics.in/wp-content/uploads/2026/08/Circular-No.-80_Revised-Circular-for-21st-National-Youth-Athletics-Championships-2026.pdf) | excerpt (indianathletics.in blocked) |
| Athletics (masters) | [Goa national women masters (The Goan)](https://www.thegoan.net/sports/ï»¿national-women-masters-athletics-in-goa/147307.html), [J&K UT masters (Daily Excelsior)](https://www.dailyexcelsior.com/?p=1224167) | excerpt |
| Martial arts | [Kerala Olympic Association karate championship 2025](https://keralaolympic.org/karate_championship_2025/) | fetched |
| Racquet | [Smash Mode Open Badminton Championship 2.0 (Hudle)](https://hudle.in/events/open-badminton-championship-20/857678) | rendered |
| Racquet | [BAI Yonex Sunrise All India Senior Ranking 2026, Cochin (KBA)](https://kba.org.in/en/wp-content/uploads/2026/06/BAI-Circular-Yonex-Sunrise-All-India-Senior-Ranking-2026-at-Cochin.pdf) | excerpt (blocked) |
| Racquet | [TTFI tournament prospectus](https://www.ttfi.org/uploads/Tournaments/Pdf/18bfe5735c4e.pdf), [Sharda district TT (Punekar News)](https://www.punekarnews.in/?p=236011) | excerpt (blocked) |
| Fitness | [HYROX Mumbai](https://hyrox.com/event/hyrox-mumbai/) | excerpt (hyrox.com, hyroxus.com and rundida.com blocked) |
| Fitness | [HYROX divisions explained (Roxfit)](https://www.roxfit.app/blog/hyrox-divisions-explained), [PUMA HYROX weights](https://us.puma.com/us/en/articles/hyrox-weights-repetitions-distance-division) | excerpt |
| Adventure | [Namma Adventure Race 4.0 (ARWS)](https://arworldseries.com/races/namma-adventure-race-4-0-2026-india), [4th National Champs India 2026](https://arworldseries.com/races/4th-national-champs-india-2026-2026-india) | excerpt (blocked) |
| Adventure | [Casuarina Adventure X, Bhor (Punekar News)](https://www.punekarnews.in/?p=246744) | excerpt (blocked) |

**Could not load at all from this network:** indiahikes.com, ironman.com, hyrox.com (and the hyroxus.com and rundida.com
mirrors), arworldseries.com, indianathletics.in, kba.org.in, ttfi.org, ironmonk.fit, punekarnews.in,
dailynewsofopenwaterswimming.com (all Forcepoint "Access to this site is blocked"); tatamumbaimarathon.procam.in (403 and
timeout); townscript.com listings (redirect to sign-in); the hudle.in events listing (render error); an edudel.nic.in skating
circular (scanned image PDF, no text). No CAPTCHA or bot gate was bypassed.

**Gaps.** No organiser page could be read in full for swimming, athletics meets, fitness or adventure races; those sections
rest on search excerpts. A session outside the corporate network should re-check §5.3, §5.4, §5.7, §5.10 and §5.11 before
GA-047 freezes the per-sport JSON schemas.
