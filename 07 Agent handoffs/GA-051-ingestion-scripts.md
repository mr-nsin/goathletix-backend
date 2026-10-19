---
task: GA-051
agent: ingestion-scripts
date: 2026-10-19
branch: codex/ga-051-seed-event-page-dummy
worktree: D:\project\goathletix-wt\be-ga-051-seed-event-page-dummy
---

# GA-051 handoff - dummy data seed for migration 0026 event-page fields

## Deliverable

One SQL file:

- `goathletix-backend/supabase/seeds/0001_event_page_showcase.sql`
- Size: 61,455 bytes, 777 lines
- Transactional (one `BEGIN;` ... `COMMIT;`), write-only, idempotent

## Owner one-liner

Open the Supabase dashboard SQL editor and paste the whole file, then click Run:

```
-- Supabase dashboard -> SQL editor -> New query -> paste the full contents of
-- goathletix-backend/supabase/seeds/0001_event_page_showcase.sql -> Run
```

Re-running the same file is a no-op (deterministic UUIDs + `ON CONFLICT DO NOTHING`;
every UPDATE is `COALESCE`-guarded or scoped with `WHERE col IS NULL / = '{}'::text[]
/ = '{}'::jsonb`).

## Rows the script writes (per table, dry-count from the script, not from the DB)

| Table | Inserted rows | Updated rows |
| --- | --- | --- |
| events | - | 4 (26 statements - 1 base + sport_details / amenities / mandatory_gear / recommended_gear / women_safety / aid_stations per event, trek has no aid_stations block) |
| organizers | - | 4 |
| event_categories | 14 (4 running + 3 cycling + 3 trekking + 4 racquet) | 14 (field top-ups per category) |
| event_awards | 17 | - |
| event_checkpoints | 6 (2 ultra 100K + 4 gravel 150K) | - |
| event_resources | 15 (4 ultra + 4 gravel + 4 trek + 3 tennis) | - |
| event_offers | 8 (2 per event) | - |
| event_itinerary_days | 5 (trek only) | - |

## Column coverage

Events: `tagline`, `safety_info`, `contact_email`, `contact_phone`, `whatsapp_url`,
`refund_policy`, `transfer_policy`, `deferral_policy`, `cancellation_policy`,
`terms_text`, `waiver_text`, `tax_mode` (already defaulted, not overwritten),
`gst_rate`, `bib_expo_opens_at`, `bib_expo_closes_at` (not for trek/racquet),
`results_url` (not for trek), `sport_details`, `mandatory_gear`, `recommended_gear`,
`fitness_requirement`, `changes_allowed_until`, `kit_collection_mandatory`,
`race_day_collection`, `gpx_url` (running/cycling/trek), `sanction_reference`,
`elevation_gain_m` (already present on all four), `edition_number`, `women_safety`,
`sponsorship_contact`, `closes_when_sold_out`, `aid_stations` (running/cycling),
`amenities`, `instagram_url`, `facebook_url`, `youtube_url`, `x_url`, `linkedin_url`,
`strava_url` (not tennis), `hashtag`.

Event categories: `label`, `discipline_slug` (valid slugs: `ten_k`, `half_marathon`,
`ultra_marathon`, `gravel`, `gran_fondo`, `tennis`; verified against live
`disciplines` table), `distance_km`, `gender`, `start_time` (where applicable),
`cutoff_minutes`, `capacity`, `price_inr`, `compare_at_price_inr`, `is_timed`,
`ticket_kind`, `sort_order`, `sport_details`, `excludes`, `description`, `includes`,
`max_per_order`, `min_age`, `max_age`, `age_as_on_date`, `required_documents`,
`qualifying_standard`, `eligibility_notes`, `course_map_url`, `team_size_min/max`
(racquet), `team_composition` (doubles), `session_starts_on/ends_on`, `deposit_inr`,
`balance_due_days` (trek).

Organizers: `facebook_url`, `youtube_url`, `x_url`, `linkedin_url`, `strava_url`,
`whatsapp_url` (COALESCE on all four organizers).

Child tables: full column coverage per the migration 0026 definitions.

## Deviations from the task note (reconciled against the live DB)

| Research-note name | Real column | Where |
| --- | --- | --- |
| `event_categories.name` | `event_categories.label` | migration `20261001000014_event_details_pricing.sql` line 81 |
| `amenities` values `drinking_water / first_aid / bag_drop / mechanic_support / cafe / showers` | not in the `events_amenities_known` CHECK (migration 0023); mapped to allowed values (`hydration`, `medical`, `baggage_counter`, `changing_rooms`, `shuttle`, etc.) | migration `20261001000023_event_setup.sql` lines ~65-69 |
| `discipline_slug` values `running / cycling / racquet` | FK to `disciplines.slug`; those slugs do not exist. Mapped to real slugs: `ten_k / half_marathon / ultra_marathon` (running), `gravel / gran_fondo` (cycling), `tennis` (racquet) | REST probe of `/rest/v1/disciplines?select=slug` |

Also noted: all four showcase events had **zero** existing `event_categories` rows, so
the seed creates them from scratch rather than attaching to pre-existing ids.

## Commands actually run

| Command | Exit | Notes |
| --- | --- | --- |
| REST probe `/rest/v1/event_categories?event_id=eq.<each>` (undici ProxyAgent + fetch) | 200 | Returned `[]` for all four events; confirmed table column is `label` not `name` |
| REST probe `/rest/v1/events?select=<all 0023/0025/0026 cols>&id=eq.<each>` | 200 | Confirmed every target column is NULL (or `'{}'` default) on all four events |
| REST probe `/rest/v1/disciplines?select=slug,sport_type&limit=20` | 200 | Validated the slug vocabulary |
| `grep -nE 'DROP\|TRUNCATE\|^DELETE\|ALTER' supabase/seeds/0001_event_page_showcase.sql` | 0 | Only match is the header comment on line 18 (literal word-list in prose) |
| `PYTHONPATH=.../pglastlib python -c "from pglast import parser; parser.parse_sql(open('supabase/seeds/0001_event_page_showcase.sql').read()); print('ok')"` | 0 | Printed `ok` |
| `wc -l supabase/seeds/0001_event_page_showcase.sql` | 0 | 777 lines |
| `git add` + `git commit` on branch `codex/ga-051-seed-event-page-dummy` | 0 | See repo log |
| apply the SQL script | not run | Owner applies in Supabase dashboard; 5432 is firewalled from here |

## Risks and follow-ups

- `events.sport_details` is validated per-sport in **code**, not in the DB. The
  seeded JSON objects follow the shapes documented in the `COMMENT ON COLUMN
  events.sport_details` block of migration 0026; verify the API's validator agrees
  before the next release.
- Trek `tax_mode` defaults to `inclusive` (set by column default). The seed does
  not override it. If treks should be GST-exclusive, the owner can `UPDATE events
  SET tax_mode = 'exclusive' WHERE id = 'b6951a6a-a872-45a0-9377-738549a876ea'`.
- The seed uses sample URLs under `cdn.goathletix.sample` and `.sample.in`
  domains for every PDF, GPX, map, and social link. The strings are suffixed with
  `[Sample]` on taglines so the owner can spot and replace them.
- `event_categories.excludes` constraint (if any was later added) was not probed;
  the migration itself does not add one. If a value is rejected, re-check 0026+.

## File paths touched

- `goathletix-backend/supabase/seeds/0001_event_page_showcase.sql` (new)
- `goathletix-backend/04 Delivery/GA-051-seed-event-page-dummy.md` (Verification table filled)
- `goathletix-backend/07 Agent handoffs/GA-051-ingestion-scripts.md` (this file)
