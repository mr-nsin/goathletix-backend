---
task: GA-050
agent: events-api
branch: codex/ga-050-details-v2-with-0026
worktree: D:\project\goathletix-wt\be-ga-050-details-v2-with-0026
date: 2026-10-19
---

# GA-050 — `GET /events/:id/details` v3: migration-0026 fields

## Summary

Extend the detail endpoint with every field added by migration `20261019000026_event_page_fields.sql`
(live since 2026-10-19). Appends to the GA-048 response shape; nothing from GA-048 removed. Five new
child tables are read in parallel with the existing ones and each is isolated by a try/catch so one
failing section returns `[]` instead of 500-ing the whole response.

## Changed files

- `goathletix-backend/src/events/events.service.ts`
  - `EVENT_DETAIL_COLUMNS`: appended 21 columns from 0026 — 14 event-page fields plus 7 event social links.
  - `EVENT_DETAILS_SELECT`: organiser join extended with `facebook_url, youtube_url, x_url, linkedin_url, strava_url, whatsapp_url`.
  - `TICKET_TYPE_SELECT`: appended `sport_details, is_timed, compare_at_price_inr, excludes, team_composition, ticket_kind, session_starts_on, session_ends_on, deposit_inr, balance_due_days, course_map_url`.
  - Added selects for five child tables (`AWARD_SELECT`, `CHECKPOINT_SELECT`, `RESOURCE_SELECT`, `OFFER_SELECT`, `ITINERARY_SELECT`) and exported row interfaces.
  - `findDetails`: Promise.all now also fetches the five tables through a new `safeChildRows` helper (logs + returns `[]` on any error) and returns `awards`, `checkpoints`, `resources`, `offers`, `itinerary_days` in `data`.
  - `.order()` applied in SQL per table: `sort_order NULLS LAST` on awards/resources/offers, `seq` on checkpoints (no `sort_order` column), `sort_order NULLS LAST` then `day_no` on itinerary days.
- `goathletix-backend/src/events/events.service.spec.ts`
  - Extended empty-arrays test to assert the five new sections default to `[]`.
  - New spec: GA-050 column pass-through (events + organiser social links + ticket types), with no-duplicate assertion.
  - New spec: snake_case row pass-through for all five child tables.
  - New spec: per-section error isolation (missing-table + 500 code both fall back to `[]` without failing the response).

## Commands run

| Command | Exit | Notes |
| --- | --- | --- |
| `npm run build` | 0 | `nest build` clean after exporting the five row interfaces (TS4053 required). |
| `npm test` | 0 | 2 suites, 30 tests (was 27 under GA-048). |
| `npx eslint src/events` (no --fix) | 0 | No problems. |
| `npx prettier --check src/events/events.service.ts src/events/events.service.spec.ts` | 0 | Clean after one `--write` on the spec. |

Not run: live smoke call (owner / coordinator runs after merge, per task note).

## Field-name map (research note → actual migration column)

Where the GA-050 task note's names matched the migration, nothing to call out. The differences:

| Section | Research note name | Actual column(s) in 0026 | Notes |
| --- | --- | --- | --- |
| awards | `title` | — (dropped) | No `title` column in `event_awards`. Not selected. |
| awards | `places` | `position_from, position_to` | Range of positions. Both selected. |
| awards | `min_entries` | `min_entries_female, min_entries_male` | Split by gender. Both selected. |
| checkpoints | `distance_km` | `km` | Renamed. Also exposed `cutoff_at` alongside `cutoff_after_minutes`, plus `seq`, `location`, `services`. |
| checkpoints | `cutoff_minutes` | `cutoff_after_minutes` | Renamed. |
| checkpoints | `sort_order` | — (none; use `seq`) | `event_checkpoints` has no `sort_order`. Ordered by `seq` instead. |
| resources | `title` | `label` | Renamed. |
| resources | `is_public` | — (dropped) | Column does not exist; RLS and `kind` cover visibility. Not selected. |
| offers | `title` | `label` | Renamed. |
| offers | `description` | — (closest: `terms`) | No `description` column. Selected `terms` as the free-text field. |
| offers | `discount_label` | `discount_type, discount_value` | Numeric split. Both selected (plus `min_qty`, `valid_from`, `is_active`). |
| itinerary_days | `category_id` | — (none) | Day rows are not scoped to a ticket type in 0026. Not selected. |
| itinerary_days | `day_number` | `day_no` | Renamed. |
| itinerary_days | `location` | — (closest: `stay`) | No `location` column. `stay` selected; also `duration_text`. |
| itinerary_days | `altitude_m` | `start_altitude_m, end_altitude_m` | Range per day. Both selected. |

Also note: the frontend's organiser block now carries `facebook_url, youtube_url, x_url, linkedin_url, strava_url, whatsapp_url` in addition to the GA-048 `instagram_url`.

## Dropped (not in migration, not selected)

- `event_awards.title`
- `event_resources.is_public`
- `event_offers.description`
- `event_itinerary_days.category_id`, `event_itinerary_days.location`

## Risks / follow-ups

- The frontend (`eventDetails.ts`) is permissive and treats every new field as optional, so this is a safe append. Frontend work can map the renamed fields above (e.g. `award.title` → nothing; render from `prize_text` + `scope`/`age_band`) at its own pace.
- Live smoke after merge: a seeded event's `/details` should carry the full shape with the five new arrays as `[]` until seed data is added.
- No schema or migration touched. No other endpoint changed.
