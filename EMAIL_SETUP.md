# Email Setup Guide - Order Confirmation Emails

This guide will help you set up email notifications for successful orders using Resend.

## Features

When a customer completes a payment, they will automatically receive a beautiful order confirmation email with:
- Order details and order ID
- List of purchased items with images
- Order total with any discounts applied
- Shipping address
- Contact information for support

## Setup Steps

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up for a free account
2. Free tier includes **100 emails per day** (perfect for testing and small stores)

### 2. Get Your API Key

1. Once logged in, go to [API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "E-commerce Store")
4. Copy the API key (starts with `re_`)

### 3. Add Environment Variables

Add these to your `.env.local` file:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**For Testing:**
- Use `onboarding@resend.dev` as the from email (Resend's default testing email)

**For Production:**
1. Add and verify your domain in Resend dashboard
2. Update `RESEND_FROM_EMAIL` to your custom email (e.g., `orders@yourdomain.com`)

### 4. Test the Email Flow

1. Make sure your Stripe webhook is set up (see main README)
2. Add items to cart and proceed to checkout
3. Complete a test payment using Stripe test card: `4242 4242 4242 4242`
4. Check the email inbox for the customer email used during checkout

## Email Template Customization

The email template is located at: `lib/emails/order-confirmation.ts`

You can customize:
- Email subject line
- Colors and styling
- Content and messaging
- Support email address
- Company name and branding

## Troubleshooting

### Emails not sending?

1. **Check server logs** - Look for "Order confirmation email sent" or error messages
2. **Verify API key** - Make sure `RESEND_API_KEY` is correct in `.env.local`
3. **Check webhook** - Ensure Stripe webhook is configured and receiving `payment_intent.succeeded` events
4. **Test Resend directly** - Try sending a test email from Resend dashboard

### Email goes to spam?

- For testing, this is normal with `onboarding@resend.dev`
- For production, verify your domain in Resend and configure SPF/DKIM records
- Add a custom domain email address

### Common Issues

**Error: "RESEND_API_KEY is not defined"**
- Add the API key to your `.env.local` file
- Restart your development server after adding it

**Error: "You can only send emails from onboarding@resend.dev"**
- You're trying to use a custom email without verifying your domain
- Either use `onboarding@resend.dev` for testing or verify your domain

## Email Flow

```
Customer completes payment
    ↓
Stripe sends webhook to /api/webhooks/stripe
    ↓
Webhook handler updates order status to "paid"
    ↓
Webhook fetches complete order details
    ↓
Email template is generated with order info
    ↓
Resend sends email to customer
    ↓
Customer receives order confirmation
```

## Production Considerations

1. **Domain Verification**: Verify your domain in Resend for better deliverability
2. **Email Limits**: Free tier = 100 emails/day, paid plans start at $20/month for 50,000 emails
3. **Error Handling**: Emails failures don't block the order (webhook still succeeds)
4. **Logging**: All email sends are logged to server console
5. **Testing**: Always test in staging before deploying to production

## Support

For Resend-specific issues, check:
- [Resend Documentation](https://resend.com/docs)
- [Resend Status](https://status.resend.com)
- [Resend Support](https://resend.com/support)
