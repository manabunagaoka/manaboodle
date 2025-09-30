// app/api/test-email/route.ts
// Email testing utility to debug Resend delivery
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  console.log('🧪 Email test API called');
  
  try {
    const apiKey = process.env.RESEND_API_KEY;
    console.log('🔑 API Key present:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length || 0);
    console.log('🔑 API Key starts with re_:', apiKey?.startsWith('re_') || false);
    console.log('🔑 First 15 chars:', apiKey?.substring(0, 15) || 'NONE');
    console.log('🔑 Last 10 chars:', apiKey?.substring(-10) || 'NONE');
    console.log('🔑 All env vars containing RESEND:', Object.keys(process.env).filter(k => k.includes('RESEND')));
    
    if (!apiKey) {
      return NextResponse.json({
        error: 'RESEND_API_KEY not configured',
        success: false
      });
    }
    
    const resend = new Resend(apiKey);
    
    // Test email
    const testMsg = {
      from: 'hello@manaboodle.com',
      to: 'hello@manaboodle.com',
      subject: `🧪 Email Test - ${new Date().toISOString()}`,
      text: `This is a test email sent at ${new Date().toISOString()}.

If you receive this email, then:
✅ Resend API is working
✅ hello@manaboodle.com is properly configured
✅ Email delivery pipeline is functional

This was sent from: /api/test-email
      `,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">🧪 Email Test</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            This is a test email sent at <strong>${new Date().toISOString()}</strong>.
          </p>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0;">
            <p style="margin: 0; color: #2e7d32;">
              <strong>If you receive this email, then:</strong><br>
              ✅ Resend API is working<br>
              ✅ hello@manaboodle.com is properly configured<br>
              ✅ Email delivery pipeline is functional
            </p>
          </div>
          
          <p style="color: #999; font-size: 14px;">
            This was sent from: <code>/api/test-email</code>
          </p>
        </div>
      `,
    };
    
    console.log('📤 Sending test email...');
    console.log('📧 Email payload:', JSON.stringify(testMsg, null, 2));
    
    const result = await resend.emails.send(testMsg);
    
    console.log('✅ Test email sent!');
    console.log('   Email ID:', result.data?.id);
    console.log('   Full result:', JSON.stringify(result, null, 2));
    
    // Check if we actually got an Email ID
    if (!result.data?.id) {
      console.error('❌ WARNING: No Email ID returned!');
      console.error('   This means email was not actually sent to Resend');
    }
    
    return NextResponse.json({
      success: !!result.data?.id, // Only true if we got Email ID
      message: result.data?.id ? 'Test email sent successfully!' : 'Email send failed - no Email ID',
      emailId: result.data?.id,
      timestamp: new Date().toISOString(),
      resendResponse: result,
      checkInstructions: result.data?.id ? [
        '1. Check your hello@manaboodle.com inbox',
        '2. Check spam/junk folder', 
        '3. Go to https://resend.com/emails to see delivery status',
        '4. Wait 15-30 minutes if using DreamHost (greylisting)',
        '5. If not received, check DreamHost email configuration'
      ] : [
        'Email was not sent - check server logs for errors',
        'Verify RESEND_API_KEY is correct',
        'Check email format and Resend API limits'
      ]
    });
    
  } catch (error: any) {
    console.error('❌ Test email error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      status: error.status,
      statusCode: error.statusCode,
      cause: error.cause
    });
    
    if (error.response) {
      console.error('Resend error response:', JSON.stringify(error.response, null, 2));
    }
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        status: error.status,
        statusCode: error.statusCode
      }
    });
  }
}

export async function POST() {
  // Also allow POST for easier testing
  return GET();
}