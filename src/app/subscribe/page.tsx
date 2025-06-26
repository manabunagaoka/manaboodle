'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './subscribe.module.css';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // TODO: Integrate with email service (ConvertKit, Mailchimp, etc.)
    // Email should go to subscribe@manaboodle.com
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      <header className={styles.header}>
        <h1 className={styles.title}>Subscribe</h1>
        <p className={styles.subtitle}>
          Join the community and get notified when new articles, projects, and concepts are published. No spam, just good content delivered to your inbox.
        </p>
      </header>

      <div className={styles.dividerLine}></div>

      <section className={styles.subscribeSection}>
        <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className={styles.emailInput}
            required
            disabled={status === 'submitting'}
          />
          <button 
            type="submit" 
            className={styles.subscribeButton}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        
        {status === 'success' && (
          <div className={styles.successMessage}>
            ✨ Welcome to the Manaboodle community! Check your email to confirm your subscription.
          </div>
        )}

        <p className={styles.privacyNote}>
          By subscribing, you agree to receive newsletters from Manaboodle. You can unsubscribe at any time.
        </p>
      </section>
    </div>
  );
}