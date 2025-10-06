'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../auth.module.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!email.endsWith('.edu')) {
      setError('Please use a valid .edu email address')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authHeader}>
            <h1 className={styles.title}>Check Your Email</h1>
            <p className={styles.subtitle}>
              Manaboodle Academic Portal - If an account exists with {email}, we've sent password reset instructions.
            </p>
          </div>

          <div className={styles.success} style={{ textAlign: 'center' }}>
            <p>Password reset link sent! Check your email inbox.</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              The link will expire in 1 hour.
            </p>
          </div>

          <div className={styles.authFooter} style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/academic-portal/login" className={styles.link}>
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>
            Manaboodle Academic Portal - Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              .edu email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@university.edu"
              className={styles.input}
              required
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className={styles.authFooter}>
          <Link href="/academic-portal/login" className={styles.link}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
