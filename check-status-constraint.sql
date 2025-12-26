-- Check what values are allowed for order status
SELECT
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'orders_status_check';

-- Check current orders and their statuses
SELECT DISTINCT status
FROM orders
ORDER BY status;
