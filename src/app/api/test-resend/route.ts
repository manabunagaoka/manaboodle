import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  console.log('🧪 Test Resend route called');
  
  try {
    // Environment variable debugging
    const apiKey = process.env.RESEND_API_KEY;
    console.log('🔑 API Key present:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length || 0);
    
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY is not set!');
      return NextResponse.json(
        { error: 'RESEND_API_KEY not configured' },
        { status: 500 }
      );
    }
    
    // Initialize Resend
    console.log('🚀 Initializing Resend client...');
    const resend = new Resend(apiKey);
    
    // Get test email from request body
    const body = await request.json();
    const { testEmail } = body;
    
    if (!testEmail) {
      return NextResponse.json(
        { error: 'testEmail is required in request body' },
        { status: 400 }
      );
    }
    
    console.log('📧 Sending test email to:', testEmail);
    
    // Send test email
    const result = await resend.emails.send({
      from: 'hello@manaboodle.com',
      to: [testEmail],
      subject: '🧪 Resend Test Email from Manaboodle',
      text: `This is a test email to verify Resend integration.

Sent at: ${new Date().toISOString()}
Environment: ${process.env.NODE_ENV}
From: Manaboodle Test Route`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">🧪 Resend Test Email</h2>
          <p style="color: #666;">This is a test email to verify Resend integration is working correctly.</p>
          
          <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Test Details:</strong><br>
            Sent at: ${new Date().toISOString()}<br>
            Environment: ${process.env.NODE_ENV}<br>
            From: Manaboodle Test Route
          </div>
          
          <p style="color: #666;">If you received this email, Resend integration is working! ✅</p>
        </div>
      `
    });
    
    console.log('✅ Email sent successfully:', result);
    
    return NextResponse.json({ 
      success: true,
      message: 'Test email sent successfully!',
      result: result
    });
    
  } catch (error: any) {
    console.error('❌ Test email failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: 'Test email failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Resend test endpoint - use POST with { "testEmail": "your@email.com" }',
    hasApiKey: !!process.env.RESEND_API_KEY,
    environment: process.env.NODE_ENV
  });
}