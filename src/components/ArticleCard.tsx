import Link from 'next/link';
import { Article } from '@/lib/content';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  className?: string;
}

export default function ArticleCard({ article, featured = false, className = '' }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Map article IDs to specific routes
  const getArticleUrl = (article: Article) => {
    if (article.id === 'ai-nurturing-surrogate-caregivers') {
      return '/concepts/ai-nurturing';
    }
    return `/${article.category}/${article.id}`;
  };

  return (
    <article className={`content-card ${featured ? 'featured-card' : ''} ${className}`}>
      <div className="card-media">
        <div className="media-placeholder">
          Photo/Video Area
          <div className="media-ratio">
            {featured ? 'Mobile: 375×250px | Desktop: 600×350px' : 'Mobile: 375×200px | Desktop: 280×160px'}
          </div>
        </div>
      </div>
      <div className="card-content">
        <span className="card-category">{featured ? 'Featured' : article.category}</span>
        <h2 className="card-title">{article.title}</h2>
        <p className="card-excerpt">{article.excerpt}</p>
        <div className="card-meta">
          <span className="card-date">{formatDate(article.publishedAt)}</span>
          <span className="card-read-time">{article.readTime} min read</span>
        </div>
        <Link href={getArticleUrl(article)} className="read-button">
          READ ARTICLE
        </Link>
      </div>
    </article>
  );
}
