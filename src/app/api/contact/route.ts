import { NextRequest, NextResponse } from 'next/server';
import { sendContactNotification } from '@/lib/aws-ses';

export async function POST(request: NextRequest) {
  console.log('Contact API POST request received!');
  
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    console.log('Request body:', { name, email, subject, messageLength: message?.length });
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }
    
    // Validate field lengths
    if (name.length > 100 || subject.length > 200 || message.length > 2000) {
      return NextResponse.json(
        { error: 'One or more fields exceed maximum length.' },
        { status: 400 }
      );
    }
    
    // Check if AWS credentials exist
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS SES credentials not configured!');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }
    
    console.log('Attempting to send notification email via AWS SES...');
    
    try {
      // Send notification email using AWS SES
      const result = await sendContactNotification({
        name,
        email,
        subject,
        message,
      });
      
      console.log('Email sent successfully:', result);
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Message sent successfully! I\'ll get back to you as soon as possible.',
          messageId: result.messageId 
        },
        { status: 200 }
      );
    } catch (sesError: any) {
      console.error('SES error details:', sesError);
      
      // Handle specific SES errors
      if (sesError.name === 'MessageRejected') {
        return NextResponse.json(
          { error: 'Email address verification required. Please try again later.' },
          { status: 400 }
        );
      }
      
      if (sesError.name === 'ConfigurationSetDoesNotExist') {
        return NextResponse.json(
          { error: 'Email service configuration error. Please contact support.' },
          { status: 500 }
        );
      }
      
      // Generic error
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Contact API is working!',
    hasAwsCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
    region: process.env.AWS_REGION || 'us-east-1'
  });
}