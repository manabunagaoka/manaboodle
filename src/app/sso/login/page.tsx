import { resolveSsoRequest } from '@/lib/sso-apps';
import SsoPage, { LinkProblem, first } from '../SsoPage';
import LoginForm from './LoginForm';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Checks the app and the return address on the server before the form, or
// the automatic redirect for people already signed in, can run. An unknown
// app or an address not listed for it gets an error and no tokens.
export default async function SSOLogin({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const slug = first(params.app);
  const returnUrl = first(params.return_url);
  const org = first(params.org);

  const app = await resolveSsoRequest(slug, returnUrl);

  if (!app || !returnUrl) {
    return (
      <LinkProblem
        title="This sign-in link does not work"
        message="Go back to the app you came from and try signing in again. If it keeps happening, the app may not be set up to use Manaboodle yet."
      />
    );
  }

  // Carried through to registration so an organiser's link keeps working
  const registerParams = new URLSearchParams({ app: app.slug, return_url: returnUrl });
  if (org) registerParams.set('org', org);

  return (
    <SsoPage brand={app.name}>
      <LoginForm
        appSlug={app.slug}
        appName={app.name}
        returnUrl={returnUrl}
        registerHref={app.signupOpen ? `/sso/register?${registerParams}` : null}
      />
    </SsoPage>
  );
}
