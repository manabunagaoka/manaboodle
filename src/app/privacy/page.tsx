import { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Privacy Policy | Manaboodle',
  description: 'Privacy policy for Manaboodle - How we collect, use, and protect your information',
}

export default function PrivacyPage() {
  return (
    <div className={styles.privacyPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className={styles.content}>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
          <h3 className={styles.subsectionTitle}>Information You Provide</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Email address when you subscribe to our services</li>
            <li className={styles.listItem}>Name and email when you use our contact form</li>
            <li className={styles.listItem}>Any additional information you choose to provide in messages</li>
          </ul>
          
          <h3 className={styles.subsectionTitle}>Information Automatically Collected</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Browser type and version</li>
            <li className={styles.listItem}>Operating system</li>
            <li className={styles.listItem}>Pages visited and time spent</li>
            <li className={styles.listItem}>Referral source</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
          <p className={styles.paragraph}>We use the information we collect to:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Send you articles, updates, and service notifications you've subscribed to</li>
            <li className={styles.listItem}>Respond to your inquiries via the contact form</li>
            <li className={styles.listItem}>Improve our website and content</li>
            <li className={styles.listItem}>Analyze usage patterns to enhance user experience</li>
            <li className={styles.listItem}>Comply with legal obligations</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Data Storage and Security</h2>
          <p className={styles.paragraph}>
            We take reasonable measures to protect your personal information from unauthorized access, 
            use, or disclosure. Your data is stored securely using industry-standard encryption methods.
          </p>
          <p className={styles.paragraph}>
            We retain your personal information only for as long as necessary to fulfill the purposes 
            outlined in this privacy policy, unless a longer retention period is required by law.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Third-Party Services</h2>
          <p className={styles.paragraph}>We may use third-party services that collect information, including:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Analytics services to understand usage patterns</li>
            <li className={styles.listItem}>Email service providers for content delivery</li>
            <li className={styles.listItem}>Cloud storage providers for data backup</li>
          </ul>
          <p className={styles.paragraph}>
            These services have their own privacy policies, and we encourage you to review them.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Your Rights</h2>
          <p className={styles.paragraph}>You have the right to:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Access the personal information we hold about you</li>
            <li className={styles.listItem}>Request correction of inaccurate information</li>
            <li className={styles.listItem}>Request deletion of your personal information</li>
            <li className={styles.listItem}>Opt-out of marketing communications</li>
            <li className={styles.listItem}>Update your email preferences</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Cookies</h2>
          <p className={styles.paragraph}>
            We use cookies and similar technologies to enhance your experience on our website. 
            You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Children's Privacy</h2>
          <p className={styles.paragraph}>
            Our website is not intended for children under 13 years of age. We do not knowingly 
            collect personal information from children under 13.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Changes to This Policy</h2>
          <p className={styles.paragraph}>
            We may update this privacy policy from time to time. We will notify you of any changes 
            by posting the new privacy policy on this page and updating the "Last updated" date.
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