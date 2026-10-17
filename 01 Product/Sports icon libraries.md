---
type: note
status: draft
tags: [design, icons]
related: [GA-027, GA-024]
---

# Sports icon libraries

Task: [[04 Delivery/GA-027-sports-icon-libraries-research|GA-027]]. Question: which icon libraries are best for sports icons, given colourful, consistent, professional glyphs on white cards, in a commercial product.

Method: every name below was returned by the Iconify API (`/search`, `/<prefix>.json?icons=`, `/collections`) from Node on 2026-10-16/17. Licences are the Iconify collection metadata, not read from upstream repos. "Probe count" is my keyword search (run, cycle, bike, swim, skate, gymnast, karate, judo, martial, tennis, badminton, climb, hik, trek, kayak, surf, weight, javelin, hurdle, medal, trophy, sport, boxing, rowing, ski, yoga, etc.) with skin-tone/weight variants collapsed and obvious false hits (cyclone, passport, railway-track) removed by a regex, so treat it as +/- 20%, not an exact inventory.

## Library comparison

| Library | Iconify prefix | Style | Probe count | Licence (attribution?) | Bundling |
| --- | --- | --- | --- | --- | --- |
| Fluent Emoji Flat | `fluent-emoji-flat` | Colour, flat | 29 | MIT (keep copyright + licence text) | Inline SVG, already bundled |
| Fluent Emoji (colour, 3145 icons in the sibling `fluent-emoji`) | `fluent-emoji` | Colour (style not inspected) | not probed | MIT | Inline SVG |
| Noto Emoji | `noto` | Colour | 43 | Apache-2.0 (licence text + NOTICE, mark changes) | Inline SVG |
| Noto Emoji v1 | `noto-v1` | Colour, older art | 33 | Apache-2.0 | Inline SVG |
| Twemoji | `twemoji` | Colour, flat | 43 | CC BY 4.0 (attribution required) | Inline SVG |
| OpenMoji | `openmoji` | Colour, outlined | 44 | CC BY-SA 4.0 (attribution + share-alike on adaptations) | Inline SVG |
| Phosphor | `ph` | Line/duotone, 6 weights | 12 | MIT | Inline SVG |
| Lucide | `lucide` | Line | 8 | ISC (keep notice) | Already a dependency (lucide-react) |
| Tabler | `tabler` | Line | 29 | MIT | Inline SVG |
| Material Symbols | `material-symbols` | Glyph, outline/rounded/sharp | 56 | Apache-2.0 | Inline SVG |
| Material Design Icons | `mdi` | Glyph | 55 | Apache-2.0 | Inline SVG |
| game-icons.net | `game-icons` | Glyph (dark silhouette) | 44 | CC BY 3.0 (attribution required) | Inline SVG |
| Healthicons | `healthicons` | Line + filled | 10 | MIT | Inline SVG |
| Font Awesome 6 Solid (free) | `fa6-solid` | Glyph | 11 | CC BY 4.0 (attribution required; Iconify carries icons only, fonts are a separate licence) | Inline SVG |
| Streamline Ultimate Color (998 icons) | `streamline-ultimate-color` | Colour, flat-fill with outline | 21 | CC BY 4.0 (attribution required) | Inline SVG |
| IconMind (31,722 icons) | `iconmind` | Duotone/outline, 6 variants per glyph | 87 (incl. variants of ~15 glyphs) | MIT | Inline SVG |
| Pinhead Map Icons | `pinhead` | Line/glyph, map-style | 93 | CC0 | Inline SVG |
| IconPark | `icon-park` | Colour-capable, 4 themes | 32 | Apache-2.0 | Inline SVG |
| Emoji One | `emojione` | Colour | 33 | CC BY 4.0 | Inline SVG |
| Other Iconify colour sets probed | `fluent-color`, `streamline-color`, `streamline-plump-color`, `streamline-flex-color`, `streamline-freehand-color`, `streamline-cyber-color`, `streamline-emojis`, `flat-color-icons` | Colour | 1 to 9 each | CC BY 4.0 (Streamline), MIT (Fluent Color, Flat Color Icons) | Not useful for sport coverage |

Dedicated "sports" Iconify sets: none surfaced. The sport coverage lives inside general sets (IconMind, Streamline Ultimate, Pinhead, Material Symbols, MDI).

## Coverage grid

Y = a glyph by that name came back from the API. Names in backticks are exact.

| Sport / discipline | Fluent Emoji Flat (colour) | Streamline Ultimate Color (colour) | Other sets |
| --- | --- | --- | --- |
| Athletics | `sports-medal`, `person-running`; no track glyph | `athletics-running-1`, `athletics-team-running`, `athletics-javelin-throwing` | IconMind has `javelin`, `hurdles`, `running` |
| Running | `person-running` | `athletics-running-1` | ph `person-simple-run`, tabler `run`, mdi `run-fast` |
| Cycling | `person-biking`, `bicycle`, `person-mountain-biking` | `bicycle`, `fitness-bicycle-1` | lucide `bike`, ph `person-simple-bike`, mdi `bike`, IconMind `cycling` |
| Triathlon | none | none | none in any probed set (search returned 0 for "triathlon") |
| Fitness | `person-lifting-weights`, `flexed-biceps` | `fitness-shaker`, `fitness-jumping-rope` | lucide `dumbbell`, ph `barbell`, tabler `dumbbell` |
| Racquet sports | `badminton`, `tennis` | none | mdi `badminton`, `tennis`, `table-tennis`; material-symbols `sports-tennis`, `badminton`; game-icons `tennis-racket` |
| Trekking | `hiking-boot`, `mountain`, `compass` | none | tabler `trekking`, ph `person-simple-hike`, mdi `hiking`, fa6 `person-hiking` |
| Water sports | `person-swimming`, `person-surfing`, `person-rowing-boat`, `canoe`, `sailboat` | `swimming-diving` | mdi `kayaking`, `surfing`; lucide/tabler `kayak` |
| Adventure | `parachute`, `person-climbing`, `mountain` | none | mdi `parachute`, tabler `parachute`, ph `parachute` |
| Skating | `ice-skate`, `roller-skate`, `skateboard` | `skating-1`, `skateboard-person` | tabler `ice-skating`, `roller-skating`, `skateboarding` |
| Gymnastics | `person-cartwheeling` (nearest) | `gymnastics-acrobatic-1`, `gymnastics-ribbon-person-2` | tabler/mdi `gymnastics`, material-symbols `sports-gymnastics` |
| Martial arts | `martial-arts-uniform`, `boxing-glove`, `person-fencing` | `martial-arts-helmet`, `martial-arts-swords`, `boxing-head-guard` | tabler/mdi `karate`, mdi `martial-arts`, material-symbols `sports-martial-arts` |
| Javelin | none (not in any emoji set) | `athletics-javelin-throwing` | IconMind `javelin-*`, iconoven `javelin` |
| Hurdles | none (OpenMoji has only `horse-jumping-hurdle`, a horse) | none | IconMind `hurdles-*`; pinhead `person-leaping-over-hurdle` (CC0, line) |
| Badminton | `badminton` | none | mdi `badminton`, IconMind `badminton-*`, pinhead `badminton-racket-and-shuttlecock` |
| Swimming | `person-swimming` | `swimming-diving` | ph `person-simple-swim`, tabler `swimming`, IconMind `swimming-*` |
| Karate | `martial-arts-uniform` | none | tabler `karate`, mdi `karate`, iconoven `karate-belt` |
| Rock climbing | `person-climbing` | none | mdi `rock-climbing`, game-icons `mountain-climbing`, pinhead `person-climbing-with-climbing-rope` |
| Judo | none (search returned 0 in all sets) | none | use the martial-arts-uniform glyph |

Honest gaps: triathlon, judo, and coloured javelin/hurdles. Colour emoji sets (Fluent, Noto, Twemoji, OpenMoji, Emoji One) all share the same Unicode-driven gaps: no gymnastics, karate, javelin, hurdles, triathlon, kayak, or trekking glyph.

## Recommendation

Primary: keep Fluent Emoji Flat (MIT). It is already bundled, is the most consistent flat colour set, has a glyph for 11 of the 12 categories (gymnastics via `person-cartwheeling` and martial arts via `martial-arts-uniform` are nearest matches, athletics is only `sports-medal`/`person-running`), and sits well on white. Triathlon has no glyph in any probed set: compose swim + bike + run or make a custom tile. Treat Noto Emoji (Apache-2.0) as a style-matched substitute only where a single glyph looks wrong, not as a mixed-in second set.

Fallback for gaps: Streamline Ultimate Color (CC BY 4.0, colour) for javelin and gymnastics. For hurdles, there is no colour option; IconMind `hurdles-duotone-regular` (MIT, duotone) or Pinhead `person-leaping-over-hurdle` (CC0) are the only candidates. Do not mix a line/duotone glyph into a flat-colour grid without restyling; render those few on a coloured tile instead. Lucide stays for UI controls only.

Licence obligations (exact):

| Set | Obligation |
| --- | --- |
| Fluent Emoji Flat (MIT) | Ship the Microsoft copyright notice and MIT text with the app (credits page or LICENSES file). No attribution on the tile itself. |
| Noto Emoji (Apache-2.0) | Include the Apache-2.0 text and any NOTICE file, and mark files you modified. |
| Streamline Ultimate Color (CC BY 4.0) | Attribution required: credit Streamline, link the licence, say if the SVGs were changed. Commercial use is allowed. A visible credits page entry satisfies this. |
| Twemoji, Emoji One (CC BY 4.0) | Same attribution rule as above. |
| OpenMoji (CC BY-SA 4.0) | Attribution plus share-alike on adapted icons. Avoid unless unmodified, because recolouring or editing triggers share-alike. |
| game-icons.net (CC BY 3.0) | Attribution required per author. Dark silhouettes, poor fit for white cards; not recommended. |
| IconMind (MIT), Pinhead (CC0), Material Symbols/MDI/IconPark (Apache-2.0), Tabler/Phosphor/Healthicons (MIT), Lucide (ISC) | Keep notice (MIT, ISC, Apache-2.0); CC0 needs none. |

No probed set forbids commercial use. Every Streamline, Twemoji, Emoji One, Font Awesome and game-icons item needs attribution, and OpenMoji adds share-alike.

## How to bundle

Pick the exact icons, fetch them once with `/<prefix>.json?icons=a,b,c`, commit the returned JSON subset (body, width, height per icon) into the frontend, and render with a small component that inlines the `body` into an `<svg viewBox>`. No runtime call to api.iconify.design, no icon font, no `@iconify/react` runtime fetch; the list of used glyphs is a fixed 12-category map. Add one credits entry per licensed set (see table above). Note this check is a research result only; GA-024 owns the component change.

## Not verified

- Licences come from Iconify metadata only; upstream repos and Streamline's own free-tier terms were not read.
- Visual quality and style consistency were not rendered or inspected; "style" is from Iconify palette metadata and general knowledge.
- Probe counts are approximate. The `/collection` listing endpoint was rate limited (HTTP 429) after the first burst, so full per-set inventories were not pulled.
- Pro/paid sets (Font Awesome Pro, Streamline Pro, Icons8) and non-Iconify libraries were not evaluated; WebSearch was not used.
