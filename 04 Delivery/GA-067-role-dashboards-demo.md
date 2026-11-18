# GA-067: role onboarding and dashboards (organiser, seller, coach/academy) with demo sign-in

Status: ready-for-review (local commit 39ab341 on codex/ga-067-role-dashboards, ff-merged into the frontend working branch, not pushed). Repo: frontend only. Branch `codex/ga-067-role-dashboards`.
Decision basis: deep research 2026-11-16 (see `01 Product/Explore, community and analytics.md` for neighbouring scope).

## Decision (superseded 2026-11-18 by ADR-010: each role has its own account)
> Update: the product owner decided each role has its own account. The text below is what was built; the role switcher and the
> `/account` "Become a..." cards need rework. See `03 Decisions/ADR-010-separate-accounts-per-role.md`.

One account per person (one sign-in for all). Roles are additive and added **after** sign-up through "Become a..." flows, not at sign-up
and not via separate login buttons. Portals are same-domain routes `/organiser`, `/seller`, `/coach` (not subdomains). Approval/KYC gates
what a role can do (publish, list, payouts), not whether it can be applied for. A header role switcher shows only roles the person holds.

## Scope
1. **Demo account layer** (no backend, no Supabase): `src/lib/demo/` store in localStorage `ga.demo.v1`:
   `{ user: {id,name,email,phone}, roles: { organiser?, seller?, coach? : { status: 'draft'|'pending'|'needs_info'|'active', profile:{...}, submittedAt } } }`.
   A "Demo sign in" path (a visible button in the sign-in dialog, shown only when Supabase auth is not configured OR always labelled "Demo")
   creates a demo user instantly. When real auth is configured the real session wins; demo is a clearly labelled fallback. No credentials stored.
   Demo "admin approve" control on each pending role page (labelled DEMO) flips pending -> active so dashboards can be explored.
2. **Entry points**: header "Partner with us" menu and footer links go to `/become/organiser`, `/become/seller`, `/become/coach`
   (coach page covers both individual coach and academy via a first question). Each is a multi-step form wizard with progress, save-draft,
   validation, review step, submit -> status `pending`.
3. **Information collected per role** (dummy validation only; PAN/GST/bank are format-checked, never sent anywhere):
   - Organiser: organisation type (individual/club/company/trust), name, contact person, phone, email, city/state, sports organised, past events
     count, website/social, PAN, GST (optional), bank (account name, number masked, IFSC), event types, expected events/year, terms accept.
   - Seller: shop name, category (sports gear etc), product count, brand authorisation, GSTIN, PAN, pickup address, return policy,
     bank details, shipping method, support contact.
   - Coach: type (individual coach | academy/centre), name, sports + levels, experience years, certifications (name, issuer, year), age groups,
     bio, city/areas, session formats (group/1:1/online), fee range, batches/timings, facilities (academy), staff count (academy), ID proof,
     bank details, terms accept.
4. **Dashboards** under `/organiser`, `/seller`, `/coach`, each with a shared shell (sidebar, top bar with role switcher, status banner when
   not active, responsive down to 375 px) and pages with realistic dummy data, empty states, and locked states when status != active:
   - Organiser: Overview (KPIs, sales chart), Events (list, status, create-event wizard stub), Registrations/attendees table, Payouts, Settings/KYC status.
   - Seller: Overview, Products (list + add-product form), Orders, Payouts, Settings/KYC.
   - Coach/Academy: Overview, Trainings/Batches (list + add), Students/enquiries, Profile (public profile preview), Payouts, Settings/KYC;
     academies also get Staff.
   - Plus a user-side `/account` page: profile, roles held with status, "Become a..." cards for roles not yet held.
5. Role switcher component in header (visible only when the person holds >=1 non-user role) and in dashboard shell.

## Out of scope
Real Supabase roles, `user_roles` migration, backend endpoints, real KYC/payment provider, file upload storage, the Explore tab,
admin dashboard. No schema or backend changes. Do not touch `src/app/page.tsx`, `globals.css` (add a new css file instead), package.json
(use existing deps: framer-motion, lucide-react, shadcn components already in `src/components/ui`; adding a shadcn component via CLI is
allowed if needed but fix the `cn` import to `@/lib/utils` and do not add the npm package `cn`).

## Acceptance
- Demo sign in -> Become organiser wizard -> submit -> pending -> demo-approve -> organiser dashboard opens, all four categories walkable.
- Routes guard: /organiser etc. redirect (client side) to `/become/<role>` or sign-in when role absent; no flash of content.
- Visual: brand green gradient (`--grad`), shadcn `Input`/`Button`/`Label`/`Tabs`; works at 375 px; keyboard accessible.
- `npx tsc --noEmit` and eslint clean. Not verified against real Supabase (state it).

## Verification
| Check | Result |
| --- | --- |
| tsc, eslint | pass (0 errors) |
| Headless Edge: guard redirect, demo sign-in, become wizard opens, 21 dashboard/account routes load, no console errors, no horizontal overflow at 1440 | pass |
| 375 px layout, completing a wizard end to end, real Supabase | not run |
