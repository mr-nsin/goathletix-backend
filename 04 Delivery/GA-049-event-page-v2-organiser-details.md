---
id: GA-049
type: task
status: ready
priority: P1
owner: discovery-ui
branch: codex/ga-049-event-page-v2
worktree: D:\project\goathletix-wt\fe-ga-049-event-page-v2
scope: [src/components/event/**, src/lib/eventDetails.ts, src/lib/sampleContent.ts (sample event details only), src/app/events/**]
acceptance: []
depends_on: [GA-044, GA-046]
related: [GA-047, GA-048]
---

# GA-049 Event page v2: everything organisers publish, sport-aware, with the best UI

Read [[08 Runbooks/Agent brief - frontend]], [[01 Product/Card design principles]] and the research note
[[01 Product/Event detail fields by sport]] first. Do not edit `globals.css`, `Sections.tsx`, the homepage `page.tsx` or `layout.tsx`.

## Owner request

"Check how many details organisers generally give; based on different sports we need these many details; create the best UI for it;
use the best UI/UX skills available." Reference: https://registrations.indiarunning.com/hindustan_marathon_12th_edition_24063 (its full
content is listed in `04 Delivery/GA-046-event-detail-fields-by-sport.md`).

## What to build on the existing page (`src/components/event/*`, GA-044)

Implement the research note's **10 priority additions** and its **section order**:
1. "What's included" icons on every ticket card (`includes`), and an event-level amenities list (`amenities`), plus exclusions when present.
2. Eligibility and requirements: min/max age with "age as on" date, required documents, medical certificate, guardian consent for minors,
   qualifying standard, fitness requirement, mandatory and recommended gear.
3. Policies in plain words (refund, transfer, deferral, changes deadline, postponement) with the full waiver and terms behind a disclosure.
4. Prizes and awards (podium per age band, cash, minimum-entries rule).
5. Urgency strip: closing date "or when sold out", places left, the date the price rises (from the next price tier).
6. Kit and bib collection: mandatory or not, window (`bib_expo_opens_at`/`closes_at`), available on race day or not.
7. Honest prices: "incl. taxes" or "+ GST" from `tax_mode`/`gst_rate` beside every price; struck-out compare-at price and audience offers when present.
8. Course and checkpoints: map, GPX, elevation, checkpoints with their cut-offs.
9. A sport-specific "Format" panel driven by `sport_details` (racquet format and ball, trek day-by-day itinerary, triathlon legs, fitness divisions,
   combat weight and belt classes, skating disciplines, athletics events), rendered by a small registry of per-sport renderers.
10. Timed or untimed badge per category, and certification badges (AIMS, AFI, BRM/ACP/AIR, BAI).
Plus the two UI findings: a **category finder** above the tickets when there are more than 6 ticket types (chips: distance or event, then gender,
then "your age" input that filters to the categories you can enter), and a public **documents and links** list.
Also show sponsors (logos row) and contacts (email, phone, WhatsApp, corporate and group enquiries) when present.

## Data

The backend task GA-048 extends `GET /events/:id/details` in parallel with the fields listed in `04 Delivery/GA-048-details-endpoint-existing-fields.md`
(read it). Fields from the unapplied migration 0026 (`04 Delivery/GA-047-migration-0026-event-page-fields.md`): awards, checkpoints, resources,
offers, itinerary days, sport_details, is_timed, compare_at_price_inr, excludes, gear, changes_allowed_until, kit_collection_mandatory,
race_day_collection, gpx_url, elevation_gain_m, edition_number, ticket_kind, session dates. Type them all in `src/lib/eventDetails.ts` as
optional so the page lights up when the data arrives. Every block hides when its data is absent; never invent data.

**Samples, so the owner can judge the design across sports** (in `src/lib/sampleContent.ts`, all clearly flagged as sample in the UI, rendered
from the same raw shape as the API through `normalizeDetails`): extend the existing Tata Mumbai Marathon sample with the full running field set
(modelled on the reference page: includes per category, age-band awards, minimum ages, bib collection rules, policies, waiver, corporate contact,
GST-inclusive prices), and add three more samples with distinct sports: a **brevet or cycling race** (checkpoints with cut-offs, mandatory gear),
a **multi-day trek** (itinerary days, inclusions and exclusions, fitness requirement, batches as session dates) and a **badminton tournament**
(about 12 categories to exercise the category finder, format and shuttle brand, cash prizes). Use local images only.

## Design (use the installed Anthropic skills: frontend-design for the build; the coordinator reviews with design-critique,
accessibility-review and ux-copy)

- One page that stays calm despite much more information: progressive disclosure (key facts visible, long text behind disclosures),
  a sticky in-page section nav on desktop (About, Tickets, Eligibility, Course, Format, Prizes, Policies, FAQ), and a sticky bottom
  "Choose tickets" bar on phones.
- Icons carry meaning (lucide, 16/20 px), no decorative discs; type roles from the principles note; one orchestrated load moment only.
- The ticket area is the most important block after the head: make choosing the right category effortless.
- Plain-language copy (the ux-copy rules): say what happens ("Bib collection is on 24 Oct, 12 to 6 pm. Not on race day."), no jargon.
- Accessibility: headings in order, disclosures keyboard operable, sufficient contrast, labels on the finder inputs, 44 px touch targets.

## Acceptance criteria

- [ ] The 10 additions and the two UI findings implemented and hidden when data is absent.
- [ ] Four samples (running, cycling, trek, badminton) render the full design; real events still render their basics.
- [ ] Section nav on desktop, sticky ticket bar on phones; works at 375 px and in dark mode.
- [ ] `npx tsc --noEmit`, `npx eslint src`: 0 errors; no `!important` inside a comma list.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | not run | - |
| eslint src | not run | - |
| Server/client boundary self-check | not run | - |
| Loaded in a browser | not run | coordinator, after merge (headless Edge) |

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
