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
    main: 'v1766668115/IMG20250406195809_agngbr.png',
    gallery: [
      'v1766668115/IMG20250406195809_agngbr.png',
      'v1766668115/IMG20250406195849_itcncb.png',
      'v1766668115/IMG20250406102606_y0tdge.png',
      'v1766668115/IMG20250406102914_dezk2e.png',
      'v1766668115/IMG20250406114344_loa9ls.png'
    ]
  },
  magnetic_tray_large: {
    main: 'v1766668739/IMG20250406195739_eqfvod.png',
    gallery: [
      'v1766668739/IMG20250406195739_eqfvod.png',
      'v1766668739/IMG20250406200006_dtid8c.png',
      'v1766668739/IMG20250406102858_tyymuw.png',
      'v1766668739/IMG20250406102512_uo4xro.png',
      'v1766668739/IMG20250406102742_xsnfng.png',

    ]
  },
  magnetic_tray_standard: {
    main: 'v1766668725/IMG20250406195749_h9nelw.png',
    gallery: [
      'v1766668725/IMG20250406195749_h9nelw.png',
      'v1766668725/IMG20250406200043_j5j0md.png',
      'v1766668725/IMG20250406102846_mlxuv9.png',
      'v1766668725/IMG20250406102839_bkhfwz.png',
      'v1766668725/IMG20250406102448_d1lpd1.png'

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
    category: "Frag Rack",
    image: getImageUrl(productImageData.magnetic_tray_extraLarge.main),
    images: productImageData.magnetic_tray_extraLarge.gallery.map(img => getImageUrl(img)),
    stock: 15
  },
  {
    id: 2,
    name: "Magnetic Frag Rack [Large]",
    price: 29.99,
    description: "Feature-rich smartwatch with fitness tracking",
    category: "Frag Rack",
    image: getImageUrl(productImageData.magnetic_tray_large.main),
    images: productImageData.magnetic_tray_large.gallery.map(img => getImageUrl(img)),
    stock: 8
  },
  {
    id: 3,
    name: "Magnetic Frag Rack [Standard]",
    price: 25.99,
    description: "Durable backpack with laptop compartment",
    category: "Frag Rack",
    image: getImageUrl(productImageData.magnetic_tray_standard.main),
    images: productImageData.magnetic_tray_standard.gallery.map(img => getImageUrl(img)),
    stock: 10
  },

  {
    id: 4,
    name: "Magnetic Frag Rack [TEST]",
    price: .10,
    description: "Durable backpack with laptop compartment",
    category: "TEST",
    image: getImageUrl(productImageData.magnetic_tray_standard.main),
    images: productImageData.magnetic_tray_standard.gallery.map(img => getImageUrl(img)),
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
