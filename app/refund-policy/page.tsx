import styles from './page.module.css';

export default function RefundPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Refund & Return Policy</h1>

        <p className={styles.intro}>
          We strive to ensure every customer is satisfied with their purchase. Please read the following
          terms carefully, as they outline our policies regarding refunds, exchanges, and returns.
        </p>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>💰</span>
            <h2>Refunds & Exchanges</h2>
          </div>
          <ul className={styles.list}>
            <li>Refunds and exchanges are handled on a <strong>case-by-case basis</strong></li>
            <li>Custom orders are <strong>non-refundable</strong> once production has begun</li>
            <li>If your item is faulty or damaged during shipping, please see the relevant sections below</li>
          </ul>
          <div className={styles.noteBox}>
            <p>
              We assess each request individually to ensure fair treatment while maintaining the quality
              and integrity of our service.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>📦</span>
            <h2>Damaged Items (During Transit)</h2>
          </div>
          <p>
            If your item arrives damaged, we will replace it free of charge, including shipping.
            Please follow these steps:
          </p>

          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Notify Us Immediately</h3>
                <p>Contact us within <strong>24 hours of delivery</strong></p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Provide Documentation</h3>
                <p>Send clear photos of the damage and packaging</p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Keep Everything</h3>
                <p>Retain all packaging and the damaged item for carrier inspection</p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h3>Return if Requested</h3>
                <p>You may be required to return the damaged item</p>
              </div>
            </div>
          </div>

          <div className={styles.warningBox}>
            <div className={styles.warningHeader}>
              <span className={styles.warningIcon}>⚠️</span>
              <strong>Important Notice</strong>
            </div>
            <p>
              <strong>Do not sign for the package if it arrives visibly damaged.</strong> Once signed,
              we cannot process a replacement. Refuse delivery and contact us immediately.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>↩️</span>
            <h2>Returns</h2>
          </div>
          <p>
            If a return is authorized, please adhere to the following requirements:
          </p>

          <div className={styles.requirementBox}>
            <div className={styles.requirement}>
              <span className={styles.requirementIcon}>📅</span>
              <div>
                <h3>Return Timeframe</h3>
                <p>
                  The item must be shipped back within <strong>10 calendar days</strong> of authorization
                </p>
              </div>
            </div>

            <div className={styles.requirement}>
              <span className={styles.requirementIcon}>💳</span>
              <div>
                <h3>Late Returns</h3>
                <p>
                  Failure to return the item within this timeframe will result in your card being
                  charged the full product price
                </p>
              </div>
            </div>

            <div className={styles.requirement}>
              <span className={styles.requirementIcon}>📋</span>
              <div>
                <h3>Item Condition</h3>
                <p>
                  Items must be returned in their original condition, unused and in original packaging
                  (unless faulty or damaged)
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.contactSection}`}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>📧</span>
            <h2>Contact Us</h2>
          </div>
          <p>
            To initiate a return, report damage, or inquire about a refund or exchange, please contact us:
          </p>

          <div className={styles.contactBox}>
            <div className={styles.contactInfo}>
              <strong>Email:</strong> info@reef-forge.uk
            </div>
            <div className={styles.contactDetails}>
              <p><strong>Please include:</strong></p>
              <ul>
                <li>Your order number</li>
                <li>Clear photos of the item and packaging (if applicable)</li>
                <li>Description of the issue</li>
                <li>Your preferred resolution (refund or exchange)</li>
              </ul>
            </div>
          </div>

          <p className={styles.responseNote}>
            We aim to respond to all inquiries within 1-2 business days.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>ℹ️</span>
            <h2>Additional Information</h2>
          </div>
          <ul className={styles.list}>
            <li>Refunds will be processed to the original payment method within 5-10 business days
              after receiving the returned item</li>
            <li>Shipping costs are non-refundable unless the item was damaged or faulty</li>
            <li>Customers are responsible for return shipping costs unless the item is damaged or faulty</li>
            <li>We reserve the right to refuse returns that do not meet our policy requirements</li>
          </ul>
        </section>

        <div className={styles.lastUpdated}>
          <strong>Last Updated:</strong> January 2026
        </div>
      </div>
    </div>
  );
}
