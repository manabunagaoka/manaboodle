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

    // Check HarvardUser table - get ALL matching records
    const { data: harvardUsers, error: harvardError } = await supabase
      .from('HarvardUser')
      .select('*')
      .eq('email', email);

    // Try case-insensitive search too
    const { data: harvardUsersIlike, error: harvardErrorIlike } = await supabase
      .from('HarvardUser')
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
      harvardUser: {
        count: harvardUsers?.length || 0,
        users: harvardUsers,
        error: harvardError?.message
      },
      harvardUserCaseInsensitive: {
        count: harvardUsersIlike?.length || 0,
        users: harvardUsersIlike,
        error: harvardErrorIlike?.message
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
