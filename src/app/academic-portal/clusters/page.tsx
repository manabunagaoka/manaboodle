'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ExternalLink, Shield, HardDrive, Clock, Component, ArrowLeft } from 'lucide-react'
import styles from './clusters.module.css'

export default function ClustersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/academic-portal/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleLaunch = () => {
    window.open('https://clusters-git-main-manabunagaokas-projects.vercel.app?_vercel_share=ylGI3HYkSn33Gj8GMNRQcdEjQ26GG73E', '_blank', 'noopener,noreferrer')
  }

  const handleBackToDashboard = () => {
    router.push('/academic-portal/dashboard')
  }

  return (
    <div className={styles.container}>

      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.iconWrapper}>
          <Component size={64} strokeWidth={1.5} />
        </div>
        <h1>Clusters</h1>
        <p className={styles.subtitle}>
          JTBD Student Edition — Discover natural customer segments from interview patterns
        </p>
      </div>

      {/* Privacy Notice */}
      <div className={styles.privacyCard}>
        <div className={styles.privacyHeader}>
          <Shield size={24} />
          <h2>Your Data Stays Private</h2>
        </div>
        <div className={styles.privacyContent}>
          <div className={styles.privacyItem}>
            <HardDrive size={20} />
            <div>
              <strong>Client-Side Only</strong>
              <p>All your business data, problem statements, and interview notes stay in your browser's local storage. We never store them on our servers.</p>
            </div>
          </div>
          <div className={styles.privacyItem}>
            <Clock size={20} />
            <div>
              <strong>Your Control</strong>
              <p>You can clear your data anytime by clearing your browser data. No account or database to worry about.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Overview */}
      <div className={styles.features}>
        <h2>What You'll Do in Clusters</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>1</div>
            <h3>Define Problem Statement</h3>
            <p>Describe who you're helping, what's hard for them, current workarounds, and what success looks like.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>2</div>
            <h3>Paste Interview Notes</h3>
            <p>Add 10-15 customer interviews following JTBD framework. Our algorithm extracts themes from what they actually said.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>3</div>
            <h3>Discover Segments</h3>
            <p>See natural customer clusters based on shared themes (cost, time, trust, etc.). No assumptions—just patterns from real data.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>4</div>
            <h3>Get Insights</h3>
            <p>Receive AI-generated narrative explaining each segment, their priorities, and strategic recommendations.</p>
          </div>
        </div>
      </div>

      {/* Launch Button */}
      <div className={styles.launchSection}>
        <div className={styles.buttonGroup}>
          <button onClick={handleBackToDashboard} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Back to Academic Portal</span>
          </button>
          <button onClick={handleLaunch} className={styles.launchButton}>
            <span>Launch Clusters</span>
            <ExternalLink size={20} />
          </button>
        </div>
      </div>

      {/* Technical Note */}
      <div className={styles.techNote}>
        <p>
          <strong>For Students:</strong> Clusters uses the ABAC (Adaptive Business Alignment Clustering) algorithm to group interviews by theme similarity. 
          It's deterministic computer science—no guessing, just math on the 13 core JTBD dimensions.
        </p>
      </div>
    </div>
  )
}
