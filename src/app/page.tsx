'use client';

import { articles } from '../lib/content';
import { formatDate } from '../lib/utils';
import styles from './page.module.css';

export default function HomePage() {
  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case 'concept': return 'Concept';
      case 'project': return 'Project';
      case 'random': return 'Random';
      case 'case-study': return 'Case Study';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const getMediaPlaceholder = (featured: boolean) => {
    if (featured) {
      return (
        <div className={styles.mediaPlaceholder}>
          Photo/Video Area
          <div className={styles.mediaRatio}>Mobile: 375×280px | Desktop: 1200×400px</div>
        </div>
      );
    }
    return (
      <div className={styles.mediaPlaceholder}>
        Photo/Video Area
        <div className={styles.mediaRatio}>Mobile: 375×200px | Desktop: 400×200px</div>
      </div>
    );
  };

  const featuredArticle = articles.find(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured).slice(0, 6);

  return (
    <main className={styles.mainContent}>
      {/* Featured Article - Full Width at Top */}
      {featuredArticle && (
        <article className={`${styles.contentCard} ${styles.featuredCard}`}>
          <div className={styles.cardMedia}>
            {getMediaPlaceholder(true)}
          </div>
          <div className={styles.cardContent}>
            <span className={styles.cardCategory}>Featured</span>
            <h1 className={styles.cardTitle}>{featuredArticle.title}</h1>
            <p className={styles.cardExcerpt}>{featuredArticle.excerpt}</p>
            <div className={styles.cardMeta}>
              <span className={styles.cardDate}>{formatDate(featuredArticle.publishedAt)}</span>
              <span className={styles.cardReadTime}>{featuredArticle.readTime} min read</span>
            </div>
          </div>
        </article>
      )}

      {/* Regular Articles Grid */}
      <div className={styles.regularGrid}>
        {regularArticles.map((article, index) => (
          <article key={article.id} className={styles.contentCard}>
            <div className={styles.cardMedia}>
              {getMediaPlaceholder(false)}
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardCategory}>{getCategoryDisplay(article.category)}</span>
              <h3 className={styles.cardTitle}>{article.title}</h3>
              <p className={styles.cardExcerpt}>{article.excerpt}</p>
              <div className={styles.cardMeta}>
                <span className={styles.cardDate}>{formatDate(article.publishedAt)}</span>
                <span className={styles.cardReadTime}>{article.readTime} min read</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
