-- Supabase Address Migration for E-Commerce Orders
-- Add UK shipping address fields to the orders table
-- Run this SQL in your Supabase SQL Editor

-- Add address columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipping_address_line1 TEXT,
ADD COLUMN IF NOT EXISTS shipping_address_line2 TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT,
ADD COLUMN IF NOT EXISTS shipping_county TEXT,
ADD COLUMN IF NOT EXISTS shipping_postcode TEXT,
ADD COLUMN IF NOT EXISTS shipping_country TEXT DEFAULT 'United Kingdom';

-- Create index for postcode lookups (useful for analytics and reporting)
CREATE INDEX IF NOT EXISTS idx_orders_postcode ON orders(shipping_postcode);

-- Create index for country (useful if expanding internationally)
CREATE INDEX IF NOT EXISTS idx_orders_country ON orders(shipping_country);

-- Update existing orders to have empty/null addresses (backward compatibility)
-- This ensures existing orders won't break when displaying address information
UPDATE orders
SET
  shipping_postcode = '',
  shipping_country = 'United Kingdom'
WHERE shipping_postcode IS NULL;

-- Verification query (optional - uncomment to run after migration)
-- SELECT
--   id,
--   user_email,
--   shipping_address_line1,
--   shipping_city,
--   shipping_postcode,
--   shipping_country,
--   created_at
-- FROM orders
-- ORDER BY created_at DESC
-- LIMIT 10;
