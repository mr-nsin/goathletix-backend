# Active Context: GoAthletix

**Last reconciled: 2026-09-09.** This file is the session entry point — read it first, before reading
code. It is deliberately short. Keep it that way: it is loaded every session, so every line costs
context. Detail belongs in the linked notes, not here.

## Read order and authority

When two sources disagree, the higher one wins and the lower one gets corrected.

1. **The code** — always ground truth.
2. `04 Delivery/Issue register.md` — all 44 open issues (6 blockers), frontend and backend.
3. `04 Delivery/GA-018-product-reliability-and-ux-roadmap.md` — verified findings + phased plan.
4. `01 Product/Feature status and gaps.md` — PRD vs reality. `01 Product/UI-UX improvement plan.md` — design specs.
5. `04 Delivery/Task board.md` + `GA-###` notes — what is in flight and who owns it.
6. `PROGRESS.md` (workspace root) — cross-repo rollup.
7. This file + `progress.md` — narrative.

**Do NOT trust** `techContext.md` or `projectbrief.md`. They describe FastAPI services, an OpenRouter
LLM pipeline, Algolia, Mem0 and an agent fleet. **None of that exists.** They are marked at the top.

## Where the product actually stands

**The product now serves real data end to end** (GA-019, 2026-09-12). `GET /events` returns 200 with
all 10,100 rows; `/locations/mumbai` renders live database events with correct dates.

Fixed in GA-019:
- Backend **builds** (the `seed.ts:44` TS2322 deploy blocker is gone).
- `GET /events` **works**. The long-standing 500 was **not** the proxy being absent — it was
  **`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`**: the corporate proxy terminates TLS with a root CA that
  Windows trusts but Node does not. `main.ts` now feeds `tls.getCACertificates('bundled'|'system')`
  into undici's `ProxyAgent({ requestTls: { ca } })`, and loads `.env` from `__dirname/../.env`
  (the dev server's cwd is the workspace root, so plain `dotenv/config` looked in the wrong place).
- `/sports/[sport]` and `/locations/[city]` return 200 (`await params`).
- Date cutover complete: API, DTO, seed, generators and frontend all on `start_date`/`end_date`
  with range-overlap filtering, plus new `dateFrom`/`dateTo` query params.

Still open:
- The mega-search bar is **not wired to the API**; 3 of its 5 fields have no backing DTO field.
- `EventsDirectory.tsx:89-101` still falls back to `fallbackEvents.json` **silently** — no banner.
- Of the **13 P0 features** in `docs/05-feature-inventory.md`: **0 built, 6 partial, 7 not built.**
  Buddy Sync and the Live Activity Feed have zero implementation.
- No multi-day rows exist yet (backfill set every `end_date = start_date`), so the multi-day
  rendering path is implemented but unverified against real data.

## Established facts — do not re-investigate these

- **GA-002 is resolved.** The live `events` table has `event_date` and **no** `start_date`/`end_date`
  and **no** `slug` (21 columns). Migration 0003 was never applied, so `schema.prisma` is *ahead of*
  the database and `events.service.ts` is correct. Anything querying `startDate` fails in production.
  This also breaks `seed.ts` independently of the build error.
- **Network:** raw Postgres **5432 is firewalled** here, so Prisma cannot connect at all. Supabase REST
  over 443 works **only** through the corporate proxy (host in `~/.npmrc`; accepts unauthenticated
  CONNECT). `main.ts:6` reads `HTTPS_PROXY` at module load, *before* `ConfigModule` loads `.env`, so
  the proxy can never be configured from `.env`. Many external sites are blocked by Forcepoint.
- **Browser pane does not composite frames** — `requestAnimationFrame` never fires. CSS transitions and
  framer-motion freeze at their start values, exited elements linger at `opacity: 0`, and
  `getComputedStyle` returns pre-transition values. Never diagnose an animation bug from that; verify
  layout/ARIA/DOM instead and ask a human to eyeball motion.
- **Three palettes coexist.** `chore/sync-from-monorepo` (live frontend) is indigo `#2C3D8F` / cyan
  `#37DAC3`. `main` is orange `#f97316` / violet. `MegaSearchBar.tsx` uses Airbnb red `#FF385C`.
  **`CLAUDE.md` §7's orange claim is stale for the live branch.** Needs an ADR.
- **Six tables are fully modelled with RLS and have zero consuming UI:** `Profile`, `Follow`,
  `UserCalendar`, `Reminder`, `EventRequest`, `UserFeedback`. Cheapest route to visible value.
- **9 files in the stale tree** `goathletix-backend/backend/src/` are an unported Sprint-3 slice
  (activity gateway, auth JWT strategy/guard/decorator, events gateway). GA-005 is port-and-harden,
  not build. Fix the `super-secret-fallback` JWT default and `origin:'*'` CORS on the way out.
- `crawler.py` never calls the `urllib`/`re` it imports; its "extraction" is ~15 hardcoded events
  written to a hardcoded macOS path. GA-009 is a rewrite.
- `.DS_Store` is still tracked in `goathletix-backend` (GA-012 open).

## Branch state

- **Both repos are on `codex/ga-019-multiday-date-cutover`, pushed, working trees clean**
  (backend `7f0e34e`, frontend `69c31e1`, 2026-09-15). Nothing is uncommitted.
- `goathletix-frontend/main` is 4 weeks stale and `chore/sync-from-monorepo` has **no merge base**
  with it, so it cannot be merged conventionally. GA-019 branched from the sync branch, so it
  inherits that problem — decide the reconciliation before opening a PR.

## Product scope — broadened 2026-09-16

GoAthletix is now an **athletics-first, multi-sport, multi-age** platform, not an endurance
aggregator. Target: any place, any age group, kids through masters. Team sports (cricket, hockey)
come **last** and are a different record type, not a later phase of the same one.

- `docs/21-platform-expansion-vision.md` (new): five sequenced pillars —
  Discover -> Host -> Community+WhatsApp CRM -> Marketplace -> Services. Discovery stays the wedge.
- `docs/17-sports-taxonomy.md`: +6 categories (athletics, skating, gymnastics, martial arts,
  team sports, mind sports), an age-group axis, and a training-centers entity.
- `docs/03-target-users.md`: new segments — Parents/Guardians (10-20M households), Academies,
  Schools/Federations.
- **These four docs were edited in `goathletix-frontend/docs/` first and have now been synced here.**
  The vault copy under `goathletix-backend/docs/` is the authoritative one (CLAUDE.md section 0).
  If they diverge again, the frontend copy is the fork, not the source.

**Blocking fact: athletics is not in the database.** `sport_category` has 8 values and
`athletics` is not among them — `running` is road running. The product's stated primary focus
cannot be stored, filtered or displayed until migration 0005 is applied.

**Homepage model (settled):** the main page is an *eligibility feed*, not a catalogue and not a
fixture list — "events I can enter, near me, soon, for my age group." Three axes: WHERE / WHEN /
WHO. Sport is a secondary filter, never the entry point. WHO does not exist yet (0006).

## Decisions — see `03 Decisions/Decision log.md`

- **ADR-001 DONE.** Migration applied to the live database 2026-09-12 and verified: `events` has 22
  columns, `event_date` gone, `start_date` + `end_date` present, **0 null end_dates** across 10,100
  rows; `event_requests` migrated too. Code cutover shipped as GA-019. Beware: `reminder_type` has an
  enum *value* `'event_date'` — never blanket find-and-replace.
- **Network, corrected:** the blocker was never just the proxy. Postgres 5432 is still firewalled
  (so Prisma and `seed.ts` still cannot run here), but HTTPS through the proxy additionally fails
  Node's TLS validation with `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` unless the OS trust store is passed
  in explicitly. `curl -k` masks this — never use `-k` to "prove" connectivity works.
- **ADR-003 accepted:** there is **no shared database.** Verified — the trading tables (`order`,
  `brokercredential`, `virtualtrade`, …) return 404 on the live project while `events`/`organizers`
  return 200, and they declare no `@@schema`. They are phantom models left by a `db pull` against a
  different database. Remove them from `schema.prisma`. **GA-010 is closed as a false premise.**
  This removal is a prerequisite for any Prisma-managed migration.
- **ADR-004 accepted:** stay on Supabase REST. `chore/discovery-portal-and-env-samples` is **parked,
  not pending** — its Prisma rewrite cannot work (5432 blocked *and* it queries a non-existent
  `startDate`). Cherry-pick its `sample.env` files only, correcting the port to 3000.
- **ADR-002 proposed:** brand palette — indigo `#2C3D8F` (this branch), orange (`main`), or Airbnb red
  (`MegaSearchBar`). Isolated to an `ACCENT` constant, so the swap is two lines; the real work is
  routing hardcoded hex through `@theme`.
- **ADR-005 proposed:** event imagery. `Event` has **no image field** (only `Organizer.logoUrl`).
  Recommendation: sport-coded gradient placeholders now, `hero_image_url` when ingestion can populate
  it. Gates the homepage rails and the card redesign.

Homepage composition (requested 2026-09-09) is specced in
`01 Product/UI-UX improvement plan.md` §9 — lead with a real-events rail below the search bar, and
avoid the word "best" until there is a signal behind it.

## Next steps

**Phase 0 of GA-018 is done** — `seed.ts:44` typed so the backend builds; the proxy reaches the
server *and* its TLS is fixed via `tls.getCACertificates` into `ProxyAgent({requestTls:{ca}})`;
`seed.ts` cut over to `start_date`/`end_date`; `await params` applied to `/sports/[sport]` and
`/locations/[city]`. Still open from that phase: `GET /health`, and the "showing cached data" banner.

Shipped in GA-019 beyond the date cutover: multi-select cities **and** states (24 states / 53 cities
generated into `goathletix-frontend/src/lib/locations.ts`), the 17 Townscript disciplines mapped onto
the 8 backend primaries (`src/lib/sportTaxonomy.ts`, with 9 unmappable entries recorded), widened +
sanitised `search`, and the search-bar clipping/alignment fixes.

Migrations 0005/0006/0007 are written and **awaiting manual application** in the Supabase SQL
editor (5432 is firewalled; PostgREST has no DDL surface, and there is no exec-SQL RPC — checked).
**Run 0005 on its own first**: Postgres rejects using a new enum value in the transaction that adds
it, which is why it is a separate file.

`schema.prisma` has deliberately **not** been mirrored yet, departing from CLAUDE.md section 5. The
rule exists to keep schema and database in step; mirroring before application would make Prisma
declare tables that do not exist — the exact phantom-model drift ADR-003 and ADR-001 documented.
Mirror it in the same change that confirms the SQL ran, then `prisma generate` so
`@IsEnum(SportCategory)` accepts the new values (until then the API 400s on `sport=athletics`).

Next, in order:
1. Decide how GA-019 lands — the no-merge-base problem above blocks the PR.
2. Organiser search. PostgREST **cannot** reference an embedded column inside `or()` (PGRST100), so
   this needs a denormalized `organizer_name` column or an RPC. "Competition" has no backing column
   at all, and the PRD's `tags` column was never built — all three are schema work.
3. Log the five ADRs; ADR-002 (palette) and ADR-005 (imagery) gate the homepage rails.

Unverified, not broken: multi-day rendering (every row currently has `end_date == start_date`, so
the → end affordance has never been exercised) and the search-bar animations (the Browser pane does
not composite frames).

## Update obligation

Whoever finishes a unit of work updates this file **in the same change** — the blocking facts, branch
state, established facts, and next steps. Correct anything that has become false rather than appending;
this file must stay short enough to read every session. Append historical narrative to `progress.md`
instead.
