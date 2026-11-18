---
id: ADR-010
type: decision
status: accepted
date: 2026-11-18
owners: [product owner]
related: ["05 Research/reports/Role dashboards and onboarding.md", "05 Research/reports/Organiser landing page design.md", "04 Delivery/GA-067-role-dashboards-demo.md", "03 Decisions/ADR-007-discovery-plus-ticketing.md", "03 Decisions/ADR-008-coach-trainings.md"]
tags: [adr, product, auth, accounts, roles]
---

# ADR-010 Each role has its own account

**Status: accepted.** The product owner decided on 2026-11-18 that participants, organisers, sellers and coaches or academies
each have their **own account**, with their own sign-in, profile, onboarding and dashboard. This replaces the earlier
"one account per person, roles added later" decision in GA-067 and the one-login recommendation in the first research report.

## Context

- GA-067 (2026-11-16) built the demo layer around one account that gains roles through "Become a..." flows, with a role switcher.
- The first research report ("Role dashboards and onboarding") recommended one login with role profiles. It also found that the
  evidence for that model was precedent from Airbnb and Upwork, not from IndiaRunning or BookMyShow, which both put organisers
  behind a separate front door (IndiaRunning's `organiser.indiarunning.com` is a separate portal with its own email-and-code sign-in).
- An organiser does not take part in events or sell as an organiser, and an organiser account needs organisation details,
  KYC and payouts that a participant account never needs. Keeping them apart keeps each dashboard, consent record and
  support conversation clean.

## Decision

- Four kinds of account: **participant**, **organiser**, **seller**, **coach or academy**. Each has its own sign-in screen and
  its own onboarding.
  - Participant: `/signin`, `/signup` (unchanged).
  - Organiser: `/organisers/sign-in` (one email-first screen for sign-in and sign-up), then the organiser details and KYC wizard.
  - Seller and coach or academy: same pattern, built later.
- The organiser site (`/organisers`) is a standalone site: no participant header or footer, its own organiser header and footer.
- A person who does more than one thing signs up for each account separately. There is no role switcher between accounts.
- Money-earning KYC and payout details (the payee entity from the research report) attach to **each account**, not to a person.
- Junior participants (DPDP, under 18) remain dependent profiles under a guardian's **participant** account only.
- Guest checkout is unchanged: a booking needs no account (orders and participants are stored by event, see
  `02 Architecture/Registrations data model.md`).

## Alternatives considered

- **One login with role profiles** (the earlier decision): fewer duplicate people, one place for notifications. Not chosen
  because the owner wants clean separation of dashboards, onboarding and compliance per role.
- **Separate Supabase projects per role:** hard isolation, but duplicates configuration, billing and tooling. Not chosen.

## Consequences

- **Open decision, needs the owner: can one email address hold more than one account?** Supabase Auth keeps one user per email, so
  two accounts for one person need either a different email per role (simplest, and what the organiser FAQ now implies), or a
  different design (for example email aliases such as `name+organiser@`, or one auth user with separate account records, which is
  the old model behind a different door). Until this is decided, organiser sign-up stores `account_type: organiser` in the user's
  metadata and the demo store marks the user's `accountType`.
- **Rework needed in the demo layer (GA-067):** the header role switcher, the `/account` page's "Become a..." cards, and the
  one-store `user + roles` shape assume one account. The organiser flow already writes `accountType`; the switcher and cards
  should go once seller and coach get their own sign-in. Copy that said "one account for everything" was changed on
  2026-11-18 (become-role sign-in prompt, partner menu note, account page, organiser FAQ).
- **Support and reporting:** a person with two accounts shows up twice. Any "people" count must be per account type.
- **Notifications and consent** are per account.
- Follow-up tasks: decide the email rule; build seller and coach sign-in; rework the switcher and `/account`; put the
  `account_type` on the real sign-up path (Supabase user metadata or a table) and read it in the NestJS guards.
