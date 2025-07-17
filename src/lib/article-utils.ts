/**
 * Calculate reading time based on word count
 * Average reading speed: 225 words per minute
 */
export function calculateReadTime(text: string): number {
  const wordsPerMinute = 225;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return time < 1 ? 1 : time; // Minimum 1 minute
}

/**
 * Format date to readable string
 */
export function formatArticleDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get word count from text
 */
export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Get reading stats for an article
 */
export function getReadingStats(text: string) {
  const wordCount = getWordCount(text);
  const readTime = calculateReadTime(text);
  
  return {
    wordCount,
    readTime,
    readTimeText: `${readTime} min read`
  };
}