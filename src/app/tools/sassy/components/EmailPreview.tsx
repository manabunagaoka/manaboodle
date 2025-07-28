// app/tools/sassy/components/EmailPreview.tsx
import React from 'react';
import styles from './EmailPreview.module.css';

interface EmailPreviewProps {
  subject: string;
  content: string;
}

export default function EmailPreview({ subject, content }: EmailPreviewProps) {
  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <h3 className={styles.previewTitle}>📧 Email Preview</h3>
        <span className={styles.previewHint}>This is how your update will look</span>
      </div>
      
      <div className={styles.emailFrame}>
        <div className={styles.emailHeader}>
          <div className={styles.emailMeta}>
            <span className={styles.emailFrom}>From: You ✨</span>
            <span className={styles.emailTo}>To: Your awesome subscribers</span>
          </div>
          <div className={styles.emailSubject}>
            {subject || 'Your subject line will appear here...'}
          </div>
        </div>
        
        <div className={styles.emailBody}>
          <div className={styles.emailContent}>
            {content ? (
              content.split('\n').map((paragraph, index) => (
                <p key={index} className={styles.emailParagraph}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p className={styles.emailPlaceholder}>
                Your update content will appear here...
              </p>
            )}
          </div>
          
          <div className={styles.emailFooter}>
            <div className={styles.sassyBadge}>
              <span className={styles.badgeIcon}>✉️</span>
              <div className={styles.badgeText}>
                <strong>Created with Sassy</strong>
                <span>Anti-Newsletter Companion</span>
              </div>
            </div>
            <p className={styles.sassyLink}>
              Write personal updates at{' '}
              <a href="https://manaboodle.com/tools/sassy" target="_blank" rel="noopener noreferrer">
                manaboodle.com/tools/sassy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}