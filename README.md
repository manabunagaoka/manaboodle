# Manaboodle - Modern Blog & Content Platform

A Next.js-powered blog and content platform featuring curated articles across multiple categories with a focus on education, technology, and creative projects.

## 🚀 Features

### Current Features
- **Multi-Category Content**: Case Studies, Concepts, Projects, and Random thoughts
- **Responsive Design**: Mobile-first approach with category-specific styling and theming
- **SEO Optimized**: Dynamic metadata generation for all pages
- **Consistent Article Layout**: Unified design pattern across all categories
- **Email Preferences**: Subscriber preference management system
- **Legal Compliance**: Privacy Policy, Terms of Service, and Email Preferences pages
- **Simple Content Management**: Easy-to-maintain article structure

### Article System
- **Simplified Architecture**: Each article is a self-contained Next.js page
- **Category Theming**: Color-coded categories (Blue for Concepts, Orange for Case Studies, Green for Projects, Purple for Random)
- **Consistent Styling**: Shared article layout with category-specific accents
- **Reading Time**: Display estimated reading time for each article
- **Professional Attribution**: Support for academic citations and references

## 📁 Project Structure

```
manaboodle/
├── app/
│   ├── casestudies/
│   │   ├── article.module.css    # Orange theme styling
│   │   └── mangrove/
│   │       └── page.tsx          # Mangrove Education article
│   ├── concepts/
│   │   ├── article.module.css    # Blue theme styling
│   │   └── ai-nurturing/
│   │       └── page.tsx          # AI Nurturing article
│   ├── projects/
│   │   ├── article.module.css    # Green theme styling
│   │   └── [project-articles]/
│   ├── random/
│   │   ├── article.module.css    # Purple theme styling
│   │   └── [random-articles]/
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── preferences/              # Email preferences
│   └── api/
│       └── preferences/          # Preferences API
└── lib/
    ├── content.ts                # Article index and metadata
    └── utils.ts                  # Utility functions
```

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: CSS Modules with category theming
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Supabase account (for subscriber features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/manaboodle.git
cd manaboodle
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your site.

## 📝 Creating New Articles

### Quick Start
1. Create a new folder in the appropriate category directory
2. Add a `page.tsx` file with your article content
3. Update `lib/content.ts` with article metadata

### Example Article Structure
```typescript
// app/[category]/[article-name]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../article.module.css';

export const metadata: Metadata = {
  title: 'Your Article Title',
  description: 'Brief description for SEO',
};

export default function ArticlePage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/[category]" className={styles.backLink}>← Back to [Category]</Link>
          <span className={styles.articleCategory}>[Category]</span>
        </div>
        
        <h1 className={styles.articleTitle}>Your Article Title</h1>
        
        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Your Name</span>
            <span className={styles.publishDate}>July 20, 2025</span>
            <span className={styles.readTime}>X min read</span>
          </div>
        </div>
      </header>

      <article className={styles.articleContent}>
        {/* Your content here */}
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#YourTag</span>
        </div>
        
        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
```

### Updating Content Index
Add your article to `lib/content.ts`:
```typescript
{
  id: 'your-article-id',
  title: 'Your Article Title',
  excerpt: 'Brief description',
  category: 'concept', // or 'project', 'casestudy', 'random'
  publishedAt: '2025-07-20',
  readTime: 5, // in minutes
  featured: false,
  slug: 'your-article-url'
}
```

## 🎨 Styling Guide

Each category has its own theme color:
- **Concepts**: Blue (#2563EB)
- **Case Studies**: Orange (#EA580C)
- **Projects**: Green (#059669)
- **Random**: Purple (#7C3AED)

Articles use consistent layout with category-specific accents for:
- Links and navigation
- Category badges
- Section underlines
- Hover states

## 📊 Featured Articles

### Recent Additions
- **AI Nurturing and Surrogate Caregivers** (Concepts) - Exploring AI's role in caregiving through Ubuntu philosophy
- **Mangrove Education** (Case Studies) - Building resilient teacher communities in Indonesia

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for backend infrastructure
- All contributors and readers

## 📞 Contact

For inquiries, collaboration, or access to full case studies, please use the contact form on the website.

---

Built with ❤️ by Manabu Nagaoka