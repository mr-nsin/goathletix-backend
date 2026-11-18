---
type: research
status: done
date: 2026-11-18
related: ["05 Research/reports/Role dashboards and onboarding.md"]
tags: [research, design, landing-page, organiser]
---

# Landing page inspiration (for the organiser landing page)

Sites read on 2026-11-18: founderdesk.so, loom.com, wisprflow.ai, perchnotch.com, higo.wtf. Text and layout only; nothing was signed up for.

| Site | What it does well | What we borrow |
| --- | --- | --- |
| FounderDesk | Hero shows the product itself (live widgets, a sale card that slides in). The "demo" is not a video: the app's own UI is replayed live in the page, with 7 chapter tabs and a time per chapter. Small honest line: "Amounts and names are made up." | In-page demo reel with chapters, auto-advance, pause; "sample data" line |
| Loom | One-line promise, then alternating feature blocks, each with a snippet of real UI. Use-case tabs (Sales, Support...). | Clear promise, one idea per block, role/sport tabs |
| Wispr Flow | Before/after in the hero (messy speech becomes clean text), then a "4x faster" comparison. | Show the outcome change, not a feature list |
| Perch | "This one works. Hover it, or click it." The hero is the live product, with buttons that make something happen in it ("Play a song", "Start a timer"). A 57-second video plus feature cards that each contain a small working demo. | Interactive hero console with trigger buttons; each feature card has a mini live demo |
| Higo | A journey told with distance markers ("4 km to hired", "3 km ...") that count down as you scroll; chat and form mock-ups; a "checkpost" that shows what is filtered out. | Race distance markers as the scroll narrative (fits a sports platform) |

## Patterns to use

1. The hero is the product: a live organiser console, not a stock photo. Visitors press buttons and watch it react.
2. A chaptered demo replayed in the page (no video file to host, always crisp, can use our real components).
3. One idea per section, each with a small working mock.
4. Distance markers as progress through the page.
5. Honest labels: "Sample data" on demos, "Coming soon" on features that are not built (payouts, results, certificates).
6. Motion respects `prefers-reduced-motion`, and pauses on hover so people can read.
