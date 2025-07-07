'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './unsubscribe.module.css';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/unsubscribe', {
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
        <h1 className={styles.title}>Unsubscribe</h1>
        <p className={styles.subtitle}>
          Sorry to see you go! Enter your email address below to unsubscribe from Manaboodle updates.
        </p>
      </header>

      <div className={styles.dividerLine}></div>

      <section className={styles.unsubscribeSection}>
        <form onSubmit={handleUnsubscribe} className={styles.unsubscribeForm}>
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
            className={styles.unsubscribeButton}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Unsubscribing...' : 'Unsubscribe'}
          </button>
        </form>
        
        {status === 'success' && (
          <div className={styles.successMessage}>
            ✅ {message}
          </div>
        )}

        {status === 'error' && (
          <div className={styles.errorMessage}>
            ❌ {message}
          </div>
        )}

        <div className={styles.infoBox}>
          <h3>What happens when you unsubscribe?</h3>
          <ul>
            <li>You'll stop receiving article notifications</li>
            <li>Your email will be marked as unsubscribed</li>
            <li>You can resubscribe anytime by visiting our subscribe page</li>
          </ul>
        </div>

        <p className={styles.contactNote}>
          Having trouble? <a href="/contact" className={styles.contactLink}>Contact us</a> for help.
        </p>
      </section>
    </div>
  );
}