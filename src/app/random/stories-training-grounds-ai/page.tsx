import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

export default function StoriesTrainingGroundsAIPage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/random" className={styles.backLink}>← Back to Random</Link>
          <span className={styles.articleCategory} data-category="random">Random</span>
        </div>

        <h1 className={styles.articleTitle}>The Stories We Produce Are Becoming Training Grounds for AI</h1>

        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>July 5, 2026</span>
            <span className={styles.readTime}>3 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="/images/agent_chiks.png"
            alt="The stories we produce are becoming training grounds for AI"
            width={800}
            height={400}
            className={styles.heroImage}
            priority
          />
          <p className={styles.imageCaption}>
            Someone has to build the worlds machines learn in — and keep them honest and human.
          </p>
        </div>
      </header>

      <article className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>Ever since I worked with <a href="https://www.manaboodle.com/casestudies/mangrove" target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>Mangrove Education</a>, a grassroots teacher-training effort in Indonesia, I've been quietly obsessed with collecting human stories. Its whole premise is disarmingly simple: <em>every teacher is a hero, and every hero has a story.</em> Gathering those stories was slow, noble work. It took us months just to record a handful of interviews — each one a real teacher, a real classroom, a real moment of deciding whether to keep going when the pay was thirty dollars a month and the lights shut off at five.</p>

          <p>At the time, that slowness felt like the price of doing honest work. Now I think it was the point.</p>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>The AI Industry Ran Out of Internet</h2>
          <div className={styles.sectionContent}>
            <p>Because of where technology is heading, those stories are worth more than we knew. The AI industry has, in a sense, run out of internet. To make agents that <em>act</em> — not chat, but do — companies need something the web can't give them: recordings of real people doing and deciding. Right now, firms are paying workers in India, Nigeria, and beyond to strap cameras to their heads and film themselves cooking, cleaning, working a factory line. &ldquo;There's no internet for robot data,&rdquo; as one roboticist put it — so they're building it, one chore at a time.</p>

            <p>Out of that scramble came two ideas I can't stop turning over: <em>reinforcement-learning environments</em> — safe places where an AI practices a task and gets scored — and <em>synthetic environments</em>, believable simulations that multiply the practice. The whole game is teaching machines judgment in situations that carry stakes.</p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>We Just Called It Storytelling</h2>
          <div className={styles.sectionContent}>
            <p>And that's when it landed on me, as a producer. The stories we build for television, animation, and film are already this. A good script is a world with stakes: characters who want something, choices that cost, consequences that follow. We have spent entire careers constructing believable human environments. We just called it storytelling.</p>

            <p>An environment, to be useful to AI, needs two qualities: it has to be <em>believable</em>, and it has to be <em>measurable</em>. Producers are masters of the first. The second — shaping a story so that a decision inside it can be scored, the way modern AI-agent testing tools do — is a craft we haven't learned yet. But we could. In fact, I've started building a small tool in exactly that direction: one that treats a story like an environment, where the branches, decisions, and outcomes are structured well enough to be tested, not only felt.</p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>A New, Responsible Job for Storytellers</h2>
          <div className={styles.sectionContent}>
            <p className={styles.importantNote}>
              I don't think any of this replaces storytelling. I think it's a new, responsible job for the people who tell stories.
            </p>

            <p>As machines learn to act in the world, someone has to build the worlds they learn in — and keep those worlds honest and human. That has always been our work. It just matters more than it did back when we were coaxing a few teachers in Indonesia to believe their stories were worth recording.</p>
          </div>
        </div>
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#AI</span>
          <span className={styles.tag}>#Storytelling</span>
          <span className={styles.tag}>#TrainingData</span>
          <span className={styles.tag}>#ReinforcementLearning</span>
          <span className={styles.tag}>#Producing</span>
          <span className={styles.tag}>#BuildInPublic</span>
        </div>

        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
