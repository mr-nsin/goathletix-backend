---
id: ADR-009
type: decision
status: proposed
date: 2026-10-19
owners: [product owner, data-schema]
related: ["[[04 Delivery/GA-047-migration-0026-event-page-fields|GA-047]]", "[[01 Product/Event detail fields by sport]]", "[[01 Product/Club and academy listing research]]", "[[03 Decisions/ADR-007-discovery-plus-ticketing|ADR-007]]", "[[03 Decisions/ADR-008-coach-trainings|ADR-008]]"]
tags: [adr, schema, events, clubs, academies, gear, rls]
---

# ADR-009 Detail-page fields: typed columns for common facts, side tables for lists, one jsonb per sport

**Status: proposed.** Migration `supabase/migrations/20261019000026_event_page_fields.sql` implements this record.
It is **committed but not applied**. The owner applies it by hand in the Supabase dashboard SQL editor.

## Context

- GA-046 (`01 Product/Event detail fields by sport.md`) lists what organisers publish, sport by sport, and marks
  what the database lacks. Every sport adds 3 to 10 facts that no other sport uses (shuttle brand, trek itinerary,
  triathlon legs, weight classes). Some facts are common to all sports (mandatory gear, kit collection rules, prizes).
- On 2026-10-19 the owner extended the scope: migration 0026 is the one script for **every** detail page. That means
  organiser and event social links, club and academy profiles (GA-032 research), and gear (product) pages.
- Constraints: the API returns snake_case rows straight from Supabase. The frontend normaliser reads them field by field.
  RLS is on for every public table. The backend uses the service role, which bypasses RLS.

## Decision

1. **Three storage shapes, chosen by how the data is used.**
   - **Typed column** when a fact is common to many sports or is filtered or sorted on (`mandatory_gear text[]`,
     `changes_allowed_until`, `elevation_gain_m integer`, `ticket_kind`, `compare_at_price_inr`).
   - **Side table** when a fact is a list of structured rows with its own order (`event_awards`, `event_checkpoints`,
     `event_resources`, `event_offers`, `event_itinerary_days`, `center_batches`, `center_coaches`, `center_media`,
     `center_reviews`).
   - **One `sport_details jsonb`** on `events` and on `event_categories` for per-sport facts. It is keyed by
     `events.sport_type` and validated in code. A `CHECK (jsonb_typeof(...) = 'object')` is the only database rule.
     A fact moves to a real column only when a filter or sort needs it.
2. **Per-sport shapes.** These are documented in `COMMENT ON COLUMN` in the migration and repeated below. All keys
   are optional. An optional `"v": 1` records the schema version.

   | sport_type | `events.sport_details` | `event_categories.sport_details` |
   | --- | --- | --- |
   | running | `course_type` (loop, out_and_back, point_to_point) | `pacers[]`, `qualifying_window {from,to}`, `itra_points`, `utmb_index` |
   | cycling | `ride_format` (brevet, gran_fondo, race, fellowship_ride), `support_level`, `proof_of_passage`, `bike_types_allowed[]`, `night_riding`, `rider_number_display` | - |
   | triathlon | `swim_venue_type`, `water_temp_c`, `wetsuit_rule`, `drafting`, `transition_location`, `qualifier_slots` | `legs [{sport, km, cutoff_minutes}]` |
   | water | `water_body`, `tide_dependent_start`, `water_temp_c`, `wetsuit_rule`, `safety_cover[]`, `cap_and_chip` | `swim_ability_declaration_m` |
   | trekking | `duration_days`, `duration_nights`, `base_camp_altitude_m`, `trek_distance_km`, `start_point`, `end_point`, `pickup_point`, `pickup_time`, `group_size_max`, `gender_ratio`, `stay`, `meals`, `permits[]`, `connectivity`, `best_season` (the day-by-day plan goes in `event_itinerary_days`) | `age_medical_rule` |
   | skating | `judging {judges, criteria[]}`, `qualifies_for` | `discipline`, `skate_type` (quad, recreational_inline, professional_inline), `federation_age_group`, `race_events[]` |
   | athletics | `max_events_per_athlete`, `entries_per_unit`, `entry_mode` (athlete_online, via_association, via_federation) | `event`, `implement_spec`, `entry_fee_per_event_inr`, `masters_age_band` |
   | martial_arts | `style`, `rules_body`, `reporting_minutes_before` | `event_type` (kata, kumite, team_kata, team_kumite), `weight_class_kg {min,max}`, `belt_min`, `belt_max`, `allowed_katas[]`, `bout_format` |
   | racquet | `tournament_format` (knockout, round_robin_knockout, league, swiss), `courts`, `court_surface` | `event_type` (singles, doubles, mixed_doubles, team), `shuttle_or_ball`, `price_unit` (per_player, per_pair, per_team), `combined_min_age` |
   | fitness | `workout_format`, `stations[]` | `division`, `standards {}`, `price_per_athlete` |
   | adventure | `disciplines[]`, `navigation`, `non_stop`, `qualifier` | `course_length_km`, `time_limit_hours` |

   GA-046 warns that the swimming, athletics, fitness and adventure sections rest on search excerpts only. Those
   shapes are provisional until someone re-checks them from outside the corporate network. Because they live in
   jsonb, changing them later needs no migration.
3. **"Unknown" stays NULL.** `kit_collection_mandatory`, `race_day_collection`, `closes_when_sold_out`,
   `event_categories.is_timed` and `products.is_returnable` are nullable booleans. NULL means the organiser or seller
   has not said, and the UI shows nothing. `is_timed` NULL inherits `events.is_chip_timed`.
4. **`women_safety` is its own `text[]` column with a CHECK vocabulary.** It is not folded into `amenities`. Reasons:
   it renders in a separate Safety section (GA-046 §6, section 11). Folding it in would mean dropping and re-adding
   the existing `events_amenities_known` constraint. And it is a trust claim that should be reviewable separately.
5. **Social links are explicit typed columns, not a jsonb blob.** Organisers and events get `instagram_url`,
   `facebook_url`, `youtube_url`, `x_url`, `linkedin_url`, `strava_url` and `whatsapp_url`, skipping any that already
   exist. Events also get `hashtag`. Clubs and training centres get the same set. Typed columns appear in generated
   types and DTOs, are queryable, and follow the existing `instagram_url` / `whatsapp_url` precedent. The cost is one
   migration for each new network, which is acceptable at this rate of change.
6. **RLS for the new event tables mirrors 0023.** Public read follows the parent event's visibility through
   `EXISTS (SELECT 1 FROM events e WHERE e.id = ...)`, which inherits the 0022 events policy: anonymous users see
   published public events, plus unlisted or invited private ones. Writes are limited to `is_organizer_admin`.
   `event_offers` is publicly readable only when `is_active`. `coupons` stays private.
7. **Club and academy child tables share one set of tables.** Each `center_*` row has a nullable `training_center_id`
   and a nullable `club_id`, with `CHECK num_nonnulls(...) = 1`. One profile layout then serves both page types.
   Public read requires an active parent (`listing_is_active`, invoker rights). Writes go through
   `can_manage_listing()` (SECURITY DEFINER, `search_path` pinned, `REVOKE ALL FROM PUBLIC`). That function allows a
   moderator, a training centre's `owner_id`, or a club's owner or club admin. Media is pre-moderated and reviews are
   post-moderated, reusing `guard_moderation_status` from 0017. A trigger maintains `rating_avg` / `rating_count`.
8. **Trust fields are staff-only, enforced by triggers.** On clubs and training centres these are `is_verified`,
   `is_certified`, `verified_at`, `verification_checks`, `safeguarding_status`, `safeguarding_checked_at`,
   `affiliation_verified`, the ratings and (clubs) `member_count`. On coaches it is `credential_verified`. A non-staff
   session cannot set or change any of them. **This closes an existing hole:** since 0011 a club owner could set
   `clubs.is_verified` and `member_count` directly.
9. **`center_batches` is the Phase 1 schedule from ADR-008 and cannot be booked.** ADR-008's `trainings` and
   `training_enrolments` are **not** created. If ADR-008 is accepted, Phase 2 should hang enrolments off
   `center_batches` rather than create a parallel `training_batches` table.
10. **Gear additions are limited to what the product page lacks:** `specs` (jsonb), `size_chart` (jsonb),
    `highlights[]`, `video_urls[]`, `gender`, suited distance range and terrains (for "gear for your event"),
    delivery, returns and warranty, plus `country_of_origin` and `manufacturer_info` (Legal Metrology declarations).
    `image_urls` already serves as the gallery, so no `product_media` table is added. A second trigger,
    `guard_product_review_zz_detail_trg`, sends an approved product back to review when any of these fields change.
    Its name makes it fire after 0021's `guard_product_review_trg`, which is left unchanged.
    - `specs`: `{"groups": [{"name": "Fit", "items": [{"key": "drop_mm", "label": "Heel-to-toe drop", "value": 8, "unit": "mm"}]}]}`
    - `size_chart`: `{"unit": "cm", "columns": ["UK","US","EU","Foot length (cm)"], "rows": [["6","7","40","25.0"]], "notes": "..."}`

## Alternatives considered

- **One jsonb blob for every detail field.** This needs the fewest migrations. Not selected: common facts would be
  untyped, invisible to Prisma and DTOs, and unfilterable. The Supabase and Prisma paths would also disagree on shape.
- **A typed column for every per-sport fact.** This gives the most type safety. Not selected: it means 60+ sparse
  columns on `events`, nearly all NULL, and a migration for every new sport. GA-046 §4 recommends against it.
- **Side tables for per-sport facts (`event_racquet_details`, `event_trek_details`, ...).** This is typed and keeps
  `events` narrow. Not selected: it means 11+ tables with RLS, a join per sport on the detail endpoint, and the same
  migration-per-sport cost.
- **Social links as `social_links jsonb`.** Flexible, but untyped and not queryable, and it breaks the existing
  column precedent. Not selected (decision 5).
- **Separate child tables for clubs and for training centres.** This needs simpler FKs but doubles the tables and
  policies for identical shapes. Not selected (decision 7).
- **Folding `women_safety` into `amenities`.** One list, but it requires replacing a live constraint and mixes trust
  claims with conveniences. Not selected (decision 4).

## Consequences

- **Positive:** every field GA-046 and GA-032 found has a home. Common facts are typed and filterable. A new sport
  needs only a code-side schema entry. Club and academy pages get batches, coaches, gallery, reviews and itemised
  trust. Organisers and events can show their social links.
- **Cost / risk:**
  - **Not applied.** Until the owner runs the file, `schema.prisma` is ahead of the live database for these columns
    and tables. Any Prisma query that selects them fails. `EventsService` uses Supabase REST with an explicit
    select string, so it is unaffected until someone adds the fields.
  - `sport_details` is validated only in code. Bad shapes are possible through the service role, so the API must
    validate on write.
  - The `elevation_gain_m` backfill updates `events` rows whose text is a plain metre figure. That bumps their
    `updated_at` through `update_events_modtime`. `md5_payload_hash` is untouched, so ingestion dedupe is unaffected.
  - The new club trust guard changes behaviour: club owners can no longer self-verify. The backend (service role)
    and moderators still can.
  - `safeguarding_status` must not be shown publicly until the legal evidence standard (ADR-008) is decided.
  - Offers are display data. Checkout does not yet apply them, so the UI must not imply an automatic discount
    until the backend does.
  - Child-table `category_id` is not constrained to belong to the same event (same as `event_schedule_items` in
    0023). The API must check it.
- **Open items for the owner:**
  - Should a claimed training centre owner be able to edit the centre row itself? 0011 gives no owner write policy.
    0026 lets the owner manage the child tables only. The trust guard is ready if a policy is added.
  - Confirm ADR-008 and whether Phase 2 enrolments attach to `center_batches`.
- **Follow-up tasks:** apply 0026 in the dashboard and run the verification block at the end of the file;
  `prisma generate` in the main checkout after it is applied; GA-048 to return the new event fields from
  `GET /events/:id/details` and render them; DTO validation for `sport_details` per sport; club / academy and product
  detail endpoints; add ADR-009 to `03 Decisions/Decision log.md`.
