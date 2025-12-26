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
