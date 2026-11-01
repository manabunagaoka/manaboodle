import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

export default function ProsodyPage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/apps" className={styles.backLink}>← Back to Apps</Link>
          <span className={styles.articleCategory}>App</span>
        </div>

        <h1 className={styles.articleTitle}>Prosody</h1>

        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>October 31, 2026</span>
            <span className={styles.readTime}>2 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="/images/apps/prosody.jpg"
            alt="A small flower with rainbow petals growing from a crack in an old stone wall"
            width={1120}
            height={560}
            className={styles.heroImage}
            priority
          />
          <p className={styles.imageCaption}>
            Everything in a voice except the words.
          </p>
        </div>
      </header>

      <article className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>Prosody asks you about someone, or something, that changed your life, and you answer out loud. What comes back is a ring of petals and a short piece of music. Both are made only from how you sounded, so nobody who hears your song can hear what you said.</p>

          <div className={styles.placeholder}>
            <strong>Placeholder for Manabu:</strong> why a voice, and why the words are left out. One or two paragraphs in your own words.
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>What it listens to</h2>
          <div className={styles.sectionContent}>
            <p>Prosody measures the parts of speech that carry feeling: where your voice sits, how far it moves, how fast you speak, and how loud. It also measures the pauses between your phrases.</p>

            <p>The Japanese word 間 (ma) means the space between. Prosody measures the silences as carefully as the speech, because a pause before a name can say as much as the name.</p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>What it keeps</h2>
          <div className={styles.sectionContent}>
            <p>Your recording is measured in memory and then dropped. It is never saved. If you choose to leave your song in the gallery, only the measurements behind the song and the name you give it are stored.</p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Still being tested</h2>
          <div className={styles.sectionContent}>
            <p>Prosody is open to try while I keep working on it. Some of the voice measurements are still being checked, and the gallery may be cleared during testing. You need a microphone and about a minute, and it works in a phone browser.</p>
          </div>
        </div>

        <div className={styles.tryApp}>
          <p className={styles.tryAppText}>Prosody is in testing. Try it and tell me what you hear.</p>
          <a href="https://prosody-8xnp.onrender.com" target="_blank" rel="noopener noreferrer" className={styles.tryAppButton}>
            Try Prosody ↗
          </a>
        </div>
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#Prosody</span>
          <span className={styles.tag}>#Voice</span>
          <span className={styles.tag}>#Music</span>
          <span className={styles.tag}>#Ma</span>
          <span className={styles.tag}>#Storytelling</span>
          <span className={styles.tag}>#Manaboodle</span>
        </div>

        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
