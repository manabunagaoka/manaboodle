import { NextRequest, NextResponse } from 'next/server'

// Bypass email confirmation to test if Resend SMTP is causing the delay
export const maxDuration = 60

export async function POST(request: NextRequest) {
  console.log('=== REGISTRATION API CALLED (No Email Confirmation) ===')
  
  try {
    const body = await request.json()
    console.log('Request body received:', { email: body.email, name: body.name })
    const { email, password, name, classCode, affiliation } = body

    // Validate required fields
    if (!email || !password || !name || !affiliation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!email.endsWith('.edu')) {
      return NextResponse.json({ error: 'Please use a valid .edu email address' }, { status: 400 })
    }

    if (classCode) {
      const validCodes = ['T565', 'T566', 'T595']
      if (!validCodes.includes(classCode.toUpperCase())) {
        return NextResponse.json({ error: 'Invalid class code' }, { status: 400 })
      }
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Direct HTTP call to Supabase Auth API with email confirmation DISABLED
    console.log('Making direct HTTP call to Supabase Auth API...')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY!
    
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        email,
        password,
        data: { name },
        email_confirm: true,  // Auto-confirm without sending email
        // NO email_redirect_to - skip email entirely
      })
    })

    const authData = await authResponse.json()
    console.log('Supabase Auth response:', { 
      status: authResponse.status, 
      ok: authResponse.ok,
      userId: authData.user?.id 
    })

    if (!authResponse.ok) {
      console.error('Auth API error:', authData)
      return NextResponse.json({ 
        error: authData.error_description || authData.msg || 'Registration failed' 
      }, { status: authResponse.status })
    }

    // Store Harvard-specific data
    if (authData.user) {
      console.log('Inserting into HarvardUser table...')
      const dbResponse = await fetch(`${supabaseUrl}/rest/v1/HarvardUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          id: authData.user.id,
          email,
          name,
          classCode: classCode || null,
          affiliation
        })
      })

      if (!dbResponse.ok) {
        const dbError = await dbResponse.text()
        console.error('HarvardUser insert error:', dbError)
        return NextResponse.json({
          success: true,
          message: 'User registered successfully. You can now log in.',
          warning: 'Profile creation incomplete'
        }, { status: 201 })
      }
    }

    console.log('Registration successful!')
    return NextResponse.json({
      success: true,
      message: 'User registered successfully. You can now log in immediately.',
      user: authData.user
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    console.error('Error details:', {
      message: (error as Error).message,
      stack: (error as Error).stack
    })
    return NextResponse.json({ 
      error: 'Internal server error during registration',
      details: (error as Error).message
    }, { status: 500 })
  }
}
