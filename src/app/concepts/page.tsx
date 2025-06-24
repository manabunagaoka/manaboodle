import Link from 'next/link';
import Image from 'next/image';
import { articles } from '../../lib/content';
import { formatDate } from '../../lib/utils';
import styles from './concepts.module.css';

export default function ConceptsPage() {
  const conceptArticles = articles.filter(article => article.category === 'concept');

  const getArticleUrl = (article: any) => {
    // Special URL mappings for concepts
    const urlMap: { [key: string]: string } = {
      'ai-nurturing-surrogate-caregivers': '/concepts/ai-nurturing'
      // Add new concept URL mappings here as needed
    };

    return urlMap[article.id] || `/concepts/${article.id}`;
  };

  const getMediaContent = (article: any) => {
    // Check if image exists, otherwise show placeholder
    const imageMap: { [key: string]: string } = {
      'ai-nurturing-surrogate-caregivers': '/images/mandela.jpg'
      // Add new concept images here as needed
    };

    if (imageMap[article.id]) {
      return (
        <Image
          src={imageMap[article.id]}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.articleImage}
          priority
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
    <div className={styles.conceptsPage}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Concepts</h1>
        <p className={styles.pageDescription}>
          Exploring new ideas and frameworks in AI, education, and human-computer interaction.
        </p>
      </header>

      <div className={styles.articlesGrid}>
        {conceptArticles.length > 0 ? (
          conceptArticles.map((article) => (
            <Link key={article.id} href={getArticleUrl(article)} className={styles.cardLink}>
              <article className={styles.contentCard}>
                <div className={styles.cardMedia}>
                  {getMediaContent(article)}
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardCategory} data-category="concept">
                    Concept
                  </span>
                  <h2 className={styles.cardTitle}>{article.title}</h2>
                  <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardDate}>{formatDate(article.publishedAt)}</span>
                    <span className={styles.cardReadTime}>{article.readTime} min read</span>
                  </div>
                  <div className={styles.readButton} data-category="concept">
                    READ ARTICLE
                  </div>
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No concepts available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}