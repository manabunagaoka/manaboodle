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

    const supabase = createClient()

    // Verify admin access
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Auth check:', { user: user?.email, authError: authError?.message })
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser, error: adminError } = await supabase
      .from('AdminUser')
      .select('email')
      .eq('email', user.email)
      .single()

    console.log('Admin check:', { adminUser, adminError: adminError?.message })

    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden - Not an admin' }, { status: 403 })
    }

    // Use service client for database updates (needs admin privileges)
    const serviceSupabase = createServiceClient()

    // Update guest pass status
    const { error: updateError } = await serviceSupabase
      .from('GuestPass')
      .update({ 
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: user.email
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
    const { error: userUpdateError } = await supabase
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
