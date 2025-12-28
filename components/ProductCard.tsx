'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, getProductImages } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.id}`}>
        <div className={styles.imageContainer}>
          <img src={getProductImages(product)[0]} alt={product.name} />
        </div>
        <div className={styles.content}>
          <h3>{product.name}</h3>
          <p className={styles.category}>{product.category}</p>
          <p className={styles.price}>£{product.price.toFixed(2)}</p>
          <p className={styles.stock}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>
      </Link>
      <button
        className={`${styles.button} ${isAdding ? styles.adding : ''}`}
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}
