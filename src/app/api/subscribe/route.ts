import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  console.log('Subscribe API POST request received!');
  
  try {
    const body = await request.json();
    const { email } = body;
    
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
          { email: email.toLowerCase().trim() }
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
    
    // Send welcome email with proper unsubscribe links
    if (process.env.RESEND_API_KEY && subscriber) {
      try {
        console.log('Sending welcome email...');
        
        // Get the base URL for unsubscribe links
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://manaboodle.com';
        const unsubscribeUrl = `${baseUrl}/unsubscribe/${subscriber.unsubscribe_token}`;
        
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: [email],
          subject: 'Welcome to Manaboodle Updates!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; margin-bottom: 20px;">🎉 Welcome to Manaboodle!</h2>
              
              <p style="color: #666; line-height: 1.6; font-size: 16px;">
                Thanks for subscribing to article notifications! You'll now receive an email whenever I publish new content.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #555; margin: 0; font-size: 14px;">
                  <strong>What to expect:</strong><br>
                  • Notifications for new articles and insights<br>
                  • No spam, just quality content<br>
                  • Easy unsubscribe anytime
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                Best regards,<br>
                Manabu Nagaoka<br>
                <a href="https://manaboodle.com" style="color: #0066cc;">manaboodle.com</a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                You're receiving this because you subscribed to Manaboodle updates.<br>
                <a href="${unsubscribeUrl}" style="color: #0066cc;">Unsubscribe instantly</a> | 
                <a href="${baseUrl}/unsubscribe" style="color: #0066cc;">Manage preferences</a>
              </p>
            </div>
          `,
          text: `
Welcome to Manaboodle!

Thanks for subscribing to article notifications! You'll now receive an email whenever I publish new content.

What to expect:
• Notifications for new articles and insights  
• No spam, just quality content
• Easy unsubscribe anytime

Best regards,
Manabu Nagaoka
manaboodle.com

To unsubscribe: ${unsubscribeUrl}
Or visit: ${baseUrl}/unsubscribe
          `
        });
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the subscription if email fails
      }
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed! Check your email for confirmation.'
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
  });
}