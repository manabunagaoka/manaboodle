// The link in the confirmation email sent by /api/sso/register. Marks the
// address as confirmed in Supabase Auth and ManaboodleUser, then shows the
// confirmed page with a way back to the app the person registered for.
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const done = (params: Record<string, string>) => {
    const url = new URL('/sso/confirmed', request.url)
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
    return NextResponse.redirect(url)
  }

  try {
    const token = request.nextUrl.searchParams.get('token')
    if (!token) return done({ error: 'invalid' })

    const supabase = createServiceClient()

    const { data: record } = await supabase
      .from('EmailVerificationToken')
      .select('email, expires, used, appSlug, returnUrl')
      .eq('token', token)
      .maybeSingle()

    if (!record) return done({ error: 'invalid' })
    if (record.used) return done({ error: 'used' })
    if (new Date(record.expires) < new Date()) return done({ error: 'expired' })

    const { data: user } = await supabase
      .from('ManaboodleUser')
      .select('authUserId')
      .eq('email', record.email)
      .maybeSingle()

    if (!user) return done({ error: 'invalid' })

    const { error: authError } = await supabase.auth.admin.updateUserById(user.authUserId, { email_confirm: true })
    if (authError) {
      console.error('SSO confirm: Supabase Auth error:', authError)
      return done({ error: 'failed' })
    }

    await supabase.from('ManaboodleUser').update({ emailVerified: true }).eq('email', record.email)
    await supabase
      .from('EmailVerificationToken')
      .update({ used: true, usedAt: new Date().toISOString() })
      .eq('token', token)

    // The confirmed page checks app and return_url again before linking to them
    const params: Record<string, string> = {}
    if (record.appSlug) params.app = record.appSlug
    if (record.returnUrl) params.return_url = record.returnUrl
    return done(params)
  } catch (error) {
    console.error('SSO confirm error:', error)
    return done({ error: 'failed' })
  }
}
