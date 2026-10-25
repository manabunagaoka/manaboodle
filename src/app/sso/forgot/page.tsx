import { resolveSsoRequest } from '@/lib/sso-apps';
import SsoPage, { LinkProblem, first, homeOf } from '../SsoPage';
import ForgotForm from './ForgotForm';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// "Forgot password?" from an app's sign-in page: the person gives their
// email address and is sent a link to set a new password
export default async function Forgot({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const returnUrl = first(params.return_url);
  const app = await resolveSsoRequest(first(params.app), returnUrl);
  if (!app || !returnUrl) {
    return (
      <LinkProblem
        title="This link does not work"
        message="Go back to the app you came from and try signing in again."
      />
    );
  }
  const signInHref = `/sso/login?${new URLSearchParams({ app: app.slug, return_url: returnUrl })}`;
  return (
    <SsoPage brand={app.name} appSlug={app.slug} home={homeOf(returnUrl)}>
      <ForgotForm appSlug={app.slug} appName={app.name} returnUrl={returnUrl} signInHref={signInHref} />
    </SsoPage>
  );
}
