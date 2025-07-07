'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from '../unsubscribe.module.css';

export default function TokenUnsubscribePage() {
  const params = useParams();
  const token = params.token as string;
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (token) {
      handleUnsubscribe();
    }
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail(data.email);
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
        {status === 'loading' && (
          <p className={styles.subtitle}>
            Processing your unsubscribe request...
          </p>
        )}
        {status === 'success' && (
          <p className={styles.subtitle}>
            You have been successfully unsubscribed from Manaboodle updates.
          </p>
        )}
        {status === 'error' && (
          <p className={styles.subtitle}>
            There was an issue processing your unsubscribe request.
          </p>
        )}
      </header>

      <div className={styles.dividerLine}></div>

      <section className={styles.unsubscribeSection}>
        {status === 'loading' && (
          <div className={styles.loadingMessage}>
            <div className={styles.spinner}></div>
            <p>Processing your request...</p>
          </div>
        )}

        {status === 'success' && (
          <div className={styles.successMessage}>
            ✅ {message}
            {email && (
              <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                Email: {email}
              </p>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className={styles.errorMessage}>
            ❌ {message}
          </div>
        )}

        <div className={styles.infoBox}>
          <h3>What this means:</h3>
          <ul>
            {status === 'success' ? (
              <>
                <li>You will no longer receive article notifications</li>
                <li>Your email has been marked as unsubscribed</li>
                <li>You can resubscribe anytime by visiting our subscribe page</li>
              </>
            ) : (
              <>
                <li>If you're still getting emails, try the manual unsubscribe form</li>
                <li>Contact us if you continue to have issues</li>
                <li>Your unsubscribe request may have already been processed</li>
              </>
            )}
          </ul>
        </div>

        <div className={styles.actionButtons}>
          <Link href="/subscribe" className={styles.resubscribeButton}>
            Want to resubscribe?
          </Link>
          <Link href="/contact" className={styles.contactButton}>
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}