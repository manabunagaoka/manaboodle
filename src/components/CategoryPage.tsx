import Link from 'next/link';
import { Article } from '../lib/content';
import { formatDate } from '../lib/utils';
import styles from './CategoryPage.module.css';

interface CategoryPageProps {
  title: string;
  description: string;
  articles: Article[];
  categoryColor: string;
}

export default function CategoryPage({ title, description, articles, categoryColor }: CategoryPageProps) {
  const getArticleUrl = (article: Article) => {
    if (article.id === 'ai-nurturing-surrogate-caregivers') {
      return '/concepts/ai-nurturing';
    }
    return `/${article.category}/${article.id}`;
  };

  return (
    <div className={styles.categoryPage}>
      <header className={styles.pageHeader} style={{ borderColor: categoryColor }}>
        <Link href="/" className={styles.backLink}>← Back to Home</Link>
        <h1 className={styles.pageTitle} style={{ color: categoryColor }}>{title}</h1>
        <p className={styles.pageDescription}>{description}</p>
      </header>

      <div className={styles.articlesGrid}>
        {articles.map((article) => (
          <Link key={article.id} href={getArticleUrl(article)} className={styles.cardLink}>
            <article className={styles.articleCard}>
              <div className={styles.cardMedia}>
                <div className={styles.mediaPlaceholder}>
                  Photo/Video Area
                  <div className={styles.mediaRatio}>400×200px</div>
                </div>
              </div>
              <div className={styles.cardContent}>
                <span 
                  className={styles.cardCategory} 
                  style={{ background: categoryColor }}
                >
                  {article.category}
                </span>
                <h2 className={styles.cardTitle}>{article.title}</h2>
                <p className={styles.cardExcerpt}>{article.excerpt}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.cardDate}>{formatDate(article.publishedAt)}</span>
                  <span className={styles.cardReadTime}>{article.readTime} min read</span>
                </div>
                <div 
                  className={styles.readButton}
                  style={{ background: categoryColor }}
                >
                  READ ARTICLE
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
