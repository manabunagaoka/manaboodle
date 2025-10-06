import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// Note: With Supabase Auth, password reset is handled differently
// Token validation happens on the client side when user clicks the reset link
// This endpoint is kept for backward compatibility but redirects to Supabase flow

// Validate token - This is now handled by Supabase Auth
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'No token provided. Please use the reset link from your email.' },
        { status: 400 }
      )
    }

    // With Supabase Auth, token validation happens when exchanging the code
    // We just return valid=true and let the frontend handle it
    return NextResponse.json({ 
      valid: true,
      message: 'Please set your new password' 
    }, { status: 200 })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { valid: false, error: 'An error occurred' },
      { status: 500 }
    )
  }
}

// Reset password - Use Supabase Auth
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Get Supabase client
    const supabase = createClient()

    // Update password for currently authenticated user
    // (User must be authenticated via the reset token link)
    const { data, error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      console.error('Password update error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to reset password' },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'No authenticated user found. Please use the reset link from your email.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
