import { getActiveApp } from '@/lib/sso-apps';
import SsoPage, { first } from '../SsoPage';
import BackLink from '../BackLink';
import styles from '../sso.module.css';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Placeholder until the Privacy Policy is written (AUTH_CORE_PLAN.md: legal
// terms come later). It covers the account only. What each app collects is
// that app's own business and its own notice.
export default async function Privacy({ searchParams }: { searchParams: SearchParams }) {
  const app = await getActiveApp(first((await searchParams).app));

  return (
    <SsoPage brand={app?.name ?? 'Manaboodle'} appSlug={app?.slug}>
      <div className={styles.prose}>
        <BackLink />
        <h1 className={styles.title}>Privacy Policy</h1>
        <p>
          This policy covers your Manaboodle account. Manaboodle only handles signing in. It keeps your name, your
          email address, which apps you use, and, if you registered through an organiser&apos;s link, which
          organiser that was.
        </p>
        <p>
          If you registered through an organiser, that organiser receives your name, email address and the date you
          registered. It does not see what you do in any app.
        </p>
        <p>
          {app
            ? `What you do inside ${app.name}, and anything you keep there, is covered by ${app.name}'s own privacy notice.`
            : 'What you do inside an app, and anything you keep there, is covered by that app’s own privacy notice.'}
        </p>
        <p>The full Privacy Policy is being written and will appear on this page.</p>
      </div>
    </SsoPage>
  );
}
