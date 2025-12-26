'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './CartNotification.module.css';

export default function CartNotification() {
  const { showNotification, hideNotification, notificationMessage } = useCart();

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showNotification, hideNotification]);

  if (!showNotification) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>✓</div>
        <p>{notificationMessage}</p>
      </div>
    </div>
  );
}
