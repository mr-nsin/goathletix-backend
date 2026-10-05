---
id: ADR-007
type: decision
status: accepted
date: 2026-10-05
owners: [product owner]
related: ["01 Product/Main page design spec.md", "04 Delivery/GA-020-homepage-build-from-mockup.md", "memory-bank/productContext.md"]
tags: [adr, product, payments, marketplace]
---

# ADR-007 Discovery + ticketing platform; moderated seller marketplace; public/private events

## Context

The design spec's Neutrality pillar (§1) said GoAthletix "links to the organiser and never owns the
transaction". `memory-bank/productContext.md` (2026-10-05) instead described a three-sided marketplace with
in-site ticketing, checkout and payouts. The schema could not be finalised while the two disagreed: migrations
0014 / 0020 / 0021 differ depending on whether money moves through the platform.

## Decision

The product owner decided on 2026-10-05:

1. **Discovery + ticketing, ticketing first.** Organisers sell entries on GoAthletix (ticket tiers, waves,
   registration forms, promo codes, QR check-in, payouts). Events without platform ticketing are still listed
   and link out (`events.ticketing_mode = 'external'`). The 10,100 existing events are **test data**.
2. **Organisers choose event visibility:** `public` (discoverable), `unlisted` (share link only) or `private`
   (invitees, ticket holders and staff only).
3. **Sellers list products that are reviewed before sale.** A seller adds an item → it goes to review →
   GoAthletix approves it → only then is it visible and buyable. Edits to what a shopper sees send it back to
   review.

## Alternatives considered

- **Discovery only, link out for every event (the previous spec).** Fastest to launch and no payment,
  refund or tax obligations, but it gives up the revenue line the owner wants and the organiser tooling
  (forms, check-in, payouts) that makes organisers stay.
- **Ticketing only, drop discovery of external events.** Simpler model, but the catalogue would start
  empty; discovery is what brings athletes before organisers have moved their ticketing over.
- **Unmoderated seller listings.** Faster for sellers, but counterfeit or off-topic products would appear
  under GoAthletix's name; the platform takes on the seller's reputation risk.

## Consequences

- **Positive:** one checkout for entries and gear (`orders`, `payments`); organiser and seller payouts are
  first-class; private events unlock club, corporate and school events.
- **Cost / risk:**
  - The platform now handles money: a payment provider with split settlements is required (Razorpay Route is the
    usual Indian choice; Stripe Connect is limited for India-registered platforms), plus refund, cancellation and
    chargeback handling, GST registration, and marketplace tax obligations (GST TCS, income-tax TDS u/s 194-O —
    confirm current rates with a CA), and a seller / organiser agreement.
  - Spec §1's Neutrality pillar is replaced (see spec §13). All "we never take a cut / never handle your entry
    fee" copy has been removed from the frontend.
  - Private events must be filtered in **every backend query** (the backend uses the service role and bypasses
    RLS). Shipping the backend filter together with migration 0022 is mandatory.
- **Follow-up tasks:** choose the payment provider and fee model; write the backend checkout, ticketing,
  moderation-queue and payout services (GA-020 Phase 5+); legal pages (Terms, Privacy, refund policy,
  seller and organiser agreements); replace the seeded test events with real ones before launch.
