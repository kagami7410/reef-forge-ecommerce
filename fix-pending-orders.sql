-- Quick Fix for Pending Orders
-- Run this in Supabase SQL Editor to update all pending orders to confirmed

-- First, let's see how many pending orders we have
SELECT
  id,
  user_email,
  status,
  total,
  created_at
FROM orders
WHERE status = 'pending'
ORDER BY created_at DESC;

-- Update all pending orders to confirmed
-- UNCOMMENT THE LINES BELOW TO RUN THE UPDATE:

-- UPDATE orders
-- SET status = 'confirmed'
-- WHERE status = 'pending';

-- Verify the update
-- SELECT
--   id,
--   user_email,
--   status,
--   total,
--   created_at
-- FROM orders
-- WHERE status = 'confirmed'
-- ORDER BY created_at DESC
-- LIMIT 10;
