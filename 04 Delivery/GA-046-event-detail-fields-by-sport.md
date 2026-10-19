---
id: GA-046
type: task
status: ready
priority: P1
owner: research
branch: none (documentation only)
worktree: none
scope: [goathletix-backend/01 Product/Event detail fields by sport.md]
acceptance: []
depends_on: [GA-044]
related: [GA-043]
---

# GA-046 What organisers publish about an event, by sport: the field model for the event page

## Goal

Owner: "Check on this website how many details organisers generally give; based on different sports we need these many details,
and create the best UI for it." Reference page: https://registrations.indiarunning.com/hindustan_marathon_12th_edition_24063
Produce the canonical field model (common fields plus per-sport fields) that the database draft (GA-047) and the event page (GA-048)
will both build from.

## Baseline: what the reference running event publishes (extracted 2026-10-19 by rendering the page)

- Header: name, venue, city, date, distances offered, rating and review count.
- Urgency: slots left ("only 100 slots left"), registration closing date ("closes 20 Oct or when sold out").
- About the event: long description; tagline.
- Per race category: name, timed or not, start time, cut-off, fee (inclusive of taxes), short "who it is for" line.
- Registration includes (per category): finisher medal, dry-fit T-shirt, timed bib, timing e-certificate, breakfast, hydration and
  energy drinks, volunteer support, medical assistance, warm-up session, washrooms, baggage counter, parking, marked route.
- Race-day experience: volunteers, music, hydration stations, medical support, finish-line atmosphere.
- Awards and age categories: top 3 male and top 3 female per age band; bands differ per distance.
- Important information: professional timing, medical teams and ambulances, hydration, traffic management, results publishing,
  minimum age per distance (5K 10+, 10K 15+, 21.1K 18+), changes allowed up to 10 days before, littering and safety advice.
- Registration policy: confirmation email, refund only if the organiser cancels or postpones, non-refundable and non-transferable,
  postponement keeps the registration valid.
- Bib and T-shirt collection: mandatory, not available on race day, fixed date and time window, venue emailed a week before.
- About the organiser: mission statement.
- Sponsorship and corporate participation: email, WhatsApp, group and corporate discounts.
- Waiver statement: fitness declaration, medical consultation, indemnity, rules compliance.
- Purchase panel: each category with inclusion icons (T-shirt, medal, timed bib, refreshments, e-certificate), price incl. taxes, Add.

## Scope and ownership

- Owned: one new note `goathletix-backend/01 Product/Event detail fields by sport.md`. No code, no git, no installs.

## Acceptance criteria

- [ ] For each sport we support (running, cycling, triathlon and duathlon, swimming and open water, trekking and hiking, skating, athletics
      track and field meets, martial arts, racquet sports, fitness competitions, adventure races), what real organisers publish: at least two real
      event pages per sport where reachable (Indian organisers first: indiarunning, townscript, Audax India / BRM, Ironman India, open-water swims,
      trek operators such as Indiahikes, skating federations, AFI meets, badminton or table-tennis tournaments, CrossFit or Hyrox style events).
      Many such pages are JavaScript apps: render them with headless Edge (the coordinator's script is at
      `C:\Users\nitinsin\AppData\Local\Temp\claude\D--project-goathletix\f71aa757-0b92-46d9-8b7a-1cb3ded7b443\scratchpad\evalm.mjs`:
      `node evalm.mjs "<url>" 1440 900 "document.body.innerText.slice(0,12000)"`); if a site is blocked or fails, say so.
- [ ] A **canonical field model**: (1) common event fields, (2) per-category (ticket type) fields, (3) per-sport extension fields, each with:
      field name (snake_case), type, example, required or optional, which page section shows it, and whether our database already has it
      (check the migrations in `goathletix-backend/supabase/migrations/`, especially 0013, 0014, 0017, 0022, 0023, 0025: events, event_categories,
      event_price_tiers, event_media, event_faqs, event_schedule_items, event_sponsors, event_documents).
- [ ] A recommended **section order** for the event page that works across sports, and which sections are sport-specific.
- [ ] India-specific items: GST-inclusive pricing, minimum ages and parental consent for minors, medical certificates, BRM/AIMS/AFI
      certification, women's safety, refund norms.
- [ ] Every claim about a platform cites its URL; mark anything you could not load.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Pages studied | 8 read in full (6 rendered with headless Edge, 3 fetched; the reference page re-rendered); about 20 more from search excerpts only | `01 Product/Event detail fields by sport.md` §8 labels each source rendered / fetched / excerpt |
| Two pages per sport | met for running, cycling, trekking, racquet; one full page for skating and martial arts; excerpts only for triathlon, swimming, athletics, fitness, adventure | Forcepoint blocked indiahikes, ironman, hyrox, arworldseries, indianathletics, kba, ttfi, ironmonk, punekarnews; procam 403 and timeout; townscript needs sign-in |
| DB coverage checked | done against migrations 0000–0025 | Note §1–§3 mark each field HAVE / NEW column / NEW table / JSON |
| Code, git, installs | none | documentation only |

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
