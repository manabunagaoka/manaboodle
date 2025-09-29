'use client';

import React, { useState } from 'react';
import { Home, Wrench, Menu } from 'lucide-react';
import Link from 'next/link';

export default function ClustersToolWrapper() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style jsx>{`
        .clusters-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
        }

        .clusters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          position: relative;
          z-index: 100;
        }

        .clusters-title {
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .menu-container {
          position: relative;
        }

        .hamburger-menu {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
        }

        .hamburger-menu:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        .hamburger-line {
          width: 20px;
          height: 2px;
          background: white;
          margin: 2px 0;
          border-radius: 2px;
          transition: 0.3s;
        }

        .hamburger-dropdown {
          position: absolute;
          top: 60px;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          min-width: 150px;
          z-index: 1000;
        }

        .hamburger-dropdown a {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: background 0.2s ease;
          gap: 10px;
        }

        .hamburger-dropdown a:hover {
          background: rgba(103, 126, 234, 0.1);
        }

        .clusters-content {
          padding: 0 20px 40px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .intro-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 40px;
          border-radius: 20px;
          margin-bottom: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .intro-section h2 {
          color: #333;
          font-size: 2rem;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .intro-section p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .action-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .action-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .action-card h3 {
          color: #333;
          font-size: 1.4rem;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .action-card p {
          color: #666;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .external-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: transform 0.2s ease;
        }

        .external-link:hover {
          transform: translateY(-2px);
        }

        .external-icon {
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .clusters-header {
            padding: 15px;
          }

          .clusters-title {
            font-size: 2rem;
          }

          .intro-section {
            padding: 25px;
          }

          .action-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="clusters-container">
        <div className="clusters-header">
          <h1 className="clusters-title">Clusters</h1>
          <div className="menu-container">
            <button 
              className="hamburger-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
            </button>
            {menuOpen && (
              <div className="hamburger-dropdown">
                <a href="/" onClick={() => setMenuOpen(false)}>
                  <Home size={16} /> Home
                </a>
                <a href="/tools" onClick={() => setMenuOpen(false)}>
                  <Wrench size={16} /> Tools
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="clusters-content">
          <div className="intro-section">
            <h2>Pattern Recognition & Analysis</h2>
            <p>
              Clusters is powered by <strong>Manaboodle's Synchronicity Engine</strong> - an advanced pattern recognition system that uncovers meaningful connections in data, text, and customer insights.
            </p>
            <p>
              The <strong>JTBD Student Edition</strong> helps you validate business ideas using the <strong>Jobs-To-Be-Done (JTBD)</strong> framework, shifting focus from imagined solutions to real customer problems.
            </p>
          </div>

          <div className="action-cards">
            <div className="action-card">
              <h3>🔍 Launch Full Clusters Tool</h3>
              <p>
                Access the complete Clusters application with problem statement builder, interview analysis, pattern recognition, and AI-powered insights.
              </p>
              <a 
                href="https://clusters-xi.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link"
              >
                Open Clusters App <span className="external-icon">↗</span>
              </a>
            </div>

            <div className="action-card">
              <h3>📊 Quick Analysis</h3>
              <p>
                Use the simplified clustering tool built into manaboodle.com for basic pattern recognition and data analysis.
              </p>
              <a 
                href="/clusters" 
                className="external-link"
              >
                Try Quick Analysis
              </a>
            </div>

            <div className="action-card">
              <h3>📖 Learn About JTBD</h3>
              <p>
                Understand the Jobs-To-Be-Done framework and how it can help you discover what customers really want.
              </p>
              <a 
                href="https://www.christenseninstitute.org/theory/jobs-to-be-done/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link"
              >
                Learn JTBD Framework <span className="external-icon">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}