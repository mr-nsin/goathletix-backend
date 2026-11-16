# GA-066 handoff: sign-up and sign-in (mobile code, email + password, Google)

Branches `codex/ga-066-auth-signup-signin` in both repos, fast-forwarded into `feat/implement-main-page-mockup` locally.
Backend `060eed3` (realtime-auth subagent, Sonnet); frontend `f46cb0c`, `543e941` and a phone-sheet fix. **Not pushed** until asked.

Changed:
- Backend `src/auth/`: `SupabaseAuthGuard` (Bearer token, `auth.getUser`), `@CurrentUser()`, `GET /me`, `AuthModule`; registered in `app.module.ts`.
  Existing routes stay public; the guard is opt-in.
- Frontend `src/lib/auth/` (validation, enumeration-safe error mapping), `src/components/auth/` (AuthProvider, AuthDialog, AuthFlow,
  OtpInput, PasswordField, AuthMenu, AuthPage, CallbackClient, ResetClient, auth.css), routes `/signin`, `/signup`, `/auth/callback`,
  `/auth/reset`, `layout.tsx` (provider), `Header.tsx` (sign-in button, avatar menu, drawer entry), `supabaseClient.ts` (PKCE, `authConfigured`).

Flow: Mobile (+91, code) is both sign-in and sign-up; Email tab signs in, links to create account, forgot password; Google below.
New phone users get a "What should we call you?" step. Success screen, then back to the page they came from (`next`, same-origin only).
Errors never reveal whether an account exists.

| Check | Result |
| --- | --- |
| Backend tsc, eslint, jest (48/48), live /me 401 | pass |
| Frontend tsc, eslint | pass |
| Headless Edge desktop and dark: open, errors, tabs, sign-up, meter, Esc | pass |
| Any real sign-in against Supabase | **not run** (no project keys in the frontend, providers not configured) |

Risks: phone OTP needs an SMS provider and India DLT registration (days to weeks); the guard makes one Supabase call per request
(fine for `/me`, move to JWKS verification before hot routes use it); the browser session lives in local storage, not cookies,
so server components cannot see it; the profile name is written best-effort under RLS; the home page overflows to 401 px at
phone width (existing, separate fix).

## Update 2026-11-15 (second pass, frontend working tree, not committed)
- Sign-in now uses **shadcn** (`src/components/ui/`): Dialog (focus trap, Escape, scroll lock, return focus), Tabs (Base UI, its indicator is
  the sliding pill), Input OTP (`input-otp`), Label, Input, Button, Separator. Added: dialog, tabs, input-otp, label, separator; button.tsx regenerated.
  The shadcn tool pointed new files at a stray `cn` package; imports were changed back to `@/lib/utils` and the package removed (only `input-otp` was added).
- Popup is 1000 px wide and a fixed 700 px high from 860 px up; switching tabs or steps never changes its size. Phones keep the bottom sheet.
- Brand panel lightened (bright indigo with teal glow), runner-lights moved to GPU-rotated layers, dotted arc made static, staggered entrance, shadow that breathes with the athlete.
- Pill: ease-in-out, 0.55 s. Verified in headless Edge: card 1000x700 before and after, pill 706 to 947 along an S-curve, focus trap and Escape work.
- Not run: real sign-in (still needs the Supabase setup), reduced-motion check of the new panel, popup exit animation (it unmounts at once).
