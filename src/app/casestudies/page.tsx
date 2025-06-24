import Link from 'next/link';
import Image from 'next/image';
import { articles } from '../../lib/content';
import { formatDate } from '../../lib/utils';
import styles from './casestudies.module.css';

export default function CaseStudiesPage() {
  const caseStudyArticles = articles.filter(article => article.category === 'casestudy');

  const getArticleUrl = (article: any) => {
    // Special URL mappings for case studies
    const urlMap: { [key: string]: string } = {
      'mangrove-education': '/casestudies/mangrove'
      // Add new case study URL mappings here as needed
    };

    return urlMap[article.id] || `/casestudies/${article.id}`;
  };

  const getMediaContent = (article: any) => {
    // Check if image exists, otherwise show placeholder
    const imageMap: { [key: string]: string } = {
      'mangrove-education': '/images/mangrove.jpg'
      // Add new case study images here as needed
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
    <div className={styles.caseStudiesPage}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Case Studies</h1>
        <p className={styles.pageDescription}>
          Real-world applications and deep-dive analyses of innovative educational approaches and systemic transformations.
        </p>
      </header>

      <div className={styles.articlesGrid}>
        {caseStudyArticles.length > 0 ? (
          caseStudyArticles.map((article) => (
            <Link key={article.id} href={getArticleUrl(article)} className={styles.cardLink}>
              <article className={styles.contentCard}>
                <div className={styles.cardMedia}>
                  {getMediaContent(article)}
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardCategory} data-category="case-study">
                    Case Study
                  </span>
                  <h2 className={styles.cardTitle}>{article.title}</h2>
                  <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardDate}>{formatDate(article.publishedAt)}</span>
                    <span className={styles.cardReadTime}>{article.readTime} min read</span>
                  </div>
                  <div className={styles.readButton} data-category="case-study">
                    READ ARTICLE
                  </div>
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No case studies available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}