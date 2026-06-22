import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

export default function SouthAfricaToNewYorkPage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/random" className={styles.backLink}>← Back to Random</Link>
          <span className={styles.articleCategory} data-category="random">Random</span>
        </div>

        <h1 className={styles.articleTitle}>From South Africa to New York</h1>

        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>June 21, 2026</span>
            <span className={styles.readTime}>3 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="/images/south-africa-to-new-york.jpg"
            alt="From South Africa to New York - a year of building Manaboodle"
            width={800}
            height={400}
            className={styles.heroImage}
            priority
          />
          <p className={styles.imageCaption}>
            One year, one ocean, and a boat that—spoiler—never left the dock.
          </p>
        </div>
      </header>

      <article className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>Last year, I traveled with <a href="https://www.linkedin.com/in/jwinocur/" target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>Jenna Winocur</a> to Cape Town for an ECD training program for nannies. The nannies' stories stayed with me — what they carried, what they hoped for the children in their care. Helping us run the training was a friend of ours, a genuine world traveler who had crossed oceans by boat to get where she was in life. Between the two, I came home changed, and I started building Manaboodle: a place to record and share everything I make — projects, half-formed concepts, the occasional random thought.</p>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>A Year of Tinkering</h2>
          <div className={styles.sectionContent}>
            <p>Since then I've mostly learned by tinkering. Of everything I've built, I'm proudest of three: Clusters, a pattern-recognition tool built on the Jobs-to-be-Done framework; Atom Speaker, a kind of ChatGPT for people with vision impairment; and Hana &amp; Flower, a synchronicity engine that measures how much two people connect — or drift — over the course of a conversation.</p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>A New Crossing</h2>
          <div className={styles.sectionContent}>
            <p>To kick off the next year, I decided to give myself three weeks to do nothing but tinker. So I moved onto a boat.</p>

            <p className={styles.importantNote}>
              I should be honest: my boat sits in New York harbor and has never once left it. No oceans crossed. My world-traveler friend would not be impressed.
            </p>

            <p>But sitting still (or rocking constantly) on the water for three weeks turned out to be its own kind of journey — and a life-changing one at that.</p>

            <p>Cannot wait to share what I'm building.</p>
          </div>
        </div>
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#Manaboodle</span>
          <span className={styles.tag}>#OneYear</span>
          <span className={styles.tag}>#CapeTown</span>
          <span className={styles.tag}>#MITMediaLab</span>
          <span className={styles.tag}>#Tinkering</span>
          <span className={styles.tag}>#BuildInPublic</span>
        </div>

        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
