# Vercel Deployment Quick Start

This guide will help you deploy your e-commerce application to Vercel in under 30 minutes.

## Prerequisites

Before you begin, ensure you have:
- A GitHub account with this repository pushed
- A Vercel account (free or Pro)
- Supabase project set up and running
- Stripe account activated
- Cloudinary account configured

## Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
vercel login
```

## Step 2: Connect GitHub to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

## Step 3: Configure Environment Variables

In the Vercel dashboard, add these environment variables:

### Required Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### Optional Variables (if using Google OAuth)

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### How to Add Variables in Vercel:

1. In your project dashboard, go to "Settings" → "Environment Variables"
2. Add each variable with:
   - **Name**: The variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: The actual value
   - **Environment**: Select "Production", "Preview", and "Development"
3. Click "Save"

## Step 4: Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL to: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret
6. Add it to Vercel as `STRIPE_WEBHOOK_SECRET`

## Step 5: Deploy

### Option A: Deploy via Vercel Dashboard

1. Click "Deploy" in your Vercel project
2. Wait for build to complete (3-5 minutes)
3. Your site will be live at `https://your-project.vercel.app`

### Option B: Deploy via CLI

```bash
# Deploy to production
vercel --prod
```

### Option C: Deploy via Git Push (Automated)

```bash
# Push to main branch triggers automatic deployment
git push origin main
```

## Step 6: Add Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic, 1-2 minutes)
5. Update `NEXT_PUBLIC_SITE_URL` environment variable to your custom domain
6. Update Stripe webhook URL to your custom domain

## Step 7: Verify Deployment

Run these quick checks:

### 1. Health Check
```bash
curl https://your-domain.vercel.app/api/health
```
Should return: `{"status":"ok"}`

### 2. Test Homepage
Open `https://your-domain.vercel.app` in your browser

### 3. Test Authentication
Try signing in with Google OAuth

### 4. Test Payment Flow
1. Add a product to cart
2. Go to checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete the order
5. Verify order appears in Supabase

## Troubleshooting

### Build Fails

**Error**: "Module not found" or dependency errors
- **Solution**: Ensure `package.json` includes all dependencies
- Run `npm install` locally and commit any changes

**Error**: Environment variable not found
- **Solution**: Double-check all environment variables are set in Vercel dashboard
- Ensure variables are marked for "Production" environment

### Database Connection Issues

**Error**: "Failed to connect to database"
- **Solution**:
  - Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
  - Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
  - Ensure Supabase project is running

### Stripe Webhook Issues

**Error**: Webhook signature verification failed
- **Solution**:
  - Verify `STRIPE_WEBHOOK_SECRET` matches the one in Stripe dashboard
  - Ensure webhook URL is correct (must be full URL with https://)
  - Check webhook endpoint is receiving requests in Stripe dashboard

### Images Not Loading

**Error**: Images return 403 or 404
- **Solution**:
  - Verify Cloudinary cloud name in `lib/imageConfig.ts`
  - Check image domains in `next.config.js`
  - Ensure images exist in Cloudinary

## Environment Variable Reference

| Variable | Required | Where to Get It | Example |
|----------|----------|-----------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase Dashboard → Settings → API | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Dashboard → Settings → API | `eyJhbGc...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe Dashboard → Developers → API Keys | `pk_live_...` |
| `STRIPE_SECRET_KEY` | Yes | Stripe Dashboard → Developers → API Keys | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe Dashboard → Webhooks → Signing secret | `whsec_...` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your deployment URL or custom domain | `https://yoursite.com` |
| `GOOGLE_CLIENT_ID` | No | Google Cloud Console → Credentials | `123456-xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | No | Google Cloud Console → Credentials | `GOCSPX-xxx` |

## Performance Optimization

After deployment, consider these optimizations:

1. **Enable Vercel Analytics** (in dashboard)
2. **Monitor Core Web Vitals**
3. **Set up error tracking** (Sentry)
4. **Configure uptime monitoring** (Better Uptime)
5. **Review and optimize slow queries** in Supabase

## Security Checklist

Before going live:

- [ ] All environment variables are set in Vercel (not in code)
- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] 2FA enabled on Vercel, GitHub, Supabase, and Stripe
- [ ] Stripe webhook signature validation is working
- [ ] Security headers are configured in `next.config.js`
- [ ] SSL certificate is active (automatic with Vercel)
- [ ] Test successful payment and webhook delivery

## Automatic Deployments

Vercel automatically deploys when you:

1. **Push to main branch** → Production deployment
2. **Open a PR** → Preview deployment (test URL)
3. **Push to any branch** → Preview deployment

You can customize this in Vercel dashboard → Settings → Git.

## Rollback

If you need to rollback to a previous version:

### Via Dashboard
1. Go to "Deployments" tab
2. Find the previous stable deployment
3. Click three dots → "Promote to Production"

### Via CLI
```bash
vercel rollback
```

## Monitoring Your Application

1. **Vercel Dashboard**: View deployment logs, analytics, and performance
2. **Supabase Dashboard**: Monitor database queries and performance
3. **Stripe Dashboard**: Track payments and webhook deliveries
4. **Browser DevTools**: Check for console errors

## Next Steps

1. Review comprehensive deployment docs: `DEPLOYMENT_CHECKLIST.md`
2. Set up monitoring and error tracking
3. Configure custom domain
4. Test all critical user flows
5. Monitor error rates and performance

## Cost Estimate

With Vercel free tier:
- Vercel: $0/month (Hobby tier) or $20/month (Pro)
- Supabase: $25/month (Pro tier recommended)
- Stripe: 2.9% + $0.30 per transaction
- Cloudinary: $0/month (free tier)
- **Total**: ~$25-45/month + transaction fees

## Support

- Vercel Docs: [https://vercel.com/docs](https://vercel.com/docs)
- Vercel Support: support@vercel.com
- Community: [Vercel Discord](https://vercel.com/discord)

## Success!

Your e-commerce site is now live on Vercel! 🎉

Monitor your deployment and address any issues as they arise. For detailed operational procedures, see `DEPLOYMENT_CHECKLIST.md`.
