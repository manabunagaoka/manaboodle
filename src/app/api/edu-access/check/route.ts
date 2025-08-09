import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if user exists in the database
    const { data, error } = await supabase
      .from('edu_access_requests')
      .select('id, university_email, status')
      .eq('university_email', email.toLowerCase().trim())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (data) {
      return NextResponse.json({ 
        hasAccess: true,
        email: data.university_email,
        status: data.status || 'approved'
      });
    } else {
      return NextResponse.json({ 
        hasAccess: false 
      });
    }

  } catch (error) {
    console.error('Check access error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
