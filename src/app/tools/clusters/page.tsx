'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClustersRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the actual clusters app in promarketplace
    router.replace('/tools/promarketplace/clusters');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center', color: '#6b7280' }}>
        <div style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Redirecting to Clusters...</div>
        <div style={{ fontSize: '0.875rem' }}>Loading advanced pattern analysis tool</div>
      </div>
    </div>
  );
}
