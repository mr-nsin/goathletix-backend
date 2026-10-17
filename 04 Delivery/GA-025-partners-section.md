---
id: GA-025
type: task
status: ready
priority: P1
owner: discovery-ui
branch: codex/ga-025-partners-section
worktree: D:\project\goathletix-wt\fe-ga-025-partners-section
scope: [goathletix-frontend/src/app/page.tsx, new src/components/home/PartnersSection.tsx, OrganiserBand and SellerBand in Sections.tsx]
acceptance: []
depends_on: []
related: [GA-020, ADR-008]
---

# GA-025 One centred partners section: organisers, sellers, coaches and academies, with animation

## Goal

Today there are two separate full-width bands (organisers, then sellers) with left-aligned text. The owner wants **one**
section, **centred**, covering organisers, sellers and the new audience **coaches + academies** (requirement #61 and
ADR-008 proposed: coaches and academies host their own trainings; Phase 1 is find-a-coach with no payments), with animation.

## Scope and ownership

- Owned: new `src/components/home/PartnersSection.tsx` and `PartnersSection.css`; delete only the `OrganiserBand` and
  `SellerBand` functions from `src/components/home/Sections.tsx`; the lines in `src/app/page.tsx` that render them.
- Out of scope: `src/app/globals.css`, `SportGrid`, `CityRail`, `AlertsSection` and every other function in Sections.tsx,
  `AlertsForm.tsx`, header, footer, ClosingBanner, backend.
- Coordination: batch 2 runs three frontend tasks at once. **Nobody edits `globals.css`.** Put styles in your own new `.css`
  file imported by your component; `globals.css` loads first, so equal-specificity rules in your file win. GA-024 edits
  `SportGrid` and `CityRail` in the same Sections.tsx: keep your deletions confined to the two band functions so the merge is clean.

## Acceptance criteria

- [ ] One section with a centred heading and a three-way switch (Organisers / Sellers / Coaches and academies): sliding
      indicator, content cross-fade, auto-advance about every 7 s, stopping once the user interacts or hovers. Each panel has the
      headline, one paragraph, 3 steps, 3-4 stat tiles, the existing buttons (organiser login / list your event; seller login /
      start selling; coaches: "Host a training" and "Find a coach"), and an icon illustration. Entrance animation on scroll.
- [ ] Everything in the section is centred (text, stats, buttons) inside the normal `.wrap` width.
- [ ] Keep `id="host"` on the section (ClosingBanner and HeroDoors link to `/#host`); keep `id="sell"` reachable (an inner anchor is fine).
- [ ] Coach and academy copy is honest: the feature is "Soon", buttons that do nothing yet are disabled and marked Soon, like the
      existing ones. Keep today's pending tags (for example "no schema yet").
- [ ] Reuse the live numbers the old bands used (events, cities, states, sports, disciplines, upcoming) from the same props.
- [ ] The owner's machine has prefers-reduced-motion ON and the owner wants to SEE the animation: do not gate the main motion
      on it (follow how HeroDoors and HeroStats document this in their comments), but keep it slow and small.
- [ ] Works at 375 px and in dark mode. `npx tsc --noEmit` and `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | exit 0, no output (commit 8618517) |
| eslint src | pass | 0 errors, 6 pre-existing warnings |
| Server/client boundary self-check | pass | page.tsx only renders <PartnersSection/> with plain props; no function exported from a use-client file is called on the server; formatCount is from a non-client lib |
| Loaded in a browser | not run | agents cannot; the coordinator does after the merge |

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
