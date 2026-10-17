---
id: GA-034
type: task
status: done
priority: P1
owner: discovery-ui
branch: codex/ga-034-partners-v2
worktree: D:\project\goathletix-wt\fe-ga-034-partners-v2
scope: [src/components/home/PartnersSection.tsx, src/components/home/PartnersSection.css]
acceptance: []
depends_on: [GA-025, GA-031]
related: []
---

# GA-034 Partners section: connected circle stepper, no overlapping arrows, stronger design

Read [[08 Runbooks/Agent brief - frontend]] first. Do **not** edit `globals.css`, `Sections.tsx` or `page.tsx` (GA-033 owns `globals.css` this batch).

## Goal (owner feedback on two screenshots)

1. **How-it-works arrows**: today an animated arrow sits on top of the card edges (about 16 px overlap into the card padding). The arrow must NOT overlay anything: it lives in its own gap between cards. Also "make round circles showing some information": replace the small numbered dots by a real **circle stepper**: a row of large round nodes (about 56 to 64 px) joined by a connecting line with an animated arrow/progress segment between them; each circle carries an icon (lucide) and the step number, and a small round info bubble or caption under/over it with one real fact (examples: "about 5 min", "race week", "post-race"; do not invent figures; use qualitative facts already in the copy). The step card (title and text) sits under its circle, never touching the connector. The sequence stays: circle 1 pops in, the connector draws to circle 2, circle 2 pops in, and so on; replays when the panel changes; final state fully visible without motion/JS. On phones the stepper becomes vertical with the connector going down.
2. **Overall design of the section** (the owner's second screenshot: the "Organise it. Equip it. Coach it." heading, a tab pill, a big green circle icon with three small satellite icons, "FOR ORGANISERS", the Typed headline, a paragraph, two buttons, then stat tiles): improve it with ideas from modern product pages and Pinterest-style layouts (you cannot browse Pinterest, so use your judgement and the web where reachable): for example a soft mesh/gradient backdrop behind the section, a bento-style layout (the hero illustration card on one side with floating glass chips, the stats as rounded tiles of different sizes), a mock "organiser dashboard" or "ticket" illustration built from CSS/SVG (no stock photos) that changes per tab, orbiting satellite icons, subtle parallax-free float animation, better spacing rhythm and typographic hierarchy, clearer primary action. Keep it centred as the owner asked earlier, keep the three tabs and all honest "Soon" labels and `id="host"` and the live numbers; no invented numbers.

## Scope and ownership

- Owned: `PartnersSection.tsx`, `PartnersSection.css`, new files you create for it.
- Out of scope: `globals.css`, `Sections.tsx`, `page.tsx`, the event card, header, footer, `AlertsSectionV2`.

## Acceptance criteria

- [ ] No arrow or connector overlaps a card or circle; arrows sit in their own space.
- [ ] Round-circle stepper with icon plus number and a small information bubble per step; sequential reveal; vertical on phones; correct final state without animation.
- [ ] Visibly improved section design as described; centred; tabs, Soon labels and id kept; works in dark mode and at 375 px.
- [ ] Motion visible with reduced-motion ON (see the brief), transform/opacity only.
- [ ] `npx tsc --noEmit`, `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | 0 errors, worktree |
| eslint src | pass | 0 errors, 6 pre-existing warnings |
| Server/client boundary self-check | pass | only PartnersSection.tsx/css changed; no server-side calls into it |
| Loaded in a browser | not run | coordinator, after merge |

## Outcome

merged 2026-10-17. Circle stepper; connector sits in its own gap between nodes; CSS-built dashboard mock; bento stat tiles.

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
