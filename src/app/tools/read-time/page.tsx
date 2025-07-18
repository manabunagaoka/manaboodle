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

  const calculateStats = (content: string) => {
    if (!content.trim()) {
      setStats({ words: 0, characters: 0, paragraphs: 0, readTime: 0 });
      return;
    }

    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characters = content.length;
    const paragraphs = content.split(/\n\n+/).filter(para => para.trim().length > 0).length;
    const readTime = Math.ceil(words / wpm);

    setStats({ words, characters, paragraphs, readTime });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    calculateStats(newText);
  };

  const handleWpmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWpm = parseInt(e.target.value);
    setWpm(newWpm);
    calculateStats(text);
  };

  const handleClear = () => {
    setText('');
    setStats({ words: 0, characters: 0, paragraphs: 0, readTime: 0 });
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
              onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
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
              onClick={() => calculateStats(text)}
              style={{
                background: '#7C3AED',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#6D28D9'}
              onMouseOut={(e) => e.currentTarget.style.background = '#7C3AED'}
            >
              Calculate
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

          {/* Results */}
          {(stats.words > 0 || text.length > 0) && (
            <div style={{
              background: '#F9FAFB',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              {/* Primary Result */}
              <div style={{
                background: 'white',
                border: '2px solid #7C3AED',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>
                  Reading Time
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#7C3AED' }}>
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
    </div>
  );
}