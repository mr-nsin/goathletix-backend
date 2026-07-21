# Active Context: GoAthletix

## Current Focus
Developing the implementation plan and structuring the architecture for:
1. **Web App Layout**: Landing page explaining the value proposition, top-nav header with "Discover" options, advanced filters, and popular events categorized by sport/location.
2. **Crawler Pipeline**: Multi-site Python/Go web crawler to aggregate events, normalise details using LLMs (via OpenRouter), and ingest them into a **Neon Database** (serverless PostgreSQL). *Note: Zero sample/dummy seed data will be used; the ingestion must immediately extract live data from actual sites like Townscript.*
3. **UI Engine (Google Stitch)**: Crafting high-fidelity, experience-heavy, 3D/immersive visual components using web technologies (Three.js/WebGL hooks, glassmorphic cards, custom shader animations, fluid micro-interactions) built via Google Stitch.
4. **Multi-Agent Operations**: Designing a Paperclip organization chart with specialized agents (Scraper Agent, Editorial Agent, Compliance Auditor Agent) executing in parallel.

## Next Steps
- Establish Neon DB connection configuration.
- Develop python/go live crawlers for Townscript and sports event websites.
- Provide the ultimate Google Stitch prompt for building a highly aesthetic, experience-heavy 3D landing page.

