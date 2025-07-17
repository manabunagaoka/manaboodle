import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '../../../lib/utils';
import styles from '../article.module.css';

export default function MangroveEducationPage() {
  const article = {
    id: 'mangrove-education',
    title: 'Mangrove Education',
    excerpt: 'Exploring resilient education systems inspired by mangrove ecosystems - adaptive, interconnected, and thriving in challenging environments.',
    category: 'casestudy',
    publishedAt: '2025-07-15',
    readTime: 8,
    featured: false
  };

  return (
    <div className={styles.articlePage}>
      <Link href="/casestudies" className={styles.backLink}>← Back to Case Studies</Link>
      
      <article className={styles.articleContent}>
        <header className={styles.pageHeader}>
          <span className={styles.cardCategory} data-category="case-study">Case Study</span>
          <h1 className={styles.pageTitle}>Mangrove Education: An Educator's Journey</h1>
          <div className={styles.articleMeta}>
            <span className={styles.author}>By Manabu Nagaoka and Brandon R. Clarke</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.readTime} min read</span>
          </div>
        </header>

        <div className={styles.articleImage}>
          <Image
            src="/images/mangrove.jpg"
            alt="Mangrove ecosystem - symbol of resilience and interconnected growth"
            width={800}
            height={400}
            style={{ width: '100%', height: 'auto' }}
          />
          <div className={styles.imageCaption}>
            Mangrove ecosystems represent resilience, adaptation, and interconnected growth - qualities essential for sustainable education systems.
          </div>
        </div>

        <div className={styles.articleIntro}>
          <p><em>For HBS 1151: Globalization and Emerging Markets</em></p>
          <p><em>Professor Reshmaan N. Hussam</em></p>
        </div>

        <section className={styles.articleSection}>
          <h2>Yuta Otake: Man, Myth, and Legend</h2>
          <p>
            Sitting at his home office on April 7, 2025—a house he rented for himself and his "Indonesian family"—Yuta Otake reflected on his journey from being a content specialist at Sesame Workshop, the renowned nonprofit behind Sesame Street, to opening his own training center in Yogyakarta, Indonesia. Emerging from a peaceful month-long Ramadan break, his team gradually began returning to work, excitedly breaking ground on the newly leased training center, their home base for the next five years.
          </p>
          
          <p>
            Born and raised in New York City to Japanese parents, renowned dance duo Eiko and Koma, Yuta Otake grew up immersed in art, movement, and cultural dialogue. After earning a master's degree from New York University, Yuta joined Sesame Workshop, to help develop their English as a Foreign Language program.
          </p>
          
          <p>
            Soon, after several impactful years, he began desiring a deeper connection between himself and the peoples of the communities he served. After completing his tenure at Sesame Workshop, he leveraged his expertise through collaboration with international government agencies, obtaining grants from organizations such as the U.S. Embassy, Fulbright, U.S. Department of State, American Councils, and TESOL International, leading teacher-training projects across Cambodia, East Timor, Taiwan, Indonesia, and Uzbekistan.
          </p>
          
          <p>
            Still, pre-COVID, the rigorous pace of international projects left little time to build and sustain meaningful long-term relationships. So, Yuta made a conscious decision: he chose to take a pause from the intensity of continuous teacher training projects to reconnect with former students and colleagues in Indonesia. With friends, he embarked on motorcycle journeys across the sprawling Indonesian archipelago, conducting professional development workshops at regional universities—many of them informally, fueled by mutual respect rather than contractual obligations.
          </p>
          
          <p>
            Embracing the local culture deeply, he quickly mastered Bahasa Indonesia, not just as a method of communication but as a gesture of respect towards his new community. Word spread in town after town, Yuta gaining popularity and a dedicated following (a few thousands of them), who affectionately viewed him as not just an educator, but as a trusted mentor and even a spiritual leader.
          </p>
          
          <p>
            However, in 2020, the COVID-19 pandemic disrupted global education, forcing schools into closure and leaving teachers and students isolated. Yuta narrowly escaped becoming trapped in Indonesia, retreating instead to Japan, where he resided in his grandparents' home through the challenging years that followed. Given this time and space to recalibrate, what emerged from his retreat was not simply a return to the global stage, but a return to community. In the summer of 2024, Yuta returned to Indonesia with an invitation from a friend, Heni, from pre-COVID training jobs. He continued to pursue his ambitious goals, surrounded by collaborators who have become family. His work is no longer about scale, but about depth. Not about numbers, but names. His journey, though still unfolding, is a lesson in presence: how to listen, how to build trust, and how to lead by simply being there.
          </p>
        </section>

        <section className={styles.articleSection}>
          <h2>Rosalina Nugraheni Wulan Purnami: A Passionate Leader in Language Education</h2>
          <p>
            Rosalina Nugraheni Wulan Purnami, commonly known as Heni, is an experienced educator and language enthusiast, serving as the Head of the Language and Culture Center at Esa Unggul University in Jakarta, Indonesia. Passionate about teaching English and promoting cross-cultural understanding, she has committed her career to enhancing language skills and global opportunities for students and professionals alike.
          </p>
          
          <p>
            Beyond her university role, Heni serves as a National Board Member of FILBA, the Association of Language Centers in Indonesia. FILBA represents over 120 university language centers, working tirelessly to improve language education quality, share best practices, and foster institutional collaboration. Believing that language is a profound cultural bridge, Heni champions innovative approaches to language learning, aiming to empower individuals academically and professionally. In addition to her work with FILBA, Heni leads regular workshops, including the national problem-solving workshops held at least twice a year.
          </p>
          
          <p>
            She organized FILBA's cross country tour with Yuta in the summer of 2024, visiting over 50 universities, to foster dialogue and practical solutions to teaching challenges across the country. This was the beginning of the partnership that would later lead to the founding of the Mangrove Training Center.
          </p>
        </section>

        <section className={styles.articleSection}>
          <h2>Indonesia: A Nation in Transition</h2>
          <p>
            Geographically diverse, Indonesia stretches across an archipelago of over 17,000 islands along the equator. With a population surpassing 285 million people, Indonesia ranks as the world's fourth-most populous nation. Predominantly Muslim (87.2%), Indonesia is religiously diverse, also home to Christians (9.87%), Hindus (1.69%), Buddhists (0.72%), and others.
          </p>
          
          <p>
            Indonesian, or Bahasa Indonesia, serves as the unifying national language amidst a mosaic of regional languages and dialects. Politically, Indonesia recently transitioned from President Joko Widodo (2014–2024), known for infrastructure growth and economic reforms, to a new administration facing the complex challenges of a rapidly evolving global landscape.
          </p>
          
          <p>
            In education, Indonesia underwent significant modernization under former Minister of Education Nadiem Makarim, a Harvard MBA graduate and founder of the tech giant Gojek. Makarim introduced transformative policies such as the "Merdeka Belajar" (Freedom to Learn) initiative, granting greater autonomy to educators and institutions to foster student creativity and critical thinking.
          </p>
          
          <p>
            His establishment of GovTech Edu aimed to innovate technological solutions like the Merdeka Mengajar online platform, which supported teachers with resources and training. Despite these progressive steps, challenges such as uneven internet access and broader systemic educational issues persisted. Nonetheless, Makarim's tenure marked a hopeful shift towards a modernized, digitally-driven education system in Indonesia.
          </p>
        </section>

        <section className={styles.articleSection}>
          <h2>Challenges in the Indonesian Education Industry</h2>
          <p>
            The Indonesian education industry, as revealed through the experiences of Yuta and Heni, faces a multifaceted set of challenges that span institutional, political, and infrastructural domains.
          </p>
          
          <p>
            One of the most persistent structural challenges is generational gatekeeping within educational institutions. Yuta describes how the older generation—referred to colloquially as bapa-bapa (middle-aged men) and ebu-ebu (older women)—often hold tightly to positions of influence, creating barriers for younger educators and professionals seeking to innovate or challenge the status quo. These individuals, described as skilled politicians, are wary of younger Indonesians returning from overseas with global experience and advanced skills. Rather than welcoming innovation, they tend to hire those who will maintain established norms. This resistance to change stifles progress and discourages new leadership in education.
          </p>
          
          <p>
            Layered atop this generational stagnation is a deeply stratified social system, one in which teachers are often undervalued and underpaid. Heni highlights the widespread economic inequality within the teaching profession, where despite 20% of the national budget being allocated to education, much of that funding is siphoned off before reaching the institutions that need it most. She refers to these invisible hands as "crows"—actors within the system who exploit resources, leaving little for actual development. The result is underfunded universities, staff shortages, and degraded infrastructure. In some cases, national universities cannot even keep their lights on after 5 p.m., reflecting just how deeply austerity has cut into core services.
          </p>
          
          <p>
            This underfunding exacerbates a second major challenge: capacity. At Heni's institution, a staggering 5,000 students are served by only 35 instructors. With such limited staffing, classes balloon and quality suffer. Further, many graduates leave school without the practical training needed to enter the classroom as teachers. This lack of readiness is a systemic issue, one that Yuta's Mangrove Education initiative attempts to address through short, intensive microteaching programs—but the need far outweighs the current capacity.
          </p>
        </section>

        <section className={styles.articleSection}>
          <h2>Fish out of Water: Foreigners in Foreign Countries</h2>
          <p>
            For many foreigners who choose to live and work in a country not their own, particularly in fields as sensitive and rooted in culture as education, the path is often fraught with ambiguity, legal limitations, and social barriers. Yuta's story offers a nuanced glimpse into these complexities—revealing that even with the best intentions, foreign presence in domestic systems can be met with suspicion, resistance, or outright obstruction.
          </p>
          
          <p>
            These constraints are compounded by public perception and social mistrust. When Yuta first began his work in Indonesia, he was often mistaken for a missionary—an implication laden with colonial undertones and deeply rooted historical trauma. Foreigners, particularly Westerners, carry with them a long legacy of intrusion, extraction, and authority in many parts of the Global South. Even today, their presence can evoke questions: Are they here to help or to control? Are they allies or interlopers? The weight of this suspicion can be isolating and can severely hinder attempts at collaboration or credibility.
          </p>
          
          <p>
            Yuta's solution to this was long-term presence and humility. But even then, his foreignness meant he could not easily "disappear" into the community. Foreigners often walk a thin line between visibility and legitimacy—being visible enough to lead change, but not so visible as to be viewed as a threat to local autonomy.
          </p>
          
          <blockquote style={{ fontStyle: 'italic', fontSize: '1.1rem', margin: '2rem 0', padding: '1rem', borderLeft: '4px solid #EA580C', backgroundColor: '#F8F9FA' }}>
            "…the truth is, this can be a profitable and sustainable business model. The only thing that makes it not sustainable is me. So as long as I'm out of the equation, it can fully support itself." — Yuta Otake
          </blockquote>
          
          <p>
            While he remains deeply committed to Indonesia and Mangrove Education, Yuta's true goal is to empower young educators to rise and lead with influence.
          </p>
        </section>

        <section className={styles.articleSection}>
          <h2>Mangrove Education: Seizing Opportunity Through Community and Storytelling</h2>
          <p>
            During the COVID-19 pandemic, Yuta launched the Teacher's Co-Op, an innovative weekly workshop series that connected educators worldwide, providing a space for shared experiences, collaborative learning, and emotional support amid isolation. In retrospect, this initiative marked the beginning of Mangrove's community-centered approach.
          </p>
          
          <p>
            Mangrove Education gained recognition when it won the prestigious Harvard Innovation and Ventures in Education Award in the spring of 2024. Its flagship initiative, the Hero Workshop—centered on the powerful concept "Every Teacher is a Hero. Every Hero Has a Story"—leverages personal storytelling to enhance educational methods and build deeper emotional connections between teachers and learners.
          </p>
          
          <p>
            During the summer of 2024, Heni and Yuta used this storytelling framework to train participants throughout their journey across Indonesia, significantly impacting the local academic communities. Workshops typically spanned two days. On the first day, around 200 pre-service teachers—students enrolled in educational programs—gathered in large auditoriums to learn storytelling techniques. Participants shared deeply personal stories of their life experiences, sparking emotional moments filled with both tears and laughter. They discovered firsthand the profound value and educational potential of their own stories.
          </p>
          
          <p>
            On the second day, smaller, more intimate sessions were held with professors, who shared their narratives and were guided in developing simple case studies for classroom use. Common themes emerged, highlighting widespread challenges teachers face, including feelings of being undervalued, underpaid, and struggling to adequately support their families.
          </p>
          
          <p>
            One of the teachers who calls himself "Risky" shared, "When I was younger, I made about $30USD a month. I was confused and worried all the time if I should continue teaching or not." This testimony echoed the sentiment expressed by many teachers during the workshops.
          </p>
        </section>

        <section className={styles.articleSection}>
          <h2>Mangrove Training Center in Yogyakarta: A New Chapter in Educator Empowerment</h2>
          <p>
            The newly established Mangrove Training Center is strategically located in Yogyakarta, a city celebrated as Java's cultural heart and renowned for its historical significance, traditional arts, and robust educational ecosystem—home notably to Gadjah Mada University. Yogyakarta's central location makes it an accessible hub, ideally suited for bringing educators and learners together from across Indonesia.
          </p>
          
          <p>
            After signing a five-year lease for the center, Yuta faces financial uncertainty, with savings sufficient to cover only several months of operations. His financial concerns are heightened by recent U.S. government budget cuts that have significantly impacted his previous contract-based projects and income sources. Nevertheless, he remains optimistic, envisioning the center as a self-sustaining home for his former students and colleagues—a lasting legacy sustained by their collective dedication and initiative.
          </p>
          
          <p>
            His long-term vision centers on creating a community-driven institution—one that is not only a place for professional development but also a welcoming space for educators to come together, share knowledge, and build upon the meaningful work they've already begun. This commitment to sustainability and empowerment fuels Yuta's determination to continue pushing forward despite the odds.
          </p>
          
          <p style={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center', margin: '2rem 0' }}>
            All this commitment, accessible to educators for just the price of a cup of coffee.
          </p>
        </section>

        <div className={styles.articleFooter}>
          <div className={styles.articleTags}>
            <span className={styles.tag}>#Education</span>
            <span className={styles.tag}>#Indonesia</span>
            <span className={styles.tag}>#TeacherTraining</span>
            <span className={styles.tag}>#Storytelling</span>
            <span className={styles.tag}>#CommunityBuilding</span>
            <span className={styles.tag}>#SocialImpact</span>
            <span className={styles.tag}>#CrossCultural</span>
            <span className={styles.tag}>#ProfessionalDevelopment</span>
          </div>
          
          <div className={styles.articleActions}>
            <Link href="/" className={styles.backHome}>← Back to Home</Link>
          </div>
        </div>
      </article>
    </div>
  );
}