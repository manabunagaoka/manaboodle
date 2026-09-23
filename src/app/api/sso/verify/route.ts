import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getActiveApp } from '@/lib/sso-apps';
import { ensureAppAccess } from '@/lib/sso-access';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { valid: false, error: 'Missing authorization header' }, 
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    // Apps pass their slug (?app=forks); access is checked per app
    const app = await getActiveApp(new URL(request.url).searchParams.get('app'));
    if (!app) {
      return NextResponse.json(
        { valid: false, error: 'Unknown or missing app' }, 
        { status: 400 }
      );
    }
    
    // Verify token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('SSO token verification failed:', authError);
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired token' }, 
        { status: 401 }
      );
    }
    
    // Get user details
    const { data: portalUser, error: userError } = await supabase
      .from('ManaboodleUser')
      .select('id, email, name, classCode, createdAt')
      .eq('email', user.email)
      .single();
      
    if (userError || !portalUser) {
      console.error('SSO user not found in ManaboodleUser:', userError);
      return NextResponse.json(
        { valid: false, error: 'Not a portal user' }, 
        { status: 403 }
      );
    }
    
    const role = await ensureAppAccess(app, user.id);
    if (!role) {
      return NextResponse.json(
        { valid: false, error: 'No access to this app' }, 
        { status: 403 }
      );
    }
    
    console.log('SSO token verified for:', portalUser.email, 'app:', app.slug);
    
    return NextResponse.json({
      valid: true,
      user: {
        id: portalUser.id,
        email: portalUser.email,
        name: portalUser.name,
        classCode: portalUser.classCode,
        createdAt: portalUser.createdAt,
        role
      }
    });
    
  } catch (error) {
    console.error('SSO verify endpoint error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' }, 
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
