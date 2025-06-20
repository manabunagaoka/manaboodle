import Link from 'next/link';
import styles from './archive.module.css';

export default function ArchivePage() {
  return (
    <div className={styles.archivePage}>
      {/* Back button in upper left */}
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      {/* Page header without back button */}
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Archive</h1>
        <p className={styles.pageDescription}>
          A collection of older articles and posts as the site expands.
        </p>
      </header>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📚</div>
        <h2>No archived content yet</h2>
        <p>As the site grows, older articles will be organized here for easy access.</p>
        <Link href="/" className={styles.backToHome}>
          Explore Current Articles
        </Link>
      </div>
    </div>
  );
}
