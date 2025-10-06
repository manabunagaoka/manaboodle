import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.endsWith('.edu')) {
      return NextResponse.json(
        { error: 'Please provide a valid .edu email address' },
        { status: 400 }
      )
    }

    // Get Supabase client
    const supabase = createClient()

    // Auto-detect base URL: production, codespace, or local
    const baseUrl = process.env.NEXTAUTH_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    `http://localhost:3000`)
    
    const redirectTo = `${baseUrl}/academic-portal/reset-password`
    
    console.log('=== Password Reset Request Debug ===')
    console.log('Email:', email)
    console.log('Redirect URL:', redirectTo)
    
    // Send password reset email using Supabase Auth
    // Supabase will handle email sending, token generation, and verification
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    })

    if (error) {
      console.error('❌ Password reset error:', error)
      // Don't reveal if email exists - return success anyway for security
    } else {
      console.log('✅ Password reset email request sent to Supabase')
    }
    
    console.log('=== End Password Reset Debug ===')

    // Always return success (security best practice)
    // Don't reveal whether the email exists or not
    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with that email, a reset link has been sent',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
