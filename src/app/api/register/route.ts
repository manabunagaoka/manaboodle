import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { randomUUID } from 'crypto'
import { Resend } from 'resend'
import crypto from 'crypto'
import VerificationEmailTemplate from '@/components/email/VerificationEmailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

// Helper function to check if email is auto-approved
function isAutoApprovedEmail(email: string): { approved: boolean; type: 'harvard' | 'sesame' | 'guest' } {
  const lowerEmail = email.toLowerCase()
  
  // Check for harvard.edu patterns: name@harvard.edu or name@school.harvard.edu
  if (lowerEmail.endsWith('@harvard.edu') || lowerEmail.includes('@') && lowerEmail.split('@')[1].endsWith('.harvard.edu')) {
    return { approved: true, type: 'harvard' }
  }
  
  // Check for sesame.org
  if (lowerEmail.endsWith('@sesame.org')) {
    return { approved: true, type: 'sesame' }
  }
  
  // All others require guest pass
  return { approved: false, type: 'guest' }
}

// Helper function to validate username format
function isValidUsername(username: string): boolean {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, username, classCode, affiliation, institution, requestReason, isGuestRequest } = body

    console.log('Registration attempt for:', email, 'Username:', username)

    // Validate required fields
    if (!email || !password || !name || !username || !affiliation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate username format
    if (!isValidUsername(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters, letters, numbers, and underscores only' },
        { status: 400 }
      )
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
    
    // Check if user already exists with this email
    const { data: existingUser } = await supabase
      .from('ManaboodleUser')
      .select('email, emailVerified')
      .eq('email', email.toLowerCase())
      .single()
    
    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please login instead.' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: 'An account with this email already exists but is not verified. Please check your email for the verification link.' },
          { status: 400 }
        )
      }
    }
    
    // Check if username already exists
    const { data: existingUsername } = await supabase
      .from('ManaboodleUser')
      .select('username')
      .eq('username', username.toLowerCase())
      .single()
    
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken. Please choose another.' },
        { status: 400 }
      )
    }

    // Check email domain for auto-approval
    const emailCheck = isAutoApprovedEmail(email)
    
    console.log('Email check result:', emailCheck)

    // Handle guest pass requests
    if (!emailCheck.approved) {
      console.log('Guest pass required for:', email)
      
      // Validate guest-specific fields
      if (!institution || !requestReason) {
        return NextResponse.json(
          { error: 'Institution and reason are required for guest access' },
          { status: 400 }
        )
      }

      if (requestReason.length < 20) {
        return NextResponse.json(
          { error: 'Please provide a more detailed reason (at least 20 characters)' },
          { status: 400 }
        )
      }

      // Create guest pass request
      const { data: guestPass, error: guestPassError } = await supabase
        .from('GuestPass')
        .insert({
          id: randomUUID(),
          email: email.toLowerCase(),
          status: 'pending',
          requestReason,
          institution,
        })
        .select()
        .single()
      
      if (guestPassError) {
        console.error('Guest pass creation error:', guestPassError)
        return NextResponse.json(
          { error: 'Failed to create guest pass request' },
          { status: 500 }
        )
      }

      console.log('Guest pass request created:', guestPass.id)

      // Create Supabase Auth user but DON'T confirm email yet
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false, // Require email verification
        user_metadata: { name, username }
      })

      if (error) {
        console.error('Supabase Auth error:', error)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      // Create user profile with guest status
      if (data.user) {
        try {
          const { error: dbError } = await supabase
            .from('ManaboodleUser')
            .insert({
              id: randomUUID(),
              authUserId: data.user.id,
              username: username.toLowerCase(),
              email: email.toLowerCase(),
              name,
              classCode: classCode || null,
              affiliation,
              accessType: 'guest',
              emailVerified: false,
              institution,
              guestPassId: guestPass.id,
            })
          
          if (dbError) {
            throw dbError
          }
          
          console.log('Guest user profile created, pending approval')
        } catch (dbError) {
          console.error('Database error:', dbError)
          await supabase.auth.admin.deleteUser(data.user.id)
          return NextResponse.json(
            { error: 'Failed to create user profile' },
            { status: 500 }
          )
        }
      }

      // TODO: Send notification email to admin about new guest request
      
      return NextResponse.json(
        {
          success: true,
          requiresApproval: true,
          message: 'Guest access request submitted successfully. You will receive an email when your request is reviewed.',
          user: data.user
        },
        { status: 201 }
      )
    }

    // Auto-approved users (Harvard or Sesame)
    console.log('Auto-approved user, creating account...', emailCheck.type)
    
    // Create Supabase Auth user with email verification required
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Require email verification
      user_metadata: { name, username }
    })

    if (error) {
      console.error('Supabase Auth error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('Supabase user created:', data.user?.id)

    // Create user profile
    if (data.user) {
      try {
        const { error: dbError } = await supabase
          .from('ManaboodleUser')
          .insert({
            id: randomUUID(),
            authUserId: data.user.id,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            name,
            classCode: classCode || null,
            affiliation,
            accessType: emailCheck.type,
            emailVerified: false, // Will be true after email verification
            institution: institution || null,
          })
        
        if (dbError) {
          throw dbError
        }
        
        console.log('User profile created successfully')

        // Send verification email
        try {
          const verificationToken = crypto.randomBytes(32).toString('hex')
          const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

          // Store verification token
          await supabase.from('EmailVerificationToken').insert({
            id: randomUUID(),
            email: email.toLowerCase(),
            token: verificationToken,
            expires: verificationExpires.toISOString(),
          })

          const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.manaboodle.com'}/api/verify-email?token=${verificationToken}`

          // Send email with Resend
          await resend.emails.send({
            from: 'Manaboodle Academic Portal <registration@manaboodle.com>',
            to: email,
            subject: 'Verify your email address - Manaboodle Academic Portal',
            react: VerificationEmailTemplate({ 
              username: username, 
              verificationUrl 
            }),
          })

          console.log('Verification email sent to:', email)
        } catch (emailError) {
          console.error('Error sending verification email:', emailError)
          // Don't fail the registration if email fails
        }
      } catch (dbError) {
        console.error('Database error:', dbError)
        await supabase.auth.admin.deleteUser(data.user.id)
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      {
        success: true,
        requiresApproval: false,
        message: 'Account created! Please check your email to verify your address.',
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
