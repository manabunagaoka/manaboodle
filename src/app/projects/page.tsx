import Link from 'next/link';
import Image from 'next/image';
import { articles } from '../../lib/content';
import { formatDate } from '../../lib/utils';
import styles from './projects.module.css';

export default function ProjectsPage() {
  const projectArticles = articles.filter(article => article.category === 'project');

  const getMediaContent = (article: any) => {
    // Check if image exists, otherwise show placeholder
    const imageMap: { [key: string]: string } = {
      'karaokegogo': '/images/karaokegogo.jpg',
      'nanny': '/images/nanny.jpg'
      // Add new project images here as needed
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
    <div className={styles.projectsPage}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Projects</h1>
        <p className={styles.pageDescription}>
          Real-world applications and implementations of innovative ideas and technologies.
        </p>
      </header>

      <div className={styles.articlesGrid}>
        {projectArticles.length > 0 ? (
          projectArticles.map((article) => (
            <Link key={article.id} href={`/projects/${article.id}`} className={styles.cardLink}>
              <article className={styles.contentCard}>
                <div className={styles.cardMedia}>
                  {getMediaContent(article)}
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardCategory} data-category="project">
                    Project
                  </span>
                  <h2 className={styles.cardTitle}>{article.title}</h2>
                  <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardDate}>{formatDate(article.publishedAt)}</span>
                    <span className={styles.cardReadTime}>{article.readTime} min read</span>
                  </div>
                  <div className={styles.readButton} data-category="project">
                    READ ARTICLE
                  </div>
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No projects available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}