-- Migration to add discount fields to orders table
-- Run this SQL in your Supabase SQL Editor

-- Add discount and discount_code columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS discount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_code TEXT;

-- Add comment to describe the columns
COMMENT ON COLUMN orders.discount IS 'Discount amount applied to the order';
COMMENT ON COLUMN orders.discount_code IS 'Discount code used (e.g., SAVE10)';
