'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AuthStatus {
  localStorage: {
    eduAccess: string | null
    eduEmail: string | null
  }
  cookies: {
    hasCookie: boolean
  }
  api: {
    status: 'loading' | 'success' | 'error'
    data: any
    error: string | null
  }
}

export default function TestAuthPage() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    localStorage: { eduAccess: null, eduEmail: null },
    cookies: { hasCookie: false },
    api: { status: 'loading', data: null, error: null }
  })
  const [testEmail, setTestEmail] = useState('test@harvard.edu')

  useEffect(() => {
    // Check localStorage
    const eduAccess = localStorage.getItem('manaboodle_edu_access')
    const eduEmail = localStorage.getItem('manaboodle_edu_email')
    
    // Check cookies (simplified)
    const hasCookie = document.cookie.includes('manaboodle_edu_access')
    
    setAuthStatus(prev => ({
      ...prev,
      localStorage: { eduAccess, eduEmail },
      cookies: { hasCookie }
    }))
    
    // Test API
    testApiAccess(eduEmail || testEmail)
  }, [])

  const testApiAccess = async (email: string) => {
    try {
      const response = await fetch('/api/verify-edu-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      
      setAuthStatus(prev => ({
        ...prev,
        api: {
          status: response.ok ? 'success' : 'error',
          data,
          error: response.ok ? null : data.error || 'API Error'
        }
      }))
    } catch (error) {
      setAuthStatus(prev => ({
        ...prev,
        api: {
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }))
    }
  }

  const clearAuth = () => {
    localStorage.removeItem('manaboodle_edu_access')
    localStorage.removeItem('manaboodle_edu_email')
    fetch('/api/clear-auth', { method: 'POST' })
    location.reload()
  }

  const testDifferentEmail = () => {
    testApiAccess(testEmail)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/tools" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Tools</Link>
      </div>
      
      <h1>🧪 Authentication Test Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Test and debug the authentication flow for university access.
      </p>

      {/* LocalStorage Status */}
      <div style={{ 
        background: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '1.5rem', 
        marginBottom: '1.5rem' 
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>📱 LocalStorage Status</h3>
        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
          <div>
            <strong>edu_access:</strong> 
            <span style={{ 
              color: authStatus.localStorage.eduAccess ? '#059669' : '#dc2626',
              marginLeft: '0.5rem'
            }}>
              {authStatus.localStorage.eduAccess || 'Not set'}
            </span>
          </div>
          <div>
            <strong>edu_email:</strong> 
            <span style={{ 
              color: authStatus.localStorage.eduEmail ? '#059669' : '#dc2626',
              marginLeft: '0.5rem'
            }}>
              {authStatus.localStorage.eduEmail || 'Not set'}
            </span>
          </div>
        </div>
      </div>

      {/* Cookies Status */}
      <div style={{ 
        background: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '1.5rem', 
        marginBottom: '1.5rem' 
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>🍪 Cookies Status</h3>
        <div>
          <strong>manaboodle_edu_access:</strong> 
          <span style={{ 
            color: authStatus.cookies.hasCookie ? '#059669' : '#dc2626',
            marginLeft: '0.5rem'
          }}>
            {authStatus.cookies.hasCookie ? 'Present' : 'Not found'}
          </span>
        </div>
      </div>

      {/* API Status */}
      <div style={{ 
        background: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '1.5rem', 
        marginBottom: '1.5rem' 
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>🔗 API Verification Status</h3>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Status:</strong> 
          <span style={{ 
            color: authStatus.api.status === 'success' ? '#059669' : 
                   authStatus.api.status === 'error' ? '#dc2626' : '#6b7280',
            marginLeft: '0.5rem'
          }}>
            {authStatus.api.status === 'loading' ? 'Testing...' : 
             authStatus.api.status === 'success' ? 'Success' : 'Error'}
          </span>
        </div>
        
        {authStatus.api.data && (
          <div style={{ marginBottom: '1rem' }}>
            <strong>Response:</strong>
            <pre style={{ 
              background: '#f1f5f9',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              overflow: 'auto',
              marginTop: '0.5rem'
            }}>
              {JSON.stringify(authStatus.api.data, null, 2)}
            </pre>
          </div>
        )}
        
        {authStatus.api.error && (
          <div style={{ color: '#dc2626' }}>
            <strong>Error:</strong> {authStatus.api.error}
          </div>
        )}
      </div>

      {/* Test Controls */}
      <div style={{ 
        background: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '1.5rem', 
        marginBottom: '1.5rem' 
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>🎮 Test Controls</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Test Different Email:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}
              placeholder="email@university.edu"
            />
            <button
              onClick={testDifferentEmail}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Test API
            </button>
          </div>
        </div>
        
        <button
          onClick={clearAuth}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          🧹 Clear All Authentication
        </button>
      </div>

      {/* Quick Links */}
      <div style={{ 
        background: '#f0f9ff', 
        border: '1px solid #bae6fd', 
        borderRadius: '8px', 
        padding: '1.5rem' 
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#0c4a6e' }}>🔗 Quick Test Links</h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <Link href="/tools/edu" style={{ color: '#2563eb', textDecoration: 'none' }}>
            → University Access Form
          </Link>
          <Link href="/tools/clusters" style={{ color: '#2563eb', textDecoration: 'none' }}>
            → Clusters Tool (Requires Auth)
          </Link>
          <Link href="/tools" style={{ color: '#2563eb', textDecoration: 'none' }}>
            → Tools Page
          </Link>
        </div>
      </div>
    </div>
  )
}
