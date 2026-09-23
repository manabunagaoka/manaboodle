import { resolveSsoRequest } from '@/lib/sso-apps';
import SsoPage, { first } from '../SsoPage';
import SignOut from './SignOut';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Where an app sends someone after clearing its own sign-in. The app and
// return address are checked as everywhere else, so the "sign in again"
// button can only point at a listed app.
export default async function SignedOut({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const returnUrl = first(params.return_url);
  const app = await resolveSsoRequest(first(params.app), returnUrl);

  const signInHref =
    app && returnUrl
      ? `/sso/login?${new URLSearchParams({ app: app.slug, return_url: returnUrl })}`
      : null;

  return (
    <SsoPage brand={app?.name ?? 'Manaboodle'} appSlug={app?.slug}>
      <SignOut appName={app?.name ?? null} signInHref={signInHref} />
    </SsoPage>
  );
}
