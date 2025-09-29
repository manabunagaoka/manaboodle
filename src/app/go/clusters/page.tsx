'use client';

import { useEffect, useState } from 'react';

export const metadata = {
  title: 'Launching Clusters - Manaboodle',
  description: 'Redirecting to Clusters pattern recognition tool',
};

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
    <>
      <style jsx>{`
        .redirect-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: white;
          text-align: center;
          padding: 20px;
        }

        .redirect-content {
          max-width: 500px;
          width: 100%;
        }

        .logo {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 40px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .redirect-message {
          font-size: 1.5rem;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .redirect-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 40px;
          line-height: 1.5;
        }

        .progress-container {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #fff, rgba(255,255,255,0.8));
          transition: width 0.1s ease;
          border-radius: 4px;
        }

        .loading-text {
          font-size: 1rem;
          opacity: 0.8;
          margin-top: 20px;
        }

        .destination {
          background: rgba(255, 255, 255, 0.1);
          padding: 15px 25px;
          border-radius: 12px;
          margin-top: 30px;
          backdrop-filter: blur(10px);
        }

        .destination-label {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-bottom: 8px;
        }

        .destination-name {
          font-size: 1.3rem;
          font-weight: 600;
        }

        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .logo {
            font-size: 2rem;
          }
          
          .redirect-message {
            font-size: 1.3rem;
          }
          
          .redirect-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="redirect-container">
        <div className="redirect-content">
          <div className="logo">Manaboodle</div>
          
          <div className="redirect-message">
            Launching External Tool
          </div>
          
          <div className="redirect-subtitle">
            You're being redirected to our advanced pattern recognition tool. 
            This opens in a separate application for the best experience.
          </div>

          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="loading-text">
            <div className="spinner" />
            {status}
          </div>

          <div className="destination">
            <div className="destination-label">Destination:</div>
            <div className="destination-name">🔍 Clusters - Pattern Analysis</div>
          </div>

          <noscript>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '20px',
              borderRadius: '12px',
              marginTop: '30px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '15px' }}>JavaScript is required for automatic redirect.</p>
              <a 
                href="https://clusters-git-main-manabunagaokas-projects.vercel.app?_vercel_share=H0UCEGCTYBqbBKWTg3cMSxFYhV7PrXQf"
                style={{
                  display: 'inline-block',
                  background: 'white',
                  color: '#667eea',
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
      </div>
    </>
  );
}