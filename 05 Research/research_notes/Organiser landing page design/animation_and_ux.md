# Animation and UI/UX techniques for product-demo landing pages (sports-events organiser site)

Method note: pages were read through a text-extraction fetch, so JS behaviour (sticky headers, scroll scrubbing, hover physics) was NOT observable. Where a page's motion is not stated in the cited text, it is listed under Gaps. Everything under "Inferences" is my recommendation, not a documented fact. Not covered (no fetch succeeded or time): Vercel, Arc/The Browser Company, Loom, Awwwards/Godly teardowns, GSAP docs, Smashing Magazine.

## Q1. Which 10 techniques give the most "wow" per line of code for a sports-events organiser landing page, and how to build each with framer-motion/CSS?

### Takeaway
The best reference pages replace video with in-page, HTML/CSS-built product mock-ups that react to hover/click (Perch, FounderDesk, Wispr Flow, Higo), with chaptered or stepwise demos and live-feeling data. Motion's own docs give the primitives (whileInView, useScroll/useTransform, LazyMotion) to build these cheaply, and the same docs and web.dev define the limits.

### Cited Findings
- Perch (perchnotch.com) hero is an interactive notch: "Hover it, or click it", with three chips that trigger demos (play a song, start a tea timer, ask like Claude Code). Feature cards contain miniature HTML/CSS UIs (approval card with Deny/Always/Allow and keyboard hints, timer dial, file list, Alt+Space search box, clipboard list), and a theme picker says "Try it on the notch above." — [Perch](https://perchnotch.com)
- Perch also has a 0:57 video-style player in the hero and pricing with a limited-launch strike-through price ($15 struck, $9 for first 100 buyers), a 14-day refund line and a 9-question FAQ incl. fullscreen/games, privacy, SmartScreen warning, "is it a subscription". — [Perch](https://perchnotch.com)
- FounderDesk (founderdesk.so) has a 1:35 demo player with play/pause, progress readout and chapter jumps that "replays the app's own interface in the page rather than using screenshots"; notes amounts/names are invented. A looping "a sale just landed" ticker (first name, city, plan) sits in the hero; sale notifications slide down, stay ~5 s, leave, while a daily counter updates. Trust row: read-only Stripe key, local data, 46 wallpapers. — [FounderDesk](https://founderdesk.so)
- FounderDesk header has a "Skip to content" link; CTA "Download for macOS" repeats in header, hero and closing; secondary "Watch the demo" becomes "Watch the demo again" at the end; 12-question FAQ, three price offers with one marked "Best value". — [FounderDesk](https://founderdesk.so)
- Wispr Flow (wisprflow.ai): hero demo shows a rambling spoken message cleaned up with labels like "Cleaning up..." and "Filler identified"; "Keyboard 45 wpm vs Flow 220 wpm" speed comparison; a tone selector (Formal/Casual/Very casual) rewriting one sentence three ways; dismissible top banner; logo bar "Used by professionals at"; privacy badges SOC 2 Type II/HIPAA/ISO 27001; ~11-question FAQ; "Download for free" repeated in nav, hero and closing. Exact demo format (video vs live) not confirmed by the text. — [Wispr Flow](https://wisprflow.ai)
- Higo (higo.wtf): a recurring "milestone" counter steps from "5 km to hired" to "1 km to hired" as you scroll; copy invites "Tap or swipe the milestone to say hi" and "Spin the milestone to start". Demos are static mockups (Telegram chat transcript with "Link checked" tags, preference form, verification list, editable outreach email with copy button). CTA "Chat with Higo on Telegram" repeated hero/bottom/footer; secondary "See how it works" anchors to explainer; header has "Skip to how it works". — [Higo](https://higo.wtf)
- Raycast's page shows its product as mockups (AI chat with sequential status lines "Fetching assigned tasks", Snippets panel with "Actions Ctrl K" bar, Notes), a keyboard graphic with callouts "Fast/Ergonomic/Personal/Reliable (99.8% crash-free)", category tabs that filter extension cards; header "Log in" + "Download". — [Raycast](https://raycast.com)
- Linear hero: H1 "The product development system for teams and agents."; mockups are real-looking issue view, board columns (Backlog 8 / Todo 71 / In Progress 3 / Done 53), thread, code diffs, changelog cards; announcement bar "New Loops →"; CTAs "Get started" and "Contact sales". — [Linear](https://linear.app)
- Cal.com: social proof is outcome metrics on customer cards ("From $500M to $1.5B+ ARR", "50% more demo efficiency"), compliance badges; "Sign up" primary, "Talk to sales" secondary; Free "forever" tier. — [Cal.com](https://cal.com)
- Stripe: announcement banner with "Learn more"; header "Sign in" + "Start now" + "Contact sales"; hero card mockups with illustrative data (billing meter, fraud risk panel with sample checkout). — [Stripe](https://stripe.com)
- Framer hero mockups: AI prompt demo with "Thinking..." then "Created a design plan" steps, a Core Web Vitals performance card, customer logo section linking to case studies; CTAs "Get started for free" / "Start without AI". — [Framer](https://www.framer.com)
- Luma: hero headline rotates adjectives ("Delightful, Vivid, Stellar, Lovely events start here"); CTAs "Create Your First Event", "Discover Events", "Get the App"; header Discover/Pricing/App/Help. — [Luma](https://luma.com)
- Motion: scroll-triggered (whileInView/useInView) vs scroll-linked (useScroll) are separate; `viewport={{ once: true }}` plays once; `useTransform` maps progress to any CSS value; scroll-linked animations use native ScrollTimeline when possible, else JS; scroll-triggered use a pooled IntersectionObserver. — [Motion scroll docs](https://motion.dev/docs/react-scroll-animations)
- Motion bundle sizes (gzip): `motion` component 43 kb; `LazyMotion` + `m` initial render just over 5 kb; `domAnimation` +24 kb (animations, variants, exit, hover/tap/focus); `domMax` +38 kb (adds drag and layout animations); `useAnimate` mini 3.3 kb (WAAPI only), hybrid 23 kb. — [Motion bundle size](https://motion.dev/docs/react-reduce-bundle-size)
- Support for CSS scroll-driven animations (`animation-timeline: view()`): Chrome/Edge since 115 (consistent across sources); Safari sources conflict (26.0 Sept 2025 vs 18.2 Dec 2024); Firefox conflicts (shipped v133 vs flag-only); consensus advice is wrap in `@supports (animation-timeline: view())` with non-animated default. Aggregator/blog sources, unverified against MDN. — [ics.media](https://ics.media/en/entry/230718/); [codercops](https://blog.codercops.com/blog/css-view-transitions-scroll-animations-2026); [camoa guide](https://camoa.github.io/dev-guides/css/modern-css/scroll-driven-animations)

### Inferences
Ten techniques ranked by wow per line of code for a sports organiser (my recommendation; sports examples are mine):
1. **Hero mock-up that reacts to hover/click (Perch pattern).** An HTML/CSS "organiser dashboard card" (event name, registrations ticker, "Publish" button). Chips under it ("Add a race category", "Sell a ticket", "Send a reminder") each set a state; build with `useState` + `<AnimatePresence mode="wait">` + `motion.div layout` (needs domMax, or use opacity/transform swaps to stay on domAnimation). ~40-60 lines.
2. **Live "registration just landed" ticker (FounderDesk pattern).** Array of fake rows (first name, city, category), `setInterval` 3-5 s, `AnimatePresence` slide-down `y:-16 -> 0`, hold ~4-5 s; clearly label sample data; pause when tab hidden and under reduced motion render one static row.
3. **Chaptered in-page demo instead of video.** Tabs/steps ("Create event -> Open registration -> Check-in -> Results") each switching a mock-up panel; auto-advance with a progress bar (`motion.div` width 0->100% via `animate`), pause on hover/focus, manual chapter buttons (FounderDesk player + Wispr tone selector idea). Must have pause control if it auto-plays over 5 s (WCAG 2.2.2).
4. **Animated number counters.** `useInView` once + `animate(0, target, {duration: 1.2, ease: "easeOut", onUpdate})` writing to a ref's textContent (no React re-render); use `tabular-nums` and reserve width to avoid shift. Use for "athletes registered / events / payouts".
5. **Scroll-linked sticky storytelling panel.** `position: sticky; top: 0` container inside a tall section; `useScroll({target, offset:["start start","end end"]})` + `useTransform` to cross-fade 3-4 mock-up states (registration form -> bib allocation -> live results). Opacity/scale only.
6. **Bento grid with micro-demos.** CSS grid (`grid-template-columns: repeat(6,1fr)`, spans 2/3/4), each cell a small living mock-up (Perch/Raycast cards); `whileInView` stagger (`staggerChildren: 0.06`) with `once:true`.
7. **Command-palette / keyboard demo** (Raycast "Actions Ctrl K", Perch Alt+Space): a mock "Cmd+K" box where typing "bib 204" filters rows; real `useState` filter on 6 hardcoded rows; also useful as a real feature for organisers.
8. **Cursor/tooltip choreography.** Absolutely positioned fake cursor SVG animated through keyframes (`animate={{x:[..],y:[..]}}` `times`) that "clicks" a button, triggers a tooltip, then loops; hide under reduced motion (show end state).
9. **Hover micro-interactions: spotlight-glow cards and magnetic/tilt CTA.** `onMouseMove` sets CSS vars `--x/--y` for a radial-gradient glow (pure CSS render, no re-render); button `whileHover={{y:-1}} whileTap={{scale:0.98}}` with 100-150 ms transitions. Subtle 3D tilt: `useMotionValue` + `useTransform` to `rotateX/rotateY` +/-4 deg max with `perspective`, desktop pointer only (`@media (hover:hover)`).
10. **Logo/partner marquee + grain/glow background.** CSS-only `@keyframes marquee` on a duplicated track (translateX(-50%)), `animation-play-state: paused` on hover/focus, `@media (prefers-reduced-motion: reduce)` static wrap; background: one blurred radial-gradient blob (static, `will-change` avoided) + SVG feTurbulence noise PNG at 3-5% opacity, never animated.
- Bundle approach: wrap site in `<LazyMotion features={domAnimation} strict>` and import `m` from `motion/react-m` to keep initial animation JS near 5 kb + 24 kb; load `domMax` lazily only for layout/drag. Prefer CSS for marquee, glow, hover so framer-motion is not required for them.
- Wow-per-line ranking logic: 1, 2, 4, 9 are highest (under 50 lines each, visible above the fold); 5 and 3 need more code but carry the storytelling.

### Gaps
- Could not verify the actual animation techniques (library, scroll scrubbing, tilt, grain) used by Linear, Framer, Cal.com, Luma, Raycast, Vercel, Stripe, Arc, Loom, Wispr Flow: fetch returned text only. View-source/DevTools inspection needed.
- Vercel, Arc/The Browser Company and Loom pages were not fetched.
- Awwwards/Godly/Land-book teardowns and GSAP docs not consulted.
- Safari/Firefox support for scroll-driven animations is contradictory across blog sources; confirm on MDN/caniuse before relying on it.

## Q2. What are the best-practice header behaviours and layout rules for a standalone organiser site?

### Takeaway
The sampled pages show a consistent header contract: logo left, 3-5 anchor links, a persistent primary CTA right plus a quiet secondary (Log in/Sign in), a skip link, and an optional dismissible announcement bar. Whether those headers shrink/blur/change CTA on scroll could not be verified; that part is recommendation.

### Cited Findings
- Perch header: logo (links to top), anchors Features/Pricing/FAQ, buttons "Get Perch" and "Get it free"; page doesn't state sticky behaviour. — [Perch](https://perchnotch.com)
- FounderDesk header: logo, anchors Demo/Features/Wallpapers/Pricing/FAQ, Studio link, "Download for macOS" button, plus "Skip to content". — [FounderDesk](https://founderdesk.so)
- Higo header: wordmark with milestone counter, "Chat on Telegram" button, "Skip to how it works" link. — [Higo](https://higo.wtf)
- Raycast header: logo left; Store, Pro, AI, iOS, Windows, Teams, Enterprise, Blog, Pricing; right "Log in" and "Download". — [Raycast](https://raycast.com)
- Stripe header: Products/Solutions/Developers/Resources/Pricing, "Sign in", "Start now", "Contact sales", region selector; announcement banner above. — [Stripe](https://stripe.com)
- Luma header: Discover, Pricing, App, Help. — [Luma](https://luma.com)
- Framer: "Log in" and "Sign up" in header. — [Framer](https://www.framer.com)
- Linear and Wispr Flow have top announcement banners ("New Loops ->"; dismissible Notetaker/funding banner). — [Linear](https://linear.app); [Wispr Flow](https://wisprflow.ai)
- Shifts caused by late-inserted banners at top of viewport hurt CLS; reserve space. Shifts within 500 ms of user interaction are excluded from CLS. — [web.dev optimize CLS](https://web.dev/articles/optimize-cls)
- Funnel pattern: primary CTA repeated header -> hero -> closing (FounderDesk, Higo, Wispr Flow); secondary CTA is a low-commitment "see it" ("Watch the demo", "See how it works"). — sources above.

### Inferences
- Header rules for a standalone organiser site: fixed height (64 px, reduce to 52-56 px on scroll via transform-free height change only if wrapped in a container with reserved space; safer: keep constant height and only change background/border); `position: sticky; top:0` rather than fixed to avoid content jump; transparent over hero -> `backdrop-filter: blur(12px)` + translucent surface + 1px border after ~16 px scroll (a single `useScroll` threshold or IntersectionObserver sentinel, not a scroll listener).
- CTA-on-scroll: show a compact "Create your event" primary button always; swap hero-matching copy (e.g. "Get started" -> "Create event free") only after hero CTA leaves viewport (IntersectionObserver on hero CTA), fading with opacity so width stays reserved.
- Hide-on-scroll-down/show-on-scroll-up is optional; keep header visible when keyboard focus is inside it.
- Announcement bar: single line, dismissible with persisted choice (cookie/localStorage in try/catch), fixed height reserved server-side to avoid CLS; use for registration deadlines or launch offers (Perch limited-launch style).
- Mobile: hamburger -> full-screen sheet, CTA stays visible outside the sheet, 44x44 px (iOS) / 48 dp touch targets (my recommendation).
- Layout: max content width ~1120-1200 px, 8-px spacing scale, single H1, anchor-section order borrowed from Perch/FounderDesk/Wispr: hero -> proof/logos -> demo/chapters -> features bento -> how it works (3 steps) -> pricing -> FAQ -> closing CTA -> footer. Add skip link and `scroll-margin-top` equal to header height for anchors.
- Dark/light: ship `color-scheme` + CSS variables; default to the brand's one strong theme and offer system-following; test glow/grain contrast in both. (No sampled page's theme handling could be verified.)

### Gaps
- No source confirmed sticky/shrink/blur/CTA-swap behaviour for any sampled header; needs DevTools inspection.
- No documented measurement of conversion impact for header behaviours was found in this pass.

## Q3. Which pitfalls (motion sickness, layout shift, heavy JS, unreadable text while animating) should be avoided, with measurable budgets?

### Takeaway
Use Core Web Vitals thresholds (LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 at p75), animate only transform/opacity, honour prefers-reduced-motion at both CSS and JS level, and keep animation JS small via LazyMotion/CSS. Auto-moving content longer than 5 s needs a pause control.

### Cited Findings
- Core Web Vitals p75 "good": LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1. — [web.dev Vitals](https://web.dev/articles/vitals)
- CLS: poor above 0.25; reserve space for images (width/height or aspect-ratio), embeds, late content; avoid inserting banners at viewport top without reserved space; use `font-display: optional` or size-adjust/ascent-override fallbacks and preload critical fonts; animate `transform` instead of `top/left/box-shadow`; hover-induced movement and lazy content count as unexpected shifts. — [web.dev optimize CLS](https://web.dev/articles/optimize-cls)
- Reduced motion: `MotionConfig reducedMotion="user"` drops transform and layout animations automatically while opacity/background-colour still animate; `useReducedMotion()` for custom handling (swap x/scale for opacity, stop video autoplay, replace parallax value with 0). — [Motion accessibility](https://motion.dev/docs/react-accessibility)
- Vestibular triggers: parallax, extensive scroll-linked movement, zooming, surprising reveals, flashing, autoplay video; feedback animations can usually stay, purely decorative should be reduced first. Use a `no-preference` block for decorative animation; JS animations need a `matchMedia` listener. — [web.dev prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)
- WCAG 2.2.2: moving/blinking/scrolling info that starts automatically, lasts more than 5 s and is presented in parallel with other content needs a pause/stop/hide mechanism (unless essential). — [W3C WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- Durations: ~100 ms for toggles/feedback, 200-300 ms for larger transitions, 100-400 ms typical, avoid 500 ms+; entering slightly longer than exiting; ease-out for entering, ease-in for leaving, avoid linear; the more frequent the animation, the shorter/subtler. — [NN/g](https://www.nngroup.com/articles/animation-duration/)
- Bundle: full `motion` component 43 kb gzip vs ~5 kb initial with LazyMotion + `m`; domAnimation +24 kb, domMax +38 kb; `useAnimate` mini 3.3 kb. — [Motion bundle size](https://motion.dev/docs/react-reduce-bundle-size)

### Inferences
Suggested budgets (my recommendations, derived from the cited thresholds):
- LCP <= 2.5 s on mid-range Android over 4G; hero LCP element should be text or a CSS/HTML mock-up (not a video poster), `next/font` with `display: swap` + size-adjusted fallback (or `optional`).
- CLS <= 0.1 (target 0.02); every animated mock-up container has fixed height/aspect-ratio; counters use `tabular-nums` and fixed width.
- INP <= 200 ms: no heavy work in scroll/mousemove handlers; write to CSS variables or motion values, not React state.
- JS: landing route animation JS <= ~30 kb gzip (LazyMotion + domAnimation) loaded after hydration; no third-party video player; below-the-fold demos via `next/dynamic` + IntersectionObserver.
- Animate only transform/opacity; no animated blur/box-shadow on large areas; avoid `will-change` on many elements; text must be fully visible and static at its final position within <= 400 ms of appearing (no letter-by-letter reveals on headings, no text over moving gradients below 4.5:1 contrast).
- Motion sickness: no parallax, zoom-on-scroll or full-screen motion; limit scroll-linked effects to opacity/small translate within a contained panel; mark decorative layers `aria-hidden`.
- Accessibility: `MotionConfig reducedMotion="user"` at app root plus `@media (prefers-reduced-motion: reduce)` for CSS marquee/glow; pause button on any auto-advancing demo or ticker lasting over 5 s; mock-ups need an accessible text alternative (a short `aria-label` or visually hidden description), real `<button>`s for interactive chips, visible focus rings; keyboard-operable chapters (`role="tablist"`).
- Test in Lighthouse/PageSpeed and field data (CrUX/web-vitals library) and with throttled CPU 4x.

### Gaps
- No independent public benchmark for "landing page JS budget" was found; the 30 kb figure is my own target, not a documented standard.
- Contrast and touch-target numbers (4.5:1, 44 px) come from general WCAG/Apple convention not fetched in this pass.

## Q4. What should an organiser login/sign-up screen look like to match the landing page?

### Takeaway
Use a split screen: form on one side, a live product/testimonial panel reusing landing-page mock-ups on the other, with phone-number OTP as the primary India path and Google as a secondary, stacking cleanly on mobile. Public sources found only cover generic split-screen guidance; India-specific OTP detail comes from MDN/web.dev technical docs.

### Cited Findings
- Split layouts work when each panel has a distinct purpose; several B2B sources recommend a branded/testimonial panel for social proof at the point of authentication; panels stack on phones and the stacked version needs equal testing. — [Framer split-screen guide](https://framerwebsites.com/blog/split-screen-layout-design); [shadcn blocks login split testimonials](https://www.shadcn.io/blocks/login-split-testimonials); [Lollypop](https://lollypop.design/blog/2025/october/saas-login-page-design/)
- For enterprise B2B, lead with SSO (Cieden suggests "Sign in with your organization" primary, passkey peer); prioritise Google and Microsoft. — [Cieden](https://cieden.com/book/pages-and-flows/login/login-page-design)
- SMS OTP input: use `<input type="text" inputmode="numeric" autocomplete="one-time-code" pattern="\d{6}">` in a `<form>` (not `type="number"`; single input recommended, split boxes not addressed). — [web.dev SMS OTP form](https://web.dev/articles/sms-otp-form)
- WebOTP: last SMS line must be `@your.domain #123456`; call `navigator.credentials.get({otp:{transport:["sms"]}, signal})` with AbortController; HTTPS only; Chrome/Opera/Vivaldi on Android per web.dev; MDN labels it experimental/limited availability; Safari uses `autocomplete="one-time-code"` to offer autofill. SMS OTP is spoofable/number-recyclable; MDN recommends passkeys where possible. — [MDN WebOTP](https://developer.mozilla.org/en-US/docs/Web/API/WebOTP_API); [web.dev](https://web.dev/articles/sms-otp-form)
- Sign-in/sign-up CTAs seen: "Sign up" (Cal.com), "Log in"/"Sign up" (Framer), "Sign in" + "Start now" (Stripe), "Get started" (Linear, links /signup). — sources in Q1/Q2.

### Inferences
- Layout: left 50-55% form (logo, headline "Run your next event from one place", phone field with +91 prefix, "Send OTP" primary button, "Continue with Google" secondary, small terms line); right 45-50% product panel reusing the landing hero mock-up in a gently looping state (registrations ticker, bib count) with one short testimonial from an organiser and a trust line (e.g. payout/refund policy). Same fonts, radii, glow/grain and button styles as the landing page; header on auth pages reduced to logo + "Back to site".
- Flow: phone -> OTP screen (single input, `autocomplete="one-time-code"`, WebOTP attempt, 30 s resend countdown, "Change number", edit-in-place) -> org/event onboarding. Keep sign-up and log-in as one flow ("Continue") to avoid wrong-door errors; copy: "We'll text a 6-digit code to this number."
- Collapse product panel below ~1024 px; on mobile show only form with the brand glow, keep a compact trust line, set keyboard `inputmode="tel"` for phone field (`inputmode="numeric"` for OTP), avoid autofocus that pops keyboard over the headline.
- Motion on auth: only a subtle fade/slide between steps (200-300 ms, `AnimatePresence mode="wait"`), reduced-motion safe; no CLS when swapping steps (fixed form container height).
- India-specific: Indian SMS sender registration (DLT) requirements and delivery reliability, WhatsApp OTP, and UPI-adjacent trust cues were not researched; flag for the backend/vendor team.

### Gaps
- No public source found for India-specific phone-OTP login conventions (DLT templates, WhatsApp OTP, resend timings); search returned only generic login-design guidance.
- Could not observe real login screens of Linear, Cal.com, Luma, Raycast, Vercel etc. (authenticated/JS pages); the split-with-product-panel pattern is supported only by generic design-guide sources, not by teardown of those sites.
- Luma's sign-in method (email vs phone) is not stated in the fetched content.
