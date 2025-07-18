'use client'

export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PreferencesPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')
  
  const [loading, setLoading] = useState(false)

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
