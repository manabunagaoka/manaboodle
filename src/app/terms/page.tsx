// app/terms/page.tsx
import Link from 'next/link';
import styles from '../legal.module.css';

export default function TermsPage() {
  return (
    <div className={styles.legalPage}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      <div className={styles.legalContent}>
        <header className={styles.legalHeader}>
          <h1 className={styles.legalTitle}>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last updated: 7/18/2025</p>
        </header>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
          <p className={styles.paragraph}>
            By accessing and using Manaboodle ("the Website"), you agree to be bound by these 
            Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>2. Use of Website</h2>
          <p className={styles.paragraph}>You may use our website for lawful purposes only. You agree not to:</p>
          <ul className={styles.bulletList}>
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit harmful code or malware</li>
            <li>Attempt to gain unauthorized access</li>
            <li>Harass or harm others</li>
            <li>Scrape content without permission</li>
          </ul>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>3. Intellectual Property</h2>
          <p className={styles.paragraph}>
            All content on Manaboodle, including text, graphics, logos, and images, is the property 
            of Manabu Nagaoka or licensed to us. You may not reproduce, distribute, or create 
            derivative works without explicit permission.
          </p>
          <p className={styles.paragraph}>
            You may share links to our content and quote brief excerpts with proper attribution.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>4. User Content</h2>
          <p className={styles.paragraph}>
            If you submit content through our contact form or comments (when available), you grant us 
            a non-exclusive, worldwide, royalty-free license to use, reproduce, and publish that content.
          </p>
          <p className={styles.paragraph}>You represent that:</p>
          <ul className={styles.bulletList}>
            <li>You own or have rights to the content</li>
            <li>Your content doesn't violate any rights</li>
            <li>Your content is accurate and not misleading</li>
          </ul>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>5. Newsletter and Communications</h2>
          <p className={styles.paragraph}>
            By subscribing to our newsletter, you consent to receive email communications from us. 
            You can unsubscribe at any time using the link in our emails or through your 
            <Link href="/preferences" className={styles.inlineLink}> email preferences</Link>.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>6. Disclaimer of Warranties</h2>
          <p className={styles.paragraph}>
            The website is provided "as is" without warranties of any kind. We do not guarantee that:
          </p>
          <ul className={styles.bulletList}>
            <li>The website will be error-free or uninterrupted</li>
            <li>Defects will be corrected</li>
            <li>The website is free of viruses or harmful components</li>
          </ul>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
          <p className={styles.paragraph}>
            We shall not be liable for any indirect, incidental, special, consequential, or punitive 
            damages resulting from your use or inability to use the website.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>8. External Links</h2>
          <p className={styles.paragraph}>
            Our website may contain links to third-party websites. We are not responsible for the 
            content or practices of these external sites.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>9. Modifications</h2>
          <p className={styles.paragraph}>
            We reserve the right to modify these terms at any time. Changes will be effective 
            immediately upon posting to the website.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>10. Termination</h2>
          <p className={styles.paragraph}>
            We may terminate or suspend your access to our website at any time, without prior 
            notice, for any reason.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>11. Governing Law</h2>
          <p className={styles.paragraph}>
            These terms shall be governed by and construed in accordance with the laws of the 
            United States, without regard to conflict of law principles.
          </p>
        </section>

        <section className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>12. Contact Information</h2>
          <p className={styles.paragraph}>
            For questions about these Terms of Service, please contact us at:
          </p>
          <div className={styles.contactInfo}>
            Email: legal@manaboodle.com<br />
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