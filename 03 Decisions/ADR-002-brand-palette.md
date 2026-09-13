---
id: ADR-002
type: decision
status: proposed
date: 2026-09-09
owners: [human, discovery-ui]
related: [GA-017, GA-018]
tags: [adr, design]
---

# ADR-002 Choose one brand palette

## Context

Three palettes coexist today, which is why nothing looks like one product:

| Where | Primary | Accent |
| --- | --- | --- |
| `chore/sync-from-monorepo` `globals.css` `@theme` (the live frontend) | **indigo `#2C3D8F`** | cyan `#37DAC3` |
| `main` `globals.css` `@theme` | orange `#f97316` | violet `#8b5cf6` |
| `MegaSearchBar.tsx` on the live branch | **Airbnb red `#FF385C`** | — |

`CLAUDE.md` §7 documented the orange pair, which is true on `main` and wrong on the branch actually
being developed. Separately, components bypass `@theme` entirely and hardcode `#141A3E`, `#2055DC`,
`#181427`, `#DBDBE7`, `#737582`, `#F6F6F9` — `#2055DC` and `#181427` are not tokens at all. So even
picking a palette does not by itself make the app consistent.

## Decision

*Pending — this is the question put to the owner.*

## Alternatives considered

- **Indigo `#2C3D8F` + cyan `#37DAC3` (recommended).** Already the live branch's declared theme, and
  it is what the current header/hero navy family (`#141A3E`) was built around. Retires the Airbnb red.
- **Orange `#f97316` + violet `#8b5cf6`.** The palette `CLAUDE.md` and the older `main` frontend use.
  Warmer and arguably more "endurance sport", but it clashes with the navy hero and would mean
  re-skinning the live branch's header, sliders and cards.
- **Keep Airbnb red `#FF385C`.** Maximum visual similarity to the search bar's reference. Two problems:
  it is a competitor's trade dress, and it fights the navy/cyan surroundings it currently sits in.

## What actually changes once this is decided

Concretely, for the recommended indigo option:

1. `MegaSearchBar.tsx` — the `ACCENT` / `ACCENT_HOVER` constants at the top of the file. Visible
   effect: the round Search button and its hover state, and the magnifier icon on the mobile pill.
   The calendar's selected day and range endpoints use ink `#222222`, not the accent, so they do not
   change. This is a **two-line edit** because the colour was deliberately isolated into constants.
2. `globals.css` — no change; indigo/cyan are already the declared tokens.
3. `EventRow.tsx:23-27` — the sport-colour ternary currently hardcodes `#37DAC3` for running and
   `#2055DC` for cycling and dumps everything else into `bg-slate-800`. Replace with a defined
   five-sport scale derived from the chosen palette (running, cycling, triathlon, swimming, trekking),
   paired with an icon so meaning is never carried by colour alone.
4. `SectionSlider.tsx`, `CategoryGrid.tsx`, `layout.tsx`, `locations/[city]`, `sports/[sport]` — route
   the hardcoded hex literals through `@theme` tokens. Mechanical but wide, so serialise it
   (`globals.css` is a serial resource per `CLAUDE.md` §10).
5. `CLAUDE.md` §7 — already corrected to name all three; collapse to the single chosen pair once decided.

Whichever is chosen, the second half — routing hardcoded hex through tokens and defining the sport
scale — is the part that actually makes the product look coherent. Picking a palette without doing
that changes very little.

## Consequences

- Positive: one palette makes a rebrand a `globals.css` edit rather than a grep-and-replace.
- Cost/risk: contrast must be re-checked. Indigo `#2C3D8F` on white passes comfortably for text;
  cyan `#37DAC3` does **not** pass WCAG AA as text on white and must be used for fills/accents only.
- Cost/risk: the transparent header sits over arbitrary hero photography, so its contrast depends on
  the image, not the palette. That is a separate fix regardless of this decision.
