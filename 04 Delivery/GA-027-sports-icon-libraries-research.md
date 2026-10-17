---
id: GA-027
type: task
status: ready
priority: P2
owner: research
branch: none (documentation only)
worktree: none
scope: [goathletix-backend/01 Product/Sports icon libraries.md]
acceptance: []
depends_on: []
related: [GA-024]
---

# GA-027 Which icon libraries to use for sports

## Goal

Owner asked: "check what more best libraries of icons are available for sports icons". Produce a decision-ready comparison.

## Scope and ownership

- Owned: one new note, `goathletix-backend/01 Product/Sports icon libraries.md`. No code, nothing added to either repo, no packages installed.
- Out of scope: changing any component (GA-024 does the sport tile redesign with the icons already bundled).

## Acceptance criteria

- [ ] A table of candidate libraries: at least Fluent Emoji (Flat and Color), Noto Emoji, Twemoji, OpenMoji, Phosphor, Lucide, Tabler,
      Material Symbols, game-icons.net, Healthicons, Font Awesome, and any Iconify sets tagged for sports. For each: style
      (colour / line / glyph), how many sport glyphs, licence and whether attribution is required, Iconify prefix, and how it is bundled.
- [ ] A coverage grid for the 12 sports (athletics, running, cycling, triathlon, fitness, racquet, trekking, water, adventure, skating,
      gymnastics, martial arts) and 6 disciplines (javelin, hurdles, badminton, swimming, karate, rock climbing): which library has a good
      glyph and which does not.
- [ ] A recommendation with reasons and its licence obligations, stated honestly.
- [ ] Every claim about an icon name is checked against the Iconify API from Node (`https://api.iconify.design/<prefix>.json?icons=<name>`
      or `/search?query=`), not from memory.

## Implementation notes

Network recipe (curl fails here; Node works): run Node from `D:\project\goathletix\goathletix-backend` so `undici` resolves, with
`const ca=[...tls.getCACertificates('system'),...tls.getCACertificates('bundled')]` and
`new ProxyAgent({ uri: process.env.HTTPS_PROXY, requestTls: { ca } })` as the `dispatcher` for `undici.fetch`. Put scratch scripts in the
session scratchpad, not in the repo.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Icon names verified against the Iconify API | pass | Node + undici proxy, `/search`, `/<prefix>.json?icons=`, `/collections` on 2026-10-16/17; `/collection` was 429 rate limited so full inventories not pulled; see `01 Product/Sports icon libraries.md` |

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
