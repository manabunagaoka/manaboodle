// app/casestudies/my-first-english-word/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

// Article metadata for Next.js
export const metadata: Metadata = {
  title: 'My First English Word',
  description: 'A hammer, a chair and a nail taught me my first English word. Back at Harvard, I shared that journey from Japan to the US and the question that still follows it: who does learning technology reach?',
};

// Main article component
export default function MyFirstEnglishWordPage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/casestudies" className={styles.backLink}>← Back to Case Studies</Link>
          <span className={styles.articleCategory}>Case Study</span>
        </div>

        <h1 className={styles.articleTitle}>My First English Word</h1>

        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>September 19, 2026</span>
            <span className={styles.readTime}>3 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="/images/this.jpg"
            alt="The word This drawn in chalk as a hammer, a chair, a nail and a bent nail"
            width={800}
            height={450}
            className={styles.heroImage}
            priority
          />
          <p className={styles.imageCaption}>
            A hammer, a chair, a nail, and the nail bending under the blow
          </p>
        </div>
      </header>

      <article className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>
            Like millions of children around the world, I grew up watching Sesame Street. Many of them
            will tell you they learned English from it. I didn&apos;t, because I was frightened of the
            monsters. Television sets had legs back then, and the creatures inside them did not, and
            that bothered me more than I could explain.
          </p>
          <p>
            My first English word came from an afterschool class near my home. The teacher taught us to
            draw it. A hammer made the T, a chair made the h and a nail made the i. Then the nail bent
            under the hammer&apos;s blow and became the s. The word was &ldquo;This,&rdquo; and I have
            never forgotten how to draw it. That drawing taught me one word. It also made me want to
            learn the rest, and that wanting is what eventually brought me to America.
          </p>
          <p>
            Years later I joined Sesame Workshop, the non-profit behind Sesame Street, and became
            executive producer of Sesame Street English, a program teaching English to children across
            Asia. The monsters I had been afraid of became my colleagues.
          </p>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Back at Harvard</h2>
          <div className={styles.sectionContent}>
            <p>
              This semester I was back at the Harvard Graduate School of Education, this time at the front of
              the room. Professor{' '}
              <a href="https://www.gse.harvard.edu/directory/faculty/amin-marei" className={styles.inlineLink} target="_blank" rel="noopener noreferrer">Amin Marei</a>{' '}
              invited me into his course, Learning Design for All, to spend a session
              with the Class of 2027. I started at HGSE in the fall of 2023, when ChatGPT had only just
              entered the conversation. In those first weeks of the semester nobody was quite sure what any
              of it meant yet.
            </p>
            <p>
              I shared my path from Japan to the US with the students, starting with that word on the
              afterschool blackboard. I also talked about how my work in media and education kept running
              into what I was studying at Harvard. Three years later, much of that conversation has
              changed. The hard question is the same one we had in 2023: who the technology reaches, and
              who it quietly passes by.
            </p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Who the Technology Reaches</h2>
          <div className={styles.sectionContent}>
            <p>
              Roughly 1.5 billion people speak English or are learning it. The British Council&apos;s{' '}
              <em>Future of English</em> report found that demand for English still depends on teachers.
              It also found that technology can widen access while widening the gap between people who
              have it and people who don&apos;t.
            </p>
            <p>
              A mission statement can promise &ldquo;every child,&rdquo; but the money that pays for a
              program shapes which children it reaches. Public and philanthropic funders usually ask for
              equity and for evidence that children learned. Investors usually ask for growth, counted in
              paying students. Both kinds of funding are legitimate, and they pull a program in different
              directions.
            </p>
            <p>I left the students with three questions I still ask myself:</p>
            <ol>
              <li>If you were the producer, which children would you choose to serve?</li>
              <li>
                Given that choice, how would you fund the program and keep it running for fifteen years,
                long enough for those children to graduate?
              </li>
              <li>
                With today&apos;s technology, what would you use to reach those children at scale, and
                what would it help you prove about a child by graduation?
              </li>
            </ol>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>What a Learning System Can&apos;t See</h2>
          <div className={styles.sectionContent}>
            <p>
              Learning software reports what it was built to report, such as lessons completed, answers
              marked right or wrong and progress through a sequence. My afterschool teacher had none of
              that. If he had, his records would have shown one word learned. They would not have shown
              that I had started wanting something new, or that English would become the way I
              reached it. I think that second outcome is what education programs should be trying to
              prove, and I don&apos;t know of a system that measures it yet.
            </p>
            <p>
              If you work on these questions, or have answers of your own,{' '}
              <Link href="/contact" className={styles.inlineLink}>reach out</Link>.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB' }}>
          <p>
            <em>The views in this article are my own and do not represent Sesame Workshop.</em>
          </p>
        </div>
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#Education</span>
          <span className={styles.tag}>#English</span>
          <span className={styles.tag}>#EquityAndAccess</span>
          <span className={styles.tag}>#LearningDesign</span>
          <span className={styles.tag}>#HGSE</span>
          <span className={styles.tag}>#EdTech</span>
        </div>

        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
