import { resolveSsoRequest } from '@/lib/sso-apps';
import SsoPage, { LinkProblem, first } from '../SsoPage';
import styles from '../sso.module.css';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const PROBLEMS: Record<string, { title: string; message: string }> = {
  used: {
    title: 'This link was already used',
    message: 'Your email is already confirmed. Go back to the app and sign in.',
  },
  expired: {
    title: 'This link has expired',
    message: 'Confirmation links work for 24 hours. Go back to the app and register again, or ask for help.',
  },
  invalid: {
    title: 'This link does not work',
    message: 'Check that you opened the whole link from the email, or go back to the app and try again.',
  },
  failed: {
    title: 'Something went wrong',
    message: 'We could not confirm your email. Please open the link again in a few minutes.',
  },
};

// Where the confirmation email's link lands (via /api/sso/confirm-email)
export default async function SSOConfirmed({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const problem = first(params.error);
  if (problem) {
    const { title, message } = PROBLEMS[problem] ?? PROBLEMS.invalid;
    return <LinkProblem title={title} message={message} />;
  }

  // The app and return address come from the stored token, but are checked
  // again before this page links to them
  const returnUrl = first(params.return_url);
  const app = await resolveSsoRequest(first(params.app), returnUrl);

  return (
    <SsoPage brand={app?.name ?? 'Manaboodle'} appSlug={app?.slug}>
      <div className={styles.card}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Your email is confirmed</h1>
          <p className={styles.subtitle}>
            {app ? `You can now sign in to ${app.name}.` : 'You can now sign in from the app you were using.'}
          </p>
        </div>
        {app && returnUrl && (
          <a
            className={styles.primaryLink}
            href={`/sso/login?${new URLSearchParams({ app: app.slug, return_url: returnUrl })}`}
          >
            Sign in to {app.name}
          </a>
        )}
      </div>
    </SsoPage>
  );
}
