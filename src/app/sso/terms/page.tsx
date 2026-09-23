import { getActiveApp } from '@/lib/sso-apps';
import SsoPage, { first } from '../SsoPage';
import BackLink from '../BackLink';
import styles from '../sso.module.css';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Placeholder until the Terms of Use are written (AUTH_CORE_PLAN.md: legal
// terms come later). These cover the Manaboodle account, which is the same
// whichever app sent the person here; an app's own terms live in that app.
export default async function Terms({ searchParams }: { searchParams: SearchParams }) {
  const app = await getActiveApp(first((await searchParams).app));

  return (
    <SsoPage brand={app?.name ?? 'Manaboodle'} appSlug={app?.slug}>
      <div className={styles.prose}>
        <BackLink />
        <h1 className={styles.title}>Terms of Use</h1>
        <p>
          These terms cover your Manaboodle account, which is what signs you in to
          {app ? ` ${app.name}` : ' the apps'} and to every other app made by Manaboodle and hana &amp; flower.
          {app ? ` ${app.name} has its own terms for what it does with the work you keep there.` : ''}
        </p>
        <p>The full Terms of Use are being written and will appear on this page.</p>
      </div>
    </SsoPage>
  );
}
