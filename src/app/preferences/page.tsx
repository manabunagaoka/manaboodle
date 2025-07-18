'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function PreferencesContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  if (!email || !token) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Email Preferences</h1>
        <p>Please access this page through the link in your email to manage your preferences.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Email Preferences</h1>
      <p>Managing preferences for: {email}</p>
      <p>Feature coming soon...</p>
    </div>
  )
}

export default function PreferencesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading...</div>}>
      <PreferencesContent />
    </Suspense>
  )
}
