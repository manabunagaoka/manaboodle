import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { requestId, email } = await request.json()

    if (!requestId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('AdminUser')
      .select('email')
      .eq('email', user.email)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update guest pass status
    const { error: updateError } = await supabase
      .from('GuestPass')
      .update({ 
        status: 'denied',
        deniedAt: new Date().toISOString(),
        deniedBy: user.email
      })
      .eq('id', requestId)

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
