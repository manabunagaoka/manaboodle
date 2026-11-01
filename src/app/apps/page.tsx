import Link from 'next/link';
import Image from 'next/image';
import { articles } from '../../lib/content';
import { formatDate } from '../../lib/utils';
import styles from './apps.module.css';

export const metadata = {
  title: 'Apps - Manaboodle',
  description: 'Apps by Manaboodle. Read the story behind each one, then open the app.',
};

// One image per app article. Add a line here when a new app article goes up.
const appImages: { [key: string]: { src: string; alt: string } } = {
  forks: {
    src: '/images/apps/forks.png',
    alt: 'Six crowds of people joined by lines, with two people choosing the same path through all of them',
  },
  prosody: {
    src: '/images/apps/prosody.jpg',
    alt: 'A small flower with rainbow petals growing from a crack in an old stone wall',
  },
};

export default function AppsPage() {
  const appArticles = articles.filter(article => article.category === 'app');

  return (
    <div className={styles.appsPage}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>

      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Apps</h1>
        <p className={styles.pageDescription}>
          Apps I have built and released. Read the story behind each one, then open the app.
        </p>
      </header>

      <div className={styles.articlesGrid}>
        {appArticles.length > 0 ? (
          appArticles.map((article) => (
            <Link key={article.id} href={`/apps/${article.id}`} className={styles.cardLink}>
              <article className={styles.contentCard}>
                <div className={styles.cardMedia}>
                  {appImages[article.id] ? (
                    <Image
                      src={appImages[article.id].src}
                      alt={appImages[article.id].alt}
                      width={400}
                      height={220}
                      className={styles.cardImage}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className={styles.mediaPlaceholder}>
                      Photo/Video Area
                      <div className={styles.mediaRatio}>400×220px</div>
                    </div>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardCategory} data-category="app">
                    App
                  </span>
                  <h2 className={styles.cardTitle}>{article.title}</h2>
                  <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardDate}>{formatDate(article.publishedAt)}</span>
                    <span className={styles.cardReadTime}>{article.readTime} min read</span>
                  </div>
                  <div className={styles.readButton} data-category="app">
                    READ ARTICLE
                  </div>
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No apps released yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
