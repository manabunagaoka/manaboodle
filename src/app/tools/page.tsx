// app/tools/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './tools.module.css';

interface Tool {
  id: string;
  title: string;
  description: string;
  status: 'free' | 'pro';
  category: string;
  available: boolean;
  image?: string; // Add optional image property
  imageAlt?: string;
}

const tools: Tool[] = [
  {
    id: 'sassy',
    title: 'Sassy',
    description: 'Write personal updates that feel like conversations, not newsletters. Turn boring announcements into engaging messages.',
    status: 'free',
    category: 'Communication',
    available: true,
    image: '/animations/sassy-loop.gif',
    imageAlt: 'Sassy character animation'
  },
  {
    id: 'read-time',
    title: 'Read Time Calculator',
    description: 'Calculate the estimated reading time for any text. Perfect for bloggers, writers, and content creators.',
    status: 'free',
    category: 'Writing',
    available: true
  },
  {
    id: 'jobs-to-be-done',
    title: 'Jobs-To-Be-Done Interview',
    description: 'Structured interview framework to uncover customer needs and motivations for better product development.',
    status: 'pro',
    category: 'Research',
    available: false
  },
  {
    id: 'emerging-markets',
    title: 'Emerging Markets Opportunity Analyzer',
    description: 'Analyze and evaluate market opportunities in developing economies with data-driven insights.',
    status: 'pro',
    category: 'Strategy',
    available: false
  },
  {
    id: 'executive-prioritizer',
    title: 'Prioritizer for Executives',
    description: 'Strategic prioritization tool for executives to align initiatives with business objectives and resources.',
    status: 'pro',
    category: 'Strategy',
    available: false
  }
];

export const metadata = {
  title: 'Tools - Manaboodle',
  description: 'Free tools for writers, creators, and developers. Calculate reading time, count words, and more.',
};

export default function ToolsPage() {
  const availableTools = tools.filter(tool => tool.available);
  const comingSoonTools = tools.filter(tool => !tool.available);

  return (
    <div className={styles.toolsPage}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Tools</h1>
        <p className={styles.pageDescription}>
          Practical tools that transform concepts, projects, and insights into actionable solutions. 
          Each tool is designed to help you implement the ideas and methodologies discussed throughout Manaboodle.
        </p>
      </header>

      {availableTools.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#111827' }}>
            Available Now
          </h2>
          <div className={styles.toolsGrid}>
            {availableTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`} className={styles.toolCard}>
                {tool.image ? (
                  <div className={styles.toolHeaderWithImage}>
                    <Image 
                      src={tool.image}
                      alt={tool.imageAlt || `${tool.title} preview`}
                      width={80}
                      height={80}
                      unoptimized // Important for GIFs
                      className={styles.toolImage}
                    />
                    <h3 className={styles.toolTitle}>{tool.title}</h3>
                  </div>
                ) : (
                  <h3 className={styles.toolTitle}>{tool.title}</h3>
                )}
                <p className={styles.toolDescription}>{tool.description}</p>
                <div className={styles.toolMeta}>
                  <span className={styles.toolStatus}>
                    <span className={`${styles.statusBadge} ${styles[tool.status]}`}>
                      {tool.status}
                    </span>
                  </span>
                  <span className={styles.toolCategory}>{tool.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {comingSoonTools.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.5rem', marginTop: '3rem', marginBottom: '1.5rem', color: '#6B7280' }}>
            Coming Soon
          </h2>
          <div className={styles.toolsGrid} style={{ opacity: 0.6 }}>
            {comingSoonTools.map((tool) => (
              <div key={tool.id} className={styles.toolCard} style={{ cursor: 'not-allowed' }}>
                <h3 className={styles.toolTitle}>{tool.title}</h3>
                <p className={styles.toolDescription}>{tool.description}</p>
                <div className={styles.toolMeta}>
                  <span className={styles.toolStatus}>
                    <span className={`${styles.statusBadge} ${styles[tool.status]}`}>
                      {tool.status}
                    </span>
                  </span>
                  <span className={styles.toolCategory}>{tool.category}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <footer className={styles.toolFooter}>
        <Link href="/" className={styles.backHome}>← Back to Home</Link>
      </footer>
    </div>
  );
}