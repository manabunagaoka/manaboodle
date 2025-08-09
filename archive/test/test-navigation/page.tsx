import Link from 'next/link'

export default function TestNavigationPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🧪 Navigation Test</h1>
      
      <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2>Test These Navigation Paths:</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Test 1: Tools to Form */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
          <h3>1. Tools → Form Navigation</h3>
          <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>
            This should work without route conflicts
          </p>
          <Link 
            href="/tools" 
            style={{ 
              display: 'inline-block',
              padding: '0.5rem 1rem', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px',
              marginRight: '0.5rem'
            }}
          >
            Go to Tools Page
          </Link>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            → Click "Research Clusters Analysis" → Should go to form
          </span>
        </div>

        {/* Test 2: Form to Clusters */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
          <h3>2. Form → Clusters Navigation</h3>
          <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>
            Submit form and verify redirect works
          </p>
          <Link 
            href="/tools/edu" 
            style={{ 
              display: 'inline-block',
              padding: '0.5rem 1rem', 
              backgroundColor: '#10b981', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px',
              marginRight: '0.5rem'
            }}
          >
            Go to Form
          </Link>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            → Fill form → Submit → Should redirect to clusters
          </span>
        </div>

        {/* Test 3: Clusters Back to Tools */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
          <h3>3. Clusters → Tools Navigation</h3>
          <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>
            This was causing hydration errors - now fixed
          </p>
          <Link 
            href="/tools/clusters" 
            style={{ 
              display: 'inline-block',
              padding: '0.5rem 1rem', 
              backgroundColor: '#8b5cf6', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px',
              marginRight: '0.5rem'
            }}
          >
            Go to Clusters
          </Link>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            → Click "← Back to Tools" → Should work without errors
          </span>
        </div>

        {/* Test 4: Direct Tools Navigation */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
          <h3>4. Safe Tools Page Test</h3>
          <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>
            Test the simplified version vs full version
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link 
              href="/tools/test" 
              style={{ 
                display: 'inline-block',
                padding: '0.5rem 1rem', 
                backgroundColor: '#f59e0b', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '4px'
              }}
            >
              Simple Version
            </Link>
            <Link 
              href="/tools" 
              style={{ 
                display: 'inline-block',
                padding: '0.5rem 1rem', 
                backgroundColor: '#ef4444', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '4px'
              }}
            >
              Full Version
            </Link>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '8px', marginTop: '2rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Expected Results:</h3>
        <ul style={{ margin: '0', paddingLeft: '1.2rem' }}>
          <li>✅ No route compilation errors</li>
          <li>✅ No hydration errors on clusters page</li>
          <li>✅ Smooth navigation between all pages</li>
          <li>✅ Back button works from clusters to tools</li>
        </ul>
      </div>
    </div>
  )
}
