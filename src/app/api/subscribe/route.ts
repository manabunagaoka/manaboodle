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
    
    // Insert subscriber into database
    const { data, error } = await supabase
      .from('subscribers')
      .insert([
        { email: email.toLowerCase().trim() }
      ])
      .select();
    
    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already subscribed.' },
          { status: 400 }
        );
      }
      
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }
    
    console.log('Subscriber added successfully:', data);
    
    // Send welcome email
    if (process.env.RESEND_API_KEY) {
      try {
        console.log('Sending welcome email...');
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
              <p style="color: #999; font-size: 12px;">
                You can unsubscribe at any time by replying to any email from manaboodle.com
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

You can unsubscribe at any time by replying to any email from manaboodle.com
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