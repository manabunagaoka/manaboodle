export const dynamic = "force-dynamic";
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from '../email-preferences/page.module.css'

interface EmailPreferences {
  newsletter: boolean
  caseStudies: boolean  
  concepts: boolean
  projects: boolean
  frequency: 'weekly' | 'monthly' | 'immediate'
}

export default function PreferencesPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')
  
  const [preferences, setPreferences] = useState<EmailPreferences>({
    newsletter: true,
    caseStudies: true,
    concepts: true,
    projects: true,
    frequency: 'weekly'
  })
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  if (!email || !token) {
    return (
      <div className={styles.preferencesPage}>
        <div className={styles.unauthorizedMessage}>
          <h1 className={styles.unauthorizedTitle}>Email Preferences</h1>
          <p className={styles.unauthorizedText}>
            Please access this page through the link in your email to manage your preferences.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.preferencesPage}>
      <h1 className={styles.pageTitle}>Email Preferences</h1>
      <p>Managing preferences for: {email}</p>
      <p>Feature coming soon...</p>
    </div>
  )
}
