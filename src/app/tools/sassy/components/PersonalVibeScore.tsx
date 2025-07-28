// app/tools/sassy/components/PersonalVibeScore.tsx
import React from 'react';
import styles from './PersonalVibeScore.module.css';

interface PersonalVibeScoreProps {
  score: number;
  feedback: string;
  warnings: string[];
}

export default function PersonalVibeScore({ score, feedback, warnings }: PersonalVibeScoreProps) {
  const getScoreColor = () => {
    if (score >= 80) return '#4ECDC4';
    if (score >= 60) return '#44B3AB';
    if (score >= 40) return '#FFB347';
    if (score >= 20) return '#FF6B35';
    return '#E85D30';
  };

  return (
    <div className={styles.vibeScoreSection}>
      {/* Sassy's Feedback Box */}
      <div className={styles.feedbackBox} style={{ borderColor: getScoreColor() }}>
        <div className={styles.feedbackHeader}>
          <span className={styles.feedbackTitle}>SASSY SAYS</span>
        </div>
        
        <p className={styles.feedbackText}>{feedback}</p>
        
        {warnings.length > 0 && (
          <div className={styles.warningsList}>
            {warnings.map((warning, index) => (
              <p key={index} className={styles.warningItem}>
                • {warning}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}