'use client';

import React, { useState } from 'react';
import { Home, Wrench } from 'lucide-react';

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
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .clusters-header {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 100;
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

        .coming-soon {
          color: white;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .coming-soon h1 {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .coming-soon p {
          font-size: 1.5rem;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .coming-soon h1 {
            font-size: 2.5rem;
          }
          
          .coming-soon p {
            font-size: 1.2rem;
            padding: 0 20px;
          }
        }
      `}</style>

      <div className="clusters-container">
        <div className="clusters-header">
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

        <div className="coming-soon">
          <h1>Coming Soon</h1>
          <p>Clusters tool integration in progress</p>
        </div>
      </div>
    </>
  );
}