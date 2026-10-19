---
id: GA-043
type: task
status: ready
priority: P0
owner: events-api
branch: codex/ga-043-event-details
worktree: D:\project\goathletix-wt\be-ga-043-event-details
scope: [goathletix-backend/src/events/**]
acceptance: []
depends_on: [GA-022]
related: [GA-044, ADR-007]
---

# GA-043 `GET /events/:id/details`: everything the event page needs, in one call

## Goal

The frontend is building a Luma-style event page (GA-044). It needs, for one public event: the event row, the organiser with
social links, the ticket types with their price tiers, the published photos and videos (including past editions), and the FAQ
and schedule if present. All of this already exists in the live database (migrations 0013, 0014, 0017, 0022, 0023 are applied);
the API does not expose it yet.

## Contract (the frontend codes against exactly this shape; snake_case like the rest of the API)

```
GET /events/:id/details  ->  200 { data: {
  event: <same columns as EVENT_SELECT, plus description, poster_url, social_share_image_url (if the column exists),
          ticketing_mode, max_tickets_per_order>,
  organizer: { id, name, logo_url, website_url, instagram_url, cover_url, page_url, is_verified } | null,
  ticket_types: [{
    id, label, discipline_slug, distance_km, age_categories, gender, start_time, cutoff_minutes,
    capacity, slots_taken, price_inr, is_sold_out, sort_order,
    tiers: [{ id, label, price_inr, valid_from, valid_until }],     // ordered by valid_from, nulls first
    current_tier_id: string | null                                 // the tier valid today (IST), else null
  }],                                                              // ordered by sort_order, then label
  media: [{ id, url, kind: "photo" | "video", caption, credit, edition_year, is_cover }],  // status = 'published' only, cover first, then newest edition
  faqs: [{ question, answer }],                                    // [] if the table or rows are absent
  schedule: [{ title, starts_at, ends_at, notes }]                 // [] if absent; use the real column names, map to these keys
} }
404 when the id is not a UUID, not found, or not public + published (same NotFoundException as findOne: do not leak existence).
```

Columns the contract names that do not exist in the live table: omit them (do not invent values) and list them in the report.
Read the migration files to learn real column names: `supabase/migrations/20261001000013_roles_organizers_profiles.sql`,
`...0014_event_details_pricing.sql`, `...0017_reviews_media.sql`, `...0022_ticketing_private_events.sql`, `...0023_event_setup.sql`,
`...20261005000025_feature_gaps.sql`.

## Scope and ownership

- Owned: `src/events/**` (controller route, service method, spec). Out of scope: schema, migrations, `app.module.ts`, `main.ts`,
  package files, the frontend, any write to the database.
- Route order: register `:id/details` so it does not collide with `:id`.

## Acceptance criteria

- [ ] Endpoint returns the contract; empty arrays (never null) for ticket_types, media, faqs, schedule when there is no data.
- [ ] Same public + published filter as GA-022 on the event; only `status = 'published'` media; hidden ticket types (if a hidden/is_hidden column exists) are excluded.
- [ ] `current_tier_id` computed against today's date in Asia/Kolkata.
- [ ] Unit tests for: 404 on non-public, ticket/tier shaping and ordering, current tier selection, media filtering, empty arrays.
- [ ] `npm run build`, `npm test`, `npx eslint src/events` (no --fix), `npx prettier --check src/events` pass; results recorded.
- [ ] One real read-only smoke call against the live API is NOT possible from the worktree (no server); say so. The coordinator runs it after merge.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| npm run build | pass (2026-10-17, worktree) | `nest build` exit 0 |
| npm test | pass | 2 suites, 23 tests (12 new for findDetails / pickCurrentTierId / todayInIst). The intermittent "worker failed to exit gracefully" jest warning also shows on the base commit, so it predates this change |
| eslint / prettier | pass | `npx eslint src/events --max-warnings=1000`: 0 problems. `npx prettier --check` passes on the 3 changed files. On the whole `src/events` it flags 2 untouched files (`events.module.ts`, `dto/get-events-query.dto.ts`) only because `core.autocrlf=true` checks them out with CRLF; their committed blobs pass |
| live smoke call | not run | Not possible from the worktree (no server). The coordinator runs it after merge |
| organizer.page_url | omitted | No such column on `organizers` (only `user_feedbacks.page_url` exists, 0013:312) |

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
