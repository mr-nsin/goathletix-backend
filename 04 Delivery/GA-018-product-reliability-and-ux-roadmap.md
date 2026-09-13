---
id: GA-018
type: task
status: ready
priority: P0
owner: unassigned
branch: unassigned
worktree: unassigned
scope: []
acceptance: []
depends_on: []
related: [GA-000, GA-002, GA-003, GA-005, GA-007, GA-008, GA-011, GA-012, GA-013, GA-014, GA-016, GA-017]
---

# GA-018 Product reliability and UX roadmap

Consolidated review of code, schema, product state, pending work and a competitor teardown
(indiarunning.com), carried out 2026-09-09 by five parallel agents. This is a **roadmap note**: split
it into child tasks before opening any branch.

## Method and confidence

| Workstream | Verified by |
| --- | --- |
| Backend/data reliability | reading `main.ts`, `app.module.ts`, `events/**`, `supabase.service.ts`, `prisma.service.ts`, `seed.ts`, all 5 migrations, `scripts/**`, both spec files |
| Frontend/UX | reading all 27 files under `goathletix-frontend/src` |
| Competitor | live browser inspection of indiarunning.com incl. computed styles |
| Pending inventory | `PROGRESS.md`, `04 Delivery/`, `07 Agent handoffs/`, `03 Decisions/`, `memory-bank/`, git state |
| Config hygiene | `package.json` vs installed versions, env surface, lint/build runs |

Claims below marked **[V]** were re-verified directly in this session. indiarunning findings are from
live inspection; its event pages live on `registrations.indiarunning.com`.

---

## The headline

**The product cannot currently serve real data, and the UI does not admit it.**

`GET /events` returns `500 TypeError: fetch failed` **[V]**, so `EventsDirectory` silently falls back
to `lib/fallbackEvents.json` with no banner (`EventsDirectory.tsx:89-101`). Everything a visitor sees
is stale synthetic seed data presented as if it were live. For a discovery product whose entire
promise is accurate listings, that is the single most important thing to fix — ahead of every feature
in this document.

Three independent causes, all confirmed:

1. `main.ts:6` reads `HTTPS_PROXY` from `process.env` at module-import time, before `ConfigModule`
   loads `.env` — so the proxy can never be configured from `.env`. Supabase REST over 443 only
   works through the corporate proxy here.
2. Raw Postgres **5432 is firewalled** on this network, so Prisma cannot connect at all. Anything
   Prisma-based (`seed.ts`, `prisma migrate`, the `chore/discovery-portal-and-env-samples` branch's
   Prisma rewrite of `EventsService`) is unusable from this machine.
3. `npm run build --prefix goathletix-backend` **fails** — `seed.ts:44` TS2322, `name: unknown` not
   assignable to `string` **[V]**. The backend cannot be built for deployment at all right now.
   (`nest start --watch` reports 0 errors, which masks this.)

---

## Phase 0 — Make it build and serve real data (blockers)

| # | Action | Effort | Notes |
| --- | --- | --- | --- |
| 0.1 | Fix `seed.ts:44` type error so the backend builds | S | Cast/validate `organizerData` name to `string`. Blocks all deployment |
| 0.2 | Get `HTTPS_PROXY` into the server process, or read it pre-bootstrap | S | Not fixable via `.env` as written; `.claude/launch.json` `env` key is ignored by the harness. The proxy needs no credentials |
| 0.3 | Add `GET /health` exercising the Supabase call | S | Would have surfaced this outage automatically |
| 0.4 | Fix `seed.ts` to write `event_date`, not `startDate`/`endDate` | M | Second, independent reason seeding is dead: those columns do not exist in the live table. `data-schema` barrier task |
| 0.5 | Surface a "showing cached data" banner on the fallback path | S | Trust fix; makes an outage visible instead of silent |
| 0.6 | `await params` in `sports/[sport]/page.tsx` and `locations/[city]/page.tsx` | S | Both routes currently 500 under Next 16 |

## Phase 1 — Make it reliable

| # | Action | Effort | Notes |
| --- | --- | --- | --- |
| 1.1 | Add `pg_trgm` GIN index for `event_name` (+ city/venue if search widens) | S/M | Search uses leading-wildcard `ilike('%q%')` (`events.service.ts:29`) with no supporting index — every search is a full scan of 10k+ rows |
| 1.2 | Fix the `city` filter's index usage (`events.service.ts:37`) | S | `ilike` without wildcards cannot use btree `idx_events_city`; normalise to `lower(city)` or a functional index |
| 1.3 | `@Max(100)` on `limit` in `GetEventsQueryDto:28-32` | S | Unbounded `limit` today |
| 1.4 | Rate limiting (`@nestjs/throttler`) + `Cache-Control` on `/events` | S/M | Matters precisely because 1.1 is expensive |
| 1.5 | Stop leaking raw Postgres error strings to clients | S | `events.service.ts:58-60, 88-90` pass `error.message` straight through |
| 1.6 | Pin CORS to known origins | S | `app.enableCors()` with no options (`main.ts:15`) — GA-006 |
| 1.7 | Write the `/events` specs | S/M | Only two starter spec files exist; zero coverage of `EventsModule`. GA-007 |
| 1.8 | Untrack `.DS_Store` | S | **Still tracked [V]** — GA-012 |

## Phase 2 — Make events findable

| # | Action | Effort | Notes |
| --- | --- | --- | --- |
| 2.1 | **Wire the mega-search to the API, or remove unsupported fields** | M | `page.tsx` admits it: *"the MegaSearchBar would trigger a router.push(...)"*. Competition, date-range and flexibility have **no backing DTO field** — 3 of 5 controls silently do nothing |
| 2.2 | Widen search beyond `event_name` to city / venue / organizer | S | Searching "Mumbai" misses everything unless it's in the event name |
| 2.3 | Add a **distance** filter + `/distance/[slug]` pages | S/M | `distanceOptions[]` already exists in schema *and* `EVENT_SELECT`. indiarunning's `/distance/{5k,10k,half-marathon,marathon,ultra-marathon}` is a major organic-traffic source |
| 2.4 | Encode filters in `searchParams` | M | Result sets are currently unshareable and uncrawlable |
| 2.5 | Add sort options | S | `.order('event_date')` is hardcoded (`events.service.ts:55`) |
| 2.6 | Add `slug` column + backfill, then `/events/[slug]` detail page | M | **No event detail page exists at all** — the largest product gap. `GET /events/:id` already exists and no UI consumes it. Without a slug, URLs would be SEO-dead UUIDs |
| 2.7 | Real aggregate counts endpoint | S | `CategoryGrid` tile counts are hardcoded strings |
| 2.8 | `sitemap.ts`, `robots.ts`, per-route `generateMetadata`, `SportsEvent` JSON-LD | S/M | Overlaps GA-016 |
| 2.9 | `/events/near` via a Postgres RPC over the existing GIST index | M | `geo_location` is fully modelled and indexed but absent from `EVENT_SELECT` — near-me is closer than it looks |

## Phase 3 — Make events presentable

Concrete, in priority order. Effort in brackets.

1. **[S] Fix `EventRow.tsx:12`** — `new Date(event.eventDate)` re-parses an already string-split ISO
   date, reintroducing the timezone bug the convention exists to prevent. Also `EventsDirectory.tsx:131`
   for sorting (use a lexicographic compare on `YYYY-MM-DD`; sorts identically, no `Date` needed).
2. **[S] Render the fields already in hand.** `normalizeEvent` produces `priceRange`, `difficulty`,
   `terrain`, `elevationGain` and `EventRow` renders **none** of them. Price and difficulty are the
   top decision fields after date and location. Add as pill badges near the distance row.
3. **[S] Registration-status / urgency copy** — "Registrations open", "Closing in N days" from the
   existing `status` enum, already returned by the API and unused. indiarunning does this on every card.
4. **[S] Surface `organizer.isVerified`** as a badge — already selected by `EVENT_SELECT`, unused in UI.
5. **[S] Keep city/venue visible at 375px** — `EventRow.tsx:64` is `hidden md:flex`, so location
   disappears exactly where casual mobile searching happens.
6. **[S] Render the computed `description`** on `locations/[city]/page.tsx:27` and
   `sports/[sport]/page.tsx:19` — dead code today, free unique content per page.
7. **[S] Make the event title a real link/button** — `EventRow.tsx:45` is an `<h3>` with
   `cursor-pointer` + `hover:underline` but no link: a fake affordance, not keyboard reachable.
8. **[S] Skeleton loader** matching row height (`min-h-[4.5rem]`) instead of a text swap.
9. **[S] Per-sport iconography** — `EventRow.tsx:23-27` is a 3-way colour ternary covering only
   running and cycling; triathlon/swimming/trekking all collapse to one dark bucket, and meaning is
   carried by colour alone.
10. **[S] `prefers-reduced-motion`** guards on `LiveTicker` (continuous `animate-ping`, 4s
    auto-rotate) and the CSS ticker keyframe in `globals.css`.
11. **[M] A card variant fed by `NormalizedEvent`.** `DiscoveryCard` is marketing-only; there is no
    card for real event data. Proposed anatomy, following indiarunning's measured 384×504 / 20px-radius
    card: sport-colour strip → date badge (day + month) → name (2-line clamp) → organizer + city/venue
    → distance chips → price + difficulty badges → registration CTA.
12. **[M] Route colours through `@theme` tokens.** Components hardcode `#141A3E`, `#2055DC`,
    `#181427`, `#DBDBE7`, `#737582`, `#F6F6F9` — several aren't tokens at all. Serialise this
    (`globals.css` is a serial resource).
13. **[M] `next/image` + a real image strategy.** No `next/image` anywhere; full-size 2070px Unsplash
    crops ship to every viewport. **`Event` has no image field at all** — only `Organizer.logoUrl`.
    Rich cards need a schema decision first.
14. **[M] Move listing off the client.** `EventsDirectory` is `"use client"` fetching in `useEffect`,
    so crawlers get an empty shell and users wait a round trip. No loading/error boundaries exist.

## Phase 4 — Make it sticky

`Profile`, `Follow`, `UserCalendar`, `Reminder` and `EventRequest` tables **already exist** with zero
UI consuming them. This is the cheapest conversion of existing backend investment into visible value.

| # | Action | Effort |
| --- | --- | --- |
| 4.1 | Save/Follow event + "my calendar" UI over the existing tables | M |
| 4.2 | Port the Sprint-3 auth + activity slice out of the stale tree (GA-005) — 9 files, fixing the `super-secret-fallback` JWT default and `origin:'*'` gateway CORS on the way | M |
| 4.3 | Reminders / "closing soon" notifications | L |
| 4.4 | Reviews + ratings | L — needs new tables and moderation. indiarunning has 1–5 stars plus Communication / Engagement / Hospitality / Safety sub-scores, likes and reports |
| 4.5 | Organizer self-serve submission over `EventRequest` | M |

---

## Competitor position (indiarunning.com)

**Where GoAthletix is behind:** no event detail page; no reviews; no price, distance or
virtual/on-ground filters; search scoped to one column; no distance landing pages; no urgency copy;
no aggregate counts; no saved-events UI.

**Where GoAthletix is ahead:** a calendar/month view (indiarunning has none), a Tailwind v4
`@theme` token architecture, and a materially more polished search bar — once it actually searches.

**Not a gap:** indiarunning's "detail page" is its checkout on a separate subdomain and every card
links straight out. GoAthletix's outbound `registrationUrl` is the same pattern, so **no payment or
checkout work is required** to be competitive.

**Data GoAthletix cannot supply today:** numeric price (only a `priceRange` string, so no ₹ buckets),
review/rating data (no tables), a registration-close date distinct from the event date, per-distance
ticket tiers and inclusions, organizer bio, and event banner images.

---

## Corrections to existing documentation

- **Brand palette.** `CLAUDE.md` §7 says orange `#f97316` / violet `#8b5cf6`. That is true on `main`,
  but the live branch `chore/sync-from-monorepo` defines `--color-primary: #2C3D8F` (indigo) and
  `--color-accent: #37DAC3` (cyan) **[V]**. Any advice to "use the project's orange token" is wrong on
  this branch. `MegaSearchBar.tsx` currently uses Airbnb red `#FF385C` via a single `ACCENT` constant.
  **Needs a decision + ADR.**
- **GA-017's note is stale.** Its `scope:` names `SearchBar.tsx`, but the work on this branch was done
  in `MegaSearchBar.tsx`; and its "brand uses the project's orange token" criterion does not reflect
  reality. Corrected in that note.
- **`03 Decisions/` is empty** despite several decisions already taken (GA-002 resolution,
  Supabase-vs-Prisma data path, brand palette, database sharing). This is the process gap most likely
  to cause re-litigation.
- `crawler.py` imports `urllib`/`re` and never calls them; its "extraction" is ~15 hardcoded events
  written to a hardcoded macOS path that does not exist on this machine. GA-009 is a rewrite, not a fix.
- The frontend build fetches Google Fonts **at build time**, so it fails whenever the corporate filter
  blocks `fonts.googleapis.com`. It passed here on a cleared cache **[V]**, but this makes builds
  network-dependent and non-reproducible offline — worth self-hosting the fonts.

## Decisions needing an ADR before work starts

1. `event_date` vs applying migration 0003 — the live table has only `event_date`; `schema.prisma` is
   ahead of the database. Apply + backfill, or revert the schema? Everything date-related waits on this.
2. Brand palette: indigo/cyan (this branch), orange/violet (`main`), or Airbnb red (search bar).
3. Whether to keep sharing a database with the unrelated trading-app models (GA-010).
4. Whether to adopt the `chore/discovery-portal-and-env-samples` Prisma rewrite — as written it cannot
   work (5432 firewalled *and* it queries a non-existent `startDate`).
5. Event images: add a media field/CDN, or stay text-first? Gates the card redesign.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Backend build | **fail** | `seed.ts:44` TS2322, `name: unknown` |
| Frontend build | pass | clean build after `rm -rf .next` |
| Frontend lint | 1 error, 12 warnings | error is pre-existing in `useSocket.ts:12` |
| Backend lint | 51 errors, 6 warnings | 47 in `seed.ts` (unsafe `any`) |
| `GET /events` | **500** | `TypeError: fetch failed` |
| `.DS_Store` tracked | **yes** | `git ls-files` |
| Dependencies | all match declared ranges | incl. `lucide-react` 1.24.0 as declared |
