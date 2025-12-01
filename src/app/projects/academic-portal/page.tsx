import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

export default function AcademicPortalPage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/projects" className={styles.backLink}>← Projects</Link>
          <span className={styles.articleCategory}>Project</span>
        </div>
        
        <h1 className={styles.articleTitle}>The Academic Portal: Tools Born from the Classroom, Built for Founders</h1>
        
        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>November 30, 2025</span>
            <span className={styles.readTime}>3 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="/images/academic_portal.jpg"
            alt="The Academic Portal - Tools for founders"
            width={800}
            height={400}
            className={styles.heroImage}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </div>
      </header>

      <main className={styles.articleContent}>
        <p>
          There's a particular kind of education that happens when theory meets decades of practice. The Academic Portal is what emerged when I stopped being just a student and started building what I wished had existed.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          After twenty-plus years navigating international business development, I arrived at Harvard thinking I knew my trade. I was wrong—or rather, I was incomplete. The coursework didn't just add to what I knew; it reorganized how I think.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <h2>From Inspiration to Application</h2>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          Professor Michael B. Horn, David Dockterman, and Dr. Angela Jackson at Harvard Graduate School of Education, didn't just teach frameworks. They opened my eyes to the gaps between what founders believe and what customers actually need. That insight became the foundation for everything I'm building.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          Take <strong>Clusters</strong>, for instance. Rooted in Clayton Christensen's Jobs-to-Be-Done theory from Harvard Business School, it does something deceptively simple: it finds the match—or mismatch—between a founder's hypothesis and the actual pain points customers describe. I've watched too many startups build solutions to problems that don't exist. Clusters is my attempt to short-circuit that expensive mistake.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          Then there's <strong>Runaway</strong>, a cost analyzer that forces founders to confront the financial trajectory of their decisions before those decisions become irreversible. It's not glamorous. It's necessary.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          The most recent addition is <strong>PPP—Purchasing Power Parity</strong>. This one came directly from Professor Reshmaan Hussam's "Globalization and Emerging Markets" course at Harvard Business School. She didn't just teach the mechanics of international expansion; she rewired my understanding of <em>why</em> we pursue global markets in the first place. PPP pulls live data that actually matters when you're thinking beyond borders—not vanity metrics, but the economic realities that determine whether your pricing will work in São Paulo or Singapore.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <h2>The Belonging Question</h2>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          I keep returning to my notes from "Learning Creative Learning," taught by Professor Mitchel Resnick at MIT Media Lab's Lifelong Kindergarten. His work on creative learning reminded me that belonging isn't something you find in external validation. It's an inner search.
        </p>
        
        <p className={styles.spacingParagraph}></p>
        
        <p>
          This hit differently for me. I used to fight the label—"domestic foreigner" (not an immigrant) in my adopted home. Now I've accepted it. It's simply who I am.
        </p>
        
        <p className={styles.spacingParagraph}></p>
        
        <p>
          That acceptance freed something. It gave me room to share rather than prove.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <h2>Learning by Teaching</h2>
        
        <p className={styles.spacingParagraph}></p>
        
        <p>
          I advise a dozen startups across Harvard and MIT, though "advise" feels like the wrong word. I'm learning from them. Every founder I work with teaches me something about resilience, about seeing problems I'd never encounter, about the particular courage it takes to build something from nothing.
        </p>
        
        <p className={styles.spacingParagraph}></p>
        
        <p>
          Their success is my success. Not in some abstract, mentorship-credential way. In the way that matters: watching someone figure it out, knowing you helped clear one small obstacle from their path.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <h2>Still Tinkering</h2>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          The Academic Portal remains invitation-only—open to Harvard students or by permission. This isn't gatekeeping; it's quality control. These tools are still in MVP testing. I'm iterating based on real usage from founders who are actually building companies, not hypothetical use cases.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          I learned my trade in the market. I refined my thinking in the classroom. Now I'm building the bridge between them.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          That's what the Academic Portal is: decades of pattern recognition, sharpened by world-class instruction, packaged into tools that might save a founder six months of painful learning.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          Or at least, that's the hypothesis. The founders I'm working with are helping me test it.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          <em>The Academic Portal is currently available to Harvard students and by permission. If you're building something and think these tools might help, reach out.</em>
        </p>
      </main>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#Entrepreneurship</span>
          <span className={styles.tag}>#StartupTools</span>
          <span className={styles.tag}>#LifelongLearning</span>
          <span className={styles.tag}>#HarvardBusinessSchool</span>
          <span className={styles.tag}>#JTBD</span>
          <span className={styles.tag}>#Globalization</span>
          <span className={styles.tag}>#EdTech</span>
          <span className={styles.tag}>#FounderLife</span>
          <span className={styles.tag}>#MIT</span>
          <span className={styles.tag}>#Innovation</span>
          <span className={styles.tag}>#Mentorship</span>
          <span className={styles.tag}>#BuildInPublic</span>
          <span className={styles.tag}>#StartupAdvice</span>
          <span className={styles.tag}>#BusinessDevelopment</span>
          <span className={styles.tag}>#LearningDesign</span>
        </div>
        
        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
