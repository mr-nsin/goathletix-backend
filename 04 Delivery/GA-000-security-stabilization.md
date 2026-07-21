---
id: GA-000
type: task
status: ready
priority: P0
owner: unassigned
branch: unassigned
worktree: unassigned
scope:
  - repository hygiene
  - security review findings
acceptance:
  - No credentials or database connection values are tracked in source or documentation.
  - Ignore rules and safe environment examples are in place.
  - Previously identified configuration and quality issues are addressed or explicitly tracked.
depends_on: []
related:
  - "[[08 Runbooks/Parallel development with Git worktrees]]"
---

# GA-000 Security and delivery stabilization

## Goal

Resolve the security and delivery risks identified during the repository review without mixing unrelated feature work.

## Boundaries

- Do not expose, copy, or commit secret values in task notes or handoffs.
- Coordinate changes to root configuration, migration ownership, and shared frontend entry points before parallel work begins.

## Implementation notes

Add findings, decisions, and test evidence here as the assigned work proceeds.

## Handoff

Create a dated note in [[07 Agent handoffs/Agent handoff log|Agent handoffs]] before requesting integration.
