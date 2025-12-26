'use client';

import { useState } from 'react';
import styles from './ProductImageGallery.module.css';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className={styles.gallery}>
      {/* Main Image Display */}
      <div className={styles.mainImageContainer}>
        <img
          src={images[selectedImageIndex]}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          className={styles.mainImage}
        />
      </div>

      {/* Thumbnail Gallery - only show if more than 1 image */}
      {images.length > 1 && (
        <div className={styles.thumbnailContainer}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`${styles.thumbnail} ${
                index === selectedImageIndex ? styles.thumbnailActive : ''
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image} alt={`${productName} thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
