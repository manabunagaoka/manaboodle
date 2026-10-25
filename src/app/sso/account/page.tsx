import { resolveSsoRequest } from '@/lib/sso-apps';
import SsoPage, { LinkProblem, first, homeOf } from '../SsoPage';
import AccountForm from './AccountForm';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// A person's Manaboodle account, opened from an app's profile page: their
// name, and their password. The app and return address are checked as on
// every SSO page, so "Back to" can only lead to a listed app.
export default async function Account({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const returnUrl = first(params.return_url);
  const app = await resolveSsoRequest(first(params.app), returnUrl);
  if (!app || !returnUrl) {
    return (
      <LinkProblem
        title="This link does not work"
        message="Go back to the app you came from and open your account from its profile page."
      />
    );
  }
  const signInHref = `/sso/login?${new URLSearchParams({ app: app.slug, return_url: returnUrl })}`;
  return (
    <SsoPage brand={app.name} appSlug={app.slug} home={homeOf(returnUrl)}>
      <AccountForm appName={app.name} returnUrl={returnUrl} signInHref={signInHref} />
    </SsoPage>
  );
}
