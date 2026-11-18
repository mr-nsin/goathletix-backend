---
type: delivery
status: ready-for-review
date: 2026-11-18
related: ["05 Research/reports/Organiser landing page design.md", "03 Decisions/ADR-010-separate-accounts-per-role.md", "04 Delivery/GA-067-role-dashboards-demo.md"]
tags: [delivery, organiser, landing-page, frontend]
---

# GA-068: organiser landing page and sign-in

Frontend only. Not committed yet. Applies the change list in `05 Research/reports/Organiser landing page design.md`.

## What was built

- **`/organisers`**, a standalone site: the root layout hides the participant header, announcement bar and footer for `/organisers/*` (`SiteChrome`), and
  `app/organisers/layout.tsx` draws an organiser header (anchors, quiet Sign in, filled Sign up, mobile sheet, theme toggle, skip link) and footer.
- **Hero with a sport switcher:** ten sport groups change the headline noun, sub-line, feature chips, console title and a live demo (leaderboard,
  route profile, three-leg bar, trek route and batch, lanes, bracket, class picker, league table, HYROX toggle, camp calendar). URL hash per sport
  (`/organisers#martial`), auto-rotation until first touch, pause on hover and a pause button, reduced-motion respected.
- **Sections in the report's order:** trust strip of true statements, use-case cards that open the matching sport, chaptered demo reel (now with a
  message chapter), feature grid tagged In pilot or Coming soon, support and engagement, km-marker journey with a checklist, pricing and payouts, FAQ, close.
- **`/organisers/sign-in`:** one email-first screen (email, 6-digit code, organisation details for new organisers, sports), invite variant
  (`?invite=Org&email=...`), looping product panel. Real Supabase email code when configured, otherwise a labelled demo (any 6 digits). Creates an
  organiser-type account and a draft organiser profile, then opens the existing `/become/organiser` wizard.
- **Facts config:** `components/organiser-landing/config.ts`. Phone, WhatsApp, email, support hours, payment partner and fee-table link are shown only
  when filled in, so the page cannot promise what does not exist.

## Decisions applied

- Each role has its own account (ADR-010). FAQ, become-role prompt, partner menu note and account page copy changed.
- No customer counts, logos or testimonials. Everything in the demos says "Sample data".

## Open items

- Owner: can one email hold more than one account (ADR-010)? Fill in `SUPPORT`, `FACTS` and the fee wording when decided.
- Supabase: the email template must include the `{{ .Token }}` code, not only the link, for the real flow. Phone code (DLT) is not started.
- Rework the GA-067 role switcher and `/account` "Become a..." cards; add seller and coach sign-in.
- Legal review of the trust and comparison copy; check the sport copy with each sport's rules before any figures are added.
- Visual pass on real competitor pages (the research read text only).
