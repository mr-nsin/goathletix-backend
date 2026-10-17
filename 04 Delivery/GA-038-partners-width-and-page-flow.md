---
id: GA-038
type: task
status: done
priority: P1
owner: discovery-ui
branch: codex/ga-038-partners-flow
worktree: D:\project\goathletix-wt\fe-ga-038-partners-flow
scope: [PartnersSection.tsx, PartnersSection.css, AlertsSectionV2.tsx, flow.css, ClosingBanner.tsx, Footer.tsx (parade and made-in only)]
acceptance: []
depends_on: [GA-034, GA-031]
related: []
---

# GA-038 Partners width, athlete strip without background, decent page flow

Read [[08 Runbooks/Agent brief - frontend]] and [[01 Product/Card design principles]] first. Do **not** edit `globals.css`, `Sections.tsx` or `page.tsx`.

## Owner feedback (screenshots described)

1. **Partners section got narrower: increase the width.** The hero card (glass card with the dashboard mock, trophy and floating chips) is now
   about 940 px wide inside a 1440 px page, so the section looks pinched next to the full-width rails. Make the hero card and the stat tiles
   use the full content width (the same left and right edges as the rails above it; cap only at a sensible max for ultra-wide screens), and
   re-balance its inside: illustration left or centre, copy and buttons beside or below, so the extra width is used well and nothing floats
   in empty space. Keep tabs, the stepper, honest Soon labels, `id="host"`, live numbers.
2. **Athlete strip: "remove the background".** Remove the teal glow/gradient band behind the running athletes and any other panel behind them:
   the athletes and their ground line sit straight on the page background.
3. **"Make the website flow look more decent."** Review the whole tail of the homepage as one sequence: rails, partners section, alerts card,
   finish-line banner, athlete strip, made-in line, footer. Give it one vertical rhythm (consistent section spacing, same side gutters
   everywhere, no abrupt colour jumps), soft transitions between blocks, and make sure no block looks like a stray separate band. Keep every link
   and the finish-line checkered ribbon. Decide what to simplify (fewer decorative elements) and report your decisions.
4. Cards inside these sections (stat tiles, stepper cards, infographic cards) use the card type roles from the principles note (title 18, body 14, meta 13, chip 12, one stat 24).

## Scope and ownership

- Owned: the files in the scope line. In `Footer.tsx` only the parade and made-in parts; `flow.css` is yours.
- Out of scope: every other file.

## Acceptance criteria

- [ ] Partners hero card and stats span the same edges as the rails; no pinched look at 1440 and 1905 px wide, 375 px works.
- [ ] No background behind the athlete strip.
- [ ] Consistent vertical rhythm and gutters from the partners section to the footer; report the decisions.
- [ ] Card text in these sections uses only the type roles.
- [ ] `npx tsc --noEmit`, `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | 0 errors, run in worktree |
| eslint src | pass | 0 errors, 6 existing warnings |
| Server/client boundary self-check | pass | CSS plus one comment line removed; no component calls changed |
| Loaded in a browser | not run | coordinator, after merge |

## Outcome

merged 2026-10-17.

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
