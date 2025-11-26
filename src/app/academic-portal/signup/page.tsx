// app/academic-portal/signup/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../auth.module.css'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    classCode: '',
    affiliation: 'student',
    institution: '',
    requestReason: ''
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'checking' | 'approved' | 'guest' | ''>('')
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'invalid' | ''>('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const router = useRouter()

  // Check email domain when email changes
  useEffect(() => {
    if (formData.email && formData.email.includes('@')) {
      checkEmailDomain(formData.email)
    } else {
      setEmailStatus('')
    }
  }, [formData.email])

  // Check username availability with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username && formData.username.length >= 3) {
        checkUsernameAvailability(formData.username)
      } else {
        setUsernameStatus('')
        setUsernameMessage('')
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.username])

  const checkEmailDomain = (email: string) => {
    const lowerEmail = email.toLowerCase()
    
    // Check for harvard.edu (including school.harvard.edu patterns)
    if (lowerEmail.endsWith('@harvard.edu') || 
        (lowerEmail.includes('@') && lowerEmail.split('@')[1].endsWith('.harvard.edu'))) {
      setEmailStatus('approved')
      return
    }
    
    // Check for sesame.org
    if (lowerEmail.endsWith('@sesame.org')) {
      setEmailStatus('approved')
      return
    }
    
    // Everything else requires guest pass
    setEmailStatus('guest')
  }

  const checkUsernameAvailability = async (username: string) => {
    setUsernameStatus('checking')
    
    try {
      const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`)
      const data = await response.json()
      
      if (data.error) {
        setUsernameStatus('invalid')
        setUsernameMessage(data.error)
      } else if (data.available) {
        setUsernameStatus('available')
        setUsernameMessage('Available')
      } else {
        setUsernameStatus('taken')
        setUsernameMessage('Already taken')
      }
    } catch (err) {
      console.error('Error checking username:', err)
      setUsernameStatus('')
    }
  }

  const isGuestRequest = emailStatus === 'guest'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate email domain
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    // Validate username
    if (usernameStatus !== 'available') {
      setError('Please choose an available username')
      setIsLoading(false)
      return
    }

    // Validate name
    if (!formData.name.trim()) {
      setError('Please enter your full name')
      setIsLoading(false)
      return
    }

    // Validate password
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

    // Validate guest-specific fields
    if (isGuestRequest) {
      if (!formData.institution || formData.institution.trim().length < 3) {
        setError('Please enter your institution/organization name')
        setIsLoading(false)
        return
      }

      if (!formData.requestReason || formData.requestReason.trim().length < 20) {
        setError('Please provide a detailed reason for access (at least 20 characters)')
        setIsLoading(false)
        return
      }
    }

    // Validate terms agreement
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
          username: formData.username,
          password: formData.password,
          name: formData.name,
          classCode: formData.classCode.toUpperCase() || null,
          affiliation: formData.affiliation,
          institution: formData.institution || null,
          requestReason: formData.requestReason || null,
          isGuestRequest,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Redirect based on response
      if (data.requiresApproval) {
        // Guest request submitted
        router.push('/academic-portal/login?guest_request=true')
      } else {
        // Auto-approved user - needs email verification
        router.push('/academic-portal/login?registered=true')
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

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1 className={styles.title}>
            {isGuestRequest ? 'Request Guest Access' : 'Manaboodle Academic Portal'}
          </h1>
          <p className={styles.subtitle}>
            {isGuestRequest 
              ? 'Submit your request for approval' 
              : 'Create your account to access exclusive tools'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.name@institution.edu"
              className={styles.input}
              required
            />
            {emailStatus === 'approved' && (
              <small className={styles.helpText} style={{color: '#10b981'}}>
                ✅ Approved domain - Proceed with signup
              </small>
            )}
            {emailStatus === 'guest' && (
              <small className={styles.helpText} style={{color: '#f59e0b'}}>
                ⚠️ Guest access required - Your request will be reviewed
              </small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username * 
              <span style={{fontSize: '0.85em', fontWeight: 'normal', marginLeft: '8px', color: '#666'}}>
                (Your public identifier)
              </span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="john_smith"
              className={styles.input}
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]{3,20}"
            />
            <small className={styles.helpText}>
              3-20 characters, letters, numbers, and underscores only
              {usernameStatus === 'checking' && ' • Checking...'}
              {usernameStatus === 'available' && <span style={{color: '#10b981'}}> • ✓ {usernameMessage}</span>}
              {usernameStatus === 'taken' && <span style={{color: '#ef4444'}}> • ✗ {usernameMessage}</span>}
              {usernameStatus === 'invalid' && <span style={{color: '#f59e0b'}}> • ⚠️ {usernameMessage}</span>}
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name *
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

          {/* Guest-only fields */}
          {isGuestRequest && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="institution" className={styles.label}>
                  Institution/Organization *
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="MIT, Stanford, Company Name, etc."
                  className={styles.input}
                  required={isGuestRequest}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="requestReason" className={styles.label}>
                  Reason for Access Request *
                </label>
                <textarea
                  id="requestReason"
                  name="requestReason"
                  value={formData.requestReason}
                  onChange={(e) => setFormData({...formData, requestReason: e.target.value})}
                  placeholder="Briefly explain why you need access to these tools (minimum 20 characters)"
                  className={styles.input}
                  rows={4}
                  required={isGuestRequest}
                  minLength={20}
                  style={{resize: 'vertical'}}
                />
                <small className={styles.helpText}>
                  {formData.requestReason.length}/20 minimum characters
                </small>
              </div>
            </>
          )}

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
              Class Code (Optional)
            </label>
            <input
              type="text"
              id="classCode"
              name="classCode"
              value={formData.classCode}
              onChange={handleInputChange}
              placeholder="e.g., T565, T566, T595"
              className={styles.input}
            />
            <small className={styles.helpText}>
              Enter if enrolled in a specific course
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
            disabled={isLoading || (usernameStatus !== 'available' && formData.username.length > 0)}
            className={styles.submitButton}
          >
            {isLoading 
              ? (isGuestRequest ? 'Submitting Request...' : 'Creating Account...') 
              : (isGuestRequest ? 'Submit Guest Access Request' : 'Create Account')
            }
          </button>

          {isGuestRequest && !isLoading && (
            <div style={{marginTop: '16px', padding: '12px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px'}}>
              <p style={{margin: 0, fontSize: '14px', color: '#0c4a6e'}}>
                ℹ️ After submission, your request will be reviewed within 24-48 hours. You'll receive an email notification about the decision.
              </p>
            </div>
          )}
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