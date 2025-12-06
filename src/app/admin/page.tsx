'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the proper admin portal
    router.push('/academic-portal/admin')
  }, [router])

  useEffect(() => {
    // Redirect to the proper admin portal
    router.push('/academic-portal/admin')
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <p>Redirecting to admin portal...</p>
    </div>
  )
}