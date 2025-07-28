// app/tools/sassy/lib/newsletter-detector.ts

export interface VibeAnalysis {
  vibe: 'personal' | 'corporate' | 'newsletter';
  score: number;
  warnings: string[];
  mood: 'happy' | 'neutral' | 'thinking' | 'sassy' | 'shocked';
  botMessage: string;
}

const corporateWords = [
  'leverage', 'synergy', 'paradigm', 'optimization', 'streamline', 'utilize',
  'facilitate', 'enhance', 'maximize', 'minimize', 'scalable', 'robust',
  'innovative', 'cutting-edge', 'best-in-class', 'world-class', 'enterprise',
  'solution', 'platform', 'ecosystem', 'framework', 'methodology', 'actionable',
  'impactful', 'bandwidth', 'circle back', 'touch base', 'reach out', 
  'move the needle', 'low-hanging fruit', 'win-win', 'game-changer', 'deep dive',
  'thought leader', 'disruptive', 'pivot', 'ideate', 'holistic', 'best practices'
];

const newsletterPhrases = [
  'in this issue', 'in this newsletter', 'dear subscribers', 'click here',
  'view in browser', 'unsubscribe', 'forward to a friend', 'issue #',
  'this week\'s newsletter', 'in case you missed it', 'icymi',
  'as promised', 'breaking news', 'exciting announcement', 'pleased to announce',
  'stay tuned', 'don\'t miss out', 'exclusive content', 'subscribers only',
  'in today\'s edition', 'weekly roundup', 'monthly digest', 'curated for you'
];

export function analyzeVibe(text: string): VibeAnalysis {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  const totalWords = words.length;
  
  if (totalWords === 0) {
    return {
      vibe: 'personal',
      score: 100,
      warnings: [],
      mood: 'happy',
      botMessage: "Start typing to see what I think!"
    };
  }

  let corporateCount = 0;
  let newsletterCount = 0;
  const foundTerms: string[] = [];
  const warnings: string[] = [];
  let detectedNewsletterPhrase = '';

  // Check for corporate words
  corporateWords.forEach(word => {
    if (lowerText.includes(word)) {
      corporateCount++;
      foundTerms.push(word);
    }
  });

  // Check for newsletter phrases
  newsletterPhrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      newsletterCount++;
      if (!detectedNewsletterPhrase) {
        detectedNewsletterPhrase = phrase; // Store the first detected phrase
      }
      warnings.push(`"${phrase}" - NEWSLETTER ALERT! 🚨`);
    }
  });

  // Check for exclamation overuse
  const exclamationCount = (text.match(/!/g) || []).length;

  // Calculate human score (100 = perfect human, 0 = robot)
  let score = 100;
  score -= corporateCount * 15;
  score -= newsletterCount * 25;
  score -= Math.max(0, (exclamationCount - 2) * 5); // Penalty for more than 2 exclamations
  
  // Personal indicators boost human score
  const personalIndicators = ['i think', 'i feel', 'i\'ve been', 'i wonder', 'lately', 'recently', 'honestly', 'actually'];
  personalIndicators.forEach(indicator => {
    if (lowerText.includes(indicator)) {
      score += 5;
    }
  });

  score = Math.max(0, Math.min(100, score));

  // Determine vibe and mood based on score and found terms
  let vibe: 'personal' | 'corporate' | 'newsletter';
  let mood: 'happy' | 'neutral' | 'thinking' | 'sassy' | 'shocked';
  let botMessage: string;

  // Special case: Newsletter phrases detected
  if (newsletterCount > 0) {
    vibe = 'newsletter';
    mood = 'shocked';
    botMessage = `"${detectedNewsletterPhrase}"?! Oh great, ANOTHER newsletter! Just what the internet needed! Next you'll tell me it's "curated content" and you "value my time" 🙄`;
  }
  // Score-based responses
  else if (score === 100) {
    vibe = 'personal';
    mood = 'happy';
    botMessage = "Wait... this actually sounds human! No buzzwords? No newsletter plug? Are you feeling okay?";
  } else if (score >= 90) {
    vibe = 'personal';
    mood = 'happy';
    botMessage = "Not bad! You managed to sound like an actual person instead of a marketing chatbot. Gold star! ⭐";
  } else if (score >= 80) {
    vibe = 'personal';
    mood = 'neutral';
    if (foundTerms.length > 0) {
      botMessage = `Hmm, "${foundTerms[0]}"? That's dangerously close to LinkedIn territory, friend.`;
    } else {
      botMessage = "It's... okay. Like a human who reads too many business books.";
    }
  } else if (score >= 60) {
    vibe = 'personal';
    mood = 'thinking';
    if (foundTerms.includes('synergy') || foundTerms.includes('leverage')) {
      botMessage = `"${foundTerms[0]}"? Really? Did you get this from a "Business Jargon 101" template?`;
    } else if (foundTerms.length > 1) {
      botMessage = `Using "${foundTerms[0]}" AND "${foundTerms[1]}" in the same message? Your MBA is showing.`;
    } else if (exclamationCount > 2) {
      botMessage = `${exclamationCount} exclamation marks? This isn't a pyramid scheme pitch! Calm down!!!`;
    } else {
      botMessage = "Getting a bit corporate there... Next you'll be asking me to 'circle back' 🤮";
    }
  } else if (score >= 40) {
    vibe = 'corporate';
    mood = 'sassy';
    if (foundTerms.includes('thought leader')) {
      botMessage = `"Thought leader"? The only thing you're leading is the charge to my spam folder.`;
    } else if (foundTerms.length > 2) {
      botMessage = `${foundTerms.length} buzzwords in one message? Congrats, you've achieved peak corporate cringe! 🏆`;
    } else {
      botMessage = "This reads like it was written by a LinkedIn influencer having a midlife crisis.";
    }
  } else {
    vibe = 'corporate';
    mood = 'shocked';
    if (foundTerms.length > 3) {
      botMessage = `${foundTerms.length} buzzwords?! This is weapons-grade corporate nonsense! My circuits are melting! 🤖💥`;
    } else if (foundTerms.includes('paradigm') || foundTerms.includes('ecosystem')) {
      botMessage = `"${foundTerms[0]}"?! I need a shower after reading this. In bleach. Industrial strength.`;
    } else {
      botMessage = "This is so corporate, I think I just grew a tie. Please, make it stop! 😭";
    }
  }

  return {
    vibe,
    score: Math.round(score),
    warnings: warnings.slice(0, 3), // Limit to 3 warnings
    mood,
    botMessage
  };
}