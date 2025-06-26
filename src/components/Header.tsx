'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoContainer}>
            <h1 className={styles.logoText}>Manaboodle</h1>
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
            href="/contact" 
            className={styles.navLink}
            data-active={pathname === '/contact'}
            onClick={closeMobileMenu}
          >
            Contact
          </Link>
        </nav>

        <div className={styles.navActions}>
          <input 
            type="text" 
            placeholder="Search..." 
            className={styles.searchInput}
          />
          <button className={styles.subscribeBtn} onClick={closeMobileMenu}>
            <Link href="/contact">Subscribe</Link>
          </button>
          <button 
            className={styles.menuBtn}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}