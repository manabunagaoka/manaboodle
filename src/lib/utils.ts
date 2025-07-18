export function formatDate(dateString: string): string {
  // Add time to ensure it's interpreted as noon local time
  const date = new Date(dateString + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 225;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
