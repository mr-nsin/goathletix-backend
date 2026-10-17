---
id: GA-032
type: task
status: done
priority: P2
owner: research
branch: none (documentation only)
worktree: none
scope: [goathletix-backend/01 Product/Club and academy listing research.md]
acceptance: []
depends_on: []
related: [GA-030, ADR-008]
---

# GA-032 What should a club / academy card and profile show? (deep research)

## Goal

Owner: "improve Clubs and academies cards to show more info; do deep research and tell me". Find out what the best platforms show for clubs, academies, training centres and coaches, and recommend the field set, card layout and filters for GoAthletix (India, all sports, all ages; coaches and academies host trainings, requirement #61 and ADR-008, Phase 1 find-a-coach with no payments).

## Scope and ownership

- Owned: one new note `goathletix-backend/01 Product/Club and academy listing research.md`. No code, no git, no packages.

## Acceptance criteria

- [ ] At least 8 real platforms studied from their public pages (use WebSearch and WebFetch; for example Strava Clubs, Meetup, Playo, Hudle, Cult.fit, Decathlon Sports, Khelomore, SportsKeeda or sports academy directories, Justdial or Urban Company style local-service cards, Eventbrite organiser pages, Airbnb Experiences host cards, Classpass, Mindbody, Nike Run Club). For each: what appears on the listing card, what is on the profile, what filters exist, how trust is shown (verified, reviews, safeguarding), how pricing and batches are shown, and the primary action.
- [ ] A consolidated field table: field, why it matters, who supplies it (club or system), card / profile / filter, and whether GoAthletix can show it honestly today (no invented data).
- [ ] A recommended card layout (ASCII wireframe) and a profile section list, plus the 6 filters to ship first.
- [ ] India-specific points: fee conventions, batch timing patterns, women and children safety signals, language, accreditation bodies (for example federation or affiliation numbers, AFI, SAI), GST on coaching fees, minors' safeguarding evidence.
- [ ] Every platform claim cites its URL; say plainly which pages you could not load or which claims are from search snippets only.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Platforms studied | partial | 5 platforms read from public pages (Strava help, Eventbrite help, Hudle, UrbanPro, Airbnb help); 5 snippet-only (ClassPass, LyfSkills, Meetup, cult.fit, Khelomore); Playo, Justdial, Decathlon not loaded. Corporate proxy blocked many sites. See note. |
| Field table, wireframe, filters, India points | done | `01 Product/Club and academy listing research.md` |

## Outcome

research note written; 5 of 10 platforms read from public pages, 5 snippet-only, 3 not loaded.

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
