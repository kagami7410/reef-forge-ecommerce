# E-Commerce Template - Next.js

A basic e-commerce website template built with Next.js, TypeScript, and CSS Modules.

## Features

- Modern Next.js 14 with App Router
- TypeScript for type safety
- Responsive design with CSS Modules
- Shopping cart functionality with Context API
- Product listing and detail pages
- Mock product data
- Clean and professional UI

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ecommerce-template/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with cart provider
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── products/          # Products pages
│   │   ├── page.tsx       # All products listing
│   │   └── [id]/          # Dynamic product detail page
│   └── cart/              # Shopping cart page
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer component
│   └── ProductCard.tsx    # Product card component
├── context/               # React context
│   └── CartContext.tsx    # Shopping cart state management
├── lib/                   # Utilities and data
│   └── products.ts        # Product data and helpers
└── public/                # Static assets

```

## Available Pages

- `/` - Home page with featured products
- `/products` - All products listing
- `/products/[id]` - Individual product detail page
- `/cart` - Shopping cart page

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
# Required for production
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

See [.env.example](./.env.example) for all available variables and setup instructions.

## Future Enhancements

Consider adding:
- User authentication
- Payment integration (Stripe, PayPal)
- Backend API integration
- Database for products
- Order history
- Product search and filtering
- Product reviews
- Wishlist functionality
- Email notifications

## License

MIT
