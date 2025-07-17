import { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Terms of Service | Manaboodle',
  description: 'Terms of Service for using Manaboodle website and services',
}

export default function TermsPage() {
  return (
    <div className={styles.termsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Terms of Service</h1>
        <p className={styles.effectiveDate}>Effective Date: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className={styles.content}>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
          <p className={styles.paragraph}>
            By accessing or using Manaboodle ("the Website"), you agree to be bound by these 
            Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Use of the Website</h2>
          <h3 className={styles.subsectionTitle}>Permitted Use</h3>
          <p className={styles.paragraph}>You may use this website for:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Reading articles and content</li>
            <li className={styles.listItem}>Subscribing to our services and content updates</li>
            <li className={styles.listItem}>Contacting us through provided forms</li>
            <li className={styles.listItem}>Personal, non-commercial purposes</li>
          </ul>
          
          <h3 className={styles.subsectionTitle}>Prohibited Use</h3>
          <p className={styles.paragraph}>You may not:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Use the website for any unlawful purpose</li>
            <li className={styles.listItem}>Attempt to gain unauthorized access to any portion of the website</li>
            <li className={styles.listItem}>Interfere with or disrupt the website's operation</li>
            <li className={styles.listItem}>Scrape or harvest content without permission</li>
            <li className={styles.listItem}>Distribute malware or harmful code</li>
            <li className={styles.listItem}>Impersonate others or provide false information</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Intellectual Property</h2>
          <p className={styles.paragraph}>
            All content on this website, including text, graphics, logos, and articles, is the 
            property of Manaboodle or its content creators and is protected by copyright laws.
          </p>
          <p className={styles.paragraph}>
            You may not reproduce, distribute, modify, or create derivative works without 
            explicit written permission.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. User Content</h2>
          <p className={styles.paragraph}>
            By submitting content through our contact forms or other means, you grant us a 
            non-exclusive, worldwide, royalty-free license to use, reproduce, and display 
            such content in connection with our services.
          </p>
          <p className={styles.paragraph}>You represent and warrant that:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>You own or have the right to submit the content</li>
            <li className={styles.listItem}>Your content does not infringe on any third-party rights</li>
            <li className={styles.listItem}>Your content is accurate and not misleading</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Subscriptions and Communications</h2>
          <p className={styles.paragraph}>
            By subscribing to our services, you consent to receive periodic emails with articles, 
            updates, and service notifications. You can unsubscribe at any time using the link 
            provided in each email or through your email preferences page.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Third-Party Links</h2>
          <p className={styles.paragraph}>
            Our website may contain links to third-party websites. We are not responsible for 
            the content, privacy policies, or practices of these external sites.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Disclaimer of Warranties</h2>
          <p className={styles.paragraph}>
            <span className={styles.importantText}>
              THE WEBSITE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. 
              WE DO NOT GUARANTEE THAT THE WEBSITE WILL BE ERROR-FREE, SECURE, OR UNINTERRUPTED.
            </span>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Limitation of Liability</h2>
          <p className={styles.paragraph}>
            <span className={styles.importantText}>
              TO THE FULLEST EXTENT PERMITTED BY LAW, MANABOODLE SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM 
              YOUR USE OF THE WEBSITE.
            </span>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Indemnification</h2>
          <p className={styles.paragraph}>
            You agree to indemnify and hold harmless Manaboodle from any claims, losses, 
            or damages arising from your violation of these terms or your use of the website.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Modifications to Terms</h2>
          <p className={styles.paragraph}>
            We reserve the right to modify these terms at any time. Changes will be effective 
            immediately upon posting to the website. Your continued use constitutes acceptance 
            of the modified terms.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>11. Governing Law</h2>
          <p className={styles.paragraph}>
            These terms shall be governed by and construed in accordance with the laws of 
            the jurisdiction in which Manaboodle operates, without regard to conflict of law principles.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Contact Us</h2>
          <div className={styles.contactInfo}>
            <p className={styles.paragraph}>
              If you have any questions about this privacy policy or our practices, please contact us through our <a href="/contact" className={styles.link}>contact form</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}