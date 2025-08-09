'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import EmailCollector from './components/EmailCollector';
import './globals.css';

// Sample JTBD interview data - exactly from your V10
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

interface Pattern {
  id: number;
  name: string;
  percentage: number;
  count: number;
  color: string;
  insight: string;
  quote: string;
  summary: string;
}

export default function ClustersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile starts closed
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeTab, setActiveTab] = useState('your-clusters');
  const [textInput, setTextInput] = useState('');
  const [clusterName, setClusterName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [clusters, setClusters] = useState<string[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const [currentInsights, setCurrentInsights] = useState<string[]>([]);
  const [currentInsightSegment, setCurrentInsightSegment] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{type: 'user' | 'ai', message: string}[]>([]);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [showEmailCollector, setShowEmailCollector] = useState(false);
  const [hasTriedDemo, setHasTriedDemo] = useState(false);

  // Responsive sidebar state management
  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      // Desktop starts with sidebar open, mobile starts closed
      setSidebarOpen(desktop);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Sidebar management
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleOverlayClick = () => {
    closeSidebar();
  };

  // Load sample data
  const loadSampleData = () => {
    setClusterName('Nanny Business Customer Analysis');
    setTextInput(SAMPLE_DATA);
    setShowNameInput(true);
    
    // Auto-submit after loading with a longer delay to ensure state is updated
    setTimeout(() => submitCluster(), 100);
  };

  const startNewCluster = () => {
    setShowNameInput(true);
    setTextInput('');
    setClusterName('');
  };

  // Submit cluster for analysis
  const submitCluster = async () => {
    if (!textInput.trim()) {
      console.log('No text input provided');
      return;
    }

    setLoading(true);

    try {
      // Split interviews by double line breaks
      const interviews = textInput.split('\n\n').filter(text => text.trim().length > 0);
      
      // Call your existing clustering API
      const response = await fetch('/api/synchronicity/cluster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data_points: interviews,
          num_clusters: 4
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      
      // Transform API results to match V10 format - fully dynamic!
      const transformedPatterns: Pattern[] = result.clusters.map((cluster: any, index: number) => {
        const colors = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4"];
        
        // Extract a meaningful name from the AI summary (first few words)
        const summaryWords = cluster.summary.split(' ').slice(0, 3).join(' ');
        const dynamicName = summaryWords.charAt(0).toUpperCase() + summaryWords.slice(1);
        
        // Get the best representative quote from this cluster
        const bestQuote = cluster.data_points[0]?.content?.substring(0, 200) + "..." || "";
        
        return {
          id: index + 1,
          name: dynamicName || `Cluster ${index + 1}`,
          percentage: Math.round((cluster.data_points.length / result.metadata.total_points) * 100),
          count: cluster.data_points.length,
          color: colors[index] || "#6B7280",
          insight: cluster.summary,
          quote: bestQuote,
          summary: cluster.summary
        };
      });

      setPatterns(transformedPatterns);
      
      // Add cluster to list
      const finalClusterName = clusterName || 'Untitled Cluster';
      setClusters(prev => [finalClusterName, ...prev]);
      
      // Mark that user has tried the demo
      setHasTriedDemo(true);
      
      // Reset form
      setShowNameInput(false);
      setClusterName('');
      setTextInput('');
      
      // Close sidebar on mobile
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        closeSidebar();
      }

    } catch (error) {
      console.error('Clustering failed:', error);
      // Silently handle the error without showing popup
    } finally {
      setLoading(false);
    }
  };

  // Get actionable insights for a pattern
  const getRecommendations = (patternName: string, patternId: number) => {
    let insights: string[] = [];
    
    switch(patternId) {
      case 1: // Consistency Desperate
        insights = [
          "Implement a 'Caregiver Guarantee' program where families get the same person for minimum 6-month commitments",
          "Create detailed family profiles that caregivers study before first visit to eliminate onboarding friction",
          "Offer premium pricing tier (+30-40%) for 'consistency contracts' with penalty clauses for provider changes",
          "Build caregiver training program focused on relationship building and family integration skills",
          "Market with testimonials emphasizing long-term relationships rather than individual qualifications"
        ];
        break;
      case 2: // Schedule Flexers
        insights = [
          "Develop mobile app with 2-hour advance booking for emergency coverage during unexpected work demands",
          "Create 'Flex Pool' of caregivers specifically trained for last-minute bookings and varying schedules",
          "Implement surge pricing model that incentivizes caregiver availability during peak demand times",
          "Partner with coworking spaces and corporate offices to offer on-site emergency childcare",
          "Build AI scheduling system that learns family patterns and proactively suggests coverage for likely needs"
        ];
        break;
      case 3: // Special Requirements
        insights = [
          "Develop specialized certification programs (ADHD, autism, medical needs, multilingual) for premium caregivers",
          "Create detailed matching algorithm that considers cultural, medical, and developmental compatibility",
          "Partner with pediatric specialists and therapists to offer integrated care teams",
          "Charge consultation fees for initial assessment and specialized care plan development",
          "Build referral network with special needs pediatricians and developmental specialists"
        ];
        break;
      case 4: // Exhausted Executives
        insights = [
          "Launch 'Family Assistant' tier offering childcare + household management + personal errands",
          "Create executive package with dedicated account manager and 24/7 concierge support",
          "Partner with meal delivery, cleaning, and tutoring services for comprehensive family solutions",
          "Implement corporate partnerships offering family support as executive benefit packages",
          "Develop premium pricing model charging hourly rate + monthly management fee for comprehensive services"
        ];
        break;
      default:
        insights = [
          "Analyze this segment's specific pain points to develop targeted solutions",
          "Consider premium pricing for specialized services this segment values",
          "Build marketing campaigns that speak directly to their unique needs",
          "Develop partnerships that complement your core offering for this segment"
        ];
    }
    
    setCurrentInsights(insights);
    setCurrentInsightSegment(patternName);
    setShowInsights(true);
    
    // Scroll to insights
    setTimeout(() => {
      document.getElementById('insights-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Chat functionality
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatInput('');
    
    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }]);
    
    // Simulate AI response
    setTimeout(() => {
      let response = "That's a great question about this customer segment. ";
      
      if (userMessage.toLowerCase().includes('price') || userMessage.toLowerCase().includes('cost')) {
        response += "Based on the analysis, this segment shows strong price tolerance for value-added services. Consider testing premium pricing tiers.";
      } else if (userMessage.toLowerCase().includes('marketing') || userMessage.toLowerCase().includes('advertis')) {
        response += "For marketing to this segment, focus on the specific pain points they mentioned in interviews. Testimonials from similar customers would be particularly effective.";
      } else if (userMessage.toLowerCase().includes('competitor') || userMessage.toLowerCase().includes('market')) {
        response += "This segment appears underserved by current market solutions. There's likely a competitive opportunity to capture market share with targeted positioning.";
      } else {
        response += "The interviews suggest this is a high-opportunity segment. Would you like me to dive deeper into specific implementation strategies?";
      }
      
      setChatMessages(prev => [...prev, { type: 'ai', message: response }]);
    }, 1500);
  };

  // Email collection handler
  const handleEmailSubmit = async (email: string, interests: string) => {
    try {
      // Call your existing subscription API
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          research_interest: interests,
          source: 'clusters_demo',
          interest_type: 'early_access'
        })
      });

      if (response.ok) {
        alert('Thanks! We\'ll notify you when full access is available.');
      } else {
        alert('Thanks for your interest! We\'ll be in touch soon.');
      }
    } catch (error) {
      console.error('Email submission error:', error);
      alert('Thanks for your interest! We\'ll be in touch soon.');
    }
  };

  // Pattern navigation
  const nextPattern = () => {
    if (currentPatternIndex < patterns.length - 1) {
      setCurrentPatternIndex(currentPatternIndex + 1);
    }
  };

  const previousPattern = () => {
    if (currentPatternIndex > 0) {
      setCurrentPatternIndex(currentPatternIndex - 1);
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Header - Only visible on mobile */}
      {!isDesktop && (
        <div className="mobile-header">
          <button 
            className="mobile-menu-btn" 
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <div className="sidebar-icon-mobile"></div>
          </button>
          
          <div className="mobile-logo">
            <div className="mobile-logo-text">Clusters</div>
            <div className="mobile-logo-subtitle">by Manaboodle Synchronicity Engine</div>
          </div>
          
          <a href="/" className="home-btn">
            <Home size={20} />
          </a>
        </div>
      )}

      {/* Desktop Header - Only visible on desktop */}
      {isDesktop && (
        <div className="desktop-header">
          <button 
            className="desktop-sidebar-toggle" 
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <div className="sidebar-icon-desktop"></div>
          </button>
          
          <div className="desktop-title">
            <div className="desktop-logo-text">Clusters</div>
            <div className="desktop-logo-subtitle">by Manaboodle Synchronicity Engine</div>
          </div>
          
          <a href="/" className="home-btn-desktop">
            <Home size={20} />
          </a>
        </div>
      )}

      {/* Sidebar Overlay - Mobile only */}
      {!isDesktop && (
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* Sidebar Panel */}
      <div className={`sidebar-panel ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div>
            <div className="logo-text">Clusters</div>
            <div className="logo-subtitle">by Manaboodle Synchronicity Engine</div>
          </div>
          <button className="sidebar-close" onClick={closeSidebar}>×</button>
        </div>

        {/* Panel Tabs */}
        <div className="panel-tabs">
          <button 
            className={`panel-tab ${activeTab === 'your-clusters' ? 'active' : ''}`}
            onClick={() => setActiveTab('your-clusters')}
          >
            My Clusters
          </button>
          <button 
            className={`panel-tab ${activeTab === 'subscription' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscription')}
          >
            Subscription
          </button>
        </div>

        {/* Tab Content */}
        <div className="cluster-panel-content">
          {/* My Clusters Tab */}
          {activeTab === 'your-clusters' && (
            <div className="tab-content active">
              <div className="new-cluster-section">
                <button className="new-cluster-btn" onClick={startNewCluster}>
                  <span style={{ fontSize: '1.25rem' }}>+</span>
                  <span>New Cluster</span>
                </button>
                <button className="sample-data-btn" onClick={loadSampleData}>
                  Load Sample: Nanny Business
                </button>
              </div>

              <div className="cluster-list">
                {clusters.map((cluster, index) => (
                  <div key={index} className={`cluster-item ${index === 0 ? 'active' : ''}`}>
                    <div className="cluster-info">
                      <div className="cluster-name">{cluster}</div>
                      <div className="cluster-meta">4 segments identified • Private</div>
                    </div>
                    <div className="cluster-status-indicator"></div>
                  </div>
                ))}
                
                {/* Coming Soon Items */}
                <div className="cluster-item disabled">
                  <div className="cluster-info">
                    <div className="cluster-name">Investor Match</div>
                    <div className="cluster-meta">Connect with investors</div>
                  </div>
                  <div className="cluster-status-indicator inactive"></div>
                  <span className="coming-soon-badge">Coming Soon</span>
                </div>
                
                <div className="cluster-item disabled">
                  <div className="cluster-info">
                    <div className="cluster-name">Co-founder Match</div>
                    <div className="cluster-meta">Find your perfect partner</div>
                  </div>
                  <div className="cluster-status-indicator inactive"></div>
                  <span className="coming-soon-badge">Coming Soon</span>
                </div>
                
                <div className="cluster-item disabled">
                  <div className="cluster-info">
                    <div className="cluster-name">Research Papers</div>
                    <div className="cluster-meta">Academic connections</div>
                  </div>
                  <div className="cluster-status-indicator inactive"></div>
                  <span className="coming-soon-badge">Coming Soon</span>
                </div>
                
                <div className="cluster-item disabled">
                  <div className="cluster-info">
                    <div className="cluster-name">Team Builder</div>
                    <div className="cluster-meta">Form perfect teams</div>
                  </div>
                  <div className="cluster-status-indicator inactive"></div>
                  <span className="coming-soon-badge">Coming Soon</span>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="tab-content active">
              <div className="subscription-content">
                <div className="subscription-header">
                  <div className="subscription-title">Available Subscriptions</div>
                  <div className="subscription-subtitle">Subscribe to public cluster feeds</div>
                </div>
                
                <div className="subscription-list">
                  {[
                    { name: "Harvard '26 GTM Strategies", detail: "147 active users • Updated daily" },
                    { name: "Boston Startup Funding", detail: "$2.3B tracked • Real-time" },
                    { name: "YC W25 Batch Updates", detail: "89 startups • Weekly insights" },
                    { name: "AI Research Papers", detail: "Latest papers • Auto-summarized" },
                    { name: "Climate Tech Trends", detail: "Market analysis • Investment flow" }
                  ].map((sub, index) => (
                    <div key={index} className="subscription-item">
                      <div className="subscription-info">
                        <div className="subscription-name">{sub.name}</div>
                        <div className="subscription-detail">{sub.detail}</div>
                      </div>
                      <button className="subscription-action">Coming Soon</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="input-section">
          {showNameInput && (
            <input 
              type="text" 
              className="cluster-name-input" 
              placeholder="Name your cluster..."
              value={clusterName}
              onChange={(e) => setClusterName(e.target.value)}
              style={{ display: 'block' }}
            />
          )}
          <textarea 
            className="text-input" 
            placeholder="Paste your text here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <div className="input-actions">
            <button className="action-btn">Attach</button>
            <button className="action-btn">Chat</button>
          </div>
          <button className="submit-btn" onClick={submitCluster} disabled={loading}>
            {loading ? 'Analyzing...' : 'Submit'}
          </button>
        </div>

        {/* Account Section */}
        <div className="account-section">
          <button className="account-btn">
            <div className="account-avatar">MN</div>
            <span>Account</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Subscribed Feeds */}
        <div className="feed-section">
          <div className="feed-title">Subscribed Clusters</div>
          <span className="feed-coming-soon">Coming Soon</span>
          <div className="feed-cards">
            {["Harvard '26", "Funding", "YC W25"].map((name, index) => (
              <div key={index} className="feed-card">
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af' }}>{name}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#9ca3af' }}>---</div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Not available</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cluster Visualization */}
        <div className="viz-section">
          <div className="viz-header">
            <div className="viz-title">Cluster Map</div>
            <div className="viz-actions">
              <button className="viz-btn primary" onClick={() => setExportModalOpen(true)}>Export</button>
            </div>
          </div>
          <div className="viz-canvas">
            <svg id="cluster-svg" style={{ width: '100%', height: '100%' }}>
              {patterns.length > 0 ? (
                patterns.map((pattern, index) => {
                  const angle = (index / patterns.length) * 2 * Math.PI;
                  const radius = 60;
                  const centerX = 150;
                  const centerY = 150;
                  const x = centerX + Math.cos(angle) * radius;
                  const y = centerY + Math.sin(angle) * radius;
                  const r = Math.max(20, (pattern.percentage / 100) * 30);

                  return (
                    <g key={pattern.id} style={{ cursor: 'pointer' }}>
                      <circle
                        cx={x}
                        cy={y}
                        r={r + 5}
                        fill={pattern.color}
                        opacity="0.2"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={r}
                        fill="white"
                        stroke={pattern.color}
                        strokeWidth="3"
                      />
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dy="0.3em"
                        fill={pattern.color}
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {pattern.percentage}%
                      </text>
                    </g>
                  );
                })
              ) : (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="14"
                >
                  Create a new cluster to see patterns
                </text>
              )}
            </svg>
          </div>
        </div>

        {/* Pattern Analysis Section */}
        {patterns.length > 0 && (
          <div className="pattern-section">
            <div className="pattern-header">
              <div className="pattern-title">Cluster Analysis Cards</div>
              <div className="pattern-nav">
                <button 
                  className="pattern-nav-btn" 
                  onClick={previousPattern}
                  disabled={currentPatternIndex === 0}
                >
                  ‹
                </button>
                <button 
                  className="pattern-nav-btn" 
                  onClick={nextPattern}
                  disabled={currentPatternIndex === patterns.length - 1}
                >
                  ›
                </button>
              </div>
            </div>
            
            <div className="pattern-carousel">
              <div 
                className="pattern-cards-container"
                style={{
                  transform: (typeof window !== 'undefined' && window.innerWidth < 1024) ? `translateX(-${currentPatternIndex * 100}%)` : 'none'
                }}
              >
                {patterns.map((pattern) => (
                  <div key={pattern.id} className="pattern-card">
                    <div className="pattern-card-header">
                      <div className="pattern-card-title">
                        <span className="pattern-dot" style={{ background: pattern.color }}></span>
                        {pattern.name} ({pattern.percentage}%)
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{pattern.count} interviews</span>
                    </div>
                    <div className="pattern-card-body">
                      <div className="pattern-insight">{pattern.insight}</div>
                      
                      <div className="pattern-quote">{pattern.quote}</div>
                      
                      <div style={{ margin: '1rem 0' }}>
                        <h4 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Summary</h4>
                        <div style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5 }}>{pattern.summary}</div>
                      </div>

                      <button 
                        className="get-recommendations-btn" 
                        onClick={() => getRecommendations(pattern.name, pattern.id)}
                      >
                        Get Actionable Insights
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section - Shows after demo */}
        {hasTriedDemo && !showEmailCollector && (
          <div style={{
            background: 'linear-gradient(135deg, #f0fdfa, #e6fffa)',
            border: '1px solid #14B8A6',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            margin: '2rem 0'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              color: '#0F766E', 
              marginBottom: '1rem' 
            }}>
              Want to analyze your own data?
            </h3>
            <p style={{ 
              color: '#0d9488', 
              marginBottom: '1.5rem',
              fontSize: '0.95rem'
            }}>
              You just tried our demo with sample nanny business interviews. 
              Imagine running this analysis on your own research data, customer interviews, or survey responses!
            </p>
            <button
              onClick={() => setShowEmailCollector(true)}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #0F766E, #14B8A6)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Get Early Access
            </button>
          </div>
        )}

        {/* Insights Section */}
        {showInsights && (
          <div className="insights-section" id="insights-section" style={{ display: 'block' }}>
            <div className="insights-header">
              <div>
                <div className="insights-title">Actionable Insights for {currentInsightSegment}</div>
                <div className="insights-subtitle">AI-powered recommendations for this segment</div>
              </div>
            </div>
            <div className="insights-content">
              <ul className="insights-list">
                {currentInsights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
            <div className="insights-chat">
              {/* Chat Messages */}
              {chatMessages.map((msg, index) => (
                <div 
                  key={index}
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: msg.type === 'user' ? '#f0fdfa' : '#f8fafc',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${msg.type === 'user' ? '#14B8A6' : '#6b7280'}`
                  }}
                >
                  <strong>{msg.type === 'user' ? 'You' : 'AI Assistant'}:</strong> {msg.message}
                </div>
              ))}
              
              <div className="chat-input-container">
                <textarea 
                  className="chat-input" 
                  placeholder="Ask follow-up questions about these insights..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                />
                <button 
                  className="chat-send-btn" 
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {exportModalOpen && (
        <div className="export-modal" style={{ display: 'flex' }}>
          <div className="export-modal-content">
            <div className="export-modal-title">Export Cluster Analysis</div>
            <div className="export-options">
              <button className="export-option-btn" onClick={() => {
                alert('Generating PDF report with cluster analysis and visualizations...');
                setExportModalOpen(false);
              }}>
                Download PDF Report
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Complete analysis with visualizations</div>
              </button>
              <button className="export-option-btn" onClick={() => {
                alert('Downloading CSV with raw cluster data for further analysis...');
                setExportModalOpen(false);
              }}>
                Download CSV Data
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Raw data for further analysis</div>
              </button>
              <button className="export-option-btn" onClick={() => {
                const email = prompt('Enter email address to send the report:');
                if (email) alert(`Sending cluster analysis report to ${email}...`);
                setExportModalOpen(false);
              }}>
                Email Report
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Send to team members</div>
              </button>
              <button className="export-option-btn" onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/clusters/shared/analysis-123`);
                alert('Shareable link copied to clipboard!');
                setExportModalOpen(false);
              }}>
                Copy Shareable Link
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>For internal team access</div>
              </button>
            </div>
            <button className="export-close-btn" onClick={() => setExportModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Email Collector Modal */}
      {showEmailCollector && (
        <EmailCollector
          onSubmit={handleEmailSubmit}
          onClose={() => setShowEmailCollector(false)}
        />
      )}
    </div>
  );
}
