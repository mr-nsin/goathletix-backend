# IndiaRunning organiser portal: login/landing experience and public organiser promises

Method note: organiser.indiarunning.com/login is a client-rendered React single-page app. A plain fetch returns only an HTML shell (title, meta tags, empty root div, `/static/js/main.85bc350a.js`). I could not render it in a browser. All on-page copy and layout below was read from the public JS bundle's source (JSX strings and Tailwind class names), not from a screenshot. This is reliable for text and structure, but exact visual rendering (colours, image art, spacing) was not observed. `/register`, `/signup` and `/forgot` all return HTTP 200, but that is the SPA catch-all, not evidence those routes exist. The bundle defines only `/login`, `/dashboard`, `/accounts` and `/events/all` routes, plus a `/desktop-only` redirect.

## What exactly is on organiser.indiarunning.com/login? Is there a sign-up path and what does it ask?

### Takeaway
The "login" page is a combined "Partner with us" landing page with a single "Sign In/Sign Up" card. It is passwordless and email-first with a 4-digit OTP. New users are routed into a short signup step (name, mobile, organisation) in the same card. There is no social login and no forgot-password link in the code I read. The portal's own name is "India Running Organiser Dashboard".

### Cited Findings
- Page `<title>` is "India Running Organiser Dashboard". Meta description is "One stop for marathons information, calendar, planning and promotion". og:site_name is "India Running Races Information". The og:url and og:image point to the consumer site (indiarunning.com). The meta keywords include "runinfinity, bangaloreultra, airteldelhi". The favicon is hosted on S3 bucket `race-registration-production-media`. — [login HTML](https://organiser.indiarunning.com/login)
- The page refuses to load inside an iframe (redirects to `/not-allowed`). — [login HTML](https://organiser.indiarunning.com/login)
- Layout, hero section (from bundle component `_a`): a full-viewport hero with a background image (class `bg-partner-with-us-bgimage`, bg-cover, anchored right). On desktop the white rounded sign-in card (about 30rem wide, shadow) floats on the right, vertically centred. A large white bold headline sits bottom-left: "**Organise** remarkable events with ease." The word "Organise" is teal (#1BCBA9). A decorative curve SVG sits beside it. On mobile the hero is half height, the headline is hidden, and the card overlaps the bottom edge of the hero. Below the hero is a bold centred line: "We are here to help and guide you to make your event a success." This is a hero-plus-floating-card layout, not a 50/50 split-screen. — [JS bundle](https://organiser.indiarunning.com/static/js/main.85bc350a.js)
- Sign-in card, step 1: heading "Sign In/Sign Up". Label "Please enter your email address". Single email input with placeholder "Email address". A full-width primary button below it (pink #FF005C; label text not captured). A thin pink progress bar appears while the request is in flight. If the visitor arrived via an invite link, the label becomes "You are invited by {organizationName}" and the email field is pre-filled and disabled. — [JS bundle](https://organiser.indiarunning.com/static/js/main.85bc350a.js)
- Step 2 (OTP): message "OTP has been sent on {email}" (or "Resent Successfully"). It shows a 4-box numeric OTP input, a "Verify OTP" button, and a "Resend OTP" action. The error message is "Incorrect Otp". There is no password field in the public login flow. — [JS bundle](https://organiser.indiarunning.com/static/js/main.85bc350a.js)
- Step 3 (new users only): if the API returns regStatus "pending", the card switches to "Signup" with a "change email" link. Fields: First Name ("Enter your First Name"), Last Name, Mobile Number (with country-code dial picker; 12-digit validation), Organization Name ("Enter your Organization Name", max 50 characters, special characters blocked in names). A "Continue" button then triggers a phone-number OTP (`regMedium: "phoneNumber"`). Error copy: "All fields are required!", "Invalid Mobile number". — [JS bundle](https://organiser.indiarunning.com/static/js/main.85bc350a.js)
- Sign-in and sign-up are therefore one flow on one page (the same card), switching on whether the email is known. The bundle also references an API path `/organiser/auth/sign-up`. — [JS bundle](https://organiser.indiarunning.com/static/js/main.85bc350a.js)
- Invite flow: teammates are invited by email (`organiser-user/sendInvite`). Error strings include "Your invitation has expired. Ask your organisation admin to invite you again", "You have already registered with this invitation link", "Invalid invitation link". — [JS bundle](https://organiser.indiarunning.com/static/js/main.85bc350a.js)
- A password field exists in the bundle ("Password", "Master Password" labels) but I did not tie it to the public login card. It appears to be for internal or admin use. I treat it as not part of the public login. — [JS bundle](https://organiser.indiarunning.com/static/js/main.85bc350a.js)
- Social login: I found no Google, Facebook or Apple sign-in strings tied to the login card. The Google references in the bundle are Google Maps only.
- The page is desktop-oriented: the bundle contains a `/desktop-only` route, and the dashboard sidebar is `hidden md:flex`. Authenticated mobile use is likely restricted. The public landing page itself is responsive, with a mobile layout and carousel.

### Inferences
- Email-OTP plus a mobile-OTP verification at signup means the account is keyed on email, with a verified phone captured at registration. No password reset is needed, which explains the absence of a forgot-password link.
- Because the "Organization Name" is asked at signup, an account maps to an organisation with invited team members and roles (the bundle has "Organisation roles" and "Add Members by Email ID").

### Gaps
- Not observed: the exact label on the email-step button, final colours, the hero background image art, and the real rendering of the page. No browser render was available.
- Whether a forgot-password or social-login route exists server-side cannot be verified without logging in. I found none in the front-end code.

## Landing content a visitor learns before logging in

### Takeaway
Below the hero there is real marketing content: three value cards, a headline "Seamless Event Journey...", and five alternating image-and-text feature blocks. Everything is on the same `/login` page.

### Cited Findings
- Three cards under the hero (carousel on mobile, auto-play 2s; row on desktop), each with an image: (1) "All in one platform": "Easy monitoring of all your participants and seamless communication through targeted email campaigns." (2) "Right network": "Special events demand special collaboration. With our network of expert vendors, retainers, collaborators we meet exceptional demands." (3) "Engagment" (sic, typo in source): "Numerous outreach programs, creative campaigns; leveraging trends, organizing promo events, we plan engagement that peaks interest." — [JS bundle](https://organiser.indiarunning.com/static/js/main.85bc350a.js)
- Section headline (italic bold, centred): "Seamless Event Journey: Discover, Book, Train, Enroll, and Prepare Your Audience for Success". — [JS bundle](https://organiser.indiarunning.com/static/js/main.85bc350a.js)
- Five alternating image-left/image-right feature blocks:
  - "List your Event": "Showcase your event to more than 1 lac visitors, visiting our platform every month. Speak directly to the community of runners, cyclists, etc. We have built the platform keeping the needs of people who indulge in endurance sports in mind..."
  - "Manage Registration": "...tracking and careful management of every participant record becomes vital. From sorting data to compiling entries and making changes, a single dashboard helps you do that."
  - "Promote and Engage": "We give your event a voice that reaches the runners. ... Engagement across key social media platforms, and targeted email communication enable great promotion."
  - "Train with Fitpage": the Fitpage crew assess routes and conditions and offer route-specific training plans.
  - "Customer Support": "While we incorporate the best technology to avoid any manual intervention and errors, our team dedicated to customer support remains a call or an email away to help you with any unforeseen challenges. Simply pick up your phone when you need us."
  — [JS bundle](https://organiser.indiarunning.com/static/js/main.85bc350a.js)
- Trust signals on the page: "more than 1 lac visitors" per month (self-reported, unverified). The footer shows "Powered by Fitpage" and "Saransh Ventures Private Limited". There are no customer logos, testimonials, event counts or pricing in the code I read.

### Inferences
- The promise is a full-lifecycle platform (list, manage, promote, train, support). The only quantified claim is 1 lakh+ monthly visitors. No pricing or commission appears on the landing page (the T&Cs, below, do disclose it).

### Gaps
- Image content (illustrations vs photos) of the cards was not viewed.

## Header and footer versus the consumer site

### Takeaway
The organiser landing page has a minimal chrome and a dark footer. The consumer site has a rich header (Shop Nutrition, Training, Create Event, Log In / Sign Up, browse menus). Both footers credit Fitpage and Saransh Ventures.

### Cited Findings
- Consumer site header/nav: Shop Nutrition (ascendliv.com), Training (training.fitpage.in), "Create Event" (links to organiser.indiarunning.com), Log In / Sign Up; menu: Events by Distance, Events by City, Event Review, Stories and Blogs, Write your story; tabs Races and Run Clubs. Footer: app promo "Race registrations, event results, photographs, run-clubs and more— all in one app!", Contact Us, Terms and Conditions, Privacy Policy, Sitemap, Facebook and Instagram, "Copyright © 2026 IndiaRunning", "Powered by Fitpage ... operated by Saransh Ventures Private Limited". Play Store (in.indiarunning.app) and App Store (id6736513478) links, plus a QR code. — [indiarunning.com](https://www.indiarunning.com)
- Organiser footer (from bundle): dark neutral-800 footer with the IR logo, "Contact Us" (mailto:support@indiarunning.com), "Terms & Conditions" (/tnc), "Follow Us:" Facebook and Instagram, "Powered by" Fitpage logo, "Saransh Ventures Private Limited", "Copyright © {year} IndiaRunning, All Right Reserved" (sic). It has no Privacy Policy or Sitemap link and no app-store badges in the footer, although Play Store and App Store link definitions exist in the bundle. — [JS bundle](https://organiser.indiarunning.com/static/js/main.85bc350a.js)
- The organiser header on the landing page: no top nav bar found in the code (hero only). After login, a narrow dark left sidebar (w-24) with a logout icon is used (Dashboard etc.).

### Gaps
- The Contact Us text on the organiser footer for desktop vs mobile layouts was only partially checked.

## Support and engagement promises to organisers

### Takeaway
Support is email plus phone on the public site; no WhatsApp number, hours or dedicated account manager is published. Engagement tooling is email campaigns (with limits), confirmation email and SMS, reminders to non-finalised registrants, and paid WhatsApp and banner promotion.

### Cited Findings
- Contact page: phone +91 8779557015, email support@indiarunning.com, Corporate Office "101 Construction House A, 24th Road, 16th Rd, above Mag St Cafe, opp. Swarna Rekha building, Mumbai 400052". WhatsApp and support hours are not listed. — [Contact Us](https://www.indiarunning.com/contact-us)
- T&Cs (organiser part): grievance officer Manasi Jadhav (VP Product & New Community Initiatives), grievance@indiarunning.com; violations reported to support@indiarunning.com. — [T&Cs](https://www.indiarunning.com/tnc)
- T&Cs: platform retains "approximately 30%-50%" of total event revenue at its discretion; platform fee is non-refundable; optional paid services are banners, WhatsApp campaigns, email marketing and website promotion; mandatory KYC before settlements; pre-event partial and post-event final settlement; organiser is exclusively responsible for communicating changes to participants; liability capped at Rs. 10,000. Dashboard shows revenue, registrations, category breakdowns, participant details, results/timing and "leads from users showing interest". — [T&Cs](https://www.indiarunning.com/tnc)
- In-app (post-login strings visible in the public bundle): "Campaigns" page ("a powerful tool designed for event organizers to effortlessly communicate with all participants through customized emails"; bulk email with templates; "Email All Hot Leads"; reminder emails to people who have not finalised registration; scheduling). Limit text: "We have a limit of 1 campaign per week. Audiences is also limited to 6000. Please contact support to request more." Also "Send confirmation SMS" and "Send confirmation email" toggles, email reply-to settings, BIB assignment, corral assignment, results upload and timing-partner sync, and KYC verification ("Verify Now"). "Contact Sales" button (mailto support@indiarunning.com). Post-signup banner: "Wohoo! Welcome onboard. Create your First Event in 3 simple steps!!" plus an "Event Creation Guidebook" PDF link ([user guide](https://race-registration-cdn.indiarunning.com/organizers/docs/help/user-guide-for-race-organizers.pdf), not fetched). "Distance not listed? Contact IndiaRunning support." — [JS bundle](https://organiser.indiarunning.com/static/js/main.85bc350a.js)

### Inferences
- Onboarding is self-serve (3-step event creation plus guidebook, KYC gate before payouts). The "Customer Support" promise is phone-and-email; nothing public says dedicated account manager.
- Promo codes and social-sharing tools were not found in the public strings I scanned (not searched exhaustively).

### Gaps
- Not fetched or checked: the About page, blog posts for organisers, app store listing text, Wayback snapshots, and the user-guide PDF. A web search for organiser pages returned nothing useful. The T&Cs summary came from a model-summarised fetch, so clause numbers and quotes should be verified against the page before reuse.
- No dedicated "partner" or "host your event" page outside the login landing page was found.
