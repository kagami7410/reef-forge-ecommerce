'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h1>Your Cart is Empty</h1>
        <p>Add some products to get started!</p>
        <button onClick={() => router.push('/products')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const FREE_SHIPPING_THRESHOLD = parseFloat(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '49');
  const SHIPPING_FEE = parseFloat(process.env.NEXT_PUBLIC_SHIPPING_FEE || '2.95');

  const subtotal = getCartTotal();
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (!user) {
      alert('Please sign in to complete your purchase');
      router.push('/signin');
      return;
    }

    // Navigate to checkout page
    router.push('/checkout');
  };

  return (
    <div className={styles.cartPage}>
      <h1>Shopping Cart</h1>

      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {cart.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <img src={item.image} alt={item.name} />
              <div className={styles.itemInfo}>
                <h3>{item.name}</h3>
                <p className={styles.category}>{item.category}</p>
                <p className={styles.price}> £{item.price.toFixed(2)}</p>
              </div>
              <div className={styles.itemActions}>
                <div className={styles.quantityControl}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <p className={styles.itemTotal}>
                   £{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  className={styles.removeButton}
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cartSummary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping:</span>
            <span>{shippingCost === 0 ? 'Free' : `£${shippingCost.toFixed(2)}`}</span>
          </div>
          {subtotal < FREE_SHIPPING_THRESHOLD && (
            <div className={styles.freeShippingMessage}>
              Add £{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping!
            </div>
          )}
          <div className={styles.totalRow}>
            <span>Total:</span>
            <span>£{total.toFixed(2)}</span>
          </div>
          <button
            className={styles.checkoutButton}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
          <button className={styles.clearButton} onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
