// Server-only rules for who may use which app, and for organisers.
// See AUTH_CORE_PLAN.md, Steps 3 and 3b. Having a Manaboodle account is not
// enough: a person needs active access to the app they are signing in to.
import { createServiceClient } from '@/lib/supabase-server'
import type { SsoApp } from '@/lib/sso-apps'

export interface Organiser {
  id: string
  slug: string
  name: string
}

export async function getActiveOrganiser(slug: string | null | undefined): Promise<Organiser | null> {
  if (!slug) return null

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('Organiser')
    .select('id, slug, name')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !data) return null
  return data as Organiser
}

// The exact sentence a person agrees to when registering. It is shown next to
// the checkbox and stored with the registration, so it must be built here.
export function consentText(organiser: Organiser | null): string {
  const base = 'I agree to the Terms of Use and Privacy Policy'
  return organiser ? `${base}, and to ${organiser.name} receiving my name and email.` : `${base}.`
}

// Returns the person's role in the app, or null if they may not use it.
// Someone with no access yet is let in as a member only when the app's
// registration is open.
export async function ensureAppAccess(app: SsoApp, authUserId: string): Promise<string | null> {
  const supabase = createServiceClient()

  const { data: access } = await supabase
    .from('AppAccess')
    .select('role, status, expiresAt')
    .eq('authUserId', authUserId)
    .eq('appId', app.id)
    .maybeSingle()

  if (access) {
    if (access.status !== 'active') return null
    if (access.expiresAt && new Date(access.expiresAt) < new Date()) return null
    return access.role
  }

  if (!app.signupOpen) return null

  const { error } = await supabase
    .from('AppAccess')
    .insert({ authUserId, appId: app.id, role: 'member', status: 'active', grantedBy: 'open signup' })

  if (error) {
    console.error('Could not grant app access:', error)
    return null
  }
  return 'member'
}
