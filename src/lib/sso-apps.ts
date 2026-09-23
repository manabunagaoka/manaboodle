// Server-only checks for apps that sign people in through Manaboodle SSO.
// An app must be listed in the App table, and it may only send people back
// to the web addresses listed for it. See AUTH_CORE_PLAN.md, Step 1.
import { createServiceClient } from '@/lib/supabase-server'

export interface SsoApp {
  id: string
  slug: string
  name: string
  returnOrigins: string[]
  signupOpen: boolean
  approvedDomains: string[]
}

export async function getActiveApp(slug: string | null | undefined): Promise<SsoApp | null> {
  if (!slug) return null

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('App')
    .select('id, slug, name, returnOrigins, signupOpen, approvedDomains')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !data) return null
  return data as SsoApp
}

// Compares the whole origin (scheme, host and port), so a look-alike such as
// https://forks.example.com.evil.com never matches https://forks.example.com.
export function isAllowedReturnUrl(app: SsoApp, returnUrl: string | null | undefined): boolean {
  if (!returnUrl) return false

  let url: URL
  try {
    url = new URL(returnUrl)
  } catch {
    return false
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return false
  return app.returnOrigins.includes(url.origin)
}

// Returns the app only when both the app and the return address are allowed.
export async function resolveSsoRequest(
  slug: string | null | undefined,
  returnUrl: string | null | undefined
): Promise<SsoApp | null> {
  const app = await getActiveApp(slug)
  if (!app || !isAllowedReturnUrl(app, returnUrl)) return null
  return app
}
