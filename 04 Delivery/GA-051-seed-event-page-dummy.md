---
id: GA-051
type: task
status: ready
priority: P1
owner: ingestion-scripts
branch: codex/ga-051-seed-event-page-dummy
worktree: D:\project\goathletix-wt\be-ga-051-seed-event-page-dummy
scope: [goathletix-backend/supabase/seeds/<new file>]
acceptance: []
depends_on: [GA-047]
related: [GA-050]
---

# GA-051 Dummy data seed for the migration-0026 event-page fields

## Context (settled; do not re-investigate)

- Migration 0026 is **live** (applied 2026-10-19). The DB has sparse data in the new columns and no rows at all
  in the new tables, so the event page shows almost nothing even on real events (owner screenshot: Goa River
  Marathon 2026 shows only header + "Distances" + "Entry from" and nothing else).
- Reach the DB from the Supabase dashboard SQL editor; **port 5432 is firewalled from here**, so neither psql
  nor Prisma can run the script. Hand the owner a file to paste and run.
- The service-role key bypasses RLS; writes from the dashboard also bypass RLS.
- All ids in the DB are UUIDs; `gen_random_uuid()` is available (pgcrypto); timestamps are `timestamptz(6)`.
- The real events to seed are listed below (verified by the coordinator via REST on 2026-10-19). **Use these
  exact UUIDs** so the owner can open the pages directly after running the seed.

## Scope

Owned: one new SQL file at `goathletix-backend/supabase/seeds/0001_event_page_showcase.sql`. Documentation only
otherwise. No code changes, no schema changes, no git push.

## Showcase events to seed (one per sport family, each with 3–5 tickets, awards, checkpoints, resources, offers, itinerary where it fits)

| Sport family | Event name | event_id | organizer_id |
| --- | --- | --- | --- |
| Running (ultra) | Ultimate Goa Ultra Marathon 2026 | `fe2f7043-1889-4b31-b7bb-07bc9c26685d` | `5e419773-f40e-47b3-ab1a-ecfcb2446cc9` |
| Cycling (brevet / endurance) | Star Goa Gravel Race 2026 | `dee4ce05-e00e-46f3-9d4b-808457f8adbd` | `aeb855bd-ca39-4596-a6a8-185e13c61a6e` |
| Trekking (multi-day) | Monsoon Goa Mountain Challenge 2027 | `b6951a6a-a872-45a0-9377-738549a876ea` | `0a62084c-1d43-4937-81c4-2c836c6a2990` |
| Racquet (tournament) | Star Goa Tennis Tournament 2026 | `4011e73d-a3df-4dde-94ea-72c58619d966` | `4cdfbae1-338f-450d-bd5f-895d76b6f280` |

**Before writing SQL**, re-fetch each event's existing `event_categories` rows (ids and names) so the awards /
checkpoints / itinerary rows attach to real category ids. The coordinator put a small probe pattern in the
handoff you can reuse (undici ProxyAgent + direct fetch to `/rest/v1/event_categories?event_id=eq.<id>`).

## What to seed, per event

Idempotent in all directions. Use `INSERT ... ON CONFLICT DO NOTHING` guarded by deterministic UUIDs
(`md5(concat('ga-051-awards:', event_id, ':', sort_order))::uuid`) OR a scope key + `WHERE NOT EXISTS` guard —
your pick, as long as re-running the script leaves the DB in the same state.

1. **events**: fill the 0026 columns the sport uses — `sport_details jsonb`, `mandatory_gear text[]`,
   `recommended_gear text[]`, `fitness_requirement`, `changes_allowed_until`, `kit_collection_mandatory`,
   `race_day_collection`, `gpx_url` (any public example GPX URL is fine for display), `sanction_reference`,
   `elevation_gain_m`, `edition_number`, `women_safety text[]`, `sponsorship_contact`, `closes_when_sold_out`,
   `instagram_url/facebook_url/youtube_url/x_url/linkedin_url/strava_url/hashtag`. Also top up any GA-043/048
   fields that are still null and would show empty on the page (`tagline`, `aid_stations jsonb`, `amenities text[]`,
   `safety_info`, `contact_email/phone`, `whatsapp_url`, `refund/transfer/deferral/cancellation` policies,
   `terms_text`, `waiver_text`, `tax_mode`, `gst_rate`, `rating_avg`, `rating_count`, `bib_expo_opens_at/closes_at`,
   `results_url`). Keep values realistic; mark the tagline with `[Sample]` so the owner can tell what came from
   seeding. Only write when the current value is NULL/empty (`COALESCE`).

2. **event_categories** per existing category: fill `description`, `includes text[]`, `excludes text[]`,
   `max_per_order`, `min_age`, `max_age`, `age_as_on_date`, `required_documents text[]`, `qualifying_standard`,
   `team_size_min/max`, `eligibility_notes`, `sport_details jsonb`, `is_timed`, `compare_at_price_inr`,
   `team_composition`, `ticket_kind` (participant / team / spectator / add_on), `session_starts_on/ends_on`,
   `deposit_inr`, `balance_due_days`, `course_map_url`, plus `sales_start_at/sales_end_at` if NULL. For the trek,
   also fill `session_starts_on` and `session_ends_on` so the batch dates appear.

3. **event_awards** — 2–3 rows per category where awards make sense (running age bands; cycling top overall;
   racquet knockout trophies; trek: none).

4. **event_checkpoints** — running: 2 aid-station-style checkpoints with cut-offs; cycling: 4 control-point
   checkpoints with cut-offs; trek + racquet: none.

5. **event_resources** — rules PDF, athlete guide, waiver, GPX link. 3–4 per event.

6. **event_offers** — a group discount, a women/students audience offer. 1–2 per event.

7. **event_itinerary_days** — trek: 5 days with distance/altitude/meals. Others: none.

8. **organizers** social links — fill `facebook_url/youtube_url/x_url/linkedin_url/strava_url/whatsapp_url`
   on each of the 4 organizers. COALESCE so existing values are not overwritten.

## Rules (CLAUDE.md §5)

- Hand-written SQL in one file. Idempotent (`INSERT ... ON CONFLICT DO NOTHING`, UPDATE guarded by
  `WHERE column IS NULL` or `COALESCE`), transactional (one BEGIN/COMMIT), **no DROP, no TRUNCATE,
  no unqualified DELETE**. The script must only ever write, never destroy.
- Scripts must never create or alter tables; use the columns the migration already added.
- Verify every column name against `supabase/migrations/20261019000026_event_page_fields.sql` (grep it) —
  the research note's names may differ.
- The seed file lives at `goathletix-backend/supabase/seeds/0001_event_page_showcase.sql`. If the `seeds/` folder
  does not exist, create it. The folder is for owner-applied seed data, separate from `supabase/migrations/`.
- Do not read, echo or commit any value from `.env` (CLAUDE.md §4).

## Acceptance criteria

- [ ] One SQL file at `supabase/seeds/0001_event_page_showcase.sql`, transactional, idempotent, with a header
      comment explaining what it does and the one-line "apply this in Supabase dashboard SQL editor" instruction.
- [ ] Covers all four showcase events, filling columns and child tables as above.
- [ ] A separate markdown report lists: real column names used, rows written per table per event, and any
      research-note name that did not match the migration (with the real name used instead).
- [ ] No DROP / TRUNCATE / unqualified DELETE / ALTER. Verified by `grep -nE 'DROP|TRUNCATE|^DELETE|ALTER' seeds/0001_*.sql`.
- [ ] Script parses as valid Postgres (`pglast` is at `C:\Users\nitinsin\AppData\Local\Temp\claude\D--project-goathletix\f71aa757-0b92-46d9-8b7a-1cb3ded7b443\scratchpad\pglastlib`;
      use `PYTHONPATH=.../pglastlib python -c "from pglast import parser; parser.parse_sql(open('...').read())"`).
- [ ] **Not applied.** The owner applies it in the Supabase dashboard after both GA-050 and GA-051 merge.

## Verification table

| Check | Result | Evidence |
| --- | --- | --- |
| idempotency grep | pass | every INSERT ends with `ON CONFLICT DO NOTHING`; every UPDATE guarded with `COALESCE(...)` or `WHERE col IS NULL / = '{}'::text[] / = '{}'::jsonb` |
| destructive grep | pass | `grep -nE 'DROP\|TRUNCATE\|^DELETE\|ALTER' supabase/seeds/0001_event_page_showcase.sql` matches only the header comment on line 18 |
| pglast parses | pass | `PYTHONPATH=.../pglastlib python -c "from pglast import parser; parser.parse_sql(open('supabase/seeds/0001_event_page_showcase.sql').read()); print('ok')"` -> `ok` |
| rows per table (dry-run count) | event_categories 14 (4+3+3+4), event_awards 17, event_checkpoints 6 (2+4), event_resources 15 (4+4+4+3), event_offers 8 (2+2+2+2), event_itinerary_days 5, events UPDATE blocks 26 (6 per event + extras), organizers UPDATE blocks 4 | counted via `awk` + `grep -c` on `^  (md5` pattern per INSERT block |

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
