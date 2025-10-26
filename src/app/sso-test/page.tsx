'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SSOTestContent() {
  const [logs, setLogs] = useState<Array<{time: string, message: string, type: string}>>([])
  const searchParams = useSearchParams()

  const log = (message: string, type = 'info') => {
    const time = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { time, message, type }])
  }

  const clearLogs = () => {
    setLogs([])
    log('Logs cleared', 'info')
  }

  const checkSession = () => {
    log('🔍 Checking for Manaboodle session...', 'info')
    
    if (typeof window === 'undefined') return
    
    const manaboodleKey = localStorage.getItem('manaboodle-auth-token')
    const supabaseKey = localStorage.getItem('sb-otxidzozhdnszvqbgzne-auth-token')
    
    if (manaboodleKey) {
      log('✅ Found session in manaboodle-auth-token', 'success')
      try {
        const sessionData = JSON.parse(manaboodleKey)
        log(`User: ${sessionData.user?.email || 'Unknown'}`, 'info')
        log(`Token expires: ${new Date(sessionData.expires_at * 1000).toLocaleString()}`, 'info')
      } catch (e) {
        log('⚠️ Could not parse session data', 'warning')
      }
    } else if (supabaseKey) {
      log('⚠️ Found session in old key (sb-otxidzozhdnszvqbgzne-auth-token)', 'warning')
      log('Migration should happen on next page load', 'info')
    } else {
      log('❌ No session found - user needs to log in', 'error')
    }
  }

  const simulateRizeRedirect = () => {
    log('🚀 Simulating RIZE redirect to Manaboodle...', 'info')
    log('This is what RIZE does when user clicks "Log in with Manaboodle"', 'info')
    
    const returnUrl = encodeURIComponent(window.location.href)
    const ssoUrl = `/academic-portal/login?return_url=${returnUrl}&app_name=RIZE`
    
    log(`Redirecting to: ${ssoUrl}`, 'info')
    setTimeout(() => {
      window.location.href = ssoUrl
    }, 1000)
  }

  const testSSOLogin = () => {
    const returnUrl = encodeURIComponent(window.location.href + '?sso_callback=true')
    const ssoUrl = `/academic-portal/login?return_url=${returnUrl}&app_name=TEST`
    
    log('🔐 Opening SSO login page...', 'info')
    setTimeout(() => {
      window.location.href = ssoUrl
    }, 500)
  }

  const openDebugPage = () => {
    window.open('/academic-portal/debug-session', '_blank')
  }

  const showLocalStorage = () => {
    log('📦 localStorage contents:', 'info')
    
    if (typeof window === 'undefined') return
    
    const keys = Object.keys(localStorage).filter(key => 
      key.includes('auth') || 
      key.includes('supabase') || 
      key.includes('sb-') ||
      key.includes('manaboodle')
    )
    
    if (keys.length === 0) {
      log('No auth-related keys found', 'warning')
    } else {
      keys.forEach(key => {
        const value = localStorage.getItem(key)
        log(`${key}: ${value?.substring(0, 50)}...`, 'info')
      })
    }
  }

  const clearSession = () => {
    log('🗑️ Clearing session...', 'warning')
    
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('manaboodle-auth-token')
    localStorage.removeItem('sb-otxidzozhdnszvqbgzne-auth-token')
    log('✅ Session cleared', 'success')
  }

  useEffect(() => {
    // Check if we just came back from SSO callback
    if (searchParams.get('sso_callback')) {
      log('✅ SSO Callback detected!', 'success')
      log(`sso_token: ${searchParams.get('sso_token')?.substring(0, 20)}...`, 'info')
      log(`sso_refresh: ${searchParams.get('sso_refresh')?.substring(0, 20)}...`, 'info')
      log('🎉 SSO flow completed successfully!', 'success')
    }
    
    // Initial session check
    checkSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#8B0000', marginBottom: '1rem' }}>🔐 Manaboodle SSO Test Page</h1>
        <p>This page simulates how RIZE will interact with Manaboodle's SSO system.</p>

        <div style={{
          margin: '2rem 0',
          padding: '1.5rem',
          background: '#f9f9f9',
          borderRadius: '8px',
          borderLeft: '4px solid #8B0000'
        }}>
          <h3>Step 1: Check Current Session</h3>
          <p>First, let's check if you have an active Manaboodle session:</p>
          <button onClick={checkSession} style={buttonStyle}>Check Session</button>
          <button onClick={clearLogs} style={buttonStyle}>Clear Logs</button>
        </div>

        <div style={{
          margin: '2rem 0',
          padding: '1.5rem',
          background: '#f9f9f9',
          borderRadius: '8px',
          borderLeft: '4px solid #8B0000'
        }}>
          <h3>Step 2: Simulate RIZE Redirect</h3>
          <p>Click this button to simulate what happens when RIZE redirects to Manaboodle:</p>
          <button onClick={simulateRizeRedirect} style={buttonStyle}>Simulate RIZE → Manaboodle</button>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            This will redirect you to: <code style={{ background: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>/academic-portal/login?return_url=...</code>
          </p>
        </div>

        <div style={{
          margin: '2rem 0',
          padding: '1.5rem',
          background: '#f9f9f9',
          borderRadius: '8px',
          borderLeft: '4px solid #8B0000'
        }}>
          <h3>Step 3: Test Direct SSO Login</h3>
          <p>Or test the SSO flow directly:</p>
          <button onClick={testSSOLogin} style={buttonStyle}>Go to SSO Login with Return URL</button>
        </div>

        <div style={{
          margin: '2rem 0',
          padding: '1.5rem',
          background: '#f9f9f9',
          borderRadius: '8px',
          borderLeft: '4px solid #8B0000'
        }}>
          <h3>Debug Tools</h3>
          <button onClick={openDebugPage} style={buttonStyle}>Open Debug Session Page</button>
          <button onClick={showLocalStorage} style={buttonStyle}>Show localStorage</button>
          <button onClick={clearSession} style={buttonStyle}>Clear Session (Test Logout)</button>
        </div>

        <div style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '1rem',
          borderRadius: '6px',
          fontFamily: '"Courier New", monospace',
          fontSize: '0.9rem',
          maxHeight: '400px',
          overflowY: 'auto',
          marginTop: '1rem'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: '#666' }}>No logs yet. Click a button to start testing.</div>
          ) : (
            logs.map((entry, i) => (
              <div key={i} style={{
                margin: '0.25rem 0',
                padding: '0.25rem',
                color: entry.type === 'success' ? '#4ade80' :
                       entry.type === 'error' ? '#f87171' :
                       entry.type === 'warning' ? '#fbbf24' :
                       '#60a5fa'
              }}>
                [{entry.time}] {entry.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function SSOTestPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Loading SSO Test Page...
      </div>
    }>
      <SSOTestContent />
    </Suspense>
  )
}

const buttonStyle = {
  background: '#8B0000',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
  marginRight: '0.5rem',
  marginBottom: '0.5rem'
}
