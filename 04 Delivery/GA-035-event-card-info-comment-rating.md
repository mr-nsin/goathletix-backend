---
id: GA-035
type: task
status: done
priority: P1
owner: discovery-ui
branch: codex/ga-035-event-card-info
worktree: D:\project\goathletix-wt\fe-ga-035-event-card-info
scope: [EventCard.tsx, CardActions.tsx, cardModel.ts, sample event cards in sampleContent.ts, OrganisersRail in Sections.tsx, FollowButton.tsx, src/app/globals.css (event and organiser card rules only)]
acceptance: []
depends_on: [GA-033]
related: []
---

# GA-035 Event card: information design, enabled Comment, rating slot on every card; organiser cards on the type system

Read [[08 Runbooks/Agent brief - frontend]] and [[01 Product/Card design principles]] first (tokens in `src/app/card-tokens.css`).
**You are the only task allowed to edit `src/app/globals.css` this batch**, only the event-card and organiser-card rules.

## Owner feedback

1. "The comment icon is not showing on cards, also ratings." and "comment icon is grayed out, it should be like other icons."
   - **Comment** must look and behave like Interested / Save / Share: same colour, hover and focus states, not greyed, not `aria-disabled`.
     No comments feature exists yet, so clicking it opens a small inline popover or toast "Comments are coming soon" (accessible: `role="status"`
     or a proper popover, closes on blur or after a few seconds). Do not fake comments.
   - **Rating on every card.** Real API events have no rating data (and you must never invent one). So every card shows a rating slot in the title row:
     a gold star plus value plus "(count)" when `e.rating` exists (sample cards), and for cards without data a muted outline star with the text
     "No reviews yet". The slot is always there so cards look consistent. Explain this choice in your report (real ratings need a reviews feature).
2. **Improve the information design of the event card** (the owner's screenshot shows: chip row ATHLETICS / 60m / 100m / +2 / AFI / U12, a
   date | place block, a blue "Registrations are open" panel, price "Rs 200 onwards" with the Register button, then an avatar row "410 people
   are interested"). Take ideas from the best event-card designs on Dribbble, Eventbrite, BookMyShow and District (you cannot browse them; use
   judgement): for example a compact date tile, icon-led rows with clearer grouping, a countdown or urgency chip ("closes in 5 days") only when
   `registrationClosesAt` exists, a registration progress meter only when real fill data exists (it does not: omit), clearer hierarchy between
   the status panel and the price row, tighter spacing rhythm. The Register Now button keeps its gradient colours. Keep the fixed-height
   sections that make neighbouring cards align.
3. **Type system:** apply the five text roles from the principles note to the event card and the organiser card (`.ocard` in globals and
   `OrganisersRail` in `Sections.tsx`): remove any ad-hoc font sizes; use the tokens.

## Scope and ownership

- Owned: files in the scope line. In `sampleContent.ts` edit only the sample **event** cards (another task edits the club and guide entries in the same file: do not touch those hunks). In `Sections.tsx` edit only `OrganisersRail`.
- Out of scope: sport, gear, city, club, guide, partners, footer, featured banner.

## Acceptance criteria

- [ ] Comment looks like the other three actions, never greyed; click gives the "coming soon" feedback.
- [ ] Rating slot on every card (real: "No reviews yet"; sample: star, value, count); no layout shift between cards.
- [ ] Event card information visibly improved and aligned across a row; type roles from the principles note only.
- [ ] Organiser cards use the same roles.
- [ ] `npx tsc --noEmit`, `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | exit 0, no output |
| eslint src | pass | 0 errors, 6 pre-existing warnings |
| Server/client boundary self-check | pass | EventCard stays a server component, renders client CardActions only; no client export called |
| Loaded in a browser | not run | coordinator, after merge |

## Outcome

merged 2026-10-17; rating then moved to the right of the title (owner request); real events show "No reviews yet" because no ratings data exists.

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
