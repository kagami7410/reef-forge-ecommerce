import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client-side Supabase client (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (bypasses RLS)
// Use this in API routes for admin operations
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback to regular client if service role key not set

// Types for our database tables
export interface OrderItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  address_line1: string;
  address_line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  discount_code?: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'paid';
  payment_intent_id?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_county?: string;
  shipping_postcode?: string;
  shipping_country?: string;
  created_at: string;
}

export interface DatabaseOrder {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  discount_code?: string;
  total: number;
  status: string;
  payment_intent_id?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_county?: string;
  shipping_postcode?: string;
  shipping_country?: string;
  created_at: string;
}
