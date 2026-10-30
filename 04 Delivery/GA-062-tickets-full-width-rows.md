---
id: GA-062
type: task
status: ready-for-review
priority: P1
owner: discovery-ui
branch: codex/ga-062-tickets-full-width-rows
worktree: D:\project\goathletix-wt\fe-ga-062-tickets-full-width-rows
scope:
  - goathletix-frontend/src/components/event/EventPage.tsx
  - goathletix-frontend/src/components/event/EventTickets.tsx
  - goathletix-frontend/src/components/event/TicketFinder.tsx (only the markup that wraps the cards)
  - goathletix-frontend/src/components/event/SectionNav.tsx (DELETE)
  - goathletix-frontend/src/components/event/EventSections.tsx (only the Resources and Sponsors blocks, if their markup needs a small tweak)
  - goathletix-frontend/src/components/event/event.css
acceptance: []
depends_on: [GA-059, GA-061]
related: [GA-058]
---

# GA-062 Tickets as full-width rows, one-column body, no section navigation

## Owner feedback (2026-10-30, with a screenshot of the Tickets area)

"For this section I don't want half and half ... and also don't want navigations too." The screenshot shows (1) the
Documents and Sponsors sidebar sitting beside the tickets (half and half), (2) two dense ticket cards side by side, each only
~450px wide so their content wraps and the two cards end at different heights, (3) a row of section tabs (Tickets, About,
Glimpses ... FAQ) above it. All three go.

## What the research supports (and does not)

Sources read: Baymard Institute's event-ticketing usability research, RunSignup's registration redesign notes, Webscorer's
registration setup, and a Drupal issue on accessible quantity steppers. Honest summary:
- Show the price on every option up front, with taxes/fees included early, and flag **Sold out** on the option itself.
  Hidden or late prices are the top cause of abandonment (Baymard).
- Put the quantity choice **in the selection itself**, not on a later step (Baymard).
- Order information as **distance first, then the details of that distance** (Webscorer's distance then categories; RunSignup
  put distance and price at the front of a mobile-first flow).
- Quantity stepper accessibility: named buttons, announced value, a disabled ceiling that keeps focus (Drupal issue).
- **No source compared rows against cards for this kind of page.** Rows over a two-up grid is a design judgement made because
  our options carry a lot of detail and are not a like-for-like comparison. Do not describe it as research-proven.

## Settled facts (do not re-investigate)

- Data is already normalised (`TicketType`, `ticketPricing(t, today)` in `EventTickets.tsx`). Do NOT change
  `src/lib/eventDetails.ts`. Keep every piece of information the current card shows; this is a re-layout, not a content cut.
- `TicketStepper.tsx` (client) takes `(label, max, price)`; keep using it. Platform ticketing shows the stepper and the
  honest disabled "Checkout coming soon" button; **external** ticketing shows information only (no stepper, no button, the page-level
  Register CTA does the work). Do not change that behaviour or invent a working checkout.
- `TicketFinder.tsx` appears above the tickets when there are more than 6 categories (the badminton sample has 12) and takes
  `cards: { id, node }[]`. It must keep working with rows.
- The reviews anchor `#reviews` and `SectionReveal` wrappers stay. `MobileTicketBar` points at `#tickets`; keep the
  `id="tickets"` section.
- Do not touch Reviews, PastGlimpses, the head/top block (photo, title, action card, At a glance), or the backend.
- Design rules from the owner and the project: no ALL-CAPS tracked micro-labels in the new rows (sentence case, size and
  weight carry hierarchy); no middle-dot joined meta strings ("RUNNING · 42.2 KM"); one memorable element, here the **large
  distance numeral**; theme tokens only (`--accent`, `--ink`, `--muted`, `--line`, `--surface`, `--tint-mute`, `--cta`,
  `--shadow`, `--ev-ease`), light and dark, no raw hex that duplicates a token; animation <= 320 ms, transform/opacity only,
  re-declared in the file's `@media (prefers-reduced-motion: reduce)` block with `!important` ending each declaration, never
  inside a comma list (`grep -nE '!important\s*,'` must stay empty).
- Tooling: repo has NO Prettier config, so never run `npx prettier` (it hangs). Typecheck `npx tsc --noEmit`; lint
  `NODE_OPTIONS=--max-old-space-size=4096 npx eslint src/components/event` (without the memory option eslint runs out of memory).

## What to build

### 1. Remove the section navigation
Delete `SectionNav.tsx`, its import and `<SectionNav>` usage, the `nav` array in `EventPage.tsx` and every `.ev-nav*` rule in
`event.css`. Keep the section `id`s (anchors still work). Simplify `.ev-sec { scroll-margin-top }` to a small constant now that
no sticky nav exists below the site header.

### 2. One-column body (no half and half)
At >= 900px the page is: row 1 = photo column | title, action card, at-a-glance (unchanged); row 2 = **one full-width column**
holding every section in order. Remove the grid areas `nav` and `extras`, the sticky `.ev-extras` column and the
`.ev-main { margin-top }` split. Move **Documents and links** and **Sponsors** out of the sidebar into the main flow, after
the FAQ, as full-width sections: documents as a responsive grid of link rows
(`repeat(auto-fill, minmax(280px, 1fr))`), sponsors as a wrapping row. Keep prose readable: cap paragraph width around 70ch
inside sections; do not cap the Tickets rows. Under 900px the order is unchanged (cover, title, sections, host, extras).

### 3. Ticket rows (replace the two-up cards)
Replace `TicketCard`'s card layout with one **full-width row per ticket**, stacked in a single column (`ul.ev-trows`, no grid).
Each row is a white rounded surface (border, small shadow, subtle hover shadow, no lift). At >= 760px it has three columns:

- **Left (about 104px): the distance numeral.** Large (36 to 44px, weight 800, tight tracking) with the unit ("km") small
  beneath. When the ticket has no distance (racquet categories, trek batches, team tickets), show a lucide icon tile instead
  (`Users` for team, `Ticket` otherwise).
- **Middle: the story.** Title (h3 or h4 by level) followed by quiet status chips: Timed / Not timed (when stated), a
  "Only N left" chip when `left <= 20`, and **Sold out** on the row itself. Then the one-to-two line description, then the
  inclusion icons row (`VocabList` with `short`, icons plus labels, wrapping). Then a `<details>` disclosure (no JS) whose
  summary reads "Details and requirements". Inside, labelled facts in a two-column grid with the **label above the value**
  (sentence case, muted label, normal-weight value): Starts, Cut-off, Who can enter (age rule plus the as-on note), Format
  (the sport-aware line GA-059 built), Qualifying standard, Documents to bring (`VocabList`), Not included (`VocabList` on
  `excludes`), Rates (the next price tier, "Rises to ₹X on D Mon"), Deposit and balance. Show only the facts that exist.
- **Right (about 220px): the buy cell.** Price large, struck-through compare-at price beside it, "incl. taxes" (existing
  `taxLabel`), the tier chip (Early bird) and a teal "Save ₹X" chip when `compareAtInr` beats the price. Under it the
  capacity line ("1,120 of 14,000 places left") with a thin fill bar that keeps the existing reveal animation. For platform
  ticketing, below that: `TicketStepper` and the disabled "Checkout coming soon" button, side by side when they fit.

Below 760px the row stacks: numeral and title on the first line, then description, icons, details, then the buy cell
full width. Touch targets at least 44px.

Sold-out rows: dimmed to about 55%, price struck through, no stepper and no button. Keep a visible **Sold out** chip at full
contrast so it is not lost in the dimming.

Add-ons and spectator groups use the same row component with their group heading. The category finder keeps working and
its result list renders rows.

Remove the now-dead card CSS (`.ev-ticket*`, `.ev-tfacts*`, `.ev-tgrid`, `.ev-savings` and friends) so nothing stale is left.

## Acceptance

- [ ] No section tabs anywhere; no sidebar beside the tickets; the body is one full-width column from 900px.
- [ ] Tickets are single-column rows on desktop and tablet, stacked on phones; no two-up cards remain.
- [ ] Every fact the old card showed is still reachable (row or Details), including sold-out, free, deposit, next-tier,
      session-date, team and no-distance cases; the badminton sample (12 categories) still shows the finder and rows.
- [ ] Platform vs external behaviour unchanged; nothing implies a working checkout.
- [ ] `npx tsc --noEmit` and eslint on `src/components/event`: 0 errors, 0 warnings. `!important\s*,` grep empty.
      `git grep -n "SectionNav\|ev-nav"` finds nothing.

## Rules

- Worktree `D:\project\goathletix-wt\fe-ga-062-tickets-full-width-rows`, branch `codex/ga-062-tickets-full-width-rows`.
  No dev server, no `npm install`, no `npx prettier`.
- Commit: `feat(event): ticket rows, one-column body, drop the section nav`, body references GA-062, end with
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Do NOT push.
- Handoff at `07 Agent handoffs/GA-062-discovery-ui.md`. Fill the Verification table.

## Verification

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `npx tsc --noEmit` | pass, 0 errors |
| Lint | `NODE_OPTIONS=--max-old-space-size=4096 npx eslint src/components/event` | pass, 0 errors, 0 warnings |
| CSS comma-list `!important` | `grep -nE '!important\s*,' src/components/event/*.css` | empty |
| No nav left | `git grep -n "SectionNav\|ev-nav"` | empty (run after commit 42a739d) |

Browser check: not run (no dev server allowed in this task). Commit 42a739d on the branch, not pushed.
