import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
  }

  try {
    // Check auth.users table
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    const matchingAuthUser = authUsers?.users.find(u => u.email === email);

    // Check ManaboodleUser table - get ALL matching records
    const { data: portalUsers, error: portalError } = await supabase
      .from('ManaboodleUser')
      .select('*')
      .eq('email', email);

    // Try case-insensitive search too
    const { data: portalUsersIlike, error: portalErrorIlike } = await supabase
      .from('ManaboodleUser')
      .select('*')
      .ilike('email', email);

    return NextResponse.json({
      email,
      auth: {
        found: !!matchingAuthUser,
        user: matchingAuthUser ? {
          id: matchingAuthUser.id,
          email: matchingAuthUser.email,
          created_at: matchingAuthUser.created_at
        } : null,
        error: authError?.message
      },
      portalUser: {
        count: portalUsers?.length || 0,
        users: portalUsers,
        error: portalError?.message
      },
      portalUserCaseInsensitive: {
        count: portalUsersIlike?.length || 0,
        users: portalUsersIlike,
        error: portalErrorIlike?.message
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
