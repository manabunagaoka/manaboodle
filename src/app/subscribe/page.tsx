'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './subscribe.module.css';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
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
            ✨ {message}
          </div>
        )}

        {status === 'error' && (
          <div className={styles.errorMessage}>
            ❌ {message}
          </div>
        )}

        <p className={styles.privacyNote}>
          By subscribing, you agree to receive newsletters from Manaboodle. You can unsubscribe at any time.
        </p>
      </section>
    </div>
  );
}