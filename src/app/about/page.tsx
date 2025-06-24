import Link from 'next/link';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.aboutContent}>
        <header className={styles.aboutHeader}>
          <h1 className={styles.aboutTitle}>About</h1>
        </header>

        <article className={styles.aboutArticle}>
          <p className={styles.leadParagraph}>
            On a night flight home from Cape Town, somewhere over the Atlantic, I found myself reflecting on an incredible journey.
          </p>

          <p>
            As a first-generation graduate student, I had just finished at Harvard and decided to join my dear friend on an MVP testing adventure in South Africa—bringing along a tool I had frantically vibe-coded during those chaotic final days before graduation.
          </p>

          <p>
            Cape Town was everything I hoped it would be and more. We met wonderful people, shared ideas, and tested concepts in ways I never imagined. But as the plane lifted off and the city lights faded below, I realized I wanted to share these experiences and ideas with the world in a new way.
          </p>

          <p className={styles.highlightParagraph}>
            That's when I decided to vibe-code this magazine-style app.
          </p>

          <p>
            My name, Manabu, means "to learn" in Japanese. I wanted to tinker with that concept, blend it with the idea of doodling and exploring—hence <strong>Manaboodle</strong> was born. This is my space to chronicle concepts, projects, case studies, and even random thoughts as they come to me. A place where creation and reflection can coexist.
          </p>

          <p>
            You'll read about the Cape Town trip, the tools I've built, the ideas I'm exploring, and the people I've met along the way. Consider this an invitation to join me in celebrating lifelong learning, embracing the journey, and exploring endless possibilities.
          </p>

          <p className={styles.closingParagraph}>
            Welcome to Manaboodle.
          </p>
        </article>

        <div className={styles.aboutFooter}>
          <div className={styles.aboutActions}>
            <Link href="/" className={styles.backHome}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}