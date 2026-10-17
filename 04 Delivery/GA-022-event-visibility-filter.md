---
id: GA-022
type: task
status: done
priority: P0
owner: events-api
branch: codex/ga-022-event-visibility-filter
worktree: D:\project\goathletix-wt\be-ga-022-event-visibility-filter
scope: [goathletix-backend/src/events/**]
acceptance: []
depends_on: []
related: [GA-018, ADR-007]
---

# GA-022 Public-only filter on `/events`

## Goal

Migration 0022 (applied 2026-10-06) added `events.visibility` (`public` | `unlisted` | `private`) and
`events.publication_status` (`draft` | `published` | `archived`). The backend uses the **service-role key,
which bypasses RLS**, so nothing stops `GET /events` and `GET /events/:id` from returning private or draft
events. ADR-007 requires the backend filter to ship with 0022. Add it.

## Scope and ownership

- Owned files: `src/events/**` (service, controller, DTOs, `events.service.spec.ts`).
- Explicitly out of scope: `prisma/schema.prisma`, `supabase/migrations/**` (serial resources, barrier),
  `src/app.module.ts`, `src/main.ts`, auth/organiser access to their own private events (no auth exists
  yet), the frontend, `scripts/**`.
- Coordination: none in batch 1.

## Acceptance criteria

- [ ] The list query applies `visibility = 'public'` and `publication_status = 'published'` to **both**
      the data query and the `{ count: 'exact' }` total, so `meta.total` matches the rows.
- [ ] `GET /events/:id` returns 404 for an event that is not public + published (same `NotFoundException`
      as a missing row; do not leak that it exists).
- [ ] Any other query in `events.service.ts` that reads events (counts, near, trending, taxonomy helpers)
      is checked and either filtered the same way or noted in the handoff with a reason.
- [ ] Unit tests in `events.service.spec.ts` cover: filter applied to the list, to the count, and to
      detail-by-id; existing tests still pass.
- [ ] `npm run build`, `npm run lint` (do not let `eslint --fix` rewrite unrelated files: check
      `git status` after) and `npm test` pass, results recorded.

## Implementation notes

Rows stay snake_case; keep `EVENT_SELECT` as is. `whitelist: true` strips undeclared query params, so do
not add a query param for this; it is not user-controllable. Never read or print `.env`.
The database is live and shared: write **no** data and run **no** write against it.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| npm run build | pass | `nest build` exit clean, worktree commit on codex/ga-022-event-visibility-filter |
| npm test | pass | 2 suites, 10 tests passed (4 new); jest warned of a worker not exiting gracefully (pre-existing) |
| npm run lint | pass (substitute) | `npm run lint` not run (it runs --fix over everything); `npx eslint src/events --max-warnings=1000` no output; `prettier --check` clean for the two edited files, warns on 3 untouched files (CRLF, pre-existing) |

## Outcome

merged 2026-10-16; live /events total still 10,100 (all rows public + published); not yet checked against a private row.

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
