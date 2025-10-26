import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Use service key to bypass RLS
    const { data: harvardUser, error } = await supabase
      .from('HarvardUser')
      .select('id, email, name, classCode')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error fetching HarvardUser:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!harvardUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: harvardUser });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
