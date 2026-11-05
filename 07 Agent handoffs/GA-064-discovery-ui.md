# GA-064 handoff: checkout flow (frontend, preview payment)

Branch `codex/ga-064-checkout-flow` (worktree `D:\project\goathletix-wt\fe-ga-064-checkout-flow`), fast-forwarded into
`feat/implement-main-page-mockup`. Commits `94f6f0c`, `80a57eb`.

Changed (goathletix-frontend):
- New route `src/app/events/[id]/checkout/page.tsx` (server: builds a slim `CheckoutEvent`, 404 unless platform ticketing
  and registration open).
- New `src/lib/checkout.ts` (totals, age-on-date, validation, `orderDraft()` in `orders`/`tickets` column names, `.ics`),
  `src/lib/loadEventDetail.ts` (loader shared with the event page).
- New `src/components/checkout/` — `Checkout.tsx` (client-only flow, sessionStorage draft, rail, sticky summary, action
  bar), `StepTickets`, `StepParticipants`, `StepPay`, `Confirmation`, `fields.tsx`, `checkout.css`.
- `src/app/events/[id]/page.tsx` uses the shared loader; `TicketPicker` (now takes `eventId`) and `MobileTicketBar` link
  to checkout; `EventTickets` passes the id.

| Check | Result |
| --- | --- |
| `npx tsc --noEmit -p .` | pass, no output |
| `npx eslint src/components/checkout src/lib src/components/event src/app/events` | pass, no output |
| Headless Edge 1440x900, Tata sample `?t=s-hm&q=2` | step 1 → empty Continue shows 16 errors → filled → Review and pay → missing-consent state → processing → "You're in!" with booking `GA-261105-…` and 2 stubs |
| Headless Edge 390x844, same script | same path completes; no horizontal scroll inside the flow |
| Browser pane: event page Add, +1, Checkout | lands on `/checkout?t=s-hm&q=2` with quantity 2 |
| `/events/sample-nope/checkout` | 404 |
| Dark mode, tablet, screen reader pass | not run |

Bug found and fixed in verification: the booking-contact seat was failing on a hidden name field.

Risks / follow-ups:
- **Payment is a preview.** No provider (ADR-007 open) and no accounts (`orders.user_id` NOT NULL → profiles), so nothing
  is posted. `sessionStorage['ga-order:<id>:draft']` holds the body the backend checkout should accept.
- Promo field honestly rejects every code. No seat holds (`tickets.reserved_until` unused). No QR (needs a dependency).
- The site header's burger button overflows at 339px (pre-existing, not checkout).
