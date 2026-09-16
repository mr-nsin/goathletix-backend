-- 0005 — Extend the sport_category enum for the 2026-09 scope broadening (ADR-006).
--
-- RUN THIS FILE ON ITS OWN, AND COMMIT IT, BEFORE RUNNING 0006.
--
-- Postgres will not let a newly added enum value be USED in the same transaction that adds it.
-- Every statement here only ADDS values; nothing reads or writes them. 0006 does the reading and
-- writing, which is why it is a separate file. Do not merge these two.
--
-- ALTER TYPE ... ADD VALUE is additive and idempotent via IF NOT EXISTS. Enum values cannot later
-- be renamed or removed, so add only values we intend to keep (ADR-006).

ALTER TYPE sport_category ADD VALUE IF NOT EXISTS 'athletics';
ALTER TYPE sport_category ADD VALUE IF NOT EXISTS 'skating';
ALTER TYPE sport_category ADD VALUE IF NOT EXISTS 'gymnastics';
ALTER TYPE sport_category ADD VALUE IF NOT EXISTS 'martial_arts';
ALTER TYPE sport_category ADD VALUE IF NOT EXISTS 'team_sports';
ALTER TYPE sport_category ADD VALUE IF NOT EXISTS 'mind_sports';

-- Verify (expect 14 rows):
--   SELECT enumlabel FROM pg_enum
--   WHERE enumtypid = 'sport_category'::regtype ORDER BY enumsortorder;
