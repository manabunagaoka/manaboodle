import Link from 'next/link';
import Image from 'next/image';
import { articles } from '../../lib/content';
import { formatDate } from '../../lib/utils';
import styles from './random.module.css';

export default function RandomPage() {
  const randomArticles = articles.filter(article => article.category === 'random');

  const getMediaContent = (article: any) => {
    // Check if image exists, otherwise show placeholder
    const imageMap: { [key: string]: string } = {
      'vibe-coding': '/images/vibe.jpg'
      // Add new random post images here as needed
    };

    if (imageMap[article.id]) {
      return (
        <Image
          src={imageMap[article.id]}
          alt={article.title}
          width={400}
          height={220}
          className={styles.cardImage}
        />
      );
    }
    
    return (
      <div className={styles.mediaPlaceholder}>
        Photo/Video Area
        <div className={styles.mediaRatio}>400×220px</div>
      </div>
    );
  };

  return (
    <div className={styles.randomPage}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Random</h1>
        <p className={styles.pageDescription}>
          Spontaneous thoughts, observations, and musings on various topics.
        </p>
      </header>

      <div className={styles.articlesGrid}>
        {randomArticles.length > 0 ? (
          randomArticles.map((article) => (
            <Link key={article.id} href={`/random/${article.id}`} className={styles.cardLink}>
              <article className={styles.contentCard}>
                <div className={styles.cardMedia}>
                  {getMediaContent(article)}
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardCategory} data-category="random">
                    Random
                  </span>
                  <h2 className={styles.cardTitle}>{article.title}</h2>
                  <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardDate}>{formatDate(article.publishedAt)}</span>
                    <span className={styles.cardReadTime}>{article.readTime} min read</span>
                  </div>
                  <div className={styles.readButton} data-category="random">
                    READ ARTICLE
                  </div>
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No random posts available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}