import { resolveSsoRequest } from '@/lib/sso-apps';
import SsoPage, { LinkProblem, first, homeOf } from '../SsoPage';
import ResetForm from './ResetForm';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Where the "Set a new password" email leads: a new password, then back to
// sign in to the app
export default async function Reset({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const returnUrl = first(params.return_url);
  const tokenHash = first(params.token_hash);
  const app = await resolveSsoRequest(first(params.app), returnUrl);
  if (!app || !returnUrl || !tokenHash) {
    return (
      <LinkProblem
        title="This link does not work"
        message="Ask for a new link from the sign-in page's “Forgot password?”."
      />
    );
  }
  const signInHref = `/sso/login?${new URLSearchParams({ app: app.slug, return_url: returnUrl })}`;
  const forgotHref = `/sso/forgot?${new URLSearchParams({ app: app.slug, return_url: returnUrl })}`;
  return (
    <SsoPage brand={app.name} appSlug={app.slug} home={homeOf(returnUrl)}>
      <ResetForm tokenHash={tokenHash} appName={app.name} signInHref={signInHref} forgotHref={forgotHref} />
    </SsoPage>
  );
}
