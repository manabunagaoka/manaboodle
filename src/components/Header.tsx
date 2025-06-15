'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <header className="header">
        <nav className="nav-container">
          <div className="logo-container">
            <Link href="/" className="logo">
              Manaboodle
            </Link>
            <div className="byline">by Manabu Nagaoka</div>
          </div>
          
          <div className="nav-menu">
            <Link href="/" className="nav-link active">About</Link>
            <Link href="/concepts" className="nav-link">Concepts</Link>
            <Link href="/projects" className="nav-link">Projects</Link>
            <Link href="/random" className="nav-link">Random</Link>
            <Link href="/archive" className="nav-link">Archive</Link>
          </div>
          
          <div className="nav-actions">
            <div className="search-container">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search articles..."
              />
            </div>
            <Link href="/subscribe" className="subscribe-btn">
              Subscribe
            </Link>
            <button className="menu-btn" onClick={toggleMenu}>
              ☰
            </button>
          </div>
        </nav>
      </header>

      {/* Overlay */}
      <div 
        className={`overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-logo-container">
            <span className="logo">Manaboodle</span>
            <div className="byline">by Manabu Nagaoka</div>
          </div>
          <button className="close-btn" onClick={closeMenu}>×</button>
        </div>
        <div className="mobile-search">
          <input type="text" className="search-input" placeholder="Search articles..." />
        </div>
        <div className="mobile-nav-links">
          <Link href="/" className="mobile-nav-link" onClick={closeMenu}>About</Link>
          <Link href="/concepts" className="mobile-nav-link" onClick={closeMenu}>Concepts</Link>
          <Link href="/projects" className="mobile-nav-link" onClick={closeMenu}>Projects</Link>
          <Link href="/random" className="mobile-nav-link" onClick={closeMenu}>Random</Link>
          <Link href="/archive" className="mobile-nav-link" onClick={closeMenu}>Archive</Link>
          <Link href="/subscribe" className="mobile-nav-link" onClick={closeMenu}>Subscribe</Link>
        </div>
      </nav>
    </>
  );
}
