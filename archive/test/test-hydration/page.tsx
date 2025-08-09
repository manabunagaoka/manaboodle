'use client'

import { useState, useEffect } from 'react'

export default function TestHydrationPage() {
  const [mounted, setMounted] = useState(false)
  const [testData, setTestData] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Safe client-side only code
    if (typeof window !== 'undefined') {
      setTestData('Client-side data loaded')
    }
  }, [mounted])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Hydration Test Page</h1>
      <p>Mounted: {mounted ? 'Yes' : 'No'}</p>
      <p>Test Data: {testData}</p>
      <p>This should not cause hydration errors</p>
    </div>
  )
}
