---
type: note
status: draft
tags: [research, design, tools]
task: GA-045
date: 2026-10-17
---

# Design skills and tools landscape

Answers the owner's question for [[04 Delivery/GA-045-design-skills-market-research|GA-045]]: apart from Anthropic's design skills, what are the best skills and tools on the market for designing the best website?

Researched 2026-10-17 with web search and direct page fetches. Star counts are what GitHub showed on that date. **Snippet-only** means the claim comes from search-result summaries or third-party pages because the corporate proxy blocked the primary page, or because no primary page was found. Prices change often: check the vendor page before buying.

## Summary: top 3 to adopt now

| # | Adopt | Why it fits GoAthletix | Cost / licence |
| --- | --- | --- | --- |
| 1 | **Impeccable** (pbakaus/impeccable) Claude Code plugin | It builds on Anthropic's frontend-design. It adds 24 commands (`critique`, `audit`, `polish`, `typeset`, `colorize`, `adapt`, `animate`...) and 59 deterministic detector rules for generic "AI-made" UI patterns. That fits our known problems: three accent palettes coexist and many hex values are hardcoded. It runs inside Claude Code against our own Next.js code, so we don't end up with a second codebase. | Free, Apache-2.0, 82.2k stars [1] |
| 2 | **shadcn/ui + the official shadcn skill** | Accessible primitives (Radix or Base UI) with Tailwind v4 theming. They cover the controls we hand-build today: search dropdowns, calendar, drawers and dialogs. The skill reads `components.json` and follows shadcn composition rules, so Claude writes code that matches our project. | Free, MIT, 125.8k stars [2][3] |
| 3 | **Vercel agent-skills** (`web-design-guidelines` + `react-best-practices`) | A review gate written for Next.js and React: 100+ UI rules (accessibility, focus, forms, touch, typography, dark mode) and 40+ performance rules. Use it as a check before merge, next to `design:accessibility-review`. | Free, MIT, 32.5k stars [4] |

Not recommended now:
- **Builders that produce their own hosted site or codebase** (Framer, Webflow, Lovable, Bolt). We already own a Next.js 16 codebase, and Framer has no code export [17]. Use v0 or Google Stitch only to explore layout ideas, then rebuild the result in our repo.
- **Stacking several "design direction" skills** (frontend-design + Impeccable + UI UX Pro Max). They overlap and can give conflicting direction. Pick one. Impeccable is the choice because it extends frontend-design and does not replace it.

Caveat: no skill settles the open palette decision (orange on `main`, indigo/cyan on `chore/sync-from-monorepo`, `#FF385C` in `MegaSearchBar`). That still needs an ADR. After the ADR, a skill such as `design:design-system` or Impeccable's `document`/`extract` commands can enforce the chosen tokens.

Installing any of the three changes either `.claude/` settings or `package.json`/`globals.css`, which are serial-only resources. Each needs its own GA task note first (CLAUDE.md §10).

---

## A. Claude Code / agent skills for UI and web design

### A1. Anthropic's own (baseline, already installed here)

| Skill | Publisher | What it does | Licence | Adoption / source |
| --- | --- | --- | --- | --- |
| frontend-design | Anthropic (anthropics/skills, also a plugin in anthropics/claude-code) | Distinctive, production-grade frontend UI that avoids generic AI aesthetics: bold typography, motion, detail | Apache-2.0 for most skills in the repo (the document skills are source-available) | anthropics/skills shows 181.7k stars [5]. Listed as the frontend plugin in the claude-code plugins directory [6] |
| canvas-design, theme-factory, web-artifacts-builder, brand-guidelines | Anthropic (anthropics/skills) | Posters/visual art as PNG/PDF; colour and font themes; React + Tailwind + shadcn artifacts; Anthropic brand styling | Apache-2.0 | Listed in [7] and [8]. The skill descriptions on the repo page itself were not shown, so these come from the curated lists |
| design plugin: design-critique, design-system, accessibility-review, ux-copy, design-handoff, user-research, research-synthesis | Anthropic (anthropics/knowledge-work-plugins, `design/` folder) | Critique, token/system audits, WCAG 2.1 AA review, microcopy, dev handoff specs, research planning and synthesis | Apache-2.0 (repo) | Repo 29.9k stars. The `design/` folder exists but is not in the README's plugin table [9] |

### A2. Community and vendor skills (most notable first)

| Name | Publisher | Link | What it does | Licence | Adoption | Fit for us |
| --- | --- | --- | --- | --- | --- | --- |
| **Impeccable** | Paul Bakaus (pbakaus) | https://github.com/pbakaus/impeccable | "Design language" for agent harnesses. 1 skill, 24 commands, live browser iteration, 59 deterministic detector rules (CLI and browser extension, no LLM needed). Install with `/plugin marketplace add pbakaus/impeccable` or `npx impeccable install --providers=claude`, which **also installs a Claude Code design hook** (review it before installing) | Apache-2.0 | 82.2k stars [1] | **High.** Extends frontend-design |
| **UI UX Pro Max** | nextlevelbuilder | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | Design-intelligence catalog: design-system generator, styles, palettes, font pairings, UX guidelines, stack-specific rules. Claude Code marketplace install | MIT | 136.7k stars [10]. Catalog counts differ between sources (snippet-only) [11] | Medium. Strong catalog, but described as a catalog rather than reasoning [11]. It overlaps Impeccable/frontend-design, so use one |
| **shadcn skill** (official) | shadcn | https://ui.shadcn.com/docs/skills | Project-aware shadcn/ui context: reads `components.json`, runs `shadcn info`, supports Tailwind v3 and v4, Radix / Base / Aria bases. `npx skills add shadcn/ui` | MIT (shadcn/ui) | Part of shadcn/ui, 125.8k stars [2][3] | **High** once shadcn is adopted |
| **Vercel agent-skills** | Vercel Labs | https://github.com/vercel-labs/agent-skills | `web-design-guidelines` (100+ UI rules), `react-best-practices` (40+ perf rules), `composition-patterns`, `react-view-transitions`, plus Vercel deploy/optimise skills | MIT | 32.5k stars [4] | **High** as a review gate |
| **Web Quality Skills** | Addy Osmani | https://github.com/addyosmani/web-quality-skills | Lighthouse / Core Web Vitals skills: audit, performance, CWV, accessibility, SEO, best practices | MIT | 3.0k stars [12] | Medium-high. SEO and CWV matter for event pages |
| **Stitch skills** | Google Labs | https://github.com/google-labs-code/stitch-skills | `design-md` (DESIGN.md from Stitch), `react-components` (Stitch screen to React), `shadcn-ui`, `stitch-loop` (multi-page site from a prompt) | Apache-2.0 | 8.5k stars [13] | Medium, only if we use Stitch for exploration |
| **Figma MCP server + Figma skills** | Figma | https://help.figma.com/hc/en-us/articles/32132100833559 | Remote MCP (`mcp.figma.com/mcp`) supported in Claude Code: design context, Code Connect, write-to-canvas (beta). Figma skills package workflows but "don't add capabilities" | Proprietary service | Figma Help Center [14] | Only if we start designing in Figma. Remote server is on Starter and above. Desktop server needs a Dev/Full seat on a paid plan [14] |
| Microsoft `frontend-design-review`, `frontend-ui-dark-ts` | Microsoft | via [8] | Frontend review / dark-theme React + Tailwind | not verified | Listed in VoltAgent index [8] | Low. Not opened directly (unverified) |
| Vercel UI Skills; Frontend Design Pro | ihlamury; binjuhor | claudemarketplaces.com listings [15] | Vercel-style constraints; configurable anti-generic design toolkit | not verified | ~44 and ~87 stars per directory (snippet-only) [15] | Low |
| awesome-claude-design (DESIGN.md collection) | rohitg00 | via [11] | 28+ DESIGN.md files in 9 aesthetic families | not verified | 704 stars per a German guide (snippet-only) [11] | Low-medium, a source of inspiration |

### A3. Where to find more (marketplaces and indexes)

| Source | What it is | Notes |
| --- | --- | --- |
| `claude-plugins-official` | Anthropic's official marketplace, added automatically. Browse at claude.com/marketplace | Auto-update on by default. Community and third-party marketplaces are off by default [16] |
| `/plugin marketplace add owner/repo` | Any GitHub repo with `.claude-plugin/marketplace.json` is a marketplace (how Impeccable and UI UX Pro Max ship) | Review hooks and MCP servers before installing; see plugin security docs [16] |
| ComposioHQ/awesome-claude-skills | Curated list, 77.3k stars, Apache-2.0 | Lists anydesign (image/URL/Figma to design.md) and others [7] |
| VoltAgent/awesome-agent-skills | Index of 1,497+ skills across agents, 35.9k stars, MIT | Groups vendor skills by publisher (Anthropic, Microsoft, Google Labs, OpenAI/Figma, Cloudflare `web-perf`) [8] |
| skills.sh, claudemarketplaces.com | Third-party registries with install counts | skills.sh **blocked by the proxy**. claudemarketplaces.com says it is not affiliated with Anthropic [15] |

---

## B. AI design and build tools on the market

Most vendor pricing pages (v0, Lovable, Bolt) are **blocked by the proxy**. Those prices are snippet-only from third-party guides that disagree with each other.

| Tool | Best at | Pricing tier (USD/month) | Fit for GoAthletix |
| --- | --- | --- | --- |
| **v0** (Vercel) | Prompt to React/Next.js + Tailwind + shadcn UI | Free (~$5 credits); Team $30/user; Business $100/user. Sources conflict on whether the $20 Premium plan is still sold (snippet-only) [18] | **Good for exploration.** Same stack as ours, so it is the easiest to port. Copy components into our repo by hand |
| **Lovable** | Full-stack apps with Supabase and two-way GitHub sync | Free; Pro ~$25; Business ~$50; credit-metered (snippet-only) [19] | Low. Generates its own app. Overlaps our NestJS + Supabase architecture |
| **Bolt.new** | In-browser full-stack prototyping | Free 1M tokens; Pro $25 (10M tokens); Teams $30/member (snippet-only) [20] | Low. Same reason as Lovable |
| **Figma (Figma AI, Figma Make)** | Design canvas, prototyping, Make prompt-to-app, Dev Mode + MCP | Starter free (AI credits capped); Professional $16 Full / $12 Dev seat; Organization $55 Full (annual). Make comes with Full seats [21] | Medium. Worth it if a designer joins. Pairs with the Figma MCP in Claude Code [14] |
| **Google Stitch** | Prompt to UI screens, paste to Figma, HTML/CSS export | Free (Google Labs), may change. Export formats unclear across sources (snippet-only) [22] | Good for free exploration. Stitch skills can turn screens into React [13] |
| **Framer (AI)** | Marketing sites with AI generation and hosting | Free; Basic ~$10; Pro ~$30; Scale $100 (annual). **No code export** (snippet-only) [17] | Not a fit for the product. Could suit a separate marketing site |
| **Webflow (AI)** | Visual CMS sites, AI bundled | Free Starter; site plans ~$14-$39 (annual); figures vary (snippet-only) [23] | Not a fit for the product. Code export only on paid workspace tiers [17] |
| **Relume** | AI sitemap to wireframe from real components; exports to Figma, Webflow, React | Free tier; paid roughly $18-$58 depending on source and billing (snippet-only) [24] | Medium-low. Useful for information-architecture and page-structure planning. Has a Relume Library MCP [24] |
| **Uizard** (by Miro) | Fast wireframes/mockups (Autodesigner) for non-designers | Free; Pro $12 annual / $19 monthly; Business $39 (snippet-only) [25] | Low. Mockups only |
| **Builder.io (Fusion, Visual Copilot)** | Figma/prompt to code in an existing repo, visual editing | Free tier; Pro ~$24-30/user; Team ~$40-50; credit-metered (snippet-only) [26] | Medium. Works against existing repos, but costs are hard to predict |

---

## C. Design-system, component and motion sources

| Source | What it is | Licence | Adoption | Fit / notes |
| --- | --- | --- | --- | --- |
| **shadcn/ui** | Copy-in components built on headless primitives and Tailwind | MIT | 125.8k stars [2] | **Adopt** (see summary). Tailwind v4 supported by its skill [3] |
| **Radix Primitives** | Unstyled accessible React primitives (maintained by WorkOS) | MIT | 19.4k stars [27] | Comes with shadcn |
| **Base UI** | Unstyled components from the Radix / Floating UI / MUI creators. v1.0 Dec 2025, 35 components | MIT (not verified on the repo page) | Snippet-only [28] | Alternative base for shadcn (`base`) [3] |
| **Headless UI** | Unstyled accessible components from Tailwind Labs | MIT | 28.8k stars [29] | Fine, but fewer components than Radix. Pick one primitive layer |
| **Magic UI** | Animated copy-paste components (Tailwind, motion, shadcn per repo topics) | MIT | 22.7k stars [30] | Good for hero, ticker and marquee effects |
| **Aceternity UI** | Animated components; free set plus Pro ($199 lifetime per its brand page) | Pro licence allows end products. **Free-component licence not clearly stated** [31][32] | Snippet-only pricing [32] | Use with care. Check each item's terms |
| **Motion** (formerly framer-motion) | React/JS animation library; `framer-motion` renamed to `motion` (`motion/react`) | MIT core. Motion+ is paid (examples, premium APIs) [33] | 34.2k stars [33] | **Already installed** as `framer-motion`. Moving to the `motion` package is a separate `package.json` task |
| **GSAP** | Timeline/scroll animation incl. ScrollTrigger, SplitText | Standard "No Charge" licence: free commercially incl. all plugins. Not usable in no-code animation tools that compete with Webflow [34] | n/a | **Already installed**. Fine for our use |
| **Lottie (lottie-web)** | Plays After Effects JSON animations | MIT | 32.2k stars [35] | Good for lightweight illustrative animations (empty states, success) |
| **Rive** | Interactive state-machine animations; open-source runtimes | Runtimes MIT. Editor free, but exporting needs a paid plan since 20 Oct 2025 (Cadet $9/seat) [36] | n/a | Optional, for interactive mascots or medal animations |

---

## Sources

1. https://github.com/pbakaus/impeccable
2. https://github.com/shadcn-ui/ui
3. https://ui.shadcn.com/docs/skills.md
4. https://github.com/vercel-labs/agent-skills
5. https://github.com/anthropics/skills
6. https://github.com/anthropics/claude-code/tree/main/plugins
7. https://github.com/ComposioHQ/awesome-claude-skills
8. https://github.com/VoltAgent/awesome-agent-skills
9. https://github.com/anthropics/knowledge-work-plugins
10. https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
11. https://pasqualepillitteri.it/de/news/579/claude-code-skills-design-uiux-leitfaden ; https://www.mintlify.com/nextlevelbuilder/ui-ux-pro-max-skill/guides/cli-commands (snippet-only)
12. https://github.com/addyosmani/web-quality-skills
13. https://github.com/google-labs-code/stitch-skills
14. https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server
15. https://claudemarketplaces.com/skills/ihlamury/design-skills/vercel-ui-skills ; https://claudemarketplaces.com/skills/binjuhor/shadcn-lar/frontend-design-pro (snippet-only)
16. https://code.claude.com/docs/en/discover-plugins
17. https://siter.io/framer-vs-webflow ; https://vp0.com/blogs/framer-pricing-plans-2026/ (snippet-only)
18. https://automationatlas.io/answers/v0-pricing-explained-2026/ ; https://uibakery.io/blog/vercel-v0-pricing-explained-what-you-get-and-how-it-compares (snippet-only; v0.app blocked)
19. https://eesel.ai/blog/lovable-pricing ; https://automationatlas.io/answers/lovable-pricing-explained-2026/ (snippet-only; lovable.dev blocked)
20. https://automationatlas.io/answers/bolt-new-pricing-explained-2026/ ; https://www.jetadmin.io/blog/bolt-new-pricing-plans-tokens-and-real-costs-in-2026/ (snippet-only; bolt.new blocked)
21. https://www.figma.com/pricing/
22. https://www.banani.co/blog/google-stitch-ai-review ; https://www.mindstudio.ai/blog/what-is-google-stitch-ai-design-tool (snippet-only)
23. https://www.flowninja.com/blog/webflow-pricing-demystified ; https://vp0.com/blogs/webflow-pricing-plans-2026/ (snippet-only)
24. https://uxmagic.ai/blog/relume-review-2026 ; https://toolquestor.com/tool/relume ; https://aitoolsatlas.ai/tools/relume/pricing (snippet-only)
25. https://uxmagic.ai/blog/uizard-review-2026 ; https://aitoolsatlas.ai/tools/uizard/pricing (snippet-only)
26. https://pricingsaas.com/companies/builder ; https://vibecoding.app/blog/builder-io-review (snippet-only)
27. https://github.com/radix-ui/primitives
28. https://infoq.com/news/2026/02/baseui-v1-accessible/ ; https://mui.com/blog/2026-and-beyond/ (snippet-only)
29. https://github.com/tailwindlabs/headlessui
30. https://github.com/magicuidesign/magicui
31. https://ui.aceternity.com/licence
32. https://ui.aceternity.com/brand-facts ; https://toolradar.com/tools/aceternity-ui (snippet-only)
33. https://github.com/motiondivision/motion
34. https://gsap.com/licensing/
35. https://github.com/airbnb/lottie-web
36. https://rive.app/blog/rive-s-new-9-mo-plan ; https://www.itechguides.com/directory/animation-software/rive/ (tier prices snippet-only)

## Not verified

- skills.sh, v0.app, lovable.dev and bolt.new were blocked by the corporate proxy (Forcepoint block page). Their prices and install counts are snippet-only.
- The Anthropic design plugin's exact skill list was not shown on the knowledge-work-plugins README. The list above is what is installed in this environment.
- Base UI licence, Microsoft skill licences, and the community skill star counts in A2 that are marked snippet-only.
- The Aceternity free-component licence.
- None of the skills were installed or tested. Their quality claims are the publishers' own.
