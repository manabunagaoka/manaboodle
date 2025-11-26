// app/api/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { randomUUID } from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/academic-portal/login?error=missing_token', request.url))
    }

    const supabase = createServiceClient()

    // Find the verification token
    const { data: verificationRecord, error: tokenError } = await supabase
      .from('EmailVerificationToken')
      .select('*')
      .eq('token', token)
      .single()

    if (tokenError || !verificationRecord) {
      return NextResponse.redirect(new URL('/academic-portal/login?error=invalid_token', request.url))
    }

    // Check if token is expired
    if (new Date(verificationRecord.expires) < new Date()) {
      return NextResponse.redirect(new URL('/academic-portal/login?error=expired_token', request.url))
    }

    // Check if already used
    if (verificationRecord.used) {
      return NextResponse.redirect(new URL('/academic-portal/login?error=token_already_used', request.url))
    }

    // Update user as verified
    const { error: updateError } = await supabase
      .from('ManaboodleUser')
      .update({ emailVerified: true })
      .eq('email', verificationRecord.email)

    if (updateError) {
      console.error('Error updating user verification status:', updateError)
      return NextResponse.redirect(new URL('/academic-portal/login?error=verification_failed', request.url))
    }

    // Mark token as used
    await supabase
      .from('EmailVerificationToken')
      .update({ used: true, usedAt: new Date().toISOString() })
      .eq('token', token)

    // Mark email as confirmed in Supabase Auth
    const { data: user } = await supabase
      .from('ManaboodleUser')
      .select('authUserId')
      .eq('email', verificationRecord.email)
      .single()

    if (user) {
      await supabase.auth.admin.updateUserById(user.authUserId, {
        email_confirm: true
      })
    }

    return NextResponse.redirect(new URL('/academic-portal/login?verified=true', request.url))
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(new URL('/academic-portal/login?error=server_error', request.url))
  }
}
