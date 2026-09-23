'use client';

import { useState } from 'react';
import styles from '../sso.module.css';

interface RegisterFormProps {
  appSlug: string;
  appName: string;
  returnUrl: string;
  organiserSlug: string | null;
  organiserName: string | null;
  // The exact sentence stored with the registration, built on the server
  agreement: string;
  loginHref: string;
}

const POLICY = 'Privacy Policy';

export default function RegisterForm(props: RegisterFormProps) {
  const { appSlug, appName, returnUrl, organiserSlug, organiserName, agreement, loginHref } = props;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  // Shows the stored sentence with its two documents as links; the words
  // themselves stay exactly as the server built them
  const afterPolicy = agreement.slice(agreement.indexOf(POLICY) + POLICY.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agree) {
      setError('Please tick the box to agree before creating your account.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/sso/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          agree,
          website,
          app: appSlug,
          return_url: returnUrl,
          org: organiserSlug,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create your account.');
      setSentTo(email.trim());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not create your account.');
    } finally {
      setLoading(false);
    }
  };

  if (sentTo) {
    return (
      <div className={styles.card}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Check your email</h1>
          <p className={styles.subtitle}>
            We sent a link to <strong>{sentTo}</strong>. Open it to confirm your address, then sign in to {appName}.
          </p>
        </div>
        <p className={styles.note}>If it has not arrived in a few minutes, look in your spam folder.</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.intro}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>You need an account to use {appName}.</p>
      </div>

      {organiserName && (
        <div className={styles.notice}>
          You are registering through <strong>{organiserName}</strong>. They will receive your name and email.
        </div>
      )}

      {error && <div className={styles.error} role="alert">{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Your name</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            placeholder="Your name"
            required
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="At least 8 characters"
            required
            disabled={loading}
          />
        </div>

        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className={styles.agree}>
          <input
            id="agree"
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="agree">
            I agree to the <a href="/sso/terms" target="_blank">Terms of Use</a> and{' '}
            <a href="/sso/privacy" target="_blank">Privacy Policy</a>{afterPolicy}
          </label>
        </div>

        <button type="submit" disabled={loading} className={styles.primary}>
          {loading ? 'Creating your account…' : 'Create account'}
        </button>
      </form>

      <p className={styles.note}>We will send you an email to confirm your address before you can sign in.</p>
      <p className={styles.switch}>
        Already have an account? <a href={loginHref}>Sign in</a>
      </p>
    </div>
  );
}
