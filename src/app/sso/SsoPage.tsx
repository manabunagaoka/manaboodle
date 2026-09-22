import Link from 'next/link'
import styles from './sso.module.css'

// The frame every SSO screen shares: the app's name at the top, the content,
// and the footer with the Terms, Privacy Policy and copyright line.
export default function SsoPage({ brand, children }: { brand: string; children: React.ReactNode }) {
  return (
    <main className={styles.page}>
      <div className={styles.brand}>{brand}</div>
      {children}
      <div className={styles.spacer} />
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/sso/terms">Terms of Use</Link>
          <Link href="/sso/privacy">Privacy Policy</Link>
        </div>
        <p>© 2026 Manaboodle | hana &amp; flower. All Rights Reserved.</p>
      </footer>
    </main>
  )
}

// Shown instead of a form when the app, return address or organiser in the
// link is not allowed. No tokens are ever sent from this state.
export function LinkProblem({ title, message }: { title: string; message: string }) {
  return (
    <SsoPage brand="Manaboodle">
      <div className={styles.card}>
        <div className={styles.intro}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{message}</p>
        </div>
      </div>
    </SsoPage>
  )
}

export function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}
