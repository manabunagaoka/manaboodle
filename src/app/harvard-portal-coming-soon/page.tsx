// app/harvard-portal-coming-soon/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './harvard-coming-soon.module.css';

export const metadata = {
  title: 'Harvard Portal - Coming Soon | Manaboodle',
  description: 'Harvard University exclusive access to MVP tools - authentication system in development.',
};

export default function HarvardPortalComingSoon() {
  return (
    <div className={styles.comingSoonPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Image 
            src="/images/Harvard_University_logo.png"
            alt="Harvard University Logo"
            width={80}
            height={80}
            className={styles.harvardLogo}
          />
          <h1 className={styles.title}>Harvard University Portal</h1>
          <p className={styles.subtitle}>Authentication System in Development</p>
        </div>

        <div className={styles.content}>
          <div className={styles.statusCard}>
            <h2 className={styles.statusTitle}>🚧 Under Construction</h2>
            <p className={styles.statusDescription}>
              We're building a secure authentication system for Harvard University students 
              to access exclusive MVP tools and features.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔐</div>
              <h3 className={styles.featureTitle}>Secure Authentication</h3>
              <p className={styles.featureDescription}>
                NextAuth.js integration with Harvard email verification
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3 className={styles.featureTitle}>Course Authorization</h3>
              <p className={styles.featureDescription}>
                Access control based on enrolled courses and student status
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚀</div>
              <h3 className={styles.featureTitle}>MVP Tools Dashboard</h3>
              <p className={styles.featureDescription}>
                Exclusive access to Clusters, Runway, and new tools in development
              </p>
            </div>
          </div>

          <div className={styles.timeline}>
            <h3 className={styles.timelineTitle}>Development Timeline</h3>
            <div className={styles.timelineItems}>
              <div className={`${styles.timelineItem} ${styles.current}`}>
                <div className={styles.timelineIcon}>📋</div>
                <div className={styles.timelineContent}>
                  <h4>Planning & Design</h4>
                  <p>Authentication flow and user experience design</p>
                  <span className={styles.timelineStatus}>In Progress</span>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>🔐</div>
                <div className={styles.timelineContent}>
                  <h4>Authentication System</h4>
                  <p>NextAuth.js setup with Harvard email validation</p>
                  <span className={styles.timelineStatus}>Next</span>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>🎛️</div>
                <div className={styles.timelineContent}>
                  <h4>MVP Dashboard</h4>
                  <p>Exclusive tools interface and course integration</p>
                  <span className={styles.timelineStatus}>Coming Soon</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.notificationSection}>
            <h3 className={styles.notificationTitle}>Get Notified When Ready</h3>
            <p className={styles.notificationDescription}>
              Want to be among the first Harvard students to access the portal?
            </p>
            <Link href="/subscribe" className={styles.notifyButton}>
              Subscribe for Updates
            </Link>
          </div>
        </div>

        <div className={styles.footer}>
          <Link href="/tools" className={styles.backButton}>
            ← Back to Tools
          </Link>
          
          <div className={styles.contact}>
            <p>Questions about Harvard portal access?</p>
            <Link href="/contact" className={styles.contactLink}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}