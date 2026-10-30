# Active Context: GoAthletix

**Last reconciled: 2026-10-30.** This file is the session entry point — read it first, before reading
code. It is deliberately short. Keep it that way: it is loaded every session, so every line costs
context. Detail belongs in the linked notes, not here.

## Read order and authority

When two sources disagree, the higher one wins and the lower one gets corrected.

1. **The code** — always ground truth.
2. `04 Delivery/Issue register.md` — all open issues (6 blockers), frontend and backend.
3. `04 Delivery/GA-018-product-reliability-and-ux-roadmap.md` — verified findings + phased plan.
4. `01 Product/Feature status and gaps.md` — PRD vs reality. `01 Product/UI-UX improvement plan.md` — design specs.
5. `04 Delivery/Task board.md` + `GA-###` notes — what is in flight and who owns it.
6. `PROGRESS.md` (workspace root) — cross-repo rollup.
7. This file + `progress.md` — narrative.

**Do NOT trust** `techContext.md` or `projectbrief.md` — FastAPI/OpenRouter/Mem0/Algolia are aspirational.

## What's happening right now (2026-10-21)

**Event page vertical is shipped and polished.** Four showcase events render the full Luma-style
layout with seeded sample data. The last seven GA tasks all landed; the branch is
`feat/implement-main-page-mockup` on both repos, up to date on origin.

- `goathletix-backend` HEAD: `b6c7a57` or later — includes migrations 0024/0025/0026 declarations,
  `/events/:id/details` v3 returning 90-key event + 11-key organiser + 5 child-table arrays,
  `supabase/seeds/0001_event_page_showcase.sql` and `0002_event_page_media.sql`, and `.claude/`
  (agents, hooks, settings) with `settings.local.json` gitignored.
- `goathletix-frontend` HEAD: `ea6d926` — Luma event page with floating action rail, gradient
  nav indicator, section-reveal + checkpoint timeline, savings ribbons, animated fill bars,
  fact-strip ticket cards, course-map thumbnails, sticky Register bar.

## Schema state

**Migrations 0012–0026 are APPLIED** to the live database:

- 0012–0023 (verified 2026-10-06): 84 tables, discipline taxonomy, geocoding, ticketing scaffolding.
- 0024/0025 (verified 2026-10-19 via `/events/:id/details` live smoke).
- 0026 (`20261019000026_event_page_fields.sql`, applied 2026-10-19 by owner, verified over REST):
  114 event-page columns + 10 new tables (event_awards, event_checkpoints, event_resources,
  event_offers, event_itinerary_days, center_batches, center_coaches, center_media, center_reviews,
  products). All constrained vocabularies (`events_amenities_known`, `events_women_safety_known`,
  `event_categories_documents_known`, `clubs_facilities_known`, etc.) are enforced — seed values
  must map to the controlled slugs.

Seeds `0001_event_page_showcase.sql` and `0002_event_page_media.sql` fill four showcase events
(fe2f7043 ultra marathon, dee4ce05 gravel race, b6951a6a trek, 4011e73d tennis) with rich page
content, past-year photos and per-category course-map image URLs.

## Multi-agent workflow (new 2026-10-20)

- **Coordinator = Opus** (this session). Writes GA task notes, dispatches, audits diffs, merges, pushes.
- **All seven subagents = Sonnet** (vault-scribe = Haiku) via `model:` frontmatter in
  `.claude/agents/*.md`. Model split is committed to the backend repo.
- Pattern established: write exhaustive task note with scope + settled facts + acceptance → dispatch
  to Sonnet in a worktree → audit diff vs declared scope → tsc/eslint/pglast verify → merge → push.
  First two trial runs (GA-056, GA-058, GA-059) all landed cleanly with correct judgement calls.
- `.claude/` lives in both the workspace root (live for the current cwd) and `goathletix-backend/.claude/`
  (committed, portable). Hook paths are relative so both work.

## Event page truth (post GA-059)

Layout: image + floating-right action rail → right column with icon-only quickbar on eyebrow row
(Save/Interested/Share, no label), title, badges, date tile, **venue card** (whole card = directions
link), host, action card (Register CTA + urgency), **At a glance** tinted grid, **Social links**
bare row below image, sticky section nav with gradient indicator sliding between tabs, **ticket
cards** redesigned to screenshot-5 pattern (sport eyebrow + status pill / title + category pills /
description / bordered fact strip of Entry·When·Eligibility·Format·Cut-off / inclusions / price +
animated capacity bar), About/Course/Format/Eligibility/Schedule/Prizes/Policies/FAQ sections with
gray full-width underline on each heading, aside with organiser (sm icons), docs & links, sponsors.

Section headings: no accent bar; gray 1px full-width underline. Nav indicator uses
`linear-gradient(90deg, var(--accent), color-mix(cyan))`. Hover never translates — only colour +
shadow ring, so icons don't jump.

Palette on this branch: `--accent: #12B4A0` (teal), `--cta: #FF385C` (red). Dark mode: `#37DAC3`
accent. **CLAUDE.md §7's claim of indigo/orange is stale** — needs the ADR-002 update.

## Established facts — do not re-investigate

- **ADR-001 DONE.** `events` has `start_date` + `end_date` (not `event_date`). `events.service.ts`
  queries them. `reminder_type` enum value `'event_date'` is a reminder kind, not a column.
- **ADR-003 accepted.** Phantom trading tables don't exist in the live DB; they're prisma residue.
- **Network:** 5432 is firewalled, Supabase REST only via corporate proxy (`.npmrc` host,
  undici `ProxyAgent` with `tls.getCACertificates`). `main.ts:6` must read `HTTPS_PROXY` before
  bootstrap. `curl` from git-bash can't reach Supabase through the proxy; use Node.
- **No DDL from here.** PostgREST can't `ALTER` or `CREATE TABLE` — migrations only run from the
  Supabase dashboard SQL editor. Seeds too, if they use types that need the service-role session.
- **Browser pane doesn't composite frames** — rAF never fires; verify ARIA/DOM, not motion.
- **Nine files in the stale `goathletix-backend/backend/src/` tree** are the unported Sprint-3 slice
  (Socket.IO gateway, JWT strategy with `super-secret-fallback`, open CORS). GA-005 is port-and-harden.
- `crawler.py` imports `urllib`/`re` but never calls them; "extraction" is ~15 hardcoded events.
  GA-009 is a rewrite.
- `.DS_Store` is still tracked (GA-012 open).
- **Forcepoint intermittently blocks Supabase.** Returns HTML or 500; clears within minutes.
- **Turbopack sometimes misses `globals.css` edits.** Stop the frontend, delete `.next`, restart.

## Branch state

Both repos are on `feat/implement-main-page-mockup`, pushed. `goathletix-frontend/main` is
weeks stale and `chore/sync-from-monorepo` has no merge base with it. GA-019 branched from the sync
branch, so it inherits that problem — decide the reconciliation before opening a PR.

## Event page layout (2026-10-30)

Luma-style top block from 900px: `left | right` (photo + Social event links + one clubbed **Hosted by** block | title,
action, At a glance). Below it **one full-width column** of sections: no section nav (deleted, GA-062), no sidebar;
Documents and Sponsors sit after the FAQ; Reviews (GA-060/061: read API, ratings badge links to `#reviews`, posting is
honestly disabled until accounts exist) sit after Venue. Tickets are full-width **rows** with a large distance numeral,
key facts on the row and a "Details and requirements" disclosure (GA-062). GA-063: **distance pills** above the rows
(shown when an event has more than 3 ticket types; a long list opens on its first distance), a row **Select** button and
one **sticky selection bar** (quantity, total, disabled "Checkout coming soon") via `TicketPicker`; `TicketStepper` is
gone. Platform ticketing only; external stays information only. Research caveat: Awwwards and Mobbin could not be read
from here, so tabs, bar and numeral are design judgement. The four seeded showcase events still show **no Glimpses**
until `0002_event_page_media.sql` is applied.

## Shipped GA tasks (recent)

- GA-043 /events/:id/details endpoint
- GA-044 Luma-style event page (desktop + phone)
- GA-045 design skills market research
- GA-046 event detail field model by sport
- GA-047 migration 0026 draft
- GA-048 details endpoint existing fields (0024/0025)
- GA-049 event page v2 with organiser details + category finder
- GA-050 /events/:id/details v3 with 0026 fields
- GA-051 showcase seed (0001_event_page_showcase.sql)
- GA-055 media seed (0002_event_page_media.sql) + course map images
- GA-056 aid-station vocab icons (Sonnet trial 1)
- GA-057 sticky Register bar + aid-station mini cards + CTA glow
- GA-058 section reveals + ticket interactive + checkpoint timeline (Sonnet)
- GA-059 ticket card redesign with fact strip (Sonnet)
- GA-060 event reviews API, GA-061 reviews UI, GA-062 ticket rows + one-column body, GA-063 distance tabs + sticky selection bar
- 2026-10-22 polish (post-GA-059): removed the ticket hover-disclosure (sibling cards no longer jump),
  fact strip + What's included locked to 2 columns, Organiser aside is `position: sticky` so Documents
  and Links stay in view while the main column scrolls.

## Next, in order

1. **Memory bank maintenance:** this file was 9 days stale; the update obligation needs to actually run
   each shipping task. New sub-step for every GA task: edit `activeContext.md` in the same commit.
2. **Decide GA-019 landing** — the no-merge-base problem blocks the PR.
3. **GA-002 CLAUDE.md palette:** section 7 still claims orange/indigo. Live is teal `#12B4A0`.
   Needs an ADR-002 decision commit + CLAUDE.md fix.
4. Club detail page (new GA, uses live `clubs` 27 columns from migration 0026).
5. Academy / training-center detail page (uses `training_centers` + child tables).
6. Gear/product detail page (uses `products` 16 columns + specs/size_chart jsonb).
7. **Blocking data gap** still open: `sport=athletics` returns 0; all 10,100 rows are the 8 endurance
   categories with `discipline_slugs=[]`. Ingestion rewrite (GA-009) or a seeded athletics batch.

## Update obligation

Whoever finishes a unit of work updates this file **in the same change** — blocking facts, branch
state, established facts, next steps. Correct anything that has become false rather than appending;
this file must stay short enough to read every session. Append historical narrative to `progress.md`.
