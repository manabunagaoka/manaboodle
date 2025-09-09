// components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Search from './Search';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileSearchOpen(false); // Close search when opening menu
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    setIsMobileMenuOpen(false); // Close menu when opening search
  };

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoContainer}>
            <div className={styles.logoWithIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={styles.logoIcon}>
                <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
                <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
                <circle cx="6" cy="18" r="1.5" fill="currentColor"/>
                <circle cx="18" cy="18" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="3" r="1" fill="currentColor" opacity="0.5"/>
                <circle cx="12" cy="21" r="1" fill="currentColor" opacity="0.5"/>
                <circle cx="3" cy="12" r="1" fill="currentColor" opacity="0.5"/>
                <circle cx="21" cy="12" r="1" fill="currentColor" opacity="0.5"/>
                <path d="M6 6 L12 12 L18 6" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4"/>
                <path d="M6 18 L12 12 L18 18" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4"/>
                <path d="M6 6 L18 18" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2"/>
                <path d="M18 6 L6 18" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2"/>
                <path d="M12 3 L12 21" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15"/>
                <path d="M3 12 L21 12" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15"/>
              </svg>
              <h1 className={styles.logoText}>Manaboodle</h1>
            </div>
            <div className={styles.byline}>by Manabu Nagaoka</div>
          </div>
        </Link>

        <nav className={`${styles.navMenu} ${isMobileMenuOpen ? styles.navMenuOpen : ''}`}>
          <Link 
            href="/about"
            className={styles.navLink}
            data-active={pathname === '/about'}
            onClick={closeMobileMenu}
          >
            About
          </Link>
          <Link 
            href="/concepts"
            className={styles.navLink}
            data-active={pathname === '/concepts'}
            onClick={closeMobileMenu}
          >
            Concepts
          </Link>
          <Link 
            href="/projects"
            className={styles.navLink}
            data-active={pathname === '/projects'}
            onClick={closeMobileMenu}
          >
            Projects
          </Link>
          <Link 
            href="/casestudies"
            className={styles.navLink}
            data-active={pathname === '/casestudies'}
            onClick={closeMobileMenu}
          >
            Case Studies
          </Link>
          <Link 
            href="/random"
            className={styles.navLink}
            data-active={pathname === '/random'}
            onClick={closeMobileMenu}
          >
            Random
          </Link>
          <Link 
            href="/tools"
            className={styles.navLink}
            data-active={pathname === '/tools' || pathname.startsWith('/tools/')}
            onClick={closeMobileMenu}
          >
            Tools
          </Link>
          <Link 
            href="/contact"
            className={styles.navLink}
            data-active={pathname === '/contact'}
            onClick={closeMobileMenu}
          >
            Contact
          </Link>
        </nav>

        <div className={styles.navActions}>
          {/* Desktop search - always visible */}
          <div className={styles.desktopSearch}>
            <Search />
          </div>
          
          {/* Mobile actions */}
          <div className={styles.mobileActions}>
            <button 
              className={styles.searchBtn}
              onClick={toggleMobileSearch}
              aria-label="Toggle search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <Link 
              href="/subscribe" 
              className={styles.subscribeBtn}
              onClick={closeMobileMenu}
            >
              Subscribe
            </Link>
            <button 
              className={styles.menuBtn}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile search overlay */}
        {isMobileSearchOpen && (
          <div className={styles.mobileSearchOverlay}>
            <div className={styles.mobileSearchContainer}>
              <Search />
              <button 
                className={styles.closeSearchBtn}
                onClick={toggleMobileSearch}
                aria-label="Close search"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}