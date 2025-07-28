// app/tools/sassy/page.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import styles from '../tools.module.css';
import sassyStyles from './sassy.module.css';
import { analyzeVibe, type VibeAnalysis } from './lib/newsletter-detector';

// Components
import SassyCharacter from './components/SassyCharacter';
import { TrashIcon, CopyIcon } from './components/SassyIcons';

export default function SassyPage() {
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [vibeAnalysis, setVibeAnalysis] = useState<VibeAnalysis>({
    vibe: 'personal',
    score: 0,
    warnings: [],
    mood: 'happy',
    botMessage: "Start typing to see what I think!"
  });
  
  // Draggable character state
  const [position, setPosition] = useState({ x: null as number | null, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const characterRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize position
  useEffect(() => {
    if (position.x === null && mounted) {
      // Check if mobile (narrower than 768px)
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // Center on mobile
        setPosition({ 
          x: (window.innerWidth - 120) / 2, // Center horizontally
          y: window.innerHeight / 2 // Middle of screen
        });
      } else {
        // Desktop position
        setPosition({ 
          x: window.innerWidth - 180, 
          y: 150 
        });
      }
    }
  }, [position.x, mounted]);

  // Update analysis when content changes
  useEffect(() => {
    const analysis = analyzeVibe(content);
    setVibeAnalysis(analysis);
  }, [content]);

  // Word count
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.split(/\s+/).filter(word => word.length > 0);
    
    // Enforce 200 word limit
    if (words.length <= 200) {
      setContent(text);
    }
  };

  const handleCopy = async () => {
    const emailText = `${content}

---
Sassy Vibe Score: ${vibeAnalysis.score}% human
Written with Sassy - The Anti-Newsletter Companion
Challenge yourself at manaboodle.com/tools/sassy`;

    try {
      await navigator.clipboard.writeText(emailText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClear = () => {
    setContent('');
  };

  // Dragging handlers for both mouse and touch
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    const rect = characterRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (isDragging) {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 150, clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 150, clientY - dragOffset.y))
      });
    }
  }, [isDragging, dragOffset]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      // Touch events
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  return (
    <div className={styles.toolPage}>
      <Link href="/tools" className={styles.backLink}>← Back to Tools</Link>
      
      <div style={{ background: '#fff', minHeight: 'calc(100vh - 200px)' }}>
        <div className={sassyStyles.sassyWrapper}>
          <header className={sassyStyles.sassyHeader}>
            <h1 className={sassyStyles.sassyTitle}>Sassy</h1>
            {mounted && (
              <p style={{ color: '#666', fontSize: '0.875rem', margin: 0 }}>
                Making newsletter updates personal again
              </p>
            )}
          </header>

          <div className={sassyStyles.sassyContent}>
            <div className={sassyStyles.sassyMain}>
              <div className={sassyStyles.sassyForm}>
                <div className={sassyStyles.formGroup}>
                  <div className={sassyStyles.labelRow}>
                    <label htmlFor="content" className={sassyStyles.formLabel}>
                      Your "Totally Human" Message
                    </label>
                    <span className={sassyStyles.wordCount} style={{ 
                      color: wordCount > 180 ? '#E5555C' : '#55A653' 
                    }}>
                      {wordCount}/200 words
                    </span>
                  </div>
                  <textarea
                    id="content"
                    value={content}
                    onChange={handleContentChange}
                    placeholder="If you landed here, it means you're a newsletter author. Here's the truth: no one really wants another newsletter in their inbox—not even your friends. But there's hope! Sassy will help you write simple email notifications that feel like personal messages. Try writing like a human, not an AI bot. Keep an eye on the Vibe Meter as you type."
                    className={sassyStyles.formTextarea}
                    rows={6}
                  />
                </div>

                {/* Vibe Meter */}
                <div className={sassyStyles.vibeMeter}>
                  <div className={sassyStyles.vibeMeterHeader}>
                    <span className={sassyStyles.vibeMeterLabel}>Vibe Meter</span>
                    <span className={sassyStyles.vibeMeterValue} style={{ 
                      color: vibeAnalysis.score >= 80 ? '#55A653' : 
                             vibeAnalysis.score >= 60 ? '#EAAA31' : '#E5555C' 
                    }}>
                      {vibeAnalysis.score}%
                    </span>
                  </div>
                  <div className={sassyStyles.vibeMeterBar}>
                    <div 
                      className={sassyStyles.vibeMeterFill} 
                      style={{ 
                        width: `${vibeAnalysis.score}%`,
                        background: vibeAnalysis.score >= 80 ? '#55A653' : 
                                   vibeAnalysis.score >= 60 ? '#EAAA31' : '#E5555C'
                      }}
                    />
                  </div>
                </div>

                <div className={sassyStyles.actionButtons}>
                  <button
                    type="button"
                    onClick={handleClear}
                    className={sassyStyles.btnSecondary}
                  >
                    <span className={sassyStyles.btnIcon}><TrashIcon /></span>
                    Start Over
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={sassyStyles.btnPrimary}
                    disabled={!content}
                  >
                    <span className={sassyStyles.btnIcon}><CopyIcon /></span>
                    {copied ? 'Copied! (Good luck with that)' : 'Copy & Share Your Score'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footnote inside Sassy container */}
          <div style={{ 
            textAlign: 'center', 
            padding: '1rem 0 0.5rem', 
            color: '#666', 
            fontSize: '0.875rem' 
          }}>
            Part of the <strong>Manaboodle</strong> ecosystem. Crafted with ❤️ for authentic human connection.
          </div>
        </div>

        {/* Draggable Sassy Character with Speech Bubble */}
        {position.x !== null && (
          <div 
            ref={characterRef}
            className={sassyStyles.draggableCharacter}
            style={{ 
              left: position.x, 
              top: position.y,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className={sassyStyles.characterContainer}>
              {/* Speech bubble integrated with character */}
              {content && (
                <div className={sassyStyles.speechBubbleWrapper}>
                  <div className={sassyStyles.speechBubble}>
                    {vibeAnalysis.botMessage}
                  </div>
                </div>
              )}
              
              <div className={sassyStyles.characterWrapper}>
                <SassyCharacter mood={vibeAnalysis.mood} score={vibeAnalysis.score} />
                <div className={sassyStyles.dragHint} style={{
                  opacity: content ? 0 : 1,
                  transition: 'opacity 0.3s ease'
                }}>
                  Drag me!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className={styles.toolFooter}>
        <Link href="/" className={styles.backHome}>← Back to Home</Link>
      </footer>
    </div>
  );
}