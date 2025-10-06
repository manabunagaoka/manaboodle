'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import StartupBudgetCalculator from './components/StartupBudgetCalculator'
import styles from '../dashboard.module.css'

export default function RunwayPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/academic-portal/login')
    } else if (status === 'authenticated') {
      setIsLoading(false)
    }
  }, [status, router])

  if (isLoading || status === 'loading') {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading Runway...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <StartupBudgetCalculator />
  )
}