---
id: GA-033
type: task
status: done
priority: P1
owner: discovery-ui
branch: codex/ga-033-card-comment-rating
worktree: D:\project\goathletix-wt\fe-ga-033-card-comment-rating
scope: [src/components/home/EventCard.tsx, src/components/home/CardActions.tsx, src/lib/cardModel.ts, src/app/globals.css (event card rules only)]
acceptance: []
depends_on: [GA-028]
related: []
---

# GA-033 Put the Comment action and the rating back on event cards

Read [[08 Runbooks/Agent brief - frontend]] first. In this batch **you are the only task allowed to edit `src/app/globals.css`**, and only the event-card rules (`.card`, `.titlerow`, `.rating`, `.cardactions` and their children, including the card v6/v7/v8 blocks near the end of the file).

## Goal (owner feedback)

The owner removed these earlier and now wants them back: "there should be a comment icon on the card and ratings on event cards".

1. **Comment action**: the footer action bar goes back to four labelled actions: Interested, Save, Share, Comment (icon plus the word). Comment is a placeholder (no discussion feature exists yet): disabled-looking but keyboard focusable is fine, with a tooltip or `title` "Comments are coming soon" and `aria-disabled`. Keep the 15 px labels and 21 px icons the owner asked for; make sure four items still fit on one line at 375 px (use smaller gap or the shorter label if needed, and verify by reading the CSS widths).
2. **Rating**: restore the star rating next to the title (plain gold star and number, as before) **when a rating exists**. Real events have no rating data (the API has no ratings), so never fabricate one: show it only when `e.rating` is set (sample cards have it). Also show the review count in the same style as the owner's reference ("4.6 (2.3K)") when `e.reviews` exists: add an optional `reviews?: string` to `CardModel` and fill it in `src/lib/sampleContent.ts` only if that file is not owned by another task (it is NOT owned by anyone in this batch, you may add a `reviews` value to the sample event cards).
3. Keep the card structure and the section alignment work from earlier rounds (fixed-height chip row, when | where block, aligned price row); a card without a rating must not shift the layout of the rest of the card.

## Scope and ownership

- Owned: `EventCard.tsx`, `CardActions.tsx`, `src/lib/cardModel.ts`, the event-card rules in `globals.css`, the sample event card entries in `src/lib/sampleContent.ts`.
- Out of scope: everything else. A parallel task (GA-034) edits only the partners section files.

## Acceptance criteria

- [ ] Four actions (Interested, Save, Share, Comment) on one line at 375 px and desktop; Comment clearly a placeholder.
- [ ] Rating (and review count when present) shown when data exists; absent when not; no layout shift.
- [ ] `npx tsc --noEmit`, `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass (exit 0) | worktree, commit 2733684 |
| eslint src | 0 errors, 6 existing warnings | worktree |
| Server/client boundary self-check | pass | EventCard stays a server component, only renders CardActions; no client export is called |
| Loaded in a browser | not run | coordinator, after merge |

## Outcome

merged 2026-10-17. Actions are stacked (icon above label) because four icon-beside-label buttons do not fit in 78 px. Real API events still show no rating: no ratings data exists.

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
