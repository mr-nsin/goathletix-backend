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

**Recommended:** "Where India competes." Sub-head: *Every event, every age, one place.*

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

## 3. Section order

| # | Section | Query behind it | Ready? |
| --- | --- | --- | --- |
| 0 | Header — logo, "You are in: `<city>`", nav, login | geo | ready |
| 1 | **Hero (short, ~450px) + search bar**, WHERE + WHEN only (§2a) | — | ready |
| 2 | **Composed chip row** — sport chips + a few pre-built age queries ("U12 Skating", "Kids near me") | taxonomy + counts | to build — see §2a, not a raw 12×6 filter grid |
| 3 | **Happening near you** | `city` + next 30 days | ready |
| 4 | **This weekend** | date window | ready |
| 5 | **For kids & juniors near you** | `age_categories && {kids,sub_junior,junior}` | needs data — **the differentiator** |
| 6 | **Closing soon** — only while real dates exist | `registration_closes_at` <= 14d | column empty, do not fake it |
| 7 | Browse by sport — 12 tiles with **real counts** | counts endpoint | to build |
| 8 | Clubs & academies near you | `clubs`, `training_centers` | 0 rows |
| 9 | "List your event — free" organiser band | — | ready |
| 10 | Browse by city + SEO footer | `lib/locations.ts` | ready |

**Section 5 is the differentiator.** Across every site checked in the competitor research, age is
always a filter buried inside a per-sport search, never a homepage surface — that single row is
what makes a parent bookmark the site, with or without a bar axis to back it.

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

### Open questions the research could not settle (`Competitor homepage research.md` §G)

- **ahotu.com** — the closest real analogue to a multi-sport global calendar — was blocked by a
  Cloudflare check and never inspected. Worth a manual look before finalising the chip mechanic.
- **townscript.com/categories** — unreachable from the research session too; the "category-grid-
  first" claim in §2 is still asserted, not independently verified by anyone on this project.
- Mobile behaviour (Q6) was **desktop-only** for every competitor except Airbnb and
  FixtureCalendar — the 375px decisions in §5 should be usability-tested directly, not inferred.
- No site surfaces a homepage age filter, so there is no reference UI to copy for the age chips —
  the closest real controls are one level down, inside AAU/gymnastics *event-search* pages.
