// app/academic-portal/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../auth.module.css'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    classCode: '',
    affiliation: 'student'
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate .edu email
    if (!formData.email.endsWith('.edu')) {
      setError('Please use a valid .edu email address')
      setIsLoading(false)
      return
    }

    // Validate class code
    const validCodes = ['T565', 'T566', 'T595']
    if (!validCodes.includes(formData.classCode.toUpperCase())) {
      setError('Invalid class code. Valid codes: T565, T566, T595')
      setIsLoading(false)
      return
    }

    if (!formData.name.trim()) {
      setError('Please enter your full name')
      setIsLoading(false)
      return
    }

    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!agreedToTerms) {
      setError('You must agree to the MVP Testing Agreement to continue')
      setIsLoading(false)
      return
    }

    try {
      // Call registration API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          classCode: formData.classCode.toUpperCase(),
          affiliation: formData.affiliation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Redirect to login page on successful registration
      router.push('/academic-portal/login?registered=true')
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

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1 className={styles.title}>Manaboodle Academic Portal</h1>
          <p className={styles.subtitle}>
            Create your account to access exclusive tools
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={styles.input}
              required
            />
          </div>

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
                placeholder="At least 8 characters"
                className={styles.input}
                minLength={8}
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
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter your password"
              className={styles.input}
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
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
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="affiliation" className={styles.label}>
              Affiliation
            </label>
            <select
              id="affiliation"
              name="affiliation"
              value={formData.affiliation}
              onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
              className={styles.input}
              required
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="classCode" className={styles.label}>
              Class Code: Enter your class number
            </label>
            <input
              type="text"
              id="classCode"
              name="classCode"
              value={formData.classCode}
              onChange={handleInputChange}
              placeholder="T565, T566, or T595"
              className={styles.input}
              required
            />
            <small className={styles.helpText}>
              Need a class code? <a href="https://www.manaboodle.com/subscribe" target="_blank" rel="noopener noreferrer">Subscribe to Manaboodle</a> (you can unsubscribe anytime)
            </small>
          </div>

          <div className={styles.formGroup} style={{ marginTop: '24px' }}>
            <div style={{ 
              padding: '16px', 
              background: '#f8f9fa', 
              border: '1px solid #dee2e6', 
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
                MVP Testing Agreement
              </h3>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#495057' }}>
                <p style={{ margin: '0 0 12px 0' }}>
                  By creating an account, you agree to participate in MVP (Minimum Viable Product) testing for the Manaboodle Academic Portal. Please note:
                </p>
                <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
                  <li>We collect only your name and .edu email address for authentication purposes</li>
                  <li>All user data will be permanently deleted from our database upon completion of MVP testing, no later than <strong>June 1, 2026</strong>, without further notice</li>
                  <li>You will lose access to the portal when your data is deleted</li>
                  <li>We do not collect, store, or process any other personal information</li>
                  <li>We are not responsible for any data loss or interruption of service</li>
                  <li>This is a testing environment and features may change or become unavailable without notice</li>
                </ul>
                <p style={{ margin: '0', fontSize: '13px' }}>
                  For questions or to stay informed about future access to these tools, please visit{' '}
                  <a href="https://manaboodle.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>
                    manaboodle.com
                  </a>{' '}
                  or subscribe to our newsletter.
                </p>
              </div>
            </div>
            
            <label style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              cursor: 'pointer',
              gap: '12px'
            }}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ 
                  marginTop: '2px',
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
                required
              />
              <span style={{ fontSize: '14px', lineHeight: '1.5' }}>
                I have read and agree to the MVP Testing Agreement
              </span>
            </label>
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>Already have an account?</p>
          <Link href="/academic-portal/login" className={styles.link}>
            Sign in here
          </Link>
        </div>

        <div className={styles.backLink}>
          <Link href="/tools">← Back to Tools</Link>
        </div>
      </div>
    </div>
  )
}