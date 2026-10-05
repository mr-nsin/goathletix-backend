---
id: GA-020
type: task
status: blocked
priority: P0
owner: unassigned
branch: unassigned
worktree: unassigned
scope: [goathletix-frontend/src, goathletix-backend/src/events, goathletix-backend/src/taxonomy]
acceptance: []
depends_on: [GA-019, ADR-002, ADR-005]
related: ["01 Product/Main page mockup.html", "01 Product/Main page design spec.md"]
---

# GA-020 Build the homepage from the approved mockup

- **Created:** 2026-09-30
- **Source of truth:** `01 Product/Main page mockup.html` (rev 5, `0d54d9d`) and
  `01 Product/Main page design spec.md` §1–§12. Where they disagree, the mockup wins for visuals and the
  spec wins for rules (honesty, data, accessibility).
- **Blocked by:** the Supabase project is unreachable (see "Blocking facts"), plus the owner decisions
  under "Pending from the product owner".

## Goal

Replace the current hardcoded homepage with the mockup's design, rendered from **live API data**, degrading
honestly: a section with no data does not render. It never shows a placeholder, a "data pending" tag or
sample numbers — the mockup's dashed `pending` tags are review annotations, not UI.

## Blocking facts (2026-09-30)

1. **Supabase is unreachable.** The corporate proxy answers `504 Unknown Host` for the project hostname,
   while `api.github.com` returns 200 through the same proxy. The backend boots, but every `/events` call
   logs `TypeError: fetch failed`. The last successful access was 2026-09-16; a free-tier project pauses
   after about a week idle, so **a paused project is the likely cause**. Nothing data-driven can be verified
   until it is restored from the Supabase dashboard.
2. **Live data cannot fill most rails** (last measured 2026-09-16/17 — re-measure once restored):
   `sport=athletics` returns 0; `discipline_slugs`, `registration_closes_at`, `interest_count`, `club_id` and
   `description` are 0% populated; `age_categories` is unmeasured.
3. `poster_url` / `is_popular` exist (commit `eaef1bc`), but their migration is in `prisma/migrations/`, not
   `supabase/migrations/` as `CLAUDE.md` §5 requires. Move the file; do not re-apply it.

## Current frontend vs the mockup

| Area | Today (`goathletix-frontend`) | Mockup rev 5 |
| --- | --- | --- |
| Homepage | `page.tsx` (186 lines): hero "FIND YOUR FINISH LINE", `PopularEvents`, then three **hardcoded** rails — Sports, Major Events (incl. the past *TCS World 10K — May 2026*), Cities | 14 data sections, all live |
| Header | In `layout.tsx`: transparent overlay, 128px logo, dead "Choose location", links to non-existent `/explore`, `/forum`, `/about` | Announcement bar, two-row sticky header, Events / Explore / Shop / Organisers menus, search, drawer |
| Footer | One line: "© 2026 GoAthletix · Data Provider" | Parade, "Made with ♥ in India", 6 columns, search cloud |
| Cards | `DiscoveryCard` (image + title), `EventRow` (list row) | Event card v4, organiser, city, month, sport tile, product, guide |
| Fonts | `--font-sans` = **Roboto Condensed**, `--font-heading` = **Outfit** | The reverse: Outfit for body, Roboto Condensed for labels |
| Headings | `globals.css` forces **every h1–h6 to uppercase** | Sentence case |
| Palette | `@theme` indigo `#2C3D8F` / cyan `#37DAC3`; `.dark` swaps to orange / purple | Ink `#141A3E`, teal `#12B4A0`, teal→lime gradient, CTA `#FF385C`, full dark theme |
| API base URL | `PopularEvents` falls back to `:4000`, `EventsDirectory` to `:3001` — **both wrong** (API is `:3000`), masked by `.env.local` | One client |
| Search | `MegaSearchBar` (968 lines), not wired to the API on the homepage | WHERE + WHEN pill, pinned location chip, radius |

## Architecture decisions

- **One API client:** `src/lib/api.ts` with a single `API_BASE_URL` (fallback `http://localhost:3000`), typed
  helpers (`listEvents`, `countEvents`, `getSports`) and `AbortSignal` support. Delete the per-component constants.
- **Server components by default.** Each rail fetches on the server with revalidation (~5 min); only
  interactive islands are client components (menus, filter bar, carousel, typed text, save buttons). This removes
  the loading flash and puts real event names in the HTML for SEO. **Read `node_modules/next/dist/docs/` first** —
  Next 16 caching and `params` differ from older docs (`CLAUDE.md` §7).
- **Render rule:** a rail returns `null` at 0 rows. No empty states on the homepage.
- **Extend `normalizeEvent`**, don't replace it: add `slug`, `posterUrl`, `isPopular`, `ageCategories`,
  `disciplineSlugs`, `registrationClosesAt`, `interestCount`, `organizer.isVerified` on **both** the snake_case and
  camelCase branches. Dates stay string-split — never `new Date(str)`.
- **Featured = `is_popular`.** Reuse the existing column and label it "Featured" in the UI; no new `is_featured`
  column (supersedes requirement #55's column list).
- **Motion:** CSS for hover / zoom / parade / ticker, framer-motion for islands, everything behind
  `prefers-reduced-motion`. **Do not port the mockup's "Preview motion" button** — it is a review tool.
- **No silent fallback:** `fallbackEvents.json` must not stand in for live data on `/`. If the API fails, the
  rails hide and one "Showing limited results" notice appears.

## Section by section: what can ship on live data

| # | Section | Query | Live today? | Phase |
| --- | --- | --- | --- | --- |
| 0 | Announcement bar | one configured message | needs content | 2 (only if content given) |
| 1 | Header, menus, drawer | `/taxonomy/sports` + counts | yes | 2 |
| 2 | Hero: typed word, WHERE/WHEN pill, audience links, stats | counts | yes | 3 |
| 3 | Filter bar + pinned location chip | links to directory URLs | city yes; radius needs lat/lng | 3 / 4 |
| 4 | Featured banner | `popular=true` | if any rows are flagged | 3 |
| 5 | Happening near you | `city` + next 30 days | yes | 3 |
| 6 | Live activity strip | `activity_logs` stream | no — gateway not ported (GA-005) | 6 |
| 7 | This weekend | `dateFrom` / `dateTo` | yes | 3 |
| 8 | Registration closing soon | `registration_closes_at` ≤ 14 days | **no — 0% populated** | hidden until data |
| 9 | Plan your season | counts per month | yes, with a counts endpoint | 4 |
| 10 | Popular right now | `interest_count` | **no — all 0** | hidden until data |
| 11 | Kids & juniors | `ageCategories=kids,sub_junior,junior` | unmeasured | 3, self-hiding |
| 12 | Latest results | `results_url` / `results_status` | **no — columns don't exist** | 5 |
| 13 | Organisers to follow | organizers list + `entity_follows` | list needs endpoint; follow needs auth | 4 / 5 |
| 14 | Gear marketplace | — | **no schema (#56)** | not in this task |
| 15 | Browse by sport | `/taxonomy/sports` + counts | yes | 3 |
| 16 | Clubs & academies | `clubs` | **0 rows** | hidden until data |
| 17 | Organiser band (typed) | static copy + real counts | yes | 3 |
| 18 | Seller band (typed) | static copy | depends on marketplace decision | 3 or hidden |
| 19 | Train smarter guides | — | **no CMS** | not in this task |
| 20 | Browse by city (count-led) | counts per city | yes, with a counts endpoint | 4 |
| 21 | Race-day alerts form | — | **no provider or table** | hidden until decided |
| 22 | Sports parade + "Made with ♥ in India" | static SVG | yes | 2 |
| 23 | Footer + popular-search cloud | static links to directory URLs | yes | 2 |

On today's data, **13 of 23 sections ship live**; the rest hide and switch on by themselves as data arrives —
no redeploy, because every rail self-hides at 0 rows.

## Phases

One branch and one handoff per phase. Working agreement: **a lower-cost model implements each phase from this
note; a higher model verifies before merge.** Serial files (`globals.css`, `layout.tsx`, `page.tsx`,
`package.json`) belong to one phase at a time.

### Phase 0 — Unblock (owner + data-schema, no UI)
- [ ] Owner restores the Supabase project; re-run the coverage measurement in "Blocking facts".
- [ ] Decide how GA-019 lands (no merge base with `main`); GA-020 branches from wherever it lands.
- [ ] Record ADR-002 (palette) and ADR-005 (imagery).
- [ ] Move `20260915_add_poster_and_popular.sql` to `supabase/migrations/` (file move only).

### Phase 1 — Design foundation (discovery-ui; owns `globals.css` and the fonts in `layout.tsx`)
- [ ] Port the mockup's light + dark tokens into `@theme` (ink, muted, line, accent, CTA, tints, shadows, radii,
      gradient) with a `data-theme` dark mode; drop the orange/purple `.dark` block.
- [ ] Fonts: Outfit → `--font-sans`, Roboto Condensed → `--font-label`; remove the global uppercase rule.
- [ ] Primitives in `src/components/ui/`: `Rail` (rev-4 side arrows, hidden at the ends), `SectionHead`, `Chip`,
      `Tag`, `DateBlock`, `TrustBadge`, `StatusLine`, `AvatarStack`, `Typewriter`.
- [ ] `src/lib/api.ts`; fix the `:4000` / `:3001` fallbacks.
- **Accept:** `build` + `lint` clean; a dev-only `/styleguide` route renders every primitive in light and dark;
  no hardcoded hex in the new primitives.

### Phase 2 — Shell (discovery-ui; owns `layout.tsx`)
- [ ] `SiteHeader`: announcement bar (config-driven, dismissal remembered); row 1 — logo, search (`/` to focus),
      location + radius popover, calendar / alerts / cart icons **hidden until auth exists**, Log in, List your
      event; row 2 — Events ▾, Explore ▾, Calendar, Results, Clubs, Shop ▾, Guides, For organisers ▾, Sell with us;
      mobile drawer. Any link without a real route is not rendered.
- [ ] `SiteFooter`: 12-sketch parade, "Made with ♥ in India", brand column, 6 accordion columns, popular-search
      cloud built from real directory URLs, neutrality note, legal bar.
- **Accept:** no link 404s; sticky offsets right at 375px and 1280px (the rev-3 `--hh` bug); Esc closes menus,
  sane Tab order; no horizontal scroll at 375px.

### Phase 3 — Homepage on live data (discovery-ui; owns `page.tsx`)
- [ ] Hero with `Typewriter` (Challenge. / Race. / Podium. / Personal Best. / Medal. / Adventure.) and a static
      screen-reader sentence; the WHERE/WHEN pill routes to the directory with query params.
- [ ] Filter bar: pinned location chip + scrolling chips, each a link to a filtered directory URL.
- [ ] `EventCard` v4 exactly per spec §12a — one date, six rows, hover lift + 1.1× image zoom; poster quick
      actions: Share now (Web Share API), Interested / Save **hidden until auth**.
- [ ] `FeaturedBanner` v2 on `popular=true`: countdown chip, Ken Burns, thumbnail progress, swipe and arrow keys.
- [ ] Rails: Happening near you, This weekend, Kids & juniors, Browse by sport; organiser band (typed).
- [ ] Delete the hardcoded rails, `DiscoveryCard` on `/`, and the "FIND YOUR FINISH LINE" hero.
- **Accept:** every number on the page comes from the API; with the API stopped the rails hide and one notice
  shows (no fallback JSON on `/`); Lighthouse mobile performance ≥ 80; every rail self-hides at 0 rows.

### Phase 4 — Counts and place (events-api + data-schema)
- [ ] `GET /events/counts?groupBy=month|city|sport|state`, accepting the same filters as `/events` — feeds hero
      stats, Plan your season, city cards and menu counts in one call instead of dozens of `limit=1` probes.
- [ ] `GET /organizers?limit=&sort=events` for Organisers to follow.
- [ ] Radius: `lat`, `lng`, `radiusKm` DTO fields + PostGIS `ST_DWithin` (check first whether `events` has a
      geography column; if not, migration + backfill from city centroids).
- [ ] Frontend: Plan your season, count-led city carousel, radius control in its three placements.
- **Accept:** every new param has a DTO field (`whitelist` strips the rest — `CLAUDE.md` §6); a spec per new
  endpoint; counts equal `meta.total` of the matching `/events` query.

### Phase 5 — Accounts and engagement (realtime-auth + events-api)
- [ ] Port the Supabase JWT strategy/guard from the stale tree (GA-005), removing `super-secret-fallback`.
- [ ] `event_interests` (Interested vs Save), `entity_follows` (Follow organiser), the My calendar icon.
- [ ] Results phase 1: `results_url` + `results_status` columns and the Latest results rail.
- **Accept:** RLS checked for the browser path; server-side authorisation on every write.

### Phase 6 — Deferred (separate tasks)
Live activity stream (GA-005 gateway), clubs, marketplace (#56), guides / CMS, race-day alerts, calibre
columns, price tiers. Each one switches on its hidden section when its data exists.

## Pending from the product owner

| # | Item | Blocks |
| --- | --- | --- |
| 1 | Restore the Supabase project | everything live |
| 2 | How GA-019 lands (no merge base with `main`) | branching GA-020 |
| 3 | Palette sign-off: mockup ink / teal / CTA red vs current indigo (ADR-002) | Phase 1 |
| 4 | Logo files: SVG mark + wordmark, light and dark, favicon | Phase 2 |
| 5 | Imagery: real posters / licensed sport and city photos vs gradients (ADR-005) | Phase 3 |
| 6 | Which events are Featured (`is_popular`), and who curates them | Phase 3 banner |
| 7 | Copy sign-off: "₹0 commission, forever", organiser and seller bands, announcement text | Phases 2–3 |
| 8 | Social URLs, contact email, About / Terms / Privacy content | Phase 2 footer |
| 9 | Sign-in method (Google, phone OTP, email) | Phase 5 |
| 10 | Real event sources for athletics, youth events and closing dates | rails 8, 10, 11 |
| 11 | Marketplace go / no-go and source; alerts provider | sections 14, 18, 21 |

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Supabase reachable | **pass** (2026-10-05) | was failing 2026-09-30 (paused free-tier project); owner restored it; `GET /events` 200, 10,100 rows |
| Backend starts | pass | Nest boots and maps all routes |
| Rail coverage re-measured | pass (2026-10-05) | upcoming 7,553 · featured 5 · this weekend 18 · Bengaluru next 30 days 3 · athletics 0 · skating 0 · kids/sub-junior/junior 0 · discipline-tagged 0 |
| Migrations 0012–0020 applied | **not run** | written and syntax-checked; 0 of 24 new tables exist on the live project |

## Handoff

Not started.

## Update 2026-10-05 — decisions, schema, homepage build

**Decisions ([[03 Decisions/ADR-007-discovery-plus-ticketing|ADR-007]]):** discovery + ticketing (ticketing first);
public / unlisted / private events; seller products reviewed before sale. Existing 10,100 events are test data.

**Migrations — apply in this order in the Supabase SQL editor** (none applied yet):

| File | Adds |
| --- | --- |
| `20261001000012_enum_values.sql` — **run alone first** | new enum values (feed actions incl. `registered`, `postponed`, `waitlisted`, `seller`, `listing_correction`) |
| `…13_roles_organizers_profiles` | admin/editor/moderator roles, organiser teams + claims, public/private profile split, richer submissions |
| `…14_event_details_pricing` | start time, calibre flags, featured rank, numeric prices, ticket types (`event_categories`) + early-bird tiers |
| `…15_geo_cities_discovery` | 53 cities, geo backfill, `events_near()`, `event_counts()` |
| `…16_results` | results link, official finisher list, claim-your-result |
| `…17_reviews_media` | event reviews + ratings, photo galleries, moderation guard |
| `…18_stats_notifications_feed` | daily stats incl. registrations, `trending_events()`, notifications, alerts, live feed |
| `…19_content_collections` | collections / chips, guides, announcement bar, challenges |
| `…20_marketplace` | sellers, products (catalogue) |
| `…21_seller_commerce` | seller teams + KYC, **product review & approval**, variants/stock, merchandising rules, cart, unified orders (gear + tickets), payments, shipments, returns, coupons, seller payouts, product reviews |
| `…22_ticketing_private_events` | **visibility + publication**, organiser KYC, waves, registration forms, staff, invites, **tickets** with DB-enforced capacity, event promo codes, organiser payouts, broadcasts; replaces the "Public can read events" rule |
| `…23_event_setup` | organiser setup wizard fields (tagline, banner, end/reporting time, address + PIN, venue notes, transfer/deferral/cancellation policies, terms, **waiver**, GST mode + rate, contact + WhatsApp, safety, aid stations, amenities), per-ticket-type **eligibility** (age range + age-as-on date, required documents, qualifying standard, team size), ticket waiver/guardian fields, **agenda**, sponsors, FAQs, private **compliance documents**, and the **publish guard** |
| then `supabase/verify/verify_0012_0023.sql` | read-only checks + a private-event leak check |

**Must ship with 0022 (backend):** every events list/count/search query filters
`visibility = 'public' AND publication_status = 'published'`; single-event fetch allows `unlisted`/`private` only
with the access token (and, for private, an authorised user). Until then, do not create unlisted/private events.

**Homepage:** rebuilt from mockup rev 5 on `feat/implement-main-page-mockup` — all 25 sections, centred 1440px
column with full-bleed bands, live data where the API supports it, sample content tagged "pending" elsewhere,
no floating bottom ticker. Mobile fixes 2026-10-05: drawer grouped (page anchors, sports, cities, "coming soon"),
footer accordions closed on first paint, 44px close target, 11px label floor on phones.

**New phases this adds:** checkout + payment provider integration; ticket purchase flow (type → wave → form →
pay → QR); organiser dashboard (events, ticket types, forms, check-in, broadcasts, payouts); seller dashboard
(products → review queue → orders → shipments → payouts); admin moderation queues (products, sellers, KYC).
