import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  console.log('Subscribe API POST request received!');
  
  try {
    const body = await request.json();
    const { email } = body; // Get email from request body
    
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
    
    // Send welcome email with SendGrid
    if (subscriber) {
      try {
        console.log('Sending welcome email via SendGrid...');
        
        const welcomeMsg = {
          to: subscriber.email,
          from: {
            email: 'subscription@manaboodle.com',
            name: 'Manaboodle'
          },
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
        
        await sgMail.send(welcomeMsg);
        console.log('Welcome email sent successfully');
        
      } catch (emailError: any) {
        console.error('Failed to send welcome email:', emailError);
        
        // Log specific SendGrid errors but don't fail the subscription
        if (emailError.response) {
          console.error('SendGrid error response:', emailError.response.body);
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
    hasSendGridKey: !!process.env.SENDGRID_API_KEY,
    sender: 'subscription@manaboodle.com'
  });
}