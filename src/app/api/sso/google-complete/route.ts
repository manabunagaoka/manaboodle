// Finishes a Google sign-in (AUTH_CORE_PLAN.md, Step 4). Supabase has already
// created the Auth user by the time this runs; what is missing for a first-time
// person is the Manaboodle profile, their access to the app, and the record of
// what they agreed to. Nobody gets a profile without that agreement.
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createServiceClient } from '@/lib/supabase-server'
import { resolveSsoRequest } from '@/lib/sso-apps'
import { consentText, ensureAppAccess, getActiveOrganiser } from '@/lib/sso-access'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })
    }

    const { app: slug, return_url: returnUrl, org: orgSlug, agreed } = await request.json()

    const app = await resolveSsoRequest(slug, returnUrl)
    if (!app) {
      return NextResponse.json({ error: 'This sign-in link does not work. Go back to the app and try again.' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.substring(7))
    if (authError || !user) {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('ManaboodleUser')
      .select('id')
      .eq('authUserId', user.id)
      .maybeSingle()

    if (!profile) {
      // First time with Google. Without the agreement there is nothing to
      // record, so send them to the registration page to give it.
      if (agreed !== true) {
        return NextResponse.json({ needsConsent: true }, { status: 409 })
      }

      const organiser = orgSlug ? await getActiveOrganiser(orgSlug) : null
      if (orgSlug && !organiser) {
        return NextResponse.json({ error: 'This registration link does not work.' }, { status: 400 })
      }
      if (!app.signupOpen) {
        return NextResponse.json({ error: `Registration for ${app.name} is by invitation only.` }, { status: 403 })
      }

      const metadata = user.user_metadata ?? {}
      const name = metadata.full_name || metadata.name || user.email?.split('@')[0] || 'there'

      const { error: profileError } = await supabase.from('ManaboodleUser').insert({
        id: randomUUID(),
        authUserId: user.id,
        email: user.email,
        name,
        accessType: 'member',
        // Google has already checked the address, so there is nothing to confirm
        emailVerified: true,
      })
      if (profileError) {
        console.error('Google sign-in: could not create the profile:', profileError)
        return NextResponse.json({ error: 'Could not finish creating your account. Please try again.' }, { status: 500 })
      }

      const { error: registrationError } = await supabase.from('Registration').insert({
        authUserId: user.id,
        appId: app.id,
        organiserId: organiser?.id ?? null,
        agreedText: consentText(organiser),
      })
      if (registrationError) {
        console.error('Google sign-in: could not record the registration:', registrationError)
      }
    }

    const role = await ensureAppAccess(app, user.id)
    if (!role) {
      return NextResponse.json({ error: `Your account does not have access to ${app.name}.` }, { status: 403 })
    }

    await supabase
      .from('ManaboodleUser')
      .update({ lastLoginAt: new Date().toISOString() })
      .eq('authUserId', user.id)

    return NextResponse.json({ ok: true, role })
  } catch (error) {
    console.error('Google sign-in error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
