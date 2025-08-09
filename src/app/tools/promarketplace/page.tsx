// app/tools/promarketplace/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProMarketplacePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa, #ecfdf5)',
      padding: '2rem'
    }}>
      <Link href="/tools" style={{
        display: 'inline-block',
        color: '#0F766E',
        textDecoration: 'none',
        marginBottom: '2rem',
        fontSize: '0.95rem'
      }}>
        ← Back to Tools
      </Link>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#0F766E',
          marginBottom: '1rem'
        }}>
          Pro Marketplace
        </h1>
        
        <p style={{
          fontSize: '1.1rem',
          color: '#0d9488',
          marginBottom: '3rem',
          lineHeight: 1.6
        }}>
          Advanced research and analysis tools powered by the Synchronicity Engine.
          <br />
          Currently in MVP phase - direct access available for university researchers.
        </p>

        {/* MVP Access Section */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem',
          border: '2px solid #14B8A6'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#0F766E',
            marginBottom: '1rem'
          }}>
            Available Now - MVP Access
          </h2>
          
          <div style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            <Link 
              href="/tools/promarketplace/clusters"
              style={{
                display: 'block',
                background: 'linear-gradient(135deg, #f0fdfa, #e6fffa)',
                border: '1px solid #14B8A6',
                borderRadius: '8px',
                padding: '1.5rem',
                textDecoration: 'none',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#0F766E',
                marginBottom: '0.5rem'
              }}>
                Clusters - AI Pattern Recognition
              </h3>
              <p style={{
                color: '#0d9488',
                fontSize: '0.95rem',
                lineHeight: 1.5
              }}>
                Advanced clustering tool for analyzing JTBD interviews, survey responses, 
                and qualitative research data. Powered by patent-protected K-means algorithm 
                with OpenAI insights.
              </p>
              <div style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  background: '#14B8A6',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  MVP READY
                </span>
                <span style={{
                  color: '#6b7280',
                  fontSize: '0.8rem'
                }}>
                  Try with sample data or your own research
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          opacity: 0.7
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Coming Soon
          </h2>
          
          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            <div style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <h4 style={{ color: '#6b7280', margin: '0 0 0.5rem 0' }}>Pro Authentication & Billing</h4>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
                Subscription management, team access, and advanced features
              </p>
            </div>
            
            <div style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <h4 style={{ color: '#6b7280', margin: '0 0 0.5rem 0' }}>Advanced Analytics Suite</h4>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
                JTBD Framework, Market Analysis, Executive Prioritization tools
              </p>
            </div>
            
            <div style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <h4 style={{ color: '#6b7280', margin: '0 0 0.5rem 0' }}>Synchronicity Engine API</h4>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
                Developer access to our pattern recognition algorithms
              </p>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #f0f9ff, #e0f7fa)',
          borderRadius: '8px',
          border: '1px solid #0284c7'
        }}>
          <p style={{
            color: '#0369a1',
            fontSize: '0.95rem',
            margin: 0
          }}>
            🚀 <strong>Harvard Launch Strategy</strong>: Currently providing direct MVP access 
            for university researchers. Full Pro Marketplace coming soon with subscription 
            management and advanced features.
          </p>
        </div>
      </div>
    </div>
  );
}
