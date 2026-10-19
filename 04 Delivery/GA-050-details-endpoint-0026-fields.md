---
id: GA-050
type: task
status: done
priority: P1
owner: events-api
branch: codex/ga-050-details-v2-with-0026
worktree: D:\project\goathletix-wt\be-ga-050-details-v2-with-0026
scope: [goathletix-backend/src/events/**]
acceptance: []
depends_on: [GA-048]
related: [GA-047, GA-049, GA-051]
---

# GA-050 `GET /events/:id/details` v3: return the migration-0026 fields

## Context (settled; do not re-investigate)

- Migration `20261019000026_event_page_fields.sql` was applied by the owner on 2026-10-19 and is **live**.
  All new columns and all new tables probed 200 via Supabase REST with the service-role key. Column lists are in
  `04 Delivery/GA-047-migration-0026-event-page-fields.md`.
- GA-048 already extended `/events/:id/details` with the 0024/0025 columns and the sponsors list; keep that
  response shape and append to it.
- The frontend treats every new field as optional (see `goathletix-frontend/src/lib/eventDetails.ts`) — it is
  safe to add fields without a coordinated FE release.
- `event_date` is still the live column name; migration 0003 (start_date/end_date) is **not** applied —
  do not query start_date/end_date.
- Service-role key bypasses RLS, so queries over `public_and_published` filters are not required; still only
  return rows whose parent event matches the request.

## Scope

Owned: `goathletix-backend/src/events/**` (service, controller, spec). Out of scope: schema, migrations, main.ts,
app.module.ts, package files, any DB write, frontend code.

## Contract additions

Keep every field from GA-048 and add:

```
event: { ...GA-048,
  sport_details, mandatory_gear, recommended_gear, fitness_requirement,
  changes_allowed_until, kit_collection_mandatory, race_day_collection,
  gpx_url, sanction_reference, elevation_gain_m, edition_number,
  women_safety, sponsorship_contact, closes_when_sold_out,
  instagram_url, facebook_url, youtube_url, x_url, linkedin_url, strava_url, hashtag
}
organizer: { ...GA-048,
  facebook_url, youtube_url, x_url, linkedin_url, strava_url, whatsapp_url
}
ticket_types[i]: { ...GA-048,
  sport_details, is_timed, compare_at_price_inr, excludes, team_composition,
  ticket_kind, session_starts_on, session_ends_on, deposit_inr, balance_due_days, course_map_url
}
awards: [{ id, category_id, title, scope, age_band, places, gender, cash_inr, prize_text, min_entries, sort_order }]
checkpoints: [{ id, category_id, name, distance_km, cutoff_minutes, notes, sort_order }]
resources: [{ id, title, kind, url, is_public, sort_order }]
offers: [{ id, title, description, audience, discount_label, valid_until, sort_order }]
itinerary_days: [{ id, category_id, day_number, title, description, location, altitude_m, distance_km, meals, sort_order }]
```

Column names and sort columns above are the research note's best guesses; **verify every one against the migration SQL at
`supabase/migrations/20261019000026_event_page_fields.sql`** and use the actual names (grep the file). For anything
that does not exist, leave it out and list it in the report so the frontend can be reconciled.

All five child tables order ascending by `sort_order NULLS LAST, created_at` (or whatever ordering column the migration
defines). Each returns `[]` when the event has no rows.

## Rules

- Add columns to `EVENT_SELECT` and the categories select. Add five parallel `.from(...).select(...).eq('event_id', id)` reads
  via `Promise.all` with the organiser join; wrap each in try/catch so a single-table failure does not break the whole response
  (log the error, return `[]` for that section).
- Standard Nest conventions (CLAUDE.md §6): snake_case passthrough, `InternalServerErrorException` on Supabase errors,
  `NotFoundException` for a missing event with a UUID-regex guard.
- No change to `/events` list or any other endpoint.

## Acceptance criteria

- [ ] All added fields and all five new arrays returned (empty when no rows); nothing from migration 0003 selected.
- [ ] Spec covers: column-list pass-through, each new table empty-case, organiser social links, one child-table error
      falling back to `[]` without failing the whole response.
- [ ] `npm run build`, `npm test`, `npx eslint src/events` (no --fix) all pass; record results.
- [ ] Coordinator runs a live smoke call after merge; a live event's `/details` returns the full shape with new
      arrays as `[]` where no data has been seeded yet.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| npm run build | pass | `nest build` exit 0 (worktree `be-ga-050-details-v2-with-0026`, 2026-10-19) |
| npm test | pass | 2 suites, 30 tests passed (3 new GA-050 specs: 0026 column pass-through incl. organiser socials, child-row snake_case pass-through, per-section error isolation) |
| npx eslint src/events | pass | `npx eslint src/events` (no --fix): exit 0 |
| npx prettier --check | pass | `events.service.ts` and `events.service.spec.ts` both clean |
| column verification | pass | All 21 new event columns, all 11 new ticket-type columns, 6 organiser social columns and the 5 new child tables (`event_awards`, `event_checkpoints`, `event_resources`, `event_offers`, `event_itinerary_days`) grep-verified against `supabase/migrations/20261019000026_event_page_fields.sql` |
| live smoke | not run | Coordinator runs after merge |

## Handoff

[[07 Agent handoffs/GA-050-events-api]]
