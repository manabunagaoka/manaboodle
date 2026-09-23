'use client';

import { useEffect, useState } from 'react';
import styles from './sso.module.css';

// The Terms and Privacy pages are read mid-registration, so they need a way
// back to the form. Going back in history keeps whatever was already typed.
// Opened in a new tab (from the agreement checkbox) there is nothing to go
// back to, so the link stays hidden and the person closes the tab.
export default function BackLink() {
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  if (!canGoBack) return null;

  return (
    <button type="button" className={styles.backLink} onClick={() => window.history.back()}>
      ← Back
    </button>
  );
}
