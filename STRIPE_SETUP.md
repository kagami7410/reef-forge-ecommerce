# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment processing for your e-commerce application.

## Overview

The application now uses Stripe Checkout for secure payment processing. When users proceed to checkout:
1. An order is created in Supabase with status 'pending'
2. A Stripe Checkout session is created
3. User is redirected to Stripe's hosted checkout page
4. After payment, Stripe webhook updates the order status to 'paid'
5. User is redirected back to the orders page

## Step 1: Update Supabase Database Schema

You need to add Stripe-related fields to your orders table.

### Option A: If you haven't created the orders table yet

Run the updated `supabase-schema.sql` file in your Supabase SQL Editor:
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** or press Ctrl+Enter

### Option B: If the orders table already exists

Run this SQL to add the new columns:

```sql
-- Add Stripe columns to existing orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent TEXT;

-- Update the status check constraint to include 'paid'
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'paid', 'processing', 'completed', 'cancelled'));
```

## Step 2: Get Your Stripe API Keys

### 2.1 Create a Stripe Account
1. Go to https://stripe.com
2. Sign up for a free account
3. Verify your email address

### 2.2 Get Test API Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"
3. Copy both keys

**Note:** These are test keys. For production, you'll use live keys from https://dashboard.stripe.com/apikeys

## Step 3: Configure Webhook

Webhooks allow Stripe to notify your app when payments succeed or fail.

### For Local Development (using Stripe CLI)

1. **Install Stripe CLI:**
   - Windows: Download from https://github.com/stripe/stripe-cli/releases
   - Mac: `brew install stripe/stripe-cli/stripe`
   - Linux: See https://stripe.com/docs/stripe-cli#install

2. **Login to Stripe CLI:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to your local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy the webhook signing secret:**
   - After running the command above, you'll see output like:
     ```
     > Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
     ```
   - Copy this secret (starts with `whsec_`)

### For Production Deployment

1. Go to https://dashboard.stripe.com/webhooks
2. Click **+ Add endpoint**
3. Enter your webhook URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```
4. Select events to listen to:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

## Step 4: Update Environment Variables

Your `.env.local` file should already have Stripe keys. Verify they are correctly set:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Important:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_test_`
- `STRIPE_SECRET_KEY` starts with `sk_test_`
- `STRIPE_WEBHOOK_SECRET` starts with `whsec_`

## Step 5: Restart Your Development Server

After updating environment variables, restart your dev server:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Step 6: Test the Integration

### Test with Stripe Test Cards

Stripe provides test card numbers that simulate different scenarios:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Declined Payment:**
- Card: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Requires Authentication (3D Secure):**
- Card: `4000 0025 0000 3155`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

More test cards: https://stripe.com/docs/testing

### Testing Steps

1. **Add products to cart**
   - Go to http://localhost:3000/products
   - Add some items to your cart

2. **Sign in**
   - Make sure you're signed in with Google OAuth

3. **Proceed to checkout**
   - Go to http://localhost:3000/cart
   - Click "Proceed to Checkout"

4. **Complete payment on Stripe**
   - You'll be redirected to Stripe's checkout page
   - Use test card: `4242 4242 4242 4242`
   - Enter any future date, any CVC, any ZIP
   - Click "Pay"

5. **Verify success**
   - You should be redirected to `/orders`
   - You should see a success message
   - The order should show status "Paid"
   - Your cart should be cleared

6. **Check webhook logs**
   - In your Stripe CLI terminal, you should see:
     ```
     checkout.session.completed
     ```
   - In your app terminal, you should see:
     ```
     Order {order-id} marked as paid
     ```

## Troubleshooting

### "No webhook secret found"
- Make sure `STRIPE_WEBHOOK_SECRET` is set in `.env.local`
- Make sure you've restarted your dev server
- Check that the Stripe CLI is running (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`)

### "Webhook signature verification failed"
- The webhook secret doesn't match
- Get a fresh secret from Stripe CLI or Stripe Dashboard
- Update `.env.local` and restart server

### "Payment succeeded but order status is still pending"
- Check webhook is configured correctly
- Make sure Stripe CLI is running (for local dev)
- Check your server logs for errors
- Verify the order_id is being passed correctly in metadata

### "Redirected to Stripe but no payment page"
- Check that `NEXT_PUBLIC_SITE_URL` is set correctly in `.env.local`
- Verify Stripe publishable key is correct
- Check browser console for errors

## Production Deployment Checklist

When deploying to production:

1. **Get live Stripe keys:**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your **live** publishable and secret keys
   - Update environment variables in your hosting platform

2. **Create production webhook:**
   - Go to https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`
   - Copy the signing secret

3. **Update environment variables:**
   - Use live keys instead of test keys
   - Update `NEXT_PUBLIC_SITE_URL` to your production domain
   - Set `STRIPE_WEBHOOK_SECRET` to your production webhook secret

4. **Test in production:**
   - Use real card or test mode
   - Verify orders are created and updated correctly
   - Check webhook delivery in Stripe Dashboard

## Security Best Practices

- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Never expose your `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET`
- ✅ Always verify webhook signatures before processing events
- ✅ Use HTTPS in production
- ✅ Keep Stripe SDK up to date
- ✅ Monitor webhook delivery in Stripe Dashboard
- ✅ Set up proper error logging and monitoring

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

## Support

If you encounter issues:
1. Check the Stripe Dashboard for payment events
2. Check webhook delivery logs in Stripe Dashboard
3. Review server logs for errors
4. Verify all environment variables are set correctly
5. Ensure Supabase schema is updated correctly
