'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ResetAuthPage() {
  const [cleared, setCleared] = useState(false)

  const clearAuth = () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('manaboodle_edu_access')
      localStorage.removeItem('manaboodle_edu_email')
    }
    
    // Clear cookies via API
    fetch('/api/clear-auth', { method: 'POST' })
      .then(() => {
        setCleared(true)
      })
      .catch(console.error)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🧹 Reset Authentication</h1>
      <p>Clear all authentication cookies and localStorage to test the flow from scratch.</p>
      
      {!cleared ? (
        <div>
          <button 
            onClick={clearAuth}
            style={{
              background: '#dc2626',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Clear All Authentication
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: '#059669', fontWeight: 'bold' }}>✅ Authentication cleared!</p>
          <div style={{ marginTop: '1rem' }}>
            <Link 
              href="/tools/edu" 
              style={{ 
                background: '#2563eb', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '0.5rem', 
                textDecoration: 'none',
                display: 'inline-block',
                marginRight: '1rem'
              }}
            >
              Test University Form
            </Link>
            <Link 
              href="/tools/clusters" 
              style={{ 
                background: '#7c3aed', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '0.5rem', 
                textDecoration: 'none',
                display: 'inline-block',
                marginRight: '1rem'
              }}
            >
              Test Clusters (Should Redirect)
            </Link>
            <Link 
              href="/tools" 
              style={{ 
                background: '#059669', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '0.5rem', 
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Back to Tools
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
