# Image CDN Setup Guide

This guide will help you set up cloud-based image hosting for your e-commerce website using Cloudinary or other CDN providers.

## Table of Contents
1. [Cloudinary Setup (Recommended)](#cloudinary-setup-recommended)
2. [Alternative CDN Providers](#alternative-cdn-providers)
3. [Using Local Images](#using-local-images)
4. [How to Add Product Images](#how-to-add-product-images)

---

## Cloudinary Setup (Recommended)

Cloudinary offers a generous free tier with automatic image optimization, transformations, and fast CDN delivery.

### Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account
3. Verify your email address

### Step 2: Get Your Cloud Name

1. After logging in, go to your Dashboard
2. You'll see your **Cloud Name** at the top (e.g., "demo-cloud")
3. Copy this Cloud Name - you'll need it for configuration

### Step 3: Upload Your Product Images

#### Option A: Via Web Interface (Easiest)
1. In Cloudinary Dashboard, click **Media Library**
2. Create a new folder called `ecommerce-products`
3. Click **Upload** button
4. Select and upload your product images
5. Note down the **Public ID** of each image (filename without extension)

#### Option B: Via Upload Widget
1. Click **Upload** in the top menu
2. Drag and drop your images
3. Organize them in the `ecommerce-products` folder

**Image Naming Best Practices:**
- Use descriptive names: `headphones-front.jpg`, `headphones-side.jpg`
- Use lowercase and hyphens (not spaces)
- Keep names consistent with the code

### Step 4: Configure Your Project

Open `lib/imageConfig.ts` and update the configuration:

```typescript
export const CDN_PROVIDER = 'cloudinary';

export const CDN_CONFIG = {
  cloudinary: {
    cloudName: 'YOUR-CLOUD-NAME', // Replace with your actual cloud name
    baseUrl: 'https://res.cloudinary.com/YOUR-CLOUD-NAME/image/upload',
    folder: 'ecommerce-products',
  },
  // ... other providers
};
```

### Step 5: Update Product Image Names

Open `lib/products.ts` and update the image filenames to match your uploaded images:

```typescript
const productImageData = {
  headphones: {
    main: 'headphones-main.jpg',  // Replace with your actual filename
    gallery: [
      'headphones-front.jpg',     // Replace with your actual filenames
      'headphones-side.jpg',
      'headphones-detail.jpg',
      'headphones-package.jpg'
    ]
  },
  // ... update other products
};
```

### Step 6: Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to http://localhost:3000
3. Check if images load correctly
4. Open browser DevTools > Network tab to verify images are loading from Cloudinary

---

## Alternative CDN Providers

### Option 1: Imgur (Free, Simple)

#### Setup:
1. Go to [https://imgur.com](https://imgur.com)
2. Create an account
3. Upload images via web interface
4. Click on an image and copy the direct link (ends with .jpg, .png, etc.)

#### Configuration:
```typescript
// In lib/imageConfig.ts
export const CDN_PROVIDER = 'imgur';
```

#### In products.ts:
```typescript
const productImageData = {
  headphones: {
    main: 'abc123.jpg',  // Use the Imgur image ID from the URL
    gallery: [
      'def456.jpg',
      'ghi789.jpg',
      // ...
    ]
  },
};
```

### Option 2: AWS S3 (Scalable, Professional)

#### Setup:
1. Create an AWS account
2. Create an S3 bucket
3. Set bucket policy for public read access
4. Upload images to the bucket

#### Configuration:
```typescript
// In lib/imageConfig.ts
export const CDN_PROVIDER = 's3';

export const CDN_CONFIG = {
  s3: {
    bucket: 'your-bucket-name',
    region: 'us-east-1',
    baseUrl: 'https://your-bucket-name.s3.us-east-1.amazonaws.com',
  },
};
```

---

## Using Local Images

For development or small-scale projects, you can store images locally.

### Setup:
1. Create folder structure:
   ```
   public/
     └── images/
         └── products/
             ├── headphones-main.jpg
             ├── headphones-front.jpg
             └── ... (other images)
   ```

2. Configure:
   ```typescript
   // In lib/imageConfig.ts
   export const CDN_PROVIDER = 'local';
   ```

3. Place your images in `public/images/products/`

**Note:** Local images work for development but are not recommended for production as they:
- Increase your build size
- Don't benefit from CDN caching
- Aren't automatically optimized

---

## How to Add Product Images

### Adding a New Product

1. **Upload images** to your CDN (e.g., Cloudinary)
2. **Note the filenames** or IDs
3. **Update `lib/products.ts`**:

```typescript
// Add to productImageData object
const productImageData = {
  // ... existing products
  newproduct: {
    main: 'new-product-main.jpg',
    gallery: [
      'new-product-1.jpg',
      'new-product-2.jpg',
      'new-product-3.jpg',
      'new-product-4.jpg'
    ]
  }
};

// Add to products array
export const products: Product[] = [
  // ... existing products
  {
    id: 7,
    name: "New Product",
    price: 99.99,
    description: "Amazing new product",
    category: "Electronics",
    image: getImageUrl(productImageData.newproduct.main),
    images: productImageData.newproduct.gallery.map(img => getImageUrl(img)),
    stock: 20
  }
];
```

### Updating Existing Product Images

Simply update the filenames in the `productImageData` object and upload the new images to your CDN.

---

## Image Best Practices

### Recommended Specifications:
- **Format:** JPEG for photos, PNG for graphics with transparency
- **Size:** 1200x1200 pixels (square) for product images
- **File size:** Under 500KB per image (Cloudinary auto-optimizes)
- **Naming:** Use descriptive, lowercase names with hyphens

### Gallery Images:
Each product should have 4 images showing:
1. Front view
2. Side/angle view
3. Detail/close-up
4. In use or with packaging

### Cloudinary Auto-Optimization:
Your images are automatically:
- Converted to WebP format (when supported)
- Compressed for optimal quality/size ratio
- Served via global CDN for fast loading
- Responsive based on device screen size

---

## Troubleshooting

### Images Not Loading?
1. Check Cloud Name is correct in `lib/imageConfig.ts`
2. Verify image filenames match exactly (case-sensitive)
3. Check browser console for 404 errors
4. Ensure images are public in Cloudinary

### Images Loading Slowly?
1. Cloudinary: Check transformation settings are enabled
2. Ensure you're using CDN URLs (not direct upload URLs)
3. Consider using smaller transformations for thumbnails

### Need Help?
- Cloudinary Docs: https://cloudinary.com/documentation
- AWS S3 Docs: https://docs.aws.amazon.com/s3/
- Imgur API: https://apidocs.imgur.com/

---

## Quick Start Checklist

- [ ] Create Cloudinary account (or choose another CDN)
- [ ] Upload product images to CDN
- [ ] Copy Cloud Name from Cloudinary dashboard
- [ ] Update `lib/imageConfig.ts` with your Cloud Name
- [ ] Update image filenames in `lib/products.ts`
- [ ] Test on local development server
- [ ] Verify images load from CDN in browser DevTools

---

**You're all set! Your e-commerce site is now using professional cloud-based image hosting.**
