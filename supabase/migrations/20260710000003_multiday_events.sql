-- 1. Modify Events Table to support multi-day events
ALTER TABLE IF EXISTS public.events 
  RENAME COLUMN event_date TO start_date;

ALTER TABLE IF EXISTS public.events 
  ADD COLUMN IF NOT EXISTS end_date DATE;

-- Populate end_date with start_date value for existing rows so it is never null for single-day query logic
UPDATE public.events 
  SET end_date = start_date 
  WHERE end_date IS NULL;

-- 2. Modify Event Requests Table to support multi-day events
ALTER TABLE IF EXISTS public.event_requests 
  RENAME COLUMN event_date TO start_date;

ALTER TABLE IF EXISTS public.event_requests 
  ADD COLUMN IF NOT EXISTS end_date DATE;

UPDATE public.event_requests 
  SET end_date = start_date 
  WHERE end_date IS NULL;
