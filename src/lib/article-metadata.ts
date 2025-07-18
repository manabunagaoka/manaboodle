// src/lib/article-metadata.ts
import type { Metadata } from 'next';
import type { ArticleMetadata } from '@/components/ArticleTemplate';

// Helper function to generate metadata for Next.js (Server-side only)
export function generateArticleMetadata(article: ArticleMetadata): Metadata {
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: article.author ? [article.author.name] : undefined,
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  };
}

// Server-side notification trigger (for future implementation)
export async function triggerArticleNotification(
  article: ArticleMetadata,
  action: 'published' | 'updated'
) {
  // This function will be called server-side when articles are published/updated
  // It will:
  // 1. Query subscribers with matching preferences
  // 2. Check notification settings
  // 3. Queue email notifications
  // 4. Return notification status
  
  console.log(`Notification triggered for article ${article.id}: ${action}`);
  
  // Placeholder for future implementation
  return {
    success: true,
    notificationsSent: 0,
    message: 'Notification system not yet implemented',
  };
}