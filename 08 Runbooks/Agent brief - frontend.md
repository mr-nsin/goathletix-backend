---
type: runbook
status: active
tags: [runbook, agents, frontend]
---

# Agent brief: frontend tasks (read this before your task note)

Shared facts for every frontend agent. Your task note says what to build; this says how to work here.

## Isolation

- Work **only** in the worktree path in your prompt. Never edit `D:\project\goathletix\goathletix-frontend` (the main checkout runs the dev servers on 3001; the backend runs on 3000) or another agent's worktree.
- `node_modules` in the worktree is a junction to the main checkout's. Never run `npm install`. Never start a dev server.
- Several agents work in parallel. **Create new files for your work** (components, CSS, data). Do not edit `src/components/home/Sections.tsx`, `src/app/page.tsx` or `src/app/layout.tsx` unless your task note lists them: the coordinator wires new components into `page.tsx` after merging, so those files stay conflict-free.
- `src/app/globals.css` is a serial resource: only the task that lists it may edit it. Everyone else puts styles in their own new `.css` file imported by their own component (Next 16 allows global CSS imports from components). `globals.css` loads first, so equal-specificity rules in your file win. READ globals.css to see the existing rules you need to override.
- Commit on your branch only. No push, no merge, no branch switching. `git status --short` must list only your owned paths before you commit. Commit trailer: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Stack facts (settled, do not re-investigate)

- Next.js 16.2.10, React 19, TypeScript 5, Tailwind v4 (no config; tokens and plain CSS classes live in `globals.css`). Read `node_modules/next/dist/docs/` before writing App Router code; `params` and `searchParams` are Promises.
- **Server/client boundary (it already caused a 500 once; tsc and eslint cannot see it):** a server component may render a client component or pass props to it, but must never CALL a function exported from a `"use client"` file. Shared helpers go in plain modules. Self-audit this before you commit.
- React Compiler lint is on: no synchronous `setState` inside `useEffect` (use event handlers, observer callbacks, timeouts); do not read refs during render.
- Style: double quotes, no Prettier. Many files are CRLF: preserve each existing file's line endings (new files can be LF).
- Tokens (work in dark mode automatically): `--surface --surface-2 --bg --ink --muted --line --accent --accent-ink --grad --cta --star --ok --info --danger --tint-ok --tint-danger --tint-info --tint-mute --shadow --shadow-lg --radius --pad`. Fonts: Outfit for text, Roboto Condensed (`var(--font-cond)`, weights 500 and 700 only) for labels. Brand: indigo `#2C3D8F`/navy `#141A3E`, teal `#37DAC3`/`#12B4A0`, lime `#86E01E`, CTA `#FF385C`.
- Sport glyphs: colourful Fluent Emoji bundled offline (`src/lib/sportIcons.json`, `src/lib/gearIcons.json`), drawn by the server component `src/components/home/FluentIcon.tsx` (`SPORT_GLYPH` maps a slug to a glyph). Research on alternatives: `goathletix-backend/01 Product/Sports icon libraries.md`.
- Landmark line drawings: `src/components/layout/CityIcons.tsx`. City photos: `public/cities/*` with `src/lib/cityPhotos.ts`.
- Card text scale used elsewhere: 18 title, 14 main line, 12.5 secondary. Keep new cards consistent and readable (min 12.5 px for secondary text).

## Motion

- The owner's machine has `prefers-reduced-motion: ON` and wants to SEE the motion. A global rule in `globals.css` (`animation: none !important; transition: none !important` for reduced motion) would kill it. Where a task wants visible motion, follow the precedent documented in `HeroDoors.tsx`, `HeroStats.tsx` and the parade block of `globals.css` (re-declare the animation with `!important` inside a `@media (prefers-reduced-motion: reduce)` block), and keep motion slow, small and never essential.
- Hover transitions must be smooth: animate only `transform` and `opacity` (and `box-shadow` sparingly via a pseudo-element), use one shared easing such as `cubic-bezier(.22,.61,.36,1)` and 240-320 ms, add `will-change: transform` only on the hovered card, never transition `all`, and never change layout properties (width, height, padding, border) on hover.
- The browser pane used by the coordinator does not paint animation frames, so the coordinator cannot judge smoothness: write the CSS carefully and explain in your report what makes it smooth.

## Verification you must run, and what to report

- In the worktree: `npx tsc --noEmit` and `npx eslint src` (0 errors; existing warnings are fine). Record the real output.
- Fill the Verification table in your task note (`goathletix-backend/04 Delivery/GA-0xx-....md`, the only file outside your worktree you may edit) with real results; write `not run` for anything you did not run.
- Final report, short and factual: commit hash; each changed file with one line; exact tsc/eslint results; what you could NOT verify (you have no browser); the exact exports and props the coordinator must wire into `page.tsx`; risks. Never claim behaviour you did not run.

## Network (curl fails here; Node works)

Write a scratch `.mjs` in the session scratchpad, copy it to `D:\project\goathletix\goathletix-backend\_tmp.mjs`, run it with cwd there (so `undici` resolves), delete it afterwards. Recipe: `import tls from "node:tls"; import { ProxyAgent, fetch } from "undici"; const ca=[...tls.getCACertificates("system"),...tls.getCACertificates("bundled")]; const dispatcher=new ProxyAgent({ uri: process.env.HTTPS_PROXY, requestTls: { ca } }); fetch(url,{dispatcher})`. `api.iconify.design` and `commons.wikimedia.org` (MediaWiki API) are reachable. Send a descriptive User-Agent to Wikimedia. Never hotlink assets; bundle them locally with their licence recorded.
