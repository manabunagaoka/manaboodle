import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.endsWith('.edu')) {
      return NextResponse.json(
        { error: 'Please provide a valid .edu email address' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.harvardUser.findUnique({
      where: { email },
    })

    // Always return success for security (don't reveal if email exists)
    // But only send email if user actually exists
    if (user) {
      // Generate secure random token
      const token = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 3600000) // 1 hour from now

      // Delete any existing reset tokens for this email
      await prisma.passwordResetToken.deleteMany({
        where: { email },
      })

      // Create new reset token
      await prisma.passwordResetToken.create({
        data: {
          email,
          token,
          expires,
        },
      })

      // Send password reset email using Resend
      // Auto-detect base URL: production, codespace, or local
      const baseUrl = process.env.NEXTAUTH_URL || 
                      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                      `http://localhost:3000`)
      const resetLink = `${baseUrl}/academic-portal/reset-password/${token}`
      
      console.log('=== Password Reset Email Debug ===')
      console.log('Attempting to send email to:', email)
      console.log('Reset link:', resetLink)
      console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY)
      console.log('Resend API Key preview:', process.env.RESEND_API_KEY?.substring(0, 10) + '...')
      
      try {
        const result = await resend.emails.send({
          from: 'Manaboodle Academic Portal <hello@manaboodle.com>',
          to: email,
          subject: 'Reset Your Manaboodle Academic Portal Password',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { text-align: center; padding: 20px; background: #A51C30; color: white; }
                  .content { padding: 30px; background: #f9f9f9; }
                  .button { display: inline-block; padding: 12px 30px; background: #A51C30; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                  .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Manaboodle Academic Portal</h1>
                  </div>
                  <div class="content">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset your Manaboodle Academic Portal password.</p>
                    <p>Click the button below to create a new password:</p>
                    <p style="text-align: center;">
                      <a href="${resetLink}" class="button">Reset Password</a>
                    </p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">${resetLink}</p>
                    <p><strong>This link will expire in 1 hour.</strong></p>
                    <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
                  </div>
                  <div class="footer">
                    <p>Manaboodle Academic Portal</p>
                    <p>This is an automated message, please do not reply.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        })
        console.log('✅ Password reset email sent successfully!')
        console.log('Resend response:', JSON.stringify(result, null, 2))
      } catch (emailError: any) {
        console.error('❌ Failed to send password reset email')
        console.error('Error details:', emailError)
        console.error('Error message:', emailError?.message)
        console.error('Error response:', emailError?.response?.data)
        // Don't throw error - continue to return success for security
      }
      console.log('=== End Email Debug ===')
    }

    // Always return success (security best practice)
    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists, a reset link has been sent',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
