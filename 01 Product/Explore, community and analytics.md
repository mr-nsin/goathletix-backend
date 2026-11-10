# Explore tab, partner athletes and the admin analytics dashboard

- **Date:** 2026-11-10
- **Source:** product owner's requirements, given in chat on 2026-11-10 while the checkout work was wrapping up.
- **Status:** requirements recorded, nothing built. The Explore tab is the next build; the rest is later.
- **Related:** [[01 Product/Organizer and seller platform features|Organizer and seller platform features]] (the
  organiser dashboard and coach trainings, §5), [[03 Decisions/ADR-008-coach-trainings|ADR-008]],
  [[01 Product/Feature status and gaps|Feature status and gaps]].

This note adds three things to the product: an **Explore** tab, a **partner athlete** role with a social profile
and blogs, and an **admin dashboard** that learns from user feedback and behaviour. They share one idea: the
platform should learn what people care about, and let experienced athletes bring their own audience.

---

## 1. Explore tab

**Today.** "Explore" in the header is only a dropdown of browse links (running, cycling, calendar and so on).
There is no Explore page.

**Proposed.** Explore becomes a page: the place to wander when you do not yet know which event you want. Events
stay on the homepage feed (where, when, who); Explore is for inspiration and people.

| Section | What it shows | Source |
| --- | --- | --- |
| Featured partners | Experienced athletes and coaches to follow | partner profiles (§3) |
| Latest from athletes | Photos, videos and blogs, newest first, public posts only | partner posts (§3) |
| Sessions and events by partners | Upcoming sessions and events hosted by partners | trainings (ADR-008) and events |
| By sport | Sport chips that filter everything above | two-axis taxonomy (ADR-006) |
| Following | Posts from people you follow, signed-in users only | `entity_follows` |
| Trending | Most viewed or saved this week | analytics (§2) |

Phase 0 (can ship before partner content exists): the Explore page with the sport chips, existing event and
training rails, and a "Partners are joining soon" block. Real content arrives with §3.

**Needs the owner's confirmation:** the Explore tab was named without saying what it contains. The table above is
this note's assumption. See open decision 1.

---

## 2. Admin dashboard: feedback, behaviour and traffic

An internal dashboard for the platform team (separate from the organiser dashboard). Its job is to show where the
experience is weak and what people want, so the product improves on evidence.

### 2.1 Feedback after a ticket is issued

- After a booking, the confirmation page asks for a short rating of the experience (one tap, 1 to 5), then
  "What could be better?" as an optional free-text box, and a few quick tags (checkout, search, event info,
  price, other). Asking at the moment of success keeps the response rate high.
- A follow-up email or notification after the event asks about the event itself. That feeds organiser
  reviews, which already exist (`event_reviews`).
- The dashboard shows the average score over time, the tags that come up most, the text responses searchable
  and filterable by event, sport and date, and a flag on any response that mentions a problem.
- `user_feedbacks` already exists (anonymous insert allowed). It needs rating, tags, an order reference and a
  source column.

### 2.2 What people click and what interests them

- Events recorded: page views, search queries and filters used, clicks on events, tickets, sports and cities,
  "add to calendar", checkout steps reached and where people leave, saves and follows.
- Dashboard views: most viewed events and sports, search terms with no results, the checkout funnel with
  drop-off per step, and interest by city and sport. Each view can be cut by date range.

### 2.3 Traffic and visitors

- Visits and unique visitors, the pages each person opened, and where they came from (referrer, campaign tags).
- Visitor location from the network address (city level). **Decision needed on keeping the raw IP address**
  (see §2.5): the recommendation is to derive the city and device, then store the address only truncated or
  hashed, not in full.
- Logged-in activity (what a signed-in user did) is stored against their profile and used to improve their
  recommendations and the product. It is tracked individually only for signed-in users who have agreed to it.

### 2.4 Dashboard access

Staff-only, behind sign-in with a staff role. Read access to analytics, feedback and moderation queues; no
raw personal data unless the role needs it. Actions in the dashboard (approving a partner, publishing a blog)
are logged with who did what.

### 2.5 Privacy and legal (must be settled before collecting)

| Topic | Requirement |
| --- | --- |
| Law | India's Digital Personal Data Protection Act, 2023: collect only what is needed, say why, get consent, let people see and delete their data. Confirm obligations and the retention period with counsel. |
| Consent | A clear cookie and analytics notice. Analytics for anonymous visitors uses no personal identifiers; per-person tracking of signed-in users needs their consent and a setting to turn it off. |
| IP addresses | Treated as personal data. Store truncated or hashed, with a short retention period. |
| Children | Many users and participants are under 18. Do not profile minors for marketing. Behaviour data from accounts belonging to minors is limited to what the service needs. |
| Access | Only staff roles above, logged. Export and delete on request. |
| Ownership | A named person is responsible for the privacy notice and requests. |

### 2.6 Data model

| Need | Proposed table |
| --- | --- |
| Raw events | `analytics_events` (event name, page, element, event id, sport, city, visitor id, user id or null, session id, timestamp, properties json, referrer) |
| Visitor sessions | `analytics_sessions` (visitor id, started and ended, city, device, referrer, landing page) |
| Feedback | extend `user_feedbacks` (rating, tags, order id, source) |
| Rollups for the dashboard | daily summary tables or materialised views, so the dashboard does not scan raw events |

Collection goes through one small backend endpoint that validates and batches; the browser never writes
directly to these tables. RLS on every new table, with no public read.

---

## 3. Partner athletes: profiles, sessions, posts and blogs

**Who.** Experienced athletes and coaches (a "partner") who want an audience on GoAthletix. This extends the
coach and academy profile in
[[01 Product/Organizer and seller platform features|Organizer and seller platform features §5.2]]: a coach is a
partner who runs trainings; a partner athlete may run sessions or events, share their journey, or both. One
login can hold several roles.

### 3.1 What a partner can do

| Capability | Detail |
| --- | --- |
| Profile | Name, photo, bio, sports and level, achievements, certifications (with proof for the verified badge), the places they train, links. Public page at a stable address. |
| Sessions and events | Create and host sessions (reusing the trainings model) and events (reusing the organiser flow). They appear on the partner's profile and in Explore. |
| Posts | Photos and short videos with a caption, like an Instagram feed. Likes and comments are a later phase. |
| Blogs | Longer articles with a cover image, headings and images. Draft, publish and edit. |
| Followers | People follow a partner (`entity_follows` already supports other targets). |

### 3.2 Who sees what

| Visibility | Who sees it | Review needed |
| --- | --- | --- |
| Followers | Signed-in people who follow the partner | No (automatic checks only, see §3.3) |
| Public | Everyone, indexed by search engines, can appear in Explore | **Yes: a staff review before it goes public** |

A partner chooses the audience when posting. Choosing Public moves the post to "waiting for review". Staff approve
or reject with a reason, and the partner can edit and resubmit. Editing an approved public post sends it back
to review only if the text, images or video changed in substance (a typo fix does not). Followers-only posts are
live immediately, but still pass the automatic checks and can be reported.

### 3.3 Moderation and safety

- **Verify before visible.** A partner's profile is reviewed before they can post publicly, as with coaches.
- **Automatic checks** on uploads: file type and size, and screening for unsafe images where a service is available.
- **Report button** on every post and blog; reports go to the staff queue.
- **Rules page** (what is allowed: no hate, nudity, medical claims, betting, selling banned products). Staff can
  hide a post, suspend posting, or remove a partner.
- **Under-18s:** posts that show children need the guardian's consent. Whether minors may have profiles at
  all is a legal question (open decision 4). A partner who coaches minors also needs the child-safeguarding
  declaration from §5.5 of the organiser note.
- **Commercial posts.** Paid promotions or brand deals should be labelled; confirm the advertising rules with counsel.

### 3.4 Media

Photos and videos need storage and delivery that the platform does not have yet. Plan: Supabase Storage for
images, and a video host or processing step for video (decision 6), with limits on size and length. No file
storage exists today (file fields in checkout keep only the file name).

### 3.5 Data model

| Need | Proposed table |
| --- | --- |
| Partner profile | `partner_profiles` (profile id, handle, bio, sports, level, status, verified flag), or extend `training_centers` |
| Credentials | `partner_credentials` (with proof, like coach credentials) |
| Posts | `partner_posts` (type photo, video or blog; body; visibility; review status; published at) |
| Media | `partner_post_media` (storage path, kind, order) |
| Moderation | `content_moderation_log`, `content_reports` |
| Followers | existing `entity_follows`; add a `partner` target |

All reads go through the backend and filter by visibility and review status, because the service role bypasses RLS.

---

## 4. Phasing

| Phase | Scope | Depends on |
| --- | --- | --- |
| 0 | Explore page shell with the existing events, trainings and sport chips; "Partners soon" | nothing new |
| 1 | Sign-in (Supabase Auth); the post-ticket feedback prompt; basic analytics events and a minimal admin page | accounts, consent notice |
| 2 | Partner profiles, verification, public profile pages, partner sessions and events | accounts, trainings (ADR-008) |
| 3 | Photos and blogs, followers-only and public visibility, staff review queue, report button | media storage, moderation staff |
| 4 | Short video, likes and comments, trending, personalised Explore for signed-in users | video hosting, enough content |
| 5 | Full admin dashboard: funnels, search insights, per-user activity, exports | data from phases 1 to 4 |

Nothing in phases 1 to 5 can start without accounts. There is no sign-in today.

---

## 5. Acceptance criteria

**Explore (phase 0)**
1. The header Explore item opens an Explore page; the sport chips filter its event and training rails.
2. It works at 375 px and with reduced motion, and a direct visit returns a normal page, not a 404.

**Feedback and analytics (phase 1)**
3. After a ticket is issued, the user can rate the experience and send an optional comment in two taps; skipping costs nothing.
4. A visitor who declines analytics generates no per-person data.
5. A staff user can see the average rating over time and read comments; a non-staff user cannot reach the dashboard or the data.

**Partners (phases 2 and 3)**
6. A verified partner can publish a followers-only post that followers see at once.
7. Setting a post Public holds it for review; only an approved post appears in Explore, on search engines, or to a signed-out visitor.
8. A reported post reaches the staff queue and can be hidden.
9. Every list query filters by visibility and review status.

---

## 6. Open decisions for the owner

| # | Decision | Recommendation |
| --- | --- | --- |
| 1 | What the Explore tab contains | The table in §1: people and content for inspiration, with events staying on the homepage. Confirm or change. |
| 2 | Keep raw IP addresses? | No: keep city and device, store the address truncated or hashed with a short retention. |
| 3 | Analytics tool: build in the database, or use a hosted tool (PostHog or similar) | Hosted tool first for speed; own tables for the data that must stay with us (feedback, bookings). Check data residency. |
| 4 | May minors have profiles or appear in posts | Legal decision. Default: no profiles for under-18s; posts showing children need guardian consent. |
| 5 | Who reviews public posts, and how fast | A named staff role, with a service target (for example one working day). |
| 6 | Video: host it ourselves or use a video service | A video service; own hosting is costly and heavy. Photos and blogs first. |
| 7 | Blog format | A simple rich-text editor with images; no custom HTML (safety). |
| 8 | Whether partner profiles and coach profiles are one thing | One profile with roles: coach, athlete, organiser. |
| 9 | Likes and comments in v1 | No. Follows and views first; comments need more moderation. |

---

## 7. Out of scope for now

Direct messages between users, live streaming, a marketplace for partner content or paid subscriptions to a
partner, and any tracking of minors for marketing.
