'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AcademicPortal() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for Supabase session
        const { data } = await supabase.auth.getSession()
        const session = (data as any)?.session
        
        if (session && session.user) {
          // User is authenticated, redirect to dashboard
          router.push('/academic-portal/dashboard')
        } else {
          // Not authenticated, redirect to login page
          router.push('/academic-portal/login')
        }
      } catch (err) {
        console.error('Error checking session:', err)
        // On error, redirect to login
        router.push('/academic-portal/login')
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router])

  // Show minimal loading state while redirecting
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #8B0000 0%, #A41E22 50%, #C8102E 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p>Entering Manaboodle Academic Portal...</p>
      </div>
    </div>
  )
}