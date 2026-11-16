---
id: GA-066
type: task
status: ready-for-review
priority: P0
owner: realtime-auth (backend) + discovery-ui (frontend)
branch: codex/ga-066-auth-signup-signin
scope:
  - goathletix-backend/src/auth/** (new: Supabase token guard, @CurrentUser, GET /me) + app.module.ts registration
  - goathletix-frontend/src/lib/auth/** (new: Supabase client config, AuthProvider, helpers, validation)
  - goathletix-frontend/src/components/auth/** (new: AuthDialog, flow steps, OTP input, password field, social button, auth.css)
  - goathletix-frontend/src/app/signin, signup, auth/callback, auth/reset (new routes)
  - goathletix-frontend/src/components/layout/Header.tsx (Sign in button opens the dialog; signed-in avatar menu)
acceptance: []
depends_on: []
---

# GA-066 Sign-up and sign-in: mobile OTP, email + password, Google (Supabase Auth)

## Owner request (2026-11-15)
"Create a system with signup/sign in using mobile, email + password, and social logins like Google (from Supabase).
Go through the complete styling and animations of the website and deep-research sign-in and sign-up flows, and create
the best sign-in and sign-up flow."

## Settled facts (do not re-investigate)
- No auth exists in the live trees. The Header "Sign in" buttons are `disabled` with title "Accounts are coming soon"
  (`Header.tsx`, three places). Checkout is guest-only.
- `profiles` (id = `auth.users.id`) is **created by the DB trigger `on_auth_user_created`** (`handle_new_user`, migration
  0001) with `full_name` taken from `raw_user_meta_data->>'full_name'`. `profile_private` holds phone and consent.
  **No migration is needed for the basic flow.**
- Frontend has `@supabase/supabase-js` only (no `@supabase/ssr`); `src/lib/supabaseClient.ts` uses the **anon** key and
  has placeholder fallbacks. `.env.local` currently defines only `NEXT_PUBLIC_API_URL`: the owner must add
  `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Never read or echo `goathletix-backend/.env`.
- The backend authenticates with the service-role key and bypasses RLS: every write endpoint must check the caller
  itself. Never add a default for a credential (the stale `jwt.strategy.ts` `super-secret-fallback` is the anti-pattern).
- Supabase dashboard work only the owner can do: enable Email (confirm email on), Phone (an SMS provider), Google
  (client id and secret); add Site URL and redirect URLs (`http://localhost:3001/auth/callback`). India SMS needs DLT
  registration of sender and templates. Until then phone OTP shows a friendly "not available yet" state.
- Design tokens (`globals.css`): `--bg #F5F6F9`, `--surface`, `--ink #141A3E`, `--muted`, `--line`, `--accent #12B4A0`,
  `--accent-ink #0B2027`, `--grad`, `--danger`, `--ok`, `--shadow(-lg)`; dark mode via the same tokens. Buttons use
  `.btn`/`.btn.grad`. Motion: framer-motion with `MotionConfig reducedMotion="user"`. Style: double quotes in the
  frontend, Prettier single quotes in the backend. Checkout uses plain CSS with a prefix (`co-`); auth uses `au-`.
- Next 16 / React 19: read `node_modules/next/dist/docs/` before writing App Router code. Params are Promises.
  ESLint forbids setState-in-effect and reassigning in render.

## Scope
1. **Backend:** `AuthModule` with a guard that reads `Authorization: Bearer <access token>`, verifies it with Supabase
   (`auth.getUser(token)` through the existing `SupabaseService`), attaches `{ id, email, phone }` to the request,
   throws `UnauthorizedException` otherwise; a `@CurrentUser()` decorator; `GET /me` returning the profile row
   (id, full_name, avatar_url, onboarding_completed) plus email and phone. Existing public routes stay public (opt-in guard).
   Spec file for the guard.
2. **Frontend auth core:** one `AuthProvider` (session, user, `loading`, `configured`), `useAuth()`, helpers for
   `signInWithOtp` (phone), `verifyOtp`, `signInWithPassword`, `signUp`, `signInWithOAuth('google')`, `resetPasswordForEmail`,
   `updateUser({ password })`, `signOut`. PKCE flow. Validation (Indian mobile, email, password rules) in one module.
3. **Frontend UI:** one flow component used by a dialog (header) and by `/signin` and `/signup` pages (deep links, `?next=`).
   Steps: choose method (Mobile / Email tabs + Google) → mobile: number → OTP → (new user) finish profile; email: sign in ↔
   create account, forgot password, check-your-email. `/auth/callback` completes OAuth and email links; `/auth/reset` sets a new password.
4. **Header:** Sign in opens the dialog; signed in shows an avatar menu with name, "My profile" (inert "soon"), Sign out.
5. **Docs:** vault note for the flow, handoff, activeContext.

## Acceptance criteria
1. A visitor can open the dialog from the header, switch Mobile / Email, and see Google; Escape and the close button close it; focus is trapped and returns to the Sign in button.
2. Mobile: a 10-digit number enables "Send code"; the code screen has six boxes with `autocomplete="one-time-code"`, paste fills all six, auto-submit on the sixth digit, a 30 s resend timer, "Change number", and clear errors for wrong or expired codes and rate limits.
3. Email: sign in with email + password; create account (name, email, password with strength hint and show/hide) leads to a "Check your email" screen; "Forgot password" sends a reset link and `/auth/reset` accepts a new password.
4. Google button starts OAuth and returns to the page the user came from (`next`, same-origin paths only).
5. Error messages never reveal whether an email or number has an account.
6. Not configured (env missing): the dialog still opens and shows one calm line, nothing throws, and the header does not break.
7. Works at 375 px, in light and dark, with reduced motion, and by keyboard only; fields have labels and `autocomplete` values.
8. Backend: `GET /me` returns 401 without a valid token and 200 with one; jest + lint pass; no credential defaults.
9. `tsc` and `eslint` pass in both repos.

## Out of scope
Account or profile pages, linking several sign-in methods to one account, two-step verification for organisers and staff,
WhatsApp OTP, organiser/seller roles, saved events. Guest checkout stays as it is.

## Research that shaped it (deep-research run, 2026-11-15; Supabase, web.dev and Chrome docs only)
- OTP entry is **one real input drawn as six boxes**, not six inputs: separate boxes break SMS autofill, paste and screen
  readers. `autocomplete="one-time-code"` plus WebOTP on Android Chrome (needs an SMS ending `@host #code`).
- Supabase phone OTP: 6 digits, one request per 60 s per number, 1 h expiry, project SMS cap 30/h by default. Resend timer is 60 s.
- India SMS needs TRAI DLT registration (sender, templates); Supabase gives no steps. Textlocal, Twilio, MessageBird, Vonage are the listed providers.
- Next 16 with cookie sessions would use `@supabase/ssr` and a `proxy.ts` (not built: sessions are client-side, the NestJS backend reads a Bearer token).
- NestJS: local verification against the project JWKS with `jose` needs asymmetric signing keys; `getUser(token)` (what the guard does) detects revoked sessions but costs a round trip.
- Auto-linking of identities that share a verified email is on by default; manual linking is beta. Phone-to-email linking behaviour was not established.
- Not covered by the research (design judgement used instead): Indian consumer app step copy and animation, password rules, WCAG details, enumeration-safe copy, brute-force protection.

## Owner setup (Supabase dashboard; nothing here can be done from code)
1. `.env.local` in `goathletix-frontend`: add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the anon key only).
2. Authentication > URL configuration: Site URL `http://localhost:3001`; Redirect URLs `http://localhost:3001/auth/callback` and `http://localhost:3001/auth/reset` (add the production host later).
3. Providers: Email (keep "Confirm email" on, set password minimum 8), Google (client id and secret from Google Cloud), Phone (SMS provider plus DLT registration).
4. Optional: SMS template ending in `@<host> #{{ .Code }}` to enable Android WebOTP.

## Verification
| Check | Result |
| --- | --- |
| Backend `npx tsc`, `eslint src/auth`, `jest src/auth` (guard 5 tests, /me 3 tests) | pass |
| Backend full `npx jest` | pass, 48/48 |
| Live `GET /me` with no token and with a bad token | 401 `Missing or invalid authentication token` |
| Live `GET /me` with a real token | **not run** (no Supabase project keys in the frontend, no real session) |
| Frontend `npx tsc --noEmit`, eslint on auth, header, layout | pass |
| Headless Edge, desktop 1280: open from header, focus lands on the number field, invalid number error, not-configured notice, Email tab, create account, strength meter (weak to very strong), Esc closes | pass |
| Phone width and dark mode | dark mode pass; phone sheet checked on /signin (343 px card, no overflow). The home page itself overflows to 401 px at a 375 px phone width (header menu button at 400 px), so the dialog could not be judged there |
| Mobile code, Google, email sign-up, password reset against a real Supabase project | **not run** (needs the owner setup above) |
| Keyboard focus trap, return focus, reduced motion | focus trap and Esc coded and Esc checked; return focus and reduced motion not checked |
