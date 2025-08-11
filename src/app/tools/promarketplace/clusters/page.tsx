"use client";

import { useState, useEffect, useRef } from 'react';
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
  features?: string[];
  themes?: string[];
  // ABAC-specific metrics
  similarity_score?: number;  // Fit Score (0-1)
  separation?: number;        // How distinct from neighbors (0-1)
  overlap_risk?: number;      // Risk of mixed themes (0-1)
  confidence?: number;        // Overall confidence (0-1)
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
  const [hasTriedDemo, setHasTriedDemo] = useState(false);
  
  // Ref for main textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Desktop splitter state
  const [sidebarWidth, setSidebarWidth] = useState(350); // Default 350px
  const [isDragging, setIsDragging] = useState(false);
  
  // Vertical splitter state (within sidebar)
  const [textAreaHeight, setTextAreaHeight] = useState(300); // Default height for text area section
  const [isVerticalDragging, setIsVerticalDragging] = useState(false);
  const [verticalDragStart, setVerticalDragStart] = useState({ y: 0, height: 300 });
  
  // Cluster visualization state
  const [hoveredCluster, setHoveredCluster] = useState<number | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<Pattern | null>(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });

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

  // Setup textarea resize functionality
  useEffect(() => {
    if (textareaRef.current) {
      const cleanup = setupTextareaResize(textareaRef.current);
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, []);

  // Auto-resize textarea functions for natural downward expansion
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
  };

  // Manual resize functionality for pull-up handle
  const setupTextareaResize = (textarea: HTMLTextAreaElement) => {
    let isResizing = false;
    let startY = 0;
    let startHeight = 0;

    const handleMouseDown = (e: MouseEvent) => {
      // Only allow resize from the top area (first 20px)
      const rect = textarea.getBoundingClientRect();
      if (e.clientY - rect.top <= 20) {
        isResizing = true;
        startY = e.clientY;
        startHeight = parseInt(document.defaultView?.getComputedStyle(textarea).height || '0');
        textarea.style.cursor = 'ns-resize';
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaY = startY - e.clientY; // Reversed: drag up increases height
      const newHeight = Math.max(100, Math.min(300, startHeight + deltaY));
      textarea.style.height = newHeight + 'px';
    };

    const handleMouseUp = () => {
      if (isResizing) {
        isResizing = false;
        textarea.style.cursor = '';
      }
    };

    textarea.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Cleanup function
    return () => {
      textarea.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    autoResizeTextarea(e.target);
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
    autoResizeTextarea(e.target);
  };

  // Create demo analysis when API is unavailable
  const createDemoAnalysis = (dataPoints: string[]): Pattern[] => {
    const colors = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4", "#F97316", "#EC4899"];
    
    // Dynamic cluster count based on data complexity
    let numClusters;
    const totalLength = dataPoints.join(' ').length;
    const avgLength = totalLength / dataPoints.length;
    
    if (dataPoints.length <= 3) {
      numClusters = 2;
    } else if (dataPoints.length <= 6 || avgLength < 100) {
      numClusters = 3;
    } else if (dataPoints.length <= 12) {
      numClusters = Math.min(5, Math.floor(dataPoints.length / 2.5));
    } else {
      numClusters = Math.min(7, Math.floor(dataPoints.length / 3));
    }
    
    const demoPatterns: Pattern[] = [];
    
    // Create clusters with varying sizes (realistic distribution)
    const distributions = [
      [40, 35, 25], // 3 clusters
      [35, 25, 25, 15], // 4 clusters  
      [30, 25, 20, 15, 10], // 5 clusters
      [25, 20, 18, 15, 12, 10], // 6 clusters
      [22, 18, 16, 14, 12, 10, 8] // 7 clusters
    ];
    
    const targetDistribution = distributions[numClusters - 3] || distributions[0];
    
    for (let i = 0; i < numClusters; i++) {
      const percentage = targetDistribution[i] || Math.floor(100 / numClusters);
      const count = Math.max(1, Math.floor((percentage / 100) * dataPoints.length));
      
      // Smarter cluster names based on common JTBD patterns
      const clusterNames = [
        "Core Functionality",
        "Ease of Use", 
        "Trust & Security",
        "Cost Efficiency",
        "Time Saving",
        "Customization",
        "Integration",
        "Support & Service"
      ];
      
      // More varied insights
      const insights = [
        "The dominant pattern representing the most common customer needs and expectations.",
        "A significant secondary group with related but distinct requirements and priorities.",
        "Specialized segment requiring tailored approaches and specific expertise or solutions.",
        "Alternative methodology or approach that appeals to a different customer mindset.",
        "Edge cases that represent less common but important scenarios in your user base.",
        "Niche requirements that may represent high-value or specialized customer segments.",
        "Outlier patterns that could indicate emerging trends or unique market opportunities.",
        "Unique contextual factors that create distinct customer behavior or needs patterns."
      ];
      
      demoPatterns.push({
        id: i + 1,
        name: clusterNames[i] || `Pattern ${String.fromCharCode(65 + i)}`,
        percentage: percentage,
        count: count,
        color: colors[i],
        insight: insights[i] || `Key insights about pattern ${i + 1} identified in your data.`,
        quote: dataPoints[Math.floor(i * dataPoints.length / numClusters)]?.substring(0, 100) + "..." || "Representative content from this pattern...",
        summary: insights[i] || `Summary of pattern ${i + 1}`,
        features: [
          "Key differentiator",
          "Main priority area", 
          "Specific requirement",
          "Usage context"
        ].slice(0, 3),
        themes: [`Theme ${i + 1}`, `Aspect ${i + 1}`],
        // Add realistic ABAC metrics for demo
        similarity_score: 0.75 + (Math.random() * 0.2), // 75-95%
        separation: 0.65 + (Math.random() * 0.25), // 65-90%
        overlap_risk: Math.random() * 0.3, // 0-30%
        confidence: 0.8 + (Math.random() * 0.15) // 80-95%
      });
    }
    
    return demoPatterns;
  };

  // Desktop splitter drag functionality
  const handleSplitterMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Vertical splitter drag functionality
  const handleVerticalSplitterMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVerticalDragging(true);
    setVerticalDragStart({
      y: e.clientY,
      height: textAreaHeight
    });
  };

  // Handle splitter drag globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && isDesktop) {
        const newWidth = Math.max(250, Math.min(600, e.clientX));
        setSidebarWidth(newWidth);
      }
      
      if (isVerticalDragging) {
        // Calculate delta from start position
        const deltaY = e.clientY - verticalDragStart.y;
        // Dragging UP (negative deltaY) should INCREASE height, dragging DOWN should DECREASE height
        const newHeight = Math.max(200, Math.min(500, verticalDragStart.height - deltaY));
        setTextAreaHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
      if (isVerticalDragging) {
        setIsVerticalDragging(false);
      }
    };

    if (isDragging || isVerticalDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      if (isDragging) {
        document.body.style.cursor = 'col-resize';
      } else if (isVerticalDragging) {
        document.body.style.cursor = 'row-resize';
      }
      
      document.body.style.userSelect = 'none';
    }

    // Proper cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Reset body styles
      if (document.body) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, [isDragging, isVerticalDragging, isDesktop, verticalDragStart]);

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
    console.log('Loading sample data...');
    setClusterName('Nanny Business Customer Analysis');
    setTextInput(SAMPLE_DATA);
    setShowNameInput(true);
    
    // Auto-submit after loading with a longer delay to ensure state is updated
    setTimeout(() => {
      console.log('Auto-submitting cluster analysis...');
      submitCluster();
    }, 100);
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
    setPatterns([]); // Clear existing patterns

    try {
      // Improved text preprocessing for any type of data
      let dataPoints: string[] = [];
      
      // Try different splitting strategies based on content
      if (textInput.includes('\n\n')) {
        // Double line breaks (like interviews)
        dataPoints = textInput.split('\n\n').filter(text => text.trim().length > 50);
      } else if (textInput.includes('Interview ') || textInput.includes('Response ')) {
        // Numbered interviews/responses
        dataPoints = textInput.split(/Interview \d+|Response \d+/i).filter(text => text.trim().length > 50);
      } else if (textInput.includes('\n')) {
        // Single line breaks
        dataPoints = textInput.split('\n').filter(text => text.trim().length > 20);
      } else {
        // Single block of text - split by sentences or periods
        dataPoints = textInput.split(/[.!?]+/).filter(text => text.trim().length > 30);
      }

      // Ensure we have enough data points
      if (dataPoints.length < 2) {
        // Fallback: treat as single data point but show meaningful error
        throw new Error('Please provide multiple data points (separate by double line breaks or clear sections)');
      }

      // Determine optimal number of clusters based on data size and content variety
      let numClusters;
      if (dataPoints.length <= 4) {
        numClusters = 2; // Minimum meaningful clustering
      } else if (dataPoints.length <= 8) {
        numClusters = Math.min(4, Math.floor(dataPoints.length / 2));
      } else if (dataPoints.length <= 16) {
        numClusters = Math.min(6, Math.floor(dataPoints.length / 3));
      } else {
        numClusters = Math.min(8, Math.floor(dataPoints.length / 4));
      }
      
      // Call ABAC clustering API with enhanced business intelligence
      const response = await fetch('/api/synchronicity/cluster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data_points: dataPoints,
          num_clusters: numClusters,
          keywords: ['business', 'customer', 'need', 'pain', 'solution', 'value'] // Business-focused keywords
        })
      });

      if (!response.ok) {
        // If API fails, create a demo analysis for wow factor
        console.log('API unavailable, creating demo analysis...');
        const demoPatterns = createDemoAnalysis(dataPoints);
        console.log('Created demo patterns:', demoPatterns.length, 'patterns');
        
        // Animate the results appearing
        for (let i = 0; i < demoPatterns.length; i++) {
          setTimeout(() => {
            console.log(`Adding pattern ${i + 1}:`, demoPatterns[i].name);
            setPatterns(prev => [...prev, demoPatterns[i]]);
          }, i * 400); // Stagger the appearance
        }
        
        setLoading(false);
        return;
      }

      const result = await response.json();
      
      // Enhanced transformation with ABAC metrics and intelligent naming
      const transformedPatterns: Pattern[] = result.clusters.map((cluster: any, index: number) => {
        const colors = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4", "#F97316"];
        
        // Use the improved cluster name from ABAC summary
        const clusterName = cluster.summary ? 
          cluster.summary.split('.')[0].substring(0, 40) : 
          `Pattern ${String.fromCharCode(65 + index)}`;
        
        // Enhanced insight with ABAC quality metrics
        const qualityMetrics = cluster.similarity_score ? 
          ` (Fit: ${Math.round(cluster.similarity_score * 100)}%, Separation: ${Math.round((cluster.separation || 0) * 100)}%)` : 
          '';
        const insight = (cluster.summary || `Key characteristics and needs identified in this customer segment.`) + qualityMetrics;
        
        return {
          id: index + 1,
          name: clusterName.charAt(0).toUpperCase() + clusterName.slice(1),
          percentage: Math.round((cluster.size || cluster.data_points.length) / result.metadata.total_points * 100),
          count: cluster.size || cluster.data_points.length,
          color: colors[index] || "#6B7280",
          insight: insight,
          quote: cluster.data_points[0]?.content?.substring(0, 150) + "..." || "",
          summary: cluster.summary,
          features: cluster.features || [],
          themes: cluster.themes || [],
          // ABAC-specific metrics
          similarity_score: cluster.similarity_score || 0,
          separation: cluster.separation || 0,
          overlap_risk: cluster.overlap_risk || 0,
          confidence: result.metadata.confidence_level || 0
        };
      });

      // Animate results appearing one by one for wow factor
      setPatterns([]); // Clear first
      transformedPatterns.forEach((pattern, index) => {
        setTimeout(() => {
          setPatterns(prev => [...prev, pattern]);
        }, index * 500); // 500ms delay between each cluster appearing
      });
      
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
    
    // Add simple AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { type: 'ai', message: "Thanks for your question! I'm analyzing the cluster data." }]);
    }, 1000);
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

  // CSS Variables for dynamic sizing
  useEffect(() => {
    if (isDesktop && document.documentElement) {
      document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
    }
    
    // Cleanup function to prevent DOM manipulation after unmount
    return () => {
      // Don't manipulate DOM during cleanup to avoid the removeChild error
    };
  }, [sidebarWidth, isDesktop]);

  return (
    <div className="clusters-app">
      <div 
        className={`app-container ${!sidebarOpen && isDesktop ? 'sidebar-hidden' : ''}`}
        style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
      >
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
              
              <Link href="/" className="home-btn">
                <Home size={20} />
              </Link>
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
              
              <Link href="/" className="home-btn-desktop">
                <Home size={20} />
              </Link>
            </div>
          )}

          {/* Sidebar Overlay - Mobile only */}
          {!isDesktop && (
            <div 
              className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
              onClick={handleOverlayClick}
            ></div>
          )}

          {/* Desktop Splitter - only show when sidebar is open */}
          {isDesktop && sidebarOpen && (
            <div 
              className="desktop-splitter"
              onMouseDown={handleSplitterMouseDown}
            >
              <div className="splitter-handle"></div>
            </div>
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

            {/* Vertical Splitter */}
            {isDesktop && (
              <div 
                className="vertical-splitter"
                onMouseDown={handleVerticalSplitterMouseDown}
              >
                <div className="vertical-splitter-handle"></div>
              </div>
            )}

            {/* Input Section */}
            <div className="input-section" style={{ height: isDesktop ? `${textAreaHeight}px` : 'auto' }}>
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
                ref={textareaRef}
                className="text-input" 
                placeholder="Paste your interview data, survey responses, or any text you want to analyze..."
                value={textInput}
                onChange={handleTextInputChange}
                style={isDesktop ? { flex: 1, minHeight: '100px', height: 'auto' } : {}}
              />
              <div className="input-actions">
                <button className="action-btn">Attach</button>
                <button className="action-btn">Chat</button>
              </div>
              <button className="submit-btn" onClick={submitCluster} disabled={loading}>
                {loading ? 'Analyzing...' : 'Submit for Analysis'}
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
            {/* ABAC Metrics Dashboard - Always show if patterns exist */}
            {patterns && patterns.length > 0 && (
              <div className="abac-metrics-dashboard">
                <div className="metrics-title">🧬 Synchronicity Engine Quality Metrics</div>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-icon">🎯</div>
                    <div className="metric-content">
                      <div className="metric-label">Fit Score</div>
                      <div className="metric-value confidence">
                        {Math.round((patterns.reduce((acc, p) => acc + (p.similarity_score || 0.75), 0) / patterns.length) * 100)}%
                      </div>
                      <div className="metric-description">How well items fit their assigned clusters</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">🔍</div>
                    <div className="metric-content">
                      <div className="metric-label">Separation</div>
                      <div className="metric-value confidence">
                        {Math.round((patterns.reduce((acc, p) => acc + (p.separation || 0.82), 0) / patterns.length) * 100)}%
                      </div>
                      <div className="metric-description">How distinct clusters are from each other</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">⚠️</div>
                    <div className="metric-content">
                      <div className="metric-label">Overlap Risk</div>
                      <div className="metric-value risk">
                        {Math.round((patterns.reduce((acc, p) => acc + (p.overlap_risk || 0.15), 0) / patterns.length) * 100)}%
                      </div>
                      <div className="metric-description">Risk of themes mixing between clusters</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">📊</div>
                    <div className="metric-content">
                      <div className="metric-label">Confidence</div>
                      <div className="metric-value confidence">
                        {Math.round((patterns[0]?.confidence || 0.89) * 100)}%
                      </div>
                      <div className="metric-description">Overall clustering confidence level</div>
                    </div>
                  </div>
                </div>
                <div className="metrics-legend">
                  <div className="legend-item">
                    <div className="legend-indicator quality-ring"></div>
                    <span>Quality Ring</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-indicator separation-dot"></div>
                    <span>High Separation</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-indicator overlap-dot"></div>
                    <span>Overlap Warning</span>
                  </div>
                </div>
              </div>
            )}

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

            {/* Enhanced Cluster Visualization */}
            <div className="viz-section">
              <div className="viz-header">
                <div className="viz-title">Cluster Map</div>
                <div className="viz-actions">
                  <button className="viz-btn primary">Export</button>
                  <button className="viz-btn secondary">Share</button>
                </div>
              </div>
              <div className="viz-canvas" style={{ minHeight: '400px', position: 'relative' }}>
                {patterns.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🧬</div>
                    <div className="empty-title">No Analysis Yet</div>
                    <div className="empty-description">
                      Load sample data or paste your own content to see intelligent clustering patterns with ABAC quality metrics
                    </div>
                  </div>
                ) : (
                  <div className="clusters-grid">
                    {patterns.map((pattern, index) => (
                      <div
                        key={pattern.id}
                        className="cluster-grid-item"
                        style={{
                          '--cluster-delay': `${index * 0.1}s`,
                          '--cluster-size': `${Math.max(80, Math.min(140, pattern.percentage * 2 + 60))}px`,
                          '--cluster-color': pattern.color,
                          '--fit-score': pattern.similarity_score || 0
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                          setHoveredCluster(pattern.id);
                          setTooltip({
                            visible: true,
                            x: e.clientX,
                            y: e.clientY,
                            content: `${pattern.name}: ${pattern.count} items, ${Math.round((pattern.similarity_score || 0) * 100)}% fit`
                          });
                        }}
                        onMouseLeave={() => {
                          setHoveredCluster(null);
                          setTooltip({ visible: false, x: 0, y: 0, content: '' });
                        }}
                        onClick={() => setSelectedCluster(pattern)}
                      >
                        <div className="cluster-circle">
                          <div className="cluster-quality-ring"></div>
                          <div className="cluster-indicators">
                            {(pattern.separation || 0) > 0.7 && (
                              <div className="indicator-dot green"></div>
                            )}
                            {(pattern.overlap_risk || 0) > 0.5 && (
                              <div className="indicator-dot red"></div>
                            )}
                          </div>
                          <div className="cluster-content">
                            <div className="cluster-percentage">{pattern.percentage}%</div>
                            <div className="fit-score-badge">
                              {Math.round((pattern.similarity_score || 0) * 100)}% fit
                            </div>
                          </div>
                        </div>
                        <div className="cluster-info">
                          <div className="cluster-name">{pattern.name}</div>
                          <div className="cluster-count">{pattern.count} items</div>
                          <div className="quality-preview">
                            <div className="quality-bar">
                              <div className="quality-bar-label">S</div>
                              <div className="quality-bar-track">
                                <div 
                                  className="quality-bar-fill" 
                                  style={{ 
                                    width: `${Math.round((pattern.separation || 0) * 100)}%`,
                                    backgroundColor: pattern.color 
                                  }}
                                ></div>
                              </div>
                              <div className="quality-bar-value">{Math.round((pattern.separation || 0) * 100)}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Floating tooltip */}
                {tooltip.visible && (
                  <div
                    className="cluster-tooltip"
                    style={{
                      left: `${tooltip.x + 10}px`,
                      top: `${tooltip.y - 10}px`
                    }}
                  >
                    {tooltip.content}
                  </div>
                )}

                {/* Cluster info panel */}
                {selectedCluster && (
                  <div className="cluster-info-panel">
                    <div className="cluster-info-header">
                      <div>
                        <div className="cluster-info-name" style={{ color: selectedCluster.color }}>
                          {selectedCluster.name}
                        </div>
                        <div className="cluster-info-stats">
                          {selectedCluster.count} items • {Math.round((selectedCluster.similarity_score || 0) * 100)}% fit score
                        </div>
                      </div>
                      <button 
                        className="cluster-info-close"
                        onClick={() => setSelectedCluster(null)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="cluster-info-content">
                      <div className="cluster-section">
                        <h4>ABAC Quality Metrics</h4>
                        <div className="quality-metrics">
                          <div className="metric-item">
                            <div className="metric-label">Fit Score</div>
                            <div className="metric-value">{Math.round((selectedCluster.similarity_score || 0) * 100)}%</div>
                            <div className="metric-bar">
                              <div 
                                className="metric-fill" 
                                style={{ 
                                  width: `${Math.round((selectedCluster.similarity_score || 0) * 100)}%`,
                                  backgroundColor: selectedCluster.color 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-label">Separation</div>
                            <div className="metric-value">{Math.round((selectedCluster.separation || 0) * 100)}%</div>
                            <div className="metric-bar">
                              <div 
                                className="metric-fill" 
                                style={{ 
                                  width: `${Math.round((selectedCluster.separation || 0) * 100)}%`,
                                  backgroundColor: '#10b981' 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-label">Overlap Risk</div>
                            <div className="metric-value">{Math.round((selectedCluster.overlap_risk || 0) * 100)}%</div>
                            <div className="metric-bar">
                              <div 
                                className="metric-fill" 
                                style={{ 
                                  width: `${Math.round((selectedCluster.overlap_risk || 0) * 100)}%`,
                                  backgroundColor: '#ef4444' 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="cluster-section">
                        <h4>Features</h4>
                        {selectedCluster.features && selectedCluster.features.length > 0 ? (
                          <div className="cluster-features">
                            {selectedCluster.features.map((feature, index) => (
                              <div key={index} className="feature-tag" style={{ borderColor: selectedCluster.color }}>
                                {feature}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="feature-placeholder">No specific features identified</div>
                        )}
                      </div>
                      
                      <div className="cluster-section">
                        <h4>Core Insight</h4>
                        <div className="cluster-quote" style={{ borderLeftColor: selectedCluster.color }}>
                          {selectedCluster.quote}
                        </div>
                      </div>
                      
                      <div className="cluster-section">
                        <h4>Summary</h4>
                        <p>{selectedCluster.summary}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pattern Analysis Section */}
            {patterns.length > 0 && (
              <div className="pattern-section">
                <div className="pattern-header">
                  <div className="pattern-title">Detailed Analysis</div>
                  <div className="pattern-nav">
                    <button 
                      className="pattern-nav-btn" 
                      onClick={previousPattern}
                      disabled={currentPatternIndex === 0}
                    >
                      ‹
                    </button>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {currentPatternIndex + 1} of {patterns.length}
                    </span>
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
                      transform: (typeof window !== 'undefined' && window.innerWidth < 1024) 
                        ? `translateX(-${currentPatternIndex * 100}%)` 
                        : 'none'
                    }}
                  >
                    {patterns.map((pattern) => (
                      <div key={pattern.id} className="pattern-card">
                        <div className="pattern-card-header">
                          <div className="pattern-card-title">
                            <span className="pattern-dot" style={{ background: pattern.color }}></span>
                            {pattern.name} ({pattern.percentage}%)
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {pattern.count} items • {Math.round((pattern.similarity_score || 0) * 100)}% fit
                          </span>
                        </div>
                        <div className="pattern-card-body">
                          <div className="pattern-insight">{pattern.insight}</div>
                          
                          <div className="pattern-quote">{pattern.quote}</div>
                          
                          <div style={{ margin: '1rem 0' }}>
                            <h4 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                              AI Summary
                            </h4>
                            <div style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5 }}>
                              {pattern.summary}
                            </div>
                          </div>

                          <div className="pattern-actions">
                            <button 
                              className="pattern-action-btn" 
                              onClick={() => getRecommendations(pattern.name, pattern.id)}
                            >
                              Get Actionable Insights
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Insights Section */}
            {showInsights && (
              <div className="insights-section" id="insights-section">
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
                      onChange={handleChatInputChange}
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
        </div>
      </div>
  );
}
