export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'concept' | 'project' | 'random';
  publishedAt: string;
  readTime: number;
  featured: boolean;
}

export interface NavigationItem {
  name: string;
  href: string;
  current?: boolean;
}
