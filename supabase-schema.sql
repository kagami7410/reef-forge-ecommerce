-- Supabase Database Schema for E-Commerce Orders
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  discount_code TEXT,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'completed', 'cancelled')),
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  USING (user_id = auth.uid()::text);

-- Create policy to allow users to insert their own orders
CREATE POLICY "Users can create their own orders"
  ON orders
  FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

-- Create policy to allow users to update their own orders (optional)
CREATE POLICY "Users can update their own orders"
  ON orders
  FOR UPDATE
  USING (user_id = auth.uid()::text);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to call the function
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample query to verify table creation
-- SELECT * FROM orders LIMIT 10;
