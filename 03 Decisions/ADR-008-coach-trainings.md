---
id: ADR-008
type: decision
status: proposed
date: 2026-10-12
owners: [product owner]
related: ["docs/05-feature-inventory.md", "01 Product/Organizer and seller platform features.md", "01 Product/Main page design spec.md", "03 Decisions/ADR-007-discovery-plus-ticketing.md"]
tags: [adr, product, schema, trainings, coaches]
---

# ADR-008 Coaches and academies host trainings; how trainings are modelled and phased

**Status: proposed.** The product owner decided on 2026-10-12 that coaches must be able to host their own
trainings on GoAthletix (requirement #61). *How* to model and phase it is not decided yet; this record is the
recommendation, for the owner to confirm or change.

## Context

- Until now the platform had two supply-side roles: **organisers** (events, ADR-007) and **sellers** (gear).
  Coaches and academies had only a read-only directory, `training_centers` (migration 0010), with no way to list
  what they teach, when, or for how much, and nothing an athlete can book.
- `docs/04-product-principles.md` says "never build training plans or coaching". Hosting a coach's own
  training is a marketplace, not coaching built by us, so that rule narrows rather than breaks (the doc is
  updated). The rule's reason still holds: we do not author plans or employ coaches.
- A training is not an event. It recurs (a Tuesday/Thursday batch), enrolment can be rolling, capacity is per
  batch, fees are per month or per programme, and a student can pause. `events` has one date range, one
  capacity, and 10,100 rows that drive the "10,100 events" headline and every count on the homepage.
- The payment provider is still undecided (ADR-007 follow-up), so anything that takes money cannot ship yet.

## Decision (recommended)

1. **Trainings are their own listing type**, not rows in `events`: `trainings` (the offering) with
   `training_batches` (schedule, capacity, venue per batch) and `training_enrolments` (who is in). They
   **reuse** the existing building blocks: the `training_centers` directory and its `owner_id` claim path,
   the two-axis sport taxonomy and `age_category` (ADR-006), the visibility enum (public / unlisted / private),
   `entity_follows` (already has a `training_center` target), and the orders / payments / refunds / payouts
   layer (0021, 0022) for money.
2. **Two phases.**
   - **Phase 1, "find a coach", no payments:** coach and academy profiles, training listings, a staff
     verification and review queue, and an enquiry action (call, WhatsApp, form) that records a lead for the
     coach. Needs no payment provider, so the header **Training** link can go live before one is chosen.
   - **Phase 2, "book and pay":** enrolment through the ticketing and payments layer. **Fixed-term packs
     first** (a month, 8 sessions, a programme); auto-renewing monthly subscriptions later.
   - Phase 3: attendance, progress, and "Train for this event" matching programmes to a race date.
3. **Verification before visibility:** a coach or academy is staff-verified before their first listing is
   public; listings re-enter review when price, schedule, venue, age group or safety fields change (same rule
   as seller products, ADR-007). Coaches who work with under-18s need a child-safeguarding declaration on file;
   the evidence required is a legal decision (see open questions in the product doc).

## Alternatives considered

- **Trainings as events (`event_kind = 'training'`).** Reuses the create-event wizard, tickets and capacity, and
  needs no new tables. Not selected: it would pollute event search and every count, the single date range does
  not fit recurring batches, and capacity is per event rather than per batch.
- **Directory only, no hosting (what exists today).** Zero new work, but it is not what the owner asked for:
  coaches could not publish anything or be booked.
- **Booking and payment from day one.** The fuller product, but blocked on the payment provider, GST treatment
  and recurring-billing decisions; it would delay the Training link by months. Phasing keeps Phase 1 shippable.

## Consequences

- **Positive:** coaches and academies get a reason to be on the platform every week, not just on race day;
  parents of young athletes find a coach before they find a race; "Train for this event" ties the two halves of
  the product together; event counts stay honest.
- **Cost / risk:**
  - New schema (trainings, batches, enrolments, coach credentials, training reviews) and its RLS; every public
    list query must filter by visibility and approval, as with private events (the backend uses the service role).
  - Child safety is a real obligation, not a copy line: it needs legal input before under-18 listings go live.
  - GST on coaching fees, marketplace TCS/TDS and a coach agreement need a CA and counsel (same open item as
    ticketing).
  - Moderation load grows: a third review queue beside seller products and organiser submissions.
- **Follow-up tasks:** owner to confirm this record or amend it; write migration 0026 (trainings, batches,
  enrolments, coach credentials) with RLS and the backend visibility filter; build the coach console and the
  Training page; choose the evidence required for coaches working with minors; add `Training` destinations to
  the header, Partner menu and homepage once Phase 1 pages exist (they are inert "Soon" entries today).
