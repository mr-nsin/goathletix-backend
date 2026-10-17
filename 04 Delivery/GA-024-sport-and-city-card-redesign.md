---
id: GA-024
type: task
status: ready
priority: P1
owner: discovery-ui
branch: codex/ga-024-sport-city-cards
worktree: D:\project\goathletix-wt\fe-ga-024-sport-city-cards
scope: [goathletix-frontend/src/components/home/Sections.tsx (SportGrid and CityRail only), new files]
acceptance: []
depends_on: []
related: [GA-020]
---

# GA-024 Sport tiles and city cards: white cards with proper icons, real photos of famous places

## Goal

Owner feedback on the homepage "Browse by sport" and "Browse by city" rails:

1. **Sport tiles:** white cards (`var(--surface)`) with a larger, proper colourful sport icon on a clean white or lightly
   tinted background, the name and the live count, and a sport-colour accent. Not a coloured gradient tile with a small icon.
2. **City cards:** remove the "GoAthletix" badge. Use a real photograph of each city's famous place as the card image:
   Bengaluru Vidhana Soudha, Mumbai Gateway of India, Delhi NCR India Gate, Pune Shaniwar Wada, Hyderabad Charminar,
   Chennai Kapaleeshwarar temple, Kolkata Howrah Bridge, Ahmedabad Sidi Saiyyed Jali (or Jhulta Minar), Jaipur Hawa Mahal,
   Goa a beach or the Basilica of Bom Jesus. Keep the name, event count, "this weekend" and the NEAR YOU pill readable over
   the photo (scrim). Keep the landmark name line.

## Scope and ownership

- Owned: `SportGrid` and `CityRail` in `src/components/home/Sections.tsx` (edit only those two functions); new
  `src/components/home/SportCityCards.css`; new `src/lib/cityPhotos.ts`; new `public/cities/*` and `public/cities/CREDITS.md`;
  optional new small icon components under `src/components/home/`.
- Out of scope: `src/app/globals.css`, every other function in Sections.tsx (organiser, seller, alerts, gear, clubs, guides
  belong to other tasks), `page.tsx`, the shape of `homeData.ts` (add fields only if unavoidable and say so), the event card,
  header, footer, backend.
- Coordination: batch 2 runs three frontend tasks at once (GA-024, GA-025, GA-026). **Nobody edits `globals.css`** (serial
  resource). Put styles in your own new `.css` file imported by your component (Next 16 allows importing global CSS from a
  component). `globals.css` loads first, so equal-specificity rules in your file win; use selectors at least as specific as the
  existing ones.

## Acceptance criteria

- [ ] Sport tiles are white cards with a large colour icon; hover lifts; correct in dark mode (use tokens, no fixed white text).
- [ ] No "GoAthletix" text or badge on any city card. Photos load from `public/cities/` (local files, no hotlinking).
- [ ] 10 photos, each at most 90 KB (about 720 px wide, JPEG or WebP), with intrinsic size or `next/image` sizing so layout does not jump.
- [ ] `public/cities/CREDITS.md` lists per photo: file, title, author, licence, source URL. Only CC0, public domain, CC BY or
      CC BY-SA images from Wikimedia Commons. No "non-commercial" or "no derivatives".
- [ ] Text stays legible on the brightest and darkest photo.
- [ ] A city with no usable photo falls back to the existing gradient plus the landmark line drawing.
- [ ] `npx tsc --noEmit` and `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass, 0 errors | run in worktree, commit 873b381 |
| eslint src | pass, 0 errors, 6 pre-existing warnings | run in worktree |
| Server/client boundary self-check | pass | Sections.tsx has no use client; new code only renders FluentIcon/Image and imports plain modules (cityPhotos.ts, sportPalette.ts) |
| Loaded in a browser | not run | agents cannot; the coordinator does after the merge |

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
