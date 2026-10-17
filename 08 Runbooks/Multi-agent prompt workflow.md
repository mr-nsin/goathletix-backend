---
type: runbook
status: active
tags: [runbook, worktrees, agents]
---

# Multi-agent prompt workflow

How one owner prompt becomes several parallel agent tasks in this workspace. It applies the article
[How to use git worktrees to run multiple AI agents on the same repo](https://dev.to/battyterm/how-to-use-git-worktrees-to-run-multiple-ai-agents-on-the-same-repo-1on8)
to our shape: **two independent repos**, a shared dev machine with a corporate proxy, and one
coordinator (the main Claude session). Read with [[08 Runbooks/Parallel development with Git worktrees]]
and the workspace `WORKTREES.md`; this note only adds the per-prompt procedure.

## What the article says, and what we take from it

| Article point | Our rule |
| --- | --- |
| One worktree per agent, own branch, shared `.git` | `tools\wt.ps1 add <be\|fe> <id> <name>` creates `..\goathletix-wt\<be\|fe>-ga-<id>-<name>` on `codex/ga-<id>-<name>` |
| Each agent works only in its own directory | The prompt hands the agent its absolute worktree path and an owned-paths list. Nothing else may be edited. |
| Run the tests in the worktree before merging; agents report success when code merely compiles | Every task note has a Verification table of commands actually run. The coordinator re-runs them on the merge result. |
| Merge one branch at a time so later merges see earlier ones | Coordinator merges serially, backend before frontend when the frontend consumes a new contract. |
| Reuse or remove worktrees after merge | Remove with `wt.ps1 remove` once `git status` is empty and the branch is merged. |
| 3 to 5 agents; 2 to 3 for tightly coupled code | **Ceiling is 3 writers** (see the serial resources in `WORKTREES.md`: `globals.css`, `app.module.ts`, schema, lockfiles). Read-only agents (`repo-auditor`) do not count. |
| Automate the loop | `tools\wt.ps1` (create / list / remove, node_modules junction, env copy). |

## Where we differ from the article, on purpose

- **Base branch is the live feature branch**, not `main`. `origin/main` is behind the work in flight, so
  a branch cut from it would not contain the current homepage. `wt.ps1 -Base` defaults to
  `feat/implement-main-page-mockup`.
- **No second `npm install`.** `node_modules` is a junction to the main checkout's, which is enough for
  `tsc`, `eslint` and `jest`. Never run `npm install` in a worktree.
- **Only the main checkout runs servers** (3000 backend, 3001 frontend). Worktrees verify with
  type-check, lint and unit tests; the coordinator verifies in the browser after merging.
- **Agents commit, they do not push or merge.** Pushing and merging are the coordinator's, and a push
  needs the owner's say-so.

## The loop for every prompt

1. **Plan (coordinator).** Split the prompt into tasks whose owned paths are disjoint. Drop or serialise
   anything touching a serial resource. If two tasks want the same file, they are one task.
2. **Contract.** One `GA-###` note per task from `99 Templates/Task` (scope, owned paths, out of scope,
   acceptance, verification). No worktree before its note exists.
3. **Worktrees.** `tools\wt.ps1 add ...` per task; record `branch:` and `worktree:` in the note.
4. **Dispatch.** One agent per task, in parallel, using the matching `.claude/agents/*` type. The prompt
   contains: the task note path, the absolute worktree path, owned and forbidden paths, the established
   facts from `activeContext.md` (agents do not inherit them), the exact checks to run, and "commit on your
   branch, do not push, do not merge, do not touch the main checkout".
5. **Audit.** `repo-auditor` (read-only) reviews each branch diff against its declared scope.
6. **Integrate, one at a time.** `git diff --name-only <base>...<branch>` must list only owned paths;
   merge; run lint, type-check and tests on the merge result; then restart the main-checkout servers and
   look at it in the browser.
7. **Record.** `vault-scribe` (single scribe, after the merges): Task board, task Verification tables,
   `PROGRESS.md`, `activeContext.md`, handoffs.
8. **Clean up.** `wt.ps1 remove`, delete merged branches.

## Batch 1 (2026-10-16)

| Task | Agent | Repo | Owns | Why it is safe in parallel |
| --- | --- | --- | --- | --- |
| [[04 Delivery/GA-021-age-and-search-params-on-listing-pages\|GA-021]] Honour `ageCategories` / `q` on city and sport pages | `discovery-ui` | frontend | `src/app/locations/[city]/page.tsx`, `src/app/sports/[sport]/page.tsx`, `src/components/EventsDirectory.tsx`, and one allowed append to `globals.css` | only frontend writer |
| [[04 Delivery/GA-022-event-visibility-filter\|GA-022]] Public-only filter on `/events` | `events-api` | backend | `src/events/**` | no schema or `app.module.ts` edit |
| [[04 Delivery/GA-023-python-requirements-manifest\|GA-023]] Pinned `requirements.txt` for `scripts/` | `ingestion-scripts` | backend | `scripts/requirements.txt`, `scripts/README.md` | disjoint from `src/**` |

Then `repo-auditor` on each branch, then the merges, then `vault-scribe`.

## Lessons from batch 1

- **Type-check and lint passed, and two pages still returned 500.** GA-021 had a server page call a function
  exported from a `"use client"` file. Only running the page showed it. So the agents' "tsc + eslint pass" is
  necessary, never sufficient: the coordinator must load the affected routes after every merge (step 6) and
  say so in the handoff. Agents that cannot run a server must list that as "not verified".
- Dev servers kept getting stopped by the app between turns; restart them (and clear `.next`) before step 6.
- `wt.ps1 remove` removes the `node_modules` junction without touching the main checkout's folder (verified).
- **Batch 2/3: `next build` is a required step.** `tsc` and `eslint` passed on a file that contained one byte in the wrong
  encoding (a Windows-1252 middle dot); only the production build rejected it. Agents cannot run the build in a worktree
  (Turbopack refuses the `node_modules` junction), so the coordinator runs `npm run build` on the merge result, with the dev
  server stopped, before restarting it on a cleared `.next`.
- **Parallel-safe layout that worked:** agents created new files (`*V2.tsx`, new `.css`), only one task owned `globals.css`,
  and the coordinator did the single wiring edit in `page.tsx`. Four writers merged with zero conflicts.
- The global `prefers-reduced-motion` kill rule silently removes hover transitions and animations on machines with reduced
  motion on; any motion the owner must see is re-declared with `!important` inside a reduced-motion block.
