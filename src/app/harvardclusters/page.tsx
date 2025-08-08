'use client';

import { useState, useEffect } from 'react';

const SAMPLE_DATA = `Interview 1 - Sarah M., Working Mom, Tech Executive
"I need someone I can trust completely with my 2-year-old. I've tried 3 nanny services but they keep sending different people. I don't have time to re-explain our routine every week. I'd pay double for consistency. Current solution: asking my mom to drive 2 hours twice a week. Pain level: 9/10. Would pay: $40/hour for the RIGHT person."

Interview 2 - James K., Single Dad, Remote Worker
"My biggest frustration is the scheduling. I have calls at random times and need someone flexible. Most services want fixed hours. My daughter has ADHD and needs someone who gets that. Current solution: expensive daycare that doesn't handle her needs well. Pain level: 8/10. Would pay: $35/hour for flexibility and special needs experience."

Interview 3 - Lisa P., Marketing Director
"I travel for work 2 weeks per month. I need overnight care that's reliable. The job isn't just babysitting - I need someone who can handle school pickup, homework, meals. Current solution: rotating between 3 family members who are all getting exhausted. Pain level: 9/10. Would pay: $50/hour for comprehensive care."

Interview 4 - Michael R., Startup Founder
"We work crazy hours - sometimes until midnight. Need someone who can work non-traditional schedules. Our twins are 4 and very energetic. Current solution: one nanny who's burning out fast. Pain level: 7/10. Would pay: $42/hour for reliability during intense work periods."

Interview 5 - Amanda T., Doctor
"I work 12-hour shifts at the hospital. Need someone overnight who can handle emergencies. My son has food allergies - this isn't negotiable. Current solution: expensive overnight care facility that feels too institutional. Pain level: 8/10. Would pay: $45/hour for medical-aware care."

Interview 6 - Robert D., Consultant
"Language is important - we want someone who speaks Spanish with our kids. Most services can't guarantee this. Also need help with homework and driving to activities. Current solution: Spanish-speaking family friend who isn't always available. Pain level: 6/10. Would pay: $38/hour for bilingual education support."

Interview 7 - Jennifer S., Finance Executive
"I'm exhausted. I don't just need childcare - I need someone who can handle grocery runs, light cleaning, meal prep. One person who can do it all. Current solution: juggling 3 different service providers. Pain level: 9/10. Would pay: $48/hour for comprehensive family support."

Interview 8 - David L., Software Engineer
"We need someone long-term who becomes part of the family. Someone who knows our kids' personalities, friends, interests. Consistency is everything. Current solution: agency that keeps rotating staff every few months. Pain level: 8/10. Would pay: $41/hour for long-term relationship and stability."`;

interface Segment {
  name: string;
  percentage: number;
  count: number;
  color: string;
  insight: string;
  quote: string;
  summary: string;
}

export default function HarvardClustersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [inputData, setInputData] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const loadSampleData = () => {
    setInputData(SAMPLE_DATA);
    setTimeout(() => submitCluster(), 500);
  };

  const submitCluster = async () => {
    if (!inputData.trim()) {
      setError('Please add some text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/harvardclusters/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawData: inputData })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setSegments(data.segments);
      
      // Close sidebar on mobile after successful analysis
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        closeSidebar();
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      setError((error as Error).message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = (segment: Segment) => {
    setSelectedSegment(segment);
    
    // Generate insights based on segment
    const segmentInsights: Record<string, string[]> = {
      'Consistency Focused': [
        "Implement a 'Caregiver Guarantee' program where families get the same person for minimum 6-month commitments",
        "Create detailed family profiles that caregivers study before first visit to eliminate onboarding friction",
        "Offer premium pricing tier (+30-40%) for 'consistency contracts' with penalty clauses for provider changes"
      ],
      'Flexibility Seekers': [
        "Develop mobile app with 2-hour advance booking for emergency coverage during unexpected work demands",
        "Create 'Flex Pool' of caregivers specifically trained for last-minute bookings and varying schedules",
        "Implement surge pricing model that incentivizes caregiver availability during peak demand times"
      ],
      'Specialized Needs': [
        "Develop specialized certification programs (ADHD, autism, medical needs, multilingual) for premium caregivers",
        "Create detailed matching algorithm that considers cultural, medical, and developmental compatibility",
        "Partner with pediatric specialists and therapists to offer integrated care teams"
      ],
      'Comprehensive Support': [
        "Launch 'Family Assistant' tier offering childcare + household management + personal errands",
        "Create executive package with dedicated account manager and 24/7 concierge support",
        "Partner with meal delivery, cleaning, and tutoring services for comprehensive family solutions"
      ]
    };

    setInsights(segmentInsights[segment.name] || [
      "This segment shows strong opportunity for targeted product development",
      "Consider specialized service offerings that address their specific pain points",
      "Premium pricing strategies appear viable based on willingness to pay indicators"
    ]);

    // Show insights section
    setTimeout(() => {
      const insightsSection = document.getElementById('insights-section');
      if (insightsSection) {
        insightsSection.style.display = 'block';
        insightsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const updateClusterVisualization = () => {
    const svg = document.getElementById('cluster-svg');
    if (!svg || segments.length === 0) return;

    const rect = svg.getBoundingClientRect();
    const width = rect.width || 300;
    const height = rect.height || 300;
    
    svg.innerHTML = '';
    
    // Calculate cluster positions
    const clusters = segments.map((segment, index) => {
      const angle = (index / segments.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.25;
      const centerX = width / 2;
      const centerY = height / 2;
      
      return {
        ...segment,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        r: Math.max(20, (segment.percentage / 100) * 40)
      };
    });

    // Draw connections
    clusters.forEach((c1, i) => {
      clusters.forEach((c2, j) => {
        if (i < j) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', c1.x.toString());
          line.setAttribute('y1', c1.y.toString());
          line.setAttribute('x2', c2.x.toString());
          line.setAttribute('y2', c2.y.toString());
          line.setAttribute('stroke', '#e5e7eb');
          line.setAttribute('stroke-width', '1');
          line.setAttribute('opacity', '0.5');
          svg.appendChild(line);
        }
      });
    });

    // Draw clusters
    clusters.forEach((cluster, index) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.style.cursor = 'pointer';
      g.addEventListener('click', () => {
        getRecommendations(cluster);
      });

      // Main circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cluster.x.toString());
      circle.setAttribute('cy', cluster.y.toString());
      circle.setAttribute('r', cluster.r.toString());
      circle.setAttribute('fill', 'white');
      circle.setAttribute('stroke', cluster.color);
      circle.setAttribute('stroke-width', '3');
      g.appendChild(circle);

      // Percentage text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', cluster.x.toString());
      text.setAttribute('y', cluster.y.toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '0.3em');
      text.setAttribute('fill', cluster.color);
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.textContent = `${cluster.percentage}%`;
      g.appendChild(text);

      svg.appendChild(g);
    });
  };

  // Update visualization when segments change
  useEffect(() => {
    if (segments.length > 0) {
      setTimeout(updateClusterVisualization, 100);
    }
  }, [segments]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (segments.length > 0) {
        updateClusterVisualization();
      }
      // Close sidebar on desktop
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        closeSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [segments]);

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          <div className="sidebar-icon" style={{
            transform: sidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}></div>
        </button>
        <div className="mobile-logo">
          <div className="mobile-logo-text">Clusters</div>
          <div className="mobile-logo-subtitle">by Manaboodle Synchronicity Engine</div>
        </div>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar Panel */}
      <div className={`sidebar-panel ${sidebarOpen ? 'open' : ''}`}>
        <div className="input-section">
          <button className="sample-data-btn" onClick={loadSampleData}>
            Load Sample: Nanny Business
          </button>
          
          <textarea
            className="text-input"
            placeholder="Paste your JTBD interviews here..."
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
          
          <button 
            className="submit-btn" 
            onClick={submitCluster}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Submit'}
          </button>

          {loading && (
            <div className="progress-container" style={{ display: 'block' }}>
              <div className="progress-dots">
                <span className="progress-dot active"></span>
                <span className="progress-dot"></span>
                <span className="progress-dot"></span>
                <span className="progress-dot"></span>
              </div>
              <div className="progress-text">Analyzing patterns...</div>
            </div>
          )}

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
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {segments.length > 0 ? (
          <>
            {/* Cluster Visualization */}
            <div className="viz-section">
              <div className="viz-header">
                <div className="viz-title">Cluster Map</div>
              </div>
              <div className="viz-canvas">
                <svg id="cluster-svg" style={{ width: '100%', height: '100%' }}></svg>
              </div>
            </div>

            {/* Pattern Analysis Section */}
            <div className="pattern-section">
              <div className="pattern-header">
                <div className="pattern-title">Cluster Analysis Cards</div>
              </div>
              
              <div className="pattern-carousel">
                <div className="pattern-cards-container">
                  {segments.map((segment, index) => (
                    <div key={index} className="pattern-card">
                      <div className="pattern-card-header">
                        <div className="pattern-card-title">
                          <span 
                            className="pattern-dot" 
                            style={{ background: segment.color }}
                          ></span>
                          {segment.name} ({segment.percentage}%)
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {segment.count} interviews
                        </span>
                      </div>
                      <div className="pattern-card-body">
                        <div className="pattern-insight">{segment.insight}</div>
                        
                        <div className="pattern-quote">"{segment.quote}"</div>
                        
                        <div style={{ margin: '1rem 0' }}>
                          <h4 style={{ 
                            fontSize: '0.75rem', 
                            color: '#6b7280', 
                            textTransform: 'uppercase', 
                            marginBottom: '0.5rem',
                            letterSpacing: '0.05em'
                          }}>Summary</h4>
                          <div style={{ 
                            fontSize: '0.8125rem', 
                            color: '#374151', 
                            lineHeight: '1.5' 
                          }}>
                            {segment.summary}
                          </div>
                        </div>

                        <button 
                          className="get-recommendations-btn" 
                          onClick={() => getRecommendations(segment)}
                        >
                          Get Actionable Insights
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Insights Section */}
            {selectedSegment && (
              <div className="insights-section" id="insights-section">
                <div className="insights-header">
                  <div className="insights-title">
                    Actionable Insights for {selectedSegment.name}
                  </div>
                </div>
                <div className="insights-content">
                  <ul className="insights-list">
                    {insights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="welcome-state">
            <h2 className="welcome-title">Welcome to Clusters</h2>
            <p className="welcome-description">
              Analyze your JTBD interviews to discover customer segments and actionable insights. 
              Use the sidebar to get started or try our sample data.
            </p>
            <button 
              className="sample-data-btn"
              onClick={() => setSidebarOpen(true)}
              style={{ maxWidth: '200px' }}
            >
              Open Sidebar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
