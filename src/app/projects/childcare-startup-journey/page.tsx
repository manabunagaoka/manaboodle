import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

export default function ChildcareStartupJourneyPage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/projects" className={styles.backLink}>← Projects</Link>
          <span className={styles.articleCategory}>Project</span>
        </div>
        
        <h1 className={styles.articleTitle}>A Childcare Startup?! What Am I Thinking?</h1>
        
        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Jenna Winocur</span>
            <span className={styles.publishDate}>September 7, 2025</span>
            <span className={styles.readTime}>2 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="/images/jenna.jpeg"
            alt="Childcare startup journey - talking to parents in the playground"
            width={800}
            height={400}
            className={styles.heroImage}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </div>
      </header>

      <main className={styles.articleContent}>
        <p>A childcare startup?! What am I thinking?</p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          The early education sector is notoriously hard: fragmented, underfunded, and full of informal, "good enough" solutions that make any innovation an uphill battle. Yet it's also one of the most impactful sectors in our economy and society.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          Whether brave or foolish, I'm hitting the pavement (or playground), and asking parents for their perspectives on a problem space that most tech innovators won't touch with a 10 foot pole. (Shoutout to their kiddos for beautifying my poster!)
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>There are three truths I've learned working in the startup space:</p>
        
        <p className={styles.spacingParagraph}></p>

        <p><strong>1️⃣ Product-Market-Fit is everything.</strong></p>
        <p><strong>2️⃣ The biggest opportunities often hide where the status quo feels impossible to change.</strong></p>
        <p><strong>3️⃣ If you want to solve the world's greatest challenges, start with empathy.</strong></p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          Six months ago, I began researching in-home early childhood development through Harvard Graduate School of Education, Massachusetts Institute of Technology and a team of collaborators across the globe. I learned just how much this industry is overlooked and undervalued despite its universal importance.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          A few facts: US families spend up to 22% of their income on childcare. The first six years shape 90% of brain development. Early childhood interventions have some of the greatest impact in reducing lifelong inequities. Yet access is inconsistent, wages are at near poverty levels, and the 94% women-powered workforce bears the brunt, along with working moms.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          There's even a podcast on this very topic with the painfully fitting title: <em>No One is Coming to Save Us</em> by Lemonada Media.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>So, I made a sign:</p>
        
        <p className={styles.spacingParagraph}></p>

        <blockquote>
          "Parents, come talk to me about your experience with childcare."
        </blockquote>

        <div className={styles.imageContainer}>
          <Image
            src="/images/sign.jpg"
            alt="The sign asking parents to talk about their childcare experience"
            width={600}
            height={400}
            className={styles.contentImage}
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          This past week, I've been in parks and playgrounds, and my team is interviewing parents across Latin America, Africa, Asia, and the US. The stories differ, but the heart is the same: every parent wants to give their child the best start in life.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <p>
          We started by speaking to nannies and agencies, but parents are where we believe the greatest opportunity lies. You may not want to underestimate us. The need is urgent, now is the time, and we're the right team to execute on it.
        </p>
        
        <p className={styles.spacingParagraph}></p>

        <div className={styles.callToAction}>
          <p><strong>Parents of children 0–6</strong> → Talk to me about your experience with childcare and education in the home!</p>
          <p><strong>Tackled a tough problem in an "unattractive" industry?</strong> → How did you start?</p>
          <p><strong>Working on childcare systems change?</strong> → Let's connect! A rising tide lifts all boats.</p>
        </div>

        <div className={styles.hashtags}>
          <span className={styles.hashtag}>#BuildInPublic</span>
          <span className={styles.hashtag}>#Childcare</span>
          <span className={styles.hashtag}>#FutureOfChildcare</span>
          <span className={styles.hashtag}>#ECD</span>
          <span className={styles.hashtag}>#EducationEquity</span>
          <span className={styles.hashtag}>#FromThePlayground</span>
          <span className={styles.hashtag}>#StartWithEmpathy</span>
          <span className={styles.hashtag}>#SocialInnovation</span>
          <span className={styles.hashtag}>#EdTech</span>
          <span className={styles.hashtag}>#FounderJourney</span>
          <span className={styles.hashtag}>#HumanCenteredDesign</span>
        </div>
      </main>

      <footer className={styles.articleFooter}>
        <div className={styles.authorBio}>
          <h3>About the Author</h3>
          <p>
            <strong>Jenna Winocur</strong> is researching in-home early childhood development through Harvard Graduate School of Education and Massachusetts Institute of Technology, working with collaborators across the globe to solve challenges in the childcare sector.
          </p>
        </div>
        
        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
