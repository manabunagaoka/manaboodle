export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'concept' | 'project' | 'casestudy' | 'random';
  publishedAt: string;
  readTime: number;
  featured: boolean;
}

export const articles: Article[] = [
  {
    id: 'ai-nurturing-surrogate-caregivers',
    title: 'AI Nurturing and Surrogate Caregivers',
    excerpt: 'Imagine a dataset capturing emotional nuances and caregiving insights from millions of genuine interactions within a unique triangular relationship: human children, caregivers, and AI.',
    category: 'concept',
    publishedAt: '2025-06-17',
    readTime: 12,
    featured: true
  },
  {
    id: 'mangrove-education',
    title: 'Mangrove Education',
    excerpt: 'Exploring resilient education systems inspired by mangrove ecosystems - adaptive, interconnected, and thriving in challenging environments.',
    category: 'casestudy',
    publishedAt: '2025-06-23',
    readTime: 8,
    featured: false
  },
  {
    id: 'nanny',
    title: 'Super Personalized Learning Model: Nannies vs AI',
    excerpt: 'From Cape Town to global reach: how we are empowering nannies with AI-powered tools to create super-personalized learning experiences for children everywhere.',
    category: 'project',
    publishedAt: '2025-06-22',
    readTime: 6,
    featured: false
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding',
    excerpt: 'Exploring the intersection of music, mood, and programming productivity. How different vibes can unlock creative coding flow states.',
    category: 'random',
    publishedAt: '2025-06-22',
    readTime: 7,
    featured: false
  },
  {
    id: 'karaokegogo',
    title: 'karaokeGoGo',
    excerpt: 'A music-sharing platform designed to empower children globally through joyful, creative singing experiences.',
    category: 'project',
    publishedAt: '2025-06-19',
    readTime: 8,
    featured: false
  }
];

export const getArticlesByCategory = (category: Article['category']) => {
  return articles.filter(article => article.category === category);
};

export const getFeaturedArticles = () => {
  return articles.filter(article => article.featured);
};