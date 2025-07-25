import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  status: 'active' | 'unsubscribed'
  unsubscribe_token: string
}