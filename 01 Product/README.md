# Product knowledge

Store durable product requirements, user problems, and accepted scope. Link implementation work back to the relevant product note.

## Notes in this folder

- [[01 Product/Feature status and gaps|Feature status and gaps]] — every feature in `docs/05-feature-inventory.md`
  and `docs/06-mvp-definition.md` cross-referenced against the actual code, plus a Sprint 0–10 reality
  check. **Headline: of 13 P0 features, 0 built / 6 partial / 7 not built.**
- [[01 Product/UI-UX improvement plan|UI-UX improvement plan]] — field-priority tiers for an endurance
  event, concrete row and card specs, a badge system, state copy, accessibility acceptance criteria,
  and a prioritised backlog ordered so no-new-data wins come first.

Related, in other folders:

- [[04 Delivery/GA-018-product-reliability-and-ux-roadmap|GA-018 Product reliability and UX roadmap]] —
  the phased plan these two notes expand on. Verified source of truth for current findings.
- [[04 Delivery/Issue register|Issue register]] — all 44 catalogued issues (6 blockers), frontend and
  backend, with fresh lint/build output and GA cross-references.

**Read the PRD in `docs/` with care:** `memory-bank/techContext.md` and `memory-bank/projectbrief.md`
are aspirational — they describe FastAPI services, an OpenRouter LLM pipeline, Algolia and an agent
fleet, none of which exist in the repo. Plan against the code, not those documents.
