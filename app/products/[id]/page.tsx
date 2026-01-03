'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductById, getRecommendedProducts, getProductImages } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import ProductImageGallery from '@/components/ProductImageGallery';
import styles from './page.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const productId = parseInt(params.id as string);
  const product = getProductById(productId);
  const recommendedProducts = getRecommendedProducts(productId);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1>Product Not Found</h1>
        <button onClick={() => router.push('/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className={styles.productDetail}>
      <button onClick={() => router.back()} className={styles.backButton}>
        ← Back
      </button>

      <div className={styles.content}>
        <ProductImageGallery
          images={getProductImages(product)}
          productName={product.name}
        />

        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1>{product.name}</h1>
          <p className={styles.price}> £{product.price.toFixed(2)}</p>
          <p className={styles.stock}>
            {product.stock > 0
              ? `${product.stock} in stock`
              : 'Out of stock'}
          </p>
          <button
            className={`${styles.addButton} ${isAdding ? styles.adding : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <h2 className='text-lg'>Description</h2>

          <p className={styles.description}>{product.description}</p>


        </div>
      </div>

      {recommendedProducts.length > 0 && (
        <div className={styles.recommendedSection}>
          <h2>You May Also Like</h2>
          <div className={styles.recommendedGrid}>
            {recommendedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
