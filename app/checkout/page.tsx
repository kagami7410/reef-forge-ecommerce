'use client';

import { useState, useEffect, useRef } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Shipping constants
const FREE_SHIPPING_THRESHOLD = parseFloat(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '49');
const SHIPPING_FEE = parseFloat(process.env.NEXT_PUBLIC_SHIPPING_FEE || '2.95');

interface CheckoutFormProps {
  paymentIntentId: string;
}

function CheckoutForm({ paymentIntentId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressComplete, setAddressComplete] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{code: string; amount: number} | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!addressComplete) {
      setError('Please complete the delivery address');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get the address from the AddressElement
      const addressElement = elements.getElement('address');
      if (!addressElement) {
        throw new Error('Address element not found');
      }

      const { complete: addressIsComplete, value: addressValue } = await addressElement.getValue();

      if (!addressIsComplete) {
        throw new Error('Please complete the delivery address');
      }

      // Prepare shipping information for Stripe
      const shippingAddress = addressValue.address;
      const shippingName = addressValue.name;

      // Confirm the payment
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
          shipping: {
            name: shippingName,
            address: {
              line1: shippingAddress.line1,
              line2: shippingAddress.line2 || undefined,
              city: shippingAddress.city,
              state: shippingAddress.state || undefined,
              postal_code: shippingAddress.postal_code,
              country: shippingAddress.country,
            },
          },
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        clearCart();
        window.location.href = `/orders?payment_intent=${paymentIntent.id}`;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const subtotal = getCartTotal();
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const total = subtotal + shippingCost - discountAmount;

  const handleApplyDiscount = async () => {
    setDiscountError(null);
    setIsApplyingDiscount(true);
    const code = discountCode.trim().toUpperCase();

    if (code === 'SAVE10') {
      const discount = subtotal * 0.1; // 10% off

      try {
        // Update the payment intent with the discount
        const response = await fetch('/api/update-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId,
            subtotal,
            shipping: shippingCost,
            discount,
            discountCode: code,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to apply discount');
        }

        setAppliedDiscount({ code, amount: discount });
        setDiscountError(null);
      } catch (err) {
        setDiscountError('Failed to apply discount. Please try again.');
        console.error('Discount error:', err);
      } finally {
        setIsApplyingDiscount(false);
      }
    } else {
      setDiscountError('Invalid discount code');
      setAppliedDiscount(null);
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = async () => {
    setIsApplyingDiscount(true);

    try {
      // Update the payment intent to remove the discount
      const response = await fetch('/api/update-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          subtotal,
          shipping: shippingCost,
          discount: 0,
          discountCode: null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove discount');
      }

      setAppliedDiscount(null);
      setDiscountCode('');
      setDiscountError(null);
    } catch (err) {
      setDiscountError('Failed to remove discount. Please try again.');
      console.error('Remove discount error:', err);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.checkoutForm}>
      <div className={styles.formContent}>
        {/* Order Summary */}
        <div className={styles.orderSummary}>
          <h3>Order Summary</h3>
          <div className={styles.summaryItems}>
            {cart.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <img src={item.image} alt={item.name} />
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemQuantity}>Qty: {item.quantity}</p>
                </div>
                <p className={styles.itemPrice}>£{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className={styles.summaryTotals}>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping:</span>
              <span>{shippingCost === 0 ? 'Free' : `£${shippingCost.toFixed(2)}`}</span>
            </div>
            {shippingCost > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className={styles.summaryRow} style={{ fontSize: '0.875rem', color: '#666', gridColumn: '1 / -1' }}>
                <span>Add £{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping!</span>
              </div>
            )}
            {appliedDiscount && (
              <div className={styles.summaryRow} style={{ color: '#22c55e' }}>
                <span>Discount ({appliedDiscount.code}):</span>
                <span>-£{appliedDiscount.amount.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.totalRow}>
              <span>Total:</span>
              <span>£{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Discount Code Section */}
          <div className={styles.discountSection}>
            <h4>Discount Code</h4>
            {!appliedDiscount ? (
              <div className={styles.discountInput}>
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter code"
                  className={styles.discountCodeInput}
                />
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  className={styles.applyButton}
                  disabled={!discountCode.trim() || isApplyingDiscount}
                >
                  {isApplyingDiscount ? 'Applying...' : 'Apply'}
                </button>
              </div>
            ) : (
              <div className={styles.discountApplied}>
                <span className={styles.discountSuccess}>
                  ✓ {appliedDiscount.code} applied
                </span>
                <button
                  type="button"
                  onClick={handleRemoveDiscount}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            )}
            {discountError && <p className={styles.discountError}>{discountError}</p>}
          </div>
        </div>

        {/* Address Element */}
        <div className={styles.addressSection}>
          <h3>Delivery Address</h3>
          <AddressElement
            options={{
              mode: 'shipping',
              allowedCountries: ['GB'],
              defaultValues: {
                address: {
                  country: 'GB',
                },
              },
            }}
            onChange={(event) => {
              setAddressComplete(event.complete);
              if (event.complete) {
                setError(null);
              }
            }}
          />
        </div>

        {/* Payment Element */}
        <div className={styles.paymentSection}>
          <h3>Payment Details</h3>
          <PaymentElement />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.push('/cart')}
            className={styles.cancelButton}
            disabled={isProcessing}
          >
            Back to Cart
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!stripe || !addressComplete || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay £${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, getCartTotal } = useCart();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasCreatedIntent = useRef(false);

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

    // Only create payment intent once (prevent duplicates from React Strict Mode)
    if (hasCreatedIntent.current || clientSecret) {
      return;
    }

    hasCreatedIntent.current = true;

    const createPaymentIntent = async () => {
      setLoading(true);
      setError(null);

      try {
        const subtotal = getCartTotal();
        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
        const total = subtotal + shipping; // Initial payment intent has no discount

        const orderItems = cart.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }));

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: orderItems,
            subtotal,
            shipping,
            discount: 0,
            discountCode: null,
            total,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to initialize payment');
        }

        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [user, cart.length, router, clientSecret]);

  if (!user || cart.length === 0) {
    return null;
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0066cc',
      },
    },
  };

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.pageHeader}>
        <h1>Checkout</h1>
      </div>

      <div className={styles.pageContent}>
        {loading && (
          <div className={styles.loading}>
            <p>Loading checkout...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.error}>
              <p>{error}</p>
              <button onClick={() => router.push('/cart')}>Back to Cart</button>
            </div>
          </div>
        )}

        {!loading && !error && clientSecret && paymentIntentId && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm paymentIntentId={paymentIntentId} />
          </Elements>
        )}
      </div>
    </div>
  );
}
