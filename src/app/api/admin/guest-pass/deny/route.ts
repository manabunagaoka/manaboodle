import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase-server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { requestId, email } = await request.json()

    console.log('Deny request received:', { requestId, email })

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
      const supabase = createClient()
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
    const { error: updateError } = await serviceSupabase
      .from('GuestPass')
      .update({ 
        status: 'denied',
        deniedAt: new Date().toISOString(),
        deniedBy: user.email
      })
      .eq('id', requestId)

    console.log('Update result:', { updateError: updateError?.message })

    if (updateError) {
      console.error('Error updating guest pass:', updateError)
      return NextResponse.json(
        { error: 'Failed to deny request' },
        { status: 500 }
      )
    }

    // Send denial notification email
    try {
      await resend.emails.send({
        from: 'Manaboodle Academic Portal <registration@manaboodle.com>',
        to: email,
        subject: 'Manaboodle Guest Access Request Update',
        html: `
          <h2>Guest Access Request Status</h2>
          <p>Thank you for your interest in Manaboodle Academic Portal.</p>
          <p>After review, we are unable to approve your guest access request at this time.</p>
          <p>If you have questions or would like to provide additional information, please reply to this email.</p>
          <br>
          <p>Best regards,<br>Manaboodle Team</p>
        `
      })
    } catch (emailError) {
      console.error('Failed to send denial email:', emailError)
      // Don't fail the denial if email fails
    }

    return NextResponse.json(
      { success: true, message: 'Guest pass request denied' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Deny guest pass error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
