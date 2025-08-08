'use client';

import { useState } from 'react';
import './styles.css';

const SAMPLE_DATA = `Interview 1 - Sarah M., Working Mom, Tech Executive
"I need someone I can trust completely with my 2-year-old. I've tried 3 nanny services but they keep sending different people. I don't have time to re-explain our routine every week. I'd pay double for consistency. Current solution: asking my mom to drive 2 hours twice a week. Pain level: 9/10. Would pay: $40/hour for the RIGHT person."

Interview 2 - James K., Single Dad, Remote Worker
"My biggest frustration is the scheduling. I have calls at random times and need someone flexible. Most services want fixed hours. My daughter has ADHD and needs someone who gets that. Current solution: expensive daycare that doesn't handle her needs well. Pain level: 8/10. Would pay: $35/hour for flexibility and special needs experience."

Interview 3 - Lisa P., Marketing Director
"I travel for work 2 weeks per month. I need overnight care that's reliable. The job isn't just babysitting - I need someone who can handle school pickup, homework, meals. Current solution: rotating between 3 family members who are all getting exhausted. Pain level: 9/10. Would pay: $50/hour for comprehensive care."`;

interface Cluster {
  name: string;
  description: string;
  count: number;
}

export default function ClustersPage() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Cluster[]>([]);
  const [error, setError] = useState('');

  const loadSample = () => {
    setInputText(SAMPLE_DATA);
  };

  const analyzeData = async () => {
    if (!inputText.trim()) {
      setError('Please add some text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/synchronicity/cluster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data_points: inputText.split('\n\n').filter(line => line.trim()),
          num_clusters: 3
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      
      const clusters: Cluster[] = data.clusters.map((cluster: any, index: number) => ({
        name: `Segment ${index + 1}`,
        description: cluster.summary || 'Customer segment with unique needs and patterns',
        count: cluster.data_points.length
      }));

      setResults(clusters);
      
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clusters-page">
      <div className="clusters-header">
        <h1 className="clusters-title">Harvard Clusters</h1>
        <p className="clusters-subtitle">Customer Interview Analysis Tool</p>
      </div>
      
      <div className="clusters-container">
        <div className="input-panel">
          <button className="sample-btn" onClick={loadSample}>
            Load Sample: Nanny Business
          </button>
          
          <textarea
            className="text-area"
            placeholder="Paste your customer interviews here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <button 
            className="submit-btn" 
            onClick={analyzeData}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Clusters'}
          </button>

          {error && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              background: '#fef2f2', 
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#dc2626',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}
        </div>

        <div className="results-panel">
          {loading && (
            <div className="loading">
              <p>Analyzing customer patterns...</p>
            </div>
          )}

          {results.length > 0 && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#374151' }}>
                Analysis Results ({results.length} segments found)
              </h2>
              {results.map((cluster, index) => (
                <div key={index} className="cluster-result">
                  <div className="cluster-name">
                    {cluster.name} ({cluster.count} interviews)
                  </div>
                  <div className="cluster-description">
                    {cluster.description}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="welcome-message">
              <h2>Welcome to Harvard Clusters</h2>
              <p>Upload your customer interview data to discover meaningful segments and patterns.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
