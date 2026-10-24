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
          <h1 className={styles.logoText}>Manaboodle</h1>
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
            {/* TEMPORARILY HIDDEN: Subscribe button
            <Link 
              href="/subscribe" 
              className={styles.subscribeBtn}
              onClick={closeMobileMenu}
            >
              Subscribe
            </Link>
            */}
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