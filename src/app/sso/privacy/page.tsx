import SsoPage from '../SsoPage';
import styles from '../sso.module.css';

// Placeholder until the Privacy Policy is written (AUTH_CORE_PLAN.md: legal
// terms come later). The two facts below are already true of the system.
export default function Privacy() {
  return (
    <SsoPage brand="Manaboodle">
      <div className={styles.prose}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p>The full Privacy Policy is being written and will appear on this page.</p>
        <p>
          Manaboodle only handles signing in. It keeps your name, your email address, which apps you use, and, if
          you registered through an organiser&apos;s link, which organiser that was.
        </p>
        <p>
          If you registered through an organiser, that organiser receives your name, email address and the date
          you registered. It does not see what you do in any app.
        </p>
      </div>
    </SsoPage>
  );
}
