'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import styles from '../sso.module.css';

// The server page has already checked that the app is listed and that
// returnUrl is one of its allowed addresses, so both props are trusted here.
interface LoginFormProps {
  appSlug: string;
  appName: string;
  returnUrl: string;
  registerHref: string | null;
}

export default function LoginForm({ appSlug, appName, returnUrl, registerHref }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(true);

  // Asks Manaboodle whether this session may use the app, then sends the
  // person back to it. Throws with a message the person can read if not.
  async function returnToApp(session: Session) {
    const response = await fetch('/api/sso/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ app: appSlug, return_url: returnUrl }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Sign-in failed');

    const redirectUrl = new URL(returnUrl);
    redirectUrl.searchParams.set('sso_token', session.access_token);
    redirectUrl.searchParams.set('sso_refresh', session.refresh_token || '');
    window.location.href = redirectUrl.toString();
  }

  // Someone already signed in to Manaboodle in this browser skips the form
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await returnToApp(session);
          return;
        }
      } catch (err) {
        // Signed in, but without access to this app: say so rather than
        // showing an empty form that would give the same answer
        if (err instanceof Error && err.message.includes('does not have access')) setError(err.message);
        else console.error('Existing session not usable:', err);
      }
      setChecking(false);
    };
    checkExistingSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Signing in here, in the browser, keeps a Manaboodle session so the
      // next app this person opens does not ask again
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !data.session) {
        const unconfirmed = signInError?.message?.toLowerCase().includes('not confirmed');
        throw new Error(
          unconfirmed
            ? 'Please confirm your email first. Open the link in the email we sent you.'
            : 'That email and password do not match. Please try again.'
        );
      }
      await returnToApp(data.session);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className={styles.card}>
        <p className={styles.subtitle}>Checking whether you are already signed in…</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.intro}>
        <h1 className={styles.title}>Sign in to {appName}</h1>
        <p className={styles.subtitle}>Use your Manaboodle account.</p>
      </div>

      {error && <div className={styles.error} role="alert">{error}</div>}

      <form onSubmit={handleLogin} className={styles.form}>
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
          <div className={styles.labelRow}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <a href="/academic-portal/forgot-password" className={styles.smallLink}>Forgot password?</a>
          </div>
          <div className={styles.passwordBox}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Your password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.showButton}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className={styles.primary}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      {registerHref && (
        <p className={styles.switch}>
          New to {appName}? <a href={registerHref}>Create an account</a>
        </p>
      )}
    </div>
  );
}
