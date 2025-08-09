import Link from 'next/link'

export default function SimpleToolsPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Simple Tools Page</h1>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        <Link href="/tools/edu" style={{ 
          padding: '1rem', 
          border: '1px solid #ccc', 
          borderRadius: '8px',
          textDecoration: 'none',
          color: 'inherit'
        }}>
          University Access Gate
        </Link>
        <Link href="/tools/clusters" style={{ 
          padding: '1rem', 
          border: '1px solid #ccc', 
          borderRadius: '8px',
          textDecoration: 'none',
          color: 'inherit'
        }}>
          Clusters (Requires University Access)
        </Link>
        <Link href="/tools/test-hydration" style={{ 
          padding: '1rem', 
          border: '1px solid #ccc', 
          borderRadius: '8px',
          textDecoration: 'none',
          color: 'inherit'
        }}>
          Test Hydration
        </Link>
      </div>
    </div>
  )
}
