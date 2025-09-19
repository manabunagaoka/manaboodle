// app/tools/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './tools.module.css';

interface Tool {
  id: string;
  title: string;
  description: string;
  status: 'free' | 'pro' | 'coming-soon';
  category: string;
  available: boolean;
  image?: string;
  imageAlt?: string;
  isNew?: boolean;
  external?: boolean; // Set to true for external tools (hosted elsewhere)
  externalUrl?: string; // URL for external tools - will open in new tab
}

/*
 * NAVIGATION PATTERN FOR TOOLS:
 * 
 * Internal Tools (hosted on this site):
 * - Tool pages have: "← Back to Tools" (top) and "← Back to Home" (footer)
 * - Links go to `/tools/${tool.id}`
 * 
 * External Tools (hosted elsewhere):
 * - Set external: true and provide externalUrl
 * - Links open in new tab with external indicators (↗ icon and "External" label)
 * - Users can use browser back button to return to tools page
 * 
 * Main Tools Page:
 * - Has "← Back to Home" link at top
 * - All tools are listed with consistent styling
 */

const tools: Tool[] = [
  // Free Tools (Always Available)
  {
    id: 'runway',
    title: 'Runway',
    description: 'Calculate startup runway with budget planning, team costs, and AI-powered financial assistance.',
    status: 'free',
    category: 'Entrepreneurship',
    available: true,
    isNew: true
  },
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
  // Fun Pattern Recognition Tools (Coming Soon - Will be Free)
  {
    id: 'resume-analyzer',
    title: 'Resume Cluster Analyzer',
    description: 'Find your career tribe! Discover what type of professional you are and see others with similar backgrounds and skills.',
    status: 'coming-soon',
    category: 'Career Insights',
    available: false,
    isNew: true
  },
  {
    id: 'dating-optimizer',
    title: 'Dating Profile Optimizer',
    description: 'See what type you attract! Analyze your dating profile to understand your appeal and find your compatibility cluster.',
    status: 'coming-soon',
    category: 'Personal Insights',
    available: false,
    isNew: true
  },
  {
    id: 'synchronicity-tracker',
    title: 'Synchronicity Pattern Tracker',
    description: 'Track meaningful coincidences in your life. Discover recurring patterns and timing in your personal synchronicities.',
    status: 'coming-soon',
    category: 'Life Patterns',
    available: false,
    isNew: true
  },
  {
    id: 'content-theme-finder',
    title: 'Content Theme Finder',
    description: 'Discover your writing patterns! Analyze your content to understand your unique voice and recurring themes.',
    status: 'coming-soon',
    category: 'Writing',
    available: false,
    isNew: true
  },
  // Pro Tools (Future) - Original tools from your list
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
  },
  {
    id: 'synchronicity-engine-api',
    title: 'Synchronicity Engine API',
    description: 'Developer access to our pattern recognition engine. Build your own apps with our clustering and synchronicity detection algorithms.',
    status: 'pro',
    category: 'Developer Tools',
    available: false
  }
];

export const metadata = {
  title: 'Tools - Manaboodle',
  description: 'Free tools for writers, creators, and developers. Pattern recognition powered by the Synchronicity Engine.',
};

export default function ToolsPage() {
  const availableTools = tools.filter(tool => tool.available);
  const comingSoonTools = tools.filter(tool => !tool.available && tool.status === 'coming-soon');
  const proTools = tools.filter(tool => tool.status === 'pro');

  return (
    <div className={styles.toolsPage}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Tools</h1>
        <p className={styles.pageDescription}>
          Practical tools that transform concepts, projects, and insights into actionable solutions. 
          From writing helpers to our new <strong>Synchronicity Engine</strong> - AI pattern recognition system for discovering meaningful connections in data and experiences.
        </p>
      </header>

      {/* Available Tools Section */}
      {availableTools.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#111827' }}>
            Available Now
          </h2>
          <div className={styles.toolsGrid}>
            {availableTools.map((tool) => {
              if (tool.external) {
                return (
                  <a 
                    key={tool.id} 
                    href={tool.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.toolCard}
                  >
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
                        <h3 className={styles.toolTitle}>
                          {tool.title}
                          <span className={styles.externalIcon}>↗</span>
                        </h3>
                      </div>
                    ) : (
                      <h3 className={styles.toolTitle}>
                        {tool.title}
                        <span className={styles.externalIcon}>↗</span>
                      </h3>
                    )}
                    <p className={styles.toolDescription}>{tool.description}</p>
                    <div className={styles.toolMeta}>
                      <span className={styles.toolStatus}>
                        <span className={`${styles.statusBadge} ${styles[tool.status]}`}>
                          {tool.status}
                        </span>
                        {tool.isNew && <span className={styles.newBadge}>NEW!</span>}
                      </span>
                      <span className={styles.toolCategory}>{tool.category}</span>
                      <span className={styles.externalLabel}>External</span>
                    </div>
                  </a>
                );
              }

              return (
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
                      {tool.isNew && <span className={styles.newBadge}>NEW!</span>}
                    </span>
                    <span className={styles.toolCategory}>{tool.category}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Synchronicity Engine Powered Tools Section */}
      {comingSoonTools.length > 0 && (
        <>
          <div className={styles.engineSection}>
            <h2 className={styles.engineTitle}>
              Synchronicity Engine Powered Tools
              <span className={styles.newBadge}>NEW!</span>
            </h2>
            <p className={styles.engineDescription}>
              Our AI pattern recognition system that finds meaningful connections in data. 
              These fun tools will help you discover patterns in your career, relationships, and life experiences. 
              <strong> Coming very soon!</strong>
            </p>
          </div>
          
          <div className={styles.toolsGrid} style={{ opacity: 0.8 }}>
            {comingSoonTools.map((tool) => (
              <div key={tool.id} className={`${styles.toolCard} ${styles.comingSoonCard}`}>
                <div className={styles.toolHeader}>
                  <h3 className={styles.toolTitle}>
                    {tool.title}
                    {tool.isNew && <span className={styles.newIndicator}>NEW</span>}
                  </h3>
                  <div className={styles.comingSoonOverlay}>
                    <span className={styles.comingSoonText}>Coming Soon</span>
                  </div>
                </div>
                <p className={styles.toolDescription}>{tool.description}</p>
                <div className={styles.toolMeta}>
                  <span className={styles.toolStatus}>
                    <span className={`${styles.statusBadge} ${styles.comingSoon}`}>
                      Free Soon
                    </span>
                  </span>
                  <span className={styles.toolCategory}>{tool.category}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pro Tools Section */}
      {proTools.length > 0 && (
        <>
          <div className={styles.proSection}>
            <h2 className={styles.proTitle}>
              Professional Tools
            </h2>
            <p className={styles.proDescription}>
              Advanced business and research tools for teams and enterprises. 
              <em>Available when we launch our member program.</em>
            </p>
          </div>
          
          <div className={styles.toolsGrid} style={{ opacity: 0.6 }}>
            {proTools.map((tool) => (
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

      {/* Call to Action */}
      <div className={styles.ctaSection}>
        <h3 className={styles.ctaTitle}>Want to be notified when new tools launch?</h3>
        <p className={styles.ctaDescription}>
          Subscribe to get early access to new pattern recognition tools and insights.
        </p>
        <Link href="https://www.manaboodle.com/subscribe" className={styles.ctaButton}>
          Subscribe
        </Link>
      </div>

      <footer className={styles.toolFooter}>
        <Link href="/" className={styles.backHome}>← Back to Home</Link>
      </footer>
    </div>
  );
}