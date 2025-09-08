'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { articles as contentArticles } from '../lib/content';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: number;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Article[];
  isSearching: boolean;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Use actual articles from content.ts
  const articles = contentArticles;

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      const searchTerm = query.toLowerCase();
      const filtered = articles.filter(article => {
        const searchableText = [
          article.title,
          article.excerpt,
          article.category,
          article.author || '',
          article.content || ''
        ].join(' ').toLowerCase();
        
        // Support both single words and phrases
        return searchableText.includes(searchTerm);
      });
      
      // Sort results by relevance (title matches first, then content matches)
      filtered.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(searchTerm);
        const bTitle = b.title.toLowerCase().includes(searchTerm);
        
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return 0;
      });
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery]);

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchResults,
      isSearching,
      clearSearch,
    }}>
      {children}
    </SearchContext.Provider>
  );
};