---
id: GA-064
type: task
status: ready-for-review
priority: P1
owner: discovery-ui
branch: codex/ga-064-checkout-flow
scope:
  - goathletix-frontend/src/app/events/[id]/checkout/** (new route)
  - goathletix-frontend/src/app/events/[id]/page.tsx (share the detail loader)
  - goathletix-frontend/src/lib/loadEventDetail.ts (new)
  - goathletix-frontend/src/lib/checkout.ts (new: cart maths, validation, order draft)
  - goathletix-frontend/src/components/checkout/** (new)
  - goathletix-frontend/src/components/event/TicketPicker.tsx, MobileTicketBar.tsx (link to checkout)
acceptance: []
depends_on: [GA-063]
---

# GA-064 Checkout flow (frontend, demo payment)

## Owner request (2026-11-05)
"Check and implement best UI/UX for checkout and implement the complete flow... design the best experience for checkout,
use the best animations and icons." Use worktrees.

## Settled facts that bound the scope
- ADR-007: the platform sells tickets, but the **payment provider and fee model are not chosen** (Razorpay Route is the
  leading option). No provider keys exist.
- Migrations 0021/0022 are applied: `orders`, `payments`, `tickets` exist, but `orders.user_id` and `tickets.buyer_id`
  are `NOT NULL REFERENCES profiles`, and there are **no user accounts** yet (reviews posting is disabled for the same
  reason). So no real order can be written today.
- The showcase events with `ticketing_mode = platform` are sample data (`/events/sample-*`).

## Decision
Build the complete **front-end** flow now, end to end, with a **demo payment step that moves no money and stores nothing
on the server**. Field names follow the `tickets` / `orders` columns (attendee_name, attendee_email, attendee_phone,
attendee_gender, attendee_birth_year, form_answers, fee_inr, total_inr) so the backend task only has to post the draft.
Every screen that would be real later says plainly that this is a preview.

## Scope
1. Route `/events/<id>/checkout?t=<ticketId>&q=<qty>` (server page reuses the event loader; 404 for external ticketing,
   closed or unknown events).
2. Steps with an animated progress rail: **Tickets** (review, change quantity, add another category, promo code field)
   → **Participants** (one card per ticket, age checked against the category's limits and age-as-on date, "copy my
   details" for the first one, buyer contact) → **Review & pay** (waiver/terms consent, payment method picker UPI / card /
   netbanking, demo pay with processing state) → **Confirmation** (animated tick, order number in the `orders` format,
   ticket stubs, add-to-calendar .ics, back to event).
3. Sticky order summary (desktop right column, phone collapsible bar) with animated total.
4. Event page: the selection bar and bottom bar link to checkout instead of "Checkout coming soon".
5. Draft kept in sessionStorage per event, so a reload or Back does not lose typed details.

## Out of scope
Backend orders API, payment provider, accounts/sign-in, seat holds, coupons that actually discount (field validates and
says no codes are live), QR codes (needs a dependency), emails.

## Verification
| Check | Result |
| --- | --- |
| tsc / eslint | pass |
| Headless Edge full flow, Tata sample, 1440 and 390 | pass (see handoff) |
| Event page Add → Checkout hand-off | pass |
| Dark mode, tablet | not run |
