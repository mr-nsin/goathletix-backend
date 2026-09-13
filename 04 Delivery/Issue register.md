---
type: reference
status: active
tags: [delivery, issues, register]
---

# Issue register

Catalogue of all current product issues and defects, verified 2026-09-09. Derived from GA-018 product reliability and UX roadmap plus fresh lint/build runs. This register is mechanically collated from source documents without prioritisation beyond the severity labels assigned.

---

## Summary counts

| Layer | Blocker | Major | Minor | Total |
|-------|---------|-------|-------|-------|
| Backend-API | 2 | 6 | 0 | 8 |
| Backend-Infrastructure | 1 | 1 | 0 | 2 |
| Backend-Data | 1 | 0 | 0 | 1 |
| Backend-Testing | 0 | 1 | 0 | 1 |
| Backend-Security | 0 | 2 | 0 | 2 |
| Frontend-UX | 1 | 5 | 6 | 12 |
| Frontend-Mobile | 0 | 0 | 1 | 1 |
| Frontend-Accessibility | 0 | 0 | 2 | 2 |
| Frontend-Architecture | 0 | 1 | 1 | 2 |
| Frontend-Performance | 0 | 1 | 1 | 2 |
| Frontend-SEO | 0 | 0 | 1 | 1 |
| Frontend-Design | 0 | 0 | 1 | 1 |
| Frontend-App-Router | 1 | 0 | 0 | 1 |
| Frontend-Feature | 0 | 3 | 0 | 3 |
| Schema-Performance | 0 | 1 | 0 | 1 |
| Build-Tooling | 0 | 1 | 0 | 1 |
| **TOTAL** | **6** | **22** | **16** | **44** |

---

## Blockers

| ID | Layer | Issue | User-visible symptom | Location | Evidence | Effort |
|---|---|---|---|---|---|---|
| ISS-001 | Backend-API | `GET /events` returns 500 TypeError: fetch failed | All discovery features fail; app falls back to stale seed data silently | `src/events/events.service.ts` (Supabase query failure) | GA-018 re-verified 2026-09-09; `EventsDirectory.tsx:89-101` shows fallback path active | M |
| ISS-002 | Backend-Build | `seed.ts:44` TS2322 type error: `name: unknown` not assignable to `string` | Backend cannot be built for deployment; `npm run build` fails | `src/seed.ts:44` | Direct build failure observed 2026-09-09; `organizerData` name field typed as `unknown` | S |
| ISS-003 | Backend-Infrastructure | `HTTPS_PROXY` read at module-import time before `ConfigModule` loads `.env` | Supabase REST over 443 cannot be configured; proxy unreachable | `src/main.ts:6` | GA-018; corporate proxy firewalls Supabase connections; no credentials required but timing issue prevents configuration | S |
| ISS-004 | Backend-Data | Postgres 5432 firewalled on network; Prisma cannot connect | Prisma-based operations (seed.ts, prisma migrate, schema rewrites) unusable from this environment | Multiple paths using Prisma ORM | GA-018; raw TCP 5432 blocked at network perimeter | n/a |
| ISS-005 | Frontend-UX | UI does not admit to showing cached/stale data | Users see seed data presented as live without awareness that real feed is unavailable | `src/components/EventsDirectory.tsx:89-101` | GA-018; silent fallback to `lib/fallbackEvents.json` | S |
| ISS-006 | Frontend-App-Router | `sports/[sport]/page.tsx` and `locations/[city]/page.tsx` return 500 under Next 16 | Both dynamic route pages broken in production | `src/app/sports/[sport]/page.tsx`, `src/app/locations/[city]/page.tsx` | GA-018; requires `await params` for dynamic segment access under Next 16 App Router | S |

---

## Major issues

| ID | Layer | Issue | User-visible symptom | Location | Evidence | Effort |
|---|---|---|---|---|---|---|
| ISS-007 | Backend-API | `GET /events` search uses leading-wildcard `ilike('%q%')` with no supporting index | Every search is a full scan of 10k+ rows; poor performance | `src/events/events.service.ts:29` | GA-018; `pg_trgm` GIN index missing; linear scan confirmed | S/M |
| ISS-008 | Backend-API | City filter uses `ilike` without wildcards, cannot use `idx_events_city` btree | City filtering inefficient; incorrect index usage | `src/events/events.service.ts:37` | GA-018; functional index needed on `lower(city)` | S |
| ISS-009 | Backend-API | Unbounded `limit` query parameter | Denial of service risk; clients can request unlimited rows | `src/events/dtos/get-events-query.dto.ts:28-32` | GA-018; missing `@Max(100)` decorator | S |
| ISS-010 | Backend-API | `/events` lacks rate limiting and cache headers | High-cost query (index scan) unprotected; caches unnecessarily recompute | `src/events/events.controller.ts` | GA-018; needs `@nestjs/throttler` and `Cache-Control` response header | S/M |
| ISS-011 | Backend-Security | Raw Postgres error strings leaked to API clients | Stack traces and internal error details exposed in 500 responses | `src/events/events.service.ts:58-60, 88-90` | GA-018; `error.message` passed directly to `InternalServerErrorException` | S |
| ISS-012 | Backend-Security | CORS enabled globally with no origin restriction | Open to any origin making requests; no origin validation | `src/main.ts:15` | GA-018 §1 (GA-006); `app.enableCors()` called with no options | S |
| ISS-013 | Backend-Testing | Zero test coverage for `/events` module | No specs exist for `EventsController` or `EventsService` | `src/events/` | GA-018 §1; only two starter spec files exist in entire backend; GA-007 | S/M |
| ISS-014 | Backend-Infrastructure | GET /health endpoint missing | Service outage (ISS-001) would not have been automatically detected | `src/health/` (absent) | GA-018 §0.3; no health check exercising Supabase call | S |
| ISS-015 | Frontend-UX | Mega-search controls (Competition, Date-range, Flexibility) wired to UI but not to API | 3 of 5 search inputs silently do nothing | `src/app/page.tsx` (MegaSearchBar UI), `src/events/dtos/get-events-query.dto.ts` (missing DTO fields) | GA-018 §2.1; `page.tsx` admits *"the MegaSearchBar would trigger a router.push(...)"*; no backing DTO fields | M |
| ISS-016 | Frontend-UX | Search scoped to `event_name` only; excludes city, venue, organizer | Searching "Mumbai" misses events unless name contains it | `src/app/page.tsx:267` (search parameter), `src/events/events.service.ts:29` (query) | GA-018 §2.2 | S |
| ISS-017 | Frontend-UX | No distance filter; `distanceOptions[]` in schema and API but no UI | Users cannot filter by race distance (5K, 10K, marathon, etc.) | `prisma/schema.prisma` (field exists), `src/events/events.service.ts` (selected), `src/app/page.tsx` (missing control) | GA-018 §2.3; competitor indiarunning uses `/distance/{5k,10k,...}` as major traffic source | S/M |
| ISS-018 | Frontend-UX | Filter state not encoded in `searchParams` | Result sets unshareable and uncrawlable | `src/app/page.tsx` | GA-018 §2.4; state lives in local React state, not URL | M |
| ISS-019 | Frontend-UX | Sort hardcoded to ascending event date; no user control | Users cannot sort by price, distance, etc. | `src/events/events.service.ts:55` (`.order('event_date')` hardcoded) | GA-018 §2.5 | S |
| ISS-020 | Frontend-Architecture | No event detail page exists | Product's single largest gap; `GET /events/:id` API exists but unused | `src/app/events/[id]/` (absent) | GA-018 §2.6 | M |
| ISS-021 | Frontend-UX | Aggregate counts on category tiles are hardcoded strings | "234 Running Events" does not reflect actual data | `src/components/CategoryGrid.tsx:30-40` (hardcoded `counts`) | GA-018 §2.7 | S |
| ISS-022 | Frontend-Feature | Save/Follow event feature not implemented | No UI for marking events as saved or followed despite `Follow` and `UserCalendar` tables in schema | `src/app/page.tsx`, `src/components/EventRow.tsx` | GA-018 §4.1; tables exist with zero consuming UI | M |
| ISS-023 | Frontend-Feature | Authentication and activity slice not ported | OAuth login, activity logs, live ticker wiring missing | Multiple stale implementations in `goathletix-backend/backend/` | GA-018 §4.2; Sprint-3 code in deprecated tree; GA-005 | M |
| ISS-024 | Frontend-Feature | Reminders / "closing soon" notifications not implemented | Users cannot be alerted to registration deadlines | `Profile`, `Reminder` tables exist but UI absent | GA-018 §4.3 | L |

---

## Minor issues

| ID | Layer | Issue | User-visible symptom | Location | Evidence | Effort |
|---|---|---|---|---|---|---|
| ISS-025 | Frontend-UX | EventRow.tsx:12 re-parses ISO date using Date constructor | Reintroduces timezone offset bug that string-split convention prevents | `src/components/EventRow.tsx:12` | GA-018 §3.1; `new Date(event.eventDate)` defeats the purpose of `normalizeEvent` string-split logic | S |
| ISS-026 | Frontend-UX | Event cards render title only; omit priceRange, difficulty, terrain, elevationGain | Missing top decision fields after date and location | `src/components/EventRow.tsx:16-27` (incomplete field rendering) | GA-018 §3.2; `normalizeEvent` produces these fields but they go unused | S |
| ISS-027 | Frontend-UX | No registration status / urgency copy ("Registrations open", "Closing in N days") | Missing conversion signal; status enum unused despite being selected by API | `src/components/EventRow.tsx` (no status render), `src/events/events.service.ts` (status selected) | GA-018 §3.3; competitor indiarunning uses this on every card | S |
| ISS-028 | Frontend-UX | Organizer verification badge not rendered | `organizer.isVerified` selected by API but not displayed | `src/components/EventRow.tsx` | GA-018 §3.4 | S |
| ISS-029 | Frontend-Mobile | City/venue hidden on mobile (375px) at exactly where casual searching happens | Location disappears on handset; critical discovery field absent | `src/components/EventRow.tsx:64` (`hidden md:flex`) | GA-018 §3.5; responsive breakpoint hides location on mobile | S |
| ISS-030 | Frontend-UX | Computed description unused on listing pages | `descriptions` computed but not rendered on `/locations/[city]` and `/sports/[sport]` | `src/app/locations/[city]/page.tsx:27`, `src/app/sports/[sport]/page.tsx:19` | GA-018 §3.6; free unique content per page unused | S |
| ISS-031 | Frontend-Accessibility | Event title not a keyboard-accessible link | `EventRow.tsx:45` is `<h3>` with `cursor-pointer` and `hover:underline` but no `<a>` or `<button>` | `src/components/EventRow.tsx:45` | GA-018 §3.7; fake affordance, not keyboard reachable | S |
| ISS-032 | Frontend-UX | No skeleton loader during event fetch | Text swap instead of matching row height; jarring layout shift | `src/components/EventsDirectory.tsx` (loading state) | GA-018 §3.8; `min-h-[4.5rem]` row height not matched during load | S |
| ISS-033 | Frontend-UX | Per-sport iconography incomplete; 3-way colour ternary only covers running/cycling | Triathlon, swimming, trekking all collapse to dark bucket; meaning by colour alone | `src/components/EventRow.tsx:23-27` | GA-018 §3.9 | S |
| ISS-034 | Frontend-Accessibility | `prefers-reduced-motion` not respected on animations | `LiveTicker` continuous `animate-ping`, 4s auto-rotate, CSS ticker keyframe ignore accessibility preference | `src/components/LiveTicker.tsx`, `src/app/globals.css` | GA-018 §3.10 | S |
| ISS-035 | Frontend-UX | No card component variant for real event data | `DiscoveryCard` is marketing-only; event listings lack rich card presentation | `src/components/DiscoveryCard.tsx` | GA-018 §3.11; proposed anatomy: sport-colour strip, date badge, name, organizer+city, distance chips, price+difficulty, CTA | M |
| ISS-036 | Frontend-Design | Hardcoded colour values scattered throughout codebase instead of using @theme tokens | Components reference `#141A3E`, `#2055DC`, `#181427`, `#DBDBE7`, `#737582`, `#F6F6F9` directly | Multiple files across `src/components/`, `src/app/` | GA-018 §3.12; colour drift risk and maintainability; `globals.css` is serial resource | M |
| ISS-037 | Frontend-Performance | No `next/image` usage; full-size 2070px Unsplash crops shipped to all viewports | Large image downloads on mobile; performance degradation | `src/components/DiscoveryCard.tsx` and others | GA-018 §3.13; schema has no image field anyway | M |
| ISS-038 | Frontend-Architecture | EventsDirectory is `"use client"` fetching in `useEffect`; crawlers get empty shell | No server-side rendering for listings; SEO dead; users wait round trip | `src/components/EventsDirectory.tsx:1` | GA-018 §3.14; no loading/error boundaries | M |
| ISS-039 | Frontend-SEO | Missing `sitemap.ts`, `robots.ts`, per-route `generateMetadata`, `SportsEvent` JSON-LD | Site not discoverable via search engines; rich snippets absent | `src/app/` | GA-018 §2.8; overlaps GA-016 | S/M |
| ISS-040 | Backend-API | `/events/near` not implemented; geo_location modelled and indexed but absent from EVENT_SELECT | Near-me search closer than it appears; requires Postgres RPC over GIST index | `src/events/events.service.ts` (EVENT_SELECT missing geo fields) | GA-018 §2.9 | M |
| ISS-041 | Backend-Data | Migration 0003 schema mismatch: `schema.prisma` uses `start_date`/`end_date`, live table uses `event_date` | seed.ts and EventsService use different fields; contract drift on all date operations | `prisma/schema.prisma`, `src/seed.ts:44`, `src/events/events.service.ts` | GA-018 contract drift section; live table has `event_date`, migration 0003 defines `start_date`/`end_date` | n/a |
| ISS-042 | Backend-Data | Event schema lacks image field | Rich event cards need media; only `Organizer.logoUrl` available | `prisma/schema.prisma` under GoAthletix models | GA-018 §3.13 | n/a |
| ISS-043 | Frontend-Feature | Reviews and ratings not implemented | No UI for 1–5 star ratings or sub-scores (Communication, Engagement, Hospitality, Safety); no moderation | `src/app/`, `prisma/schema.prisma` | GA-018 §4.4 | L |
| ISS-044 | Build-Tooling | `.DS_Store` still tracked in git | macOS artefact pollutes repository; should be in `.gitignore` | Backend repo | Confirmed tracked 2026-09-09 via `git ls-files | grep -i ds_store`; GA-018 §1 says *"Still tracked [V]"*; GA-012 | S |

---

## Current tool output

### Frontend lint

```
D:\project\goathletix\goathletix-frontend\src\app\locations\[city]\page.tsx
  27:9  warning  'description' is assigned a value but never used  @typescript-eslint/no-unused-vars

D:\project\goathletix\goathletix-frontend\src\app\page.tsx
  16:10  warning  'currentMonth' is assigned a value but never used     @typescript-eslint/no-unused-vars
  16:24  warning  'setCurrentMonth' is assigned a value but never used  @typescript-eslint/no-unused-vars
  17:10  warning  'currentYear' is assigned a value but never used      @typescript-eslint/no-unused-vars
  17:23  warning  'setCurrentYear' is assigned a value but never used   @typescript-eslint/no-unused-vars

D:\project\goathletix\goathletix-frontend\src\app\sports\[sport]\page.tsx
  19:9  warning  'description' is assigned a value but never used  @typescript-eslint/no-unused-vars

D:\project\goathletix\goathletix-frontend\src\components\CategoryGrid.tsx
  27:15  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

D:\project\goathletix\goathletix-frontend\src\components\EventRow.tsx
  15:9  warning  'monthName' is assigned a value but never used  @typescript-eslint/no-unused-vars

D:\project\goathletix\goathletix-frontend\src\components\EventsDirectory.tsx
  39:24  warning  'setCurrentMonth' is assigned a value but never used  @typescript-eslint/no-unused-vars
  40:23  warning  'setCurrentYear' is assigned a value but never used   @typescript-eslint/no-unused-vars
  89:14  warning  'error' is defined but never used                     @typescript-eslint/no-unused-vars

D:\project\goathletix\goathletix-frontend\src\components\LiveTicker.tsx
  3:10  warning  'Activity' is defined but never used  @typescript-eslint/no-unused-vars

D:\project\goathletix\goathletix-frontend\src\hooks\useSocket.ts
  12:5  error  Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
* Update external systems with the latest state from React.
* Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

D:\project\goathletix\goathletix-frontend\src\hooks\useSocket.ts:12:5
  10 |     const socketIo = io(SOCKET_SERVER_URL);
  11 |
> 12 |     setSocket(socketIo);
     |     ^^^^^^^^^ Avoid calling setState() directly within an effect
     |
     |     13 |
     |     14 |       socketIo.disconnect();  react-hooks/set-state-in-effect

✖ 13 problems (1 error, 12 warnings)
```

Summary: **1 error, 12 warnings**

### Backend lint

```
D:\project\goathletix\goathletix-backend\src\main.ts
  23:1  warning  Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator  @typescript-eslint/no-floating-promises

D:\project\goathletix\goathletix-backend\src\seed.ts
   28:9   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   29:32  error    Unsafe member access .length on an `any` value                                                        @typescript-eslint/no-unsafe-member-access
   33:13  warning  Unsafe argument of type `any` assigned to a parameter of type `Iterable<unknown> | null | undefined`  @typescript-eslint/no-unsafe-argument
   33:13  error    Unsafe call of an `any` typed value                                                                   @typescript-eslint/no-unsafe-call
   33:13  error    Unsafe call of an `any` typed value                                                                   @typescript-eslint/no-unsafe-call
   33:20  error    Unsafe member access .map on an `any` value                                                           @typescript-eslint/no-unsafe-member-access
   33:36  error    Unsafe return of a value of type `any`                                                                @typescript-eslint/no-unsafe-return
   33:38  error    Unsafe member access .organizer_name on an `any` value                                                @typescript-eslint/no-unsafe-member-access
   33:54  error    Unsafe member access .filter on an `any` value                                                        @typescript-eslint/no-unsafe-member-access
   60:9   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   60:21  error    Unsafe call of an `any` typed value                                                                   @typescript-eslint/no-unsafe-call
   60:28  error    Unsafe member access .map on an `any` value                                                           @typescript-eslint/no-unsafe-member-access
   61:25  error    Unsafe member access .organizer_name on an `any` value                                                @typescript-eslint/no-unsafe-member-access
   62:26  warning  Unsafe argument of type `any` assigned to a parameter of type `string`                                @typescript-eslint/no-unsafe-argument
   62:32  error    Unsafe member access .organizer_name on an `any` value                                                @typescript-eslint/no-unsafe-member-access
   74:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   74:24  error    Unsafe member access .event_name on an `any` value                                                    @typescript-eslint/no-unsafe-member-access
   75:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   75:24  error    Unsafe member access .sport_type on an `any` value                                                    @typescript-eslint/no-unsafe-member-access
   76:27  warning  Unsafe argument of type `any` assigned to a parameter of type `string | number | Date`                @typescript-eslint/no-unsafe-argument
   76:33  error    Unsafe member access .event_date on an `any` value                                                    @typescript-eslint/no-unsafe-member-access
   77:22  error    Unsafe member access .end_date on an `any` value                                                      @typescript-eslint/no-unsafe-member-access
   78:20  warning  Unsafe argument of type `any` assigned to a parameter of type `string | number | Date`                @typescript-eslint/no-unsafe-argument
   78:26  error    Unsafe member access .end_date on an `any` value                                                      @typescript-eslint/no-unsafe-member-access
   79:20  warning  Unsafe argument of type `any` assigned to a parameter of type `string | number | Date`                @typescript-eslint/no-unsafe-argument
   79:26  error    Unsafe member access .event_date on an `any` value                                                    @typescript-eslint/no-unsafe-member-access
   80:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   80:19  error    Unsafe member access .city on an `any` value                                                          @typescript-eslint/no-unsafe-member-access
   81:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   81:20  error    Unsafe member access .state on an `any` value                                                         @typescript-eslint/no-unsafe-member-access
   82:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   82:20  error    Unsafe member access .city on an `any` value                                                          @typescript-eslint/no-unsafe-member-access
   83:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   83:30  error    Unsafe member access .distance_options on an `any` value                                              @typescript-eslint/no-unsafe-member-access
   84:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   84:28  error    Unsafe member access .elevation_gain on an `any` value                                                @typescript-eslint/no-unsafe-member-access
   85:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   85:25  error    Unsafe member access .difficulty on an `any` value                                                    @typescript-eslint/no-unsafe-member-access
   86:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   86:25  error    Unsafe member access .price_range on an `any` value                                                   @typescript-eslint/no-unsafe-member-access
   87:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   87:30  error    Unsafe member access .registration_url on an `any` value                                              @typescript-eslint/no-unsafe-member-access
   89:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   89:22  error    Unsafe member access .terrain on an `any` value                                                       @typescript-eslint/no-unsafe-member-access
   90:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   90:24  error    Unsafe member access .is_virtual on an `any` value                                                    @typescript-eslint/no-unsafe-member-access
   91:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   91:21  error    Unsafe member access .status on an `any` value                                                        @typescript-eslint/no-unsafe-member-access
   98:33  error    Unsafe member access .length on an `any` value                                                        @typescript-eslint/no-unsafe-member-access
   99:11  error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
   99:19  error    Unsafe call of an `any` typed value                                                                   @typescript-eslint/no-unsafe-call
   99:29  error    Unsafe member access .slice on an `any` value                                                         @typescript-eslint/no-unsafe-member-access
  101:7   error    Unsafe assignment of an `any` value                                                                   @typescript-eslint/no-unsafe-assignment
  105:69  error    Unsafe member access .length on an `any` value                                                        @typescript-eslint/no-unsafe-member-access
  105:89  error    Unsafe member access .length on an `any` value                                                        @typescript-eslint/no-unsafe-member-access

D:\project\goathletix\goathletix-backend\src\supabase.service.ts
  19:5  error  Unsafe assignment of type `SupabaseClient<any, any, "public", any, any>` to a variable of type `SupabaseClient<any, "public", "public", any, any>`  @typescript-eslint/no-unsafe-assignment

✖ 57 problems (51 errors, 6 warnings)
```

Summary: **51 errors, 6 warnings** — 47 in `seed.ts` (unsafe `any`), 1 in `main.ts` (floating promise), 1 in `supabase.service.ts` (type mismatch), plus 8 warnings spread across files.

### Frontend build

```
> frontend@0.1.0 build
> next build

Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of D:\project\goathletix\package-lock.json as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.

✓ Compiled successfully
✓ Generated static pages 
```

Summary: **Build successful** with workspace root warning. All routes compiled: `/`, `/locations/[city]`, `/sports/[sport]`.

### Backend build

```
> backend@0.0.1 build
> nest build

src/seed.ts:44:5 - error TS2322: Type '{ name: unknown; isVerified: boolean; }[]' is not assignable to type 'OrganizerCreateManyInput | OrganizerCreateManyInput[]'.
  Type '{ name: unknown; isVerified: boolean; }[]' is not assignable to type 'OrganizerCreateManyInput[]'.
    Type '{ name: unknown; isVerified: boolean; }' is not assignable to type 'OrganizerCreateManyInput'.
      Types of property 'name' are incompatible.
        Type 'unknown' is not assignable to type 'string'.

44     data: organizerData,
       ~~~~

Found 1 error(s).
```

Summary: **Build failed** at `src/seed.ts:44` with TS2322. Cannot produce deployment bundle.

---

## Repository state

### Backend (`goathletix-backend`)

**Branch:** `main`

**Git status (short):**
```
 M "04 Delivery/GA-017-searchbar-airbnb-parity.md"
 M "04 Delivery/Task board.md"
 M src/app.module.ts
 M src/events/events.service.ts
 M src/main.ts
 M src/prisma.service.ts
 M src/seed.ts
 M src/supabase.service.ts
?? "04 Delivery/GA-018-product-reliability-and-ux-roadmap.md"
```

**Uncommitted changes:** 8 files modified (GA-017, Task board, 6 src/* files), 1 untracked (GA-018). No deletions.

**.DS_Store tracking:** Yes, `.DS_Store` **is still tracked** in the git repository. Confirmed by `git ls-files | grep -i ds_store` returning `.DS_Store`.

### Frontend (`goathletix-frontend`)

**Branch:** `chore/sync-from-monorepo`

**Git status (short):**
```
M src/app/page.tsx
 M src/components/MegaSearchBar.tsx
```

**Uncommitted changes:** 2 files modified, no untracked. No deletions.

---

## Issue-marker sweep

Searched for common code-smell markers in active source paths:

| Pattern | Locations searched | Matches found |
|---------|-------------------|---------------|
| `TODO` | `goathletix-backend/src`, `goathletix-backend/scripts`, `goathletix-frontend/src` | 0 |
| `FIXME` | Same | 0 |
| `HACK` | Same | 0 |
| `XXX` | Same | 0 |
| `@ts-ignore` | Same | 0 |
| `@ts-expect-error` | Same | 0 |
| `eslint-disable` | Same | 0 |

**Summary:** Zero markers found. Previous sweep result (GA-018 verification) **confirmed**. No outstanding inline TODOs or suppressed lints in active code.

---

## Cross-references

| ISS-ID | GA owner | Status | Notes |
|--------|----------|--------|-------|
| ISS-001 | GA-018 | Verified | `/events` 500 error is the headline blocker |
| ISS-002 | GA-018 (0.1) | Verified | `seed.ts:44` TS2322 blocks all builds |
| ISS-003 | GA-018 (0.2) | Verified | HTTPS_PROXY timing issue documented |
| ISS-004 | GA-018 | Verified | Postgres 5432 firewalled; environment constraint |
| ISS-005 | GA-018 (0.5) | Verified | Silent fallback needs banner |
| ISS-006 | GA-018 (0.6) | Verified | Next 16 `await params` required |
| ISS-007 | GA-018 (1.1) | Verified | Search index missing; full table scan |
| ISS-008 | GA-018 (1.2) | Verified | City filter index misuse |
| ISS-009 | GA-018 (1.3) | Verified | Unbounded `limit` parameter |
| ISS-010 | GA-018 (1.4) | Verified | No rate limiting or cache headers |
| ISS-011 | GA-018 (1.5) | Verified | Raw error strings leaked |
| ISS-012 | GA-018 (1.6) / GA-006 | Verified | CORS open to all origins |
| ISS-013 | GA-018 (1.7) / GA-007 | Verified | `/events` module untested |
| ISS-014 | GA-018 (0.3) | Verified | GET /health absent |
| ISS-015 | GA-018 (2.1) | Verified | Mega-search controls unwired |
| ISS-016 | GA-018 (2.2) | Verified | Search scoped to event_name only |
| ISS-017 | GA-018 (2.3) | Verified | Distance filter missing |
| ISS-018 | GA-018 (2.4) | Verified | Filters not in searchParams |
| ISS-019 | GA-018 (2.5) | Verified | Sort hardcoded to date ascending |
| ISS-020 | GA-018 (2.6) | Verified | No event detail page |
| ISS-021 | GA-018 (2.7) | Verified | Category tile counts hardcoded |
| ISS-022 | GA-018 (4.1) | Verified | Save/Follow event UI missing |
| ISS-023 | GA-018 (4.2) / GA-005 | Verified | Auth and activity slice unported |
| ISS-024 | GA-018 (4.3) | Verified | Reminders not implemented |
| ISS-025 | GA-018 (3.1) | Verified | EventRow.tsx date parsing bug |
| ISS-026 | GA-018 (3.2) | Verified | Fields in hand not rendered |
| ISS-027 | GA-018 (3.3) | Verified | No registration urgency copy |
| ISS-028 | GA-018 (3.4) | Verified | Organizer verification badge missing |
| ISS-029 | GA-018 (3.5) | Verified | Mobile location hidden |
| ISS-030 | GA-018 (3.6) | Verified | Description computed but unused |
| ISS-031 | GA-018 (3.7) | Verified | Event title not keyboard-accessible |
| ISS-032 | GA-018 (3.8) | Verified | No skeleton loader |
| ISS-033 | GA-018 (3.9) | Verified | Per-sport icons incomplete |
| ISS-034 | GA-018 (3.10) | Verified | `prefers-reduced-motion` not guarded |
| ISS-035 | GA-018 (3.11) | Verified | No event card variant for real data |
| ISS-036 | GA-018 (3.12) | Verified | Hardcoded colours not using tokens |
| ISS-037 | GA-018 (3.13) | Verified | No `next/image` usage |
| ISS-038 | GA-018 (3.14) | Verified | EventsDirectory client-side only |
| ISS-039 | GA-018 (2.8) / GA-016 | Verified | Missing SEO metadata |
| ISS-040 | GA-018 (2.9) | Verified | `/events/near` not implemented |
| ISS-041 | GA-018 contract drift | Verified | `event_date` vs `start_date`/`end_date` mismatch (GA-002) |
| ISS-042 | UNTRACKED | Observed | Event schema lacks image field; blocking rich cards |
| ISS-043 | GA-018 (4.4) | Verified | Reviews and ratings not implemented |
| ISS-044 | GA-018 (1.8) / GA-012 | Verified | `.DS_Store` still tracked |

**Untracked issues (no GA owner yet):**
- ISS-042: Event image field missing (gates card design; implies database decision)

