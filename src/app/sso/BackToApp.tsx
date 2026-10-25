'use client'

import styles from './sso.module.css'

// The way out of a sign-in or registration page, back to the app the person
// came from. If they came straight from that app, it goes back one step, to
// the very page they left (For facilitators, say). Otherwise, for example
// from a link in an email, it goes to the app's home page. A page of its own
// rather than a box over the app: browsers and Google refuse sign-in forms
// shown inside another site's page.
//
// After signing out, it always goes to the home page: the page they left is
// usually one that needs them signed in.
export default function BackToApp({ home, appName, toHome = false }: { home: string; appName: string; toHome?: boolean }) {
  const back = (event: React.MouseEvent) => {
    if (toHome) return
    try {
      const cameFromApp = document.referrer && new URL(document.referrer).origin === new URL(home).origin
      if (cameFromApp && window.history.length > 1) {
        event.preventDefault()
        window.history.back()
      }
    } catch {
      // A referrer that is not an address: the link's own home page is used
    }
  }
  return (
    <a href={home} onClick={back} className={styles.backToApp} title={`Back to ${appName}`}>
      <span aria-hidden="true" className={styles.backX}>×</span>
      <span>Back to {appName}</span>
    </a>
  )
}
