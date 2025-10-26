import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Migrate old session to new storage key if needed
if (typeof window !== 'undefined') {
  const oldKey = 'sb-otxidzozhdnszvqbgzne-auth-token'
  const newKey = 'manaboodle-auth-token'
  
  const oldSession = localStorage.getItem(oldKey)
  const newSession = localStorage.getItem(newKey)
  
  // If old session exists but new doesn't, migrate it
  if (oldSession && !newSession) {
    console.log('🔄 Migrating session from old storage key to new key')
    localStorage.setItem(newKey, oldSession)
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'manaboodle-auth-token',
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }
})

export interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  status: 'active' | 'unsubscribed'
  unsubscribe_token: string
}