import styles from './page.module.css';

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Privacy Policy</h1>

        <p className={styles.intro}>
          This Privacy Policy outlines how your personal data is collected, used, shared, and retained
          when you interact with or make purchases from www.reef-forge.uk (the "Site"). It ensures
          transparency about data practices and compliance with applicable laws, like the GDPR.
        </p>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>📞</span>
            <h2>Contact Information</h2>
          </div>
          <p>
            If you have any questions or concerns about how we handle your personal data, please contact us:
          </p>
          <div className={styles.contactBox}>
            <p><strong>Email:</strong> info@reef-forge.uk</p>
          </div>
          <p className={styles.note}>
            This provides you with a clear communication channel to address your privacy concerns.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>📊</span>
            <h2>Collecting Personal Information</h2>
          </div>
          <p>
            The Site gathers various types of personal information depending on your interaction:
          </p>

          <div className={styles.subsection}>
            <h3>Device Information</h3>
            <div className={styles.infoGroup}>
              <p><strong>What is collected:</strong></p>
              <p>
                Browser version, IP address, time zone, cookie data, visited pages, search terms,
                and interactions with the Site.
              </p>
            </div>
            <div className={styles.infoGroup}>
              <p><strong>Why it's collected:</strong></p>
              <p>
                To ensure the Site displays properly and optimize its performance through analytics.
              </p>
            </div>
            <div className={styles.infoGroup}>
              <p><strong>How it's collected:</strong></p>
              <p>
                Using cookies, log files, web beacons, tags, and pixels.
              </p>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3>Order Information</h3>
            <div className={styles.infoGroup}>
              <p><strong>What is collected:</strong></p>
              <p>
                Name, billing and shipping addresses, payment details (e.g., credit card info),
                email, and phone number.
              </p>
            </div>
            <div className={styles.infoGroup}>
              <p><strong>Why it's collected:</strong></p>
              <ul className={styles.list}>
                <li>Fulfill your order</li>
                <li>Process payments and arrange shipping</li>
                <li>Send order confirmations and invoices</li>
                <li>Prevent fraud and address customer preferences</li>
              </ul>
            </div>
            <div className={styles.infoGroup}>
              <p><strong>Shared with:</strong></p>
              <p>
                Stripe for payment processing and order management.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>🔗</span>
            <h2>Sharing Personal Information</h2>
          </div>
          <p>
            Personal data may be shared with service providers to enable the operation of the Site, such as:
          </p>
          <ul className={styles.list}>
            <li><strong>Stripe:</strong> Manages the processing of payment and order management</li>
            <li><strong>Evri:</strong> Handles shipping and delivery services</li>
          </ul>
          <p className={styles.note}>
            We only share the minimum necessary information required for these services to function.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>🎯</span>
            <h2>Using Personal Information</h2>
          </div>
          <p>
            The Site uses personal information to:
          </p>
          <ul className={styles.list}>
            <li>Offer products and process payments</li>
            <li>Ship orders and provide updates on order status</li>
            <li>Inform you about new products, services, or promotions</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>⚖️</span>
            <h2>Lawful Basis</h2>
          </div>
          <p>
            Pursuant to the General Data Protection Regulation ("GDPR"), if you are a resident of the
            European Economic Area ("EEA"), we process your personal information under the following
            lawful bases:
          </p>
          <ul className={styles.list}>
            <li>Your consent</li>
            <li>The performance of the contract between you and the Site</li>
            <li>Compliance with our legal obligations</li>
            <li>To protect your vital interests</li>
            <li>To perform a task carried out in the public interest</li>
            <li>For our legitimate interests, which do not override your fundamental rights and freedoms</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>🗄️</span>
            <h2>Retention</h2>
          </div>
          <p>
            When you place an order through the Site, we will retain your Personal Information for our
            records unless and until you ask us to erase this information.
          </p>
          <p>
            For more information on your right of erasure, please see the "Your Rights" section below.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>🤖</span>
            <h2>Automatic Decision-Making</h2>
          </div>
          <p>
            If you are a resident of the EEA, you have the right to object to processing based solely
            on automated decision-making (which includes profiling), when that decision-making has a
            legal effect on you or otherwise significantly affects you.
          </p>
          <p>
            We do not engage in fully automated decision-making that has a legal or otherwise significant
            effect using customer data.
          </p>
          <div className={styles.highlightBox}>
            <p><strong>Our payment processor Stripe uses limited automated decision-making to prevent fraud:</strong></p>
            <ul className={styles.list}>
              <li>Temporary blacklist of IP addresses associated with repeated failed transactions
                (persists for a small number of hours)</li>
              <li>Temporary blacklist of credit cards associated with blacklisted IP addresses
                (persists for a small number of days)</li>
            </ul>
            <p className={styles.note}>
              These automated processes do not have a legal or otherwise significant effect on you.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>✋</span>
            <h2>Your Rights</h2>
          </div>
          <p>
            If you are a resident of the EEA, you have the following rights regarding your personal data:
          </p>
          <ul className={styles.list}>
            <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to Rectification:</strong> Request corrections to inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Restriction:</strong> Request limitation on how we use your data</li>
            <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Right to Object:</strong> Object to our processing of your personal data</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at <strong>info@reef-forge.uk</strong>
          </p>
        </section>

        <section className={`${styles.section} ${styles.updateSection}`}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>📅</span>
            <h2>Policy Updates</h2>
          </div>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or
            for legal, operational, or regulatory reasons. We encourage you to review this policy
            periodically.
          </p>
          <p className={styles.lastUpdated}>
            <strong>Last Updated:</strong> January 2026
          </p>
        </section>
      </div>
    </div>
  );
}
