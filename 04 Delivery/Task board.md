---
type: board
status: active
tags: [delivery, tasks]
---

# Task board

Tasks must use [[99 Templates/Task|the task template]] and be atomic enough for one focused worktree.

Reference: [[04 Delivery/Issue register|Issue register]] catalogues all 44 open issues (6 blockers)
with GA cross-references. [[01 Product/Feature status and gaps|Feature status and gaps]] holds the
PRD-vs-code comparison (13 P0 features: 0 built, 6 partial, 7 not built).

## Ready

- [ ] [[04 Delivery/GA-018-product-reliability-and-ux-roadmap|GA-018 Product reliability and UX roadmap]] — **P0**, roadmap; split before branching. Phase 0 items are hard blockers: backend build fails, `/events` returns 500, two routes 500
- [ ] [[04 Delivery/GA-000-security-stabilization|GA-000 Security and delivery stabilization]]
- [ ] [[04 Delivery/GA-016-fixturecalendar-parity|GA-016 Reach fixturecalendar.com structural parity]] — backlog/gap analysis; split before branching. Depends on GA-002, GA-003, GA-008, GA-011

## In progress

- [ ] [[04 Delivery/GA-019-multiday-date-cutover|GA-019 Multi-day date cutover]] — **in-review, uncommitted.** Migration applied; API/DTO/seed/generators/frontend all cut over; `/events` serving 10,100 live rows. Root cause of the long-standing 500 was TLS interception, now fixed. Multi-day rendering unverified (no multi-day rows exist)
- [ ] [[04 Delivery/GA-017-searchbar-airbnb-parity|GA-017 Airbnb parity for the hero search bar]] — in-review, uncommitted. Animations unverified (pane does not composite); needs a human browser check

## Blocked

- [ ] —

## Done

- [ ] —
