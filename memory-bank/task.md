# GoAthletix Master Task Checklist

This is our collaborative task board. Use Obsidian to check off completed items, re-order priorities, or add notes under tasks.

---

## 🚀 Sprint 3: WebSocket Live Feed & Accounts [IN PROGRESS]

### 1. WebSocket Live Activity Feed
- [ ] Create NestJS WebSocket Gateway (`ActivityGateway`) in backend
- [ ] Connect WebSocket Gateway to Prisma middleware/hooks for `activity_logs` changes
- [ ] Implement client-side Socket.io hooks in frontend `page.tsx`
- [ ] Replace static activity feed simulation with real-time backend stream updates
- [ ] Add smooth GSAP/Framer Motion animations to ticker items

### 2. Supabase Authentication Setup
- [ ] Configure Supabase Google/Facebook/LinkedIn OAuth credentials
- [ ] Add login/logout action buttons in frontend header
- [ ] Implement user session state checks using client-side Supabase client

### 3. User Onboarding Questionnaire
- [ ] Construct glassmorphic questionnaire modal overlay in frontend
- [ ] Capture user preferences (Sports Interests: Running, Cycling, etc.; Preferred Cities)
- [ ] Save onboarding profiles to database `/profiles` table via Prisma backend endpoint

---

## 📅 Sprint 4: Buddy Sync & Organizer Dashboard [UPCOMING]

### 1. Buddy Sync Integration
- [ ] Create endpoints to share bookmarks and training calendars
- [ ] Implement custom shareable profile link generation (e.g., `goathletix.com/share/username`)
- [ ] Design comparison view of shared calendars

### 2. Organizer Dashboard v1
- [ ] Implement "Claim Organizer Profile" workflow
- [ ] Create basic metrics page (views, event bookmarks, follower count)
- [ ] Design form templates to broadcast messages to followers

---

## 🛠️ Sprint 5: Python Ingestion Scrapers & Search SEO

- [ ] Write Python scraper for Townscript, WhatsApp groups, and Instagram feeds
- [ ] Implement event deduplication logic in backend events service
- [ ] Add meta-tags and dynamic schema JSON-LD scripts for SEO crawlers
