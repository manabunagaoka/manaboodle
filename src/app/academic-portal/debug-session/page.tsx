'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'

export default function DebugSessionPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [storageInfo, setStorageInfo] = useState<any>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkEverything = async () => {
      // Check Supabase session
      const { data, error } = await supabase.auth.getSession()
      
      // Check localStorage
      const storage = typeof window !== 'undefined' ? {
        'manaboodle-auth-token': localStorage.getItem('manaboodle-auth-token'),
        'sb-otxidzozhdnszvqbgzne-auth-token': localStorage.getItem('sb-otxidzozhdnszvqbgzne-auth-token'),
        'academicPortalUser': localStorage.getItem('academicPortalUser'),
        'all_keys': Object.keys(localStorage).filter(key => key.includes('auth') || key.includes('supabase') || key.includes('sb-'))
      } : {}

      setSessionInfo({
        hasData: !!data,
        hasSession: !!data?.session,
        sessionError: error?.message,
        userEmail: data?.session?.user?.email,
        userId: data?.session?.user?.id,
        accessToken: data?.session?.access_token?.substring(0, 20) + '...',
        refreshToken: data?.session?.refresh_token?.substring(0, 20) + '...',
        expiresAt: data?.session?.expires_at
      })

      setStorageInfo(storage)
    }

    checkEverything()
  }, [])

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'monospace',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginBottom: '2rem' }}>🔍 Session Debug Page</h1>
      
      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Query Parameters</h2>
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '1rem', 
        borderRadius: '8px',
        overflow: 'auto'
      }}>
        {JSON.stringify({
          return_url: searchParams.get('return_url'),
          app_name: searchParams.get('app_name'),
          all_params: Object.fromEntries(searchParams.entries())
        }, null, 2)}
      </pre>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Supabase Session Info</h2>
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '1rem', 
        borderRadius: '8px',
        overflow: 'auto'
      }}>
        {sessionInfo ? JSON.stringify(sessionInfo, null, 2) : 'Loading...'}
      </pre>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>LocalStorage Info</h2>
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '1rem', 
        borderRadius: '8px',
        overflow: 'auto'
      }}>
        {storageInfo ? JSON.stringify(storageInfo, null, 2) : 'Loading...'}
      </pre>

      <div style={{ marginTop: '2rem' }}>
        <a href="/academic-portal/login" style={{ 
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          background: '#8B0000',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          marginRight: '1rem'
        }}>
          Go to Login
        </a>
        <a href="/academic-portal/dashboard" style={{ 
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          background: '#333',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px'
        }}>
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}
