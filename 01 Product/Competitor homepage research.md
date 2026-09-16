# Competitor homepage research — for the main page redesign

- **Date:** 2026-09-16
- **Author:** external research session (web access; the primary dev environment is proxy-blocked)
- **Method:** live visits (rendered screenshots) unless marked *unreachable*. Above-the-fold and first ~two scrolls only. Pixel figures are eyeballed from a 1440-wide render and are approximate.
- **Scope:** tests the `Main page design spec.md` "eligibility feed / Airbnb analogue" theory against evidence. Reads assumed: `Main page design spec.md`, `docs/17-sports-taxonomy.md`, `docs/21-platform-expansion-vision.md`, `docs/03-target-users.md`.

## Reachability

| Site | Status |
| --- | --- |
| active.com, athlinks.com, letsdothis.com, runsignup.com, worldathletics.org, indiarunning.com, bhaagoindia.com, aausports.org, usagym.org, sportsengine.com, airbnb.com, fixturecalendar.com | ✅ visited |
| **ahotu.com** | ❌ Cloudflare "verify you are human" gate — not bypassed (see Open questions) |
| **parkrun.org.uk** | ❌ "Let's confirm you are human" gate — not bypassed |
| **townscript.com** (incl. /categories) | ❌ navigation denied / connection refused from this environment |

indiarunning.com, fixturecalendar.com and airbnb.com were captured earlier in the same working session; notes below are from those captures.

---

## A. Comparison table (the six questions)

| Site | 1. First thing / px to first event | 2. Primary filter axes (order; visible?) | 3. Age-group handling | 4. Card shows / omits | 5. Empty/sparse | 6. Mobile |
| --- | --- | --- | --- | --- | --- | --- |
| **indiarunning.com** | Full-width **promo banner carousel**, then a **Races grid** (~460px to first card) | Keyword + city search (top); nav "Events by Distance", "Events by City"; **Filter** panel + grid/list toggle | Not a homepage axis; distance is the headline axis, not age | Poster + **date badge**, title, **distance chips (5/10/21/M)**, sport tag, **"Registrations closing on <date>"**, **"₹X onwards"**, Register, city, ★rating | Not observed | Not observed (desktop capture) |
| **active.com** | Hero image + **centred search box** ("Everywhere" + keyword); trending chips; "Popular Today" cards (~460px) | **Location + keyword** in the box; **sport as top-nav** (Running/Triathlon/Fitness/Sports…); trending chips | **"Kids & Family" is a top-nav category**; a **"Kids 4" trending chip** — closest anyone gets to surfacing age, but it's a nav item, not a feed axis | date, title, city, **sport tag**, share; **no price** | Not observed | Not observed |
| **athlinks.com** | Full-screen hero, **"Enter an athlete name"** results search | **Results / athlete-name** search — it's a *results* DB, not discovery | None on homepage | n/a (results, not events) | n/a | Not observed |
| **ahotu.com** | *unreachable* | *unreachable* | *unreachable* | *unreachable* | *unreachable* | *unreachable* |
| **letsdothis.com** | **Pivoted to B2B**: "AI Registration Platform" hero (Analyse/Launch/Grow, "Join waitlist") | None consumer-facing | None | No consumer cards | n/a | Not observed |
| **parkrun.org.uk** | *unreachable* (human-verify gate) | *unreachable* | *unreachable* | *unreachable* | *unreachable* | *unreachable* |
| **runsignup.com** | Full-screen hero "**Create Amazing Events**" (organiser); "Find a Race" is a small top button | Organiser-first; **participant discovery is behind "Find a Race"** | Inside Find-a-Race search, not homepage | n/a homepage | n/a | Not observed |
| **worldathletics.org** | **News carousel** (championship press release) + Shop banner | Editorial nav (News/Watch/Competitions/Athletes/Stats) | Inside Competitions, not homepage | n/a (news cards) | n/a | Not observed |
| **townscript /categories** | *unreachable* (documented elsewhere as category-grid-first; not verified here) | *unreachable* | *unreachable* | *unreachable* | *unreachable* | *unreachable* |
| **bhaagoindia.com** | Hero text + **3 intent tiles** (Start Running / Race Photos / **Browse Events**) + stat counters. **No event above the fold** — events are one click behind "Browse Events" | None on homepage; behind Browse Events | None on homepage | n/a homepage (Race Chronicles = blog cards) | Not observed | Not observed |
| **aausports.org** (youth multi-sport) | **Sport nav row w/ dropdowns** (Baseball…Track & Field…Martial Arts…Wrestling) + membership hero + **"Find an Event / Find a Club"** buttons | Sport (nav dropdowns) → event search | **Age divisions live inside each sport's event search**, never on the homepage | n/a homepage | n/a | Not observed |
| **usagym.org** (gymnastics) | **News-first** federation (promo hero + news cards); nav Disciplines/Events | Discipline/level inside Events | Age/competitive level inside Events, not homepage | News cards | n/a | Not observed |
| **sportsengine.com** (youth platform) | **B2B SaaS** hero ("home of youth sports", Explore products/Login) | None consumer | Inside club/registration apps | n/a | n/a | Not observed |
| **airbnb.com** (structure only) | Compact **persistent multi-axis search pill** (Where/When/Who) under a small **category tab row** (All/Homes/Experiences/Services); dense **rails** below | **Where → When → Who**, always visible in the bar | "Who" = guests/ages, but it's *headcount*, not a discovery axis | photo, title, price, rating; minimal | n/a | Bar collapses to one tap |
| **fixturecalendar.com** (structure only) | **Search-first, stacked** Sport/Competition/Where/When/Search | Sport/Competition/Where/When | None (spectator/fixture model) | fixture-style rows | Not observed | Stacked full-width rows |

---

## B. Who handles MULTI-SPORT + MULTI-AGE best?

**Blunt finding: nobody does both well — and multi-age on a homepage is effectively unclaimed.**

| Dimension | Best observed | What they actually do |
| --- | --- | --- |
| Multi-sport, cleanly | **active.com** | Sport lives in the **top nav** + a row of **trending query chips** ("Ironman 70.3", "Mud run", "10K"). The chips are the smart part: each is a *pre-composed query*, so breadth is exposed without a category wall. |
| Multi-sport, org-style | **aausports.org** | A **sport row with dropdowns**. Works for a membership org; it is navigation, not discovery, and hides everything one click down. |
| Multi-age | **active.com (barely)** | "Kids & Family" as a nav category + a "Kids 4" chip. That is the *only* place across every site where age is visible without drilling into a sport first. |

Everywhere else — AAU, USA Gymnastics, SportsEngine, indiarunning — **age is a filter buried inside a per-sport event search**, never a first-class surface. Federations (worldathletics, usagym) are news-first and don't attempt discovery at all.

**Implication for your hardest problem (12 sports × 6 ages without a filter wall):** copy active.com's **chip-as-pre-composed-query** mechanic, not a matrix. Show a scrollable row of *composed* chips — "U12 Skating", "Junior Athletics", "Masters Cycling", "Kids near me" — each linking to a filtered directory URL. Chips collapse a 12×6 grid into a curated, tappable handful, and they are the only proven pattern for exposing breadth on a phone.

---

## C. Evidence FOR / AGAINST the eligibility-feed theory

**Verdict: WHERE and WHEN as primary axes are well supported. WHO (age) as a co-primary *search-bar* axis is unproven in the market — strong as a rail, risky as a mandatory third bar field.**

| Claim in the spec | Evidence | For / Against |
| --- | --- | --- |
| Events-first beats category-first for discovery | indiarunning (events-first) and active.com (search→cards) are the only two that put real events near the top and are the clearest consumer discovery UIs seen. bhaagoindia (intent-tiles, events one click down) reads as a portal, not discovery. | **FOR** |
| WHERE + WHEN are the primary axes | active.com leads with **location** in the search box; airbnb's bar is literally Where/When; indiarunning's nav is "by City" / "by Distance(=when-ish)". | **FOR** |
| Sport is secondary, not the entry point | active.com and airbnb both refuse to make the sport/category grid the entry; sport is nav/chips. | **FOR (with nuance)** — airbnb *does* keep a slim category **tab row** above the bar, so "never categories" is too strong; a *slim* sport row is fine. |
| WHO (age) is a co-equal primary axis | **No competitor surfaces age at the top level.** active.com gets closest with a nav category + one chip. Age is universally a *secondary* filter. | **AGAINST as a bar axis / FOR as a differentiator** — the absence is opportunity (white space), but there is zero market proof that users expect age *in the search bar*. Ship it as a prominent **chip + rail**, measure, then promote to the bar only if used. |
| Airbnb is the right structural analogue | The persistent multi-axis pill + dense rails + not-category-first all match. | **FOR**, with the caveat above (Airbnb 2026 keeps a category tab row). |

Bottom line: the eligibility feed is directionally right. The one correction the evidence forces: **do not bet the entry experience on WHO being a search-bar axis**. Lead with WHERE + WHEN (proven), make WHO the visible differentiator via the "kids & juniors" rail and composed age chips.

---

## D. Recommended section order

| # | Section | Data it needs | Notes |
| --- | --- | --- | --- |
| 0 | Header — logo, "You are in: `<city>`", nav, login | geo | keep |
| 1 | **Hero (short, ~450px) + search pill** leading with **Where / When** | — | agree with the spec's hero shrink; keep sport + age *inside* the pill, not as the headline axis |
| 2 | **Composed chip row** — sport chips **and** a few age-composed chips ("U12 Skating", "Kids near me") | taxonomy + counts | this is the multi-sport×age answer (active.com chip mechanic) |
| 3 | **Happening near you** (city + next 30d) | `city` + date | the density proof; must appear fast |
| 4 | **This weekend** | date window | |
| 5 | **For kids & juniors near you** | `age_categories && {kids,sub_junior,junior}` + city | **the differentiator — genuinely unclaimed in market (see B)** |
| 6 | **Closing soon** — only if real dates exist | `registration_closes_at` | do **not** fake this (see F) |
| 7 | Browse by sport — tiles **with real counts** | counts endpoint | counts = the completeness pitch |
| 8 | Clubs & academies near you | `clubs`, `training_centers` | render only when rows exist |
| 9 | "List your event — free" organiser band | — | keep |
| 10 | Browse by city + SEO footer | `lib/locations.ts` | keep |

### Where I disagree with the spec

1. **Age (WHO) as a co-primary search-bar axis → demote to chip + rail.** The spec (§2 "three axes — WHERE, WHEN, WHO") elevates age into the search bar. **Evidence:** across every site visited, *no one* surfaces age above a per-sport drill-down; active.com is the ceiling and it's a nav category, not a bar axis. Keeping three co-equal axes + sport in one pill on **375px** is a lot. Recommendation: **WHERE + WHEN in the bar; WHO via the "For kids & juniors" rail (§5 above) and composed age chips.** Promote WHO into the bar later *if analytics show demand*. The rail is the differentiator regardless — you don't need the bar axis to win the parent.

2. **Hiding price entirely → show a single "from ₹X".** The spec (§4) deliberately omits price. **Evidence:** indiarunning puts **"₹X onwards"** on every card, and your own users are cost-sensitive (60% sub-₹15,000 Android, `docs/04`). For *participatory* events people pay to enter, price is part of "can I do this?", not noise. Compromise that respects the spec's anti-clutter intent: show a **single "from ₹X"** (never the noisy `₹800–₹2000` range), as a muted line, not a chip. Omitting it entirely is likely a mistake.

3. **"Never a category grid" is slightly too absolute.** **Evidence:** airbnb — the spec's own analogue — keeps a **slim category tab row** above the search bar. A *sticky, slim, horizontally-scrolling* sport row (spec §2) is good and on-model; the real failure mode is a full-screen tile grid as the entry. Agree in spirit; just don't over-correct into hiding sport entirely.

4. **Chip row on mobile: don't show 12 sports + 6 ages at once.** That's 18 chips = a filter wall on 375px, the exact thing the spec warns against. Show ~6 composed/priority chips + an "All sports" opener.

**Agreements worth stating:** the ~450px hero shrink (§3) is strongly supported — the sites that bury events behind a full-screen hero (athlinks, runsignup, worldathletics) are all org/news, not discovery. The "never render an empty rail" rule is correct (see F). The "kids & juniors" rail as the flagship differentiator is validated by its total absence elsewhere.

---

## E. Card-design patterns worth copying (with source)

| Pattern | Source | Why |
| --- | --- | --- |
| **Date badge overlaid on the poster** (day + month block) | indiarunning.com | Instant "when", survives small screens |
| **Discipline/distance chips** (5K/10K/21K) | indiarunning.com | Answers "can I do this distance?" at a glance — your spec's discipline+age chips are the same idea |
| **"Registrations closing on <date>"** line | indiarunning.com | Real urgency (only when data exists) — maps to your `registration_closes_at` |
| **"₹X onwards"** single-number price | indiarunning.com | See disagreement #2 |
| **Grid ⇄ list toggle** | indiarunning.com | Serves both scanners and planners; you already have `EventRow` for list |
| **Trending / composed query chips** under the search | active.com | The multi-sport×age answer — pre-composed queries beat a filter matrix |
| **Sport tag chip** on the card | active.com | Cheap multi-sport signal |
| **Persistent multi-axis search pill + horizontal rails that "peek" the next card** | airbnb.com | The core of the eligibility-feed layout |
| **Location-first search ("Everywhere" default)** | active.com | Matches WHERE-primary |

---

## F. Dark patterns / repeated mistakes to avoid

| Anti-pattern | Seen at | Avoid by |
| --- | --- | --- |
| **Full-screen hero burying the first event** | athlinks, runsignup, worldathletics | ~450px hero; a rail must peek above the fold |
| **"Discovery" brand that's really organiser/registration SaaS** (bait) | runsignup, letsdothis (pivoted), sportsengine | Stay genuinely consumer-first; keep "List your event" a *band*, not the homepage |
| **Fabricated urgency / "Popular" with no signal** | common industry pattern; your own `Main page design spec.md` §6 flags the current "Popular = furthest-future 2028 events" bug | Only show "closing soon"/"popular" when a real column/signal backs it (matches your Trust pillar) |
| **Cookie/consent walls covering the fold on load** | active, aausports, usagym, athlinks | Minimal, non-blocking consent |
| **Events hidden behind intent tiles** (extra click) | bhaagoindia | Put real events on the homepage, not a "Browse Events" button |
| **Aggressive upsell / auto-enrol membership at checkout** (active.com is historically notorious for "ACTIVE Advantage") | active.com | Your neutral, no-transaction model already avoids this — keep it |
| **Human-verification / bot walls that block first paint** | ahotu, parkrun | Fine for you (not your problem), but a reminder that heavy gating kills discovery |

---

## G. Open questions (could not determine)

- **ahotu.com** — the single best *global multi-sport calendar* reference, blocked by a Cloudflare human-check I did not bypass. Its filter axes and whether it exposes age were **not verified**. Worth a manual look from an unblocked machine — it's the closest analogue to a multi-sport calendar.
- **townscript.com/categories** — navigation was denied / connection refused from this environment, so the "category-grid-first" claim in `Main page design spec.md` §2 is **repeated, not independently verified here**.
- **parkrun.org.uk** — human-verify gate; not verified. (Widely known to be a location/"find your parkrun" map model, but that is prior knowledge, not observed this session.)
- **Mobile behaviour** — all captures were desktop renders; per-site 375px behaviour (Q6) is largely **unverified** except airbnb (bar collapses) and fixturecalendar (stacked rows). Your own 375px decisions in the spec §5 should be usability-tested directly, not inferred from competitors.
- **Age-group filter UI, up close** — no visited site surfaces an age filter on the homepage, so I could not screenshot a "good" age-group control. The nearest real controls live one level down inside AAU / swimming / gymnastics *event search* pages (age-division dropdowns), which were out of scope for a homepage study.
- **Empty/sparse-state handling (Q5)** — not observable without running dead-end searches on each site; effectively **undetermined** across the set.
