# Backend Technology Selection: NestJS vs. FastAPI

To support **GoAthletix** (handling 100M+ events, real-time activity feeds, and automated migrations directly from the backend code), we compare **NestJS** and **FastAPI** to make a definitive architectural recommendation.

---

## 1. Comparative Analysis

| Criteria | FastAPI (Python) | NestJS (TypeScript) | Winner for GoAthletix |
|----------|------------------|---------------------|-----------------------|
| **Language Stack** | Python (Sync/Async) | TypeScript / Node.js | **NestJS** (Unified language stack: Next.js + NestJS means sharing type interfaces and interfaces directly). |
| **Real-time / WebSockets** | 🟢 **Good**. Native async WebSocket support. | 🟢 **Excellent**. Built-in modular **Gateways** utilizing Socket.io or ws libraries under the hood. | **NestJS** (Opinionated structure for gateways makes maintaining real-time events cleaner). |
| **Database ORM & Migrations** | 🟡 **Moderate**. SQLModel or SQLAlchemy + Alembic for migrations. | 🟢 **Excellent**. Native integration with **Prisma ORM** (the industry standard for serverless PostgreSQL/Supabase migration workflows). | **NestJS** (Prisma CLI generates and runs SQL migrations seamlessly: `npx prisma migrate dev`). |
| **Architecture Enforcements** | ❌ None. You must define your own folder structure and dependency injection logic. | 🟢 **Strict**. Enforces a clean controller-service-module design pattern with Dependency Injection. | **NestJS** (Highly maintainable for teams and parallel autonomous agent builders). |
| **Crawler Integration** | 🟢 **Native**. Easily import python crawler libraries (Scrapy, Playwright). | 🟡 **Requires Process Spawn**. Must invoke python crawler scripts via child processes. | **FastAPI** (We run the crawler natively, though NestJS can easily trigger them via CLI execution). |

---

## 2. Why NESTJS is the Recommended Backend

For **GoAthletix**, we recommend **NestJS (TypeScript)** as the primary backend server, with a side-car worker script in **Python** executing the scrapers:

1.  **Unified TypeScript Ecosystem**:
    *   Using TypeScript for both the Next.js frontend and NestJS backend allows us to share code, DTOs (Data Transfer Objects), and validation logic.
2.  **Prisma Migrations Support**:
    *   Prisma makes database migrations to Supabase simple. You write the schema in `schema.prisma`, and running `npx prisma migrate dev` automatically generates migration files and applies them directly to Supabase.
3.  **Built-in WebSocket Gateways**:
    *   Our **Live Activity Feed** requires WebSockets to broadcast user actions (saves, follows) instantly. NestJS has first-class support for WebSocket Gateways, making real-time setup clean and modular.
4.  **Modular Dependency Injection**:
    *   NestJS modules (e.g. `EventModule`, `UserModule`, `ActivityFeedModule`) keep code decoupled. This makes it easier for multiple agents to write clean code simultaneously without conflicts.

---

## 3. How the Live Activity Feed Architecture Works

To power the live ticker showing public interactions in real-time, the flow is:

```
  [ User Client ] -> [ Trigger Save Event ] -> [ PostgreSQL (Triggers log) ]
         ^                                                   |
         | (WebSocket Broadcast)                             v
  [ NestJS Gateway ] <---------- (PG Listen / Notify) -------+
```

1.  **Event Logger**: When a user saves an event or follows an organizer, a PostgreSQL row trigger inserts a record into the `activity_logs` table (using the schema written in `20260710000002_activity_feed.sql`).
2.  **Real-Time Channel**: The NestJS gateway listens to PostgreSQL's native `LISTEN/NOTIFY` channel or Supabase's Realtime broadcast.
3.  **Broadcast**: When a new activity log is generated, NestJS pushes the activity payload (e.g. *"Arjun S. followed Tour of Nilgiris"*) via WebSockets to all connected clients, rendering the scrolling ticker smoothly.
