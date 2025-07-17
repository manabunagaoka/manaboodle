import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { calculateReadTime } from '@/lib/article-utils';
import styles from '@/app/concepts/article.module.css';

interface ArticleSection {
  heading?: string;
  content: string[];
  quote?: {
    text: string;
    author?: string;
  };
}

interface ArticleTemplateProps {
  // Basic metadata
  id: string;
  title: string;
  category: 'concept' | 'project' | 'casestudy' | 'random';
  categoryLink: string;
  excerpt: string;
  featured?: boolean;
  
  // Hero image (optional)
  heroImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
  
  // Article content
  introduction: string;
  sections: ArticleSection[];
  
  // Tags
  tags?: string[];
}

export default function ArticleTemplate({
  id,
  title,
  category,
  categoryLink,
  excerpt,
  heroImage,
  introduction,
  sections,
  tags = []
}: ArticleTemplateProps) {
  // Calculate read time from all content
  const fullContent = [
    introduction,
    ...sections.flatMap(section => [
      section.heading || '',
      ...section.content,
      section.quote?.text || ''
    ])
  ].join(' ');
  
  const readTime = calculateReadTime(fullContent);
  const wordCount = fullContent.split(/\s+/).length;
  
  // Get current date as last modified (in real app, could use git or file system)
  const lastModified = new Date().toISOString().split('T')[0];
  
  return (
    <div className={styles.articlePage}>
      <div className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href={categoryLink} className={styles.backLink}>
            ← Back to {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
          <span className={styles.articleCategory}>{category}</span>
        </div>
        
        <h1 className={styles.articleTitle}>{title}</h1>
        
        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>By Manabu Nagaoka</span>
            <span>•</span>
            <span className={styles.publishDate}>Last updated: {formatDate(lastModified)}</span>
            <span>•</span>
            <span className={styles.readTime}>{readTime} min read</span>
            <span>•</span>
            <span className={styles.wordCount}>{wordCount.toLocaleString()} words</span>
          </div>
        </div>
      </div>

      {heroImage && (
        <div className={styles.articleImage}>
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            width={800}
            height={400}
            className={styles.heroImage}
            priority
          />
          {heroImage.caption && (
            <div className={styles.imageCaption}>
              {heroImage.caption}
            </div>
          )}
        </div>
      )}

      <div className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>{introduction}</p>
        </div>

        {sections.map((section, index) => (
          <section key={index} className={styles.articleSection}>
            {section.heading && (
              <h2 className={styles.sectionHeading}>{section.heading}</h2>
            )}
            <div className={styles.sectionContent}>
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
              
              {section.quote && (
                <div className={styles.importantNote}>
                  "{section.quote.text}"
                  {section.quote.author && ` — ${section.quote.author}`}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <footer className={styles.articleFooter}>
        {tags.length > 0 && (
          <div className={styles.articleTags}>
            {tags.map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        )}
        
        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}