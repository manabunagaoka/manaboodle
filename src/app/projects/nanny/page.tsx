import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

export default function NannyPage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/projects" className={styles.backLink}>← Back to Projects</Link>
          <span className={styles.articleCategory}>Project</span>
        </div>
        
        <h1 className={styles.articleTitle}>Super Personalized Learning Model: Nannies vs AI</h1>
        
        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>July 15, 2025</span>
            <span className={styles.readTime}>6 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="/images/nanny.jpg"
            alt="Nanny training program in Cape Town, South Africa"
            width={800}
            height={400}
            className={styles.heroImage}
            priority
          />
          <p className={styles.imageCaption}>
            Empowering nannies with AI-powered tools in Cape Town, South Africa
          </p>
        </div>
      </header>

      <article className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>
            Fresh off my Harvard graduation, I tagged along with my partner-in-crime <a href="https://www.linkedin.com/in/jwinocur" target="_blank" rel="noopener noreferrer" className={styles.externalLink}>Jenna Winocur</a> to attend a "nanny" training run by the Indaba Institute in Cape Town, South Africa—an ideal sandbox for MVP-testing the platform I vibe-coded (more on <Link href="/random/vibe-coding">vibe coding here</Link>).
          </p>

          <p>
            From the classroom to the community, we're shoulder-to-shoulder with women who are already shaping young lives—and building brighter futures for the next generation. Under African skies, I'm grateful for the chance to learn, serve, and grow in a place as beautiful as it is complex.
          </p>

          <p>
            Together we ran our first MVP: a Montessori-rooted course for aspiring nannies, paired with a lightweight digital toolkit that helps them flourish. It was a resounding success.
          </p>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Why this matters</h2>
          <div className={styles.sectionContent}>
            <p>
              South Africa counts ≈ 1.1 million people employed in private households; about 854 000 (≈ 76 %) are domestic workers—largely Black African women.
            </p>

            <p>
              Domestic work represents ~ 6 % of the national workforce and contributes roughly 8 % of South Africa's GDP.
            </p>

            <p>
              Our program offers meaningful, accessible education and clear professional pathways for the very people shaping young lives every single day.
            </p>

            <p>
              By empowering nannies to become Early Childhood Development specialists, we're laying the groundwork for super-personalized learning—human-centered, culturally grounded, and scalable everywhere.
            </p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Nannies vs AI: a quick side-by-side</h2>
          <div className={styles.sectionContent}>
            <div className={styles.comparisonTable}>
              <table>
                <thead>
                  <tr>
                    <th>What Nannies Bring</th>
                    <th>What AI Brings</th>
                    <th>The Sweet Spot</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Empathy & cultural nuance—reading a child's mood in seconds.</td>
                    <td>Infinite patience & data recall—24/7 micro-assessments, personalized playlists, real-time feedback.</td>
                    <td>Nanny uses AI dashboards to adapt routines, spot gaps, and co-design learning adventures.</td>
                  </tr>
                  <tr>
                    <td>Hands-on modeling—tying shoes, drying tears, celebrating first words.</td>
                    <td>Scalable curriculum suggestions—aligned to Montessori, CAPS<sup>1</sup>, or any framework in milliseconds.</td>
                    <td>AI recommends activities; nanny chooses what resonates with the child's immediate interest.</td>
                  </tr>
                  <tr>
                    <td>Trust built with families over time.</td>
                    <td>Analytics—tracking progress objectively across thousands of learners.</td>
                    <td>Human + machine combine warmth and rigor, turning every home into a micro-learning lab.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Bottom line: AI alone can't hug a toddler, and a nanny shouldn't have to memorize every phoneme-sorting game ever published. Put them together and you get super-personalized learning—at kitchen-table scale and global reach.
            </p>

            <p>
              I'm beyond proud of <a href="https://www.linkedin.com/in/jwinocur" target="_blank" rel="noopener noreferrer" className={styles.externalLink}>Jenna's</a> vision and leadership—and honored to be her partner in crime on this bold journey. We're just getting started.
            </p>

            <div className={styles.importantNote}>
              <p>
                <sup>1</sup> CAPS (Curriculum and Assessment Policy Statement) is South Africa's national curriculum framework for Grades R–12. It specifies the exact subject content, skills, and assessment requirements every public-school teacher must follow.
              </p>
            </div>
          </div>
        </div>
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#AI</span>
          <span className={styles.tag}>#Education</span>
          <span className={styles.tag}>#Nannies</span>
          <span className={styles.tag}>#SouthAfrica</span>
          <span className={styles.tag}>#EarlyChildhood</span>
          <span className={styles.tag}>#PersonalizedLearning</span>
        </div>
        
        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}