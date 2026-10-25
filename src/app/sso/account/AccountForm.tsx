'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import PasswordInput from '../PasswordInput';
import styles from '../sso.module.css';

// The account's name and password. It works from the Manaboodle session in
// this browser, the one made when signing in to the app. Without one, it
// asks the person to sign in again first.
export default function AccountForm({
  appName,
  returnUrl,
  signInHref,
}: {
  appName: string;
  returnUrl: string;
  signInHref: string;
}) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [name, setName] = useState('');
  const [nameNote, setNameNote] = useState('');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [passwordNote, setPasswordNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setName(String(data.session?.user.user_metadata?.name ?? data.session?.user.user_metadata?.full_name ?? ''));
    });
  }, []);

  if (session === undefined) {
    return (
      <div className={styles.card}>
        <p className={styles.subtitle}>Opening your account…</p>
      </div>
    );
  }
  if (session === null) {
    return (
      <div className={styles.card}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Sign in first</h1>
          <p className={styles.subtitle}>
            To change your account, sign in to {appName} again, then open your account from your profile.
          </p>
        </div>
        <a className={styles.primaryLink} href={signInHref}>
          Sign in to {appName}
        </a>
      </div>
    );
  }

  const user = session.user;
  // Someone who only ever signed in with Google has no Manaboodle password
  const hasPassword = (user.app_metadata?.providers ?? [user.app_metadata?.provider]).includes('email');

  const saveName = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNameNote('');
    try {
      const response = await fetch('/api/sso/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ name }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Your name could not be changed.');
      // A fresh session carries the new name to the app on its next sign-in check
      await supabase.auth.refreshSession();
      setNameNote(`Saved. ${appName} shows your new name from now on.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your name could not be changed.');
    } finally {
      setBusy(false);
    }
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setPasswordNote('');
    if (next.length < 8) return setError('Your new password needs at least 8 characters.');
    if (next !== again) return setError('The two new passwords are not the same.');
    setBusy(true);
    try {
      // The current password first, so a browser left signed in is not enough
      const { error: wrong } = await supabase.auth.signInWithPassword({ email: user.email!, password: current });
      if (wrong) throw new Error('Your current password is not right.');
      const { error: failed } = await supabase.auth.updateUser({ password: next });
      if (failed) throw new Error(failed.message || 'Your password could not be changed.');
      setCurrent('');
      setNext('');
      setAgain('');
      setPasswordNote('Your password is changed. Use the new one next time you sign in.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your password could not be changed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.intro}>
        <h1 className={styles.title}>Your account</h1>
        <p className={styles.subtitle}>
          Signed in as <strong>{user.email}</strong>. Your account is kept by Manaboodle, which {appName} uses for
          sign-in.
        </p>
      </div>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <form onSubmit={saveName} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Your name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            maxLength={120}
            required
            disabled={busy}
          />
        </div>
        {nameNote && <p className={styles.notice}>{nameNote}</p>}
        <button type="submit" disabled={busy || !name.trim()} className={styles.primary}>
          Save my name
        </button>
      </form>

      {hasPassword ? (
        <form onSubmit={savePassword} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="current" className={styles.label}>
              Current password
            </label>
            <PasswordInput id="current" value={current} onChange={setCurrent} autoComplete="current-password" disabled={busy} />
          </div>
          <div className={styles.field}>
            <label htmlFor="new" className={styles.label}>
              New password
            </label>
            <PasswordInput
              id="new"
              value={next}
              onChange={setNext}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              disabled={busy}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="again" className={styles.label}>
              New password again
            </label>
            <PasswordInput id="again" value={again} onChange={setAgain} autoComplete="new-password" disabled={busy} />
          </div>
          {passwordNote && <p className={styles.notice}>{passwordNote}</p>}
          <button type="submit" disabled={busy} className={styles.primary}>
            Change my password
          </button>
        </form>
      ) : (
        <p className={styles.notice}>You sign in with Google, so there is no Manaboodle password to change.</p>
      )}

      <p className={styles.subtitle}>
        Your email address cannot be changed here yet. <a href={returnUrl}>Back to {appName}</a>
      </p>
    </div>
  );
}
