'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './admin.module.css'

interface User {
  id: string
  name: string
  email: string
  classCode: string | null
  affiliation: string
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [adminAuth, setAdminAuth] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [error, setError] = useState('')

  // Simple admin password (in real app, this would be server-side)
  const ADMIN_PASSWORD = 'harvard2024'

  useEffect(() => {
    // Check if admin is already authenticated
    const adminSession = localStorage.getItem('adminAuthenticated')
    if (adminSession === 'true') {
      setAdminAuth(true)
      loadUsers()
    }
    setIsLoading(false)
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'x-admin-password': ADMIN_PASSWORD,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users')
    }
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminAuth(true)
      localStorage.setItem('adminAuthenticated', 'true')
      loadUsers()
      setError('')
    } else {
      setError('Invalid admin password')
    }
  }

  const handleLogout = () => {
    setAdminAuth(false)
    localStorage.removeItem('adminAuthenticated')
    setAdminPassword('')
  }

  const deleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/users?id=${userId}`, {
          method: 'DELETE',
          headers: {
            'x-admin-password': ADMIN_PASSWORD,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to delete user')
        }

        // Refresh the user list
        await loadUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Failed to delete user')
      }
    }
  }

  // Remove toggleUserStatus function as we don't need it anymore

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading admin panel...</p>
      </div>
    )
  }

  if (!adminAuth) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.loginContainer}>
          <div className={styles.adminHeader}>
            <h1 className={styles.title}>Admin Panel</h1>
            <p className={styles.subtitle}>Manaboodle Academic Portal Administration</p>
          </div>

          <form onSubmit={handleAdminLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                className={styles.input}
                required
              />
            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <button type="submit" className={styles.loginButton}>
              Access Admin Panel
            </button>
          </form>

          <div className={styles.backLink}>
            <Link href="/tools">← Back to Tools</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.adminDashboard}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <div>
              <h1 className={styles.dashboardTitle}>Admin Panel</h1>
              <p className={styles.dashboardSubtitle}>Manaboodle Academic Portal - User Management</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.statsSection}>
            <div className={styles.statCard}>
              <h3>Total Users</h3>
              <p className={styles.statNumber}>{users.length}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Affiliations</h3>
              <p className={styles.statNumber}>{new Set(users.map(u => u.affiliation)).size}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Class Codes</h3>
              <p className={styles.statNumber}>{users.filter(u => u.classCode).length}</p>
            </div>
          </div>

          <div className={styles.usersSection}>
            <h2 className={styles.sectionTitle}>Registered Users</h2>
            
            {users.length === 0 ? (
              <div className={styles.noUsers}>
                <p>No users registered yet.</p>
              </div>
            ) : (
              <div className={styles.usersTable}>
                <div className={styles.tableHeader}>
                  <span>Name</span>
                  <span>Email</span>
                  <span>Class Code</span>
                  <span>Affiliation</span>
                  <span>Registered</span>
                  <span>Actions</span>
                </div>
                
                {users.map((user) => (
                  <div key={user.id} className={styles.tableRow}>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.userEmail}>{user.email}</span>
                    <span className={styles.classCode}>
                      <span className={styles.classBadge}>{user.classCode || 'N/A'}</span>
                    </span>
                    <span className={styles.userStatus}>
                      <span className={`${styles.statusBadge} ${styles.active}`}>
                        {user.affiliation}
                      </span>
                    </span>
                    <span className={styles.registeredDate}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    <div className={styles.actions}>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.backSection}>
            <Link href="/tools" className={styles.backButton}>
              ← Back to Tools
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}