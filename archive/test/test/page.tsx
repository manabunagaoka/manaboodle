import Link from 'next/link'

export default function TestToolsPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: '#1f2937' }}>Tools (Test Version)</h1>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Link 
          href="/tools/edu" 
          style={{ 
            padding: '1.5rem', 
            border: '1px solid #d1d5db', 
            borderRadius: '8px',
            textDecoration: 'none',
            color: 'inherit',
            backgroundColor: '#f9fafb',
            display: 'block'
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
            University Access Gate
          </h3>
          <p style={{ margin: '0', color: '#6b7280', fontSize: '0.9rem' }}>
            Request access to research tools with your .edu email
          </p>
        </Link>

        <Link 
          href="/tools/clusters" 
          style={{ 
            padding: '1.5rem', 
            border: '1px solid #d1d5db', 
            borderRadius: '8px',
            textDecoration: 'none',
            color: 'inherit',
            backgroundColor: '#f9fafb',
            display: 'block'
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
            Research Clusters Analysis
            <span style={{ 
              backgroundColor: '#fbbf24', 
              color: '#92400e', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '12px', 
              fontSize: '0.75rem', 
              marginLeft: '0.5rem' 
            }}>
              EXCLUSIVE
            </span>
          </h3>
          <p style={{ margin: '0', color: '#6b7280', fontSize: '0.9rem' }}>
            Advanced AI-powered clustering for research data analysis
          </p>
        </Link>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>Test Version</h4>
        <p style={{ margin: '0', color: '#1e40af', fontSize: '0.9rem' }}>
          This is a simplified version to test hydration issues. 
          <Link href="/tools" style={{ color: '#2563eb', marginLeft: '0.5rem' }}>
            Go to full version
          </Link>
        </p>
      </div>
    </div>
  )
}
