import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

export default function ForksPage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/apps" className={styles.backLink}>← Back to Apps</Link>
          <span className={styles.articleCategory}>App</span>
        </div>

        <h1 className={styles.articleTitle}>Forks</h1>

        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>October 31, 2026</span>
            <span className={styles.readTime}>3 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="/images/apps/forks.png"
            alt="Six crowds of people joined by lines, with two people choosing the same path through all of them"
            width={1100}
            height={550}
            className={styles.heroImage}
            priority
          />
          <p className={styles.imageCaption}>
            Two people in six crowds, choosing the same path without knowing it.
          </p>
        </div>
      </header>

      <article className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>You make decisions all day, about your career, about the people you care about, or about what to eat for lunch. Then one day, usually when you aren&apos;t expecting it, you meet someone or walk into something that changes your life. You can&apos;t plan for it, and you often don&apos;t know it&apos;s happening until much later.</p>

          <p>Forks takes a group of people through a few of those moments together, in a room or on a video call.</p>

          <div className={styles.placeholder}>
            <strong>Placeholder for Manabu:</strong> the moment or the room that made you want to build Forks, in your own words. One or two paragraphs.
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Six forks</h2>
          <div className={styles.sectionContent}>
            <p>A session has six forks. Each fork is a question with three choices. Every choice costs something, so none of them is the right answer, and none of them sorts you into a type of person. Should you finish the work that is already late, try something you have never done, or give the afternoon to someone who has been waiting for it?</p>

            <p>The choice you make draws a line to the next fork. Over six forks, the lines become your path.</p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Rhymes</h2>
          <div className={styles.sectionContent}>
            <p>At the end of the session you see who in the group made the same choices you did. Forks calls that a rhyme. A rhyme lasts as long as two people keep choosing alike, and it ends at the fork where their paths split. A perfect rhyme is the same choice at every fork, from the first to the last.</p>

            <p>A rhyme gives two strangers something to talk about that matters more than where they work. They faced the same choice, gave up the same thing, and can ask each other why.</p>

            <div className={styles.placeholder}>
              <strong>Placeholder for Manabu:</strong> what you have seen happen when people find their rhyme, if you have run a session. Leave this out if not.
            </div>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Who it is for</h2>
          <div className={styles.sectionContent}>
            <p>Forks is built for people who run group sessions, such as networking events, classes and workshops. An organizer signs in and registers their organization. Once it is approved, they can plan sessions and invite people.</p>
          </div>
        </div>

        <div className={styles.tryApp}>
          <p className={styles.tryAppText}>Forks is live. Organizers can sign up and plan a session.</p>
          <a href="https://forks.manaboodle.com" target="_blank" rel="noopener noreferrer" className={styles.tryAppButton}>
            Open Forks ↗
          </a>
        </div>
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#Forks</span>
          <span className={styles.tag}>#HumanConnection</span>
          <span className={styles.tag}>#Decisions</span>
          <span className={styles.tag}>#Networking</span>
          <span className={styles.tag}>#Workshops</span>
          <span className={styles.tag}>#Manaboodle</span>
        </div>

        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
