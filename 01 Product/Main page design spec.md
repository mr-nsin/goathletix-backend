# Main page design spec

- **Date:** 2026-09-16, revised 2026-09-17 against `Competitor homepage research.md`
- **Status:** Accepted, with one correction the research forced (see §2a) — WHO demoted from the
  search bar to a rail + composed chips. Section 3 and card anatomy (§4) are updated accordingly.
- **Supersedes:** `UI-UX improvement plan.md` §9 (homepage composition), which predates the
  athletics-first broadening and the 0005–0011 schema work.
- **Related:** [[03 Decisions/ADR-006-sport-taxonomy-two-axis|ADR-006]],
  `docs/21-platform-expansion-vision.md` §6, `01 Product/Competitor homepage research.md`

---

## 1. Brand purpose

> **To make competing in sport a decision, not an accident.**

Straight from `docs/02-problem-statement.md`: discovery today happens by WhatsApp forward,
Instagram scroll and club chatter. Every element on the main page must either **prove the events
exist** or **help someone act on one**. Anything that does neither comes off.

| Pillar | What it means in the UI |
| --- | --- |
| **Completeness** | Data is the product. Show volume and density; never a taxonomy wall. |
| **Neutrality** | We link to the organiser and never own the transaction. "Register" always leaves the site. |
| **Inclusion** | Every age, every sport. A 10-year-old skater counts as much as a sub-4 marathoner. |
| **Trust** | No fabricated listings. No "Popular" without a signal behind it. |

### The headline contradicts the brand

The hero currently reads **"FIND YOUR FINISH LINE."** A gymnastics meet has no finish line. Nor
does a badminton bracket, a karate tournament or a chess match. That line was written for an
endurance product and it silently excludes the entire youth and multi-sport scope the schema now
supports.

**DECIDED 2026-09-23: "Find Your Next Challenge."** Sub-head: *Every event, every age, one place.*

It clears the objection above — a gymnast, a chess player and a karateka all have a next challenge,
and none of them have a finish line — while keeping the second-person call to action that
"Where India competes" gives up. "Where India competes" is a statement about the platform;
"Find Your Next Challenge" is an instruction to the athlete, and the athlete is who lands here.

---

## 2. Which model — and why not the obvious three

| Site | Model | Why it does not transfer |
| --- | --- | --- |
| indiarunning.com | Events first | Closest to right, but works because they have **one sport**. We have 12. |
| townscript.com | Categories first | A general marketplace spanning unrelated verticals. We are already one world: sport. |
| fixturecalendar.com | Team / league first | Built for **spectator** sport. Ours is participatory. |

The real structural analogue is **Airbnb**: a large multi-dimensional inventory, a persistent
multi-axis search bar, dense result rails, and a refusal to lead with categories.

**`MegaSearchBar` is already built on that model and already carries the three axes — WHERE, WHEN,
WHO — plus sport. The bar is correct. The page below it never caught up**, and still opens with a
category grid and hardcoded cards.

### The governing theory

The main page is an **eligibility feed**: *"events I can enter, near me, soon, for my age group."*
Not a catalogue, not a fixture list. **Sport is a secondary filter, never the entry point**,
because a parent's real query is "skating, under-12, Pune" — three axes that a category grid
answers one of.

### 2a. Correction from research: WHO is a rail, not a bar axis

The original draft put WHERE/WHEN/WHO as three co-equal search-bar axes. Eleven sites were
checked against that claim and it does not hold: **no competitor surfaces age at the top level**
— not indiarunning, not any federation (AAU, USA Gymnastics), not Airbnb itself. active.com gets
closest with a "Kids & Family" nav category and one trending chip, and that is the ceiling
observed across the set.

That is not proof WHO is wrong — it is proof it is **unclaimed**, which is exactly why §3 keeps it
as the flagship rail. But three axes plus sport in one pill is already a lot at 375px, and there
is zero market precedent that users expect age *inside the search bar*. Corrected model:

- **WHERE + WHEN stay in the search bar** — well evidenced (indiarunning's nav, Airbnb's pill
  itself).
- **WHO moves to a dedicated rail** ("For kids & juniors near you", §3.5) **and composed chips**
  ("U12 Skating", "Kids near me") rather than a raw age-checkbox row. A composed chip is a
  pre-built query, which is how active.com exposes breadth without a filter matrix.
- Promote WHO into the bar later **only if usage data shows demand** for it there. Until then the
  rail carries the differentiation — the bar axis was never what made it valuable.

Sport stays out of the bar too, but not banished: Airbnb — this spec's own analogue — keeps a
slim category tab row above its pill. A **sticky, slim, horizontally-scrolling sport row** is
on-model; a full-screen tile grid as the entry point is the actual anti-pattern.

---

### 2b. Correction from review (2026-09-23): the competitive athlete is the primary persona

The draft optimised for one persona — a parent searching for a child — and the age rail sat third
on the page. That is a positioning error. A 32-year-old marathoner landing on a page whose first
rail is "For kids & juniors" concludes in under two seconds that the site is not for them, and
that user is the one who enters 4–8 events a year, pays the entry fees, and brings a club with them.

The two personas ask structurally different questions:

| | The parent (discovered in §2a) | The competing athlete (under-served in the draft) |
| --- | --- | --- |
| Query shape | "skating, under-12, Pune" | "certified 21K, within 150 km, before my A-race" |
| Decisive axes | sport + age + distance from home | **discipline + calibre + calendar position** |
| What kills a listing | wrong age bracket | uncertified course, no chip timing, clashes with another event |
| Return trigger | next season | **the results page, the week after** |

**Calibre is the field the schema does not have and the athlete cares about most.** Choosing between
two 10Ks on the same weekend is decided by whether the course is AIMS/AFI-certified, whether timing
is chip-based, and whether the race counts toward a ranking or a selection trial. Recreational
entrants ignore all three; serious entrants consider nothing else. See §6 for the columns.

**The resolution is not to demote the age rail — it is to stop letting it lead.** Age stays the
differentiator (§3 still holds: no competitor surfaces it), but a differentiator earns its place
*after* the universal rails, not before them. Universal rails — near you, this weekend, closing
soon, popular now — serve every persona including the parent. The kids rail serves one. Order them
by audience size, then personalise: once a profile declares an age category, rail 7 swaps to
"Events at your level" and the kids rail only leads for accounts with a junior in the family.

---

## 3. Section order

Revised 2026-09-23. Changes from the first draft: the hero and the featured carousel are **merged**
(0→1), a real-signal "Popular" rail is added (6), the kids rail moves from 3rd to 7th and becomes
persona-swappable (§2b), and a results rail is added (8).

| # | Section | Query behind it | Ready? |
| --- | --- | --- | --- |
| 0 | **Header, two rows** — utility (logo, city selector, search, login, "List your event") over browse (Sports mega-menu, Cities, Calendar, Clubs, Results, **Shop**, Guides, **For organisers**). See §7 | taxonomy + `lib/locations.ts` | to build |
| 1 | **Hero** — headline + sub + search pill, ~320px. Revised 2026-09-23: the carousel is no longer merged into it, see §7a | — | ready |
| 2 | **Filter bar** — pinned location chip + horizontally scrolling composed chips + "All filters". See §3a | taxonomy + counts | to build — not a raw 12×6 filter grid |
| 2b | **Featured events** — full banner, info strip and thumbnail navigation below it. See §7a | `is_featured` (#55) | needs column |
| 3 | **Happening near you** — with an inline radius control, not just a city name. See §3a | geo + `ST_DWithin` | needs lat/lng/radius params |
| 4 | **This weekend** | date window | ready |
| 5 | **Registration closing soon** | `registration_closes_at` <= 14d | column empty, do not fake it |
| 6 | **Popular right now** — only once a real signal exists | `interest_count` / `view_count` | 0 on all rows — until then this rail does not render, and the carousel (1) carries curation instead |
| 7 | **For kids & juniors** / persona-swapped to "Events at your level" | `age_categories` | needs data — the differentiator, no longer the opener (§2b) |
| 8 | **Latest results** — events that finished in the last 14 days with results published | `results_status` (#53) | needs build |
| 9 | **Gear up for your next event** — marketplace rail, matched to saved events. See §10 | no schema yet | to build |
| 10 | Browse by sport — 14 tiles with **real counts** | counts endpoint | to build |
| 11 | Clubs & academies near you | `clubs`, `training_centers` | 0 rows |
| 12 | **Organiser block** — band + 4 proof stats + 3 steps. See §11 | — | ready |
| 13 | Browse by city + SEO footer. See §8 | `lib/locations.ts` | footer needs expansion |

**Rail 7 is still the differentiator.** Across every site checked in the competitor research, age is
always a filter buried inside a per-sport search, never a homepage surface — that row is what makes
a parent bookmark the site. It simply must not be the first thing an adult athlete sees.

### 3a. "Near me" — the control, and where it lives

"Near me" is currently not expressible: `MegaSearchBar`'s WHERE axis is a multi-select of cities and
states, and a city is not a radius. An athlete in Thane wants Mumbai's events; a parent in Gurugram
wants Delhi's. City equality silently hides both.

**The control.** A radius segmented control — `25 / 50 / 100 / 200 km` — anchored to a resolved
point, *not* a dropdown. Four visible options beat a select at 375px and make the concept legible
at a glance. Default 100 km.

**It belongs in four places, each doing a different job:**

**Placement 0, added 2026-09-23 — the pinned chip in the filter bar.** The filter bar under the hero
scrolls horizontally, and the location chip is the one filter that must never scroll out of view,
because every other chip reads *against* it: "This weekend" means nothing without "within 100 km of
Bengaluru". So the bar is split — the location chip is pinned left and fixed, the rest of the chips
scroll in a fading track with arrow controls on desktop, and an "All filters" button sits pinned at
the right. That layout is what makes a long composed-chip list viable at 375px without becoming an
18-chip wall.

| Placement | Job | Pattern precedent |
| --- | --- | --- |
| **Header**, `📍 Bengaluru ▾` | The global default, visible on every page, one tap to change | BookMyShow, indiarunning, Zomato — universal in Indian consumer web |
| **Search bar**, WHERE dropdown, pinned as the first row above the city list | Deliberate search, where radius is set alongside dates | Airbnb "Nearby" as the first flexible option |
| **Rail head**, `Happening near you · Bengaluru · within 100 km ▾` | Adjust in context without reopening search — the highest-value one, and the one no competitor does | — |

**Rules.**
- **Never request geolocation on page load.** Ask only when "Near me" is tapped. A permission prompt
  on first paint reads as surveillance to the low-end-Android majority and the denial is permanent.
- Fallback chain, non-blocking: browser geo → IP city → last chosen city in `localStorage` →
  configured default. Render the page against the fallback immediately and re-query if geo resolves.
- State the resolution honestly — "Near Bengaluru (approx.)" for IP-derived, not a false precision.
- Backend work: `lat` / `lng` / `radius_km` DTO fields and a PostGIS `ST_DWithin` filter. PostGIS is
  installed; whether `events` carries a geography column is unverified — check before planning.

**Rules.** Never render an empty rail (cold-start ghost town) — validated directly: the sites that
bury real events behind a full hero or an intent tile (athlinks, runsignup, bhaagoindia) all read
as portals, not discovery. Cap each rail at 6–8 with a "View all" landing on a filtered directory
URL. Discovery stays >= 60% of the page until other pillars have liquidity. On a narrow viewport,
the chip row (§2) shows ~6 composed/priority chips plus an "All sports" opener — never all 12
sports and 6 ages at once, which is an 18-chip wall on 375px.

### Highest-leverage single change

**Shrink the hero from ~700px to ~450px** so the first event rail peeks above the fold. Today a
visitor's entire first screen is a stadium photo; they must scroll before learning that 10,100
events exist. Density is the pitch.

---

## 4. Card anatomy

An athlete decides "can I enter this?" in about two seconds. Everything on the card serves that
question or comes off.

| Element | Column |
| --- | --- |
| Poster | `poster_url` |
| Date block, with `-> end` when multi-day | `start_date` / `end_date` |
| Title, 2 lines max | `event_name` |
| City · venue | `city`, `venue` |
| **Discipline chip** — "Badminton", never "Racquet" | `discipline_slugs` |
| **Age chip** — "U12" | `age_categories` |
| **"From ₹X"** — a single floor number, muted text, not a chip | `price_range` |
| "Closes in 4 days" — only when true | `registration_closes_at` |
| Save, one tap, no navigation | `event_interests` |

**Correction from research:** the original draft omitted price entirely as "not the scan-time
decision." indiarunning puts a price line on every card, and 60% of this product's users are on
sub-₹15,000 Android (`docs/04-product-principles.md`) — for an event people pay to *enter*, cost is
part of "can I do this?", not clutter. Compromise: parse `price_range` (e.g. `"₹800 - ₹2000"`) down
to its low end and show only **"From ₹800"** — never the noisy range, never as a third chip.

Deliberately still omitted: terrain, difficulty. **Two chips maximum** — discipline and age are
decision data; the rest, price included, is quieter supporting text.

### 4a. Revision (2026-09-23): one anatomy was never enough — there are two densities

The "two chips maximum" rule was written against a rail card and then applied everywhere, which
starves the comparison surfaces. A card in a horizontally-scrolling rail is **scanned** at a rate of
one per half-second; a card in a directory grid is **compared** against the three around it. Those
are different jobs and the second one is where an athlete actually decides. Splitting them keeps the
rail clean and gives the user the detail they asked for, in the place it can be read.

| Element | Rail card (scan) | Directory / list card (compare) | Column |
| --- | --- | --- | --- |
| Poster, date block, title, city · venue | ✅ | ✅ | existing |
| Discipline chip | ✅ | ✅ | `discipline_slugs` |
| Age chip | ✅ | ✅ | `age_categories` |
| "From ₹800" | ✅ | ✅ | parsed `price_range` |
| Save | ✅ | ✅ | `event_interests` |
| **Distance / category strip — `5K · 10K · 21K`** | ✅ **add** | ✅ | `distance_options[]` — already populated |
| **Registration status pill — Open · Closes in 4d · Closed · Results out** | ✅ **add** | ✅ | `registration_closes_at`, `results_status` |
| **Certification badge — AIMS / AFI certified, chip-timed** | — | ✅ | **new columns, see §6** |
| **Social proof — "428 interested"** | on hover/desktop only | ✅ | `interest_count` |
| Organiser name + verified tick | — | ✅ | `organizer_name` |
| Participant count / field size, prize money | — | ✅ | new, low priority |

**The distance strip is the highest-value single addition and it costs nothing** — `distance_options`
is already populated on the live rows, and it is the first thing a runner's eye goes to. It is text,
not chips, so it does not violate the two-chip rule.

**The status pill replaces guesswork.** Today a card gives no indication whether entries are still
open, which means every click is a gamble and a closed event feels like a bait-and-switch. One pill
fixes the largest trust leak on the card. It degrades honestly: with `registration_closes_at` null
it renders nothing rather than "Open".

Desktop rails may reveal the extra rows on hover/focus; **mobile never does** — at 375px the card
stays horizontal (§5) and the detail lives on the event page, one tap away.

### 4b. Revision (2026-09-23): the rail card carries the full anatomy after all

Benchmarked against indiarunning's live card, which is the density this market has already been
trained on. The "scan vs compare" split in §4a was right about the *reasoning* and wrong about the
*conclusion*: their rail cards carry everything, and they convert. A card that answers the question
completely is worth more than three cards that each need a click. Final rail-card anatomy, top to
bottom:

| Row | Contents | Column |
| --- | --- | --- |
| Poster | Event creative + sport label + headline treatment | `poster_url` |
| Poster overlay, top-left | **Trust badge** — Official Event / Popular Event / Sustainable Event / AFI Ranking Event | verification + `is_featured` + **new** |
| Poster overlay, bottom-right | **Date block** — day, month-year, and a **weekday bar** | `start_date` |
| 1 | Title (2 lines) + **★ rating (review count)** | `event_name`, **new: reviews (#19)** |
| 2 | Sport chip + **every distance offered** + age chip | `distance_options[]`, `age_categories` |
| 3 | Two-column meta: 🗓️ date + start time · 📍 city, state + venue | `start_date`, `city`, `state`, `venue` |
| 4 | **Calibre line** — ✓ AIMS certified · ⏱️ Chip-timed · 🏛️ governing body | **new columns, §6** |
| 5 | **Registration status band** — full-width, tinted, tappable, with a **fill bar and "Hurry! Few slots left"** when closing | `registration_closes_at`, `results_status` |
| 6 | **₹X onwards** + **Register Now →** | `price_range`, `registration_url` |
| 7 | **Social proof** — avatar stack + "3.2K people are interested" | `interest_count` |
| 8 | **Action bar** — ♥ Interested · 🔖 Save · ↗ Share · 💬 Comment | `event_interests`, share, **comments (new)** |

Three of these are genuinely new product surface, not just layout:

- **Interested vs Save are different verbs.** Save is private bookkeeping; Interested is public and
  feeds the count on row 7 and the "Popular" rail. `event_interests.status` already models both
  (`saved` → `interested`), so the card needs no schema — only two distinct controls.
- **The status band replaces the status pill** from §4a. A tinted full-width band with a fill bar
  carries urgency a 10px pill cannot, and it degrades honestly: no `registration_closes_at`, no band.
- **Rating and Comment have no backing at all.** Reviews are requirement #19, unbuilt; comments are
  not a requirement yet. Both are drawn in the mockup to show the intended density — **do not ship a
  fake ★ 4.8**. An unrated event shows no rating row, exactly as an uncertified one shows no badge.

On a results card, rows 5–6 become "Results published · N finishers" and "Winner hh:mm:ss · View
results →". Same skeleton, past tense.

---

## 4b. Results — the missing half of the product

Logged as requirements **#53 Official Event Results**, **#54 Claim Your Result** in
`docs/05-feature-inventory.md`.

The schema already has `event_results`, but it is **self-reported only** — `is_verified` defaults
false and nothing can set it true. That serves the athlete's own diary (#21, #23). It does not
answer "what were the results of Sunday's race?", which is the query that brings an athlete back.

Today that traffic goes to the timing partner's domain and never returns. Results are also the
largest SEO surface this product can own: one page per event per year, each carrying hundreds of
names people search by name.

| Phase | Ships | Cost | Depends on |
| --- | --- | --- | --- |
| 1 | `events.results_url` + `results_status` enum (`none` / `announced` / `published`). A "Results →" badge on past cards and an outbound link on the event page | one column pair + a badge | nothing |
| 2 | "Add my result" UI over the existing `event_results` table — PB tracking, season poster | frontend only | table exists |
| 3 | `event_result_entries` — official, organiser/timing-partner sourced (name, bib, category, gun time, chip time, overall + category position). Searchable leaderboard page per event | large — a feed integration per timing partner | ingestion |
| 4 | Claim-your-result: match an official entry to a profile, auto-fill PB history | medium | 3 + auth |

**Do not merge official entries into `event_results`.** That table is user-owned and RLS-scoped to
`auth.uid()`; official entries are public, unowned, and arrive in bulk. One table cannot carry both
ownership models without breaking the policy.

**Honesty rule:** never render a self-reported time in a context that reads as official. Phase 1's
outbound link is worth shipping on its own, immediately — it is two columns and a badge.

---

## 5. Responsive

| Width | Layout |
| --- | --- |
| 375px | 1 column, **horizontal** cards (image left ~120px). Vertical cards waste a phone screen. |
| 768px | 2 columns, vertical cards |
| 1440px | 4 per rail |

60% of users are on sub-₹15,000 Android with patchy 4G (`docs/04-product-principles.md`), so the
chip row scrolls horizontally and the search collapses to a single tap-to-expand bar — mirroring
Airbnb's own mobile pattern, the one piece of mobile behaviour the research could verify directly
(most competitor captures were desktop-only; see §6).

---

## 6. Open blockers

| Issue | Type |
| --- | --- |
| Hardcoded "Major Events" rail in `page.tsx:107-131`, including the already-past *TCS World 10K — May 2026* | code |
| "Popular Events" selects the 5 **furthest-future** events (all 2028) via `ORDER BY start_date DESC` | data + code |
| `sport=athletics` returns **0 events** — the flagship category has no catalogue | ingestion |
| `discipline_slugs` empty on all 10,100 rows — blocks the discipline chips and rails 5–6 | ingestion |
| Athletics discipline chips lead with field events; Sprints and Relays fall into the overflow because the API orders alphabetically | needs a `display_order` or `is_featured` column on `disciplines` — curation, not an algorithm |
| No **composed-chip** mechanism exists yet ("U12 Skating" → a pre-built filtered URL) | needs a small curated list, likely a `featured_chips` table or a static config; see §2a |
| Card needs a price-floor parser (`"₹800 - ₹2000"` → `"From ₹800"`) | small, isolated frontend util |
| **No calibre columns.** `is_certified`, `certifying_body` (AIMS/AFI/state assoc.), `is_chip_timed`, `counts_for_ranking` do not exist — §2b's primary persona cannot filter on the axis they care most about | schema + ingestion |
| **No `results_url` / `results_status`** — §4b Phase 1 is blocked on two columns | schema |
| **No `is_featured` / `featured_rank` / `featured_until`** — the hero carousel (§7a) has nothing honest to select on, since `interest_count` and `view_count` are 0 across all 10,100 rows | schema (#55) |
| **No geo radius.** No `lat`/`lng`/`radius_km` on the events DTO and no confirmed geography column on `events`, so "Near me" (§3a) cannot be expressed — city equality is the only spatial filter today | schema + API |
| Header is a single thin row; no sport mega-menu, no Results or Clubs entry (§7) | code |
| Footer carries no SEO link surface (§8) | code |

### Open questions the research could not settle (`Competitor homepage research.md` §G)

- **ahotu.com** — the closest real analogue to a multi-sport global calendar — was blocked by a
  Cloudflare check and never inspected. Worth a manual look before finalising the chip mechanic.
- **townscript.com/categories** — unreachable from the research session too; the "category-grid-
  first" claim in §2 is still asserted, not independently verified by anyone on this project.
- Mobile behaviour (Q6) was **desktop-only** for every competitor except Airbnb and
  FixtureCalendar — the 375px decisions in §5 should be usability-tested directly, not inferred.
- No site surfaces a homepage age filter, so there is no reference UI to copy for the age chips —
  the closest real controls are one level down, inside AAU/gymnastics *event-search* pages.

---

## 7. Header — two rows, and a mega-menu instead of a category wall

Added 2026-09-23. The current header is one thin row, which forces every browse intent into the
search bar. fixturecalendar and indiarunning both carry a fat header, and they are right to: **the
place for categories is the navigation, not the page body.** That reconciles §2's "never a taxonomy
wall" with the user's need to see breadth — a mega-menu proves the catalogue exists without
spending a single pixel of the first screen on it.

| Row | Contents | Behaviour |
| --- | --- | --- |
| **1 — utility** | Logo · `📍 Bengaluru ▾` (§3a) · collapsed search · Login / avatar · **List your event — free** (outlined button, right) | Sticky. On scroll past the hero, the collapsed search expands into this row (Airbnb's pattern) so search is never more than one tap away |
| **2 — browse** | **Sports ▾** (mega-menu) · **Cities ▾** · Calendar · Clubs & academies · **Results** · Guides · For organisers | Hides on scroll-down, returns on scroll-up. At 375px it becomes a horizontally-scrolling strip; the mega-menu becomes a full-screen sheet |

**The Sports mega-menu** is the taxonomy's only home on the homepage: 4 columns of the 9 families,
each listing its categories with live counts, plus a right-hand panel of the top 8 disciplines by
event count. Every entry is a real filtered directory URL — this is the internal-linking engine, and
it is what makes the 105 disciplines indexable at all.

**Results in the top nav is a deliberate bet** (§4b). No Indian discovery site carries it; the
timing partners own that traffic entirely. Putting it in the primary nav from day one — even when it
only links out in Phase 1 — is how the habit gets built.

### 7a. The featured banner

**Revised 2026-09-23 — superseding the "carousel as hero background" model above it.** That version
merged the two to save vertical space, but the merge capped how much an event could say: a poster
behind a brand headline and a search bar can carry a name and a date and nothing else.

**The featured block is now its own full banner, below a compact hero**, with the event's
information and the navigation *below the banner* rather than floating on it:

| Layer | Contents |
| --- | --- |
| **Banner** (16:7 desktop, 4:3 mobile) | The event creative, its trust badge, a kicker line, the headline treatment, every distance offered as pills, and a date block (day / month / **weekday**) top-right |
| **Info strip** directly beneath | Event · When (with start time) · Where (with venue) · Entries status · interest count · "₹X onwards" · ♥ Interested · **Register Now** |
| **Navigation** beneath that | Prev / next arrows, a scrolling **thumbnail strip** naming each featured event, and an "n / 5" counter |

Thumbnails rather than dots is the substantive change. Dots say only *how many*; thumbnails let
someone skip straight to the one event they came for, and they make the remaining four discoverable
instead of accidental. The active thumbnail scrolls itself into view when the banner advances.

**Cost, stated plainly:** hero (~320px) + banner block (~500px) means the first event rail now sits
around 820px down rather than peeking above the fold, which reverses §3's "highest-leverage single
change". That is a deliberate trade — richer featured placement, bought with fold position. If the
first rail turns out to matter more, the fix is to shorten the hero to a single line rather than to
shrink the banner.

| Rule | Why |
| --- | --- |
| Label it **"Featured"**, never "Popular" | The Trust pillar (§1) forbids "Popular" without a signal, and `interest_count` / `view_count` are 0 everywhere. Curated content honestly labelled is fine; inferred popularity that is actually a hand-picked list is not |
| Auto-advance 5s, **pause on hover and on focus**, stop permanently after any manual interaction | Standard accessibility contract for auto-rotating content |
| Dots always visible; arrows on desktop; swipe on touch | Carousels with no visible affordance get missed entirely |
| Max 8 slides, each a real upcoming event with a real poster | A carousel of placeholder gradients reads as an empty site |
| Respect `prefers-reduced-motion` — no auto-advance | |

Selection source, in order of preference: `is_featured` + `featured_rank` (#55, curated, ships now)
→ `interest_count` over a trailing 14-day window (once engagement data exists) → never
`ORDER BY start_date DESC`, which is the existing "Popular Events" bug in §6.

---

## 8. Footer — the SEO engine

Added 2026-09-23. BookMyShow's footer is the reference and the reason is not decoration: it is a
dense internal-linking surface that makes tens of thousands of long-tail queries land on a real
page. This product has 10,100 events across 53 cities, 24 states, 14 categories and 105
disciplines — the combinatorics are the asset, and the footer is how a crawler reaches them.

| Column | Contents | Links to |
| --- | --- | --- |
| Events by city | Top ~30 cities | `/events?city=…` |
| Events by sport | 14 categories + top disciplines | `/events?sport=…` |
| Events by month | "Marathons in October 2026", rolling 12 months | date-filtered directory |
| Popular searches | Hand-curated composed queries — "Half marathon Bengaluru", "U14 skating Pune", "Cycling events this weekend" | pre-built filtered URLs (same mechanism as the §2 composed chips) |
| For organisers | List your event · Pricing · Organiser login · Partner with us | |
| Company | About · Contact · Blog · Careers | |
| Support & legal | FAQ · Help centre · **Report an incorrect listing** · Terms · Privacy | |

**Two things the footer must get right, both flowing from §1:**

- **Neutrality.** There is no refund or cancellation policy to publish, because the platform never
  owns the transaction — registration always leaves the site. Say that explicitly rather than
  copying a marketplace's policy block; a refund policy implies we took the money.
- **No fabricated trust furniture.** No App Store / Play badges until apps exist, no partner logos
  without partnerships, no "50,000 athletes" without the number. `Report an incorrect listing` is
  the honest counterpart — an aggregator's data will be wrong sometimes and the fix is a visible
  correction path, not a claim of accuracy.

---

## 9. Reference designs worth copying, element by element

Added 2026-09-23. Structural analogue overall remains Airbnb (§2); these are per-element.

| Element | Copy from | What specifically |
| --- | --- | --- |
| Hero carousel + overlaid search | **BookMyShow**, Insider.in, District | Proven against exactly this audience and device class; the carousel-as-hero merge in §7a |
| Rails with "View all" | **indiarunning**, Netflix | Peek-the-next-card cropping, which signals scrollability without an arrow |
| Persistent multi-axis search pill | **Airbnb** | The bar `MegaSearchBar` is already modelled on; also the mobile tap-to-expand collapse (§5) |
| Sport mega-menu in the header | **fixturecalendar**, Eventbrite | Categories in the nav, events in the body (§7) |
| Card detail density for comparison | **Athlinks**, RunSignup, **ahotu** | Distance strip + registration status pill (§4a). ahotu is the closest true analogue — a multi-sport global calendar — and is still uninspected (§6) |
| Results pages, claim-your-result | **Athlinks**, MyRaceIndia, sportstiming.dk | Search by bib or name; the claim flow that converts results traffic into accounts (#54) |
| Radius / "near me" control | Zomato, Airbnb "Nearby" | City in header, radius in the search panel (§3a) |
| SEO footer | **BookMyShow**, Zomato | Column structure in §8 |
| Clubs & communities | **Strava Clubs** | Join flow, member count, club-hosted event listing |

Ranked by expected return for effort: **hero-carousel merge → registration status pill → distance
strip → radius control → results Phase 1 → header mega-menu → footer**. The first three are frontend
work over columns that already exist; the rest need schema first (§6).

---

## 10. Marketplace — gear, and where it belongs

Added 2026-09-23. Logged as requirement **#56** in `docs/05-feature-inventory.md`.

A marketplace earns its place on this page only because of the sequence: someone who just entered a
21.1K three weeks out needs shoes, gels and a race belt, and nobody else on the internet knows they
entered. That context is the entire product advantage. A generic sports catalogue is not.

| Surface | Contents |
| --- | --- |
| Header nav, **Shop** | Dropdown: by sport (running, cycling, skating, swimming, athletics, martial arts) and by need (shoes & spikes, apparel, nutrition, recovery, watches, race-day essentials) |
| Homepage rail, **"Gear up for your next event"** | 6 products, each captioned with *why it is being shown* — "Recommended for your 21.1K", not "Bestseller" |
| Footer column | The SEO surface, plus "Sell on GoAthletix" |

**Rules, all downstream of §1's Neutrality pillar.**
- We hold no stock and fulfil nothing. The seller owns shipping and returns, and the footer says so
  in the same breath as the entry-fee disclaimer — otherwise the two policies get conflated.
- **Shop content never displaces an event rail above the fold.** Discovery stays ≥ 60% of the page
  (§3). The rail sits at position 9, after every event rail and after results.
- A recommendation must name its reason. An unexplained product rail on a discovery site reads as
  paid placement, and if it ever *is* paid placement it is labelled.
- No schema exists for any of this. It is a design placeholder until a catalogue source is chosen.

---

## 11. Organisers — the second audience, and what they need to see

Added 2026-09-23. The page had exactly one organiser touchpoint: a "List your event — free" band.
That is a call to action with no argument behind it. An organiser deciding whether to list is asking
three questions the page never answered: *who will see it, what does it cost me, and do I lose my
entrants?*

The organiser block (section 12) answers all three in one screen:

| Element | Answers |
| --- | --- |
| Band: "Organising an event? Get found." + Organiser login / List free | the ask |
| **Four proof stats** — 10,100 events · 53 cities, 24 states · 14 sports, 105 disciplines · **₹0 commission, forever** | *who will see it* and *what does it cost* |
| **Three steps** — list in five minutes (or bulk-upload a season) → get verified, earn the blue tick and the "Official Event" badge → publish results and keep the athletes | *do I lose my entrants* |
| Header dropdown, **For organisers** | get listed / run your event, plus the same neutrality line |

**The load-bearing sentence is "your entrants stay yours."** Every registration platform an organiser
already uses takes a cut and owns the entrant relationship. This product does neither, and that is
the only reason a race director would add one more listing to their week. It belongs in the header
dropdown, the band and the footer — stated the same way each time.

**The badge loop is the real mechanism.** Verification is what puts "Official Event" on an
organiser's cards (§4a), which raises their click-through, which is what makes claiming a page worth
an organiser's time — and a claimed page is how listings stay accurate without us crawling. The
badge is not decoration; it is the incentive that keeps the data clean.
