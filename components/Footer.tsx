import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; 2024 reef-forge. All rights reserved.</p>
        <div className={styles.links}>
          <Link href="/shipping-policy">Shipping Policy</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/refund-policy">Refund Policy</Link>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
