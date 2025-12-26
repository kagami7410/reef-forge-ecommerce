import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';
import styles from './page.module.css';

export default function ProductsPage() {
  return (
    <div className={styles.productsPage}>
      <h1>All Products</h1>
      <div className={styles.productGrid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
