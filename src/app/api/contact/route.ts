import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  console.log('Contact API POST request received!');
  
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    console.log('Request body:', { name, email, subject, messageLength: message?.length });
    
    // Check if API key exists
    console.log('API Key exists:', !!process.env.RESEND_API_KEY);
    console.log('API Key starts with re_:', process.env.RESEND_API_KEY?.startsWith('re_'));
    
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set!');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log('Attempting to send simple email...');
    
    // Send very simple email
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['manabunagaoka@gmail.com'],
      subject: `Test Contact: ${subject}`,
      text: `From: ${name} (${email})\nMessage: ${message}`,
    });
    
    if (error) {
      console.error('Resend error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }
    
    console.log('Email sent successfully:', data);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Test email sent successfully!',
        emailId: data?.id 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Contact API is working!',
    hasApiKey: !!process.env.RESEND_API_KEY 
  });
}