'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearch } from '../contexts/SearchContext';
import { formatDate } from '../lib/utils';
import styles from './Search.module.css';

export default function Search() {
  const { searchQuery, setSearchQuery, searchResults, isSearching, clearSearch } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getArticleUrl = (article: any) => {
    if (article.id === 'ai-nurturing-surrogate-caregivers') {
      return '/concepts/ai-nurturing';
    }
    if (article.id === 'karaokegogo') {
      return '/projects/karaokegogo';
    }
    if (article.id === 'nanny') {
      return '/projects/nanny';
    }
    if (article.id === 'vibe-coding') {
      return '/random/vibe-coding';
    }
    if (article.id === 'mangrove-education') {
      return '/casestudies/mangrove';
    }
    if (article.id === 'tools') {
      return '/projects/tools';
    }
    if (article.id === 'childcare-startup-journey') {
      return '/projects/childcare-startup-journey';
    }
    if (article.category === 'casestudy') {
      return `/casestudies/${article.id}`;
    }
    return `/${article.category}/${article.id}`;
  };

  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case 'concept': return 'Concept';
      case 'project': return 'Project';
      case 'casestudy': return 'Case Study';
      case 'random': return 'Random';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    clearSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getSearchContext = (article: any, query: string) => {
    if (!article.content || !query.trim()) return article.excerpt;
    
    const content = article.content.toLowerCase();
    const searchTerm = query.toLowerCase();
    const index = content.indexOf(searchTerm);
    
    if (index === -1) return article.excerpt;
    
    // Extract context around the found term (50 chars before and after)
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + searchTerm.length + 50);
    let context = article.content.substring(start, end);
    
    // Add ellipsis if we're not at the start/end
    if (start > 0) context = '...' + context;
    if (end < content.length) context = context + '...';
    
    return context;
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <div className={styles.searchInputWrapper}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search content..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />
        <div className={styles.searchIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className={styles.searchResults}>
          {isSearching ? (
            <div className={styles.searchLoading}>Searching...</div>
          ) : searchResults.length > 0 ? (
            <>
              <div className={styles.searchResultsHeader}>
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </div>
              {searchResults.map((article) => (
                <Link
                  key={article.id}
                  href={getArticleUrl(article)}
                  className={styles.searchResult}
                  onClick={handleResultClick}
                >
                  <div className={styles.searchResultContent}>
                    <div className={styles.searchResultHeader}>
                      <h4 className={styles.searchResultTitle}>{article.title}</h4>
                      <span className={styles.searchResultCategory} data-category={article.category}>
                        {getCategoryDisplay(article.category)}
                      </span>
                    </div>
                    <p className={styles.searchResultExcerpt}>{getSearchContext(article, searchQuery)}</p>
                    <div className={styles.searchResultMeta}>
                      <span className={styles.searchResultDate}>{formatDate(article.publishedAt)}</span>
                      <span className={styles.searchResultReadTime}>{article.readTime} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          ) : searchQuery.length > 0 ? (
            <div className={styles.searchNoResults}>
              No articles found for "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
