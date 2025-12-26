import { getImageUrl } from './imageConfig';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  stock: number;
}

// Product image data - Replace these with your actual image filenames after uploading to CDN
// Include subfolder path: 'subfolder/image.jpg'
const productImageData = {
  magnetic_tray_extraLarge: {
    main: 'v1766668115/IMG20250406195849_itcncb.png',
    gallery: [
      'v1766668115/IMG20250406195849_itcncb.png',
      'magnetic_tray_extraLarge/image2.jpg',
      'magnetic_tray_extraLarge/image3.jpg',
      'magnetic_tray_extraLarge/image4.jpg'
    ]
  },
  magnetic_tray_large: {
    main: 'magnetic_tray_large/main.jpg',
    gallery: [
      'magnetic_tray_large/image1.jpg',
      'magnetic_tray_large/image2.jpg',
      'magnetic_tray_large/image3.jpg',
      'magnetic_tray_large/image4.jpg'
    ]
  },
  magnetic_tray_standard: {
    main: 'magnetic_tray_standard/main.jpg',
    gallery: [
      'magnetic_tray_standard/image1.jpg',
      'magnetic_tray_standard/image2.jpg',
      'magnetic_tray_standard/image3.jpg',
      'magnetic_tray_standard/image4.jpg'
    ]
  },
  usbhub: {
    main: 'usbhub/main.jpg',
    gallery: [
      'usbhub/image1.jpg',
      'usbhub/image2.jpg',
      'usbhub/image3.jpg',
      'usbhub/image4.jpg'
    ]
  },
  lamp: {
    main: 'lamp/main.jpg',
    gallery: [
      'lamp/image1.jpg',
      'lamp/image2.jpg',
      'lamp/image3.jpg',
      'lamp/image4.jpg'
    ]
  },
  keyboard: {
    main: 'keyboard/main.jpg',
    gallery: [
      'keyboard/image1.jpg',
      'keyboard/image2.jpg',
      'keyboard/image3.jpg',
      'keyboard/image4.jpg'
    ]
  }
};

export const products: Product[] = [
  {
    id: 1,
    name: "Magnetic Frag Rack [Extra Large]",
    price: 34.99,
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    image: getImageUrl(productImageData.magnetic_tray_extraLarge.main),
    images: productImageData.magnetic_tray_extraLarge.gallery.map(img => getImageUrl(img)),
    stock: 15
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    description: "Feature-rich smartwatch with fitness tracking",
    category: "Electronics",
    image: getImageUrl(productImageData.magnetic_tray_large.main),
    images: productImageData.magnetic_tray_large.gallery.map(img => getImageUrl(img)),
    stock: 8
  },
  {
    id: 3,
    name: "Laptop Backpack",
    price: 49.99,
    description: "Durable backpack with laptop compartment",
    category: "Accessories",
    image: getImageUrl(productImageData.magnetic_tray_standard.main),
    images: productImageData.magnetic_tray_standard.gallery.map(img => getImageUrl(img)),
    stock: 25
  },
  {
    id: 4,
    name: "USB-C Hub",
    price: 34.99,
    description: "7-in-1 USB-C hub with multiple ports",
    category: "Electronics",
    image: getImageUrl(productImageData.usbhub.main),
    images: productImageData.usbhub.gallery.map(img => getImageUrl(img)),
    stock: 30
  },
  {
    id: 5,
    name: "Desk Lamp",
    price: 29.99,
    description: "LED desk lamp with adjustable brightness",
    category: "Home",
    image: getImageUrl(productImageData.lamp.main),
    images: productImageData.lamp.gallery.map(img => getImageUrl(img)),
    stock: 12
  },
  {
    id: 6,
    name: "Mechanical Keyboard",
    price: 89.99,
    description: "RGB mechanical keyboard with blue switches",
    category: "Electronics",
    image: getImageUrl(productImageData.keyboard.main),
    images: productImageData.keyboard.gallery.map(img => getImageUrl(img)),
    stock: 10
  }
];

export function getProductById(id: number): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}

export function getProductImages(product: Product): string[] {
  if (product.images && product.images.length > 0) {
    return product.images;
  }
  return [product.image];
}

export function getRecommendedProducts(productId: number, limit: number = 4): Product[] {
  const currentProduct = getProductById(productId);

  if (!currentProduct) {
    return [];
  }

  const categoryProducts = getProductsByCategory(currentProduct.category);

  return categoryProducts
    .filter(product => product.id !== productId)
    .slice(0, limit);
}
