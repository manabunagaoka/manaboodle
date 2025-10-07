import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

// This endpoint is called by the reset password form
// Supabase Auth handles the token validation through the access_token in the URL
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

    // Get the access token from the request (Supabase includes it in the password reset link)
    const { searchParams } = new URL(request.url)
    const accessToken = searchParams.get('access_token')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Invalid or missing reset token' },
        { status: 400 }
      )
    }

    // Create a Supabase admin client
    const supabase = createServiceClient()

    // Use Supabase Auth to update the password
    // The access_token validates the user's identity
    const { data, error } = await supabase.auth.admin.updateUserById(
      accessToken,
      { password }
    )

    if (error) {
      console.error('Supabase password update error:', error)
      return NextResponse.json(
        { error: 'Failed to reset password. Please try requesting a new reset link.' },
        { status: 400 }
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
