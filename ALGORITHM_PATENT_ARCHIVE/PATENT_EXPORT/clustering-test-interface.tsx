'use client'

import { useState } from 'react';
import Link from 'next/link';

interface Cluster {
  id: number;
  data_points: any[];
  summary: string;
  similarity_score: number;
}

export default function TestClusterPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const sampleData = [
    // Trust & Safety Concerns (Cluster 1)
    "idk about background checks... seems fake?? my nanny said she had experience but clearly doesnt",
    "I NEED to trust who's watching my kids but how do u even verify anything these days",
    "Safety is everything but nobody seems to care about proper screening anymore",
    "References are useless - everyone just lies for each other",
    
    // Communication & Updates (Cluster 2) 
    "never know what my kid did all day... like did she eat? did she nap? TELL ME SOMETHING",
    "communication = ZERO. I ask questions, get one word answers",
    "want photos throughout day but she acts like its too much work??",
    "My nanny speaks broken english and i worry about emergencies",
    
    // Reliability & Scheduling (Cluster 3)
    "calls in sick every other week... like clockwork when weather is nice",
    "no flexibility AT ALL. need her to stay late? acts like im asking for kidney",
    "finding backup is impossible... if she cancels im screwed",
    "inconsistent schedule drives me insane - sometimes early sometimes late",
    
    // Cost & Value (Cluster 4)
    "$25/hour for mediocre care... feels like robbery",
    "prices going up but quality going down... make it make sense",
    "paying premium but getting walmart service tbh",
    "expensive but lazy - wont do basic stuff like dishes or laundry",
    
    // Skills & Development (Cluster 5)
    "just sits on phone while my toddler watches TV all day",
    "no educational activities... like zero creativity or engagement", 
    "wants someone who does crafts, reading, outdoor play not just babysitting",
    "my kid isnt learning anything... just surviving until i get home",
    
    // Personal Fit & Values (Cluster 6)
    "need someone who gets my parenting style... not just does whatever",
    "cultural differences make it hard... different ideas about discipline",
    "personality clash is real... she judges my choices constantly",
    "want someone warm and loving not cold and robotic"
  ];

  const testClustering = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/synchronicity/cluster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data_points: sampleData,
          num_clusters: 4
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getClusterColor = (clusterId: number) => {
    const colors = ['#0F766E', '#7C3AED', '#DC2626', '#059669', '#1D4ED8'];
    return colors[clusterId % colors.length];
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Link href="/" style={{ 
        color: '#0F766E', 
        textDecoration: 'none',
        marginBottom: '2rem',
        display: 'inline-block'
      }}>
        ← Back to Home
      </Link>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          color: '#0F766E',
          fontFamily: 'Playfair Display, serif',
          marginBottom: '1rem'
        }}>
          🔮 Smart Synchronicity Engine
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6B7280' }}>
          AI-powered pattern discovery for customer research and business insights
        </p>
      </div>

      <div style={{ 
        background: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#0F766E', marginBottom: '1rem' }}>Real Customer Feedback Analysis</h2>
        <p style={{ color: '#6B7280', marginBottom: '1rem', fontSize: '0.95rem' }}>
          Raw, unfiltered feedback from nanny hiring interviews - watch AI discover hidden patterns
        </p>
        <div style={{ 
          background: '#F9FAFB',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {sampleData.map((item, index) => (
            <div key={index} style={{ 
              padding: '0.75rem',
              margin: '0.5rem 0',
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              color: '#374151'
            }}>
              <span style={{ color: '#9CA3AF', fontWeight: 'bold' }}>[Interview #{index + 1}]</span> "{item}"
            </div>
          ))}
        </div>

        <button
          onClick={testClustering}
          disabled={loading}
          style={{
            background: loading ? '#9CA3AF' : '#0F766E',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? '🔍 AI Analyzing Patterns...' : '🚀 Discover Hidden Customer Segments'}
        </button>
      </div>

      {error && (
        <div style={{
          background: '#FEE2E2',
          border: '1px solid #FECACA',
          color: '#B91C1C',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          Error: {error}
        </div>
      )}

      {results && (
        <div style={{ 
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '2rem'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#0F766E', margin: 0 }}>
              ✨ Pattern Discovery Results
            </h2>
            <div style={{ 
              background: '#F3F4F6',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.9rem',
              color: '#374151'
            }}>
              Processed in {results.metadata.processing_time}ms
            </div>
          </div>

          <div style={{ 
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
          }}>
            {results.clusters.map((cluster: Cluster) => (
              <div 
                key={cluster.id}
                style={{
                  border: `2px solid ${getClusterColor(cluster.id)}`,
                  borderRadius: '12px',
                  padding: '1.5rem',
                  background: 'white'
                }}
              >
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: getClusterColor(cluster.id),
                    marginRight: '0.75rem'
                  }}></div>
                  <h3 style={{ 
                    margin: 0,
                    color: getClusterColor(cluster.id),
                    fontSize: '1.3rem'
                  }}>
                    Cluster {cluster.id + 1}
                  </h3>
                  <div style={{
                    marginLeft: 'auto',
                    background: '#F3F4F6',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    color: '#374151'
                  }}>
                    {Math.round(cluster.similarity_score * 100)}% similar
                  </div>
                </div>

                <p style={{ 
                  color: '#6B7280',
                  fontStyle: 'italic',
                  marginBottom: '1rem',
                  fontSize: '0.95rem'
                }}>
                  {cluster.summary}
                </p>

                <div style={{ fontSize: '0.9rem' }}>
                  {cluster.data_points.map((point, index) => (
                    <div 
                      key={index}
                      style={{
                        background: '#F9FAFB',
                        padding: '0.75rem',
                        margin: '0.5rem 0',
                        borderRadius: '6px',
                        borderLeft: `3px solid ${getClusterColor(cluster.id)}`
                      }}
                    >
                      {point.content}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#F9FAFB',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#6B7280'
          }}>
            <strong>Metadata:</strong> {results.metadata.total_points} data points • 
            {results.clusters.length} clusters found • 
            {results.metadata.algorithm} algorithm • 
            Processing time: {results.metadata.processing_time}ms
          </div>
        </div>
      )}
    </div>
  );
}
