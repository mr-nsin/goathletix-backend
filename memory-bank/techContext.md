# Technical Context: GoAthletix

> **⚠ NOT AUTHORITATIVE — ASPIRATIONAL. Do not plan against this file.**
> It describes FastAPI services, an OpenRouter LLM extraction pipeline, Algolia, Mem0, Supermemory and
> a Paperclip agent fleet. **None of that exists in the repo.** What exists: a NestJS 11 backend, a
> Next.js 16 frontend, and Python used only for standalone `scripts/`. There is no ML code, no model,
> no FastAPI service, and no Python dependency manifest.
> For the real stack see `CLAUDE.md` §2; for real current state see `memory-bank/activeContext.md`.
> Kept only as a record of original intent. Verified 2026-09-09.

## Tech Stack
- **Frontend / Core Web**: Next.js (App Router, React, Tailwind CSS v4 / Vanilla CSS), hosted on Vercel.
- **Backend Services**: Node.js/Python FastAPI.
- **Database**: PostgreSQL (Prisma ORM for database layer management).
- **Search Engine**: Algolia or PostgreSQL Full-Text Search.
- **Crawler Service**: Python (using BeautifulSoup, Playwright, Scrapy) or Go.
- **AI Integrations**: OpenRouter API for text parsing, structured data extraction (using cheap/fast LLM models).

## Third-Party Integrations
- **WhatsApp Business API**: Templates for event sharing and user reminders.
- **Instagram Graph API**: Scrape event posts/ads from organizer profiles.
- **Paperclip**: Agent deployment platform to run parallel agent roles (Scraper, Editor, Auditor) keeping the site updated.
- **Mem0**: Local memory layer to track user search history and preferred sports.
- **Supermemory**: Repository for staging scraped raw links and content.
