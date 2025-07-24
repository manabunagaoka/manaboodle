# Manaboodle - Modern Blog & Content Platform

A Next.js-powered blog and content platform featuring curated articles across multiple categories with a focus on education, technology, and creative projects.

## 🚀 Live Site

Visit: [www.manaboodle.com](https://www.manaboodle.com)

## ✅ Current Status

### Working Features
- **Multi-Category Content**: Case Studies, Concepts, Projects, and Random thoughts
- **Tools Section**: Interactive tools with Read Time Calculator (live)
- **Responsive Design**: Mobile-first approach with category-specific styling and theming
- **SEO Optimized**: Dynamic metadata generation for all pages
- **Article System**: Simple, maintainable structure with consistent layouts
- **Legal Pages**: Privacy Policy and Terms of Service with proper navigation
- **Email System**: Professional email infrastructure with SendGrid
  - Contact form with auto-reply functionality
  - Newsletter subscription with welcome emails
  - Unsubscribe functionality
- **Category Theming**: 
  - Blue (Concepts)
  - Orange (Case Studies)
  - Green (Projects)
  - Purple (Random)
  - Teal (Tools)
  - Black (About/Legal)

### Recent Updates
- **Email System Migration** (July 2025)
  - Migrated from AWS SES to SendGrid for reliable email delivery
  - Professional sender addresses: hello@, subscription@, noreply@manaboodle.com
  - Domain authentication in progress for improved deliverability
- **Tools Section Added** (July 2025)
  - Read Time Calculator - Calculate reading time for any text
  - Upcoming: Jobs-To-Be-Done Interview, Emerging Markets Analyzer, Executive Prioritizer
  - Free/Pro tier structure in place
- **Navigation Updates**: Tools added to header and footer
- **Legal Pages Fixed**: Added back navigation and mobile-friendly padding

### Recent Articles
- **AI Nurturing and Surrogate Caregivers** (Concepts) - Exploring AI's role in caregiving through Ubuntu philosophy
- **Mangrove Education** (Case Studies) - Building resilient teacher communities in Indonesia
- **karaokeGoGo** (Projects) - Music-sharing platform for children
- **Nanny Project** (Projects) - AI-powered tools for personalized learning
- **Vibe Coding** (Random) - Music and programming productivity

### In Development
- **Email Preferences Page**: UI complete at `/preferences`, functionality pending
- **Article Notification System**: Notify subscribers of new content
- **Additional Tools**: Business strategy and research tools planned
- **Community Features**: Future plans for interactive elements

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
│   ├── api/
│   │   ├── contact/              # Contact form API (SendGrid)
│   │   ├── subscribe/            # Newsletter API (SendGrid)
│   │   └── preferences/          # Preferences API
│   └── tools/
│       └── read-time-calculator/ # Reading time tool
└── lib/
    ├── content.ts                # Article index and metadata
    └── utils.ts                  # Utility functions
```

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Email Service**: SendGrid
- **Styling**: CSS Modules with category theming
- **Deployment**: Vercel
- **Domain**: Custom domain (www.manaboodle.com)

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Supabase account
- SendGrid account (for email features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/manaboodle.git
cd manaboodle
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or https://manaboodle.com in production
```

4. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your site.

## 📧 Email Configuration

The platform uses SendGrid for all email communications:

### Sender Addresses
- `hello@manaboodle.com` - Contact form and direct communication
- `subscription@manaboodle.com` - Newsletter and welcome emails
- `noreply@manaboodle.com` - System notifications (future)

### Features
- **Contact Form**: Auto-reply to visitors, notification to admin
- **Newsletter**: Welcome emails, unsubscribe functionality
- **Domain Authentication**: DKIM, SPF, and DMARC configured for deliverability

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
- **Tools**: Teal (#14B8A6)

Articles use consistent layout with category-specific accents for:
- Links and navigation
- Category badges
- Section underlines
- Hover states

## 🔮 Future Roadmap

### Phase 1 (Current)
- ✅ Core blog functionality
- ✅ Email system with SendGrid
- ✅ Newsletter subscriptions
- 🔄 Email preferences management

### Phase 2 (Upcoming)
- Article notification system
- RSS feed
- Search functionality
- More interactive tools

### Phase 3 (Future)
- Community features
- User accounts
- Article comments/discussions
- Collaborative tools

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
- SendGrid for reliable email delivery
- All contributors and readers

## 📞 Contact

For inquiries, collaboration, or feedback, please use the contact form on the website or email hello@manaboodle.com.

---

Built with ❤️ by Manabu Nagaoka