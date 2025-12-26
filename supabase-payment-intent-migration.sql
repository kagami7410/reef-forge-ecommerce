-- Supabase Payment Intent Migration for E-Commerce Orders
-- Add Stripe Payment Intent fields to the orders table
-- Run this SQL in your Supabase SQL Editor

-- Add payment intent columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_status TEXT,
ADD COLUMN IF NOT EXISTS shipping_name TEXT;

-- Create index for payment intent lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(payment_intent_id);

-- Create index for payment status
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(stripe_payment_status);

-- Verification query (optional - uncomment to run after migration)
-- SELECT
--   id,
--   user_email,
--   payment_intent_id,
--   stripe_payment_status,
--   status,
--   shipping_name,
--   shipping_address_line1,
--   created_at
-- FROM orders
-- ORDER BY created_at DESC
-- LIMIT 10;
