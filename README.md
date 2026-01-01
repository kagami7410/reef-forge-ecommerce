# E-Commerce Template - Next.js

A fully-featured e-commerce website template built with Next.js, TypeScript, and CSS Modules. Includes authentication, payment processing, order management, and email notifications.

## Features

- Modern Next.js 14 with App Router
- TypeScript for type safety
- Responsive design with CSS Modules
- Google OAuth authentication with NextAuth.js
- Stripe payment integration with checkout
- Shopping cart functionality with Context API
- Order history and tracking
- Discount code system
- Configurable shipping fees and free shipping thresholds
- Tax calculations
- Shipping address collection with Stripe Address Element
- Email notifications with Resend
- Supabase database for orders
- Product listing and detail pages
- Clean and professional UI

## Getting Started

### Prerequisites

Before you begin, you'll need:
- Node.js 18+ installed
- A Google Cloud account (for OAuth)
- A Stripe account (for payments)
- A Supabase account (for database)
- A Resend account (for emails)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Follow the setup guides below to configure each service

3. Set up services (in order):
   - [Supabase Setup](./SUPABASE_SETUP.md) - Database configuration
   - [Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md) - Authentication
   - [Stripe Setup](./STRIPE_SETUP.md) - Payment processing
   - [Email Setup](./EMAIL_SETUP.md) - Order confirmations

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ecommerce-template/
├── app/                           # Next.js app directory
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles
│   ├── products/                 # Products pages
│   │   ├── page.tsx              # All products listing
│   │   └── [id]/                 # Dynamic product detail page
│   ├── cart/                     # Shopping cart page
│   ├── checkout/                 # Stripe checkout page
│   ├── orders/                   # Order history page
│   ├── signin/                   # Sign in page
│   └── api/                      # API routes
│       ├── auth/                 # NextAuth.js routes
│       ├── create-payment-intent/ # Stripe payment intent
│       ├── update-payment-intent/ # Update payment with discount
│       └── webhooks/             # Stripe webhooks
├── components/                   # Reusable components
│   ├── Header.tsx                # Navigation header with auth
│   ├── Footer.tsx                # Footer component
│   └── ProductCard.tsx           # Product card component
├── context/                      # React context
│   └── CartContext.tsx           # Shopping cart state management
├── lib/                          # Utilities and data
│   ├── products.ts               # Product data and helpers
│   ├── supabase.ts               # Supabase client and types
│   ├── resend.ts                 # Email client configuration
│   └── emails/                   # Email templates
├── public/                       # Static assets
└── supabase-schema.sql           # Database schema

```

## Available Pages

- `/` - Home page with featured products
- `/products` - All products listing
- `/products/[id]` - Individual product detail page
- `/cart` - Shopping cart page with shipping calculation
- `/checkout` - Stripe checkout with payment and address collection
- `/orders` - Order history (requires authentication)
- `/signin` - Google OAuth sign in page

## Customization

### Adding Products

Edit `lib/products.ts` to add or modify products:

```typescript
{
  id: 7,
  name: "Your Product",
  price: 99.99,
  description: "Product description",
  category: "Category",
  image: "image-url",
  stock: 10
}
```

### Styling

All components use CSS Modules for styling. Modify the corresponding `.module.css` files to customize the appearance.

### Cart Functionality

The shopping cart uses React Context API (`context/CartContext.tsx`) to manage state across the application. Features include:
- Add/remove items
- Update quantities
- Calculate totals
- Persistent cart state during session

## Build for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

This project is optimized for deployment on Vercel. Follow our comprehensive guide:

**[📘 Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)** - Quick 30-minute deployment guide

**Key features:**
- One-click deployment from GitHub
- Automatic SSL certificates
- Global CDN
- Preview deployments for pull requests
- Built-in analytics

**Quick Start:**
1. Push your code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Configure environment variables (see guide)
4. Deploy!

### Other Deployment Options

For comprehensive deployment options including AWS, Docker, and CI/CD:
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Detailed step-by-step checklist
- [Deployment Summary](./DEPLOYMENT_SUMMARY.md) - Overview of all deployment options

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Email
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=onboarding@resend.dev

# Shipping Configuration
NEXT_PUBLIC_SHIPPING_FEE=2.95
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=49

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

See [.env.example](./.env.example) for all available variables and detailed setup instructions.

## Configuration

### Shipping Settings

Shipping fees and thresholds are configurable via environment variables:
- `NEXT_PUBLIC_SHIPPING_FEE` - Shipping cost (default: 2.95)
- `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD` - Minimum order for free shipping (default: 49)

### Database Schema

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor to create the orders table with:
- Order tracking and status
- Payment information
- Shipping address collection
- Discount code support
- Automatic timestamps

## Future Enhancements

Consider adding:
- Product database (currently using mock data)
- Product search and filtering
- Product reviews and ratings
- Wishlist functionality
- Multiple payment methods (PayPal, etc.)
- Inventory management
- Admin dashboard
- Analytics and reporting

## License

MIT
