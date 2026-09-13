---
type: reference
status: active
tags: [product, ui, ux, design]
---

# UI-UX improvement plan

GoAthletix's UI already has real advantages — a calendar view no competitor offers, a Tailwind v4 token
architecture, and a search bar just brought to Airbnb-grade polish — but the part of the product that
actually sells an event, the listing row, throws away data the API already returns and hides the one
field (city) that matters most on a phone. This plan ranks every field a runner needs to decide,
specifies exact row/card/badge treatments to close that gap, and separates decisions that need no new
data (do these first) from the ones that need a schema or brand call first (§8). It expands
`04 Delivery/GA-018-product-reliability-and-ux-roadmap.md` Phase 3 into buildable specs; it does not
re-audit what that note already established.

## Design principles for this product

1. **Decision fields before descriptive ones.** A runner scanning a list needs date, distance, city,
   and price before anything else. Everything else (organizer name, elevation, terrain) supports the
   decision but doesn't gate it — rank fields, don't just list them (see §2).
2. **Scannability over storytelling.** This is a directory, not a magazine. Dense, aligned columns of
   dates/distances beat large hero imagery for a list of 100 events. Save narrative treatment for a
   detail page that doesn't exist yet.
3. **Never let colour be the only signal.** Sport type, difficulty, and status must each carry a label
   or icon, because a left-border colour strip is invisible to colour-blind users and disappears at a
   glance anyway.
4. **Mobile is the primary surface, not the fallback.** Casual "what's on this weekend" browsing happens
   on a phone in a spare minute. City and date must survive to 375px; nothing decision-critical goes
   inside a `hidden md:flex`.
5. **Admit uncertainty instead of hiding it.** When data is stale, fallback, or missing (price, image),
   say so in the UI rather than presenting a synthetic seed as if it were live inventory.
6. **Trust is a rendering job, not just a schema field.** `organizer.isVerified` and `status` are already
   fetched from the API and currently invisible — surfacing existing truthful data is cheaper and more
   honest than any visual polish pass.

---

## 1. Current state — what works and what doesn't

**Working well:**
- The month calendar view (`EventsDirectory.tsx` composition) is a genuine differentiator — indiarunning.com has no equivalent.
- `globals.css:7-29` — a real `@theme` token block for color/font/animation exists and is the right pattern to extend, not replace.
- `MegaSearchBar.tsx` was just rewritten to Airbnb-bar parity — out of scope here, treated as done.
- `EventsDirectory.tsx:107-116` debounces search with an `AbortController`, and the geolocation-to-nearest-city fallback (`:42-65`) is a nice, low-cost touch.

**Weak or broken:**
- `EventRow.tsx:12` — `new Date(event.eventDate)` re-parses an already string-split ISO date, reintroducing the timezone-shift bug the split convention exists to prevent (per `CLAUDE.md` §7 / `types/events.ts:62-67`).
- `EventsDirectory.tsx:131` — `sortedEvents` sorts with `new Date(...).getTime()`, the same anti-pattern, where a plain string compare on `YYYY-MM-DD` would sort identically without re-parsing.
- `EventRow.tsx:64` — city/venue is `hidden md:flex`: the one field mobile users need most disappears exactly on mobile.
- `EventRow.tsx:45` — the event title is an `<h3>` with `cursor-pointer hover:underline` and no `href`: a fake affordance, not a real link, not keyboard-reachable, not screen-reader-announced as interactive.
- `EventRow.tsx:23-27` — sport is a 3-way colour ternary (running / cycling / everything else); triathlon, swimming, and trekking collapse into one dark bucket, and the only signal is a 4px colour strip.
- `types/events.ts:1-17` produces `priceRange`, `difficulty`, `terrain`, `elevationGain` — `EventRow.tsx` renders none of them.
- `organizer.isVerified` and `status` are selected by the backend's `EVENT_SELECT` (per GA-018) and never reach any component in this tree.
- `EventsDirectory.tsx:161-164` — loading state is a text swap ("Loading Events...") in a flex box, not a skeleton; the row list snaps into a different visual size on load.
- No stale/offline banner: when the API 500s, the fallback silently swaps in `fallbackEvents.json` (per GA-018's headline finding) — the UI has no way to represent "this is not live data" at all today.
- Three colour palettes coexist with no resolution: `@theme`'s indigo/cyan (`globals.css:10,12`), hardcoded hex scattered through `EventRow`/`layout.tsx`/`CategoryGrid` (`#141A3E`, `#2055DC`, `#181427`, `#DBDBE7`, `#737582`, `#F6F6F9` — none of these are theme tokens), and `MegaSearchBar.tsx:33-34`'s Airbnb red `ACCENT = "#FF385C"`.
- `layout.tsx:40` — header is `absolute` with a black-to-transparent gradient over the hero photo; readable there, but every non-hero page (calendar view, sport/location pages) puts that same header over a flat `#141A3E` band, not photography, so its contrast is untested against solid dark backgrounds ­— worth a check, not an assumption.
- `page.tsx:29` — hero is a fixed `h-[600px] md:h-[700px]`; on short viewports (landscape phone, small laptop) this clips the search bar or pushes it partly off-screen, per GA-018 and per the layout's own comment at `:26-28`.

---

## 2. Event presentation — the core problem

### Field-priority hierarchy

| Tier | Fields (from `NormalizedEvent`) | Why | Where it appears |
| --- | --- | --- | --- |
| **Tier 1 — decision-gating** | `eventDate` (+`endDate`), `distanceOptions`, `city` | A runner filters mentally on "when," "how far," "how close" before anything else | Row: always visible, never collapsed. Card: always visible. Detail: headline block |
| **Tier 2 — decision-shaping** | `priceRange`, `difficulty`, `sportType`, registration `status` (API field, not yet in `NormalizedEvent`) | Confirms the event is affordable, at the right skill level, in the right sport, and still open | Row: pill badges. Card: badge row. Detail: prominent |
| **Tier 3 — confidence-building** | `organizerName`, `organizer.isVerified`, `venue`, `state` | Builds trust and precise logistics once Tier 1–2 have already qualified the event | Row: secondary line, small type. Card: secondary line. Detail: full |
| **Tier 4 — supporting detail** | `terrain`, `elevationGain` | Matters to a subset of trail/trek users, not to a road-race browser | Row: **omit** (space-constrained). Card: small icon-text pair. Detail: full |
| **Tier 5 — not shown / not useful today** | raw `registrationUrl` string, internal `id` | Mechanical, not user-facing content | Nowhere as text; `id` is a key only, `registrationUrl` is only ever an `href` |

### Row spec (`EventRow.tsx` revision)

Fixed structure, `min-h-[4.5rem]` (72px) preserved — order left to right, nothing in this list may be `hidden` below 768px except where marked:

1. **Date box**, 64px wide (80px ≥ 640px) — unchanged position, but computed from the split string only: `const [y, m, d] = event.eventDate.split('-')`. Weekday label needs a lookup table (`WEEKDAY_LABELS`-style, per `page.tsx` conventions), not `Date.toLocaleDateString`, since `Date` construction is exactly what's banned. Day number 20px/24px bold, weekday label 10px/12px uppercase tracked.
2. **Sport icon + label**, 56px wide (80px ≥ 640px) — replace the colour ternary with a 5-way icon+colour pairing (see badge system below). Icon 16px, label 9px/10px uppercase beneath it — never colour alone.
3. **Main column** (`flex-1`, min 0) — two lines, never collapses:
   - Line 1: event name as a real `<a>`/`next/link` (see a11y §4), 14px/16px bold, 2-line clamp reserved — but at row height 72px only 1 line fits, so `truncate` stays, with `title` attribute for full text on hover/long-press.
   - Line 2: organizer name (12px, `text-[#737582]`-equivalent token) + `·` + distance chips, comma-joined, 12px, accent colour. **Add**: a third segment, price pill — `priceRange` at 11px bold in a rounded 4px badge, immediately after distance. This is the single highest-value "render what we already have" change (GA-018 Phase 3 item 2).
4. **City column**, 160px (192px ≥ 1024px) — **remove `hidden md:flex`.** At 375px, collapse to city name only (venue/state line drops); from 640px show venue/state as a second line. This is non-negotiable per principle 4.
5. **Badges row** (new, sits between main column and location on ≥1024px, or wraps beneath the main column at <1024px): difficulty pill + verified-organizer check + registration-status chip. See badge system.
6. **Actions**, 96px (128px ≥ 640px) — unchanged Tickets/Add buttons, but both must be ≥44px tall tap targets on touch (currently `py-1.5` ≈ 28px effective height — see §4 acceptance criteria).

Type scale for the row: 20/24 (date number) · 14/16 (title) · 12 (secondary/organizer/distance) · 11 (badges) · 9/10 (uppercase labels). Spacing: 8px internal padding per segment, 1px `#DBDBE7`-equivalent token dividers between segments (kept from current design — it reads as a timetable, which is appropriate for this content).

### Card spec (new `EventCard`, fed by `NormalizedEvent`)

Benchmarked against indiarunning's measured 384×504px / 20px-radius card, adapted for **no event image field**:

- **Card size**: 320×280px fixed (desktop grid), scales to card width 100% / auto height on mobile single-column. Shorter than indiarunning's because there is no image to fill vertical space — cards that fake a 504px height with no photo just look empty.
- **Top strip**, 6px tall, full width: sport colour (see badge system) instead of a photo — this is the "image replacement" signal, cheap and honest about the no-imagery constraint.
- **Header row** (16px padding): date badge, 48×48px square, day number 18px bold + month abbrev 10px uppercase — same values as the row's date box, reused as a component so date rendering logic exists in exactly one place.
- **Event name**: 16px bold, 2-line clamp (`-webkit-line-clamp: 2`), directly right of the date badge.
- **Organizer + city/venue line**: 12px, one line, `MapPin` icon reused from `EventRow.tsx:66`.
- **Distance chips**: same component as the row's, wrapped if >3.
- **Badge row**: price pill + difficulty pill + verified-organizer + registration-status chip — identical badge components to the row, just larger touch targets (card is not space-constrained the way a 72px row is).
- **Footer, pinned bottom** (mirrors indiarunning's bottom-right CTA pattern): registration-status copy left-aligned ("Closing in 4 days"), "Register →" button right-aligned, full accent colour, 44px min height.
- **Border**: `1px solid` border token, `border-radius: 16px` (slightly less than indiarunning's 20px, proportional to this card's smaller footprint), subtle shadow on hover only (`glass-panel-hover` pattern already exists in `globals.css:101-110` — reuse it rather than inventing a new hover treatment).

### Badge system

| Badge | Values | Shape/colour | Non-colour signal |
| --- | --- | --- | --- |
| **Difficulty** | Beginner / Intermediate / Advanced / Expert | Rounded-rect pill, 4 shades of one hue scaling light→dark by difficulty | Always paired with the text label, never a bare dot |
| **Terrain** | Road / Trail / Track / Mixed (card/detail only, per Tier 4) | Outlined pill, icon (road, mountain, track, shuffle) + text | Icon + text, no colour meaning at all |
| **Virtual / on-ground** | `isVirtual` boolean (already in schema per `CLAUDE.md` §5) | Small icon badge — wifi icon for virtual, location-pin icon for on-ground | Icon shape carries the meaning, colour is decorative only |
| **Registration status** | `registration_open` / `upcoming` / `running` / closed-derived | Text chip, not colour-only: "Open," "Opens \[date\]," "Closing soon," "Closed" — urgency copy per GA-018 Phase 3 item 3 | Full word, not a coloured dot |
| **Verified organizer** | boolean `organizer.isVerified` | Small checkmark badge directly after organizer name, `aria-label="Verified organizer"` | Checkmark icon + tooltip text, never colour alone |

**Sport colour scale** (extends the current 2-colour ternary to all 5 sports, per §6): Running, Cycling, Triathlon, Swimming, Trekking each get a distinct hue from one consistent ramp — proposed as new `@theme` tokens `--color-sport-running`, `--color-sport-cycling`, `--color-sport-triathlon`, `--color-sport-swimming`, `--color-sport-trekking` (exact hex TBD with the palette decision in §8, since sport colours should derive from whichever brand palette wins, not be chosen independently).

---

## 3. States

- **Loading**: replace the "Loading Events..." text block (`EventsDirectory.tsx:161-164`) with 6 skeleton rows, each `min-h-[4.5rem]` (matching the real row height exactly, so nothing jumps on load), grey animated-pulse blocks for the date box, title line, and badge row. No copy needed — the pulse itself communicates loading.
- **Empty** (current: "No events match your criteria" + Reset button, `EventsDirectory.tsx:167-177` — keep the button, refine copy):
  - Headline: "No events match these filters"
  - Subtext: "Try a different month, or clear your search and location filters."
  - Keep the existing "Reset Filters" button.
- **Error** (new — does not exist today; the API failure is currently invisible):
  - Only shown when the fetch truly fails *and* no fallback data is available: "We couldn't load events right now. Showing nothing to avoid guessing — try again in a moment." with a "Retry" button that re-triggers `fetchEvents`.
- **Stale/offline fallback banner** (new — the single highest-priority state per GA-018's headline finding): a persistent, non-dismissible strip above the event list, not a toast:
  - Copy: "Showing saved sample events — we're having trouble reaching live listings. Check back soon."
  - Treatment: `#F6F6F9`-equivalent background, left icon (WifiOff or AlertTriangle from `lucide-react`, already a dependency), 12px text, sits directly beneath the month header bar (`EventsDirectory.tsx:151-158`) so it's impossible to miss but doesn't block the calendar.
  - Trigger: rendered whenever the `catch` branch in `fetchEvents` (`EventsDirectory.tsx:89-104`) is reached, i.e., exactly when fallback data is used.

---

## 4. Accessibility

| Issue | Fix | Acceptance criteria |
| --- | --- | --- |
| Fake link at `EventRow.tsx:45` | Replace `<h3>` with `<Link href={...}>` wrapping the text (blocked until a `slug`/detail route exists per GA-018 §2.6 — until then, wrap in `<a href={event.registrationUrl}>` so it is at least a real, keyboard-reachable link, not a dead-end placeholder) | Tab key reaches the title; `Enter` activates it; axe DevTools reports zero "non-interactive element with click handler" violations on this row |
| Heading order | `EventsDirectory.tsx:152` (`h2` month title) has no preceding `h1` on `/sports/[sport]` and `/locations/[city]` pages that already render an `h1` (`sports/[sport]/page.tsx:25`, `locations/[city]/page.tsx:33`) — audit the homepage, which currently has no page-level `h1` at all (`page.tsx:39` is inside the hero, uppercase-styled, needs a real semantic check) | Every route has exactly one `h1`, and heading levels never skip (no `h2` without an ancestor `h1`) |
| Colour-only meaning | Sport ternary (`EventRow.tsx:23-27`) and any status/difficulty treatment | Every badge listed in §2's badge system carries a text label or distinct icon shape, verified with a greyscale screenshot test — nothing should become unreadable in grey |
| Focus visibility | No visible focus ring audited anywhere in `EventRow.tsx`, `MegaSearchBar` buttons excluded (already reviewed) | Every interactive element (row title link, Tickets link, Add/Remove button, calendar cell) shows a `:focus-visible` outline ≥2px, contrast ratio ≥3:1 against its background |
| 44px targets | `EventRow.tsx:82-97` Tickets/Add buttons render at `py-1.5` (≈28px effective tap height) | Both buttons measure ≥44×44px hit area on touch viewports (375px), verified against the CSS box model, not just visual size |
| `prefers-reduced-motion` | `LiveTicker.tsx:61,69-84` (continuous `animate-ping` + framer-motion slide/fade every 4s) and `globals.css:23-28` (`--animate-ticker` CSS keyframe) both run unconditionally | Wrap both in `@media (prefers-reduced-motion: reduce)` guards that freeze position/opacity instead of animating; `animate-ping` swapped for a static dot |
| Header contrast | `layout.tsx:40` header is `absolute` + gradient, tuned for the hero photo, but reused verbatim on non-hero pages where the band behind it is flat `#141A3E` (`sports/[sport]/page.tsx:23`, `locations/[city]/page.tsx:31`) | Confirm (by reading computed contrast ratios of the white nav text against both backgrounds — hero gradient and flat `#141A3E`) that both meet WCAG AA 4.5:1; if the flat band fails, give non-hero pages a non-transparent header variant |

---

## 5. Responsive

| Breakpoint | Behaviour |
| --- | --- |
| **375px** | Row: date box + sport icon + title/organizer/distance + actions stay; city column *no longer hidden* (fix from §1) — collapses to city name only, venue/state line dropped. Badge row (difficulty/status/verified) wraps beneath the title line rather than disappearing. Card grid: 1 column, card width 100%. Hero (`page.tsx:29`, fixed `h-[600px]`) is the acute risk here: on a 375×667 viewport the search bar plus headline can exceed 600px and get clipped — needs either a `min-h` + content-based height, or an explicit reduced hero height at this breakpoint (e.g., `h-[520px]` at <400px width) rather than a fixed value tuned for desktop. |
| **768px** | City column reappears with venue/state line. Badge row moves inline after the main column. Card grid: 2 columns. Sport label text (currently `hidden`/abbreviated at `sm:` in `EventRow.tsx:38`) shows in full. |
| **1440px** | Full row layout as specced in §2 (all 6 segments inline). Card grid: 3–4 columns depending on container width (`max-w-[1440px]` container already used elsewhere, e.g. `EventsDirectory.tsx:148`, `SectionSlider.tsx:29` — reuse that constant rather than introducing a new max-width). |

The fixed-height hero (`page.tsx:29`, `h-[600px] md:h-[700px]`) is flagged as a standing risk beyond just 375px: any viewport shorter than the fixed height (landscape tablet, laptop with browser chrome) will clip the headline/subhead/search-bar stack, since nothing inside scales down with viewport height today.

---

## 6. Design system hygiene

**The three-palette problem** (indigo/cyan `@theme` tokens vs. scattered hardcoded hex vs. `MegaSearchBar`'s Airbnb red) is a decision, not a cleanup — see §8. Whatever is chosen, the mechanical fix is the same:

- Every hardcoded hex in `EventRow.tsx`, `layout.tsx`, `CategoryGrid.tsx`, `DiscoveryCard.tsx` (`#141A3E`, `#2055DC`, `#181427`, `#DBDBE7`, `#737582`, `#F6F6F9`) becomes a named `@theme` token in `globals.css` — e.g. `--color-ink` (`#181427`/`#141A3E` merge candidates), `--color-border-subtle` (`#DBDBE7`), `--color-muted-text` (`#737582`), `--color-surface-alt` (`#F6F6F9`) — then components reference `bg-[var(--color-surface-alt)]`-style utilities instead of literal hex, so a future palette swap is a one-file change.
- `globals.css` is listed in `CLAUDE.md` §10 as a serial resource — this token migration is one task, not split across parallel agents.

**Proposed token set** (names only — final hex values wait on the palette decision in §8):

```
--color-primary        (brand primary — candidate: keep #2C3D8F or reconcile with search bar's red)
--color-accent         (already exists: #37DAC3)
--color-ink            (near-black text — reconcile #141A3E / #181427)
--color-border-subtle  (#DBDBE7)
--color-muted-text     (#737582)
--color-surface-alt    (#F6F6F9)
--color-sport-running
--color-sport-cycling
--color-sport-triathlon
--color-sport-swimming
--color-sport-trekking
```

**Sport-colour scale, all 5 sports** (today only running/cycling are covered, per §1): the scale should be one consistent ramp (e.g., 5 evenly-spaced hues at matched saturation/lightness) so no sport reads as more "default" than another, and each colour must clear 3:1 contrast against both the row's white/near-white background and the card's badge background.

---

## 7. Prioritised backlog

| Change | Why it helps a user decide | Effort | Depends on |
| --- | --- | --- | --- |
| Fix `EventRow.tsx:12` + `EventsDirectory.tsx:131` date re-parsing | Prevents an event silently showing the wrong day | S | none |
| Render `priceRange` + `difficulty` badges on the row | Price and skill level are Tier-2 fields already fetched and currently invisible | S | none |
| Un-hide city at 375px (`EventRow.tsx:64`) | Restores the #1 mobile-critical field | S | none |
| Registration-status urgency copy | Matches competitor behaviour with zero new data | S | none |
| Verified-organizer badge | Trust signal, already in the API payload | S | none |
| Real link on event title | Makes the row's only strong affordance actually work | S | detail route/slug (GA-018 §2.6) for a true internal link; interim external-link fallback needs none |
| Skeleton loader | Removes layout jump on load, reads as more reliable | S | none |
| 5-way sport icon system | Fixes a colour-only, 3-bucket-for-5-sports bug | S | sport colour tokens (below) |
| `prefers-reduced-motion` guards | Accessibility fix, no visual regression for anyone else | S | none |
| Stale/offline banner | Turns a silent trust failure into an honest, visible state | S | none |
| Route hardcoded hex through `@theme` tokens | Unblocks every other visual change from fighting inconsistent colours | M | palette decision (§8) |
| Sport colour scale (5 sports) | Supports the icon system above with real tokens | M | palette decision (§8) |
| New `EventCard` variant | Gives listings a second, denser-per-glance presentation mode | M | token migration (recommended, not required) |
| `next/image` + image strategy | Only relevant if event imagery is adopted | M | event-imagery decision (§8) |
| Move `EventsDirectory` off client-only fetch | Improves first paint and crawlability, not a visual change but affects perceived polish | M | none, but overlaps events-api work |

Ordered so “render data already in hand” wins come before anything requiring a new decision or new data.

---

## 8. Open decisions

1. **Brand palette.** Three candidates coexist: the `@theme` indigo/cyan (`--color-primary: #2C3D8F`, `--color-accent: #37DAC3`), the scattered hardcoded near-black/grey set (`#141A3E`, `#181427`, `#737582`, `#DBDBE7`, `#F6F6F9`), and `MegaSearchBar`'s Airbnb red (`ACCENT = "#FF385C"`, `MegaSearchBar.tsx:33`). Trade-offs: indigo/cyan is already the theme-token source of truth and cheapest to keep; adopting red everywhere would make the just-finished search bar consistent with the rest of the UI but requires re-touching a component explicitly marked done; keeping all three means the design-system-hygiene work in §6 has no fixed target. This plan does not choose.
2. **Event imagery.** `Event` has no image field at all (`CLAUDE.md`, confirmed in `types/events.ts`) — only `Organizer.logoUrl`. Options: (a) stay text-first, investing further in typography/badges/layout as this plan specs; (b) add an `imageUrl`/media field and a CDN strategy, unlocking a photo-led card closer to indiarunning's; (c) use `Organizer.logoUrl` as a small badge/watermark rather than a hero image, a middle path needing no schema change. Each has a different cost and a different card layout — this gates whether the card spec in §2 stays icon/typography-led or becomes photo-led.
3. **Card vs. row as the primary listing mode.** The row (timetable-style, dense, calendar-adjacent) suits quick scanning of many events; the card (visual, one focal event at a time) suits browsing fewer, higher-consideration events. Options: keep the row as primary and add the card only for curated/"Major Events" sections (consistent with today's `DiscoveryCard` usage pattern in `page.tsx`); or let users toggle list/grid view for the full directory, doubling the components to maintain. This plan specs both (§2) but does not pick which is default.

Decisions 1 and 2 are now tracked as [[03 Decisions/ADR-002-brand-palette|ADR-002]] and
[[03 Decisions/ADR-005-event-imagery|ADR-005]].

---

## 9. Homepage composition — what goes below the search bar

Requested 2026-09-09: show "best events" on the homepage at launch, in the manner of
indiarunning.com. Recommended section order below the search bar, chosen so that **every rail above
the fold can be built from data that already exists**:

| # | Section | How it is derived | New data needed |
| --- | --- | --- | --- |
| 1 | **Featured events** (rail, 4–6 cards) | Rank by: `organizer.isVerified` → `status = registration_open` → nearest `start_date`. No editorial flag needed initially. | none |
| 2 | **This weekend / This month** (rail) | Date-derived from the events already fetched. | none |
| 3 | **Browse by distance** (chip row) | `distanceOptions[]` — 5K / 10K / Half / Marathon / Ultra. Links to `/distance/[slug]`. | a DTO filter field |
| 4 | **Browse by sport** (existing `CategoryGrid`) | Existing, but replace the **hardcoded counts** with real aggregates. | a counts endpoint |
| 5 | **Popular cities** (existing rail) | Existing `/locations/[city]` routes, same caveat on counts. | a counts endpoint |
| 6 | **Full directory** | The existing `EventsDirectory`, with filters. | none |

Design notes:

- **"Best" must be defensible.** With no ratings, no registration counts and no traffic data, any
  "best" label is unearned. Prefer honest framings the data supports — *Featured*, *Closing soon*,
  *Starting this weekend*, *Newly added* — and introduce *Popular* only once there is a signal behind
  it. This matters more than it sounds: a discovery product's credibility is the product.
- **Put a rail of real events immediately below the search bar.** Today the first thing under the
  hero is a Sports category grid, so a visitor sees taxonomy before they see a single event. Leading
  with events is the single biggest change to how populated the site feels.
- **Rails need cards, cards want images**, and `Event` has no image field — so this section depends on
  [[03 Decisions/ADR-005-event-imagery|ADR-005]]. The recommendation there (deterministic sport-coded
  gradient placeholders first) exists precisely so these rails can ship before any migration.
- **Cap each rail at 6–8 items** with a "View all" that lands on a filtered directory URL, so the
  homepage stays a launcher rather than a second directory.
- **Rails must degrade.** With `/events` currently returning 500 the homepage would show empty rails;
  each rail needs a skeleton, and the stale-data banner from §3 applies to the whole page.
