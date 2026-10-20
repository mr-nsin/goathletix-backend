# Enforcement hooks

Configured in `.claude/settings.json`. They enforce the update obligation in `CLAUDE.md` section 0:
whoever changes source code in a session also updates
`goathletix-backend/memory-bank/activeContext.md`.

| Script | Event | What it does |
| --- | --- | --- |
| `record-edits.js` | `PostToolUse` on `Edit\|Write` | Appends each edited file path to `%TEMP%/claude-edits-<session_id>.txt`, normalising `\` to `/`. |
| `check-memory-bank.js` | `Stop` | Reads that list. If anything under `goathletix-{backend,frontend}/src/` was edited but `memory-bank/activeContext.md` was not, prints a `systemMessage` naming the files. |

## Design notes

- **Written in Node, not `jq`.** `jq` is not installed on this machine, and a `jq`-based hook would
  silently do nothing rather than fail loudly.
- **Warning only, never blocking.** Neither script emits `continue: false`, so a turn is never
  halted. Both swallow all errors — a broken hook must not break a tool call or end a turn.
- **Per-session tracking, not `git status`.** A `git status` check would fire on every turn while any
  unrelated file is uncommitted, including turns that only answered a question. Keying on
  `session_id` means the warning appears only when *this* session actually edited source.

## Limitations

- Only catches edits made through Claude Code. Manual edits in an editor bypass it entirely.
- Enforces *that* `activeContext.md` was touched, not that the update was any good.
- The list file lives in the OS temp directory and is not cleaned up; entries are tiny and per
  session.

## Verification

`node <scratchpad>/hooktest.js` exercised four cases — src edited without `activeContext.md` (warns),
src edited with it (silent), a session with no edits (silent), and only non-src edits (silent).
All four passed on 2026-09-09.
