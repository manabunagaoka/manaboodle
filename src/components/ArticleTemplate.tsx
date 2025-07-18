// src/components/ArticleTemplate.tsx
'use client';

import React from 'react';
import { calculateReadingTime } from '@/lib/article-utils';

// Type definitions
export interface ArticleMetadata {
  id: string;
  title: string;
  excerpt: string;
  category: 'casestudy' | 'concepts' | 'projects' | 'random';
  publishedAt: string;
  updatedAt?: string;
  readTime?: number; // Will be calculated if not provided
  featured?: boolean;
  isPaid?: boolean;
  tier?: 'free' | 'premium' | 'enterprise';
  tags?: string[];
  author?: {
    name: string;
    avatar?: string;
  };
}

interface ArticleTemplateProps {
  metadata: ArticleMetadata;
  content: React.ReactNode;
  className?: string;
}

// Helper function to format relative time
function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      if (diffMinutes === 0) return 'just now';
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

// Category display names
const categoryDisplayNames = {
  casestudy: 'Case Study',
  concepts: 'Concept',
  projects: 'Project',
  random: 'Random',
};

// Main ArticleTemplate component (Client Component)
export default function ArticleTemplate({ 
  metadata, 
  content, 
  className = '' 
}: ArticleTemplateProps) {
  // Calculate reading time if not provided
  const readingTime = metadata.readTime || calculateReadingTime(content);
  
  // Format dates
  const publishedDate = new Date(metadata.publishedAt);
  const publishedDateFormatted = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const publishedDateRelative = formatDistanceToNow(publishedDate);
  
  const updatedDate = metadata.updatedAt ? new Date(metadata.updatedAt) : null;
  const updatedDateFormatted = updatedDate?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const updatedDateRelative = updatedDate ? formatDistanceToNow(updatedDate) : null;

  // Notification effect (client-side only)
  React.useEffect(() => {
    // This is where notification logic will be implemented
    // For now, just log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Article viewed:', metadata.id);
    }
    
    // Future: Send notification to subscribers based on:
    // - article.category
    // - article.tags
    // - article.isPaid/tier
    // - User preferences
  }, [metadata.id]);

  return (
    <article className={`article-template ${className}`}>
      {/* Article Header */}
      <header className="article-header">
        {/* Category Badge */}
        <div className="article-meta-top">
          <span className={`category-badge category-${metadata.category}`}>
            {categoryDisplayNames[metadata.category]}
          </span>
          {metadata.featured && (
            <span className="featured-badge">Featured</span>
          )}
          {metadata.isPaid && (
            <span className="paid-badge">{metadata.tier || 'Premium'}</span>
          )}
        </div>

        {/* Title */}
        <h1 className="article-title">{metadata.title}</h1>

        {/* Excerpt */}
        {metadata.excerpt && (
          <p className="article-excerpt">{metadata.excerpt}</p>
        )}

        {/* Article Meta */}
        <div className="article-meta">
          {/* Author */}
          {metadata.author && (
            <div className="article-author">
              {metadata.author.avatar && (
                <img 
                  src={metadata.author.avatar} 
                  alt={metadata.author.name}
                  className="author-avatar"
                />
              )}
              <span className="author-name">{metadata.author.name}</span>
            </div>
          )}

          {/* Dates and Reading Time */}
          <div className="article-meta-info">
            <time 
              dateTime={metadata.publishedAt}
              title={publishedDateFormatted}
              className="published-date"
            >
              {publishedDateRelative}
            </time>
            {updatedDate && (
              <>
                <span className="meta-separator">•</span>
                <time 
                  dateTime={metadata.updatedAt}
                  title={`Updated: ${updatedDateFormatted}`}
                  className="updated-date"
                >
                  Updated {updatedDateRelative}
                </time>
              </>
            )}
            <span className="meta-separator">•</span>
            <span className="reading-time">{readingTime} min read</span>
          </div>
        </div>

        {/* Tags */}
        {metadata.tags && metadata.tags.length > 0 && (
          <div className="article-tags">
            {metadata.tags.map((tag) => (
              <span key={tag} className="article-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Article Content */}
      <div className="article-content">
        {content}
      </div>

      {/* Article Footer */}
      <footer className="article-footer">
        {/* Share buttons placeholder */}
        <div className="share-section">
          <h3>Share this article</h3>
          <div className="share-buttons">
            {/* Add share buttons here */}
          </div>
        </div>

        {/* Newsletter signup placeholder */}
        {!metadata.isPaid && (
          <div className="newsletter-signup">
            <h3>Stay updated</h3>
            <p>Get notified when we publish new articles</p>
            {/* Add newsletter form here */}
          </div>
        )}
      </footer>
    </article>
  );
}