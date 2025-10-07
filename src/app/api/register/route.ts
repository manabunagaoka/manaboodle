import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    // Use service role client for admin operations
    const supabase = createServiceClient()
    
    const body = await request.json()
    const { email, password, name, classCode, affiliation } = body

    // Validate required fields
    if (!email || !password || !name || !affiliation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate .edu email
    if (!email.endsWith('.edu')) {
      return NextResponse.json(
        { error: 'Please use a valid .edu email address' },
        { status: 400 }
      )
    }

    // Validate class code if provided
    if (classCode) {
      const validCodes = ['T565', 'T566', 'T595']
      if (!validCodes.includes(classCode.toUpperCase())) {
        return NextResponse.json(
          { error: 'Invalid class code. Valid codes: T565, T566, T595' },
          { status: 400 }
        )
      }
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Get the correct redirect URL (production or local)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    process.env.NEXTAUTH_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    'https://manaboodle.com')
    
    const redirectUrl = `${baseUrl}/api/auth/callback`

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: redirectUrl
      }
    })

    if (error) {
      console.error('Supabase signUp error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Store Harvard-specific data in your table
    if (data.user) {
      const { error: insertError } = await supabase.from('HarvardUser').insert({
        id: data.user.id,
        email,
        name,
        classCode: classCode || null,
        affiliation,
      })
      
      if (insertError) {
        console.error('HarvardUser insert error:', insertError)
        // User was created in auth.users but Harvard data failed
        // Still return success but log the error
        return NextResponse.json(
          {
            success: true,
            message: 'User registered successfully. Please check your email to confirm.',
            warning: 'Profile creation incomplete',
            user: data.user
          },
          { status: 201 }
        )
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: data.user
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    )
  }
}
