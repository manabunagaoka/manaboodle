// app/casestudies/mangrove/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../article.module.css';

// Article metadata for Next.js
export const metadata: Metadata = {
  title: 'Mangrove Education: Building Resilient Teacher Communities in Indonesia',
  description: 'How a grassroots education initiative is transforming teacher training in Indonesia through community, storytelling, and sustainable practices.',
};

// Main article component
export default function MangroveEducationPage() {
  return (
    <div className={styles.articlePage}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <Link href="/casestudies" className={styles.backLink}>← Back to Case Studies</Link>
          <span className={styles.articleCategory}>Case Study</span>
        </div>
        
        <h1 className={styles.articleTitle}>Mangrove Education: Building Resilient Teacher Communities in Indonesia</h1>
        
        <div className={styles.articleInfo}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>by Manabu Nagaoka</span>
            <span className={styles.publishDate}>July 20, 2025</span>
            <span className={styles.readTime}>5 min read</span>
          </div>
        </div>
      </header>

      <article className={styles.articleContent}>
        <div className={styles.articleIntro}>
          <p>
            In April 2025, Yuta Otake sat in his rented home office in Yogyakarta, Indonesia, reflecting on an unlikely journey. 
            From content specialist at Sesame Workshop to founder of a grassroots teacher training center, his path illuminates 
            both the challenges and opportunities in Indonesia's evolving education landscape.
          </p>
          <p>
            Named after the resilient mangrove tree—an underappreciated protector of coastal ecosystems—Mangrove Education 
            embodies a similar philosophy: nurturing and protecting the educational ecosystem through community-driven teacher development.
          </p>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>The Indonesian Education Context</h2>
          <div className={styles.sectionContent}>
            <p>
              Indonesia, the world's fourth-most populous nation with over 285 million people across 17,000 islands, 
              faces unique educational challenges. Despite allocating 20% of the national budget to education, systemic 
              issues persist: generational gatekeeping, severe understaffing (one institution serves 5,000 students with 
              only 35 instructors), and financial constraints that leave some universities unable to keep lights on after 5 PM.
            </p>
            <p>
              Recent political shifts have further complicated the landscape. Budget cuts to professional development 
              and international collaboration have left educators increasingly isolated, while graduates often enter 
              classrooms without adequate practical training.
            </p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>A Different Approach: The Hero Workshop</h2>
          <div className={styles.sectionContent}>
            <p>
              Mangrove Education's flagship initiative, the Hero Workshop, operates on a simple yet powerful premise: 
              <strong>"Every Teacher is a Hero. Every Hero Has a Story."</strong> This storytelling-centered approach, 
              which won the Harvard Innovation and Ventures in Education Award in 2024, transforms how educators 
              connect with their purpose and their students.
            </p>
            <p>
              During a national tour with FILBA (Association of Language Centers in Indonesia) in summer 2024, 
              Yuta and his colleague Heni reached over 50 universities. The two-day workshops brought together 
              200 pre-service teachers for storytelling sessions that sparked both tears and laughter, followed 
              by intimate gatherings where professors developed case studies from their own experiences.
            </p>
            
            <p className={styles.importantNote}>
              "When I was younger, I made about $30 USD a month. I was confused and worried all the time 
              if I should continue teaching or not," shared one participant who calls himself "Risky," 
              echoing sentiments expressed by many educators facing financial and emotional challenges.
            </p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Building Community, Not Just Skills</h2>
          <div className={styles.sectionContent}>
            <p>
              What sets Mangrove apart is its emphasis on sustained relationships over one-off trainings. 
              Weekly "sharing sessions" maintain ongoing connections with former students, creating spaces 
              for mentorship and mutual support. This approach emerged from Yuta's Teacher's Co-Op during 
              the COVID-19 pandemic—a global workshop series that became a "lifeline" for isolated educators.
            </p>
            <p>
              The newly established Mangrove Training Center in Yogyakarta embodies this community-centered 
              vision. Located in Java's cultural heart, the center aims to be a "resort" where teachers can 
              gather for the price of a coffee, with plans for an actual café using beans grown by a former 
              student's plantation.
            </p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Navigating Foreignness and Sustainability</h2>
          <div className={styles.sectionContent}>
            <p>
              As a foreigner in Indonesia's education system, Yuta faces unique challenges—from being mistaken 
              for a missionary to navigating legal restrictions on foreign ownership. His response has been 
              long-term presence and humility, mastering Bahasa Indonesia and building trust through years 
              of consistent engagement.
            </p>
            <p>
              Yet sustainability remains precarious. With only months of operational funding secured and recent 
              U.S. government budget cuts affecting his income, Yuta paradoxically sees himself as the project's 
              biggest obstacle: <em>"The truth is, this can be a profitable and sustainable business model. 
              The only thing that makes it not sustainable is me. So as long as I'm out of the equation, 
              it can fully support itself."</em>
            </p>
          </div>
        </div>

        <div className={styles.articleSection}>
          <h2 className={styles.sectionHeading}>Seeds of Change</h2>
          <div className={styles.sectionContent}>
            <p>
              Despite challenges, Mangrove Education represents a promising model for educational development. 
              By positioning teachers as ecosystem builders and creating low-cost, high-impact training accessible 
              to all, it addresses critical gaps in Indonesia's teacher preparation system. The initiative's 
              success lies not in scale but in depth—nurturing an ecosystem where every educator is both 
              learner and mentor.
            </p>
            <p>
              As Yuta reflects on his journey from Sesame Street to the streets of Yogyakarta, Mangrove 
              Education stands as testament to the power of patient, community-driven change. Like its 
              namesake tree, it may be underappreciated but remains essential—quietly protecting and 
              nurturing the educational ecosystem it serves.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB' }}>
          <div className={styles.importantNote}>
            <strong>About This Article:</strong> This is an edited excerpt from "Mangrove Education: An Educator's Journey" 
            by Manabu Nagaoka and Brandon R. Clarke, originally written for HBS 1151: Globalization and Emerging Markets 
            under Professor Reshmaan N. Hussam. The full case study includes detailed analysis of Indonesia's education 
            system, comprehensive interviews with stakeholders, and in-depth exploration of cross-cultural education initiatives. 
            For access to the complete study, please <Link href="/contact" className={styles.inlineLink}>contact the author</Link>.
          </div>
        </div>
      </article>

      <footer className={styles.articleFooter}>
        <div className={styles.articleTags}>
          <span className={styles.tag}>#Education</span>
          <span className={styles.tag}>#Indonesia</span>
          <span className={styles.tag}>#TeacherTraining</span>
          <span className={styles.tag}>#Community</span>
          <span className={styles.tag}>#Storytelling</span>
          <span className={styles.tag}>#GlobalEducation</span>
        </div>
        
        <div className={styles.articleActions}>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}