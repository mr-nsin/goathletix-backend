# ADR-006 — Sport taxonomy: two axes, and where the taxonomy lives

- **Status:** Proposed
- **Date:** 2026-09-16
- **Supersedes:** nothing. **Extends:** `docs/17-sports-taxonomy.md`
- **Related:** [[ADR-001-multi-day-event-dates|ADR-001]], `docs/21-platform-expansion-vision.md`

---

## Context

The 2026-09 scope broadening (`docs/17-sports-taxonomy.md`, `docs/21-platform-expansion-vision.md`)
turns GoAthletix from an endurance/adventure aggregator into a multi-sport, multi-age **athletics-first**
platform: any place, any age group, kids through masters, with team sports (cricket, hockey) arriving
last.

That exposes a structural problem. `sport_category` is a **flat Postgres enum of 8 values**
(`running, cycling, triathlon, trekking, fitness, racquet, water, adventure`). It conflates two
independent questions, and answers neither well:

1. **What kind of sport is this?** — needed for browse, SEO, and the athletics-first ordering.
2. **How is the event entered, and how does it behave?** — needed to decide the card layout, the
   required fields, and which homepage rail the event belongs on.

These cross-cut. Badminton (racquet family) and karate (combat family) are both **bracket
tournaments** — identical record shape, identical card. Road running and speed skating sit in
different families but are both **mass-participation timed** events. A single flat list cannot
express this, so the UI has no way to know how to render anything.

Note also that **athletics (track & field) is not currently a value in the enum.** `running` is road
running. The sport named as the product's primary focus cannot be stored today.

## Decision

### 1. Model the taxonomy on two explicit axes

| Axis | Question | Drives |
| --- | --- | --- |
| **Sport family** | "What kind of sport is this?" | Browse, navigation, SEO, athletics-first ordering |
| **Event model** | "How do you enter it?" | Card layout, required fields, homepage rail eligibility |

**Sport families** (ordered — this ordering *is* the athletics-first positioning):

| Family | Sports | Phase |
| --- | --- | --- |
| `athletics` | Track & field, road running, cross-country, race walking | 1 |
| `endurance` | Cycling, triathlon/duathlon, swimming (pool + open water), ultra | 1–3 |
| `skill_artistic` | Skating (speed, artistic, inline, skateboard), gymnastics | 2 |
| `combat` | Karate, taekwondo, judo, boxing, wrestling, fencing | 2 |
| `racquet` | Badminton, table tennis, tennis, squash, pickleball | 3 |
| `outdoor` | Trekking, expeditions, camps, rallies, snow sports | 3 |
| `fitness` | CrossFit, functional fitness, yoga festivals, expos | 4 |
| `team` | Cricket, hockey, football, basketball, volleyball, kabaddi, kho-kho | 5 |
| `mind` *(optional)* | Chess and other scholastic board circuits | 5 |

**Event models:**

| Model | Entry key | On the entry rails? |
| --- | --- | --- |
| `mass_participation` | date + distance | yes |
| `meet` (age-group heats) | date + age group + discipline | yes |
| `bracket` (tournament) | date + age/weight category | yes |
| `batch_departure` | **many departure dates**, not one | **no — needs its own shape** |
| `non_competitive` | date | yes |
| `league_fixture` | team × round, not entry | **no — separate surface** |

### 2. Keep `sport_type` as an enum; put the two axes in a `sports` lookup table

Rejected the obvious alternative of replacing the enum with a foreign key **now**. Instead:

- **Extend** the `sport_category` enum additively so athletics and the youth categories can be stored.
- **Add a `sports` lookup table** keyed by the enum value, carrying `family`, `event_model`,
  `phase`, `display_name`, `is_active`.
- Read grouping and ordering from `sports`, never from a hardcoded list in application code.

This makes both axes **data** — a new family, a reordering, or activating a phase becomes a row
update rather than a migration plus `prisma generate` plus an API contract change — while changing
nothing about how `events` stores its sport. If `sport_type` later becomes a true foreign key, this
table is already the target.

### 3. Team sports are a different record type, not a later phase of the same one

`league_fixture` breaks the entry model: there is no registration, and the entity is a pairing, not
an entry. Cricket and hockey therefore get their own surface when they arrive, and are **excluded
from the homepage entry rails** rather than awkwardly squeezed into them.

## Consequences

- Athletics becomes storable and filterable, which is a prerequisite for the stated positioning.
- The homepage can group and order sports from data (`family`, `phase`) with no code change.
- `@IsEnum(SportCategory)` still compiles the value list into the DTO, so **the backend must be
  deployed before any client sends a new sport value**, or the API returns 400.
- Postgres will not allow a newly added enum value to be *used* in the same transaction that adds it,
  so the `ALTER TYPE` statements must ship in their **own migration**, ahead of any migration that
  inserts rows using them. This is why the migrations are split into 0005/0006/0007.

## Open, deliberately not decided here

- **Batch departures.** A trek is not one `start_date`/`end_date`; it is an event with N departures,
  and `docs/17-sports-taxonomy.md` Phase 4 says the ingestion engine must support them. Nothing in
  the schema does. Deferred — treks stay single-date until this gets its own ADR.
- **Whether `sport_type` eventually becomes a foreign key** to `sports`. Not needed for the current
  scope; revisit if the taxonomy keeps churning.
