// app/api/contact/route.ts
// FIXED VERSION with proper replyTo formatting and spam protection
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Simple in-memory rate limiting (resets on server restart)
const submissionTracker = new Map<string, { count: number; lastSubmit: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS = 3; // Max 3 submissions per hour per IP

// Spam keywords to detect
const SPAM_KEYWORDS = [
  'crypto', 'bitcoin', 'forex', 'casino', 'viagra', 'cialis', 'pharmacy',
  'loan', 'credit', 'debt', 'refinance', 'mortgage', 'insurance',
  'seo services', 'backlinks', 'buy followers', 'increase traffic',
  'click here', 'limited time', 'act now', 'buy now', 'order now',
  'prize', 'winner', 'congratulations', 'urgent', 'suspicious activity'
];

function checkForSpam(text: string): boolean {
  const lowerText = text.toLowerCase();
  return SPAM_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

function getClientIP(request: Request): string {
  // Get IP from various headers (for proxy/CDN scenarios)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

export async function POST(request: Request) {
  console.log('📧 Contact form submission received');
  
  try {
    const apiKey = process.env.RESEND_API_KEY;
    console.log('🔑 API Key present:', !!apiKey);
    
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY is not set!');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }
    
    const resend = new Resend(apiKey);
    console.log('🚀 Resend client initialized');
    
    const { name, email, message, subject, website, challenge } = await request.json();
    console.log('📝 Form data received:', { 
      name, 
      email: email?.substring(0, 5) + '...', 
      messageLength: message?.length 
    });

    // SPAM CHECK 1: Honeypot - if website field is filled, it's a bot
    if (website && website.trim() !== '') {
      console.log('🚫 Honeypot triggered - spam detected');
      return NextResponse.json(
        { error: 'Spam detected' },
        { status: 400 }
      );
    }

    // SPAM CHECK 2: Simple math challenge
    if (challenge !== '4') {
      console.log('🚫 Challenge failed - likely spam');
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 400 }
      );
    }

    // SPAM CHECK 3: Rate limiting by IP
    const clientIP = getClientIP(request);
    const now = Date.now();
    const tracker = submissionTracker.get(clientIP);
    
    if (tracker) {
      // Reset counter if outside time window
      if (now - tracker.lastSubmit > RATE_LIMIT_WINDOW) {
        submissionTracker.set(clientIP, { count: 1, lastSubmit: now });
      } else if (tracker.count >= MAX_SUBMISSIONS) {
        console.log('🚫 Rate limit exceeded for IP:', clientIP);
        return NextResponse.json(
          { error: 'Too many submissions. Please try again later.' },
          { status: 429 }
        );
      } else {
        tracker.count++;
        tracker.lastSubmit = now;
      }
    } else {
      submissionTracker.set(clientIP, { count: 1, lastSubmit: now });
    }

    // SPAM CHECK 4: Basic validation
    if (!name || !email || !message) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // SPAM CHECK 5: Check message length (too short or too long)
    if (message.length < 10) {
      console.log('❌ Message too short');
      return NextResponse.json(
        { error: 'Message is too short. Please provide more details.' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      console.log('❌ Message too long');
      return NextResponse.json(
        { error: 'Message is too long. Please keep it under 2000 characters.' },
        { status: 400 }
      );
    }

    // SPAM CHECK 6: Check for spam keywords
    if (checkForSpam(message) || checkForSpam(subject || '') || checkForSpam(name)) {
      console.log('🚫 Spam keywords detected');
      return NextResponse.json(
        { error: 'Your message contains prohibited content.' },
        { status: 400 }
      );
    }

    // SPAM CHECK 7: Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Email to you (notification of new contact)
    const notificationMsg = {
      from: 'hello@manaboodle.com',
      to: 'hello@manaboodle.com', // Changed from array to string
      replyTo: email, // FIXED: Changed from reply_to to replyTo
      subject: `New Contact: ${subject || 'No subject'} - ${name}`,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject || 'No subject'}

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
            <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject || 'No subject'}</p>
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
      to: email, // Changed from array to string
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
    console.log('✅ Notification email sent!');
    console.log('   Email ID:', notificationResult.data?.id);
    console.log('   Full result:', JSON.stringify(notificationResult, null, 2));
    
    console.log('📤 Sending auto-reply email...');
    const autoReplyResult = await resend.emails.send(autoReplyMsg);
    console.log('✅ Auto-reply email sent!');
    console.log('   Email ID:', autoReplyResult.data?.id);
    console.log('   Full result:', JSON.stringify(autoReplyResult, null, 2));

    console.log('🎉 Both emails sent successfully!');
    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your message. We\'ll be in touch soon!',
      // Include email IDs for debugging (remove in production)
      debug: {
        notificationId: notificationResult.data?.id,
        autoReplyId: autoReplyResult.data?.id
      }
    });

  } catch (error: any) {
    console.error('❌ Contact form error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      status: error.status,
      statusCode: error.statusCode,
      cause: error.cause
    });
    
    // Log Resend-specific errors
    if (error.response) {
      console.error('Resend API response error:', JSON.stringify(error.response, null, 2));
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again later.',
        // Include error details for debugging (remove in production)
        debug: error.message
      },
      { status: 500 }
    );
  }
}