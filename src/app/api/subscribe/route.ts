import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/aws-ses';

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
    
    // Send welcome email with AWS SES
    if (subscriber && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      try {
        console.log('Sending welcome email via AWS SES...');
        
        await sendWelcomeEmail({
          email: subscriber.email,
          unsubscribeToken: subscriber.unsubscribe_token,
        });
        
        console.log('Welcome email sent successfully');
      } catch (emailError: any) {
        console.error('Failed to send welcome email:', emailError);
        
        // Log specific SES errors but don't fail the subscription
        if (emailError.name === 'MessageRejected') {
          console.error('SES: Email address not verified or in sandbox mode');
        } else if (emailError.Code === 'Throttling') {
          console.error('SES: Rate limit exceeded');
        }
        
        // Don't fail the subscription if email fails
        // User is still subscribed even if welcome email doesn't send
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
    hasAwsCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
    region: process.env.AWS_REGION || 'us-east-1'
  });
}