---
id: GA-061
type: task
status: ready
priority: P1
owner: discovery-ui
branch: codex/ga-061-event-reviews-ui
worktree: D:\project\goathletix-wt\fe-ga-061-event-reviews-ui
scope:
  - goathletix-frontend/src/components/event/Reviews.tsx (new, server component)
  - goathletix-frontend/src/components/event/ReviewForm.tsx (new, client component)
  - goathletix-frontend/src/components/event/reviews.css (new)
  - goathletix-frontend/src/components/event/EventPage.tsx (add the section, one nav item, make the rating badge a link)
  - goathletix-frontend/src/lib/eventDetails.ts (types + normaliser for reviews)
  - goathletix-frontend/src/lib/sampleContent.ts (sample reviews on the Tata sample only)
acceptance: []
depends_on: [GA-049]
related: [GA-060]
---

# GA-061 Ratings and reviews section on the event page

## Why

Owner feedback 2026-10-28: "there is no option to rate the events and comments also should be there." The page shows a
rating badge in the head but has no way to read or write reviews.

## Settled facts (do not re-investigate)

- **Posting is not possible yet.** There is no authentication anywhere (the header "Sign in" button is disabled with
  the tooltip "Accounts are coming soon"). So this task builds the **read UI plus the write form's interface**, and the
  form must be **honest**: it can be filled in, but its submit button is disabled with a plain explanation. Do NOT fake
  persistence (no localStorage "saved review", no fake success, no fake toast). Never invent reviews for real events.
- Real events return `reviews` and `rating_summary` from `GET /events/:id/details` once GA-060 lands. Until then the
  arrays are absent: treat absent as empty. Contract (snake_case, all optional):
  ```
  reviews: [{ id, rating, title, body, edition_year, category_label, helpful_count, created_at, author_name }]
  rating_summary: { avg: number|null, count: number, distribution: {"1":n,...,"5":n} | null }
  ```
  `distribution` is `null` when the rows do not account for the count: then show only the average, no bars.
- `event.rating_avg` / `rating_count` already flow into `d.rating = { avg, count }` (eventDetails.ts ~line 930). The
  head badge is built at EventPage.tsx ~line 110.
- The sample event (Tata Mumbai Marathon, slug `sample-tata-mumbai-marathon-2027`) is the only place sample reviews
  may live, and they must be visibly labelled "Sample review" so nobody mistakes them for real ones.
- Server components cannot hold state; only `ReviewForm.tsx` is `"use client"`. Do not import `eventDetails.ts` or
  `sampleContent.ts` from a client file (see the boundary rule in EventPage.tsx's header comment).
- Next 16 / React 19: read `node_modules/next/dist/docs/` before writing App Router code. Tailwind v4 is present but this
  page uses plain CSS with `ev-` prefixed classes and theme tokens (`--accent`, `--ink`, `--muted`, `--line`,
  `--surface`, `--tint-mute`, `--star`, `--ok`, `--shadow`, `--ev-ease`). No raw hex that duplicates a token. Light and dark.
- Animation rule: short (<= 320 ms), transform/opacity only. The owner's OS has reduced motion on but wants to see motion,
  so re-declare any animation inside an `@media (prefers-reduced-motion: reduce)` block **with `!important` ending its own
  declaration**; never put `!important` inside a comma list (grep for `!important\s*,` must be empty). Put these in
  `reviews.css` (import it from `Reviews.tsx`).

## Design brief

Section id `reviews`, title **"Ratings and reviews"** (use the page's `Section`-style heading: `ev-h2`). Wrap in
`SectionReveal` like the other sections (see `EventSections.tsx` `Section`).

1. **Summary row.** Left: the average in large type (e.g. 4.9), five stars with fractional fill, "N reviews". Right: a
   distribution chart, rows 5 -> 1, each a label, a bar and a percentage; bars animate their width in once on reveal.
   Only when `distribution` is present. With no rating at all, show the empty state instead (below).
2. **Write a review** (`ReviewForm`, client). A quiet card: a **star picker** (radiogroup of five; hover previews, arrow
   keys move, Home/End, visible focus ring, a word label that changes: Poor / Fair / Good / Very good / Excellent),
   an optional title (max 120), a comment textarea (max 4000, live "n / 4000" counter, min 10 chars), and an optional
   "Which category did you do?" select built from the event's ticket labels (passed in as a plain `string[]` prop).
   Submit button is `disabled` and reads "Posting opens with accounts". Beneath it, one plain sentence: "Reviews and
   comments need an account, which is coming soon. Every review is checked by moderators after it appears." Use
   `aria-describedby` so assistive tech reads that reason.
3. **Review list.** Cards: initials avatar, `author_name`, stars, date ("12 Oct 2026"), an "<year> edition" chip and a
   category chip when present, bold title, body clamped to 4 lines with a "Read more" disclosure when longer (use a
   `<details>` or a CSS clamp plus a toggle that works without JS), and "N found this helpful" only when
   `helpful_count > 0`. Newest first as delivered. Sample reviews also carry a "Sample review" chip.
4. **Empty state** (no reviews and no rating): a friendly line, "No reviews yet. Be the first to rate this event once
   accounts open." with an outline star illustration (lucide `Star`/`MessageSquareText`), still showing the form.
5. **Head badge.** The rating badge in the title area becomes a link to `#reviews` (keep its look; add a visible hover
   underline and `aria-label` like "Rated 4.9 from 3,100 reviews, jump to reviews"). When there is no rating, no badge
   (unchanged).
6. **Nav + order.** Add `{ id: "reviews", label: "Reviews" }` to the section nav, **after Policies, before FAQ**. Render the
   `Reviews` section in the same place in `.ev-main` (after `VenueSection`, before `FaqSection`). Show the section on every
   event (the empty state covers events with none).
7. **Accessibility.** Headings in order (h2 then h3), stars are decorative (`aria-hidden`) with a text alternative
   ("Rated 4 out of 5"), 44 px touch targets for the star picker, labels on every field, contrast AA.
8. **Phone (375 px).** Summary stacks (average above bars), cards full width, star picker stays one row.

## Data work

- `src/lib/eventDetails.ts`: add `RawReview`, `RawRatingSummary`, and normalised `Review`, `RatingSummary` types; extend
  `RawEventDetails` with `reviews?` and `rating_summary?`; extend `EventDetail` with `reviews: Review[]` and
  `ratingSummary?: { avg?: number; count: number; distribution?: Record<1|2|3|4|5, number> }`. Normalise defensively
  (clamp rating 1..5, drop rows without a rating, trim text, ISO date to "D Mon YYYY" with the project's string-splitting
  date rule: never `new Date(str)` for calendar dates; `created_at` is a timestamp so formatting it in IST via the existing
  helpers is fine).
- `src/lib/sampleContent.ts`: on the Tata sample only, add 4 sample reviews (mixed ratings 5/5/4/3, varied lengths, one
  long enough to need "Read more") and a `rating_summary` consistent with the existing 4.9 / 3,100 (a plausible
  distribution whose counts sum to 3,100). Mark nothing as real.

## Scope and ownership

Only the files listed in `scope`. Out of scope: backend, migrations, seeds, `globals.css`, the homepage, `layout.tsx`,
any other event component, package files.

## Acceptance

- [ ] Section renders on the four seeded real events (empty state or summary-only) and on the Tata sample (full).
- [ ] The form works as an interface (stars, counter, select) and never claims to have saved anything.
- [ ] Head rating badge links to `#reviews`; nav has a Reviews tab in the right place.
- [ ] `npx tsc --noEmit` and `npx eslint src/components/event src/lib` (use `NODE_OPTIONS=--max-old-space-size=4096`,
      no --fix): 0 errors. `grep -nE '!important\s*,' src/components/event/*.css` empty.

## Rules

- Worktree `D:\project\goathletix-wt\fe-ga-061-event-reviews-ui`, branch `codex/ga-061-event-reviews-ui`. No dev server, no
  `npm install`, **no `npx prettier`** (this repo has no Prettier config; `npx` will hang trying to download it).
- Commit: `feat(event): ratings and reviews section with a gated write form`, body references GA-061, end with
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Do NOT push.
- Handoff at `07 Agent handoffs/GA-061-discovery-ui.md`. Fill the Verification table.

## Verification

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `npx tsc --noEmit` | pass, no output (commit 730acba) |
| Lint | `npx eslint src/components/event src/lib` | pass, 0 errors, 0 warnings |
| CSS comma-list `!important` | `grep -nE '!important\s*,' src/components/event/*.css` | empty (exit 1) |
| Server/client boundary | list of `"use client"` files you touched | only `ReviewForm.tsx` (new); it imports no data module |
| Browser check | render on seeded events and 375 px | not run (no dev server allowed in this task) |
