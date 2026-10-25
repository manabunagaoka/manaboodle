'use client';

import { useState } from 'react';
import styles from '../sso.module.css';

export default function ForgotForm({
  appSlug,
  appName,
  returnUrl,
  signInHref,
}: {
  appSlug: string;
  appName: string;
  returnUrl: string;
  signInHref: string;
}) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/sso/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, app: appSlug, return_url: returnUrl }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'It could not be sent. Try again in a moment.');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'It could not be sent. Try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className={styles.card}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Check your email</h1>
          <p className={styles.subtitle}>
            If {email} has an account for {appName}, a link to set a new password is on its way. It can take a few
            minutes, so look in your spam folder too.
          </p>
        </div>
        <a className={styles.primaryLink} href={signInHref}>
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.intro}>
        <h1 className={styles.title}>Forgot your password?</h1>
        <p className={styles.subtitle}>Give the email address you sign in to {appName} with, and we will send you a link to set a new password.</p>
      </div>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      <form onSubmit={send} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="you@example.com"
            required
            disabled={busy}
          />
        </div>
        <button type="submit" disabled={busy} className={styles.primary}>
          {busy ? 'Sending…' : 'Send me a link'}
        </button>
      </form>
      <p className={styles.subtitle}>
        Remembered it? <a href={signInHref}>Sign in</a>
      </p>
    </div>
  );
}
