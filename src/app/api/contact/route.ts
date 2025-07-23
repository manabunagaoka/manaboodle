// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email to you (notification of new contact)
    const notificationMsg = {
      to: 'hello@manaboodle.com',
      from: 'hello@manaboodle.com', // Must be your verified sender
      replyTo: email, // Visitor's email for easy reply
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
      to: email,
      from: {
        email: 'hello@manaboodle.com',
        name: 'Manabu Nagaoka'
      },
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

    // Send both emails
    await Promise.all([
      sgMail.send(notificationMsg),
      sgMail.send(autoReplyMsg)
    ]);

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your message. We\'ll be in touch soon!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // More detailed error logging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', error);
    }
    
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}