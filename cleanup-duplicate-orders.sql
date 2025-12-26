-- Clean up duplicate pending orders
-- This removes pending orders that have a corresponding paid order

-- Step 1: See which orders have both pending and paid versions
SELECT
  user_email,
  status,
  payment_intent_id,
  created_at,
  total
FROM orders
WHERE user_email IN (
  SELECT user_email
  FROM orders
  GROUP BY user_email
  HAVING COUNT(*) > 1
)
ORDER BY user_email, created_at DESC;

-- Step 2: Delete pending orders that don't have a payment_intent_id
-- (these are likely duplicates that were never paid)
-- UNCOMMENT TO RUN:

-- DELETE FROM orders
-- WHERE status = 'pending'
-- AND payment_intent_id IS NULL;

-- Step 3: Or if you want to keep them but mark as cancelled:
-- UPDATE orders
-- SET status = 'cancelled'
-- WHERE status = 'pending'
-- AND payment_intent_id IS NULL;

-- Step 4: Verify the cleanup
-- SELECT status, COUNT(*) as count
-- FROM orders
-- GROUP BY status
-- ORDER BY status;
