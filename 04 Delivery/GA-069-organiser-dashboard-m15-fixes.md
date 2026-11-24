---
type: delivery
status: ready-for-review
date: 2026-11-24
related: ["05 Research/reports/Organiser dashboard improvements.md", "04 Delivery/GA-067-role-dashboards-demo.md", "03 Decisions/ADR-010-separate-accounts-per-role.md"]
tags: [delivery, organiser, dashboard, frontend]
---

# GA-069: organiser dashboard, M15 fixes to the existing screens

Frontend only, not committed. First step of the organiser dashboard roadmap (item M15).

## Done

| Item | Change |
| --- | --- |
| Invented numbers | Removed the fixed +18%, +9%, -2% deltas and the 87% check-in rate (now "Not live"). Donut is built from the sample registrations so its total matches the list. |
| Sample labels | "Sample data" tag on Overview, Events, Registrations, shared Payouts; "Demo verification" on Settings and KYC. |
| Organiser payouts | New `OrganiserPayouts`: KYC status, masked payout account, honest "No payouts yet". Seller and coach keep the shared page, with the mislabelled KPIs fixed. |
| Phone tables | Bib, Registered and Period are no longer hidden in the stacked card layout. |
| Charts | Line chart: text summary as accessible name, peak value, "View as table", axis text outside the stretched SVG. Donut: segment values in the accessible name. |
| Accessibility | Static page title per organiser route, skip link, h1 on locked pages, up/down read by screen readers, 44 px targets on the phone tab bar, `empty` state on Registrations. |

## Not done (still in the M15 list)

Clickable rows and an event workspace (M2), real create-event form (M3), filter state in the URL, splitting Settings and KYC from the shared page, not persisting PAN and bank in localStorage, consistent lock reasons.

## Verification

| Check | Result |
| --- | --- |
| eslint on `components/portal` and `app/organiser` | pass |
| `tsc --noEmit` | pass |
| Headless Edge: Overview and Payouts at 1440, Registrations at 375 | checked by screenshot; KPI note colour fixed after the first look and re-checked only for Registrations |
| Screen reader behaviour, real data | not run |

## Addendum 2026-11-24: redesign slice

- Organiser pages run on their own chrome (`DashHeader`); runner header, announcement bar and footer are hidden via `SiteChrome` STANDALONE. `/become/organiser` is its own route.
- Home now leads with "Needs your attention" and a "Next event" card. Sidebar has a Create event button.
- New `/organiser/events/[id]` workspace with Overview, Registrations, Tickets (read-only), Check-in and Settings (placeholders).
- New create-event form (draft or publish, multi-day dates, ticket categories). Saves to the demo store only; no backend API yet.
- Verification: eslint and `tsc --noEmit` clean; form create flow exercised in headless Edge at 1440px. Not run: phone width, e2e tests.
- Not done: event editing, ticket editor, form builder, check-in, exports, seller and academy dashboards.
