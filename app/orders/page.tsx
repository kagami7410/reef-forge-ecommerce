'use client';

import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Order } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

// Component that uses useSearchParams - must be wrapped in Suspense
function OrdersContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user) {
      // Check if redirected from Stripe checkout
      const sessionId = searchParams.get('session_id');
      if (sessionId) {
        setShowSuccess(true);
        clearCart();
        // Remove the session_id from URL
        window.history.replaceState({}, '', '/orders');
        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000);
      }
      fetchOrders();
    }
  }, [user, authLoading, router, searchParams, clearCart]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return styles.statusCompleted;
      case 'processing':
        return styles.statusProcessing;
      case 'pending':
        return styles.statusPending;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.loading}>Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchOrders}>Try Again</button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.emptyOrders}>
          <h1>No Orders Yet</h1>
          <p>You haven't placed any orders yet. Start shopping!</p>
          <button onClick={() => router.push('/products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ordersPage}>
      {showSuccess && (
        <div className={styles.successMessage}>
          Payment successful! Your order has been placed.
        </div>
      )}

      <h1>Order History</h1>
      <p className={styles.subtitle}>View all your past orders</p>

      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div>
                <h3>Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                <p className={styles.orderDate}>{formatDate(order.created_at)}</p>
              </div>
              <span className={`${styles.status} ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className={styles.orderItems}>
              {order.items.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <img src={item.image} alt={item.product_name} />
                  <div className={styles.itemDetails}>
                    <p className={styles.itemName}>{item.product_name}</p>
                    <p className={styles.itemQuantity}>Qty: {item.quantity}</p>
                  </div>
                  <p className={styles.itemPrice}>
                    £{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>£{order.subtotal.toFixed(2)}</span>
              </div>
              {order.shipping !== undefined && order.shipping !== null && (
                <div className={styles.summaryRow}>
                  <span>Shipping:</span>
                  <span>{order.shipping === 0 ? 'Free' : `£${order.shipping.toFixed(2)}`}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className={styles.summaryRow} style={{ color: '#22c55e' }}>
                  <span>Discount:</span>
                  <span>-£{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Tax:</span>
                <span>£{order.tax.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Total:</span>
                <span>£{order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Address Section */}
            {order.shipping_address_line1 && (
              <div className={styles.shippingAddress}>
                <h4>Shipping Address</h4>
                <p>{order.shipping_address_line1}</p>
                {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                <p>{order.shipping_city}</p>
                {order.shipping_county && <p>{order.shipping_county}</p>}
                <p>{order.shipping_postcode}</p>
                <p>{order.shipping_country || 'United Kingdom'}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className={styles.ordersPage}>
        <div className={styles.loading}>Loading your orders...</div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
