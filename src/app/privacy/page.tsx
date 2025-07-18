// app/privacy/page.tsx
import Link from 'next/link';
import styles from '../legal.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.legalPage}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      <div className={styles.legalContent}>
        <header className={styles.legalHeader}>
          <h1 className={styles.legalTitle}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: 7/18/2025</p>
        </header>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
          
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Information You Provide</h3>
            <ul className={styles.bulletList}>
              <li>Email address when you subscribe to our services</li>
              <li>Name and email when you use our contact form</li>
              <li>Any additional information you choose to provide in messages</li>
            </ul>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Information Automatically Collected</h3>
            <ul className={styles.bulletList}>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referral source</li>
            </ul>
          </div>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
          <p className={styles.paragraph}>We use the information we collect to:</p>
          <ul className={styles.bulletList}>
            <li>Send you newsletters and updates (only with your consent)</li>
            <li>Respond to your inquiries via the contact form</li>
            <li>Improve our website and content</li>
            <li>Analyze website usage patterns</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>3. Data Storage and Security</h2>
          <p className={styles.paragraph}>
            Your information is stored securely using industry-standard encryption. We use Supabase 
            for database management and implement appropriate security measures to protect against 
            unauthorized access, alteration, disclosure, or destruction of your personal information.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>4. Third-Party Services</h2>
          <p className={styles.paragraph}>We use the following third-party services:</p>
          <ul className={styles.bulletList}>
            <li><strong>Supabase:</strong> For database and authentication</li>
            <li><strong>Vercel:</strong> For website hosting and analytics</li>
            <li><strong>AWS SES:</strong> For sending emails (when activated)</li>
          </ul>
          <p className={styles.paragraph}>
            These services have their own privacy policies and data handling practices.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>5. Your Rights</h2>
          <p className={styles.paragraph}>You have the right to:</p>
          <ul className={styles.bulletList}>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Withdraw consent at any time</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>6. Cookies</h2>
          <p className={styles.paragraph}>
            We use essential cookies for website functionality. We do not use tracking or advertising cookies.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>7. Children's Privacy</h2>
          <p className={styles.paragraph}>
            Our website is not intended for children under 13. We do not knowingly collect personal 
            information from children under 13.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>8. Changes to This Policy</h2>
          <p className={styles.paragraph}>
            We may update this privacy policy from time to time. We will notify you of any changes 
            by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>9. Contact Us</h2>
          <p className={styles.paragraph}>
            If you have questions about this privacy policy or our data practices, please contact us at:
          </p>
          <div className={styles.contactInfo}>
            Email: privacy@manaboodle.com<br />
            Or use our <Link href="/contact" className={styles.inlineLink}>contact form</Link>
          </div>
        </section>

        <footer className={styles.legalFooter}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </footer>
      </div>
    </div>
  );
}