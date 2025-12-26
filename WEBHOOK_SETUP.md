# Stripe Webhook Setup Guide

## Problem
Orders are stuck at "pending" status because webhook events aren't being received.

## Solution: Set Up Stripe CLI for Local Testing

### Step 1: Install Stripe CLI

**Windows:**
```bash
# Using Scoop
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Or download from: https://github.com/stripe/stripe-cli/releases
```

**Mac/Linux:**
```bash
brew install stripe/stripe-cli/stripe
```

### Step 2: Login to Stripe CLI
```bash
stripe login
```
This will open your browser to authenticate.

### Step 3: Forward Webhooks to Your Local Server

**Open a NEW terminal window** (keep your Next.js dev server running in the first one):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

You should see output like:
```
> Ready! Your webhook signing secret is whsec_xxxxx (^C to quit)
```

### Step 4: Verify Webhook Secret

The webhook secret shown in the Stripe CLI should match the one in your `.env.local`:

Your current secret: `whsec_005e4e26345a7a6552d0a4767f392ce874af129f7b22f29aa5910cc29c3bdf90`

If it's different, update `.env.local` with the new secret and **restart your Next.js dev server**.

### Step 5: Test the Flow

1. Make sure both terminals are running:
   - Terminal 1: `npm run dev` (Next.js server)
   - Terminal 2: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

2. Go to your app and complete a checkout with a test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

3. Watch the Stripe CLI terminal - you should see webhook events being forwarded:
   ```
   2024-12-24 12:00:00   --> payment_intent.created [evt_xxxxx]
   2024-12-24 12:00:05   --> payment_intent.succeeded [evt_xxxxx]
   ```

4. Check your Next.js terminal for logs:
   ```
   Order updated successfully: [order-id]
   ```

5. Refresh the orders page - status should now be "confirmed"

## Option 2: Manual Update (Temporary Fix)

If you need to fix pending orders right now, you can manually update them in Supabase:

1. Go to your Supabase Dashboard
2. Open the SQL Editor
3. Run this query to update all pending orders:

```sql
UPDATE orders
SET status = 'confirmed'
WHERE status = 'pending';
```

## Troubleshooting

### Webhook events not showing up in CLI
- Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Check that port 3000 is correct (match your Next.js dev server port)

### Orders still pending
- Check Next.js terminal for error logs
- Verify webhook secret matches between CLI output and `.env.local`
- Restart Next.js dev server after updating `.env.local`

### "No order_id in payment intent metadata" error
- This means the order wasn't created properly
- Check browser console for errors during checkout
- Verify the payment intent API is working

### Database errors in webhook handler
- Run the migration: `supabase-payment-intent-migration.sql`
- Check that columns exist: `payment_intent_id`, `stripe_payment_status`, `shipping_name`

## For Production

When deploying to production:

1. Go to Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed` (for backward compatibility)
4. Copy the webhook signing secret
5. Add it to your production environment variables as `STRIPE_WEBHOOK_SECRET`
