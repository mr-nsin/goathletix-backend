---
id: GA-016
type: task
status: ready
priority: P1
owner: unassigned
branch: unassigned
worktree: unassigned
scope: []
acceptance: []
depends_on: [GA-002, GA-003, GA-008, GA-011]
related: [GA-004, GA-005]
---

# GA-016 Reach fixturecalendar.com structural parity

## Goal

Close the structural gap between GoAthletix and **fixturecalendar.com** — chiefly that GoAthletix
is one client-rendered URL with no routes, no event detail page, no per-city/per-sport landing
pages, and no crawlable metadata, while the competitor is a programmatic SEO lattice where every
country, city, sport, team, competition and event is its own indexed page.

This note is a **backlog and gap analysis**, not a single unit of work. Split it into child tasks
before opening any branch — the acceptance criteria below are deliberately per-slice.

## Research status — read this before trusting the competitor half

`fixturecalendar.com` **could not be fetched from this network.** Every HTTP path returned a 302 to
the corporate web filter (`cgi-bin/blockpage.cgi`); direct `curl` and proxied `curl` both failed to
connect. The misspelling `fixturecalender.com` does not resolve — the real domain is
`fixturecalendar.com` (Fixture Calendar Ltd, UK, with iOS + Android apps).

Consequently the competitor findings below are derived from **search-result URLs, titles and
snippets only**. Verified route patterns and titles are trustworthy. The following are **NOT
verified** and must be confirmed in an unblocked browser session before any design commits to them:

- calendar view types, density, and how multi-day fixtures render
- JSON-LD / structured-data types actually emitted
- facet URL-parameter encoding
- visual system (palette hexes, typography, card-vs-row treatment)
- whether an organizer event-submission flow exists at all

### Prior art in `scratch/`

`scratch/layout_analyzer.py` (Playwright, 1440x900, filters elements wider than 300px) and
`scratch/scrape_text.py` (urllib + BeautifulSoup, hunts `a[href*="/event/"]`) both target the site,
but **neither committed any output** — `layout_results.json` is absent. They establish methodology
and the expectation of `/event/…` links, nothing more. Effectively all teardown work is outstanding.

## Verified competitor route lattice

Flat, hyphen-prefixed slugs rather than nested segments:

| Pattern | Confirmed example | Title pattern |
| --- | --- | --- |
| `/` | — | "The World's Sporting Events \| Fixture Calendar" |
| `/explore/all-fixtures` | — | "Explore Global Sporting Events \| Fixture Calendar" |
| `/country-<slug>` | `/country-india` | "Sports Fixtures and Events in India \| Fixture Calendar" |
| `/city-<slug>` | `/city-mumbai`, `/city-pune` | "Sports Events in Mumbai, India \| Fixture Calendar" |
| `/sport-<slug>` | `/sport-cricket` | "Cricket Fixtures, Tickets & News \| Fixture Calendar" |
| `/sport-<slug>/team-<slug>-<id>` | `/sport-cricket/team-india-1` | "India Cricket Fixtures & News \| …" |
| `/competition-<slug>/event-<slug>` | `/competition-marathons/event-sco-kunming-international-marathon` | "SCO Kunming International Marathon \| …" |
| `/index`, `/index/competitions`, `/index/events` | — | crawlable hub/link-farm pages |

Filter taxonomy (from snippets): sport, competition, team, dates, city, country, event, **gender**.
Fixture fields exposed: name, date/time **with timezone**, venue, city, country, sport, competition,
team(s), gender, plus out-links to tickets, merchandise, travel and news/highlights. Personalisation:
a personal calendar with **change notifications**, no sign-up required to browse.

**Important product caveat:** fixturecalendar is a *spectator/league-fixtures* product (cricket,
football, motorsport, rugby). GoAthletix is a *participation-registration* product. Copy its
information architecture and SEO discipline; do **not** copy its team/gender/competition axes
wholesale unless the product genuinely pivots toward spectator sport.

## Gap table

| Capability | fixturecalendar | GoAthletix today | Severity | Effort | Maps to |
| --- | --- | --- | --- | --- | --- |
| Event detail page | indexed per event | none — `GET /events/:id` exists, no UI consumes it | blocker | M | new |
| Per-city landing pages | `/city-<slug>` globally | none live (stale tree only) | blocker | M | GA-004 |
| Per-sport landing pages | `/sport-<slug>` | none live (stale tree only) | blocker | M | GA-004 |
| Any routing at all | deep lattice | single `/` client page | blocker | M | GA-008 |
| Real page metadata | templated per entity | `title: "Create Next App"` | blocker | S | GA-011 |
| Env-driven API URL | n/a | `localhost:3000` hardcoded | blocker | S | GA-003 |
| Structured data (JSON-LD) | assumed `SportsEvent` (unverified) | none | major | S | new |
| Sitemap / robots | assumed present | none | major | S | new |
| Faceted search with URL params | 8 facets, shareable | 4 filters, state-only, no shareable URL | major | M | new |
| Free-text search quality | full search | `ilike` on `event_name` **only** | major | S | new |
| Multi-day event handling | fixtures span ranges | API filters a single `event_date` | major | M | GA-002 |
| Saved events / personal calendar | server-side, cross-device | `seasonPlan` in React state, lost on reload | major | L | GA-005 |
| Change notifications | yes | none (`Reminder` model unused) | major | L | new |
| Index/hub pages | `/index/*` | none | major | S | new |
| Aggregate counts | real | **hardcoded** 4,210 / 3,150 / 1,820 / 920 in `#browse` tiles | major | S | new |
| Timezone-correct start times | explicit | `@db.Date` only, no time column | minor | M | new |
| Native apps | iOS + Android | none | minor | L | — |

## Data gaps — fields the schema/API cannot supply today

No column exists in `Event` for: start **time** + timezone; a **competition/series** entity (their
entire `/competition-*` axis); **teams/participants**; **gender** category; a **ticket URL** distinct
from `registrationUrl`; news/highlights/merch out-links; long **description** copy; **hero image**
(only `Organizer.logoUrl` exists); post-event **results**; and critically a **`slug`** — IDs are
UUIDs, so any event route today would be `/events/<uuid>`, which is SEO-dead.

`geoLocation` exists as PostGIS `geography(Point,4326)` but is **absent from `EVENT_SELECT`**, so
map / near-me features are unreachable from the API even though the data is modelled.

## Route plan to adopt

Keep Next-idiomatic nested segments rather than the competitor's flat `city-mumbai` scheme — same SEO
value, cleaner App Router:

`/events/[slug]` · `/cities/[city]` · `/sports/[sport]` · `/cities/[city]/[sport]` (the city×sport
crossing is where programmatic volume comes from) · `/calendar/[year]/[month]` · `/organizers/[slug]`
· `/browse` hub · plus `sitemap.ts`, `robots.ts`, per-route `generateMetadata`, and `SportsEvent`
JSON-LD on detail pages.

## Acceptance criteria

Per-slice; tick only what the corresponding child task delivered.

- [ ] Ground truth established for GA-002 (`event_date` vs `start_date`/`end_date`) against the live table
- [ ] `slug` column added (unique, generated from name + city + year) with a backfill
- [ ] `/events/[slug]` server component with `generateMetadata` + `SportsEvent` JSON-LD
- [ ] `/cities/[city]` and `/sports/[sport]` live in the authoritative frontend (not the stale tree)
- [ ] `sitemap.ts` and `robots.ts` emitting all generated routes
- [ ] Filters encoded in `searchParams` so a result set is shareable and crawlable
- [ ] `search` widened beyond `event_name` to city / venue / organizer
- [ ] `#browse` tile counts come from real aggregates, not hardcoded strings
- [ ] An unblocked browser teardown of the four unverified areas listed above is recorded

## Implementation notes

- **Sequencing matters.** GA-002 must resolve first: every route, calendar and detail page depends on
  knowing which date column is real. Then GA-003 + GA-011 (both trivial, and GA-011 gates all SEO
  work). Then GA-008, because no second route can be built cleanly while `page.tsx` is one
  1500-line client component.
- Porting `locations/[city]` / `sports/[sport]` out of the stale `goathletix-backend/frontend/` tree
  (GA-004) requires fixing `params` to be awaited (Next 16) and dropping that tree's `#141A3E` /
  `#37DAC3` palette for the live orange theme.
- Adding a `slug` column and any competition/gender axis is a `data-schema` barrier task — serialise it.
- Do not copy competitor page text, markup, or brand assets. Adopt structure and SEO patterns only.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Fetch fixturecalendar.com | **blocked** | 302 to corporate filter blockpage on every path; curl direct + proxied both failed to connect |
| Read `scratch/` prior art | done | `layout_analyzer.py`, `scrape_text.py` present; no committed output |
| Audit live frontend routes | done | `src/` is 6 files, single `/` route, no `next/link`, no dynamic segments |
| Audit `/events` API surface | done | `GET /events`, `GET /events/:id`; `GetEventsQueryDto` exposes search/sport/city/difficulty/month/year/page/limit |
| Confirm GA-002 drift | done | service selects `event_date`; `schema.prisma` defines `startDate`/`endDate` |

## Handoff

Not started — no implementation work has been done under this id.
