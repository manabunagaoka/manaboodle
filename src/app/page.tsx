'use client';

import Link from 'next/link';
import Image from 'next/image';
import { articles } from '../lib/content';
import { formatDate } from '../lib/utils';
import styles from './page.module.css';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case 'concept': return 'Concept';
      case 'project': return 'Project';
      case 'casestudy': return 'Case Study';
      case 'random': return 'Random';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const getArticleUrl = (article: any) => {
    if (article.id === 'ai-nurturing-surrogate-caregivers') {
      return '/concepts/ai-nurturing';
    }
    if (article.id === 'karaokegogo') {
      return '/projects/karaokegogo';
    }
    if (article.id === 'nanny') {
      return '/projects/nanny';
    }
    if (article.id === 'vibe-coding') {
      return '/random/vibe-coding';
    }
    if (article.id === 'mangrove-education') {
      return '/casestudies/mangrove';
    }
    if (article.category === 'casestudy') {
      return `/casestudies/${article.id}`;
    }
    return `/${article.category}/${article.id}`;
  };

  const getCategoryAttribute = (category: string) => {
    return category === 'casestudy' ? 'case-study' : category;
  };

  const getMediaContent = (article: any, featured: boolean) => {
    if (article.id === 'ai-nurturing-surrogate-caregivers' && featured) {
      return (
        <Image
          src="/images/mandela.jpg"
          alt="Nelson Mandela - inspiration for the AI Nurturing Framework"
          width={1200}
          height={400}
          className={styles.featuredImage}
          priority
        />
      );
    }
    
    if (article.id === 'karaokegogo') {
      return (
        <Image
          src="/images/karaokegogo.jpg"
          alt="karaokeGoGo - Empowering children through music and creative expression"
          width={400}
          height={200}
          className={styles.cardImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }

    if (article.id === 'nanny') {
      return (
        <Image
          src="/images/nanny.jpg"
          alt="Nanny training program in Cape Town, South Africa"
          width={400}
          height={200}
          className={styles.cardImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }
    
    if (article.id === 'vibe-coding') {
      return (
        <Image
          src="/images/vibe.jpg"
          alt="Vibe Coding - The intersection of music, mood, and programming"
          width={400}
          height={200}
          className={styles.cardImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }

    if (article.id === 'mangrove-education') {
      return (
        <Image
          src="/images/mangrove.jpg"
          alt="Mangrove Education - Resilient education systems inspired by mangrove ecosystems"
          width={400}
          height={200}
          className={styles.cardImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }
    
    if (featured) {
      return (
        <div className={styles.mediaPlaceholder}>
          Photo/Video Area
          <div className={styles.mediaRatio}>Mobile: 375×280px | Desktop: 1200×400px</div>
        </div>
      );
    }
    return (
      <div className={styles.mediaPlaceholder}>
        Photo/Video Area
        <div className={styles.mediaRatio}>Mobile: 375×200px | Desktop: 400×200px</div>
      </div>
    );
  };

  const featuredArticle = articles.find(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  // Prevent hydration mismatch by not rendering dates until mounted
  if (!mounted) {
    return (
      <main className={styles.mainContent}>
        {/* Featured Article */}
        {featuredArticle && (
          <Link href={getArticleUrl(featuredArticle)} className={styles.cardLink}>
            <article className={`${styles.contentCard} ${styles.featuredCard}`}>
              <div className={styles.cardMedia}>
                {getMediaContent(featuredArticle, true)}
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardCategory} data-category="featured">Featured</span>
                <h1 className={styles.cardTitle}>{featuredArticle.title}</h1>
                <p className={styles.cardExcerpt}>{featuredArticle.excerpt}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.cardDate}>Loading...</span>
                  <span className={styles.cardReadTime}>{featuredArticle.readTime} min read</span>
                </div>
                <div className={styles.readButton} data-category="featured">
                  READ ARTICLE
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Regular Articles Grid */}
        <div className={styles.regularGrid}>
          {regularArticles.map((article, index) => (
            <Link key={article.id} href={getArticleUrl(article)} className={styles.cardLink}>
              <article className={styles.contentCard}>
                <div className={styles.cardMedia}>
                  {getMediaContent(article, false)}
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardCategory} data-category={getCategoryAttribute(article.category)}>
                    {getCategoryDisplay(article.category)}
                  </span>
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardDate}>Loading...</span>
                    <span className={styles.cardReadTime}>{article.readTime} min read</span>
                  </div>
                  <div className={styles.readButton} data-category={getCategoryAttribute(article.category)}>
                    READ ARTICLE
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContent}>
      {/* Featured Article */}
      {featuredArticle && (
        <Link href={getArticleUrl(featuredArticle)} className={styles.cardLink}>
          <article className={`${styles.contentCard} ${styles.featuredCard}`}>
            <div className={styles.cardMedia}>
              {getMediaContent(featuredArticle, true)}
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardCategory} data-category="featured">Featured</span>
              <h1 className={styles.cardTitle}>{featuredArticle.title}</h1>
              <p className={styles.cardExcerpt}>{featuredArticle.excerpt}</p>
              <div className={styles.cardMeta}>
                <span className={styles.cardDate}>{formatDate(featuredArticle.publishedAt)}</span>
                <span className={styles.cardReadTime}>{featuredArticle.readTime} min read</span>
              </div>
              <div className={styles.readButton} data-category="featured">
                READ ARTICLE
              </div>
            </div>
          </article>
        </Link>
      )}

      {/* Regular Articles Grid */}
      <div className={styles.regularGrid}>
        {regularArticles.map((article, index) => (
          <Link key={article.id} href={getArticleUrl(article)} className={styles.cardLink}>
            <article className={styles.contentCard}>
              <div className={styles.cardMedia}>
                {getMediaContent(article, false)}
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardCategory} data-category={getCategoryAttribute(article.category)}>
                  {getCategoryDisplay(article.category)}
                </span>
                <h3 className={styles.cardTitle}>{article.title}</h3>
                <p className={styles.cardExcerpt}>{article.excerpt}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.cardDate}>{formatDate(article.publishedAt)}</span>
                  <span className={styles.cardReadTime}>{article.readTime} min read</span>
                </div>
                <div className={styles.readButton} data-category={getCategoryAttribute(article.category)}>
                  READ ARTICLE
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}