---
id: GA-026
type: task
status: ready
priority: P2
owner: discovery-ui
branch: codex/ga-026-alerts-form
worktree: D:\project\goathletix-wt\fe-ga-026-alerts-form
scope: [goathletix-frontend/src/components/home/AlertsForm.tsx, new AlertsForm.css]
acceptance: []
depends_on: []
related: [GA-020]
---

# GA-026 Race-day alerts: one button first, then email or phone, then Send

## Goal

Owner spec for the "Never miss race day" signup. Initially show **only** a "Get alerts" button. When it is clicked the button
disappears and two options appear: **Email** or **Phone number**. Choosing one shows that single input and a **Send** button
(the "Get alerts" button is gone). There is no provider or table yet, so submitting must still say plainly that nothing was saved.

## Scope and ownership

- Owned: `src/components/home/AlertsForm.tsx`; new `src/components/home/AlertsForm.css`.
- Out of scope: `Sections.tsx` (AlertsSection stays as is), `globals.css`, any API or backend call, the WhatsApp link.
- Coordination: batch 2 runs three frontend tasks at once. **Nobody edits `globals.css`.** Put styles in your own new `.css`
  file imported by the component; `globals.css` loads first, so equal-specificity rules in your file win.

## Acceptance criteria

- [ ] Step 0: only a "Get alerts" button (keep the existing `btn cta` look). Step 1 (after the click): the button is removed and an
      Email | Phone segmented choice appears. Step 2 (after choosing): one input, either email or an Indian mobile number with a
      +91 prefix (10 digits, starting 6 to 9), with a clear label and a "Send" button; a small "Back" lets the user change the choice.
- [ ] Plain validation messages; Send is disabled or errors until valid; `autoComplete` and `inputMode` set (email / tel).
- [ ] Submitting shows the existing honest note ("Alerts are not live yet - nothing was saved") and makes no network call.
- [ ] Focus moves to the new control on each step; fully keyboard operable; `aria-live` for the note. Transitions are short and
      visible (the owner has reduced-motion ON and still wants to see motion, so do not gate them on it).
- [ ] The section height does not jump more than needed; works at 375 px and in dark mode. `npx tsc --noEmit` and `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass, no output | run in worktree |
| eslint src | 0 errors, 6 warnings (pre-existing files) | run in worktree |
| Server/client boundary self-check | pass | AlertsForm keeps "use client"; CSS imported by the client component; Sections.tsx untouched |
| Loaded in a browser | not run | agents cannot; the coordinator does after the merge |

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
