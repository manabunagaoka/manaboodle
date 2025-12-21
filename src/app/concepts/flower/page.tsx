// app/concepts/flower/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

// Article metadata for Next.js
export const metadata: Metadata = {
  title: 'Flower: Closing the Gap Between Humans',
  description: 'The future of AI isn\'t making machines more human. It\'s making humanness more accessible.',
};

// Main article component
export default function FlowerPage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/concepts" className={styles.backLink}>← Back to Concepts</Link>
          <span className={styles.articleCategory}>Concept</span>
        </div>
        
        <h1 className={styles.articleTitle}>Flower: Closing the Gap Between Humans</h1>
        
        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>December 21, 2025</span>
            <span className={styles.readTime}>2 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="/images/flower.jpg"
            alt="Flower - Closing the Gap Between Humans"
            width={800}
            height={400}
            className={styles.heroImage}
            priority
          />
          <p className={styles.imageCaption}>
            Flower represents a new vision: AI that closes the gap between humans, not between humans and machines.
          </p>
        </div>
      </header>

      <article className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>
            Two years at Harvard. Graduated in May, moved from Cambridge back to New York, and slowly adjusted to professional life again.
          </p>
        </div>

        <div className={styles.articleSection}>
          <div className={styles.sectionContent}>
            <p>
              What a ride it was — winning a few student competitions, working with colleagues who became lifelong friends, speaking at TEDx about synchronicity, building AI apps, making mistakes, pivoting more times than I can count. I loved being a student again. This fall, I found myself in reverse commute, back to Cambridge advising 30+ student startups. It still feels like it's going, and I'm loving it.
            </p>
            <p>
              Along the way, I kept writing about AI. This is the third and final piece of a trilogy.
            </p>
            <p>
              In Part 1, I wrote about <Link href="/concepts/ai-nurturing" className={styles.inlineLink}>"AI Sibling"</Link> — the idea that AI should amplify care, not replace it. I borrowed from ubuntu: "I am because we are."
            </p>
            <p>
              In Part 2, I built <Link href="/concepts/synthetic-intelligence-truth" className={styles.inlineLink}>"Hi,"</Link> my first synthetic companion, and discovered that language is the origin where human and machine meet.
            </p>
            <p>
              Now, Part 3. Flower.
            </p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>The Gap That Matters</h2>
          <div className={styles.sectionContent}>
            <p>
              Here's what I've come to believe: we've been asking the wrong question. Everyone asks how to bridge the gap between humans and machines. But the gap that matters is between humans and humans.
            </p>
            <p className={styles.importantNote}>
              <strong>Flower is not a tool to bridge machine and human. It closes the gap between humans.</strong>
            </p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Human Universals</h2>
          <div className={styles.sectionContent}>
            <p>
              The foundation is human universals — how we communicate, learn, feel, belong, play, seek meaning. Traits that are true across every culture, every era. These belong to all of us. They always have.
            </p>
            <p className={styles.importantNote}>
              <strong>The future of AI isn't making machines more human. It's making humanness more accessible.</strong>
            </p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Planting Seeds</h2>
          <div className={styles.sectionContent}>
            <p>
              I'm planting a seed. Let's see what grows.
            </p>
            <p>
              If this resonates, DM me.
            </p>
            <p>
              I am because we are.
            </p>
            <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>
              — Manabu, December 2025
            </p>
          </div>
        </div>
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#AI</span>
          <span className={styles.tag}>#HumanConnection</span>
          <span className={styles.tag}>#Ubuntu</span>
          <span className={styles.tag}>#HumanUniversals</span>
          <span className={styles.tag}>#Flower</span>
        </div>
        
        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
