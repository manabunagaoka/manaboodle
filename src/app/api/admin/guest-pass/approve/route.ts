import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase-server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { requestId, email } = await request.json()

    console.log('Approve request received:', { requestId, email })

    if (!requestId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Try to get auth from Authorization header first, then fall back to cookies
    const authHeader = request.headers.get('authorization')
    let user: any = null
    const serviceSupabase = createServiceClient()
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const { data, error } = await serviceSupabase.auth.getUser(token)
      console.log('Auth from bearer token:', { user: data.user?.email, error: error?.message })
      if (data.user) user = data.user
    }
    
    // If no bearer token, try cookies
    if (!user) {
      const supabase = await createClient()
      const { data: { user: cookieUser }, error: authError } = await supabase.auth.getUser()
      console.log('Auth from cookies:', { user: cookieUser?.email, authError: authError?.message })
      if (cookieUser) user = cookieUser
    }
    
    if (!user) {
      console.error('No valid authentication found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser, error: adminError } = await serviceSupabase
      .from('AdminUser')
      .select('email')
      .eq('email', user.email)
      .single()

    console.log('Admin check:', { adminUser, adminError: adminError?.message })

    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden - Not an admin' }, { status: 403 })
    }

    // Update guest pass status (serviceSupabase already declared above)
    // Only update status for now - approvedBy/approvedAt fields may not exist in DB yet
    const { error: updateError } = await serviceSupabase
      .from('GuestPass')
      .update({ 
        status: 'approved'
      })
      .eq('id', requestId)

    console.log('Update result:', { updateError: updateError?.message })

    if (updateError) {
      console.error('Error updating guest pass:', updateError)
      return NextResponse.json(
        { error: 'Failed to approve request' },
        { status: 500 }
      )
    }

    // Update ManaboodleUser to grant access
    const { error: userUpdateError } = await serviceSupabase
      .from('ManaboodleUser')
      .update({ accessType: 'guest' })
      .eq('guestPassId', requestId)

    if (userUpdateError) {
      console.error('Error updating user access:', userUpdateError)
    }

    // Send approval notification email
    try {
      await resend.emails.send({
        from: 'Manaboodle Academic Portal <registration@manaboodle.com>',
        to: email,
        subject: 'Your Manaboodle Guest Access Has Been Approved',
        html: `
          <h2>Welcome to Manaboodle Academic Portal!</h2>
          <p>Your guest access request has been approved.</p>
          <p>You can now log in and access all portal features:</p>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/academic-portal/login">Log in to Academic Portal</a></p>
          <p>If you haven't verified your email yet, please check your inbox for the verification link.</p>
          <br>
          <p>Best regards,<br>Manaboodle Team</p>
        `
      })
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError)
      // Don't fail the approval if email fails
    }

    return NextResponse.json(
      { success: true, message: 'Guest pass approved successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Approve guest pass error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
