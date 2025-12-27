'use client';

import { useState } from 'react';
import styles from './ProductImageGallery.module.css';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleImageSelect = (index: number) => {
    if (index !== selectedImageIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedImageIndex(index);
        setIsTransitioning(false);
      }, 150);
    }
  };

  return (
    <div className={styles.gallery}>
      {/* Main Image Display */}
      <div className={styles.mainImageContainer}>
        <img
          src={images[selectedImageIndex]}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          className={`${styles.mainImage} ${isTransitioning ? styles.imageTransition : ''}`}
          key={selectedImageIndex}
        />
      </div>

      {/* Thumbnail Gallery - only show if more than 1 image */}
      {images.length > 1 && (
        <div className={styles.thumbnailContainer}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(index)}
              className={`${styles.thumbnail} ${
                index === selectedImageIndex ? styles.thumbnailActive : ''
              }`}
              aria-label={`View image ${index + 1}`}
              type="button"
            >
              <img src={image} alt={`${productName} thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
