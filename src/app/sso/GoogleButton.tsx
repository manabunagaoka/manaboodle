'use client';

import { useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import styles from './sso.module.css';

// Google's own sign-in button, drawn by Google's script on this page. Asking
// Google from manaboodle.com rather than sending people to Supabase means the
// Google screen says "Sign in to manaboodle.com" and carries the Manaboodle
// branding, instead of naming the Supabase project.
//
// Google hands back a signed token, Supabase accepts that token as a sign-in,
// and /api/sso/google-complete then records the account and checks access.

interface GoogleIdApi {
  accounts: {
    id: {
      initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; nonce: string }) => void;
      renderButton: (parent: HTMLElement, options: Record<string, string | number>) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdApi;
  }
}

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

// Google is given the hash; Supabase is given the original. That pairing is
// what stops a token collected elsewhere from being replayed here.
async function makeNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const raw = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hashed = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return { raw, hashed };
}

export default function GoogleButton({
  appSlug,
  returnUrl,
  org,
  agreed,
  disabled,
  onError,
}: {
  appSlug: string;
  returnUrl: string;
  org: string | null;
  // Set when the person has ticked the agreement, so a first-time account can
  // be recorded; without it they are asked to agree first
  agreed?: boolean;
  disabled?: boolean;
  onError: (message: string) => void;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const nonceRef = useRef('');
  const [busy, setBusy] = useState(false);
  // Read inside Google's callback, which is registered once
  const latest = useRef({ agreed, org });
  latest.current = { agreed, org };

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set, so the Google button is not shown');
      return;
    }

    let cancelled = false;

    const handleCredential = async (response: { credential: string }) => {
      setBusy(true);
      try {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
          nonce: nonceRef.current,
        });
        if (error || !data.session) throw new Error(error?.message || 'Google did not sign you in.');
        await finishSignIn(data.session);
      } catch (err: unknown) {
        setBusy(false);
        onError(err instanceof Error ? err.message : 'Google sign-in failed.');
      }
    };

    const finishSignIn = async (session: Session) => {
      const result = await fetch('/api/sso/google-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          app: appSlug,
          return_url: returnUrl,
          org: latest.current.org,
          agreed: latest.current.agreed === true,
        }),
      });
      const body = await result.json();

      // New here: they must agree before an account is recorded
      if (result.status === 409 && body.needsConsent) {
        const params = new URLSearchParams({ app: appSlug, return_url: returnUrl, google: '1' });
        if (latest.current.org) params.set('org', latest.current.org);
        window.location.href = `/sso/register?${params}`;
        return;
      }
      if (!result.ok) throw new Error(body.error || 'Sign-in failed');

      const redirectUrl = new URL(returnUrl);
      redirectUrl.searchParams.set('sso_token', session.access_token);
      redirectUrl.searchParams.set('sso_refresh', session.refresh_token || '');
      window.location.href = redirectUrl.toString();
    };

    const draw = async () => {
      const { raw, hashed } = await makeNonce();
      if (cancelled || !window.google || !holder.current) return;
      nonceRef.current = raw;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredential,
        nonce: hashed,
      });
      window.google.accounts.id.renderButton(holder.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'center',
        width: 320,
      });
    };

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing && window.google) {
      draw();
    } else if (existing) {
      existing.addEventListener('load', draw);
    } else {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = draw;
      script.onerror = () => onError('Google sign-in could not be loaded.');
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.googleBlock}>
      <div
        ref={holder}
        className={styles.googleHolder}
        // Google draws its own button, so the agreement is enforced by
        // covering it rather than by a disabled attribute
        style={disabled || busy ? { opacity: 0.45, pointerEvents: 'none' } : undefined}
      />
      {busy && <p className={styles.note}>Signing you in…</p>}
    </div>
  );
}

export function OrDivider() {
  return (
    <div className={styles.divider}>
      <span className={styles.dividerLine} />
      <span>or</span>
      <span className={styles.dividerLine} />
    </div>
  );
}
