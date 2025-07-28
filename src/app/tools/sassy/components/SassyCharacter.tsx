// app/tools/sassy/components/SassyCharacter.tsx
import React from 'react';
import styles from './SassyCharacter.module.css';

interface SassyCharacterProps {
  mood: 'happy' | 'neutral' | 'thinking' | 'sassy' | 'shocked';
  score: number;
}

export default function SassyCharacter({ mood, score }: SassyCharacterProps) {
  const getBodyColor = () => {
    // Colors based on mood, not score!
    if (mood === 'happy') return '#87CEEB'; // Light blue
    if (mood === 'neutral' || mood === 'thinking' || mood === 'sassy') return '#FFD700'; // Dark yellow
    return '#FF6B6B'; // Red for shocked
  };

  // Different body shapes based on mood
  const getBodyShape = () => {
    if (mood === 'happy') {
      // Normal horizontal oval
      return <ellipse cx="60" cy="55" rx="40" ry="30" fill={getBodyColor()} />;
    } else if (mood === 'neutral' || mood === 'thinking' || mood === 'sassy') {
      // Flatter/wider shape for thinking
      return <ellipse cx="60" cy="55" rx="40" ry="25" fill={getBodyColor()} />;
    } else {
      // Taller/vertical shape for shocked
      return <ellipse cx="60" cy="55" rx="30" ry="35" fill={getBodyColor()} />;
    }
  };

  return (
    <div className={`${styles.sassyCharacter} ${styles[mood]}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body shape changes with mood */}
        {getBodyShape()}
        
        {/* Little ears on top - different for each mood */}
        <g fill={getBodyColor()}>
          {(mood === 'happy' || mood === 'sassy') && (
            <>
              {/* Normal round ears */}
              <ellipse cx="45" cy="28" rx="6" ry="8" />
              <ellipse cx="75" cy="28" rx="6" ry="8" />
            </>
          )}
          {(mood === 'neutral' || mood === 'thinking') && (
            <>
              {/* Longer round ears for thinking */}
              <ellipse cx="45" cy="26" rx="6" ry="10" />
              <ellipse cx="75" cy="26" rx="6" ry="10" />
            </>
          )}
          {mood === 'shocked' && (
            <>
              {/* Pointy ears for shocked - more integrated like cat ears */}
              <path d="M40 30 L45 15 L50 30" fill={getBodyColor()} />
              <path d="M70 30 L75 15 L80 30" fill={getBodyColor()} />
            </>
          )}
        </g>
        
        {/* Arms - curved with same color as body */}
        <g fill={getBodyColor()}>
          {/* Left arm */}
          <path d={
            mood === 'happy' ? 
              "M25 45 Q15 38 10 30 Q8 28 9 25 Q11 26 13 28 Q18 35 23 42 Q24 44 25 45" : // Raised up
            mood === 'shocked' ? 
              "M25 60 Q15 68 10 75 Q8 77 9 80 Q11 79 13 77 Q18 70 23 63 Q24 61 25 60" : // Down
              "M25 52 Q12 52 5 52 Q2 52 2 54 Q2 56 5 56 Q12 56 23 54 Q24 53 25 52" // Neutral out
          } />
          {/* Right arm */}
          <path d={
            mood === 'happy' ? 
              "M95 45 Q105 38 110 30 Q112 28 111 25 Q109 26 107 28 Q102 35 97 42 Q96 44 95 45" : // Raised up
            mood === 'shocked' ? 
              "M95 60 Q105 68 110 75 Q112 77 111 80 Q109 79 107 77 Q102 70 97 63 Q96 61 95 60" : // Down
              "M95 52 Q108 52 115 52 Q118 52 118 54 Q118 56 115 56 Q108 56 97 54 Q96 53 95 52" // Neutral out
          } />
        </g>
        
        {/* Legs - curved stubs same color as body */}
        <g fill={getBodyColor()}>
          {/* Left leg */}
          <path d="M45 80 Q44 90 43 98 Q43 101 45 101 Q47 101 47 98 Q48 90 48 80 Q47 78 45 80" />
          {/* Right leg */}
          <path d="M75 80 Q76 90 77 98 Q77 101 75 101 Q73 101 73 98 Q72 90 72 80 Q73 78 75 80" />
        </g>
        
        {/* Eyes - simple and clean */}
        {mood === 'happy' && (
          <>
            <circle cx="48" cy="50" r="3" fill="#333" />
            <circle cx="72" cy="50" r="3" fill="#333" />
          </>
        )}
        {(mood === 'neutral' || mood === 'thinking') && (
          <>
            <line x1="45" y1="50" x2="51" y2="50" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            <line x1="69" y1="50" x2="75" y2="50" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        {mood === 'sassy' && (
          <>
            <path d="M43 48 L51 48" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            <path d="M69 46 L77 46" stroke="#333" strokeWidth="3" strokeLinecap="round" transform="rotate(-10 73 46)" />
          </>
        )}
        {mood === 'shocked' && (
          <>
            <circle cx="48" cy="50" r="6" fill="white" stroke="#333" strokeWidth="2" />
            <circle cx="72" cy="50" r="6" fill="white" stroke="#333" strokeWidth="2" />
          </>
        )}
        
        {/* Mouth - clean and simple */}
        {mood === 'happy' && <path d="M50 63 Q60 68 70 63" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />}
        {(mood === 'neutral' || mood === 'thinking') && <path d="M52 65 Q60 63 68 65" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />}
        {mood === 'sassy' && <path d="M48 65 Q55 62 65 66" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />}
        {mood === 'shocked' && <ellipse cx="60" cy="65" rx="8" ry="10" fill="#333" />}
        
        {/* Only sweat drops for shocked */}
        {mood === 'shocked' && (
          <>
            <ellipse cx="25" cy="40" rx="2" ry="4" fill="#4FC3F7" opacity="0.6" />
            <ellipse cx="95" cy="40" rx="2" ry="4" fill="#4FC3F7" opacity="0.6" />
          </>
        )}
      </svg>
      
      {/* Score integrated into the design */}
      <div 
        className={styles.scoreBadge} 
        style={{ 
          backgroundColor: getBodyColor(),
          color: '#FFF',
          border: '3px solid #FFF'
        }}
      >
        {score}%
      </div>
    </div>
  );
}