import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, classCode, affiliation } = body

    console.log('Registration attempt for:', email)

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

    // Use service role client (bypasses RLS)
    const supabase = createServiceClient()
    
    console.log('Creating Supabase Auth user...')

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for now to avoid email delays
      user_metadata: { name }
    })

    if (error) {
      console.error('Supabase Auth error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('Supabase user created:', data.user?.id)

    // Store Harvard-specific data in HarvardUser table using Supabase
    if (data.user) {
      try {
        const { error: dbError } = await supabase
          .from('HarvardUser')
          .insert({
            authUserId: data.user.id,
            email,
            name,
            classCode: classCode || null,
            affiliation,
          })
        
        if (dbError) {
          throw dbError
        }
        
        console.log('Harvard user profile created')
      } catch (dbError) {
        console.error('Database error creating Harvard user profile:')
        console.error('Error details:', JSON.stringify(dbError, null, 2))
        console.error('Error message:', (dbError as Error).message)
        console.error('Error stack:', (dbError as Error).stack)
        
        // If profile creation fails, delete the auth user
        await supabase.auth.admin.deleteUser(data.user.id)
        return NextResponse.json(
          { error: `Failed to create user profile: ${(dbError as Error).message}` },
          { status: 500 }
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
