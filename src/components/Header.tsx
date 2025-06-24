'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoContainer}>
            <h1 className={styles.logoText}>Manaboodle</h1>
            <div className={styles.byline}>by Manabu Nagaoka</div>
          </div>
        </Link>

        <nav className={styles.navMenu}>
          <Link 
            href="/about" 
            className={styles.navLink}
            data-active={pathname === '/about'}
          >
            About
          </Link>
          <Link 
            href="/concepts" 
            className={styles.navLink}
            data-active={pathname === '/concepts'}
          >
            Concepts
          </Link>
          <Link 
            href="/projects" 
            className={styles.navLink}
            data-active={pathname === '/projects'}
          >
            Projects
          </Link>
          <Link 
            href="/casestudies" 
            className={styles.navLink}
            data-active={pathname === '/casestudies'}
          >
            Case Studies
          </Link>
          <Link 
            href="/random" 
            className={styles.navLink}
            data-active={pathname === '/random'}
          >
            Random
          </Link>
          <Link 
            href="/contact" 
            className={styles.navLink}
            data-active={pathname === '/contact'}
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
          <button className={styles.subscribeBtn}>
            Subscribe
          </button>
          <button className={styles.menuBtn}>
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}