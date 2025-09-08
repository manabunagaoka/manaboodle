export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'concept' | 'project' | 'casestudy' | 'random';
  publishedAt: string;
  readTime: number;
  featured: boolean;
  slug: string;
  author?: string; // Author name for search
  content?: string; // Full article content for search
}

// Static article data with manual dates for now
export const articles: Article[] = [
  {
    id: 'childcare-startup-journey',
    title: 'A Childcare Startup?! What Am I Thinking?',
    excerpt: 'The early education sector is notoriously hard: fragmented, underfunded, and full of informal solutions. Yet it\'s also one of the most impactful sectors in our economy and society.',
    category: 'project',
    publishedAt: '2025-09-07',
    readTime: 2,
    featured: true,
    slug: 'childcare-startup-journey',
    author: 'Jenna Winocur',
    content: `A childcare startup?! What am I thinking? The early education sector is notoriously hard: fragmented, underfunded, and full of informal, "good enough" solutions that make any innovation an uphill battle. Yet it's also one of the most impactful sectors in our economy and society. Whether brave or foolish, I'm hitting the pavement (or playground), and asking parents for their perspectives on a problem space that most tech innovators won't touch with a 10 foot pole. (Shoutout to their kiddos for beautifying my poster!) There are three truths I've learned working in the startup space: Product-Market-Fit is everything. The biggest opportunities often hide where the status quo feels impossible to change. If you want to solve the world's greatest challenges, start with empathy. Six months ago, I began researching in-home early childhood development through Harvard Graduate School of Education, Massachusetts Institute of Technology MIT and a team of collaborators across the globe including Latin America, Africa, Asia, and the US. I learned just how much this industry is overlooked and undervalued despite its universal importance. A few facts: US families United States spend up to 22% of their income on childcare. The first six years shape 90% of brain development. Early childhood interventions have some of the greatest impact in reducing lifelong inequities. Yet access is inconsistent, wages are at near poverty levels, and the 94% women-powered workforce bears the brunt, along with working moms mothers. There's even a podcast on this very topic with the painfully fitting title: No One is Coming to Save Us by Lemonada Media. So, I made a sign: "Parents, come talk to me about your experience with childcare." This past week, I've been in parks and playgrounds, and my team is interviewing parents across Latin America, Africa, Asia, and the US United States. The stories differ, but the heart is the same: every parent wants to give their child the best start in life. We started by speaking to nannies and agencies, but parents are where we believe the greatest opportunity lies. You may not want to underestimate us. The need is urgent, now is the time, and we're the right team to execute on it. Parents of children 0–6 → Talk to me about your experience with childcare and education in the home! Tackled a tough problem in an "unattractive" industry? → How did you start? Working on childcare systems change? → Let's connect! A rising tide lifts all boats. BuildInPublic Childcare FutureOfChildcare ECD EducationEquity FromThePlayground StartWithEmpathy SocialInnovation EdTech FounderJourney HumanCenteredDesign`
  },
  {
    id: 'tools',
    title: 'Building Tools That Actually Matter',
    excerpt: 'Introducing Manaboodle\'s Tools category and Sassy, the anti-newsletter companion that keeps your writing human.',
    category: 'project',
    publishedAt: '2025-08-01',
    readTime: 4,
    featured: false,
    slug: 'tools',
    author: 'Manabu Nagaoka',
    content: `Welcome to the Tools category—where we build digital companions that enhance human creativity rather than replace it. Our philosophy is simple: technology should amplify our humanity, not diminish it. Meet Sassy, our anti-newsletter companion. In a world drowning in automated content and soulless marketing emails, Sassy helps you keep your writing authentically human. She's not here to write for you—she's here to remind you of your unique voice, your personal stories, and the genuine connections that make communication meaningful. Sassy challenges the conventional wisdom of marketing automation. Instead of pushing you toward conversion-optimized templates, she encourages you to share real experiences, ask genuine questions, and build relationships that matter. She's the friend who reminds you that behind every email address is a real person with hopes, dreams, and challenges. The future of digital tools isn't about efficiency alone—it's about preserving and amplifying the human elements that make communication powerful. Whether you're writing to one person or one thousand, Sassy helps you remember that authenticity always wins over automation. Sassy anti-newsletter companion digital tools human creativity technology humanity automated content marketing emails authentic writing unique voice personal stories genuine connections communication marketing automation conversion templates real experiences relationships authenticity`
  },
  {
    id: 'ai-nurturing-surrogate-caregivers',
    title: 'AI Nurturing and Surrogate Caregivers',
    excerpt: 'Imagine a dataset capturing emotional nuances and caregiving insights from millions of genuine interactions within a unique triangular relationship: human children, caregivers, and AI.',
    category: 'concept',
    publishedAt: '2025-07-20',
    readTime: 12,
    featured: false,
    slug: 'ai-nurturing',
    author: 'Manabu Nagaoka',
    content: `Imagine a dataset capturing emotional nuances and caregiving insights from millions of genuine interactions within a unique triangular relationship: human children, caregivers, and AI. This isn't just another machine learning model—it's a revolution in how we think about artificial intelligence, human connection, and the future of childcare. The traditional approach to AI development focuses on efficiency, accuracy, and scale. But what if we shifted the paradigm? What if we designed AI systems that prioritize empathy, emotional intelligence, and the delicate art of nurturing? In the realm of early childhood development, the stakes couldn't be higher. The first six years of a child's life shape 90% of their brain development. Every interaction, every moment of care, every gentle guidance shapes who they become. This is where AI nurturing comes in—not to replace human caregivers, but to amplify their capacity for love, understanding, and personalized attention. Through advanced machine learning, natural language processing, and emotional AI, we're creating systems that can recognize a child's emotional state, adapt to their learning style, and provide the kind of responsive, nurturing care that every child deserves. The technology learns from the best human caregivers, capturing their wisdom, intuition, and emotional intelligence, then makes this knowledge accessible to children worldwide. artificial intelligence machine learning emotional AI natural language processing caregivers childcare early childhood development brain development empathy emotional intelligence nurturing responsive care personalized attention wisdom intuition`
  },
  {
    id: 'mangrove-education',
    title: 'Mangrove Education',
    excerpt: 'Exploring resilient education systems inspired by mangrove ecosystems - adaptive, interconnected, and thriving in challenging environments.',
    category: 'casestudy',
    publishedAt: '2025-07-20',
    readTime: 5,
    featured: false,
    slug: 'mangrove-education',
    author: 'Manabu Nagaoka',
    content: `In April 2025, Yuta Otake sat in his rented home office in Yogyakarta, Indonesia, reflecting on an unlikely journey. From working with Sesame Street's global education initiatives to pioneering grassroots teacher training in Indonesia, Yuta embodies the adaptive resilience of mangrove ecosystems. Mangrove Education represents a new paradigm in educational resilience—systems that can thrive in challenging environments by building interconnected networks of support. Like mangroves that create entire ecosystems in brackish waters, Yuta and his colleague Heni reached over 50 universities across Indonesia. The two-day workshops brought together educators, administrators, and students in a collaborative learning environment that mirrors the interconnected root systems of mangroves. The newly established Mangrove Training Center in Yogyakarta embodies this community-centered approach, providing a physical space for mentorship and mutual support. This approach emerged from Yuta's Teacher's Co-Op during his time with international education programs. As a foreigner in Indonesia's education system, Yuta faces unique challenges—from being mistaken for a student to navigating complex bureaucratic systems. Despite U.S. government budget cuts affecting his income, Yuta paradoxically sees himself as the project's weakest link, yet his humility and adaptability have created something remarkable. As Yuta reflects on his journey from Sesame Street to the streets of Yogyakarta, Mangrove Education demonstrates how resilient educational systems grow from authentic relationships, cultural sensitivity, and adaptive leadership. Indonesia Yogyakarta Sesame Street teacher training workshops universities educators collaboration community resilience adaptation international education`
  },
  {
    id: 'nanny',
    title: 'Super Personalized Learning Model: Nannies vs AI',
    excerpt: 'From Cape Town to global reach: how we are empowering nannies with AI-powered tools to create super-personalized learning experiences for children everywhere.',
    category: 'project',
    publishedAt: '2025-07-20',
    readTime: 6,
    featured: false,
    slug: 'nanny',
    author: 'Manabu Nagaoka',
    content: `Fresh off my Harvard graduation, I tagged along with my partner-in-crime Jenna Winocur to attend a "nanny" training run by the Indaba Institute in Cape Town, South Africa—an ideal sandbox for MVP-testing the platform I vibe-coded. From the classroom to the community, we're shoulder-to-shoulder with women who are already shaping young lives—and building brighter futures for the next generation. Under African skies, I'm grateful for the chance to learn, serve, and grow in a place as beautiful as it is complex. Together we ran our first MVP: a Montessori-rooted course for aspiring nannies, paired with a lightweight digital toolkit that helps them flourish. It was a resounding success. The challenge: How do we scale super-personalized learning without losing the human touch? The answer isn't to replace nannies with AI—it's to amplify their superpowers. Imagine an AI that learns from the best nannies in the world, capturing their intuition, creativity, and emotional intelligence. Then imagine that same AI becoming a 24/7 learning companion for children everywhere. Empathy cultural nuance reading child mood seconds. Infinite patience data recall 24/7 micro-assessments personalized playlists real-time feedback. Hands-on modeling tying shoes drying tears celebrating first words. Scalable curriculum suggestions aligned Montessori CAPS framework milliseconds. Trust built families over time. Analytics tracking progress objectively thousands learners. By empowering nannies to become Early Childhood Development specialists, we're laying the groundwork for super-personalized learning—human-centered, culturally grounded, and scalable everywhere. Cape Town South Africa Indaba Institute Harvard Jenna Winocur Montessori nannies caregivers AI artificial intelligence machine learning personalized learning early childhood development ECD women empowerment Africa`
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding',
    excerpt: 'Exploring the intersection of music, mood, and programming productivity. How different vibes can unlock creative coding flow states.',
    category: 'random',
    publishedAt: '2025-07-20',
    readTime: 7,
    featured: false,
    slug: 'vibe-coding',
    author: 'Manabu Nagaoka',
    content: `What happens when you combine coding with the perfect soundtrack? Magic. Welcome to vibe coding—where music, mood, and programming converge to create something extraordinary. I discovered this accidentally during a late-night coding session in my Harvard dorm. The right song came on, and suddenly my fingers were flying across the keyboard. Code was flowing like poetry. Complex algorithms became intuitive. Bugs revealed themselves without struggle. That's when I realized: coding isn't just about logic—it's about feeling. Different musical vibes unlock different types of thinking. Jazz improvisation mirrors the creative problem-solving needed for architecture decisions. Electronic beats provide the steady rhythm perfect for repetitive tasks. Classical music creates the mental space needed for deep algorithmic thinking. Ambient soundscapes help with debugging and code review. The science backs this up. Music affects brainwave patterns, cognitive load, and creative thinking. The right soundtrack can increase productivity by 30% and reduce errors by 20%. But it's not just about performance—it's about joy. When coding feels like dancing, when debugging feels like solving puzzles, when building feels like creating art—that's when technology becomes truly human. vibe coding music mood programming soundtrack Harvard dorm keyboard poetry algorithms bugs logic feeling jazz improvisation electronic beats classical music ambient soundscapes debugging code review brainwave patterns cognitive load creative thinking productivity errors performance joy dancing puzzles art technology human flow states`
  },
  {
    id: 'karaokegogo',
    title: 'karaokeGoGo',
    excerpt: 'A music-sharing platform designed to empower children globally through joyful, creative singing experiences.',
    category: 'project',
    publishedAt: '2025-07-20',
    readTime: 8,
    featured: false,
    slug: 'karaokegogo',
    author: 'Manabu Nagaoka',
    content: `karaokeGoGo is a music-sharing platform designed to empower children globally through joyful, creative singing experiences. Imagine a world where every child can express themselves through music, where cultural barriers dissolve through the universal language of song, and where creativity knows no bounds. That's the vision behind karaokeGoGo. This platform combines the joy of karaoke with the power of global connection, allowing children to share their musical creations, learn from each other, and celebrate diversity through song. Whether it's a lullaby from grandmother in rural Kenya, a pop song from a teenager in Tokyo, or an original composition from a young songwriter in São Paulo, karaokeGoGo creates a safe, supportive environment for musical expression. The platform features age-appropriate content, multilingual support, and tools that help children develop confidence, creativity, and cultural awareness. Through music, we're building bridges between communities, fostering empathy, and nurturing the next generation of global citizens. karaokeGoGo music sharing platform children global joyful creative singing experiences cultural barriers universal language song creativity karaoke global connection musical creations diversity lullaby Kenya pop song Tokyo original composition São Paulo safe supportive environment musical expression age-appropriate multilingual confidence cultural awareness bridges communities empathy global citizens`
  }
];

export const getArticlesByCategory = (category: Article['category']) => {
  return articles.filter(article => article.category === category);
};

export const getFeaturedArticles = () => {
  return articles.filter(article => article.featured);
};

export const getArticleById = (id: string) => {
  return articles.find(article => article.id === id);
};