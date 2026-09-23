// Called by the SSO login page after the person has a Manaboodle session,
// either from signing in just now or from an earlier visit. Confirms that the
// app and return address are allowed and that the person may use the app.
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { resolveSsoRequest } from '@/lib/sso-apps'
import { ensureAppAccess } from '@/lib/sso-access'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })
    }

    const { app: slug, return_url: returnUrl } = await request.json()
    const app = await resolveSsoRequest(slug, returnUrl)
    if (!app) {
      return NextResponse.json({ error: 'This sign-in link does not work. Go back to the app and try again.' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.substring(7))
    if (authError || !user) {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })
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
    console.error('SSO check error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
