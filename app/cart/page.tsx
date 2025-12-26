'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const router = useRouter();

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
                <p className={styles.price}>${item.price.toFixed(2)}</p>
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
                  ${(item.price * item.quantity).toFixed(2)}
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
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax:</span>
            <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total:</span>
            <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
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
