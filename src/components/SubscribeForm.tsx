'use client';

import { useState } from 'react';
import styles from './SubscribeForm.module.css';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
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
      <div className={styles.header}>
        <h3 className={styles.title}>📬 Get Article Updates</h3>
        <p className={styles.description}>
          Subscribe to get notified whenever I publish new articles and insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className={styles.input}
            required
            disabled={status === 'submitting'}
          />
          <button 
            type="submit" 
            className={styles.button}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

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
      </form>

      <p className={styles.privacy}>
        No spam, ever. Unsubscribe anytime with one click.
      </p>
    </div>
  );
}