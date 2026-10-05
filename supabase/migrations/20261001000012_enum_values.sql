-- 0012 · New enum values for the product requirements in docs/05-feature-inventory.md.
--
-- RUN THIS FILE ON ITS OWN, BEFORE 0013-0021.
-- Postgres cannot *use* an enum value inside the same transaction that added it (55P04), and the
-- Supabase SQL editor runs a pasted script as one transaction. 0013+ reference these values, so this
-- file must be committed first. Every statement is idempotent (IF NOT EXISTS), so re-running is safe.
--
-- Contract note (CLAUDE.md §5): DTOs import enums from @prisma/client, so after applying, mirror the
-- values in prisma/schema.prisma and run `npx prisma generate`.

-- Live activity feed (#38, #50): actions the new tables emit. Existing: save, follow, calendar_add.
ALTER TYPE activity_action ADD VALUE IF NOT EXISTS 'interest';
ALTER TYPE activity_action ADD VALUE IF NOT EXISTS 'going';
ALTER TYPE activity_action ADD VALUE IF NOT EXISTS 'review';
ALTER TYPE activity_action ADD VALUE IF NOT EXISTS 'result_published';
ALTER TYPE activity_action ADD VALUE IF NOT EXISTS 'event_listed';
ALTER TYPE activity_action ADD VALUE IF NOT EXISTS 'registered';   -- ticketing (0022), anonymised in the feed

-- Footer "Report an incorrect listing" (spec §8).
ALTER TYPE feedback_type ADD VALUE IF NOT EXISTS 'listing_correction';

-- Events that move rather than cancel — common for monsoon and heat postponements.
ALTER TYPE event_status ADD VALUE IF NOT EXISTS 'postponed';

-- Sold-out events offer a waitlist instead of a dead "Entries closed" (event-platform research #13).
ALTER TYPE interest_status ADD VALUE IF NOT EXISTS 'waitlisted';

-- Follow a marketplace seller (#56).
ALTER TYPE follow_entity ADD VALUE IF NOT EXISTS 'seller';
