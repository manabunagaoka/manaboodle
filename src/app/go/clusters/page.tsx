'use client';

import { useEffect, useState } from 'react';

export default function ClustersRedirect() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');
  
  useEffect(() => {
    const statuses = [
      'Initializing...',
      'Connecting to Clusters...',
      'Loading pattern engine...',
      'Preparing workspace...',
      'Almost ready...'
    ];
    
    let statusIndex = 0;
    
    // Update status text
    const statusInterval = setInterval(() => {
      if (statusIndex < statuses.length - 1) {
        statusIndex++;
        setStatus(statuses[statusIndex]);
      }
    }, 1000);
    
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(statusInterval);
          setStatus('Launching Clusters...');
          
          // Redirect after animation completes
          setTimeout(() => {
            window.location.href = 'https://clusters-git-main-manabunagaokas-projects.vercel.app?_vercel_share=H0UCEGCTYBqbBKWTg3cMSxFYhV7PrXQf';
          }, 500);
          
          return 100;
        }
        return prev + 1.5;
      });
    }, 75);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#333',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '40px',
          color: 'black'
        }}>
          Manaboodle
        </div>
        
        <div style={{
          fontSize: '1.5rem',
          marginBottom: '20px',
          fontWeight: 600,
          color: '#333'
        }}>
          Launching External Tool
        </div>
        
        <div style={{
          fontSize: '1.1rem',
          opacity: 0.7,
          marginBottom: '40px',
          lineHeight: '1.5',
          color: '#666'
        }}>
          You're being redirected to our advanced pattern recognition tool. 
          This opens in a separate application for the best experience.
        </div>

        <div style={{
          width: '100%',
          height: '8px',
          background: '#f0f0f0',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '20px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #333, #666)',
            transition: 'width 0.1s ease',
            borderRadius: '3px',
            width: `${progress}%`
          }} />
        </div>

        <div style={{
          fontSize: '1rem',
          opacity: 0.8,
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666'
        }}>
          <div style={{
            display: 'inline-block',
            width: '20px',
            height: '20px',
            border: '3px solid #e0e0e0',
            borderRadius: '50%',
            borderTopColor: '#333',
            marginRight: '10px'
          }} className="spinner" />
          {status}
        </div>

        <div style={{
          background: '#f8f8f8',
          padding: '15px 25px',
          borderRadius: '12px',
          marginTop: '30px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{
            fontSize: '0.9rem',
            opacity: 0.8,
            marginBottom: '8px',
            color: '#666'
          }}>
            Destination:
          </div>
          <div style={{
            fontSize: '1.3rem',
            fontWeight: 600,
            color: '#333'
          }}>
            🔍 Clusters - Pattern Analysis
          </div>
        </div>

        <noscript>
          <div style={{
            background: '#f8f8f8',
            padding: '20px',
            borderRadius: '12px',
            marginTop: '30px',
            textAlign: 'center',
            border: '1px solid #e0e0e0'
          }}>
            <p style={{ marginBottom: '15px', color: '#666' }}>JavaScript is required for automatic redirect.</p>
            <a 
              href="https://clusters-git-main-manabunagaokas-projects.vercel.app?_vercel_share=H0UCEGCTYBqbBKWTg3cMSxFYhV7PrXQf"
              style={{
                display: 'inline-block',
                background: 'black',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Continue to Clusters →
            </a>
          </div>
        </noscript>
      </div>

      <style jsx>{`
        .spinner {
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          div[style*="font-size: 2.5rem"] {
            font-size: 2rem !important;
          }
          
          div[style*="font-size: 1.5rem"] {
            font-size: 1.3rem !important;
          }
          
          div[style*="font-size: 1.1rem"] {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}