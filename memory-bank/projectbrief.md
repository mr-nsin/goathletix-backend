# Project Brief: GoAthletix

> **⚠ PARTLY ASPIRATIONAL — verify before planning against this file.**
> The product vision is still valid, but the technical and delivery claims are not. Cross-check any
> capability statement against `memory-bank/activeContext.md` and
> `01 Product/Feature status and gaps.md` — of the 13 P0 features declared in
> `docs/05-feature-inventory.md`, 0 are built, 6 partial, 7 not built. Verified 2026-09-09.

## Ultimate Goal
Build the definitive discovery-first, multi-sport event and community platform, starting with India first and expanding to Southeast Asia and globally.

## Core Value Proposition
- Solve sports event fragmentation across websites, Instagram, WhatsApp, and local clubs.
- Focus on discovery, side-by-side comparison, season planning, and organic WhatsApp/Instagram distribution.
- **Strictly No Ticketing/Payments in v1**: Redirect users directly to official organizer registration links.

## Key Focus Areas
- **Landing Page**: Visually stunning introduction explaining what the platform is, with "Discover" options in headers.
- **Popular Curations**: Group events by sports category, location, and country (starting with India).
- **Advanced Filtering**: Enable filtering by sport type, date, location, distance, elevation, difficulty, and terrain.
- **Automated Crawler**: Python/Go crawler scanning major/minor websites, Instagram pages, and other event platforms, with AI parsing (via OpenRouter/LLM) to normalize unstructured text and save it to PostgreSQL.
- **Agentic Operations**: Leverage Paperclip to define a multi-agent team (Scraper, Editor, Auditor, Growth) running in parallel to keep the database fresh.
