// src/lib/article-utils.ts
import React from 'react';

/**
 * Calculate reading time for an article based on content
 * @param content - React node content or string
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: React.ReactNode | string): number {
  // Convert React content to text
  let text = '';
  
  if (typeof content === 'string') {
    text = content;
  } else {
    // Extract text from React nodes
    text = extractTextFromReactNode(content);
  }
  
  // Remove extra whitespace and count words
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  // Average reading speed is 200-250 words per minute
  // We'll use 225 as a middle ground
  const wordsPerMinute = 225;
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  // Minimum reading time is 1 minute
  return Math.max(1, readingTime);
}

/**
 * Extract text content from React nodes
 * @param node - React node to extract text from
 * @returns Extracted text string
 */
function extractTextFromReactNode(node: React.ReactNode): string {
  if (!node) return '';
  
  // Handle string nodes
  if (typeof node === 'string') return node;
  
  // Handle number nodes
  if (typeof node === 'number') return node.toString();
  
  // Handle array of nodes
  if (Array.isArray(node)) {
    return node.map(child => extractTextFromReactNode(child)).join(' ');
  }
  
  // Handle React elements
  if (React.isValidElement(node)) {
    const { children } = node.props;
    if (children) {
      return extractTextFromReactNode(children);
    }
  }
  
  return '';
}

/**
 * Calculate reading time from raw text
 * @param text - Plain text string
 * @returns Reading time in minutes
 */
export function calculateReadingTimeFromText(text: string): number {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const wordsPerMinute = 225;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return Math.max(1, readingTime);
}

/**
 * Format reading time for display
 * @param minutes - Reading time in minutes
 * @returns Formatted string
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}

/**
 * Get word count from content
 * @param content - React node content or string
 * @returns Word count
 */
export function getWordCount(content: React.ReactNode | string): number {
  let text = '';
  
  if (typeof content === 'string') {
    text = content;
  } else {
    text = extractTextFromReactNode(content);
  }
  
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}