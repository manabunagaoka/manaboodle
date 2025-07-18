import Link from 'next/link';
import Image from 'next/image';
import styles from '../article.module.css';

export default function KaraokeGoGoPage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/projects" className={styles.backLink}>← Back to Projects</Link>
          <span className={styles.articleCategory}>Project</span>
        </div>
        
        <h1 className={styles.articleTitle}>karaokeGoGo</h1>
        
        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>July 20, 2025</span>
            <span className={styles.readTime}>8 min read</span>
          </div>
        </div>

        <div className={styles.articleImage}>
          <Image
            src="/images/karaokegogo.jpg"
            alt="karaokeGoGo - Empowering children through music and creative expression"
            width={800}
            height={400}
            className={styles.heroImage}
            priority
          />
          <p className={styles.imageCaption}>
            Connecting children worldwide through the universal language of music and song
          </p>
        </div>
      </header>

      <article className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>Children around the world start life in circumstances they don't choose—nor do they choose the education they receive. UNESCO reports that 250 million children globally lack access to quality education, primarily due to poverty, conflicts, or health crises beyond their control. Despite global efforts to expand educational access, significant inequities remain. Existing educational approaches often overlook the question of "what" children truly need to learn in their living environment.</p>

          <p>karaokeGoGo is a music-sharing platform designed to empower children globally through joyful, creative singing experiences. Singing is universally accessible, free, and deeply human—making it ideal for fostering meaningful connections across cultures and languages. The platform allows users to upload music tracks, sing along, and share their songs with peers around the world, creating a supportive community where every voice matters.</p>

          <p>karaokeGoGo isn't conventional education; it's about inspiring kids everywhere, regardless of background or language, to freely express themselves, connect through music, and creatively engage with the world they live in. By harnessing the power of karaoke, we can help children feel free, creative, and able to express themselves—all while having fun and sharing their stories.</p>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>The Global Education Challenge</h2>
          <div className={styles.sectionContent}>
            <p>Today's education rarely prepares children to understand and thrive in the diverse environments into which they're born. Traditional curricula often neglect the critical skills needed to help children become smarter, stronger, and kinder, perpetuating cycles of disadvantage. The result is a widening gap—not only in access but in the quality and relevance of learning experiences.</p>

            <p>While we cannot immediately change the circumstances children face, we urgently need innovative approaches that shift the focus from simply delivering education to fundamentally rethinking its content and purpose. Children everywhere deserve opportunities to learn meaningfully, to engage openly with their environment, and to develop skills that prepare them for the world they'll inherit—no matter where or how their lives begin.</p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Platform Features & Impact</h2>
          <div className={styles.sectionContent}>
            <p>karaokeGoGo leverages accessible, user-friendly technologies such as auto-tuning and lyric-generation tools to help children overcome shyness, build confidence, and explore their musical creativity. Users can "like" shared songs, boosting visibility and fostering a sense of community that transcends geographical and cultural boundaries.</p>

            <p>The platform prioritizes a supportive, safe, and respectful environment maintained through a combination of human and AI-driven moderation. Community guidelines ensure users interact positively, nurturing empathy, collaboration, and openness. This innovative yet familiar approach enables children to spontaneously share observations, thoughts, and feelings through songs—creating meaningful dialogues wherever they are.</p>

            <p className={styles.importantNote}>
              <strong>Target Audience:</strong> karaokeGoGo primarily serves children ages 8 to 16 (or the applicable local legal age), along with older youths, their caregivers and educators who act as facilitators.
            </p>

            <p>Initially conceived to support marginalized children facing barriers due to poverty, conflicts, health crises, or geographic isolation, karaokeGoGo's benefits extend universally, enriching the lives of all children through exposure to diverse global perspectives. Children benefit by having a joyful, accessible way to freely express themselves, gain confidence, and engage creatively with their surroundings through song creation and sharing.</p>

            <p>By interacting spontaneously through music, children from all backgrounds develop empathy and openness, gaining insights into lives and experiences different from their own. Thus, karaokeGoGo bridges cultural and social divides, nurturing curiosity, emotional intelligence, and global citizenship among its young users.</p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>My Mother's Karaoke Bar</h2>
          <div className={styles.sectionContent}>
            <p>I was born and raised in a small fishing village in Japan, the birthplace of karaoke, where my mother ran a karaoke bar. I hated watching my school teachers come in every night to blow off steam by singing karaoke. It drove me so crazy that I left home at age fifteen, determined to pursue my own path.</p>

            <p>Who would have thought I'd end up working for Sesame Street, producing children's media and hundreds of children's songs? Over the past few years, I've had the incredible opportunity to study among the brightest minds at Harvard and MIT. Every week felt like a hackathon. Then, it hit me: what if we could harness the power of karaoke to teach and help kids feel free, creative, and able to express themselves—all while having fun and sharing their stories?</p>

            <p>Looking back, owning a karaoke bar was my mother's dream and way of saving money to send me to college. I hope she enjoyed those nights too. Although she never got to see me attend Harvard, karaokeGoGo will carry her torch, helping children and teachers everywhere teaching and learning from each other.</p>
          </div>
        </div>
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#Music</span>
          <span className={styles.tag}>#Education</span>
          <span className={styles.tag}>#Children</span>
          <span className={styles.tag}>#Karaoke</span>
          <span className={styles.tag}>#GlobalCommunity</span>
          <span className={styles.tag}>#CreativeExpression</span>
        </div>
        
        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
