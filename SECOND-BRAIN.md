---
type: index
status: active
tags:
  - goathletix
  - second-brain
---

# GoAthletix Second Brain

This repository is an Obsidian vault as well as the product source. It stores **shared, durable project knowledge**: decisions, task contracts, handoffs, and runbooks. Do not store private notes, credentials, access tokens, database URLs, or customer data here.

## Start here

- [[04 Delivery/Task board|Task board]] — work ready for an agent.
- [[07 Agent handoffs/Agent handoff log|Agent handoff log]] — integration-ready summaries.
- [[03 Decisions/Decision log|Decision log]] — architecture decisions and their rationale.
- [[08 Runbooks/Parallel development with Git worktrees|Parallel development with Git worktrees]] — operating rules.
- [[memory-bank/activeContext|Active context]] — concise current product state.

## Folder map

| Folder | Purpose |
| --- | --- |
| `00 Inbox` | Untriaged ideas; empty it during planning. |
| `01 Product` | Product briefs, user insights, and requirements. |
| `02 Architecture` | System maps, contracts, and technical research. |
| `03 Decisions` | ADRs: decisions that should not be rediscovered. |
| `04 Delivery` | Task board and one atomic task note per work item. |
| `05 Research` | Dated research summaries with source links. |
| `06 Daily logs` | Short, dated coordination logs. |
| `07 Agent handoffs` | Reviewable handoffs between implementation and integration. |
| `08 Runbooks` | Repeatable operational procedures. |
| `99 Templates` | Obsidian templates; copy them, do not edit in place. |

## Rules that keep the vault useful

1. A task note is the contract before a worktree or agent is created.
2. One task owns one coherent file area. Split overlapping work before parallelizing.
3. Every completed task has a handoff linking its commit/PR, tests, changed paths, and follow-up work.
4. Record a decision when an alternative was seriously considered or a choice affects another agent.
5. Treat everything committed here as public-to-the-repository. Reference secret names only, never values.

See [[08 Runbooks/Parallel development with Git worktrees|the worktree runbook]] for the full development loop.
