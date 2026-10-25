'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import PasswordInput from '../PasswordInput';
import styles from '../sso.module.css';

// The one-time code from the email is used only when the new password is
// saved, so opening the link alone, or an email scanner following it,
// cannot use it up
export default function ResetForm({
  tokenHash,
  appName,
  signInHref,
  forgotHref,
}: {
  tokenHash: string;
  appName: string;
  signInHref: string;
  forgotHref: string;
}) {
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (next.length < 8) return setError('Your new password needs at least 8 characters.');
    if (next !== again) return setError('The two passwords are not the same.');
    setBusy(true);
    try {
      const { error: expired } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' });
      if (expired) throw new Error('expired');
      const { error: failed } = await supabase.auth.updateUser({ password: next });
      if (failed) throw new Error(failed.message || 'Your password could not be set.');
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message === 'expired'
          ? 'This link has expired or was already used.'
          : err instanceof Error
            ? err.message
            : 'Your password could not be set.'
      );
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className={styles.card}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Your password is set</h1>
          <p className={styles.subtitle}>You are signed in with your new password.</p>
        </div>
        <a className={styles.primaryLink} href={signInHref}>
          Continue to {appName}
        </a>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.intro}>
        <h1 className={styles.title}>Set a new password</h1>
        <p className={styles.subtitle}>For your {appName} account, kept by Manaboodle.</p>
      </div>
      {error && (
        <div className={styles.error} role="alert">
          {error}
          {error.startsWith('This link has expired') && (
            <>
              {' '}
              <a href={forgotHref}>Ask for a new link</a>.
            </>
          )}
        </div>
      )}
      <form onSubmit={save} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="new" className={styles.label}>
            New password
          </label>
          <PasswordInput id="new" value={next} onChange={setNext} autoComplete="new-password" placeholder="At least 8 characters" disabled={busy} />
        </div>
        <div className={styles.field}>
          <label htmlFor="again" className={styles.label}>
            New password again
          </label>
          <PasswordInput id="again" value={again} onChange={setAgain} autoComplete="new-password" disabled={busy} />
        </div>
        <button type="submit" disabled={busy} className={styles.primary}>
          {busy ? 'Saving…' : 'Set my password'}
        </button>
      </form>
    </div>
  );
}
