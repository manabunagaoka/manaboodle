// Auto-update script for article content
// Run this script to automatically extract and update content from article files

import { articles } from './content';
import { extractArticleContent } from './content-extractor';

export function updateArticleContent() {
  const updatedArticles = articles.map(article => {
    const extracted = extractArticleContent(article.id, article.category);
    
    return {
      ...article,
      content: extracted.content || article.content || '',
      author: extracted.author || article.author || 'Manabu Nagaoka'
    };
  });

  console.log('Updated article content for search:');
  updatedArticles.forEach(article => {
    console.log(`- ${article.title}: ${article.content?.length || 0} characters`);
  });

  return updatedArticles;
}

// For development - you can call this in the SearchContext to auto-update content
export const getUpdatedArticles = () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      return updateArticleContent();
    } catch (error) {
      console.warn('Content auto-extraction failed, using static content:', error);
      return articles;
    }
  }
  return articles;
};
