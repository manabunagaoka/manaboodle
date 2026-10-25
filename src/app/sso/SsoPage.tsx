import Link from 'next/link'
import BackToApp from './BackToApp'
import styles from './sso.module.css'

// The frame every SSO screen shares: the app's name at the top, the content,
// and the footer with the Terms, Privacy Policy and copyright line. Given the
// app's home page, the name links to it and a "Back to" link sits opposite.
export default function SsoPage({
  brand,
  appSlug,
  home,
  children,
}: {
  brand: string
  // Carried into the Terms and Privacy links so those pages show the same
  // app name as the rest of the journey
  appSlug?: string
  // The app's home page, from its checked return address
  home?: string
  children: React.ReactNode
}) {
  const suffix = appSlug ? `?app=${encodeURIComponent(appSlug)}` : ''
  return (
    <main className={styles.page}>
      <div className={styles.brand}>
        {home ? (
          <a href={home} className={styles.brandLink}>
            {brand}
          </a>
        ) : (
          brand
        )}
        {home && <BackToApp home={home} appName={brand} />}
      </div>
      {children}
      <div className={styles.spacer} />
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href={`/sso/terms${suffix}`}>Terms of Use</Link>
          <Link href={`/sso/privacy${suffix}`}>Privacy Policy</Link>
        </div>
        <p>© 2026 Manaboodle. All Rights Reserved.</p>
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

// An app's home page, from a return address already checked against its list
export function homeOf(returnUrl: string) {
  return new URL('/', returnUrl).toString()
}

export function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}
