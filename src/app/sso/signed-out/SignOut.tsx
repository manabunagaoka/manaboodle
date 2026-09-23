'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '../sso.module.css';

// Ends the Manaboodle session in this browser. Without this, an app could
// clear its own cookie while Manaboodle still signs the person straight back
// in, which looks like the sign-out did nothing.
export default function SignOut({ appName, signInHref }: { appName: string | null; signInHref: string | null }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth
      .signOut()
      .catch((err) => console.error('Sign-out failed:', err))
      .finally(() => setDone(true));
  }, []);

  if (!done) {
    return (
      <div className={styles.card}>
        <p className={styles.subtitle}>Signing you out…</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.intro}>
        <h1 className={styles.title}>You are signed out</h1>
        <p className={styles.subtitle}>
          {appName
            ? `Your Manaboodle account is signed out of ${appName} and of this browser.`
            : 'Your Manaboodle account is signed out of this browser.'}
        </p>
      </div>
      {signInHref && appName && (
        <a className={styles.primaryLink} href={signInHref}>
          Sign in to {appName} again
        </a>
      )}
    </div>
  );
}
