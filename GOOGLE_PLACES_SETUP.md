# Google Places API Setup Guide

This guide will help you set up the Google Places API for UK postcode-based address lookup in your e-commerce application.

## Overview

The checkout flow uses Google Places API to:
1. **Geocode UK postcodes** - Convert postcodes (e.g., "SW1A 1AA") into latitude/longitude coordinates
2. **Find nearby addresses** - Search for specific street addresses within that postcode area
3. **Parse address components** - Extract street, city, county, and postcode from the results

## Prerequisites

- Google Cloud Platform account
- Billing enabled (Google provides $200 free credit monthly)
- Your project deployed or running locally

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter a project name (e.g., "E-Commerce Address Lookup")
4. Click **Create**
5. Wait for the project to be created and select it

## Step 2: Enable Required APIs

You need to enable **two APIs** for the address lookup feature to work:

### Enable Places API

1. In the Google Cloud Console, navigate to **APIs & Services** → **Library**
2. Search for "**Places API**"
3. Click on **Places API** (not "Places API (New)")
4. Click **Enable**
5. Wait for it to be enabled

### Enable Geocoding API

1. Still in **APIs & Services** → **Library**
2. Search for "**Geocoding API**"
3. Click on **Geocoding API**
4. Click **Enable**
5. Wait for it to be enabled

## Step 3: Set Up Billing

**Important:** Google Places API requires billing to be enabled, even though you get $200 free credit monthly.

1. Go to **Billing** in the left sidebar
2. Click **Link a billing account** or **Create billing account**
3. Follow the prompts to enter your payment information
4. Google will not charge you until you exceed the free tier

### Pricing Information (as of 2025)

- **Geocoding API**: ~$5 per 1,000 requests
- **Places API (Nearby Search)**: ~$32 per 1,000 requests
- **Free tier**: $200 credit per month (covers ~5,000-6,000 lookups)

**Note:** For typical e-commerce sites, the free tier is usually sufficient.

## Step 4: Create an API Key

### Generate the API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **API Key**
3. Copy the API key immediately (you'll need it later)
4. The key will be displayed as: `AIza...`

### Restrict the API Key (Recommended)

For security, restrict your API key to prevent unauthorized use:

1. Click **Edit API key** (or click the key name in the credentials list)
2. Under **API restrictions**:
   - Select **Restrict key**
   - Check the boxes for:
     - ✅ **Geocoding API**
     - ✅ **Places API**
3. Under **Application restrictions**:
   - For **server-side usage** (recommended):
     - Select **IP addresses (web servers, cron jobs, etc.)**
     - Click **Add an IP address**
     - Add your server's IP address or `0.0.0.0/0` for development (less secure)
   - For **development only**:
     - Select **None** (but restrict before production)
4. Click **Save**

### Create a Separate Development Key (Optional)

It's good practice to have separate keys for development and production:

1. Create another API key following the same steps
2. Name it "Development Key" (you can edit the name)
3. Use less strict restrictions for development
4. Use strict IP restrictions for production

## Step 5: Add API Key to Your Application

### Update Environment Variables

1. Open your `.env.local` file in the project root
2. Add the Google Places API key:

```env
# Google Places API (for UK address lookup)
GOOGLE_PLACES_API_KEY=AIza...your-actual-api-key-here
```

3. **Do not commit this file to version control!** (It should already be in `.gitignore`)

### Restart Your Development Server

After adding the environment variable, restart your Next.js server:

```bash
npm run dev
```

## Step 6: Set Usage Quotas (Optional but Recommended)

To prevent unexpected charges, set daily quotas:

1. Go to **APIs & Services** → **Quotas**
2. Search for "**Geocoding API**"
3. Click on **Requests per day**
4. Click **Edit Quotas**
5. Set a reasonable limit (e.g., 1,000 requests per day)
6. Repeat for **Places API** → **Nearby Search requests per day**

## Step 7: Test the Integration

### Test Locally

1. Start your development server: `npm run dev`
2. Go to your cart page and click "Proceed to Checkout"
3. On the checkout page, enter a UK postcode (e.g., "SW1A 1AA")
4. Click "Find Address"
5. You should see a dropdown with addresses in that postcode area

### Common Test Postcodes

- **SW1A 1AA** - Buckingham Palace, London
- **EC1A 1BB** - Barbican, London
- **M1 1AE** - Manchester city center
- **EH1 1YZ** - Edinburgh city center
- **CF10 1DD** - Cardiff city center

### Troubleshooting Tests

**"Address lookup service is not configured"**
- Check that `GOOGLE_PLACES_API_KEY` is set in `.env.local`
- Restart your development server after adding the key

**"Unable to lookup postcode"**
- Verify that both APIs are enabled in Google Cloud Console
- Check that billing is enabled
- Verify API key restrictions aren't blocking requests

**"Invalid UK postcode format"**
- Use the format: `SW1A 1AA` (area + space + sector)
- The app accepts postcodes with or without spaces

## Step 8: Monitor Usage

### View API Usage

1. Go to **APIs & Services** → **Dashboard**
2. Click on **Places API** or **Geocoding API**
3. View the **Traffic** graph to see your usage
4. Monitor costs under **Billing** → **Reports**

### Set Up Budget Alerts

1. Go to **Billing** → **Budgets & alerts**
2. Click **Create Budget**
3. Set a monthly budget (e.g., $50)
4. Add alert thresholds (e.g., 50%, 90%, 100%)
5. Add your email for notifications

## Production Deployment Checklist

Before deploying to production:

- [ ] Enable billing in Google Cloud Console
- [ ] Enable both Geocoding API and Places API
- [ ] Create a production API key
- [ ] Restrict the production API key to your production server IP(s)
- [ ] Add `GOOGLE_PLACES_API_KEY` to production environment variables
- [ ] Set usage quotas to prevent unexpected charges
- [ ] Set up budget alerts
- [ ] Test the checkout flow in production
- [ ] Monitor API usage for the first few days

## Cost Management Tips

1. **Cache results**: The app doesn't currently cache postcode lookups, but you could add Redis caching to reduce API calls
2. **Rate limiting**: The app should include rate limiting to prevent abuse
3. **Monitor usage**: Check your Google Cloud Console weekly for unusual spikes
4. **Use autocomplete sparingly**: The current implementation uses "Nearby Search" which is cheaper than autocomplete
5. **Consider alternatives**: For UK-only addresses, services like getAddress.io or Loqate may be more cost-effective

## Alternative Services (UK Only)

If you only serve UK customers, consider these alternatives:

### getAddress.io
- **Cost**: £5-40/month for 1,000-10,000 lookups
- **Pros**: UK-specific, simpler API, more affordable
- **Cons**: UK only, requires separate integration

### Loqate (formerly PCA Predict)
- **Cost**: Pay-as-you-go or monthly plans
- **Pros**: Enterprise-grade, high accuracy, UK-focused
- **Cons**: More expensive, complex integration

### Royal Mail PAF
- **Cost**: License required
- **Pros**: Official UK address database
- **Cons**: Expensive, complex licensing

## Security Best Practices

1. **Never expose API keys in client-side code** - The app uses a server-side proxy (`/api/address/lookup`) to keep keys secure
2. **Use environment variables** - Never hardcode API keys
3. **Restrict by IP** - Limit API key usage to your server's IP address
4. **Rotate keys regularly** - Generate new keys every 6-12 months
5. **Monitor for abuse** - Set up alerts for unusual usage patterns
6. **Use HTTPS only** - API keys should only be transmitted over secure connections

## Troubleshooting Common Issues

### "OVER_QUERY_LIMIT" error

**Cause**: You've exceeded your daily quota or billing limit
**Solution**:
- Check your quotas in Google Cloud Console
- Increase limits or enable billing
- Wait for quota to reset (midnight Pacific Time)

### "REQUEST_DENIED" error

**Cause**: API key is restricted or invalid
**Solution**:
- Verify the API key is correct in `.env.local`
- Check API restrictions allow Geocoding and Places APIs
- Verify billing is enabled

### "ZERO_RESULTS" for valid postcode

**Cause**: Google doesn't have data for that postcode or it's formatted incorrectly
**Solution**:
- Verify postcode format (e.g., "SW1A 1AA")
- Try a different postcode
- Use manual entry fallback (already built into the app)

### Addresses not appearing in dropdown

**Cause**: No nearby addresses found or API limit reached
**Solution**:
- The app automatically suggests manual entry
- Check API usage hasn't exceeded quota
- Verify the postcode exists

## Support and Resources

- **Google Places API Documentation**: https://developers.google.com/maps/documentation/places/web-service
- **Google Geocoding API Documentation**: https://developers.google.com/maps/documentation/geocoding
- **Google Cloud Console**: https://console.cloud.google.com/
- **Pricing Calculator**: https://cloud.google.com/products/calculator

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Check the server logs for API errors
3. Verify all steps in this guide were completed
4. Check the Google Cloud Console for API errors
5. Review the troubleshooting section above

---

**Last Updated**: December 2025
**API Versions**: Places API (legacy), Geocoding API v3
