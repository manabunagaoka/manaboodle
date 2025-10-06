'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AcademicPortal() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const userData = localStorage.getItem('academicPortalUser')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.authenticated) {
        // Redirect to dashboard if already logged in
        router.push('/academic-portal/dashboard')
        return
      }
    }
    
    // If not authenticated, redirect to signup page
    router.push('/academic-portal/signup')
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