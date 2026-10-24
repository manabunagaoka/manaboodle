import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

export default function SlurpingManaboodlePage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/random" className={styles.backLink}>← Back to Random</Link>
          <span className={styles.articleCategory} data-category="random">Random</span>
        </div>

        <h1 className={styles.articleTitle}>Slurping Manaboodle</h1>

        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>October 24, 2026</span>
            <span className={styles.readTime}>2 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="/images/slurping-manaboodle.jpg"
            alt="Mana, a pink fuzzy character, slurping ramen with chopsticks at a wooden counter in a Tokyo noodle shop"
            width={1600}
            height={900}
            className={styles.heroImage}
            priority
          />
          <p className={styles.imageCaption}>
            Meet Mana. Favorite food: noodles.
          </p>
        </div>
      </header>

      <article className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>I remember the nights I spent slurping noodles in Owada Yokocho, Tokyo. This was before the AI era, and I was designing an adaptive learning model, a way for a learning platform to adjust to each learner. I mapped out the steps in Moodle, the free, open-source learning management system that many schools use.</p>

          <p>I lived in a high-rise hotel nearby. At night I would look down over the lights of Tokyo, and when I got stuck, the ramen shops were a few blocks away. There was no chatbot to talk to and no tool to help me build the thing. To me, an algorithm was no different from a bowl of ramen. The noodles stay the same, and what changes is the ingredients and the broth.</p>

          <p>Years later, I&apos;m at a different stage of life, and I still think about adaptive learning the same way. I don&apos;t think anyone has cracked it yet.</p>

          <p>Khan Academy gave its platform a face with Khanmigo, and Duolingo did the same with Duo. Watching them, I started doodling ideas for a face for Manaboodle. Doodling, Moodle and slurping noodles all went into the name, and the face that came out of it is Mana.</p>

          <p>Mana&apos;s job is to doodle and explore alongside me while I keep working on adaptive learning. Apart from the favorite food, which is noodles, I don&apos;t know much else about Mana yet. Come back to see how Mana grows while learning adaptive learning.</p>
        </div>
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#Manaboodle</span>
          <span className={styles.tag}>#Mana</span>
          <span className={styles.tag}>#AdaptiveLearning</span>
          <span className={styles.tag}>#Moodle</span>
          <span className={styles.tag}>#Ramen</span>
          <span className={styles.tag}>#Tokyo</span>
        </div>

        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
