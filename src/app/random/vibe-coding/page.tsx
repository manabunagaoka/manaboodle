import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

export default function VibeCodingPage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/random" className={styles.backLink}>← Back to Random</Link>
          <span className={styles.articleCategory} data-category="random">Random</span>
        </div>
        
        <h1 className={styles.articleTitle}>Vibe Coding</h1>
        
        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>July 20, 2025</span>
            <span className={styles.readTime}>7 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="/images/vibe.jpg"
            alt="Vibe Coding - The intersection of music, mood, and programming"
            width={800}
            height={400}
            className={styles.heroImage}
            priority
          />
          <p className={styles.imageCaption}>
            Where creativity meets code: exploring the flow state of AI-assisted programming
          </p>
        </div>
      </header>

      <article className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>It is definitely a thing. I knew basic HTML, CSS, and JavaScript, but vibe coding took me to a whole new level. I agree with Andrew Ng: "In reality, coding with AI is a deeply intellectual exercise." It does require a different kind of knowledge and skills, as well as solid fundamental coding, while it helps you learn as you go and gets things done so fast.</p>

          <p>It gets stuck all the time, and the constant debugging and rewriting process is no different from hard-coding without all these tools. But there's something magical about the flow—the rhythm between human intuition and artificial intelligence that creates something greater than the sum of its parts.</p>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>The Harvard Experiment</h2>
          <div className={styles.sectionContent}>
            <p>When I began Harvard in 2023, ChatGPT was in its infant stage, and most of us were using it for homework. Some were experimenting with building their own GPT with it. In 2024, everyone had a chatbot—or at least was experimenting with vibe coding—before the term became popular.</p>

            <p>The academic environment became a laboratory for this new way of thinking about code. We weren't just learning algorithms and data structures; we were learning how to dance with AI, how to guide it, how to know when to trust it and when to override it.</p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>The Creative Flow</h2>
          <div className={styles.sectionContent}>
            <p>As of this writing, I've vibe-coded at least a dozen tools. Some more are in development and may never go live, but I don't care. Just go with the flow. It's fun and exciting. If many of us keep moving at this pace, some amazing stuff will come out purely vibe-coded and start making an impact.</p>

            <p>There's something liberating about this approach. Traditional coding often felt like building with LEGO blocks—precise, methodical, predictable. Vibe coding feels more like sculpting clay—intuitive, organic, responsive to the moment and the mood.</p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>From Cape Town to AI Companions</h2>
          <div className={styles.sectionContent}>
            <p>As I was involved in "nanny training" in Cape Town, South Africa—post-graduate from Harvard, doing manual labor—I was constructing the training program in my head as an extension of the <Link href="/concepts/ai-nurturing" className={styles.inlineLink}>AI Nurturing Framework</Link> I am working on.</p>

            <p>Strange as it may sound, there will be a day when domestic workers, including nannies, become the core of personalized education for all children; AI siblings will emerge alongside them, become essential companions for educating caregivers, and live with them.</p>

            <p className={styles.importantNote}>
              <strong>The Future Connection:</strong> Vibe Coding will be part of that training program for sure. The intuitive, flow-state approach to human-AI collaboration isn't just about building software—it's about building relationships, understanding, and new forms of intelligence.
            </p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>The Intellectual Exercise</h2>
          <div className={styles.sectionContent}>
            <p>Andrew Ng's insight rings true: coding with AI is indeed a deeply intellectual exercise. It's not about replacing human intelligence but amplifying it. It's about learning to think in harmony with artificial intelligence, to understand its strengths and compensate for its weaknesses.</p>

            <p>The debugging and rewriting process might be familiar, but the speed of iteration, the breadth of possibilities, and the creative leaps that become possible—that's what makes vibe coding transformative. It's not just about getting things done faster; it's about imagining and building things that might never have been possible before.</p>
          </div>
        </div>
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#VibeCoding</span>
          <span className={styles.tag}>#ArtificialIntelligence</span>
          <span className={styles.tag}>#Programming</span>
          <span className={styles.tag}>#Creativity</span>
          <span className={styles.tag}>#FlowState</span>
          <span className={styles.tag}>#Harvard</span>
          <span className={styles.tag}>#Innovation</span>
        </div>
        
        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}