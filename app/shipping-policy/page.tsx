import styles from './page.module.css';

export default function ShippingPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Shipping & Delivery Policy</h1>

        <p className={styles.intro}>
          We have partnered with Evri to bring you a fast, secure, and premium delivery experience.
          Here is everything you need to know about how your order will be delivered.
        </p>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>📦</span>
            <h2>Delivery Service</h2>
          </div>
          <p>
            All orders are shipped via Evri, our trusted delivery partner. We strive to process
            and dispatch your order within 1-2 business days of receiving payment confirmation.
          </p>
          <p>
            Standard delivery typically takes 2-3 business days from dispatch. You will receive
            an email notification once your order has been shipped.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>📍</span>
            <h2>Tracking Your Order</h2>
          </div>
          <p>
            Once your order ships, you will receive a tracking link via email. You can monitor
            your parcel using the Evri website or mobile app in real time.
          </p>
          <p>
            The tracking link allows you to:
          </p>
          <ul className={styles.list}>
            <li>View the current location of your parcel</li>
            <li>See estimated delivery dates</li>
            <li>Receive real-time delivery updates</li>
            <li>Update delivery preferences</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>🛑</span>
            <h2>Delivery Issues</h2>
          </div>
          <p>
            If your parcel is damaged, lost, or delayed, please contact us within 24 hours of delivery.
          </p>
          <p>
            To help us resolve the issue quickly, please include:
          </p>
          <ul className={styles.list}>
            <li>Your order number</li>
            <li>A detailed description of the issue</li>
            <li>Photos of any damage (if applicable)</li>
            <li>Tracking information</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>🔄</span>
            <h2>Missed Deliveries & Redeliveries</h2>
          </div>
          <p>
            If delivery fails because no one was available to receive the parcel, Evri may
            attempt a redelivery or leave instructions for rescheduling.
          </p>
          <p>
            You can also update your delivery preferences using the Evri tracking portal, including:
          </p>
          <ul className={styles.list}>
            <li>Reschedule delivery for a more convenient time</li>
            <li>Redirect to a neighbor or safe place</li>
            <li>Arrange collection from a local Evri ParcelShop</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>📋</span>
            <h2>Shipping Costs</h2>
          </div>
          <p>
            We offer free shipping on all orders over £{process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '49'}.
          </p>
          <p>
            For orders below this threshold, a shipping fee of £{process.env.NEXT_PUBLIC_SHIPPING_FEE || '2.95'} applies.
          </p>
        </section>

        <section className={`${styles.section} ${styles.contactSection}`}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>💬</span>
            <h2>Need Help?</h2>
          </div>
          <p>
            If you have any questions about your delivery, please don't hesitate to contact us.
          </p>
          <div className={styles.contactBox}>
            <p><strong>Email:</strong> info@reef-forge.uk</p>
            <p className={styles.contactNote}>
              We're happy to help with tracking updates, delivery issues, or any other concerns.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
