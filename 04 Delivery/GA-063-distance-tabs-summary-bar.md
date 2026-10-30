---
id: GA-063
type: task
status: ready-for-review
priority: P1
owner: discovery-ui
branch: codex/ga-063-distance-tabs-summary-bar
scope:
  - goathletix-frontend/src/components/event/EventTickets.tsx
  - goathletix-frontend/src/components/event/TicketFinder.tsx
  - goathletix-frontend/src/components/event/TicketPicker.tsx (new)
  - goathletix-frontend/src/components/event/TicketStepper.tsx (DELETE)
  - goathletix-frontend/src/components/event/event.css
acceptance: []
depends_on: [GA-062]
---

# GA-063 Distance tabs, sticky selection bar, poster numerals

## Owner request (2026-10-30)
After the Awwwards / Mobbin / Pinterest research pass: build distance tabs instead of a long list, a sticky summary bar,
and a bold poster-style numeral per distance.

## Research basis (honest)
Awwwards and Mobbin gallery pages could not be read (images only, corporate filter blocks the live sites). What was read:
booking concepts with a stepper and a running total before the buy button, itemised price, status labels
(Available / Almost gone / Sold out), and collapsible grouping when there are many ticket types. Tabs, the sticky bar and
the numeral are design judgement on that basis, not measured results.

## Scope
1. Finder: distance pills (big numeral, unit, count) with an "All" pill; first distance preselected when the event has
   more than 6 categories. Gender and age filters stay, as a smaller box that only appears when it can narrow.
2. `TicketPicker` (client): row "Select" button plus one sticky bar (ticket, quantity stepper, total, disabled
   "Checkout coming soon"). Platform ticketing only; external stays information only.
3. Poster numeral: larger distance numeral in the row.

## Out of scope
Backend, working checkout, external ticketing behaviour, reviews, head block.

## Verification
| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `npx tsc --noEmit` | pass (07 Agent handoffs/GA-063-discovery-ui.md) |
| Lint | `NODE_OPTIONS=--max-old-space-size=4096 npx eslint src/components/event` | pass (07 Agent handoffs/GA-063-discovery-ui.md) |
| Browser | browser pane at 1440 and 390, Tata + badminton samples | pass; tablet and dark mode not run |
