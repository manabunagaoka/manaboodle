'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './edu.module.css'
import toolStyles from '../tools.module.css'

interface EduFormData {
  fullName: string
  universityEmail: string
  organization: string
  researchFocus: string
  feedbackConsent: boolean
  betaInterest: boolean
  notificationsConsent: boolean
  ageVerification: boolean
}

export default function EduAccessGate() {
  const [showForm, setShowForm] = useState(false)
  const [showEmailCheck, setShowEmailCheck] = useState(false)
  const [emailCheckValue, setEmailCheckValue] = useState('')
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailCheckError, setEmailCheckError] = useState('')
  const [formData, setFormData] = useState<EduFormData>({
    fullName: '',
    universityEmail: '',
    organization: '',
    researchFocus: '',
    feedbackConsent: false,
    betaInterest: false,
    notificationsConsent: false,
    ageVerification: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof EduFormData, string>>>({})
  const [showAccessDenied, setShowAccessDenied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [emailVerifying, setEmailVerifying] = useState(false)
  const [checkingExistingAccess, setCheckingExistingAccess] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if user already has access
  const checkExistingAccess = async () => {
    const existingEmail = localStorage.getItem('manaboodle_edu_email')
    
    if (!existingEmail) {
      setCheckingExistingAccess(false)
      return
    }

    try {
      const response = await fetch('/api/edu-access/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: existingEmail })
      })

      const result = await response.json()
      
      if (response.ok && result.hasAccess) {
        console.log('✅ User already has access, redirecting to clusters...')
        localStorage.setItem('manaboodle_edu_access', 'granted')
        router.push('/tools/clusters')
        return
      } else {
        // Clear invalid access
        localStorage.removeItem('manaboodle_edu_access')
        localStorage.removeItem('manaboodle_edu_email')
      }
    } catch (error) {
      console.log('Could not verify existing access:', error)
      // Don't block user if check fails
    }
    
    setCheckingExistingAccess(false)
  }

  useEffect(() => {
    if (!mounted) return

    // Check if user was redirected due to unauthorized access
    const reason = searchParams?.get('reason')
    if (reason === 'access_required') {
      setShowAccessDenied(true)
    }

    // Check for existing access first
    checkExistingAccess()
  }, [searchParams, mounted, router])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EduFormData, string>> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.universityEmail.trim()) {
      newErrors.universityEmail = 'University email is required'
    } else {
      const email = formData.universityEmail.toLowerCase().trim()
      
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.universityEmail = 'Please enter a valid email address'
      } else if (!email.endsWith('.edu')) {
        newErrors.universityEmail = 'Must use a .edu email address'
      } else {
        // Check for obvious fake patterns
        const domain = email.split('@')[1]
        const suspiciousDomains = [
          'fake.edu', 'test.edu', 'example.edu', 'dummy.edu', 
          'notreal.edu', '123.edu', 'xyz.edu'
        ]
        
        if (suspiciousDomains.includes(domain)) {
          newErrors.universityEmail = 'Please use your actual university email address - fake emails will result in permanent access loss forever'
        }
      }
    }

    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization is required'
    }

    if (!formData.researchFocus.trim()) {
      newErrors.researchFocus = 'Research focus is required'
    }

    if (!formData.ageVerification) {
      newErrors.ageVerification = 'Age verification is required'
    }

    if (!formData.notificationsConsent) {
      newErrors.notificationsConsent = 'Consent to receive notifications is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Check if email is already registered
  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!emailCheckValue.trim()) {
      setEmailCheckError('Please enter your email address')
      return
    }
    
    console.log('Checking email:', emailCheckValue.trim()) // Debug log
    
    try {
      const response = await fetch('/api/check-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailCheckValue.trim() }),
      })
      
      const data = await response.json()
      console.log('API response:', { status: response.status, ok: response.ok, data }) // Debug log
      
      if (response.ok && data.hasAccess) {
        // User has access, redirect to clusters
        console.log('User has access, redirecting to clusters') // Debug log
        localStorage.setItem('manaboodle_edu_access', 'granted')
        localStorage.setItem('manaboodle_edu_email', emailCheckValue.trim())
        window.location.href = '/tools/clusters'
      } else {
        // User doesn't have access, show full form
        console.log('User does not have access, showing form') // Debug log
        setShowEmailCheck(false)
        setShowForm(true)
        setFormData({ ...formData, universityEmail: emailCheckValue.trim() })
      }
    } catch (error) {
      console.error('Error checking access:', error)
      setEmailCheckError('Something went wrong. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/edu-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          universityEmail: formData.universityEmail,
          organization: formData.organization,
          researchFocus: formData.researchFocus,
          feedbackConsent: formData.feedbackConsent,
          betaInterest: formData.betaInterest,
          notificationsConsent: formData.notificationsConsent,
          ageVerification: formData.ageVerification,
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      console.log('✅ Edu access granted:', result)

      // Store access in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('manaboodle_edu_access', 'granted')
        localStorage.setItem('manaboodle_edu_email', formData.universityEmail)
      }
      
      // Smooth redirect without popup
      router.push('/tools/clusters')

    } catch (error) {
      console.error('❌ Error submitting form:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`There was an error processing your request: ${errorMessage}\n\nPlease check the console for more details and try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof EduFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Email verification handler
  const verifyEmail = async (email: string) => {
    if (!email || !email.includes('@') || emailVerifying) return

    setEmailVerifying(true)
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const result = await response.json()
      
      if (!result.valid) {
        setErrors(prev => ({
          ...prev,
          universityEmail: result.reason || 'Email verification failed'
        }))
      } else {
        // Clear any existing email errors
        setErrors(prev => ({
          ...prev,
          universityEmail: undefined
        }))
      }
    } catch (error) {
      console.log('Email verification failed:', error)
      // Don't block the form if verification service is down
    } finally {
      setEmailVerifying(false)
    }
  }

  // Prevent hydration issues by not rendering until mounted
  if (!mounted || checkingExistingAccess) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F766E, #14B8A6, #06B6D4)',
        color: 'white',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Checking access...</p>
        </div>
      </div>
    )
  }

  // Show email check form for returning users (CHECK THIS FIRST)
  if (showEmailCheck) {
    return (
      <div className={styles.eduAccessPage}>
        <div className={styles.container}>
          <div className="max-w-2xl mx-auto">
            <div className={styles.header}>
              <Link href="/tools" className={styles.backLink}>
                ← Back to Tools
              </Link>
              <h1 className={styles.title}>
                Welcome Back!
              </h1>
              <p className={styles.subtitle}>
                Enter your university email to access your pro tools
              </p>
            </div>

            <div className={styles.formCard}>
              <form onSubmit={handleEmailCheck} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="emailCheck" className={styles.formLabel}>
                    University Email *
                  </label>
                  <input
                    type="email"
                    id="emailCheck"
                    value={emailCheckValue}
                    onChange={(e) => {
                      setEmailCheckValue(e.target.value)
                      setEmailCheckError('')
                    }}
                    className={`${styles.formInput} ${emailCheckError ? styles.error : ''}`}
                    placeholder="your.name@university.edu"
                    disabled={isCheckingEmail}
                  />
                  {emailCheckError && <p className={styles.errorText}>{emailCheckError}</p>}
                  <p className={styles.helpText}>Must end with .edu</p>
                </div>

                <button
                  type="submit"
                  disabled={isCheckingEmail}
                  className={styles.submitButton}
                >
                  {isCheckingEmail ? 'Checking Access...' : 'Access My Tools'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailCheck(false)
                      setShowForm(true)
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6B7280',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    First time? Complete registration form instead
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show transition page first
  if (!showForm) {
    return (
      <div className={toolStyles.toolPage}>
        <Link href="/tools" className={toolStyles.backLink}>← Back to Tools</Link>
        
        <div style={{
          minHeight: 'calc(100vh - 200px)',
          background: 'linear-gradient(135deg, #0F766E, #14B8A6, #06B6D4)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          borderRadius: '16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
        }}>
          <div style={{
            maxWidth: '800px',
            textAlign: 'center',
            animation: 'fadeInUp 0.8s ease-out',
          }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
              Coming Soon
            </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            background: 'linear-gradient(45deg, #ffffff, #f0fdfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Welcome to Pro Marketplace<br />
            <span style={{ opacity: 0.8 }}>Tools That Actually Matter</span>
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            opacity: 0.9,
            lineHeight: 1.4,
            marginBottom: '3rem',
            fontWeight: 400,
          }}>
            The free tools you love are just the beginning. Our Pro Marketplace transforms 
            pattern recognition into a whole new intelligence that drives real decisions and real results for business, education, or even dating match, all powered by Manaboodle Synchronicity Engine.
          </p>

          <div style={{ marginTop: '4rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => setShowEmailCheck(true)}
                style={{
                  display: 'inline-block',
                  background: 'white',
                  color: '#0F766E',
                  padding: '1rem 2.5rem',
                  borderRadius: '50px',
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  animation: 'pulse 2s infinite',
                }} onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                  target.style.background = '#f0fdfa';
                }} onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                  target.style.background = 'white';
                }}>
                I'm Already Registered
              </button>
              
              <button
                onClick={() => setShowForm(true)}
                style={{
                  display: 'inline-block',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }} onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'rgba(255, 255, 255, 0.3)';
                  target.style.transform = 'translateY(-1px)';
                }} onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'rgba(255, 255, 255, 0.2)';
                  target.style.transform = 'translateY(0)';
                }}>
                First Time Registration
              </button>
            </div>
            
            <p style={{
              opacity: 0.8,
              fontSize: '0.9375rem',
              marginTop: '1.5rem',
            }}>
              Be the first to know when Pro tools launch.<br />
              Early access members get exclusive pricing and features.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.eduAccessPage}>
      <div className={styles.container}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className={styles.header}>
            <Link href="/tools" className={styles.backLink}>
              ← Back to Tools
            </Link>
            <h1 className={styles.title}>
              Exclusive Preview
            </h1>
            <p className={styles.subtitle}>
              Access professional pro tools with your university credentials
            </p>
            
            {/* Access Denied Alert */}
            {showAccessDenied && (
              <div className={styles.accessDeniedAlert}>
                <div className={styles.alertContent}>
                  <div className={styles.alertIcon}>
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-7-2a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                  </div>
                  <div className={styles.alertText}>
                    <h3>University Access Required</h3>
                    <p>
                      You need verified university access to use our pro tools. 
                      Please complete the form below with your .edu email.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Card */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Full Name */}
              <div className={styles.formGroup}>
                <label htmlFor="fullName" className={styles.formLabel}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`${styles.formInput} ${errors.fullName ? styles.error : ''}`}
                  placeholder="Your full name"
                />
                {errors.fullName && <p className={styles.errorText}>{errors.fullName}</p>}
              </div>

              {/* University Email */}
              <div className={styles.formGroup}>
                <label htmlFor="universityEmail" className={styles.formLabel}>
                  University Email *
                </label>
                <input
                  type="email"
                  id="universityEmail"
                  value={formData.universityEmail}
                  onChange={(e) => handleInputChange('universityEmail', e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      verifyEmail(e.target.value.trim())
                    }
                  }}
                  className={`${styles.formInput} ${errors.universityEmail ? styles.error : ''}`}
                  placeholder="your.name@university.edu"
                  disabled={emailVerifying}
                />
                {emailVerifying && (
                  <div className={styles.emailVerification}>
                    <div className={styles.spinner}></div>
                    <span>Verifying email...</span>
                  </div>
                )}
                {errors.universityEmail && <p className={styles.errorText}>{errors.universityEmail}</p>}
                <p className={styles.helpText}>Must end with .edu</p>
                <div className={styles.emailWarning}>
                  <p>
                    ⚠️ <strong>Important:</strong> We may verify your email address. Using a fake or inactive .edu email 
                    will prevent you from receiving important updates and may result in loss of access to pro tools.
                  </p>
                </div>
              </div>

              {/* Organization */}
              <div className={styles.formGroup}>
                <label htmlFor="organization" className={styles.formLabel}>
                  Organization *
                </label>
                <input
                  type="text"
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className={`${styles.formInput} ${errors.organization ? styles.error : ''}`}
                  placeholder="Harvard Business School, Harvard Graduate School of Education, MIT Media Lab, etc."
                />
                {errors.organization && <p className={styles.errorText}>{errors.organization}</p>}
              </div>

              {/* Research Focus */}
              <div className={styles.formGroup}>
                <label htmlFor="researchFocus" className={styles.formLabel}>
                  Research Focus *
                </label>
                <textarea
                  id="researchFocus"
                  value={formData.researchFocus}
                  onChange={(e) => handleInputChange('researchFocus', e.target.value)}
                  rows={3}
                  className={`${styles.formTextarea} ${errors.researchFocus ? styles.error : ''}`}
                  placeholder="Brief description of your research area or focus..."
                />
                {errors.researchFocus && <p className={styles.errorText}>{errors.researchFocus}</p>}
              </div>

              {/* Checkboxes */}
              <div className={styles.checkboxSection}>
                {/* LEGAL: Age Verification - Must be first */}
                <div className={styles.ageVerificationGroup}>
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="ageVerification"
                      checked={formData.ageVerification}
                      onChange={(e) => handleInputChange('ageVerification', e.target.checked)}
                      className={`${styles.checkboxInput} ${errors.ageVerification ? styles.error : ''}`}
                    />
                    <label htmlFor="ageVerification" className={styles.checkboxLabel}>
                      I confirm that I am 18 years old or older *
                    </label>
                  </div>
                  {errors.ageVerification && (
                    <p className={styles.errorText} style={{ marginLeft: '2rem' }}>{errors.ageVerification}</p>
                  )}
                  <p className={styles.legalNote}>
                    Required by US privacy laws (COPPA, CCPA) for data collection and processing
                  </p>
                </div>

                {/* Other consents */}
                <div className={styles.otherCheckboxes}>
                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="feedbackConsent"
                    checked={formData.feedbackConsent}
                    onChange={(e) => handleInputChange('feedbackConsent', e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <label htmlFor="feedbackConsent" className={styles.checkboxLabel}>
                    I consent to provide feedback on the pro tools to help improve them
                  </label>
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="betaInterest"
                    checked={formData.betaInterest}
                    onChange={(e) => handleInputChange('betaInterest', e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <label htmlFor="betaInterest" className={styles.checkboxLabel}>
                    I'm interested in beta testing new pro tools and features
                  </label>
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="notificationsConsent"
                    checked={formData.notificationsConsent}
                    onChange={(e) => handleInputChange('notificationsConsent', e.target.checked)}
                    className={`${styles.checkboxInput} ${errors.notificationsConsent ? styles.error : ''}`}
                  />
                  <label htmlFor="notificationsConsent" className={styles.checkboxLabel}>
                    I consent to receive notifications about pro tools and updates from Manaboodle. Unsubscribe available at any time. *
                  </label>
                </div>
                {errors.notificationsConsent && (
                  <p className={styles.errorText} style={{ marginLeft: '2rem' }}>{errors.notificationsConsent}</p>
                )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Processing...' : 'Access Clusters'}
              </button>
            </form>

            {/* Info */}
            <div className={styles.infoSection}>
              <div className={styles.infoContent}>
                <div className={styles.infoText}>
                  <h4>Exclusive Preview: Clusters</h4>
                  <p>
                    Advanced clustering tool that we call "Clusters" for analyzing JTBD interview responses and research insights. Perfect for qualitative research and pattern discovery. Built by someone who learned to do this analysis the hard way at Harvard—so you don't have to. Available only to verified academic institutions. (Don't tell anyone, but future versions will help you find your perfect co-founder or even dating match!)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
