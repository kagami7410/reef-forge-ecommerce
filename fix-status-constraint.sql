-- Step 1: Check what the current constraint allows
-- Run this first to see what values are allowed:
SELECT
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'orders_status_check';

-- Step 2: See what statuses currently exist in the database
SELECT DISTINCT status, COUNT(*) as count
FROM orders
GROUP BY status
ORDER BY status;

-- Step 3: Drop the old constraint and create a new one that allows 'paid'
-- UNCOMMENT AND RUN THIS AFTER CHECKING THE ABOVE QUERIES:

-- ALTER TABLE orders
-- DROP CONSTRAINT IF EXISTS orders_status_check;

-- ALTER TABLE orders
-- ADD CONSTRAINT orders_status_check
-- CHECK (status IN ('pending', 'paid', 'cancelled', 'failed', 'confirmed'));

-- Step 4: Verify the new constraint
-- SELECT
--   conname AS constraint_name,
--   pg_get_constraintdef(oid) AS constraint_definition
-- FROM pg_constraint
-- WHERE conname = 'orders_status_check';
