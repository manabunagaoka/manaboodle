import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  console.log('📧 Subscribe API POST request received!');
  
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
    
    const body = await request.json();
    const { email } = body; // Get email from request body
    console.log('📝 Subscription request for:', email?.substring(0, 5) + '...');
    
    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      );
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }
    
    console.log('Adding subscriber:', email);
    
    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();
    
    // If subscriber exists and is active, return message
    if (existingSubscriber && existingSubscriber.status === 'active') {
      return NextResponse.json(
        { error: 'This email is already subscribed.' },
        { status: 400 }
      );
    }
    
    // If subscriber exists but unsubscribed, reactivate them
    if (existingSubscriber && existingSubscriber.status === 'unsubscribed') {
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({ 
          status: 'active',
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null
        })
        .eq('id', existingSubscriber.id);
        
      if (updateError) {
        console.error('Supabase reactivation error:', updateError);
        return NextResponse.json(
          { error: 'Failed to resubscribe. Please try again.' },
          { status: 500 }
        );
      }
      
      console.log('Reactivated subscriber:', email);
      // Use existing subscriber data for welcome email
      var subscriber = { ...existingSubscriber, status: 'active' };
    } else {
      // Insert new subscriber
      const { data, error } = await supabase
        .from('subscribers')
        .insert([
          { 
            email: email.toLowerCase().trim()
          }
        ])
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(
          { error: 'Failed to subscribe. Please try again.' },
          { status: 500 }
        );
      }
      
      console.log('New subscriber added:', data);
      var subscriber = data[0];
    }
    
    // Send welcome email with Resend
    if (subscriber) {
      try {
        console.log('📤 Sending welcome email via Resend to:', subscriber.email);
        
        // Welcome email to subscriber
        const welcomeMsg = {
          from: 'hello@manaboodle.com',
          to: [subscriber.email],
          subject: 'Welcome to Manaboodle!',
          text: `Thank you for joining Manaboodle!

This is my space to chronicle concepts, projects, case studies, and even random thoughts as they come to me. A place where creation and reflection can coexist.

My vision is to eventually grow this into a community where we can all share ideas, learn from each other, and explore endless possibilities together. 

For now, I'm excited to share my journey with you.

Feel free to reply anytime - I'd love to hear your thoughts!

Best,
Manabu
Founder, CEO

P.S. You can unsubscribe anytime: https://manaboodle.com/unsubscribe?token=${subscriber.unsubscribe_token}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Thank you for joining Manaboodle!</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                This is my space to chronicle concepts, projects, case studies, and even random thoughts as they come to me. A place where creation and reflection can coexist.
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                My vision is to eventually grow this into a community where we can all share ideas, learn from each other, and explore endless possibilities together.
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                For now, I'm excited to share my journey with you.
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Feel free to reply anytime - I'd love to hear your thoughts!
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Best,<br>
                <strong>Manabu</strong>
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
              
              <p style="color: #999; font-size: 12px; line-height: 1.6; text-align: center;">
                <a href="https://manaboodle.com/unsubscribe?token=${subscriber.unsubscribe_token}" style="color: #666; text-decoration: underline;">Unsubscribe anytime</a>
              </p>
            </div>
          `,
        };
        
        // Notification email to you about new subscriber
        const notificationMsg = {
          from: 'hello@manaboodle.com',
          to: ['subscription@manaboodle.com'],
          subject: `New Subscriber: ${subscriber.email}`,
          text: `New subscription to Manaboodle!

Email: ${subscriber.email}
Subscribed: ${new Date().toISOString()}
Status: ${subscriber.status}

Total subscribers: Check your Supabase dashboard for current count.`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">New Subscriber!</h2>
              
              <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${subscriber.email}</p>
                <p style="margin: 0 0 10px 0;"><strong>Subscribed:</strong> ${new Date().toISOString()}</p>
                <p style="margin: 0;"><strong>Status:</strong> ${subscriber.status}</p>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Check your Supabase dashboard for current subscriber count and management.
              </p>
            </div>
          `
        };
        
        // Send both emails
        const welcomeResult = await resend.emails.send(welcomeMsg);
        console.log('✅ Welcome email sent successfully:', welcomeResult);
        
        const notificationResult = await resend.emails.send(notificationMsg);
        console.log('✅ Subscription notification sent successfully:', notificationResult);
        
      } catch (emailError: any) {
        console.error('❌ Failed to send welcome email:', emailError);
        console.error('Email error details:', {
          name: emailError.name,
          message: emailError.message,
          status: emailError.status,
          cause: emailError.cause
        });
        
        // Log specific Resend errors but don't fail the subscription
        if (emailError.response) {
          console.error('Resend error response:', emailError.response);
        }
        
        // Don't fail the subscription if email fails
        // User is still subscribed even if welcome email doesn't send
      }
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed! Check your email for a welcome message.'
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Subscribe API is working!',
    hasResendKey: !!process.env.RESEND_API_KEY,
    sender: 'subscription@manaboodle.com'
  });
}