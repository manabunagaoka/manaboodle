// "Forgot password?" from an app's sign-in page: emails a link to set a new
// password, which brings the person back to the app afterwards. The answer
// is the same whether or not the address has an account, so the form cannot
// be used to find out who has one.
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase-server'
import { resolveSsoRequest } from '@/lib/sso-apps'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const app = await resolveSsoRequest(body.app, body.return_url)
  if (!app) {
    return NextResponse.json({ error: 'This link does not work. Go back to the app and try again.' }, { status: 400 })
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  try {
    const supabase = createServiceClient()
    // A one-time recovery code, used on our own page rather than through a
    // redirect, so it needs no redirect address set up in Supabase
    const { data, error } = await supabase.auth.admin.generateLink({ type: 'recovery', email })
    if (!error && data?.properties?.hashed_token) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.manaboodle.com'
      const resetUrl = `${siteUrl}/sso/reset?${new URLSearchParams({
        token_hash: data.properties.hashed_token,
        app: app.slug,
        return_url: body.return_url,
      })}`
      const appName = escapeHtml(app.name)
      await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: 'Manaboodle <registration@manaboodle.com>',
        to: email,
        subject: `Set a new password for ${app.name}`,
        html: `
          <p>Hello,</p>
          <p>Someone asked to set a new password for the ${appName} account with this email address.</p>
          <p><a href="${resetUrl}">Set a new password</a></p>
          <p>The link works once, for about an hour. If you did not ask, you can ignore this email, and your password stays as it is.</p>
        `,
      })
    }
  } catch (sendError) {
    console.error('Forgot password: could not send the email:', sendError)
  }
  return NextResponse.json({ ok: true })
}
