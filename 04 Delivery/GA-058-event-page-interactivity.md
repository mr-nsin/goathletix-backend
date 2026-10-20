---
id: GA-058
type: task
status: ready
priority: P1
owner: discovery-ui
branch: codex/ga-058-event-page-interactivity
worktree: D:\project\goathletix-wt\fe-ga-058-event-page-interactivity
scope:
  - goathletix-frontend/src/components/event/EventSections.tsx
  - goathletix-frontend/src/components/event/EventTickets.tsx
  - goathletix-frontend/src/components/event/event.css
  - goathletix-frontend/src/components/event/SectionReveal.tsx (new, optional)
acceptance: []
depends_on: [GA-049, GA-057]
related: [GA-056]
---

# GA-058 Event page interactivity: section reveal, richer ticket cards, checkpoint timeline

Three bundled polish items that turn a well-structured page into one that feels composed and alive.
Owner request: "make the information displayed look more interactive, Pinterest-style ideas, more
engaging UX for event information with animations where appropriate."

## Context (settled; do not re-investigate)

- The event page lives at `src/components/event/EventPage.tsx`. It composes a `<Section>` wrapper
  (defined in `EventSections.tsx` around line 35) and sport-specific sub-sections.
- `<Section>` is a plain server component today: it renders an `<section id>` and an `.ev-h2`. Adding
  a client-side reveal means a tiny new client wrapper that marks the children with a class the CSS
  responds to. Do NOT turn `Section` itself into a client component — EventSections.tsx is a server
  module and multiple server-only helpers call `<Section>` directly.
- The ticket card lives at `src/components/event/EventTickets.tsx` around line 170. The data model
  (`t.compareAtInr`, `t.capacity`, `p.left`, `p.fill`, `p.soldOut`, `t.includes`, `t.depositInr`,
  `t.minAge`, `t.maxAge`, `t.ageAsOn`, `t.requiredDocuments`) is already normalised; use it, do not
  change `src/lib/eventDetails.ts`.
- Current fill bar is `.ev-cap .ev-bar i` with `transform: scaleX(fill/100)` applied inline — the
  width signal is already there, just needs a CSS transition and a visible percentage label.
- Current checkpoints are `<ol className="ev-cps">` with `.ev-cphead` per item (around line 209 of
  EventSections.tsx) — services list, `c.closes`, `c.closesAfter`, `c.name`, `c.km`.
- The project's animation convention (CLAUDE.md §7 and existing patterns in `event.css`):
  short easings (200–400ms), one orchestrated load moment only; everything else responds to
  intent. The owner has `prefers-reduced-motion: reduce` ON but wants to see the motion anyway, so
  **re-declare every new animation inside a `@media (prefers-reduced-motion: reduce)` block with
  `!important`**, never in the middle of a comma-separated declaration. Look at the existing
  reduced-motion block at the end of `event.css` for the pattern.
- Styling conventions: project uses CSS custom properties (`--accent`, `--cta`, `--ink`, `--muted`,
  `--line`, `--tint-mute`, `--surface`, `--shadow`, `--ev-ease`, `--radius`). Do not hardcode colors
  that match the palette; use the tokens.
- `.ev-h2` already has a teal accent bar from GA-057's polish; keep that pattern.

## Scope (what you own; nothing else)

- `src/components/event/EventSections.tsx` — add a reveal wrapper hook on the `<Section>` return;
  rebuild the checkpoint timeline section (around line 203–260 inside `CourseSection`).
- `src/components/event/EventTickets.tsx` — enrich the ticket card (around line 170–260 inside
  `TicketCard`).
- `src/components/event/event.css` — new styles + reduced-motion overrides.
- (new, optional) `src/components/event/SectionReveal.tsx` — a 20–40 line `"use client"`
  IntersectionObserver wrapper if you take the JS route for reveals.

**Out of scope:** `globals.css`, `Sections.tsx` (homepage sections), `layout.tsx`, `page.tsx` (homepage),
`EventPage.tsx` (unless strictly needed to wrap sections — if so, change one line and justify it),
`eventDetails.ts`, `sampleContent.ts`, backend, migrations, seeds.

## What to build

### 1. Scroll-driven section reveals

Each `<Section>` fades in from `opacity:0; translateY(8px)` to `opacity:1; translateY(0)` when it
enters the viewport. Options:

- **(A) Pure CSS, cheap**: use `animation-timeline: view()` with `view-timeline-name` on each
  `.ev-sec`. If the project's browser targets include Edge/Chrome 115+, this works with zero JS.
- **(B) Client wrapper with IntersectionObserver** if (A) is not safe. Create
  `SectionReveal.tsx` ("use client", 20 lines), takes `{ children, id }`, adds `.is-in` class once
  intersecting (threshold 0.08, rootMargin "0px 0px -60px 0px"), unobserves after first fire.
  Wrap each `<Section>` return in `<SectionReveal id={id}>…</SectionReveal>`.

Pick A if browser targets allow (check `goathletix-frontend/package.json` browserslist or just use B
to be safe — this is more important to work on first paint than to save 1KB). Record your decision in
the handoff.

Behaviour:
- First-paint sections already above the fold reveal immediately (do not wait for scroll).
- Each section's children stagger by ~40ms (title → body → list) using a nested `animation-delay`
  on first-level children of `.ev-sec.is-in`.
- `prefers-reduced-motion: reduce` → re-declare the reveal and the stagger with `!important` so the
  owner's machine still sees the animation. If the user truly wants it off, the browser respects it
  via the system setting; we honour the intent to see motion.

### 2. Richer ticket cards

Keep the current layout; add four interactive affordances:

- **Savings ribbon** when `t.compareAtInr` is set and `t.compareAtInr > p.price`:
  show "Save ₹X · Y% off" as a corner ribbon (`.ev-savings`) that reads at a glance. Use
  `--accent` for the chip, white text, tucked into the top-right of the card (position: absolute).
- **Progress bar with percent label**: `.ev-cap` already has a bar; make it animate from 0 to
  `fill%` width on reveal (combine with task 1: trigger the width transition when `.ev-sec.is-in`
  is set on the Tickets section). Add an inline percentage label like "72% full" next to the
  "N of M places left" line. Hide the percent when fill is 0.
- **Hover reveal of secondary info**: when the card is hovered or focus-within, reveal a bottom
  disclosure containing minimum/maximum age with the age-as-on date, required documents (as
  `VocabList`), qualifying standard. Already-visible facts (age chip, included icons) stay. The
  disclosure is `.ev-trev` and uses `height` / `opacity` transitions, 240ms. On touch devices it
  should ALWAYS be visible (fallback to `(hover: none)` media query).
- **Micro-animations on the quantity stepper** `.ev-qty` already has `evBump`; keep it. Add a
  600ms colour sweep across the "Total ₹X" when quantity changes (CSS `@keyframes` only, triggered
  by a `data-animate` attribute toggled by the stepper's existing React state — this needs a tiny
  client-side touch; keep it minimal).

Visually:
- Hover lift: `transform: translateY(-3px)`, `box-shadow: var(--shadow-lg)` 220ms, already partly
  there — audit and strengthen.
- Sold-out cards: dim to 70% opacity, strike through the price, no hover lift.

### 3. Checkpoint timeline

Rebuild the checkpoint `<ol className="ev-cps">` to render as a vertical rail timeline:

- A continuous 2px vertical line down the left (`::before` on the `<ol>`).
- Each `<li>` has a 12px filled circle marker (`.ev-cp-dot`), aligned to the vertical line.
- Markers for checkpoints whose `closes` or `closesAfter` has already passed (compared against
  "now" — pass today as a prop or compute `new Date()` client-side via a tiny `"use client"` only
  if strictly needed; otherwise, skip the past/upcoming distinction entirely rather than add JS).
- Each row: `.ev-cp-head` with `b{name}`, km chip, right-aligned closes / closesAfter chip.
- Each row's services render as a horizontal `.ev-cp-services` row of icon-only chips (lucide
  VocabIcon from the project's shared vocab).
- The rail draws itself on reveal: `::before` height animates from `0` to `100%` over 800ms when
  `.is-in` is applied (combine with reveal animation).

If the data has no cut-offs at all, do not draw the rail — keep the simpler layout. If every
checkpoint has services, hide "and services" label text and let the icons speak.

## Acceptance

- [ ] `<Section>` reveals on scroll with the 8px slide + fade; above-the-fold sections reveal
      immediately on first paint; stagger works.
- [ ] Reduced-motion is re-declared with `!important` so motion still shows for the owner.
- [ ] Ticket cards gain the savings ribbon, animated fill bar with percentage, hover disclosure
      with secondary info, and the quantity-change colour sweep.
- [ ] Checkpoint timeline shows the vertical rail with dot markers and animated draw-in.
- [ ] All four showcase events still render without errors; sold-out and no-data branches do not
      regress.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npx eslint src/components/event` passes with 0 errors (6 pre-existing warnings OK).
- [ ] `grep -nE '!important\s*,' src/components/event/*.css` returns nothing (CSS invalid pattern
      the project has been bitten by before).

## Rules

- Work in the worktree `D:\project\goathletix-wt\fe-ga-058-event-page-interactivity` on branch
  `codex/ga-058-event-page-interactivity`. Do not switch branches, do not run dev servers, do not
  `npm install` inside the worktree.
- Keep each new animation under 400ms. One load moment only on first paint; everything else is
  intent-driven (hover, focus, scroll).
- Never add a `.local.json`, `.env`, dependency, or anything outside the scope list.
- Commit on `codex/ga-058-event-page-interactivity` with message:
  `feat(event): scroll-driven section reveals, richer ticket cards, checkpoint timeline`
  Body references GA-058. End with:
  `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`
- Do NOT push; coordinator merges, reshoots and pushes.

## Verification table (fill this in)

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Lint | `npx eslint src/components/event` | exit 0, 0 errors, 0 warnings |
| CSS `!important` inside comma list | `grep -nE '!important\s*,' src/components/event/*.css` | empty (grep exit 1) |
| Server/client boundary | file list of changed `"use client"` files | SectionReveal.tsx (new), TicketStepper.tsx (existing client, small edit). EventSections/EventTickets stay server. Browser rendering not run (no dev server per rules) |

## Handoff

Short handoff at `07 Agent handoffs/GA-058-discovery-ui.md`:
- Files changed and why.
- Reveal strategy chosen (CSS `animation-timeline` vs IntersectionObserver) and why.
- Any judgement calls made where the task note was silent.
- tsc + eslint results.
