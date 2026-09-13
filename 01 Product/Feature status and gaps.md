---
type: reference
status: active
tags: [product, features, gaps]
---

# Feature status and gaps

GoAthletix's declared MVP is a login-free discovery product covering search, filtering, city/sport
landing pages, an event detail page, and WhatsApp-native sharing — but the backend cannot currently
build or serve real data, so none of that is verifiable end-to-end today. Of the 11 declared P0 MVP
features, roughly a third are absent outright (event detail page, WhatsApp share, working search),
and several tables built for later phases (`Profile`, `Follow`, `UserCalendar`, `Reminder`,
`EventRequest`) sit unused behind zero UI. The single highest-leverage fix is not a new feature — it's
making `GET /events` return real data and admitting to the user when it can't.

## How to read this

Findings below come from two sources only: `04 Delivery/GA-018-product-reliability-and-ux-roadmap.md`
(2026-09-09, already-verified code/schema/build state — treated as established fact and not
re-investigated here) and a cross-reference against the product requirement docs
(`docs/05-feature-inventory.md`, `docs/06-mvp-definition.md`, `docs/10-sprint-roadmap.md`,
`docs/23-competitor-gaps-features.md`, plus the product-summary/target-user/principles/metrics docs
and `memory-bank/`). Where a claim could not be checked against code in this pass, it is marked "not
verified." Compiled 2026-09-09.

## 1. Currently broken

| Feature | Symptom a user would notice | Root cause (file:line) | Severity | Effort |
| --- | --- | --- | --- | --- |
| Live event data | Site shows stale synthetic events with no indication they're fake | `EventsDirectory.tsx:89-101` falls back to `lib/fallbackEvents.json` silently on API failure | Blocker | S (banner) / M (root fix) |
| `GET /events` | Any real API call returns an error | `TypeError: fetch failed` — `HTTPS_PROXY` read at `main.ts:6` before `ConfigModule` loads `.env`, so the corporate proxy is never applied to Supabase's native `fetch` (GA-018 §Phase 0) | Blocker | S |
| Backend deploy/build | Cannot ship any backend change | `npm run build` fails — `seed.ts:44` TS2322 (`name: unknown` not assignable to `string`); `nest start --watch` masks it with 0 errors | Blocker | S |
| Seed pipeline | `npm run db:seed` cannot populate real events | `seed.ts` writes `startDate`/`endDate`; the live table has only `event_date` (GA-018 §Phase 0.4) | Blocker | M |
| `/sports/[sport]` | Page 500s | Next 16 requires `await params`, route destructures synchronously | Blocker | S |
| `/locations/[city]` | Page 500s | Same `await params` issue | Blocker | S |
| Mega-search bar | Competition field, date range, flexibility silently do nothing; nothing is wired to the API at all | `page.tsx:21` — "the MegaSearchBar would trigger a `router.push(...)`" is aspirational, never implemented; `GetEventsQueryDto` (`src/events/dto/get-events-query.dto.ts:1-43`) has no field for competition/date-range/flexibility | Major | M |
| Text search | Searching "Mumbai" or an organizer name returns nothing unless the term is literally in the event name | `events.service.ts:32-33` — `ilike` scoped to `event_name` only | Major | S |
| Search performance | Search gets slower as the catalog grows past a few thousand rows | `events.service.ts:29` leading-wildcard `ilike('%q%')` with no `pg_trgm` index (GA-018 §1.1) | Major | S/M |
| City filter | Filtering by city can silently skip the index and scan the table | `events.service.ts:37` uses `ilike` without wildcards, which can't use the btree `idx_events_city` | Major | S |
| No event detail page | Clicking an event goes nowhere; there is no `/events/[slug]` or `/events/[id]` route | `GET /events/:id` exists (`events.controller.ts:14-17`) but no frontend route consumes it | Blocker | M |
| Unbounded page size | A caller can request the entire table in one response | No `@Max()` on `limit` in `GetEventsQueryDto:28-32` | Major | S |
| Error messages leak internals | A failed query shows a raw Postgres error string to the browser | `events.service.ts:58-60,88-90` pass `error.message` straight through | Minor | S |
| Open CORS | Any origin can call the API | `app.enableCors()` with no options, `main.ts:15` | Major | S |
| Hardcoded API host | Broken outside local dev | Hardcoded `http://localhost:3000` at `page.tsx:280` (per GA-018) | Minor | S |
| Tracked OS cruft | Repo hygiene / diff noise | `.DS_Store` still tracked (GA-018 §1.8, GA-012) | Minor | S |
| Sitewide branding placeholder | Browser tab still says "Create Next App" | `layout.tsx` `title` field (GA-018) | Minor | S |
| Backend README | Confuses new contributors | Unedited NestJS starter `README.md` (GA-018) | Minor | S |
| No test coverage on `/events` | Regressions ship silent | Only two starter spec files exist; zero coverage for `EventsModule` (GA-018 §1.7) | Major | S/M |

## 2. Declared in requirements but not built

Cross-referenced against every numbered feature in `docs/05-feature-inventory.md` §P0/P1/P2/P3 and the
MVP scope table in `docs/06-mvp-definition.md`.

| # | Feature | Declared where | MVP scope? | Built? | Evidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Event Listing Pages | 05-feature-inventory §P0#1 | Yes | Partial | `EventsDirectory.tsx` renders a list, but backed by fallback JSON, not live data (see §1 above) |
| 2 | Event Data Model | 05-feature-inventory §P0#2 | Yes | Partial | `schema.prisma` models exist (`Event`, `Organizer`, line 108/95) but disagree with the live table (`event_date` vs `start_date`/`end_date` — GA-018 §9 in CLAUDE.md, "Known contract drift") |
| 3 | Search & Filter (sport, city, date, distance) | 05-feature-inventory §P0#3; 06-mvp-definition scope table | Yes | Partial | `GetEventsQueryDto` supports `search, sport, city, difficulty, month, year` only — no distance filter, no date-range, city search is a broken index path |
| 4 | City Landing Pages | 05-feature-inventory §P0#4 | Yes | Partial | `/locations/[city]/page.tsx` exists but 500s (Next 16 `await params`); its computed `description` is dead code (GA-018 Phase 3 #6) |
| 5 | Sport Landing Pages | 05-feature-inventory §P0#5 | Yes | Partial | `/sports/[sport]/page.tsx` exists, same 500 bug |
| 6 | Event Detail Page | 05-feature-inventory §P0#6; 06-mvp-definition scope table, Pages/Screens table | Yes | No | No implementation found — no `/events/[slug]` or `/events/[id]` route in `goathletix-frontend/src/app` |
| 7 | External Registration Redirect | 05-feature-inventory §P0#7 | Yes | No | Depends on #6; `registration_url` is selected by `EVENT_SELECT` (`events.service.ts:10`) but no UI renders/links it |
| 8 | Mobile-Responsive Web | 05-feature-inventory §P0#8 | Yes | Partial | Mobile-first patterns exist (GA-018 Phase 3 notes `EventRow.tsx:64` hides city/venue at 375px — a regression, not absence) |
| 9 | Manual Event Ingestion (admin tool) | 05-feature-inventory §P0#9 | Yes | No | No admin panel found; ingestion is `scripts/*.py` generators and `seed.ts`, both broken (see §1) |
| 10 | Basic SEO (meta/OG/structured data) | 05-feature-inventory §P0#10 | Yes | No | No `sitemap.ts`, `robots.ts`, `generateMetadata`, or JSON-LD found (GA-018 §2.8) |
| 11 | WhatsApp Share Cards | 05-feature-inventory §P0#11; MVP Flow 3 | Yes | No | No share button or `wa.me` deep link found in `goathletix-frontend/src` |
| 49 | Buddy Sync | 05-feature-inventory §P0#49; 06-mvp-definition Sprint 3, Flow 5, `/dashboard/buddies` | Yes (P0 in inventory, Sprint 3 in MVP doc) | No | No sync token, `/dashboard/buddies` route, or calendar-comparison code found anywhere in either repo |
| 50 | Live Activity Feed (WebSockets) | 05-feature-inventory §P0#50; 06-mvp-definition Sprint 2 | Yes | No | `@nestjs/websockets`/`platform-socket.io` installed but unused in the live tree (CLAUDE.md §2); the only gateway implementation lives in the stale `goathletix-backend/backend/src/` tree (GA-018, "9 files... unported Sprint-3 slice"); `LiveTicker.tsx` in the live frontend is a CSS animation, not a WebSocket consumer |
| 12 | User Accounts (Email/Google/Phone) | 05-feature-inventory §P1#12 | No (P1) | No | Stale-tree-only JWT strategy/guard; live tree has no auth module |
| 13 | Save/Bookmark Events | 05-feature-inventory §P1#13 | No | No | `Follow` table exists (`schema.prisma:157`) with zero consuming UI |
| 14 | Personal Event Calendar | 05-feature-inventory §P1#14 | No (but P0-scheduled in MVP doc Sprint 3) | No | `UserCalendar` table exists (`schema.prisma:173`) with zero consuming UI |
| 15 | Registration Reminders | 05-feature-inventory §P1#15 | No (Sprint 3 in MVP doc) | No | `Reminder` table exists (`schema.prisma:185`), `ReminderType` enum (line 281), zero consuming UI or scheduler code |
| 16 | Organizer Accounts & Dashboard | 05-feature-inventory §P1#16 | No | No | No organizer-facing routes or auth found |
| 17 | Event Submission Form | 05-feature-inventory §P1#17; 06-mvp-definition Sprint 4, `/add-event` | No (P1 in inventory; Sprint 4 in MVP doc) | No | `EventRequest` table exists (`schema.prisma:199`, `RequestStatus` enum line 289) with RLS support per CLAUDE.md §5, but no `/add-event` form or endpoint found |
| 18 | Organizer Profile Pages | 05-feature-inventory §P1#18 | No | No | No implementation found |
| 19 | Event Reviews & Ratings | 05-feature-inventory §P1#19 | No | No | No reviews table in `schema.prisma`; GA-018 confirms this needs new tables entirely |
| 20 | Full-Text Search | 05-feature-inventory §P1#20 | No | Partial | Basic `ilike` exists but is single-column and unindexed, not the "Algolia/Meilisearch" infra named as a dependency |
| 21 | Instagram Share Templates | 05-feature-inventory §P1#21 | No | No | No implementation found |
| 22 | Event Comparison | 05-feature-inventory §P1#22 | No | No | No implementation found |
| 23 | Past Events Archive | 05-feature-inventory §P1#23 | No | No | `EventStatus` enum includes `completed`/`cancelled` (`schema.prisma:256`) but no archive view or filter uses it |
| 24 | Web Scraping Pipeline | 05-feature-inventory §P1#24 | No | Partial/No | `scripts/crawler.py` exists but "never calls the `urllib`/`re` it imports; its extraction is ~15 hardcoded events" (established fact) — not a working pipeline |
| 51 | Weather & Altitude Advisories | 05-feature-inventory §P1#51 | No | No | No implementation found |
| 52 | Verified Organizer Dashboard | 05-feature-inventory §P1#52 | No | No | `Organizer.isVerified` column exists and is selected by `EVENT_SELECT` (`events.service.ts:10`) but only as an unused badge field — no dashboard |
| 25–35 | P2 features (Trending, Near Me, Difficulty Rating, Curated Collections, Notification Center, PWA, Organizer Analytics, Verified Badges, Photo Galleries, Email Digest, Multi-City Calendar) | 05-feature-inventory §P2 | No | Mostly No | `DifficultyLevel` (#27) is modeled and selected (`events.service.ts:10`) but unrendered in `EventRow.tsx` (GA-018 Phase 3 #2); geolocation "Near Me" (#26) has a modeled, indexed `geo_location` column absent from `EVENT_SELECT` (GA-018 §2.9) — everything else in this band has no implementation found |
| 36–48 | P3 features (User Profiles, Follow, Activity Feed, Clubs, Challenges, Activity Tracking, Strava integration, AI Coach, Native Apps, In-App Ticketing, Marketplace, WhatsApp Bot, Blog/CMS) | 05-feature-inventory §P3 | Explicitly out of scope for v1 (marked "OUT OF SCOPE" in the doc itself) | No | Consistent with scope — no gap to report |

**MVP completion picture.** Of the 11 numbered P0 features in `05-feature-inventory.md` plus the two
P0 rows added later (#49 Buddy Sync, #50 Live Activity Feed) — 13 total — 0 are fully built, 6 are
partially built (event listing, data model, search/filter, city pages, sport pages, mobile-responsive),
and 7 have no implementation at all (event detail page, registration redirect, manual ingestion tool,
SEO, WhatsApp share, Buddy Sync, Live Activity Feed). `06-mvp-definition.md`'s own "Basic User Flows"
(Flows 1–8) cannot complete end-to-end today: Flow 1 and 2 both dead-end at "Click Event Card" because
no detail page exists; Flow 3 (WhatsApp share) and Flow 5 (Buddy Sync) have no UI to start from. The
product is materially behind its own MVP definition, not just its post-MVP roadmap.

## 3. Sprint roadmap reality check

| Sprint | Theme | Declared deliverables | Actual state | Evidence |
| --- | --- | --- | --- | --- |
| 0 | Discovery & Validation | User interviews, competitive teardown, schema v1, landing page | Not verified — no artifacts for interviews/landing-page analytics found in the repo; schema exists | `docs/10-sprint-roadmap.md` §Sprint 0 |
| 1 | Foundation & Data Layer | Prod DB, CRUD API, admin dashboard, CSV import, 200+ seeded events | Schema exists but ahead of the live DB (event_date drift); no admin dashboard; no CSV import; seed pipeline broken | `10-sprint-roadmap.md` §Sprint 1; GA-018 §Phase 0 |
| 2 | Core Discovery Experience | Homepage feed, filter bar, event detail page, city/sport pages, maps, geolocation | Homepage and city/sport pages exist but broken/partial; event detail page not built; no map integration or geolocation found | `10-sprint-roadmap.md` §Sprint 2; this doc §2 rows 1–6 |
| 3 | User Accounts & Live Activity Feed | OAuth/phone auth, save/wishlist, reminders, WebSocket ticker | None live; auth and gateway code exist only in the stale tree | `10-sprint-roadmap.md` §Sprint 3; GA-018 "9 files… unported Sprint-3 slice" |
| 4 | Organizer Dashboard v1 & Buddy Sync | Organizer registration, event wizard, dashboard, Instagram/WhatsApp templates, Buddy Sync APIs | Not built | `10-sprint-roadmap.md` §Sprint 4; no organizer or sync code found |
| 5 | Search, SEO & Content | Full-text search, JSON-LD, sitemap, blog/CMS | Not built beyond single-column `ilike` search | `10-sprint-roadmap.md` §Sprint 5; GA-018 §2.8 |
| 6 | Reviews, Trust & Advisories | Reviews CRUD, quality score, verified badges, weather API | Not built; no reviews table | `10-sprint-roadmap.md` §Sprint 6 |
| 7 | Community & Social v1 | Follow, groups, activity feed, referral | Not built; `Follow` table modeled only | `10-sprint-roadmap.md` §Sprint 7 |
| 8 | Recommendations & Intelligence | Content-based recs, trending, digest email | Not built | `10-sprint-roadmap.md` §Sprint 8 |
| 9 | Mobile Optimization & PWA | Service worker, push, dark mode, bottom nav | Not built; no `manifest.json` or service worker found | `10-sprint-roadmap.md` §Sprint 9 |
| 10 | Feedback, Request Forms & Launch Prep | Analytics dashboard, feedback/event-request forms, launch checklist | `EventRequest`/`UserFeedback` tables modeled (`schema.prisma:199,219`) with RLS support (CLAUDE.md §5) but no forms or endpoints found | `10-sprint-roadmap.md` §Sprint 10 |

The roadmap assumes a team of "2 FE, 2 BE, 1 Mobile/PWA, 1 Designer, 1 PM, 0.5 QA" (`10-sprint-roadmap.md`
line 8) — not verified against actual staffing, but the gap between Sprint 1's exit criteria ("200+
events seeded into production database," "API endpoints return correct data") and the current broken
build/seed/API state suggests Sprint 1 itself never fully closed, regardless of which later sprints
were nominally worked on.

## 4. Features to add for usability

Ordered by how directly each closes a gap in the MVP's own basic user flows, cheapest wins first.

1. **Event detail page (`/events/[id]` or `/events/[slug]`).** Why: every discovery flow in
   `06-mvp-definition.md` (Flows 1, 2, 4) dead-ends without it; it is the single largest product gap
   per GA-018. Already exists to build on: `GET /events/:id` is fully implemented
   (`events.controller.ts:14-17`, `events.service.ts:84-106`) and already selects `registration_url`,
   `price_range`, `difficulty`, `terrain`, `elevation_gain`, and organizer verification — this is
   almost entirely frontend work over data the API already returns. Effort: M.
2. **Render the fields already returned by the API.** Why: price, difficulty, terrain, elevation, and
   organizer-verified badges are the top decision factors after date and location, and users currently
   see none of them. Already exists: all five fields are in `EVENT_SELECT` and normalized by
   `normalizeEvent`, just not rendered in `EventRow.tsx` (GA-018 Phase 3 #2, #4). Effort: S — this is
   the cheapest win in the whole document.
3. **Registration-status / urgency copy ("Closing in N days").** Why: it's a primary trust/urgency
   signal competitors (indiarunning) use on every card. Already exists: the `status` enum
   (`EventStatus`, `schema.prisma:256`) is already returned by the API and unused in the UI. Effort: S.
4. **Widen search beyond `event_name`.** Why: MVP's own data-source list and the "Search & Filter"
   requirement (#3) imply searching by city/organizer, and today "Mumbai" returns nothing unless it's
   literally in the event name. Already exists: `city`, `organizer.name` are already selected columns;
   this is a query-builder change (`events.service.ts:32-33`), not new infrastructure. Effort: S.
5. **Distance filter + `/distance/[slug]` pages.** Why: distance is one of the top comparison axes per
   the Arjun/Riya personas (`docs/03-target-users.md`) and a major organic-traffic driver for
   competitors. Already exists: `distanceOptions[]` is already in the schema and `EVENT_SELECT` — only
   the DTO field and route are missing (GA-018 §2.3). Effort: S/M.
6. **"Showing cached data" banner on the fallback path.** Why: the product principle of "trust through
   transparency" (`docs/04-product-principles.md`) is violated right now — users see synthetic data
   presented as live with no disclosure. Already exists: the fallback branch itself
   (`EventsDirectory.tsx:89-101`); this is a UI-only addition. Effort: S.
7. **Save/Follow event + "My Events" UI.** Why: it's the cheapest path to the P1 retention loop and
   feeds Personal Event Calendar and Reminders next. Already exists: `Follow` and `UserCalendar` tables
   are fully modeled with RLS policies (CLAUDE.md §5) — this needs an auth flow plus UI only, no schema
   work. Effort: M (blocked on porting the stale-tree auth slice, GA-018 §4.2).
8. **Organizer self-serve submission over `EventRequest`.** Why: it directly implements MVP Flow 7 and
   the declared Sprint 4/10 organizer-supply mechanism. Already exists: `EventRequest` table with
   `RequestStatus` enum and anonymous-insert RLS policy already defined (CLAUDE.md §5). Effort: M.
9. **Basic SEO (meta tags, sitemap, JSON-LD).** Why: `docs/04-product-principles.md` names SEO as "the
   primary growth engine" and it is entirely unbuilt. Needs new work (`sitemap.ts`, `robots.ts`,
   `generateMetadata`), but is templatable across existing pages once the event detail page (#1) and
   the `await params` fixes ship. Effort: S/M.
10. **WhatsApp share button.** Why: named as a core distribution principle ("WhatsApp-native") and a
    declared P0 feature (#11), currently absent entirely. Needs new work: a `wa.me` deep link generator
    and share UI; simplest once the event detail page (#1) exists to link to. Effort: S.

## 5. Requirements that no longer look right

- **`memory-bank/techContext.md`** (per this task's brief, not independently re-read in full this
  pass) is confirmed aspirational by GA-018 and CLAUDE.md §2: it describes FastAPI services, an
  OpenRouter LLM extraction pipeline, Algolia, Mem0, Supermemory, and a "Paperclip" multi-agent fleet.
  None of this exists in either repo. `memory-bank/projectbrief.md:14-16` repeats the same claims
  verbatim ("Automated Crawler... with AI parsing (via OpenRouter/LLM)... Agentic Operations...
  Leverage Paperclip to define a multi-agent team"). Both documents should be flagged so no future
  agent plans ingestion work against an LLM pipeline or agent fleet that was never built — the actual
  ingestion layer is `scripts/crawler.py`, which per established fact does not even use the modules it
  imports.
- **`docs/05-feature-inventory.md` #20 Full-Text Search** lists "Search infrastructure
  (Algolia/Meilisearch)" as a dependency. The live implementation is a Postgres `ilike` scan with no
  index (§1). If Algolia/Meilisearch adoption is still intended, that's a substantial infra decision
  nowhere reflected in GA-018's roadmap, which instead recommends a `pg_trgm` GIN index (§1.1) as the
  near-term fix. Flag this as a scope question, not a contradiction to silently resolve.
- **`docs/10-sprint-roadmap.md`'s GANTT and milestone tables** assume linear, fully-staffed 2-week
  sprints delivering complete WebSocket infra (Sprint 3), an organizer dashboard (Sprint 4), and a
  weather-API integration (Sprint 6) in sequence. Given that Sprint 1's own exit criteria (working
  seeded DB, working API) are not met today, the roadmap's sequencing and time estimates should be
  treated as aspirational scaffolding rather than a schedule anyone is currently tracking against.
- **`docs/06-mvp-definition.md` Success Metrics** (Registration Intent Clicks, WhatsApp shares, Buddy
  Sync connections) assume features that do not exist yet (WhatsApp share, Buddy Sync) are already
  live and instrumented. These targets cannot be measured until the underlying features in §2 are
  built.
- **CLAUDE.md §7 brand palette claim** — flagged per this task's brief: CLAUDE.md says orange
  `#f97316`/violet, but GA-018 confirms the live branch defines indigo `#2C3D8F`/cyan `#37DAC3`. Not
  repeating the orange claim here; treat CLAUDE.md §7 as stale for this branch.

## 6. Discrepancies found

- No disagreement found with GA-018's technical findings — they were independently spot-checked in
  this pass (`GetEventsQueryDto` fields, `events.controller.ts` routes, `events.service.ts` query
  logic, and the full `schema.prisma` model list all match GA-018's descriptions exactly).
- One addition, not a contradiction: GA-018 focuses on code/schema/build verification and does not
  cross-reference the PRD documents at all (by design — that was this task's job). This document's §2
  and §3 are net-new analysis, not corrections to GA-018.
- Minor scope clarification: GA-018 §Phase 4 describes `Profile`, `Follow`, `UserCalendar`, `Reminder`,
  `EventRequest` as "the cheapest conversion of existing backend investment into visible value." This
  document agrees but adds that `UserFeedback` (`schema.prisma:219`) is in the same position and was
  not named in GA-018's list — it backs the declared "Request a Feature & Feedback Form" (MVP Flow 8,
  Sprint 10 deliverable) and is equally unconsumed by any UI.
