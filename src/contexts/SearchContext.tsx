'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Mock articles - replace with your actual content
  const articles: Article[] = [
    {
      id: 'ai-nurturing-surrogate-caregivers',
      title: 'AI Nurturing Surrogate Caregivers',
      excerpt: 'Exploring the concept of AI as nurturing caregivers in modern society.',
      category: 'concept',
      publishedAt: '2024-01-15',
      readTime: 5
    },
    {
      id: 'karaokegogo',
      title: 'KaraokeGogo',
      excerpt: 'A fun karaoke application project with social features.',
      category: 'project',
      publishedAt: '2024-02-10',
      readTime: 3
    }
  ];

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      const filtered = articles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        article.category.toLowerCase().includes(query.toLowerCase())
      );
      
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