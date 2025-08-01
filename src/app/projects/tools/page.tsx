import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

export default function ToolsArticlePage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/projects" className={styles.backLink}>← Back to Projects</Link>
          <span className={styles.articleCategory}>Project</span>
        </div>
        
        <h1 className={styles.articleTitle}>Building Tools That Actually Matter</h1>
        
        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>August 1, 2025</span>
            <span className={styles.readTime}>4 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <div style={{
            width: '100%',
            height: '400px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            position: 'relative',
            border: '2px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '1.5rem',
              padding: '3rem',
              width: '100%',
              maxWidth: '700px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                width: '100%',
                justifyContent: 'center'
              }}>
                <Image
                  src="/animations/sassy-loop.gif"
                  alt="Sassy character animation"
                  width={150}
                  height={150}
                  unoptimized
                  priority
                />
                
                <h2 style={{
                  fontSize: '4rem',
                  fontWeight: '700',
                  color: '#000',
                  margin: '0'
                }}>Sassy</h2>
              </div>
              
              <p style={{
                fontSize: '1.25rem',
                color: '#666',
                lineHeight: '1.6',
                textAlign: 'left',
                margin: '0'
              }}>
                Write personal updates that feel like conversations, not newsletters. Turn boring announcements into engaging messages.
              </p>
            </div>
          </div>
          <p className={styles.imageCaption}>
            Anti-Newsletter Companion with Vibe Meter, making newsletter updates personal again
          </p>
        </div>
      </header>

      <article className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>Last October, I stood on a TEDx stage in my mother's birthplace, introducing Manaboodle as a "Time Machine" for knowledge. That was nine months ago. Today, Manaboodle has evolved into something different—and perhaps more honest—than I originally imagined.</p>

          <p>It started six months ago during my last semester at Harvard. Through multiple pivots, I realized Manaboodle needed to become a platform for gathering human experiences in all their messy, beautiful forms: napkin-sketch concepts, random journal entries, and yes, even single-purpose tools born from momentary inspiration. This week, as GitHub Spark and Google's Opal/AppCraft launched, taking vibe coding to a whole new level, I'm reminded of why I started building these tools in the first place.</p>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Enter the Tools Category</h2>
          <div className={styles.sectionContent}>
            <p>That's why I added Tools to Manaboodle's menu. It's where I share micro-apps—each one personal, purposeful, and slightly quirky. These aren't venture-backed products or growth-hacked platforms. They're tools I build because they need to exist.</p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Meet Sassy: The Anti-Newsletter Companion</h2>
          <div className={styles.sectionContent}>
            <p>My latest creation is Sassy, an AI-generated character with strong opinions about corporate speak. Here's the thing: I assumed no one read my articles or newsletters. And why would they? Our LinkedIn feeds overflow with announcements that begin with "pleased to announce" or "In this issue."</p>

            <p>I read my friends' newsletters—the ones written by actual humans. But those templated, robotic notifications? Never.</p>

            <p>Sassy exists to fix this. Write "pleased to announce" and watch Sassy's shocked face appear. Try starting with "In this issue" and see the reaction. Sassy is your writing companion who keeps you human, who ensures your words sound like they came from you, not a newsletter template.</p>

            <p style={{
              marginTop: '2rem',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              <Link href="https://www.manaboodle.com/tools/sassy" style={{
                color: '#059669',
                textDecoration: 'underline'
              }}>
                → Try Sassy right now
              </Link> or <Link href="https://www.manaboodle.com/tools" style={{
                color: '#059669',
                textDecoration: 'underline'
              }}>
                explore other tools
              </Link>
            </p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>What's Next</h2>
          <div className={styles.sectionContent}>
            <p>More tools are coming, each one deeply personal, each solving a problem I've actually faced. I'm building them for fun, for learning, for the pure joy of creation. But as I get better at this, pro versions are on the horizon—tools that might just blow your mind.</p>

            <p>So keep checking back. See what's being built. And if you have your own fun project ideas, send me a message—but make sure Sassy approves it first. Maybe we can collaborate and bring something new into this world together.</p>

            <p>After all, the best tools aren't built in boardrooms. They're built by people who care.</p>
          </div>
        </div>
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#Tools</span>
          <span className={styles.tag}>#VibeCoding</span>
          <span className={styles.tag}>#AI</span>
          <span className={styles.tag}>#Writing</span>
          <span className={styles.tag}>#Newsletter</span>
          <span className={styles.tag}>#HumanConnection</span>
        </div>
        
        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}