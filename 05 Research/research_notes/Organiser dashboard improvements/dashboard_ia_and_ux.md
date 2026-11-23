# Organiser dashboard information architecture and UX patterns (GoAthletix)

Research date: 2026-11-18. Public sources only. "Cited Findings" are facts documented by the linked page. "Inferences" are my recommendations or reasoning, not documented facts. Blocked or unverified items are listed under Gaps.

## Key question 1: What navigation and home-screen design should the GoAthletix organiser dashboard adopt, and how should it change as an event moves through its phases?

### Takeaway
Reference products use object-based primary navigation (Stripe: Home, Balances, Transactions, Customers, Product catalogue; Eventbrite: per-event Orders, Attendees, Reports) with a pinned/recent shortcuts layer and a keyboard-first search or command menu (Stripe `?` shortcuts, Linear `/` and prefix commands). None of the sources I could reach documents a phase-based nav. Recommendation: keep stable object nouns as the nav, and make the phase drive what the event Home surfaces (checklist, attention list, default KPIs, field-mode entry), not the nav labels.

### Cited Findings

#### Navigation and search (documented)
- Stripe's primary sidebar section holds Home, Balances, Transactions, Customers and Product catalogue (objects/nouns). A separate Shortcuts section shows pinned and recently visited pages, which can be pinned after a visit. A Products section groups product areas; "More" holds less-used products. — [Stripe Dashboard basics](https://docs.stripe.com/dashboard/basics)
- Stripe settings are split into Personal, Account and Product categories; team invites give members different access levels (e.g. a customer-service role for refunds/disputes). — [Stripe Dashboard basics](https://docs.stripe.com/dashboard/basics)
- Stripe: pressing `?` lists keyboard shortcuts; there is a dedicated search page in docs; Sandboxes exist to test without touching live data; a mobile app covers monitoring, payouts and push notifications for business activity. — [Stripe Dashboard basics](https://docs.stripe.com/dashboard/basics)
- Linear: `/` opens workspace search; results are ordered by status (unstarted/in-progress first); quotes give exact match; `@` adds filters; the command menu accepts a typed prefix plus space to scope results (i issues, p projects, u users, t teams, l labels, f favorites, d documents); typing an ID plus Enter opens the item directly; a clock button lists recent items; Cmd/Ctrl+F filters within the current view. — [Linear search docs](https://linear.app/docs/search)
- Eventbrite organise flow: open an event, then Manage attendees, then Manage Orders (orders list, edit order info, refund/cancel). A separate article covers orders across all events. Attendee management sits in the same area. — [Eventbrite help via search results](https://www.eventbrite.com/support/articleredirect?anum=5870) (search-result summary; page not fetched)
- Eventbrite reports are tiered: basic (Attendees, Add-ons, Custom question responses, Traffic and conversion, Attendance, Transfers, Tracking links, Holds summary, Saved reports) versus advanced (Sales, Orders, Audit). — [Eventbrite permissions definitions](https://www.eventbrite.fi/help/fi/articles/362073/permissions-definitions) (search-result summary only; page not fetched)
- Eventbrite Organizer mobile app: check in by camera scan or name lookup, sell tickets, view a sales/check-in overview onsite. — [App Store listing](https://apps.apple.com/app/id368260521) (via search summary)
- RunSignup splits race-day tooling into a "RaceDay Tools" section of the dashboard; the RaceDay CheckIn app handles packet pickup, bib assignment, labels and volunteer check-in; syncs with registration every 30 seconds; keeps working on spotty connectivity; supports QR/barcode scan, bib lookup, waiver collection, kiosk mode, medical check-in; Timer Dashboard shows check-in in five-minute intervals; dashboard access can be shared in full or limited form, with a volunteer coordinator given limited access. — [RunSignup RaceDay CheckIn overview](https://info.runsignup.com/raceday-checkin-app/), [App Store listing](https://apps.apple.com/us/app/id1434451638), [RunSignup help: web check-in](https://help.runsignup.com/support/solutions/articles/17000063276) (all via search-result summaries; not fetched in full)

#### Home screen (documented)
- Stripe Home provides analytics and charts on performance and surfaces important notifications such as unresolved disputes or identity verifications; users customise it via Add/Edit under "Your overview" and select widgets, then Apply. — [Stripe Dashboard basics](https://docs.stripe.com/dashboard/basics)
- A third-party agency teardown describes Stripe Home as five headline numbers with sparklines and a date-range comparison, and claims no customisable widget grid; this conflicts with Stripe's own docs, so treat as outdated or incomplete. — [925 Studios](https://www.925studios.co/blog/stripe-dashboard-design-breakdown) vs [Stripe docs](https://docs.stripe.com/dashboard/basics)
- Shopify (app Home guidance): the home page should show quick statistics, status updates or immediately actionable information, and make available actions clear. — [Shopify onboarding guidance](https://shopify.dev/docs/apps/design/user-experience/onboarding)
- Shopify setup-guide composition: an interactive checklist with visual progress tracking, steps auto-marked complete, a progress indicator for encouragement; intended for the homepage or a dedicated onboarding page. There is no ready-made Polaris pattern, so teams compose it. — [Shopify setup guide pattern](https://shopify.dev/docs/api/app-home/patterns/compositions/setup-guide), [Shopify onboarding](https://shopify.dev/docs/apps/design/user-experience/onboarding)
- Shopify announced (changelog 2026-09-15) a new admin look rolling out progressively, with Polaris 2.0 release candidate forthcoming. — [Shopify changelog](https://shopify.dev/changelog/prepare-your-app-for-the-shopify-admins-new-look.md)

#### Views and saved state (documented)
- Linear display options: list/board layout (Cmd/Ctrl+B), grouping, sub-grouping, ordering, show/hide empty groups, choosable display properties (fields per row); personal changes persist per view; "Set as default" saves for the whole workspace, "Reset to default" reverts. Named custom views are not described on that page. — [Linear display options](https://linear.app/docs/display-options)

### Inferences
Recommendations (not documented facts):
1. **Two-level nav.** Global (org) level: Events, People (participants/contacts), Money (payouts, refunds, fees), Messages, Reports, Team, Settings. Event level (after selecting an event): Overview, Registrations (orders + participants), Setup (race details, categories, pricing, waivers, extras), Comms, Check-in/Race day, Results/After, Settings. Keep labels as nouns, consistent with Stripe/Eventbrite.
2. **Phase as state, not menu.** Show an event phase chip (Setup, On sale, Race week, Race day, After) in the event header. Phase changes (a) the Overview module order, (b) which KPI set is default, (c) a prominent phase CTA ("Open Race day mode" from T-48h), and (d) the "needs attention" rules. Rationale: stable nav aids learning and muscle memory; phase-changing nav labels would break it. This is my synthesis; I found no source documenting phase-based nav.
3. **Shortcuts layer** (Stripe pattern): pinned + recent events/pages at the top of the sidebar; event switcher in the header with search.
4. **Command palette** (Cmd/Ctrl+K, plus `/` for search as in Linear): scopes with prefixes (e.g. `e` events, `p` participants, `o` orders, `b` bib number); exact-ID jump (order number, bib number, email); "recent" shown on open; actions ("Add comp registration", "Export participants", "Open check-in").
5. **Phase-aware Overview content:**
   - Setup: setup checklist (max ~5 top-level steps, auto-completing) leads; no KPIs until first sale.
   - On sale: registrations over time vs previous event/period, revenue, conversion, capacity fill by category; attention list (low capacity categories, pending refunds, failed payments, unanswered messages).
   - Race week: readiness checklist (waiver rate, unassigned bibs, volunteer slots unfilled, comms sent, transfers/deferrals pending), forecast of check-in load.
   - Race day: check-in progress and capacity, live feed, big "Open field mode" button.
   - After: results published, refunds/finance reconcile, survey/thanks email, export, clone event.
6. **Layout, 1366 px desktop:** left sidebar 232 px (collapsible to 56 px icon rail), content max ~1100 px; header 56 px with event switcher, phase chip, command-palette trigger, notifications bell, avatar. Overview: row 1 = phase banner/checklist or attention list (full width); row 2 = 4 KPI cards (each ~250 px) with time-range control right-aligned; row 3 = main chart (8/12 columns) + attention/activity column (4/12); row 4 = sales by category + capacity (two half-width cards). Everything above the fold at 1366x768 should be: header, phase banner, KPI row, start of main chart.
7. **Tablet (768-1024 px):** collapsed icon-rail nav; KPIs in a 2x2 grid; chart full width; attention list above the fold; tables become cards-or-condensed with fewer default columns.
8. **Phone (390 px):** bottom tab bar (Home, Registrations, Check-in, Messages, More) of 4-5 items; KPI cards in a horizontal scroll or 2-up grid; attention list first; tables become list rows with 2 lines (name + status) and swipe/overflow actions; event switcher as a sheet.
9. **Component list (React/Tailwind):** AppShell, Sidebar (collapsible, with Shortcuts), TopBar, EventSwitcher, PhaseChip, CommandPalette (e.g. built on cmdk or Radix Dialog + Combobox), GlobalSearch, KpiCard (value, delta, sparkline, tooltip, loading/empty/error variants), TimeRangePicker with comparison toggle, AttentionList, SetupChecklist (progress, dismiss, remind me later), ActivityFeed, ChartCard (with table toggle and text summary), DataTable (sticky header/first column, selection, bulk action bar, column picker, saved views, density toggle, inline edit cell), FilterBar, SavedViewsMenu, EmptyState, Skeleton, ErrorState/RetryBanner, OfflineBanner/SyncStatus, Toast with Undo, ConfirmDialog, Drawer/Sheet, Tabs, Badge/StatusPill, NotificationsCenter, HelpMenu/HelpPanel, Tooltip, Tour/Coachmark, KeyboardShortcutsDialog, RoleGate, FieldModeShell (large-target check-in UI), BottomTabBar, Stat/ProgressRing, Toggle/Switch, Avatar, Breadcrumbs.

### Gaps
- Luma host dashboard: help page fetch returned 404; I have no documented description of Luma's event-management tabs. Marked blocked/unverified.
- Notion: not researched (no fetch made within the call budget).
- Shopify Polaris index-table / admin Home pattern pages: polaris-react URL redirected to a generic docs page and was not followed; no documented admin Home composition beyond the App Home guidance above.
- Eventbrite's current organiser home layout and exact navigation labels: only search-result summaries, no verified page.
- Mobbin / Page Flows teardowns: not reached.
- Phase-based organiser navigation: no source found documenting it in any reference product.

## Key question 2: Which UX patterns raise usability the most for first-time organisers versus power users?

### Takeaway
First-timers benefit most from a short, auto-completing setup checklist, informative empty states with direct actions and sample/demo data, dismissible/deferrable guidance, and clear system status (skeletons/spinners by duration). Power users benefit most from keyboard shortcuts, a command palette, saved/shared views with configurable columns and display properties, bulk actions, and pinned/recent shortcuts.

### Cited Findings

#### Onboarding and empty states
- Shopify: break setup into discrete, auto-completing steps with a progress indicator; keep onboarding brief with clear instructions; make non-essential onboarding dismissible; offer "Remind me later" for complex setup; request information only when needed; limit onboarding to five steps or fewer; offer choices like start from template vs from scratch. — [Shopify onboarding guidance](https://shopify.dev/docs/apps/design/user-experience/onboarding)
- NN/g empty states: (1) communicate system status (avoid blank containers; avoid a premature "No records" flash that later fills in); (2) provide learning cues (e.g. "Star your favorites to list them here"); (3) provide direct pathways (a create button, a learn-more link, or load demo data, as Loggly does). — [NN/g empty states](https://www.nngroup.com/articles/empty-state-interface-design/)

#### Loading, speed and feedback
- Response-time limits: 0.1 s feels instantaneous; 1 s keeps flow of thought; 10 s is the attention limit. Over ~1 s show that the system is working; over ~10 s use percent-done progress with a way to interrupt; 2-10 s can use a busy indicator with a small counter. — [NN/g response times](https://www.nngroup.com/articles/response-times-3-important-limits/)
- Skeletons and spinners: not needed under 1 s; for 2-10 s spinners suit a single module such as a dashboard card, skeleton screens suit full-page loads; over 10 s use a progress bar; skeletons are for full-page loads, not uploads/downloads/conversions; avoid skeletons that show only header/footer frame. — [NN/g skeleton screens](https://www.nngroup.com/articles/skeleton-screens/)

#### Tables and power features
- Linear: per-user persistent view settings, workspace default, choose visible display properties (columns), grouping, ordering, show/hide empty groups; keyboard shortcuts for view layout (Cmd/Ctrl+B), display options (Shift+V), find in view (Cmd/Ctrl+F). — [Linear display options](https://linear.app/docs/display-options), [Linear search](https://linear.app/docs/search)
- Stripe: `?` shows keyboard shortcuts; Transactions can be filtered and exported; Reporting allows custom columns and filters. — [Stripe Dashboard basics](https://docs.stripe.com/dashboard/basics)
- WAI-ARIA APG grid: arrow key navigation, Home/End, Ctrl+Home/End, Page Up/Down, Enter/F2 to enter cell editing and Escape to exit, Shift+Space selects a row; use grid for editable/interactive data, static table otherwise. — [W3C APG grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)

#### Race-day specifics
- RunSignup: check-in app syncs every 30 s, works on spotty connections, supports scan and bib lookup, kiosk mode, and limited dashboard access for coordinators. — [RunSignup RaceDay CheckIn](https://info.runsignup.com/raceday-checkin-app/)

### Inferences
Recommendations (not documented facts):
- **First-run:** Setup checklist of 5 top-level steps (Race basics, Categories and pricing, Payments/payout, Waiver and policies, Publish). Auto-complete from data; "Preview as participant"; dismissible with "Remind me later". Offer "Load sample event" (clearly labelled sample data, bulk-deletable) so KPI cards, charts and tables are not empty on first view, adapting NN/g's demo-data pathway. Empty states always include a status sentence, a one-line learning cue and a primary action.
- **Progressive disclosure:** hide advanced settings (promo codes, transfer rules, add-ons, custom questions, team/volunteer roles) behind "Advanced" accordions until the relevant object exists; show phase-relevant modules only.
- **Optimistic updates and undo:** Use optimistic UI for low-risk, reversible actions (mark checked in, toggle, rename) with a toast offering Undo (about 8-10 s); use confirm dialogs only for irreversible or money-moving actions (refund, cancel event, delete). Not sourced; common industry practice.
- **Error states:** inline field errors, retry banners at card level so one failed widget does not break the page, and a global offline banner with queued-actions count; never show "No data" when the cause is an error (extends NN/g status guidance).
- **Power users:** command palette; `?` shortcut dialog; `g` then letter navigation; `j/k` row movement and `x` select in tables; saved views per table (personal, with "share with team"); column picker; density toggle (compact/default/comfortable); sticky header and first column; bulk action bar that appears on selection with count and "select all N matching"; inline edit for simple fields (bib, category, notes) via grid pattern; CSV export that honours current filters and columns.
- **Notifications centre, help and tours (unsourced beyond Stripe push mention):** bell with unread count, grouped by event, "needs action" vs "FYI", mark all read, deep links, email/push preferences per category; contextual help (tooltip on labels, "Learn more" in empty states), searchable help panel inside the app; 3-4 step tours triggered only on first visit to a major area and replayable from Help; avoid tours blocking tasks.
- **Role views:** Owner/admin sees everything incl. Money, payouts, team, settings; Staff sees Registrations, participants, comms, check-in, no payout/bank or role management; Volunteer sees only an assigned check-in/field-mode view (search, check in, bib handout, incident note), no PII beyond what is needed, no export. Documented support: Stripe roles, Eventbrite tiered report permissions, RunSignup limited dashboard access; the specific three-role matrix is my recommendation.
- **Field mode (race day), recommended:** full-screen mode with 56-64 px minimum touch targets (well above the 24 px WCAG minimum), 18-20 px base text, high-contrast theme (7:1 text target, my choice beyond AA), single-purpose screens (Scan, Search, Walk-up registration, Status), persistent sync indicator ("Synced 12 s ago" / "Offline - 14 queued"), local queue for offline check-ins, haptic/audio confirmation, sunlight-readable colours, no hover-only controls, and portrait phone and landscape tablet layouts.
- **Charts:** registrations over time = line/area with previous-period or previous-year overlay (dashed), cumulative toggle, annotations for promos/price tiers; sales by category = sorted horizontal bar (not pie); check-in progress = single progress bar/ring with count and rate in text plus a 5-15-minute interval column or sparkline (RunSignup uses five-minute intervals); capacity = bullet-style bar per category (sold, held, remaining vs cap) with waitlist marker. Always include a "View as table" toggle and numeric labels. Mostly design guidance; see the dataviz skill for palette rules.

### Gaps
- No documented benchmark data on which pattern most improves completion for first-time organisers; ranking above is judgement.
- Material Design and Apple HIG data-table/dashboard guidance, Notion onboarding/empty-state and sample-data patterns, and Linear's tours/in-app help were not fetched.
- Luma's own onboarding/empty states: blocked (404).
- Notification-centre and tooltip/tour guidance: no primary source collected.

## Key question 3: What are the accessibility and performance requirements, stated as testable criteria?

### Takeaway
WCAG 2.2 AA gives concrete, testable rules (24x24 CSS px targets, focus not fully obscured by sticky UI, text alternatives plus data tables for charts) and Core Web Vitals give numeric field thresholds (LCP at most 2.5 s, INP at most 200 ms, CLS at most 0.1 at p75). Perceived-speed budgets follow NN/g thresholds (0.1 / 1 / 10 s).

### Cited Findings
- WCAG 2.2 SC 2.5.8 Target Size (Minimum), AA: pointer targets at least 24x24 CSS px, unless spacing exception (24 px circle centred on each undersized target does not intersect another target), equivalent control exists, inline, user-agent control, or essential. — [W3C Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum), AA: a focused component must not be entirely hidden by author-created content; sticky headers/footers are the typical cause (failure F110); fix with CSS `scroll-padding` (technique C43); sticky notifications pass if modal or dismiss on blur; dimming overlays can still fail 1.4.11 Non-text Contrast for the focus indicator. — [W3C Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- WCAG SC 1.1.1 for charts: provide a short alternative that identifies the chart and points to a long description; the long description identifies chart type, summarises data, describes trends, and ideally includes the data in a table; colour-coded information must be in the text alternative (failure F13); mismatched descriptions fail (F67). — [W3C Understanding 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- ARIA APG: grid is for interactive/editable tabular data with a single tab stop and managed arrow-key focus; static table keeps every focusable element in tab order; set `aria-sort` on the sorted column header; Enter/F2 enters a cell, Escape returns to grid navigation. — [W3C APG grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- Core Web Vitals "good" thresholds at the 75th percentile, segmented by mobile and desktop: LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less. Lighthouse cannot measure INP (uses TBT as lab proxy); field data (RUM) is the authority. — [web.dev Web Vitals](https://web.dev/articles/vitals)
- Response time limits and loading indicator rules: see NN/g links under Key question 2. — [NN/g response times](https://www.nngroup.com/articles/response-times-3-important-limits/), [NN/g skeleton screens](https://www.nngroup.com/articles/skeleton-screens/)
- Stripe supports last 20 major versions of Chrome/Firefox/Edge and last 4 of Safari (an example of a published browser-support policy). — [Stripe Dashboard basics](https://docs.stripe.com/dashboard/basics)

### Inferences
Testable acceptance criteria (my proposals built on the cited rules):

**Accessibility (WCAG 2.2 AA)**
1. Automated: axe-core (or equivalent) reports 0 serious/critical violations on Overview, Registrations table, Check-in and Field mode, run in CI in light and dark themes. Automation catches only part of WCAG, so add manual checks below.
2. Keyboard: every task (switch event, search, filter, select rows, bulk action, edit cell, check in, export) completable with keyboard only; no keyboard trap; logical focus order matching visual order; skip-to-content link is first tab stop; focus visible on all controls.
3. Focus not obscured: with sticky header and bulk-action bar present, tabbing through a 100-row table never leaves the focused element entirely hidden (set `scroll-padding-top/bottom` to sticky heights).
4. Target size: all pointer targets at least 24x24 CSS px (AA); standard dashboard controls aim for 40 px+; Field mode at least 56 px (internal target).
5. Contrast: text at least 4.5:1 (3:1 for large text); UI components, focus rings and chart marks at least 3:1 against adjacent colours (WCAG 1.4.3/1.4.11, stated from standard knowledge, not fetched here); Field mode internal target 7:1.
6. Colour not sole signal: statuses and chart series carry text/icon/pattern in addition to colour (ties to F13 for chart alternatives).
7. Tables: real `<table>` with `<th scope>` and caption for read-only data; APG grid only where cells are editable; `aria-sort` on sorted header; row selection checkboxes labelled with row identity; bulk bar announces count via a polite live region.
8. Charts: each chart has a short accessible name, a text summary (type, range, trend, key numbers) and a "View as table" with the same data.
9. Reduced motion: with `prefers-reduced-motion: reduce`, no parallax/auto-animated charts or skeleton shimmer; transitions limited to opacity under about 150 ms.
10. Live updates (activity feed, check-in counts): polite live region, throttled (not more than once per few seconds), pausable.
11. Reflow/zoom: usable at 320 CSS px width and 200% zoom without two-dimensional scrolling except data tables; text spacing overrides do not break layout (WCAG 1.4.10/1.4.12, from standard knowledge, not fetched here).
12. Errors: form errors identified in text, linked to fields, focus moved to the first error; destructive actions have confirmation or undo.

**Performance and perceived speed**
1. Field p75 per device class (mobile/desktop): LCP at most 2.5 s, INP at most 200 ms, CLS at most 0.1, measured by RUM (web-vitals library), not Lighthouse alone; Lighthouse CI TBT budget as lab guard.
2. Interaction budgets: click/keypress visual feedback within 100 ms; table filter/sort/page results within 1 s p75 (with inline busy indicator after 1 s); route changes show skeleton if over 1 s, none if under; any operation over 10 s (exports, bulk emails, imports) becomes a background job with progress bar and notification on completion.
3. Overview first meaningful content (KPI skeletons replaced by data) within 2 s p75 on a mid-range phone on 4G; use per-card loading so one slow query does not block others.
4. Race-day: check-in lookup (scan or name search) returns in under 500 ms p75 from local cache; offline queue syncs without user action; sync status always visible. (Internal targets; RunSignup's 30 s sync is the documented comparator.)
5. CLS: reserve space for KPI cards, charts and tables (fixed skeleton dimensions); no layout shift when banners appear (overlay or reserved slot).
6. Payload: initial JS for the Overview route under an agreed budget (suggest 170 KB gzip, a common but unsourced heuristic); code-split charts, tables and editors; virtualise tables over about 200 rows; cursor pagination server-side.

### Gaps
- WCAG 1.4.3, 1.4.10, 1.4.11, 1.4.12, 2.5.7, 3.3.7, 3.3.8 and reduced-motion (2.3.3 is AAA; `prefers-reduced-motion` is a CSS media feature) were not fetched in this session; the contrast and reflow numbers above are from standard knowledge and should be verified before publishing.
- No Stripe/Shopify published performance budgets found; the budgets above are internal proposals.
- Material Design and Apple HIG dashboard/table guidance not reached; no usability-testing evidence on field-mode target sizes was found.
