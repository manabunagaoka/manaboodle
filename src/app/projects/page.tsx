import Link from 'next/link';
import Image from 'next/image';
import { articles } from '../../lib/content';
import { formatDate } from '../../lib/utils';
import styles from './projects.module.css';

export default function ProjectsPage() {
  const projectArticles = articles.filter(article => article.category === 'project');

  const getMediaContent = (article: any) => {
    if (article.id === 'karaokegogo') {
      return (
        <Image
          src="/images/karaokegogo.jpg"
          alt="KaraokeGoGo - Empowering children through music and creative expression"
          width={400}
          height={220}
          className={styles.cardImage}
        />
      );
    }

    if (article.id === 'nanny') {
      return (
        <Image
          src="/images/nanny.jpg"
          alt="Nanny training program in Cape Town, South Africa"
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
      {/* Back button in upper left */}
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      {/* Page header without back button */}
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