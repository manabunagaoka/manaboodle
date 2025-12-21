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
    if (article.id === 'flower') {
      return '/concepts/flower';
    }
    if (article.id === 'academic-portal') {
      return '/projects/academic-portal';
    }
    if (article.id === 'synthetic-intelligence-truth') {
      return '/concepts/synthetic-intelligence-truth';
    }
    if (article.id === 'childcare-startup-journey') {
      return '/projects/childcare-startup-journey';
    }
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
    if (article.id === 'tools') {
      return '/projects/tools';
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
    if (article.id === 'flower') {
      return (
        <Image
          src="/images/flower.jpg"
          alt="Flower - Closing the Gap Between Humans"
          width={featured ? 1200 : 400}
          height={featured ? 400 : 200}
          className={featured ? styles.featuredImage : styles.cardImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority
        />
      );
    }
    
    if (article.id === 'academic-portal') {
      return (
        <Image
          src="/images/academic_portal.jpg"
          alt="The Academic Portal - Tools for founders"
          width={featured ? 1200 : 400}
          height={featured ? 400 : 200}
          className={featured ? styles.featuredImage : styles.cardImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority
        />
      );
    }
    
    if (article.id === 'synthetic-intelligence-truth') {
      return (
        <Image
          src="/images/hi.jpg"
          alt="AI companion Hi with demon hunter aesthetic - exploring synthetic intelligence and truth"
          width={featured ? 1200 : 400}
          height={featured ? 400 : 200}
          className={featured ? styles.featuredImage : styles.cardImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority
        />
      );
    }
    
    if (article.id === 'childcare-startup-journey') {
      return (
        <Image
          src="/images/jenna.jpeg"
          alt="Childcare startup journey - talking to parents in the playground"
          width={featured ? 1200 : 400}
          height={featured ? 400 : 200}
          className={featured ? styles.featuredImage : styles.cardImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority
        />
      );
    }
    
    if (article.id === 'tools') {
      return (
        <Image
          src="/images/sassy.jpg"
          alt="Sassy - Anti-Newsletter Companion"
          width={featured ? 1200 : 400}
          height={featured ? 400 : 200}
          className={featured ? styles.featuredImage : styles.cardImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          priority
        />
      );
    }
    
    if (article.id === 'ai-nurturing-surrogate-caregivers') {
      return (
        <Image
          src="/images/mandela.jpg"
          alt="Nelson Mandela - inspiration for the AI Nurturing Framework"
          width={featured ? 1200 : 400}
          height={featured ? 400 : 200}
          className={featured ? styles.featuredImage : styles.cardImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

  // Filter articles to only include the ones you want
  const allowedArticleIds = ['flower', 'academic-portal', 'synthetic-intelligence-truth', 'childcare-startup-journey', 'ai-nurturing-surrogate-caregivers', 'mangrove-education', 'nanny', 'vibe-coding', 'karaokegogo', 'tools'];
  const filteredArticles = articles.filter(article => allowedArticleIds.includes(article.id));
  
  // Find featured article from the full list first, then check if it's in allowed list
  const featuredArticle = articles.find(article => article.featured && allowedArticleIds.includes(article.id));
  const regularArticles = filteredArticles.filter(article => !article.featured);

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