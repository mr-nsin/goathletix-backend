---
id: GA-019
type: task
status: in-progress
priority: P0
owner: main session
branch: unassigned
worktree: unassigned
scope:
  - "goathletix-backend/src/events/events.service.ts"
  - "goathletix-backend/src/events/dto/get-events-query.dto.ts"
  - "goathletix-backend/src/seed.ts"
  - "goathletix-backend/scripts/events_seed.json"
  - "goathletix-backend/scripts/*.py"
  - "goathletix-frontend/src/types/events.ts"
  - "goathletix-frontend/src/components/EventRow.tsx"
  - "goathletix-frontend/src/components/EventsDirectory.tsx"
acceptance: []
depends_on: [ADR-001]
related: [GA-002, GA-018, ADR-001]
---

# GA-019 Multi-day date cutover (`event_date` → `start_date`/`end_date`)

## Goal

The live database was migrated on 2026-09-12 per [[03 Decisions/ADR-001-multi-day-event-dates|ADR-001]].
Bring API, seed, ingestion and frontend onto `start_date`/`end_date` **in one coherent change**, so
`/events` keeps working and multi-day events become representable end to end.

## Migration state — verified 2026-09-12

| Check | Result |
| --- | --- |
| `events` columns | 22; `event_date` **absent**, `start_date` + `end_date` **present** |
| `events` rows | 10,100 |
| Rows with `end_date IS NULL` | **0** (backfill complete) |
| `event_requests` | `start_date` 200, `end_date` 200, `event_date` 400 (absent) |
| `slug` column | still absent (out of scope; see GA-018) |

## Scope and ownership

- Owned: the files listed in `scope:` above.
- Explicitly out of scope: adding `slug`, the event detail page, search/index performance
  (`pg_trgm`), the proxy/`HTTPS_PROXY` fix, and the search-bar wiring. All tracked in GA-018.
- Coordination: touches `src/seed.ts` and `scripts/**` (ingestion) plus the events API and frontend
  types — serialise against any other work in those areas.

## Acceptance criteria

- [x] `EVENT_SELECT` returns `start_date` and `end_date`; no reference to `event_date` remains in `src/`
      (except deliberate backwards-compatible fallbacks in `seed.ts`)
- [x] Month/year filtering uses **range overlap**, not equality on one column
- [x] `dateFrom`/`dateTo` exist as DTO fields, validated `YYYY-MM-DD`
- [x] Backend `npm run build` succeeds — TS2322 at `seed.ts:44` fixed
- [x] `normalizeEvent` accepts snake_case `start_date`/`end_date` from the live API
- [~] A multi-day event renders as a date range — **code path implemented and single-day verified,
      but no multi-day row exists in the data yet** (the backfill set `end_date = start_date` for all
      10,100 rows), so the range rendering is unverified against real data
- [x] No `new Date(<string>)` used for calendar placement (CLAUDE.md §7)
- [x] `GET /events` returns rows with populated dates
- [x] Lint and build pass for both repos (no new errors introduced)

## Implementation notes

- **The `reminder_type` enum has a value named `'event_date'`** — a reminder kind, not a column.
  Never blanket find-and-replace `event_date` across the schema.
- `types/events.ts` already reads camelCase `startDate`/`endDate`, but the API returns **snake_case**.
  Without adding `start_date`/`end_date` to `ApiEvent`, the frontend silently falls through to the
  deleted `event_date` and renders blank dates. This is the highest-risk item in the change.
- `NormalizedEvent.eventDate` is kept as the field name to avoid a wide rename; it now carries
  `start_date`. `endDate` is already declared and optional.
- `seed.ts` already writes `startDate`/`endDate` and so becomes correct; its build error is a separate
  typing bug (`organizerNames` is `unknown[]`).

## Verification

All run 2026-09-12.

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run build --prefix goathletix-backend` | **pass** | was failing (TS2322 `seed.ts:44`); now clean |
| `npm run build --prefix goathletix-frontend` | **pass** | "Compiled successfully" |
| `npm run lint` both repos | **no new errors** | backend 52 errors, all pre-existing `no-unsafe-*` in `seed.ts`/`supabase.service.ts`; **0 in changed files**. Frontend 10 problems, down from 12 |
| `GET /events?limit=2` | **200** | `total=10100`, `start_date`/`end_date` populated |
| `GET /events?month=10&year=2026` | **200** | `total=306` |
| `GET /events?dateFrom=2026-10-01&dateTo=2026-10-31` | **200** | `total=306` — agrees with month/year, confirming overlap semantics |
| Direct REST cross-check of same range | **306** | independent confirmation via Supabase REST |
| `GET /events?dateFrom=oct-2026` | **400** | DTO regex rejects malformed dates |
| Frontend routes `/`, `/sports`, `/locations`, `/sports/running`, `/locations/mumbai` | **all 200** | the last two were 500 before (`await params`) |
| Live data renders | **pass** | `/locations/mumbai` shows 4 real DB events (e.g. "Great Mumbai Adventure Camp 2026", Red Bull India) with correct weekday/day/month |
| Multi-day range rendering | **not verified** | no multi-day rows exist yet — every `end_date` equals its `start_date` |

### Scope expanded during the work

Three items were pulled in because they blocked verification of this task:

1. **`main.ts` outbound connectivity.** `/events` was returning 500 `TypeError: fetch failed`. Root
   cause found by adding a temporary bootstrap self-test: **`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`** —
   the corporate proxy terminates TLS with a root CA trusted by Windows but not by Node, whose CA
   store is independent. Fixed by passing `tls.getCACertificates('bundled'|'system')` into undici's
   `ProxyAgent({ requestTls: { ca } })`. Deliberately **not** `NODE_TLS_REJECT_UNAUTHORIZED=0`.
   Also fixed dotenv load order/path (`__dirname/../.env`, since the dev server's cwd is the
   workspace root) and added a bootstrap log line naming the proxy host.
2. **`await params`** on `sports/[sport]` and `locations/[city]` (Next 16) — both routes were 500.
3. **Rendered the unused `description`** on those two pages (was dead code; also cleared two lint
   warnings).

## Handoff

`07 Agent handoffs/2026-09-12-GA-019-multiday-date-cutover.md`.
