// app/tools/sassy/components/SassyCharacterDesigns.tsx
import React from 'react';

interface CharacterProps {
  mood: 'happy' | 'neutral' | 'thinking' | 'sassy' | 'shocked';
  score: number;
}

// Option 1: Blob Monster (Spark-inspired)
export const BlobMonster = ({ mood, score }: CharacterProps) => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Main blob body */}
    <path d="M50 15 C70 15 85 30 85 50 C85 70 70 85 50 85 C30 85 15 70 15 50 C15 30 30 15 50 15" 
          fill={score >= 80 ? '#55A653' : score >= 60 ? '#EAAA31' : '#E5555C'} />
    
    {/* Wobbly tentacles */}
    <path d="M30 75 Q25 85 20 90" stroke={score >= 80 ? '#55A653' : score >= 60 ? '#EAAA31' : '#E5555C'} strokeWidth="8" strokeLinecap="round" />
    <path d="M50 80 Q50 90 50 95" stroke={score >= 80 ? '#55A653' : score >= 60 ? '#EAAA31' : '#E5555C'} strokeWidth="8" strokeLinecap="round" />
    <path d="M70 75 Q75 85 80 90" stroke={score >= 80 ? '#55A653' : score >= 60 ? '#EAAA31' : '#E5555C'} strokeWidth="8" strokeLinecap="round" />
    
    {/* Eyes based on mood */}
    {mood === 'happy' && (
      <>
        <circle cx="35" cy="40" r="5" fill="#FFF" />
        <circle cx="65" cy="40" r="5" fill="#FFF" />
      </>
    )}
    {mood === 'shocked' && (
      <>
        <circle cx="35" cy="40" r="10" fill="#FFF" />
        <circle cx="65" cy="40" r="10" fill="#FFF" />
        <circle cx="35" cy="40" r="5" fill="#333" />
        <circle cx="65" cy="40" r="5" fill="#333" />
      </>
    )}
    {(mood === 'neutral' || mood === 'thinking' || mood === 'sassy') && (
      <>
        <ellipse cx="35" cy="40" rx="8" ry="4" fill="#333" />
        <ellipse cx="65" cy="40" rx="8" ry="4" fill="#333" />
      </>
    )}
    
    {/* Mouth */}
    {mood === 'happy' && <path d="M30 60 Q50 70 70 60" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />}
    {mood === 'shocked' && <ellipse cx="50" cy="65" rx="15" ry="20" fill="#333" />}
    {(mood === 'neutral' || mood === 'thinking') && <line x1="35" y1="65" x2="65" y2="65" stroke="#333" strokeWidth="3" strokeLinecap="round" />}
    {mood === 'sassy' && <path d="M35 65 Q50 60 65 65" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />}
    
    {/* Score badge */}
    <circle cx="80" cy="20" r="15" fill="#FFF" stroke="#333" strokeWidth="3" />
    <text x="80" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">{score}%</text>
  </svg>
);

// Option 2: Speech Bubble Character
export const BubbleCharacter = ({ mood, score }: CharacterProps) => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Main bubble body */}
    <path d="M20 40 Q20 20 40 20 L60 20 Q80 20 80 40 L80 60 Q80 80 60 80 L40 80 Q20 80 20 60 Z" 
          fill={score >= 80 ? '#55A653' : score >= 60 ? '#EAAA31' : '#E5555C'} />
    
    {/* Tail */}
    <path d="M35 75 L25 90 L45 75" fill={score >= 80 ? '#55A653' : score >= 60 ? '#EAAA31' : '#E5555C'} />
    
    {/* Eyes */}
    {mood === 'happy' && (
      <>
        <path d="M30 35 Q35 30 40 35" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M60 35 Q65 30 70 35" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    )}
    {mood === 'shocked' && (
      <>
        <circle cx="35" cy="35" r="8" fill="#FFF" />
        <circle cx="65" cy="35" r="8" fill="#FFF" />
        <circle cx="35" cy="35" r="4" fill="#333" />
        <circle cx="65" cy="35" r="4" fill="#333" />
      </>
    )}
    {(mood === 'neutral' || mood === 'thinking' || mood === 'sassy') && (
      <>
        <circle cx="35" cy="35" r="3" fill="#333" />
        <circle cx="65" cy="35" r="3" fill="#333" />
      </>
    )}
    
    {/* Mouth */}
    {mood === 'happy' && <path d="M30 55 Q50 65 70 55" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" />}
    {mood === 'shocked' && <circle cx="50" cy="60" r="8" fill="#333" />}
    {(mood === 'neutral' || mood === 'thinking') && <line x1="40" y1="60" x2="60" y2="60" stroke="#333" strokeWidth="3" strokeLinecap="round" />}
    {mood === 'sassy' && <path d="M40 60 Q50 55 60 60" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />}
    
    {/* Score */}
    <text x="50" y="90" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">{score}%</text>
  </svg>
);

// Option 3: Cartoon Cloud
export const CloudCharacter = ({ mood, score }: CharacterProps) => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cloud body */}
    <path d="M25 60 Q15 60 15 50 Q15 40 25 40 Q25 30 35 30 Q35 20 50 20 Q65 20 65 30 Q75 30 75 40 Q85 40 85 50 Q85 60 75 60 Q75 70 65 70 Q65 80 50 80 Q35 80 35 70 Q25 70 25 60" 
          fill={score >= 80 ? '#87CEEB' : score >= 60 ? '#FFD700' : '#FFB6C1'} stroke="#333" strokeWidth="3" />
    
    {/* Eyes */}
    {mood === 'happy' && (
      <>
        <circle cx="35" cy="45" r="2" fill="#333" />
        <circle cx="65" cy="45" r="2" fill="#333" />
      </>
    )}
    {mood === 'shocked' && (
      <>
        <circle cx="35" cy="45" r="6" fill="#FFF" stroke="#333" strokeWidth="2" />
        <circle cx="65" cy="45" r="6" fill="#FFF" stroke="#333" strokeWidth="2" />
      </>
    )}
    {(mood === 'neutral' || mood === 'thinking' || mood === 'sassy') && (
      <>
        <line x1="30" y1="45" x2="40" y2="45" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="45" x2="70" y2="45" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      </>
    )}
    
    {/* Mouth */}
    {mood === 'happy' && <path d="M35 60 Q50 65 65 60" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />}
    {mood === 'shocked' && <ellipse cx="50" cy="62" rx="8" ry="10" fill="#333" />}
    {(mood === 'neutral' || mood === 'thinking') && <path d="M40 60 Q50 62 60 60" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />}
    {mood === 'sassy' && <path d="M40 62 Q50 58 60 62" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />}
    
    {/* Score badge */}
    <rect x="70" y="10" width="25" height="20" rx="10" fill="#FFF" stroke="#333" strokeWidth="2" />
    <text x="82" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#333">{score}%</text>
  </svg>
);

// Option 4: Retro TV Character
export const TVCharacter = ({ mood, score }: CharacterProps) => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Antennas */}
    <line x1="40" y1="20" x2="30" y2="5" stroke="#333" strokeWidth="3" strokeLinecap="round" />
    <line x1="60" y1="20" x2="70" y2="5" stroke="#333" strokeWidth="3" strokeLinecap="round" />
    <circle cx="30" cy="5" r="3" fill="#E5555C" />
    <circle cx="70" cy="5" r="3" fill="#E5555C" />
    
    {/* TV body */}
    <rect x="20" y="20" width="60" height="60" rx="5" fill="#333" />
    <rect x="25" y="25" width="50" height="40" rx="3" fill={score >= 80 ? '#55A653' : score >= 60 ? '#EAAA31' : '#E5555C'} />
    
    {/* Eyes on screen */}
    {mood === 'happy' && (
      <>
        <rect x="35" y="35" width="8" height="8" fill="#FFF" />
        <rect x="57" y="35" width="8" height="8" fill="#FFF" />
      </>
    )}
    {mood === 'shocked' && (
      <>
        <rect x="32" y="32" width="12" height="12" fill="#FFF" />
        <rect x="56" y="32" width="12" height="12" fill="#FFF" />
      </>
    )}
    {(mood === 'neutral' || mood === 'thinking' || mood === 'sassy') && (
      <>
        <rect x="35" y="37" width="8" height="4" fill="#333" />
        <rect x="57" y="37" width="8" height="4" fill="#333" />
      </>
    )}
    
    {/* Mouth on screen */}
    {mood === 'happy' && <rect x="35" y="52" width="30" height="4" rx="2" fill="#FFF" />}
    {mood === 'shocked' && <rect x="42" y="50" width="16" height="10" rx="5" fill="#333" />}
    {(mood === 'neutral' || mood === 'thinking' || mood === 'sassy') && <rect x="40" y="54" width="20" height="3" rx="1" fill="#333" />}
    
    {/* Control knobs */}
    <circle cx="30" cy="73" r="4" fill="#666" />
    <circle cx="70" cy="73" r="4" fill="#666" />
    
    {/* Score display */}
    <rect x="40" y="70" width="20" height="10" rx="2" fill="#FFF" stroke="#333" strokeWidth="1" />
    <text x="50" y="77" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#333">{score}%</text>
  </svg>
);