// app/academic-portal/login/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../auth.module.css'

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user was just registered
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.')
    }
    // Check if password was just reset
    if (searchParams.get('reset') === 'success') {
      setSuccess('Password reset successfully! Please sign in with your new password.')
    }
  }, [searchParams])

  // Check for existing Supabase session on mount. If found and user exists in
  // HarvardUser table, immediately redirect to return_url with tokens.
  useEffect(() => {
    const returnUrl = searchParams.get('return_url')
    const checkSession = async () => {
      try {
        setIsChecking(true)
        const { data } = await supabase.auth.getSession()
        // data.session may be undefined
        const session = (data as any)?.session
        if (session && session.user && session.user.email) {
          // Verify user exists in HarvardUser table
          const { data: harvardUser } = await supabase
            .from('HarvardUser')
            .select('id, email, name, classCode')
            .eq('email', session.user.email)
            .single()

          if (harvardUser) {
            if (returnUrl) {
              try {
                const redirectUrl = new URL(returnUrl)
                if (session.access_token) {
                  redirectUrl.searchParams.set('sso_token', session.access_token)
                }
                if (session.refresh_token) {
                  redirectUrl.searchParams.set('sso_refresh', session.refresh_token)
                }
                // Redirect the browser to the external app with tokens
                window.location.href = redirectUrl.toString()
                return
              } catch (err) {
                // If return_url is not a valid URL, fall back to dashboard
                console.error('Invalid return_url:', returnUrl, err)
              }
            }
            // No return_url provided, go to internal dashboard
            router.push('/academic-portal/dashboard')
            return
          }
        }
      } catch (err) {
        console.error('Error checking session for SSO:', err)
      } finally {
        setIsChecking(false)
      }
    }

    checkSession()
    // We only want to run this on mount so ignore searchParams in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Validate .edu email
    if (!formData.email.endsWith('.edu')) {
      setError('Please use a valid .edu email address')
      setIsLoading(false)
      return
    }

    if (!formData.password) {
      setError('Please enter your password')
      setIsLoading(false)
      return
    }

    try {
      // Use Supabase Auth signIn
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (data.session) {
        // If a return_url param was provided (SSO flow), redirect back to the
        // external app with the session tokens. Otherwise, go to dashboard.
        const returnUrl = searchParams.get('return_url')
        if (returnUrl) {
          try {
            const redirectUrl = new URL(returnUrl)
            if ((data.session as any).access_token) {
              redirectUrl.searchParams.set('sso_token', (data.session as any).access_token)
            }
            if ((data.session as any).refresh_token) {
              redirectUrl.searchParams.set('sso_refresh', (data.session as any).refresh_token)
            }
            window.location.href = redirectUrl.toString()
            return
          } catch (err) {
            console.error('Invalid return_url during login submit:', returnUrl, err)
          }
        }

        // No valid return_url — go to internal dashboard
        router.push('/academic-portal/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  if (isChecking) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Checking authentication...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1 className={styles.title}>Manaboodle Academic Portal</h1>
          <p className={styles.subtitle}>
            Sign in to access exclusive tools
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
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="yourname@university.edu"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#666'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            <small className={styles.helpText}>
              <Link href="/academic-portal/forgot-password">Forgot your password?</Link>
            </small>
          </div>

          {success && (
            <div className={styles.success}>
              {success}
            </div>
          )}

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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>Don't have an account?</p>
          <Link href="/academic-portal/signup" className={styles.link}>
            Create Account
          </Link>
        </div>

        <div className={styles.backLink}>
          <Link href="/tools">← Back to Tools</Link>
        </div>
            </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading...
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
