---
type: handoff
status: ready-for-review
task: "[[04 Delivery/GA-061-event-reviews-ui]]"
agent: discovery-ui
branch: codex/ga-061-event-reviews-ui
worktree: D:\project\goathletix-wt\fe-ga-061-event-reviews-ui
commit: 730acba
tags: [handoff]
---

# Handoff: GA-061 Ratings and reviews section on the event page

## Outcome

Every event page now has a "Ratings and reviews" section (after Venue, before FAQ) with a Reviews nav tab, a summary with
distribution bars when the data accounts for the count, a review list, an empty state, and a write form that is a real
interface but cannot post (button disabled, honest reason). The head rating badge links to `#reviews`. Sample reviews exist
on the Tata sample only and carry a "Sample review" chip.

## Changed paths

- `goathletix-frontend/src/components/event/Reviews.tsx` (new, server) — summary, list, empty state
- `goathletix-frontend/src/components/event/ReviewForm.tsx` (new, client) — star radiogroup, counter, category select, disabled submit
- `goathletix-frontend/src/components/event/reviews.css` (new) — `ev-` styles, reduced-motion re-declarations
- `goathletix-frontend/src/components/event/EventPage.tsx` — section, nav item, badge link, header comment
- `goathletix-frontend/src/lib/eventDetails.ts` — `RawReview`, `RawRatingSummary`, `Review`, `RatingSummary`, normalisers, `EventDetail.reviews` / `ratingSummary`
- `goathletix-frontend/src/lib/sampleContent.ts` — 4 sample reviews and a 3,100-count distribution (average about 4.9) on the Tata sample

## Verification

| Command/check | Result |
| --- | --- |
| `npx tsc --noEmit` | pass |
| `NODE_OPTIONS=--max-old-space-size=4096 npx eslint src/components/event src/lib` | pass, 0 problems |
| `grep -nE '!important\s*,' src/components/event/*.css` | empty |
| Browser check (seeded events, 375 px, dark) | not run |

## Decisions and risks

- Decision: added `is_sample` to `RawReview` (set only in sample content) to drive the chip; the API never sends it.
- Decision: `distribution` is kept only when its total equals `count`; otherwise bars are dropped and only the average shows.
- Decision: summary falls back to `rating_avg` / `rating_count` (`d.rating`) when `rating_summary` is absent, so real events show the average today.
- Decision: "Read more" is a `<details>` toggle plus CSS line clamp unclamped via `:has(details[open])`; no JS.
- Decision: the form categories are the participant/team ticket labels.
- Known limitation: not checked in a browser or at 375 px (no dev server allowed); layout and motion are untested visually.
- Known limitation: the Reviews tab shows on every event, as specified.
- Secrets: none.

## Integration request

Open `/events/sample-tata-mumbai-marathon-2027` and one seeded event; check the section, the badge jump, the Reviews tab, dark mode and 375 px. Merge after GA-060 lands or independently (absent fields are treated as empty).
