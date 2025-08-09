import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log('API received email check for:', email); // Debug log

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate .edu email
    if (!email.endsWith('.edu')) {
      console.log('Email rejected - not .edu:', email); // Debug log
      return NextResponse.json({ error: 'Must be a .edu email address' }, { status: 400 });
    }

    console.log('Checking database for email:', email.toLowerCase().trim()); // Debug log

    // Check if user exists in the database
    const { data, error } = await supabase
      .from('university_access')
      .select('id, email, full_name')
      .eq('email', email.toLowerCase().trim())
      .single();

    console.log('Database query result:', { data, error }); // Debug log

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (data) {
      // User exists, they have access
      console.log('User found in database, granting access'); // Debug log
      return NextResponse.json({ 
        hasAccess: true, 
        message: 'Access verified',
        userName: data.full_name 
      });
    } else {
      // User not found
      console.log('User not found in database'); // Debug log
      return NextResponse.json({ 
        hasAccess: false, 
        message: 'Email not found in our records' 
      });
    }

  } catch (error) {
    console.error('Check access error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
