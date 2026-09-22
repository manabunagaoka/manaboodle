import { resolveSsoRequest } from '@/lib/sso-apps';
import { consentText, getActiveOrganiser } from '@/lib/sso-access';
import SsoPage, { LinkProblem, first } from '../SsoPage';
import RegisterForm from './RegisterForm';
import styles from '../sso.module.css';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Registration for one app, optionally through an organiser's link
// (?org=mangrove). The app, return address and organiser are all checked here.
export default async function SSORegister({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const slug = first(params.app);
  const returnUrl = first(params.return_url);
  const orgSlug = first(params.org);

  const app = await resolveSsoRequest(slug, returnUrl);
  if (!app || !returnUrl) {
    return (
      <LinkProblem
        title="This registration link does not work"
        message="Go back to the app you came from and try again. If it keeps happening, the app may not be set up to use Manaboodle yet."
      />
    );
  }

  const organiser = orgSlug ? await getActiveOrganiser(orgSlug) : null;
  if (orgSlug && !organiser) {
    return (
      <LinkProblem
        title="This registration link does not work"
        message="Ask the person who sent it to you for a new link."
      />
    );
  }

  const loginParams = new URLSearchParams({ app: app.slug, return_url: returnUrl });
  if (organiser) loginParams.set('org', organiser.slug);
  const loginHref = `/sso/login?${loginParams}`;

  if (!app.signupOpen) {
    return (
      <SsoPage brand={app.name}>
        <div className={styles.card}>
          <div className={styles.intro}>
            <h1 className={styles.title}>Registration is by invitation</h1>
            <p className={styles.subtitle}>
              {app.name} is open to invited people only. If you already have an account, <a href={loginHref}>sign in</a>.
            </p>
          </div>
        </div>
      </SsoPage>
    );
  }

  return (
    <SsoPage brand={app.name}>
      <RegisterForm
        appSlug={app.slug}
        appName={app.name}
        returnUrl={returnUrl}
        organiserSlug={organiser?.slug ?? null}
        organiserName={organiser?.name ?? null}
        agreement={consentText(organiser)}
        loginHref={loginHref}
      />
    </SsoPage>
  );
}
