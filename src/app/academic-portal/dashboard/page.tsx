// app/academic-portal/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Component, Calculator, ChartColumnIncreasing, Plus, CircleDollarSign } from 'lucide-react'
import styles from '../dashboard.module.css'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/academic-portal/login')
    } else {
      setUser(user)
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/tools')
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className={styles.dashboardPage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={styles.logo}>
              <circle cx="6" cy="6" r="1.5" fill="currentColor"></circle>
              <circle cx="18" cy="6" r="1.5" fill="currentColor"></circle>
              <circle cx="12" cy="12" r="2" fill="currentColor"></circle>
              <circle cx="6" cy="18" r="1.5" fill="currentColor"></circle>
              <circle cx="18" cy="18" r="1.5" fill="currentColor"></circle>
              <circle cx="12" cy="3" r="1" fill="currentColor" opacity="0.5"></circle>
              <circle cx="12" cy="21" r="1" fill="currentColor" opacity="0.5"></circle>
              <circle cx="3" cy="12" r="1" fill="currentColor" opacity="0.5"></circle>
              <circle cx="21" cy="12" r="1" fill="currentColor" opacity="0.5"></circle>
              <path d="M6 6 L12 12 L18 6" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4"></path>
              <path d="M6 18 L12 12 L18 18" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4"></path>
              <path d="M6 6 L18 18" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2"></path>
              <path d="M18 6 L6 18" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2"></path>
              <path d="M12 3 L12 21" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15"></path>
              <path d="M3 12 L21 12" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15"></path>
            </svg>
            <div>
              <span className={styles.brandName}>Manaboodle</span>
              <span className={styles.byline}>by Manabu Nagaoka</span>
            </div>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.welcome}>Welcome, {user.email}</span>
            <span className={styles.classCode}>{user.user_metadata?.name || 'Student'}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Academic Portal</h1>
          <p className={styles.subtitle}>
            Exclusive tools for students enrolled in authorized Harvard courses
          </p>

          <div className={styles.toolsGrid}>
            <Link href="/academic-portal/clusters" className={styles.toolCard}>
              <div className={styles.toolIcon}>
                <Component size={48} strokeWidth={1.5} />
              </div>
              <h3>Clusters</h3>
              <p>JTBD Student Edition - Discover natural customer segments from interview patterns. Your data stays in your browser, never stored on our servers.</p>
              <span className={styles.toolLink}>
                Access Tool →
              </span>
            </Link>

            <Link href="/academic-portal/runway" className={styles.toolCard}>
              <div className={styles.toolIcon}>
                <Calculator size={48} strokeWidth={1.5} />
              </div>
              <h3>Runway</h3>
              <p>Calculate startup runway with budget planning, team costs, and AI-powered financial assistance.</p>
              <span className={styles.toolLink}>
                Access Tool →
              </span>
            </Link>

            <a 
              href="https://ppp.manaboodle.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.toolCard}
            >
              <div className={styles.toolIcon}>
                <CircleDollarSign size={48} strokeWidth={1.5} />
              </div>
              <h3>PPP</h3>
              <p className={styles.appSubtitle}>Purchasing Power Parity</p>
              <p>Compare purchasing power across 11 global markets. Calculate how far your money goes in different countries with real-time economic data.</p>
              <span className={styles.toolLink}>
                Launch Tool →
              </span>
            </a>

            <div className={styles.toolCard + ' ' + styles.comingSoon}>
              <div className={styles.badge}>Coming Soon</div>
              <div className={styles.toolIcon}>
                <ChartColumnIncreasing size={48} strokeWidth={1.5} />
              </div>
              <h3>Ripple</h3>
              <p>Real P&L estimator - Project financial performance and analyze profit and loss scenarios for your business.</p>
              <span className={styles.toolLink + ' ' + styles.disabled}>
                Coming Soon
              </span>
            </div>

            <div className={styles.toolCard + ' ' + styles.addNew}>
              <div className={styles.badge}>Coming Soon</div>
              <div className={styles.toolIcon}>
                <Plus size={64} strokeWidth={1.5} />
              </div>
              <h3>Add New App</h3>
              <p>More tools and features are on the way. Stay tuned for exciting new additions to the portal.</p>
              <span className={styles.toolLink + ' ' + styles.disabled}>
                Coming Soon
              </span>
            </div>
          </div>

          <div className={styles.supportSection}>
            <h2>Need Help?</h2>
            <p>
              Contact your course instructor or 
              <Link href="/contact" className={styles.supportLink}> reach out to our support team</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
