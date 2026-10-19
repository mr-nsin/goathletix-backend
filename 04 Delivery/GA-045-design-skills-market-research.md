---
id: GA-045
type: task
status: ready
priority: P2
owner: research
branch: none (documentation only)
worktree: none
scope: [goathletix-backend/01 Product/Design skills and tools landscape.md]
acceptance: []
depends_on: []
related: []
---

# GA-045 Besides Anthropic's design skills, what are the best skills and tools on the market for designing websites?

## Goal

Owner question: "Apart from Anthropic's best design skills, what are the best skills available in the market to design the best website?"
Produce a sourced, decision-ready answer.

## Scope

- Owned: one new note `goathletix-backend/01 Product/Design skills and tools landscape.md`. No code, no installs, no git.

## Acceptance criteria

- [ ] Section A, Claude Code / agent skills: Anthropic's own (frontend-design and the design plugin skills present here:
      design-critique, design-system, accessibility-review, ux-copy, design-handoff, user-research, research-synthesis) and the most-used
      community or vendor skills and plugin marketplaces for UI/web design (search for real ones; give name, publisher, link, what it
      does, licence, and any sign of adoption such as stars). Flag anything you could not verify.
- [ ] Section B, AI design and build tools on the market (for example v0, Lovable, Bolt, Figma Make / Figma AI, Framer AI, Webflow AI,
      Relume, Uizard, Galileo/Stitch, Builder.io): what each is best at, pricing tier, and how it would fit GoAthletix (Next.js 16,
      Tailwind v4, our own code base).
- [ ] Section C, design-system and component sources worth adopting (for example shadcn/ui, Radix, Headless UI, Aceternity, Magic UI,
      Motion (framer-motion), GSAP, Lottie, Rive) with licences.
- [ ] A short recommendation: top 3 to adopt now for this project, and why.
- [ ] Every claim cites a URL; mark snippet-only claims; do not invent repositories or numbers.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Sources checked | done 2026-10-17: 36 numbered source entries cited | [[01 Product/Design skills and tools landscape]] Sources section |
| Primary pages fetched directly | 20 (GitHub repos, ui.shadcn.com, figma.com pricing, Figma help, gsap.com, code.claude.com, ui.aceternity.com) | WebFetch |
| Blocked by proxy | skills.sh, v0.app, lovable.dev, bolt.new; claims marked snippet-only | Forcepoint redirect to blockpage |
| Skills installed or tested | not run (out of scope) | - |

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
