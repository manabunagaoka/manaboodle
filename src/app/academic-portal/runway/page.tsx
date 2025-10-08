'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import StartupBudgetCalculator from './components/StartupBudgetCalculator'
import styles from '../dashboard.module.css'

export default function RunwayPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/academic-portal/login')
      } else {
        setUser(user)
        setIsLoading(false)
      }
    }
    
    checkUser()
  }, [router])

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading Runway...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <StartupBudgetCalculator />
  )
}