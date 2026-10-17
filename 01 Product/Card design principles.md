---
type: note
status: active
tags: [design, cards, typography]
---

# Card design principles

Owner feedback (2026-10-17): "the font size in cards of different sections are not unique and well maintained; follow a
design principle for all cards." Before this note every card family had its own sizes (event card 18 / 14 / 12.5, club card
14 / 12.5, guide card 18 / 12, city card 22 / 32, organiser 16.5 / 13...). The system below replaces that.

Implementation: `goathletix-frontend/src/app/card-tokens.css` (tokens plus `.cd-*` role classes), loaded after `globals.css`.

## 1. Five text roles, nothing else

| Role | Use | Size / weight | Font |
| --- | --- | --- | --- |
| eyebrow | type, category, sport label | 12 / 700, tracked, uppercase | Roboto Condensed |
| title | the one thing the card is about | 18 / 700 | Outfit |
| body | the main facts: date, place, names, price line | 14 / 500 | Outfit |
| meta | second lines, captions, counts | 13 / 400, muted | Outfit |
| chip | pills and tags | 12 / 600 | Outfit |

Plus two numeric roles: `stat` (one big number per card at most, 24 / 800) and `cta` (button label, 14.5 / 700).
Minimum text size anywhere on a card is 12 px. Weights are limited to 400, 500, 600, 700, 800.

## 2. Hierarchy rules

1. One title per card. Everything else is body or meta.
2. At most one stat number per card; it must be the thing the visitor compares (events, price).
3. Icons carry meaning, not decoration: 16 px inline with text, 20 px as row leaders and actions, one large glyph (72 px,
   bare, no coloured disc) where a card is about a sport or product.
4. Second lines are always `meta`: same size and colour on every card.
5. Never show a field with no data and never invent one. Empty fields are omitted.

## 3. Spacing and shape

Card padding 16 px, gap 12 px, radius 20 px (`--radius`), one shadow token. Sections inside a card that repeat across
cards (chips row, when/where block, price row) have fixed heights so neighbouring cards line up.

## 4. Motion

Hover = one transform-only lift (`--cd-lift`, 280 ms, `--cd-ease`), image zoom 6 percent at most inside an
`overflow: hidden` frame. No transitions on layout properties, no `transition: all`. Sport glyphs do not animate (owner
decision, 2026-10-17). Decorative entrance motion is allowed once per card on first view.

## 5. Where it applies

Event card, featured thumbnails, club and academy card, guide card, organiser card, gear card, sport tile, city card.
New cards must use the role classes or tokens; a PR adding a new font size to a card is a design-review item.
