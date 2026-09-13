---
id: ADR-005
type: decision
status: proposed
date: 2026-09-09
owners: [human, data-schema, discovery-ui]
related: [GA-018, ADR-002]
tags: [adr, schema, design]
---

# ADR-005 How event imagery works

## Context

The `Event` model has **no image field of any kind**. The only image in the schema is
`Organizer.logoUrl`. Meanwhile:

- The homepage's `DiscoveryCard` rails use **hardcoded Unsplash URLs** — decorative stock photos with
  no relationship to the events shown.
- indiarunning.com's listing card is image-led: a 384×504 card whose top third is a per-event banner
  carousel. That imagery is doing most of the work of making their listings feel real.
- No `next/image` is used anywhere, so full-size 2070px crops ship to every viewport.

Any image-led card design for real event data is therefore blocked on a schema decision. This is the
gating item for the "best events" homepage rails.

## Decision

*Pending — this is the question put to the owner.*

## Alternatives considered

- **Add `hero_image_url TEXT` to `events` (recommended).** One nullable column, populated by ingestion
  from the source listing where available. Cheapest thing that makes real cards possible. Needs
  `next/image` `remotePatterns` configured per allowed host, and a fallback for the (initially most)
  events with no image.
- **Add a `media` table** (many images per event, ordered, with alt text and credit). Correct long-term
  and matches indiarunning's carousel, but it is a join and a bigger migration for a product that
  cannot currently serve one image.
- **Stay text-first: no event images at all.** Lean on typography, a sport-coded colour block, and the
  date badge. Zero migration, and it sidesteps rights and hotlinking questions entirely. Loses the
  visual richness that makes a discovery homepage feel populated.
- **Generated placeholders only** — deterministic sport-coded gradient per event, seeded by id. No
  migration, no rights issues, looks intentional rather than broken, and it degrades gracefully into
  either option above later.

## Recommendation

Do **generated placeholders now** and **`hero_image_url` next**, in that order. The placeholder work
is pure frontend, needs no migration, and is what lets the homepage rails ship while `/events` is
still being fixed. Add the column when ingestion is actually capable of populating it — which today
it is not, since `crawler.py` does not crawl.

Defer the `media` table until there is a real editorial or organizer-upload flow.

## Consequences

- Positive (placeholders): unblocks the homepage rails and the card variant immediately, with no
  schema or rights exposure.
- Positive (`hero_image_url` later): a single nullable column is additive and safe; no backfill needed.
- Cost/risk: hotlinking third-party images has both rights and reliability implications. Prefer
  re-hosting via Supabase Storage over linking a source site's CDN.
- Cost/risk: every image needs alt text. There is no field for it in either option above — if imagery
  is adopted, add `hero_image_alt` at the same time or accessibility regresses.
- Cost/risk: the hardcoded Unsplash URLs in `DiscoveryCard` usages should be removed regardless of the
  decision. They imply the product has imagery it does not have.
