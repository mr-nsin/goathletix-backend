# Technical Context: GoAthletix

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
