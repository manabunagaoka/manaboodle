'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from './admin.module.css'

interface GuestPassRequest {
  id: string
  email: string
  institution: string
  requestReason: string
  status: 'pending' | 'approved' | 'denied'
  createdAt: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [requests, setRequests] = useState<GuestPassRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/academic-portal/admin/login')
      return
    }

    setUser(user)

    // Check if user is admin (direct check, no need for ManaboodleUser)
    const { data: adminData } = await supabase
      .from('AdminUser')
      .select('email')
      .eq('email', user.email)
      .single()

    if (!adminData) {
      // Not an admin - redirect to admin login
      router.push('/academic-portal/admin/login')
      return
    }

    setIsAdmin(true)
    loadRequests()
  }

  const loadRequests = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('GuestPass')
      .select('*')
      .order('createdAt', { ascending: false })

    if (!error && data) {
      setRequests(data)
    }
    setIsLoading(false)
  }

  const handleApprove = async (requestId: string, email: string) => {
    setProcessingId(requestId)
    
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        alert('Session expired. Please log in again.')
        router.push('/academic-portal/admin/login')
        return
      }
      
      const response = await fetch('/api/admin/guest-pass/approve', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ requestId, email })
      })

      const result = await response.json()

      if (response.ok) {
        alert('Guest pass approved successfully!')
        loadRequests()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      alert('Failed to approve request')
    } finally {
      setProcessingId(null)
    }
  }

  const handleDeny = async (requestId: string, email: string) => {
    if (!confirm('Are you sure you want to deny this request?')) return
    
    setProcessingId(requestId)
    
    try {
      console.log('Sending deny request:', { requestId, email })
      
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        alert('Session expired. Please log in again.')
        router.push('/academic-portal/admin/login')
        return
      }
      
      const response = await fetch('/api/admin/guest-pass/deny', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ requestId, email })
      })

      console.log('Response status:', response.status)
      
      const result = await response.json()
      console.log('Response body:', result)

      if (response.ok) {
        alert('Guest pass request denied')
        loadRequests()
      } else {
        console.error('Error response:', result)
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Catch error:', error)
      alert(`Failed to deny request: ${error}`)
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const processedRequests = requests.filter(r => r.status !== 'pending')

  return (
    <div className={styles.adminPage}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={() => router.push('/academic-portal/dashboard')}>
          Back to Portal
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2>Pending Guest Pass Requests ({pendingRequests.length})</h2>
          {pendingRequests.length === 0 ? (
            <p className={styles.emptyState}>No pending requests</p>
          ) : (
            <div className={styles.requestsList}>
              {pendingRequests.map((request) => (
                <div key={request.id} className={styles.requestCard}>
                  <div className={styles.requestHeader}>
                    <h3>{request.email}</h3>
                    <span className={styles.statusBadge}>
                      {request.status}
                    </span>
                  </div>
                  <div className={styles.requestDetails}>
                    <p><strong>Institution:</strong> {request.institution}</p>
                    <p><strong>Reason:</strong></p>
                    <p className={styles.reason}>{request.requestReason}</p>
                    <p className={styles.date}>
                      <strong>Requested:</strong> {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className={styles.actions}>
                    <button
                      onClick={() => handleApprove(request.id, request.email)}
                      disabled={processingId === request.id}
                      className={styles.approveButton}
                    >
                      {processingId === request.id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleDeny(request.id, request.email)}
                      disabled={processingId === request.id}
                      className={styles.denyButton}
                    >
                      {processingId === request.id ? 'Processing...' : 'Deny'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2>Processed Requests ({processedRequests.length})</h2>
          {processedRequests.length === 0 ? (
            <p className={styles.emptyState}>No processed requests</p>
          ) : (
            <div className={styles.requestsList}>
              {processedRequests.map((request) => (
                <div key={request.id} className={`${styles.requestCard} ${styles.processed}`}>
                  <div className={styles.requestHeader}>
                    <h3>{request.email}</h3>
                    <span className={`${styles.statusBadge} ${styles[request.status]}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className={styles.requestDetails}>
                    <p><strong>Institution:</strong> {request.institution}</p>
                    <p className={styles.date}>
                      <strong>Requested:</strong> {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
