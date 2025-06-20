export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'concept' | 'project' | 'random';
  publishedAt: string;
  readTime: number;
  featured: boolean;
}

export const articles: Article[] = [
  {
    id: 'karaokegogo',
    title: 'karaokeGoGo',
    excerpt: 'A music-sharing platform designed to empower children globally through joyful, creative singing experiences.',
    category: 'project',
    publishedAt: '2025-06-19',
    readTime: 8,
    featured: false
  },
  {
    id: 'ai-nurturing-surrogate-caregivers',
    title: 'AI Nurturing and Surrogate Caregivers',
    excerpt: 'Imagine a dataset capturing emotional nuances and caregiving insights from millions of genuine interactions within a unique triangular relationship: human children, caregivers, and AI siblings.',
    category: 'concept',
    publishedAt: '2025-06-17',
    readTime: 12,
    featured: true
  },
  {
    id: 'psychology-ui-design',
    title: 'The Psychology of User Interface Design',
    excerpt: 'Understanding how cognitive psychology principles can make interfaces more intuitive and user-friendly.',
    category: 'concept',
    publishedAt: '2025-06-05',
    readTime: 10,
    featured: false
  },
  {
    id: 'modern-component-library',
    title: 'Building a Modern Component Library with React 18',
    excerpt: 'A deep dive into creating reusable, accessible components that scale across multiple projects and teams.',
    category: 'project',
    publishedAt: '2025-06-10',
    readTime: 12,
    featured: false
  },
  {
    id: 'realtime-analytics-dashboard',
    title: 'Building a Real-Time Analytics Dashboard',
    excerpt: 'From concept to deployment: creating a dashboard that handles millions of data points with sub-second response times.',
    category: 'project',
    publishedAt: '2025-06-01',
    readTime: 15,
    featured: false
  },
  {
    id: 'afternoon-tea-ritual',
    title: 'Why I Started Drinking Tea at 3 PM Every Day',
    excerpt: 'A simple ritual that transformed my afternoon productivity and mental clarity in unexpected ways.',
    category: 'random',
    publishedAt: '2025-06-08',
    readTime: 5,
    featured: false
  }
];

export const getArticlesByCategory = (category: Article['category']) => {
  return articles.filter(article => article.category === category);
};

export const getFeaturedArticles = () => {
  return articles.filter(article => article.featured);
};
