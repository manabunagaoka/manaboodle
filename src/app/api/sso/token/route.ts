import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }
    
    // Authenticate with Supabase
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError || !session) {
      console.error('SSO auth error:', authError);
      return NextResponse.json(
        { error: 'Invalid credentials' }, 
        { status: 401 }
      );
    }
    
    // Verify user is in ManaboodleUser table
    const { data: portalUser, error: userError } = await supabase
      .from('ManaboodleUser')
      .select('id, email, name, classCode, createdAt')
      .eq('email', email)
      .single();
      
    if (userError || !portalUser) {
      console.error('SSO user lookup error:', userError);
      return NextResponse.json(
        { error: 'Not a portal user' }, 
        { status: 403 }
      );
    }
    
    console.log('SSO token issued for:', email);
    
    return NextResponse.json({
      success: true,
      token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      user: {
        id: portalUser.id,
        email: portalUser.email,
        name: portalUser.name,
        classCode: portalUser.classCode
      }
    });
    
  } catch (error) {
    console.error('SSO token endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// CORS headers for external apps
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
