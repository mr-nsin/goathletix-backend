-- Multi-day events: rename event_date -> start_date and add a nullable end_date.
-- Decision: 03 Decisions/ADR-001-multi-day-event-dates.md (accepted 2026-09-09).
--
-- Rewritten 2026-09-10 to be idempotent and transactional. The original version used a bare
-- `ALTER TABLE IF EXISTS ... RENAME COLUMN event_date TO start_date`, which guards only the table's
-- existence, not the column's — so a second run errored. This version is safe to re-run.
--
-- Port 5432 is firewalled on the corporate network, so apply this from the Supabase dashboard
-- SQL editor (see CLAUDE.md section 5), not via psql or Prisma.
--
-- NOTE: the `reminder_type` enum contains a VALUE named 'event_date'
-- (20260710000001_auth_features.sql:59). That is a reminder kind, NOT a column. It must keep its
-- name. Never apply a blanket find-and-replace of "event_date" across this schema.

BEGIN;

-- 1. events ------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'event_date'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'start_date'
  ) THEN
    ALTER TABLE public.events RENAME COLUMN event_date TO start_date;
    RAISE NOTICE 'events: renamed event_date -> start_date';
  ELSE
    RAISE NOTICE 'events: rename skipped (already applied or source column absent)';
  END IF;
END $$;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_date DATE;

-- Backfill so single-day rows are never null for range-overlap query logic.
UPDATE public.events SET end_date = start_date WHERE end_date IS NULL;

-- 2. event_requests ---------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'event_requests' AND column_name = 'event_date'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'event_requests' AND column_name = 'start_date'
  ) THEN
    ALTER TABLE public.event_requests RENAME COLUMN event_date TO start_date;
    RAISE NOTICE 'event_requests: renamed event_date -> start_date';
  ELSE
    RAISE NOTICE 'event_requests: rename skipped (already applied or source column absent)';
  END IF;
END $$;

ALTER TABLE public.event_requests ADD COLUMN IF NOT EXISTS end_date DATE;
UPDATE public.event_requests SET end_date = start_date WHERE end_date IS NULL;

-- 3. Index for range-overlap filtering --------------------------------------
-- Queries become `start_date <= :rangeEnd AND end_date >= :rangeStart`, so the existing
-- single-column idx_events_date (which survives the rename, still covering start_date) is not
-- enough on its own.
CREATE INDEX IF NOT EXISTS idx_events_start_end ON public.events (start_date, end_date);

-- 4. Integrity guard --------------------------------------------------------
-- Passes trivially after the backfill above (end_date = start_date). If it fails, some row has
-- end_date < start_date and the whole transaction rolls back — which is the desired outcome.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'events_end_date_gte_start_date'
  ) THEN
    ALTER TABLE public.events
      ADD CONSTRAINT events_end_date_gte_start_date
      CHECK (end_date IS NULL OR end_date >= start_date);
    RAISE NOTICE 'events: added CHECK events_end_date_gte_start_date';
  END IF;
END $$;

COMMIT;
