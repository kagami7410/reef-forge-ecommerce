import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';
import styles from './page.module.css';

export default function Home() {
  const featuredProduct = products[0];
  const otherProducts = products.slice(1, 4);

  return (
    <div className={styles.home}>
      <section className={styles.productHero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.badge}>Featured Product</span>
            <h1 className={styles.heroTitle}>Rock-Solid Magnetic Frag Holder</h1>
            <p className={styles.heroDescription}>- Never worry about slipping or shifting corals.</p>

            <div className={styles.heroFeatures}>
              <div className={styles.feature}>
                <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Premium Quality</span>
              </div>
              <div className={styles.feature}>
                <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Fast Delivery</span>
              </div>
              <div className={styles.feature}>
                <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>2 Year Warranty</span>
              </div>
            </div>

            <div className={`${styles.heroPricing}`}>
              <p className='m-1 '>price from</p>
              <span className={styles.heroPrice}>£25</span>
              <span className={styles.stockBadge}>{featuredProduct.stock} in stock</span>
            </div>

            <div className={styles.heroButtons}>
              <Link href={`/products/${featuredProduct.id}`} className={styles.primaryButton}>
                View Details
              </Link>
              <Link href="/products" className={styles.secondaryButton}>
                Browse All
              </Link>
            </div>
          </div>

          <div className={styles.heroImage}>
            <div className={styles.imageWrapper}>
              <div className={styles.imageGlow}></div>
              <img
                src={featuredProduct.image}
                alt={featuredProduct.name}
                className={styles.productImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.productShowcase}>
        <div className={styles.showcaseHeader}>
          <h2>Product Details & Gallery</h2>
          <p>Explore every detail of our featured {featuredProduct.name}</p>
        </div>

        <div className={styles.showcaseContent}>
          <div className={styles.imageGallery}>
            <div className={styles.galleryGrid}>
              {featuredProduct.images?.map((image, index) => (
                <div key={index} className={styles.galleryItem}>
                  <img src={image} alt={`${featuredProduct.name} view ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.productDetails}>
            <div className={styles.detailCard}>
              <div className={styles.detailIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3>Premium Quality</h3>
              <p>Crafted with the finest materials and cutting-edge technology for superior performance and durability.</p>
            </div>

            <div className={styles.detailCard}>
              <div className={styles.detailIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>Advanced Features</h3>
              <p>Packed with innovative features designed to enhance your experience and exceed your expectations.</p>
            </div>

            <div className={styles.detailCard}>
              <div className={styles.detailIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3>Warranty & Support</h3>
              <p>Enjoy 2 years of comprehensive warranty coverage and access to our dedicated customer support team.</p>
            </div>

            <div className={styles.detailCard}>
              <div className={styles.detailIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Fast Shipping</h3>
              <p>Free express shipping on all orders. Get your product delivered within 2-3 business days.</p>
            </div>
          </div>
        </div>

        <div className={styles.specificationSection}>
          <h3>Specifications</h3>
          <div className={styles.specGrid}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Category</span>
              <span className={styles.specValue}>{featuredProduct.category}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Stock Status</span>
              <span className={styles.specValue}>{featuredProduct.stock} units available</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Price</span>
              <span className={styles.specValue}>${featuredProduct.price}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Warranty</span>
              <span className={styles.specValue}>2 Years</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.videoSection}>
        <div className={styles.videoContainer}>
          <div className={styles.videoHeader}>
            <span className={styles.videoBadge}>Product Video</span>
            <h2>See It In Action</h2>
            <p>Watch how our {featuredProduct.name} delivers exceptional performance and quality</p>
          </div>

          <div className={styles.videoWrapper}>
            <div className={styles.videoPlaceholder}>
              <div className={styles.playButton}>
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className={styles.videoOverlay}>
                <p>Click to play product demonstration</p>
              </div>
              {/* Replace the src below with your actual video URL */}
              <video
                className={styles.video}
                poster={featuredProduct.image}
                controls
              >
                <source src="/path-to-your-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className={styles.videoFeatures}>
            <div className={styles.videoFeatureItem}>
              <div className={styles.videoFeatureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4>HD Quality</h4>
                <p>Watch in stunning 1080p</p>
              </div>
            </div>

            <div className={styles.videoFeatureItem}>
              <div className={styles.videoFeatureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4>Full Demo</h4>
                <p>Complete product walkthrough</p>
              </div>
            </div>

            <div className={styles.videoFeatureItem}>
              <div className={styles.videoFeatureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <div>
                <h4>Expert Review</h4>
                <p>Professional insights included</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <h2>More Great Products</h2>
        <div className={styles.productGrid}>
          {otherProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link href="/products" className={styles.viewAllButton}>
          View All Products
        </Link>
      </section>
    </div>
  );
}
