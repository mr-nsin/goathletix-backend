---
type: handoff
status: ready-for-review
task: "[[04 Delivery/GA-019-multiday-date-cutover]]"
agent: main session
branch: unassigned
worktree: unassigned
commit: uncommitted
tags: [handoff]
---

# Handoff: GA-019 Multi-day date cutover

## Outcome

The live database was migrated to `start_date`/`end_date` (ADR-001) and the whole stack was brought
onto it. **The product now serves real data end to end for the first time** — `GET /events` returns
200 with all 10,100 rows, and `/locations/mumbai` renders live database events with correct dates.

## Changed paths

**Backend**
- `src/events/events.service.ts` — `EVENT_SELECT` now selects `start_date`/`end_date`; month/year and
  the new explicit range both go through `resolveDateWindow()` and apply **range overlap**
  (`start_date <= rangeEnd AND end_date >= rangeStart`); sort on `start_date`; added
  `logSupabaseError()` which walks the `cause` chain, and stopped returning raw Postgres messages to
  clients.
- `src/events/dto/get-events-query.dto.ts` — added `dateFrom`/`dateTo`, validated `YYYY-MM-DD`.
  Mandatory: `ValidationPipe({whitelist:true})` silently strips undeclared params.
- `src/seed.ts` — fixed the TS2322 deploy blocker (`organizerNames` was `unknown[]`); accepts
  `start_date` with an `event_date` fallback.
- `src/main.ts` — see the TLS finding below.
- `scripts/generate_10000_events.py`, `scripts/generate_1000_events.py` — emit `start_date`/`end_date`.
- `supabase/migrations/20260710000003_multiday_events.sql` — rewritten idempotent/transactional
  (previous version could not be re-run); adds `idx_events_start_end` and an
  `end_date >= start_date` CHECK.

**Frontend**
- `src/types/events.ts` — **the highest-risk fix.** `ApiEvent` had only camelCase `startDate`/`endDate`
  while the API returns **snake_case**, so `normalizeEvent` would have fallen through to the deleted
  `event_date` and rendered blank dates everywhere.
- `src/components/EventRow.tsx` — replaced `new Date(event.eventDate)` with string splitting (that
  re-parse reintroduced the timezone bug CLAUDE.md §7 forbids); date box now shows the month and, for
  multi-day events, an `→ end` line.
- `src/components/EventsDirectory.tsx` — sort by `localeCompare` on `YYYY-MM-DD` instead of `new Date`.
- `src/app/sports/[sport]/page.tsx`, `src/app/locations/[city]/page.tsx` — `await params` (Next 16);
  rendered the previously-dead `description`.

## Verification

| Command / check | Result |
| --- | --- |
| `npm run build --prefix goathletix-backend` | **pass** (was failing) |
| `npm run build --prefix goathletix-frontend` | **pass** |
| `npm run lint` both repos | **no new errors**; 0 in changed backend files; frontend 12 → 10 problems |
| `GET /events?limit=2` | 200, `total=10100`, dates populated |
| `GET /events?month=10&year=2026` | 200, `total=306` |
| `GET /events?dateFrom=2026-10-01&dateTo=2026-10-31` | 200, `total=306` — agrees, confirming overlap |
| Same range via direct Supabase REST | 306 — independent cross-check |
| `GET /events?dateFrom=oct-2026` | 400 |
| Frontend `/`, `/sports`, `/locations`, `/sports/running`, `/locations/mumbai` | **all 200** (last two were 500) |
| Live render | `/locations/mumbai` shows 4 real DB events with correct weekday/day/month |
| Multi-day range rendering | **not verified** — no multi-day rows exist |

## Decisions and risks

- **The root cause of the long-standing `/events` 500 was TLS, not a missing proxy.** A temporary
  bootstrap self-test surfaced `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`: the corporate proxy terminates
  TLS with a root CA that Windows trusts and Node does not (Node ships its own CA store). Fixed by
  passing `tls.getCACertificates('bundled'|'system')` into `ProxyAgent({ requestTls: { ca } })`.
  **Deliberately not `NODE_TLS_REJECT_UNAUTHORIZED=0`**, which would disable verification globally.
  Two earlier hypotheses were wrong and are recorded so nobody retries them: dotenv load *order* was
  not the issue, and supabase-js does honour undici's global dispatcher.
- **`curl -k` masked this for days.** Every earlier "the proxy works" result used `-k`. Without it,
  curl fails too. Do not use `-k` to prove connectivity.
- **dotenv path**: the dev server runs as `npm run start:dev --prefix goathletix-backend`, so its cwd
  is the workspace root, where no `.env` exists. `main.ts` now loads `__dirname/../.env` explicitly.
- **`.env` gained `HTTPS_PROXY`** (credential-free — the proxy accepts unauthenticated CONNECT).
  Appended without reading the file. `.env` remains gitignored.
- **Scope expanded** beyond the task note: the TLS/proxy fix and `await params` were pulled in because
  they blocked verification. Stated plainly rather than hidden.
- **Risk — multi-day untested.** The backfill set every `end_date = start_date`, so no row exercises
  the range path. Insert one multi-day row to verify before relying on it.
- **Risk — `event_requests`** was migrated but has zero rows and no code reads it yet.
- Secrets: none read, echoed, or written. `.env` was appended to, never read.

## Integration request

1. Open `http://localhost:3001/locations/mumbai` and confirm dates look right to a human eye.
2. Insert one multi-day event (`end_date > start_date`) and confirm it renders as a range **and**
   appears in both months it spans.
3. Branch as `codex/ga-019-multiday-date-cutover` before committing — both repos are on non-feature
   branches and nothing here is committed.
4. Next highest-value items, unchanged: wire the mega-search bar to the API (3 of 5 fields have no
   DTO field) and add the stale-data banner, since the silent fallback is still in place.
