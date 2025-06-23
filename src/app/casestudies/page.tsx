import Link from 'next/link';
import Image from 'next/image';
import { articles } from '../../lib/content';
import { formatDate } from '../../lib/utils';
import styles from './casestudies.module.css';

export default function CaseStudiesPage() {
  const caseStudyArticles = articles.filter(article => article.category === 'casestudy');

  const getArticleUrl = (article: any) => {
    if (article.id === 'mangrove-education') {
      return '/casestudies/mangrove';
    }
    return `/casestudies/${article.id}`;
  };

  const getMediaContent = (article: any) => {
    if (article.id === 'mangrove-education') {
      return (
        <Image
          src="/images/mangrove.jpg"
          alt="Mangrove Education - Resilient education systems inspired by mangrove ecosystems"
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
      {/* Back button in upper left */}
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      {/* Page header without back button */}
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