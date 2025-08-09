'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DebugPage() {
  const [status, setStatus] = useState('')

  const clearAccess = () => {
    localStorage.removeItem('manaboodle_edu_access')
    localStorage.removeItem('manaboodle_edu_email')
    
    // Clear cookie via API
    fetch('/api/clear-access', { method: 'POST' })
      .then(() => {
        setStatus('✅ All access tokens cleared')
        setTimeout(() => setStatus(''), 3000)
      })
      .catch(() => {
        setStatus('❌ Error clearing access')
      })
  }

  const checkAccess = () => {
    const localStorage_access = localStorage.getItem('manaboodle_edu_access')
    const localStorage_email = localStorage.getItem('manaboodle_edu_email')
    
    setStatus(`Access Token: ${localStorage_access || '❌ None'}
Email: ${localStorage_email || '❌ None'}
Status: ${localStorage_access ? '✅ Should have access' : '🚫 No access - will redirect'}`)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/tools" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to Tools
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Access Debug Tools</h1>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-blue-800 mb-2">📋 Step 1: Reset Access</h3>
          <button
            onClick={clearAccess}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 font-medium"
          >
            🗑️ Clear All Access (Reset for Testing)
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-green-800 mb-2">📋 Step 2: Check Status</h3>
          <button
            onClick={checkAccess}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium"
          >
            🔍 Check Current Access Status
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-purple-800 mb-2">📋 Step 3: Test Flow</h3>
          <div className="space-y-2">
            <Link 
              href="/tools/edu"
              className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 text-center font-medium"
            >
              📝 Go to Edu Access Form (Fill this first!)
            </Link>
            <Link 
              href="/tools/clusters"
              className="block w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 text-center font-medium"
            >
              🧪 Test Access to Clusters (Try after filling form)
            </Link>
          </div>
        </div>
      </div>

      {status && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <pre className="text-sm whitespace-pre-wrap">{status}</pre>
        </div>
      )}
      
      <div className="mt-8 space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">🧪 Testing Flow:</h3>
          <ol className="text-yellow-700 text-sm space-y-1">
            <li><strong>Step 1:</strong> Click "Clear All Access" button above</li>
            <li><strong>Step 2:</strong> Click "Test Access to Clusters" - should redirect you to edu gate</li>
            <li><strong>Step 3:</strong> Fill out the edu form with a .edu email</li>
            <li><strong>Step 4:</strong> Get redirected to exclusive clusters page</li>
            <li><strong>Step 5:</strong> See VIP welcome message with university name</li>
          </ol>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">✅ What Should Happen:</h3>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• Without access: Automatic redirect to /tools/edu with warning</li>
            <li>• With access: See exclusive clusters page with EXCLUSIVE badge</li>
            <li>• Form submission: Server verification + cookie setting</li>
            <li>• University recognition: Shows institution name from email</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
