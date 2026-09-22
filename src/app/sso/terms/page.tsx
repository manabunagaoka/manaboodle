import SsoPage from '../SsoPage';
import styles from '../sso.module.css';

// Placeholder until the Terms of Use are written (AUTH_CORE_PLAN.md: legal
// terms come later). Linked from every SSO screen and the registration box.
export default function Terms() {
  return (
    <SsoPage brand="Manaboodle">
      <div className={styles.prose}>
        <h1 className={styles.title}>Terms of Use</h1>
        <p>The full Terms of Use are being written and will appear on this page.</p>
        <p>
          Manaboodle provides the sign-in for apps made by Manaboodle and hana &amp; flower. Each app has its own
          purpose and keeps its own data.
        </p>
      </div>
    </SsoPage>
  );
}
