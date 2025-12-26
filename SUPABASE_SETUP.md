# Supabase Setup Guide

This guide will help you set up Supabase to store customer orders and purchase history for your e-commerce application.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (you can use GitHub)
3. Create a new organization if prompted

## Step 2: Create a New Project

1. Click "New Project"
2. Fill in the following details:
   - **Name**: Your project name (e.g., "ecommerce-orders")
   - **Database Password**: Create a strong password (save this somewhere safe)
   - **Region**: Choose the region closest to you or your users
3. Click "Create new project"
4. Wait for the project to be created (this may take 1-2 minutes)

## Step 3: Get Your API Credentials

1. Once the project is ready, go to **Project Settings** (gear icon in the sidebar)
2. Click on **API** in the left menu
3. You'll see two important values:
   - **Project URL**: Copy this value
   - **anon/public key**: Copy this value (under "Project API keys")

## Step 4: Set Up Environment Variables

1. In your project root, create a `.env.local` file (if you don't have one already)
2. Add the Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace `your-project-url-here` and `your-anon-key-here` with the values you copied.

## Step 5: Create the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** (icon in the sidebar)
2. Click "New Query"
3. Copy the entire contents of the `supabase-schema.sql` file from your project root
4. Paste it into the SQL editor
5. Click "Run" to execute the query

This will:
- Create the `orders` table
- Set up indexes for better performance
- Enable Row Level Security (RLS) for data protection
- Create policies so users can only see their own orders
- Set up automatic timestamp updates

## Step 6: Verify the Setup

1. Go to the **Table Editor** in your Supabase dashboard
2. You should see the `orders` table listed
3. Click on it to view the structure

The table should have these columns:
- `id` (UUID, Primary Key)
- `user_id` (TEXT)
- `user_email` (TEXT)
- `user_name` (TEXT)
- `items` (JSONB)
- `subtotal` (DECIMAL)
- `tax` (DECIMAL)
- `total` (DECIMAL)
- `status` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Step 7: Test the Integration

1. Make sure your `.env.local` file is set up correctly with both Google OAuth and Supabase credentials
2. Restart your Next.js development server:
   ```bash
   npm run dev
   ```
3. Sign in with Google
4. Add some products to your cart
5. Click "Proceed to Checkout"
6. You should see a success message
7. Go to the **Orders** page to view your order history

## Step 8: View Orders in Supabase (Optional)

1. In your Supabase dashboard, go to **Table Editor**
2. Click on the `orders` table
3. You should see your test order(s) listed here

## Troubleshooting

### "Failed to create order" Error

- **Check environment variables**: Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correctly set
- **Restart dev server**: After adding environment variables, restart your Next.js dev server
- **Check Supabase console**: Go to the Logs section in Supabase to see any errors

### "Unauthorized" Error

- Make sure you're signed in with Google before placing an order
- Check that Row Level Security policies are correctly set up (run the SQL schema again if needed)

### Orders Not Showing Up

- Verify that the order was created by checking the Supabase Table Editor
- Make sure you're signed in with the same account that placed the order
- Check browser console for any JavaScript errors

## Row Level Security (RLS) Policies

The database is secured with RLS policies that ensure:
- Users can only view their own orders (based on `user_id`)
- Users can only create orders for themselves
- No user can modify or delete another user's orders

This is automatically configured when you run the `supabase-schema.sql` script.

## Next Steps

Your Supabase integration is complete! You can now:
- Place orders and they'll be saved to Supabase
- View order history on the `/orders` page
- Customize the order status workflow
- Add email notifications when orders are placed
- Export order data for analytics

## Additional Features to Consider

1. **Order Status Updates**: Create an admin panel to update order statuses
2. **Email Notifications**: Send confirmation emails when orders are placed
3. **Order Cancellation**: Allow users to cancel pending orders
4. **Advanced Filtering**: Filter orders by status, date range, etc.
5. **Export Orders**: Add functionality to export orders as CSV/PDF

For more information, check out the [Supabase Documentation](https://supabase.com/docs).
