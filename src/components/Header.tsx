'use client';

import Link from 'next/link';
import Search from './Search';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoContainer}>
            <h1 className={styles.logoText}>Manaboodle</h1>
            <div className={styles.byline}>by Manabu Nagaoka</div>
          </div>
        </Link>
        
        <div className={styles.navMenu}>
          <Link href="/about" className={styles.navLink}>About</Link>
          <Link href="/concepts" className={styles.navLink}>Concepts</Link>
          <Link href="/projects" className={styles.navLink}>Projects</Link>
          <Link href="/casestudies" className={styles.navLink}>Case Studies</Link>
          <Link href="/random" className={styles.navLink}>Random</Link>
        </div>
        
        <div className={styles.navActions}>
          <Search />
          <button className={styles.subscribeBtn}>Subscribe</button>
          <button className={styles.menuBtn}>☰</button>
        </div>
      </nav>
    </header>
  );
}