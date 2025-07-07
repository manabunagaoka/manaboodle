import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  console.log('Unsubscribe API POST request received!');
  
  try {
    const body = await request.json();
    const { token, email } = body;
    
    // Validate input
    if (!token && !email) {
      return NextResponse.json(
        { error: 'Token or email is required.' },
        { status: 400 }
      );
    }
    
    // Find subscriber by token or email
    let subscriberQuery;
    if (token) {
      subscriberQuery = supabase
        .from('subscribers')
        .select('*')
        .eq('unsubscribe_token', token)
        .single();
    } else {
      subscriberQuery = supabase
        .from('subscribers')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();
    }
    
    const { data: subscriber, error: findError } = await subscriberQuery;
    
    if (findError || !subscriber) {
      return NextResponse.json(
        { error: 'Subscription not found.' },
        { status: 404 }
      );
    }
    
    // Check if already unsubscribed
    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json(
        { 
          success: true, 
          message: 'You are already unsubscribed.',
          email: subscriber.email
        },
        { status: 200 }
      );
    }
    
    // Update subscriber status to unsubscribed
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({ 
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString()
      })
      .eq('id', subscriber.id);
    
    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to unsubscribe. Please try again.' },
        { status: 500 }
      );
    }
    
    console.log('Successfully unsubscribed:', subscriber.email);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully unsubscribed from Manaboodle updates.',
        email: subscriber.email
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Unsubscribe error:', error);
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
    message: 'Unsubscribe API is working!',
  });
}