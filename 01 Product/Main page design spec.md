# Main page design spec

- **Date:** 2026-09-16
- **Status:** Proposed — awaiting competitor research (see `Competitor homepage research.md`, written externally)
- **Supersedes:** `UI-UX improvement plan.md` §9 (homepage composition), which predates the
  athletics-first broadening and the 0005–0011 schema work.
- **Related:** [[03 Decisions/ADR-006-sport-taxonomy-two-axis|ADR-006]],
  `docs/21-platform-expansion-vision.md` §6

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
Not a catalogue, not a fixture list. Three axes — WHERE, WHEN, WHO. **Sport is a secondary filter,
never the entry point**, because a parent's real query is "skating, under-12, Pune" — three axes
that a category grid answers one of.

---

## 3. Section order

| # | Section | Query behind it | Ready? |
| --- | --- | --- | --- |
| 0 | Header — logo, "You are in: `<city>`", nav, login | geo | ready |
| 1 | Hero + MegaSearchBar | — | ready |
| 2 | **Sticky chip row** — 12 sports + 6 age groups | taxonomy | ready |
| 3 | **Happening near you** | `city` + next 30 days | ready |
| 4 | **This weekend** | date window | ready |
| 5 | **Closing soon** | `registration_closes_at` <= 14d | column empty |
| 6 | **For kids & juniors** | `age_categories && {kids,sub_junior,junior}` | needs data |
| 7 | Browse by sport — 12 tiles with **real counts** | counts endpoint | to build |
| 8 | Clubs near you | `clubs` | 0 rows |
| 9 | "List your event — free" organiser band | — | ready |
| 10 | Browse by city + SEO footer | `lib/locations.ts` | ready |

**Section 6 is the differentiator.** No Indian sports site has a "kids & juniors near you" rail.
That single row is what makes a parent bookmark the site.

**Rules.** Never render an empty rail (cold-start ghost town). Cap each rail at 6–8 with a
"View all" landing on a filtered directory URL. Discovery stays >= 60% of the page until other
pillars have liquidity.

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
| "Closes in 4 days" — only when true | `registration_closes_at` |
| Save, one tap, no navigation | `event_interests` |

Deliberately omitted: price (a noisy range like `₹800 - ₹2000`, and not the scan-time decision),
terrain, difficulty. **Two chips maximum** — discipline and age are decision data; the rest is not.

---

## 5. Responsive

| Width | Layout |
| --- | --- |
| 375px | 1 column, **horizontal** cards (image left ~120px). Vertical cards waste a phone screen. |
| 768px | 2 columns, vertical cards |
| 1440px | 4 per rail |

60% of users are on sub-₹15,000 Android with patchy 4G (`docs/04-product-principles.md`), so the
chip row scrolls horizontally and the search collapses to a single tap-to-expand bar.

---

## 6. Open blockers

| Issue | Type |
| --- | --- |
| Hardcoded "Major Events" rail in `page.tsx:107-131`, including the already-past *TCS World 10K — May 2026* | code |
| "Popular Events" selects the 5 **furthest-future** events (all 2028) via `ORDER BY start_date DESC` | data + code |
| `sport=athletics` returns **0 events** — the flagship category has no catalogue | ingestion |
| `discipline_slugs` empty on all 10,100 rows — blocks the discipline chips and rails 5–6 | ingestion |
| Athletics discipline chips lead with field events; Sprints and Relays fall into the overflow because the API orders alphabetically | needs a `display_order` or `is_featured` column on `disciplines` — curation, not an algorithm |
