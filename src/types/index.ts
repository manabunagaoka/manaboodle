export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'concept' | 'project' | 'random' | 'case-study';
  image: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  slug: string;
  content: string;
  tags: string[];
}

export interface NavigationItem {
  name: string;
  href: string;
  current?: boolean;
}
