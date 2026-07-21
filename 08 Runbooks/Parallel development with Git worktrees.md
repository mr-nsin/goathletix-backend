---
type: runbook
status: active
tags: [agents, git, worktrees]
---

# Parallel development with Git worktrees

## Purpose

Use independent worktrees for independent tasks. The coordinator owns cross-cutting configuration, migrations, merges, and final verification.

## Before assigning an agent

1. Create a task note from [[99 Templates/Task|Task]]. State scope, acceptance criteria, dependencies, and files/areas the task owns.
2. Check the task board and active worktrees. Do not give two agents the same component, migration, lockfile, root config, or shared document.
3. Decide the branch name: `codex/ga-<id>-<short-name>`.
4. Keep secrets out of the task. Record only required environment-variable names.

## Create the worktree

Run these commands from the primary checkout, replacing the placeholders:

```sh
git fetch origin
git worktree add ../goathletix-wt/ga-042-multiday-events -b codex/ga-042-multiday-events
git -C ../goathletix-wt/ga-042-multiday-events status --short
```

Update the task frontmatter with the exact branch and worktree path. Each worktree needs its own local environment file; copy an approved example locally and never commit the result.

## Agent contract

An implementation agent must:

- modify only its task scope;
- make small, coherent commits;
- run the task-relevant checks;
- not commit `.env*`, keys, database URLs, build output, or dependency directories;
- create a handoff note before integration.

The coordinator must:

- resolve scope conflicts before work starts;
- review migrations and shared contracts serially;
- integrate one handoff at a time;
- run the full relevant checks after merges;
- update the task board and active context.

## Integration checklist

1. Read the task and its handoff.
2. Inspect the diff and confirm only owned paths changed.
3. Run stated checks and any integration checks affected by the change.
4. Merge or cherry-pick the reviewed commit.
5. Mark the task done, link the handoff, and record any new decision.

## Clean-up

After merge and verification, remove only the exact worktree that is no longer needed:

```sh
git worktree remove ../goathletix-wt/ga-042-multiday-events
git worktree prune
```

Never delete a worktree containing uncommitted work. Confirm with `git -C <path> status --short` first.
