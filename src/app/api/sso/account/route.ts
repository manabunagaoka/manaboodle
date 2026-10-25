// Changing the name on a Manaboodle account, from the account page. The
// person proves who they are with their own session token; the name is
// changed on their profile, which apps read when they sign in, and in their
// sign-in details, so both say the same.
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function PATCH(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '')
  if (!token) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : ''
  if (!name) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })

  const supabase = createServiceClient()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })

  const { error: profileError } = await supabase.from('ManaboodleUser').update({ name }).eq('authUserId', user.id)
  if (profileError) {
    console.error('Account: could not change the name:', profileError)
    return NextResponse.json({ error: 'Your name could not be changed. Try again in a moment.' }, { status: 500 })
  }
  await supabase.auth.admin.updateUserById(user.id, { user_metadata: { ...user.user_metadata, name } })
  return NextResponse.json({ ok: true })
}
