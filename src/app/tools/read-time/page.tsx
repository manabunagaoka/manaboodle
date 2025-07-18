// app/tools/read-time/page.tsx
'use client'

import { useState } from 'react';
import Link from 'next/link';
import styles from '../tools.module.css';

export default function ReadTimeCalculatorPage() {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(225);
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    paragraphs: 0,
    readTime: 0
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);

  const calculateStats = async () => {
    if (!text.trim()) {
      setStats({ words: 0, characters: 0, paragraphs: 0, readTime: 0 });
      setShowResults(false);
      return;
    }

    // Start the calculation animation
    setIsCalculating(true);
    setShowResults(false);
    setProgress(0);

    // Simulate progress steps
    const steps = [
      { progress: 20, label: "Analyzing text structure..." },
      { progress: 40, label: "Counting words and paragraphs..." },
      { progress: 60, label: "Calculating complexity..." },
      { progress: 80, label: "Determining reading speed..." },
      { progress: 100, label: "Finalizing results..." }
    ];

    for (let step of steps) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(step.progress);
    }

    // Do the actual calculation
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characters = text.length;
    const paragraphs = text.split(/\n\n+/).filter(para => para.trim().length > 0).length;
    const readTime = Math.ceil(words / wpm);

    await new Promise(resolve => setTimeout(resolve, 200));
    
    setStats({ words, characters, paragraphs, readTime });
    setIsCalculating(false);
    setShowResults(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setShowResults(false); // Hide results when text changes
  };

  const handleWpmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWpm = parseInt(e.target.value);
    setWpm(newWpm);
    if (showResults && text.trim()) {
      // Recalculate if results are showing
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      const newReadTime = Math.ceil(words / newWpm);
      setStats(prev => ({ ...prev, readTime: newReadTime }));
    }
  };

  const handleClear = () => {
    setText('');
    setStats({ words: 0, characters: 0, paragraphs: 0, readTime: 0 });
    setShowResults(false);
    setProgress(0);
  };

  return (
    <div className={styles.toolPage}>
      <Link href="/tools" className={styles.backLink}>← Back to Tools</Link>
      
      <header className={styles.toolHeader}>
        <h1 className={styles.toolPageTitle}>Read Time Calculator</h1>
        <p className={styles.toolPageDescription}>
          Paste your article text to calculate reading time and get detailed statistics
        </p>
      </header>

      <div className={styles.toolContent}>
        <div className={styles.toolContainer}>
          {/* Input Section */}
          <div style={{ marginBottom: '2rem' }}>
            <label 
              htmlFor="content" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 600,
                color: '#374151'
              }}
            >
              Article Content
            </label>
            <textarea
              id="content"
              value={text}
              onChange={handleTextChange}
              placeholder="Paste your article text here..."
              style={{
                width: '100%',
                minHeight: '300px',
                padding: '1rem',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical',
                fontFamily: 'inherit',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0F766E'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {/* Controls */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            <button
              onClick={calculateStats}
              disabled={isCalculating || !text.trim()}
              style={{
                background: isCalculating ? '#6B7280' : '#0F766E',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: isCalculating || !text.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: !text.trim() ? 0.5 : 1
              }}
              onMouseOver={(e) => !isCalculating && text.trim() && (e.currentTarget.style.background = '#0D685D')}
              onMouseOut={(e) => !isCalculating && (e.currentTarget.style.background = '#0F766E')}
            >
              {isCalculating ? 'Calculating...' : 'Calculate'}
            </button>
            
            <button
              onClick={handleClear}
              style={{
                background: '#6B7280',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#4B5563'}
              onMouseOut={(e) => e.currentTarget.style.background = '#6B7280'}
            >
              Clear
            </button>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginLeft: 'auto' 
            }}>
              <label htmlFor="wpm" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                Reading speed:
              </label>
              <select
                id="wpm"
                value={wpm}
                onChange={handleWpmChange}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="200">Slow (200 wpm)</option>
                <option value="225">Average (225 wpm)</option>
                <option value="250">Fast (250 wpm)</option>
                <option value="300">Very Fast (300 wpm)</option>
              </select>
            </div>
          </div>

          {/* Progress Bar */}
          {isCalculating && (
            <div style={{
              marginBottom: '2rem',
              background: '#F9FAFB',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                marginBottom: '0.75rem',
                textAlign: 'center'
              }}>
                Analyzing your content...
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#E5E7EB',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: '#0F766E',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#9CA3AF',
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                {progress}% complete
              </div>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div style={{
              background: '#F9FAFB',
              borderRadius: '8px',
              padding: '1.5rem',
              animation: 'fadeIn 0.5s ease-in'
            }}>
              {/* Primary Result */}
              <div style={{
                background: 'white',
                border: '2px solid #0F766E',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                  Reading Time
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0F766E' }}>
                  {stats.readTime} min
                </div>
              </div>

              {/* Secondary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div style={{ 
                  background: 'white', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                    Word Count
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>
                    {stats.words.toLocaleString()}
                  </div>
                </div>

                <div style={{ 
                  background: 'white', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                    Characters
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>
                    {stats.characters.toLocaleString()}
                  </div>
                </div>

                <div style={{ 
                  background: 'white', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                    Paragraphs
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>
                    {stats.paragraphs.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className={styles.toolFooter}>
        <Link href="/tools" className={styles.backToTools}>← Back to Tools</Link>
        <Link href="/" className={styles.backHome}>← Back to Home</Link>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}