import { Article } from '@/types';

export const articles: Article[] = [
  {
    id: '1',
    title: 'AI Nurturing Framework: The Future of Emotional Intelligence',
    excerpt: 'How artificial intelligence can be designed to provide genuine emotional support and understanding in our daily interactions.',
    category: 'concept',
    image: '/images/ai-nurturing.jpg',
    publishedAt: '2025-06-15',
    readTime: 8,
    featured: true,
    slug: 'ai-nurturing-framework',
    tags: ['AI', 'Emotional Intelligence', 'Future Tech'],
    content: `# AI Nurturing Framework: The Future of Emotional Intelligence

The intersection of artificial intelligence and emotional support represents one of the most promising frontiers in technology. As we advance toward more sophisticated AI systems, the question isn't just what they can compute, but how they can care.

## The Foundation of Emotional AI

Traditional AI focuses on problem-solving and data processing. But what if we could build systems that understand not just what we need, but how we feel about needing it?

## Key Components

1. **Emotional Recognition**: Advanced sentiment analysis beyond text
2. **Contextual Understanding**: Reading between the lines of human communication
3. **Adaptive Responses**: Learning individual emotional patterns and preferences

## The Future Impact

This framework could revolutionize everything from customer service to mental health support, creating AI that doesn't just respond to our requests but truly understands our emotional state.`
  },
  {
    id: '2',
    title: 'Building a Modern Component Library with React 18',
    excerpt: 'A deep dive into creating reusable, accessible components that scale across multiple projects and teams.',
    category: 'project',
    image: '/images/component-library.jpg',
    publishedAt: '2025-06-10',
    readTime: 12,
    featured: false,
    slug: 'modern-component-library',
    tags: ['React', 'TypeScript', 'Design Systems'],
    content: `# Building a Modern Component Library with React 18

Component libraries are the backbone of scalable front-end development. Here's how we built one that serves multiple teams and projects.

## The Challenge

Creating components that work across different contexts while maintaining consistency and accessibility.

## Our Approach

We focused on three core principles:
1. **Accessibility First**: Every component meets WCAG 2.1 standards
2. **TypeScript Native**: Full type safety from the ground up
3. **Theme Flexibility**: Easy customization without breaking changes

## Results

Our library now powers 15+ applications with 99.9% uptime and zero accessibility violations.`
  },
  {
    id: '3',
    title: 'Why I Started Drinking Tea at 3 PM Every Day',
    excerpt: 'A simple ritual that transformed my afternoon productivity and mental clarity in unexpected ways.',
    category: 'random',
    image: '/images/tea-ritual.jpg',
    publishedAt: '2025-06-08',
    readTime: 5,
    featured: false,
    slug: 'afternoon-tea-ritual',
    tags: ['Productivity', 'Wellness', 'Habits'],
    content: `# Why I Started Drinking Tea at 3 PM Every Day

Sometimes the smallest changes create the biggest impact. This is the story of how a simple tea ritual changed my entire afternoon routine.

## The Problem

Every day around 3 PM, my energy would crash. Coffee made me jittery, and snacks left me sluggish.

## The Solution

Green tea with a 5-minute mindfulness break. Nothing fancy, just presence.

## The Results

- 40% increase in afternoon productivity
- Better sleep quality
- More intentional work habits

It's amazing how something so simple can be so transformative.`
  },
  {
    id: '4',
    title: 'The Psychology of User Interface Design',
    excerpt: 'Understanding how cognitive psychology principles can make interfaces more intuitive and user-friendly.',
    category: 'concept',
    image: '/images/ui-psychology.jpg',
    publishedAt: '2025-06-05',
    readTime: 10,
    featured: false,
    slug: 'psychology-ui-design',
    tags: ['UX', 'Psychology', 'Design'],
    content: `# The Psychology of User Interface Design

Great interfaces aren't just visually appealing—they understand how the human mind works.

## Cognitive Load Theory

Every element on your screen demands mental resources. The best designs minimize unnecessary cognitive load.

## Visual Hierarchy

How we guide the eye through information using size, color, and spacing to create natural reading patterns.

## The Power of Familiarity

Users bring expectations from other interfaces. Fighting these patterns creates friction; embracing them creates flow.`
  },
  {
    id: '5',
    title: 'Building a Real-Time Analytics Dashboard',
    excerpt: 'From concept to deployment: creating a dashboard that handles millions of data points with sub-second response times.',
    category: 'project',
    image: '/images/analytics-dashboard.jpg',
    publishedAt: '2025-06-01',
    readTime: 15,
    featured: false,
    slug: 'realtime-analytics-dashboard',
    tags: ['Analytics', 'Real-time', 'Performance'],
    content: `# Building a Real-Time Analytics Dashboard

When you need to process millions of data points in real-time, every architectural decision matters.

## The Requirements

- Handle 10M+ events per hour
- Sub-second response times
- Real-time visualizations
- Historical data analysis

## Our Stack

- **Frontend**: Next.js with real-time WebSocket connections
- **Backend**: Node.js with Redis for caching
- **Database**: TimescaleDB for time-series data
- **Visualization**: Custom D3.js components

## Lessons Learned

Performance optimization is about finding bottlenecks before they find you.`
  }
];

export const getArticlesByCategory = (category: Article['category']) => {
  return articles.filter(article => article.category === category);
};

export const getFeaturedArticles = () => {
  return articles.filter(article => article.featured);
};

export const getArticleBySlug = (slug: string) => {
  return articles.find(article => article.slug === slug);
};

export const getAllSlugs = () => {
  return articles.map(article => article.slug);
};
