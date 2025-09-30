// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  console.log('📧 Contact form submission received');
  
  try {
    // Environment variable debugging
    const apiKey = process.env.RESEND_API_KEY;
    console.log('🔑 API Key present:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length || 0);
    
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY is not set!');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }
    
    // Initialize Resend with explicit error handling
    const resend = new Resend(apiKey);
    console.log('🚀 Resend client initialized');
    
    const { name, email, message } = await request.json();
    console.log('📝 Form data received:', { name, email: email?.substring(0, 5) + '...', messageLength: message?.length });

    // Validate input
    if (!name || !email || !message) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email to you (notification of new contact)
    const notificationMsg = {
      from: 'hello@manaboodle.com', // Your verified domain
      to: ['hello@manaboodle.com'],
      reply_to: email, // Visitor's email for easy reply
      subject: `New Contact Form Message from ${name}`,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}

---
You can reply directly to this email to respond to ${name}.
      `,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0;"><strong>Message:</strong></p>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            You can reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
    };

    // Auto-reply to the visitor
    const autoReplyMsg = {
      from: 'hello@manaboodle.com',
      to: [email],
      subject: 'Thank you for contacting Manaboodle',
      text: `
Hi ${name},

Thank you for reaching out to Manaboodle! I've received your message and will get back to you as soon as possible.

Your message:
${message}

In the meantime, feel free to explore more articles and insights at https://manaboodle.com

Best regards,
Manabu Nagaoka
Founder, Manaboodle
https://manaboodle.com
      `,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hi ${name},</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Thank you for reaching out to Manaboodle! I've received your message and will get back to you as soon as possible.
          </p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">Your message:</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            In the meantime, feel free to explore more articles and insights at 
            <a href="https://manaboodle.com" style="color: #0066cc;">manaboodle.com</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px;">
            Best regards,<br>
            <strong>Manabu Nagaoka</strong><br>
            Founder, Manaboodle<br>
            <a href="https://manaboodle.com" style="color: #0066cc;">manaboodle.com</a>
          </p>
        </div>
      `,
    };

    // Send both emails with detailed logging
    console.log('📤 Sending notification email...');
    const notificationResult = await resend.emails.send(notificationMsg);
    console.log('✅ Notification email result:', notificationResult);
    
    console.log('📤 Sending auto-reply email...');
    const autoReplyResult = await resend.emails.send(autoReplyMsg);
    console.log('✅ Auto-reply email result:', autoReplyResult);

    console.log('🎉 Both emails sent successfully!');
    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your message. We\'ll be in touch soon!'
    });

  } catch (error: any) {
    console.error('❌ Contact form error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      status: error.status,
      cause: error.cause
    });
    
    // Log Resend-specific errors
    if (error.response) {
      console.error('Resend API response error:', error.response);
    }
    
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}