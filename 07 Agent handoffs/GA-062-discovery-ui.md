---
type: handoff
status: ready-for-review
task: "[[04 Delivery/GA-062-tickets-full-width-rows]]"
agent: discovery-ui
branch: codex/ga-062-tickets-full-width-rows
worktree: D:\project\goathletix-wt\fe-ga-062-tickets-full-width-rows
commit: 42a739d
tags: [handoff]
---

# Handoff: GA-062 Tickets as full-width rows, one-column body, no section navigation

## Outcome

The event page body is one full-width column from 900px (no sidebar, no section tabs). Documents and Sponsors moved to the end of the flow. Every ticket option is a full-width row: distance numeral, story with a "Details and requirements" disclosure, and a buy cell. Not pushed.

## Changed paths

- `goathletix-frontend/src/components/event/EventTickets.tsx` — `TicketCard` rewritten as a row; single-entry fallback uses the same row; lists are `ul.ev-trows`.
- `goathletix-frontend/src/components/event/TicketFinder.tsx` — wrapper list is `ev-trows` (markup only).
- `goathletix-frontend/src/components/event/EventPage.tsx` — SectionNav, `nav` array and `extras` column removed; Resources and Sponsors blocks render after FAQ; now-unused `hasX` imports dropped.
- `goathletix-frontend/src/components/event/SectionNav.tsx` — deleted.
- `goathletix-frontend/src/components/event/event.css` — layout is two grid rows; `.ev-nav*`, `.ev-ticket*`, `.ev-tfact*`, `.ev-tgrid`, `.ev-savings`, `.ev-incl`, `.ev-trev*`, `.ev-extras` rules removed; new `.ev-trow*` rules; documents grid; reduced-motion block updated.
- `EventSections.tsx` not changed (the two blocks needed no markup change).

## Verification

| Command/check | Result |
| --- | --- |
| `npx tsc --noEmit` | pass, 0 errors |
| `NODE_OPTIONS=--max-old-space-size=4096 npx eslint src/components/event` | pass, 0 errors, 0 warnings |
| `grep -nE '!important\s*,' src/components/event/*.css` | empty |
| `git grep -n "SectionNav\|ev-nav"` | empty |
| Browser at desktop, 760px and 375px | not run (no dev server permitted in this task) |

## Decisions and risks

- Decision: the old card's sport eyebrow ("Running · 42.2 km") is dropped; the numeral carries the distance and the event is already the page subject. All other card facts remain (Entry, Starts, Cut-off, Who can enter, Format, Qualifying standard, Documents, Not included, Rates, Deposit, age groups, gender and team chips).
- Decision: "Last few" and "N spots left" merged into one "Only N left" chip (left <= 20), per the note. Meta strings that used a middle dot now use commas.
- Decision: hover shadow is a pseudo-element fading in (opacity), so no box-shadow is animated; capacity bar transition shortened from 400 to 320 ms.
- Decision: "Details and requirements" is closed by default, so Starts and Entry are one click away.
- Decision: Save chip uses the `--accent` token (teal in this theme); the sold-out chip sits outside the dimmed elements to stay full contrast.
- Rows over cards is a design judgement; the research did not compare them.
- Known limitation: layout never seen in a browser; check the 240px buy column with the stepper, the 12-category badminton sample with the finder, and the sold-out dimming.
- Line endings: touched files are CRLF as before.
- Secrets: none recorded.

## Integration request

Open the badminton sample, a running event with tiers, a sold-out ticket and an external-ticketing event at 1280px, 800px and 375px and confirm the rows, Details disclosure and stacked buy cell. Then merge the branch.
