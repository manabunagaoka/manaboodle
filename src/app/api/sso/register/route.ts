// Registration through the SSO pages (AUTH_CORE_PLAN.md, Steps 3b and 4).
// Creates the Supabase Auth user, the ManaboodleUser profile, access to the
// app, and a Registration row recording the organiser and the wording agreed
// to. The account cannot sign in until the email address is confirmed.
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID, randomBytes } from 'crypto'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase-server'
import { resolveSsoRequest } from '@/lib/sso-apps'
import { consentText, getActiveOrganiser } from '@/lib/sso-access'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { app: slug, return_url: returnUrl, org: orgSlug, agree, website } = body
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    // Honeypot: a hidden field people never see. Bots that fill it get a
    // normal-looking answer and nothing is created or sent.
    if (website) {
      return NextResponse.json({ success: true }, { status: 201 })
    }

    const app = await resolveSsoRequest(slug, returnUrl)
    if (!app) {
      return NextResponse.json({ error: 'This sign-in link does not work. Go back to the app and try again.' }, { status: 400 })
    }
    if (!app.signupOpen) {
      return NextResponse.json({ error: `Registration for ${app.name} is by invitation only.` }, { status: 403 })
    }

    const organiser = orgSlug ? await getActiveOrganiser(orgSlug) : null
    if (orgSlug && !organiser) {
      return NextResponse.json({ error: 'This registration link does not work. Ask the person who sent it for a new one.' }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
    }
    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Your password needs at least 8 characters.' }, { status: 400 })
    }
    if (agree !== true) {
      return NextResponse.json({ error: 'Please tick the box to agree before creating your account.' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: existing } = await supabase
      .from('ManaboodleUser')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Sign in instead.' },
        { status: 409 }
      )
    }

    const { data: created, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { name },
    })

    if (authError || !created.user) {
      console.error('SSO register: Supabase Auth error:', authError)
      const exists = authError?.message?.toLowerCase().includes('already')
      return NextResponse.json(
        { error: exists ? 'An account with this email already exists. Sign in instead.' : 'Could not create your account. Please try again.' },
        { status: exists ? 409 : 400 }
      )
    }

    const authUserId = created.user.id
    const profileId = randomUUID()

    try {
      const { error: profileError } = await supabase.from('ManaboodleUser').insert({
        id: profileId,
        authUserId,
        email,
        name,
        accessType: 'member',
        emailVerified: false,
      })
      if (profileError) throw profileError

      const { error: accessError } = await supabase.from('AppAccess').insert({
        authUserId,
        appId: app.id,
        role: 'member',
        status: 'active',
        grantedBy: organiser ? `registration via ${organiser.slug}` : 'registration',
      })
      if (accessError) throw accessError

      const { error: registrationError } = await supabase.from('Registration').insert({
        authUserId,
        appId: app.id,
        organiserId: organiser?.id ?? null,
        agreedText: consentText(organiser),
      })
      if (registrationError) throw registrationError
    } catch (dbError) {
      console.error('SSO register: database error:', dbError)
      // Deleting the auth user removes AppAccess and Registration with it
      await supabase.from('ManaboodleUser').delete().eq('id', profileId)
      await supabase.auth.admin.deleteUser(authUserId)
      return NextResponse.json({ error: 'Could not create your account. Please try again.' }, { status: 500 })
    }

    try {
      const token = randomBytes(32).toString('hex')
      await supabase.from('EmailVerificationToken').insert({
        id: randomUUID(),
        email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        appSlug: app.slug,
        returnUrl,
      })

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.manaboodle.com'
      const confirmUrl = `${siteUrl}/api/sso/confirm-email?token=${token}`
      const appName = escapeHtml(app.name)

      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Manaboodle <registration@manaboodle.com>',
        to: email,
        subject: `Confirm your email for ${app.name}`,
        html: `
          <p>Hello ${escapeHtml(name)},</p>
          <p>Please confirm your email address to finish creating your account for ${appName}.</p>
          <p><a href="${confirmUrl}">Confirm my email</a></p>
          <p>The link works for 24 hours. If you did not create this account, you can ignore this email.</p>
        `,
      })
    } catch (emailError) {
      // The account exists; the person can ask for a new email later
      console.error('SSO register: confirmation email failed:', emailError)
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('SSO register error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
