'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  SmilePlus, 
  CircleDot, 
  Shapes,
  Plus,
  Search,
  BarChart3,
  History,
  Share2,
  Download
} from 'lucide-react';

const categories = [
  { id: 'wisdomMap', icon: Globe, label: 'Wisdom Map', color: '#FF6B6B' },
  { id: 'intelligence', icon: SmilePlus, label: 'Intelligence', color: '#FFD93D' },
  { id: 'universals', icon: CircleDot, label: 'Universals', color: '#8DD3E7' },
  { id: 'variables', icon: Shapes, label: 'Variables', color: '#90D04F' }
];

const TimeMachine = () => {
  const [activeCategory, setActiveCategory] = useState('wisdomMap');

  return (
    <div className="w-full min-h-screen bg-ivory">
      {/* Mobile Title Bar */}
      <div className="lg:hidden px-4 pt-8">
        <h1 className="text-xl font-semibold text-zinc-900 text-center mb-4">Time Machine</h1>
      </div>

      {/* Categories */}
      <nav>
        <div className="flex overflow-x-auto px-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors
                ${activeCategory === category.id 
                  ? 'text-white' 
                  : 'text-zinc-600 hover:bg-zinc-100'}`}
              style={{
                backgroundColor: activeCategory === category.id ? category.color : 'transparent'
              }}
            >
              <category.icon size={16} />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-4">
        {/* Global Map Analysis Card */}
        <div className="bg-white p-6 rounded-lg border border-zinc-200 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-red-50 p-3 rounded-full">
              <Plus size={24} className="text-[#FF6B6B]" />
            </div>
            <h3 className="text-lg font-medium text-zinc-700">Analyze Stories</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100">
              <div className="flex items-center justify-center space-x-3">
                <BarChart3 size={20} className="text-zinc-600" />
                <span className="text-sm text-zinc-700">Quick Analysis</span>
              </div>
            </button>
            <button className="p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100">
              <div className="flex items-center justify-center space-x-3">
                <History size={20} className="text-zinc-600" />
                <span className="text-sm text-zinc-700">Timeline View</span>
              </div>
            </button>
            <button className="p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100">
              <div className="flex items-center justify-center space-x-3">
                <Share2 size={20} className="text-zinc-600" />
                <span className="text-sm text-zinc-700">Share Insights</span>
              </div>
            </button>
            <button className="p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100">
              <div className="flex items-center justify-center space-x-3">
                <Download size={20} className="text-zinc-600" />
                <span className="text-sm text-zinc-700">Export Data</span>
              </div>
            </button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-zinc-600">Total Stories</div>
            <div className="text-2xl font-semibold text-zinc-900">2,847</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-zinc-600">Countries</div>
            <div className="text-2xl font-semibold text-zinc-900">42</div>
          </div>
        </div>

        {/* Analysis List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Analyses</h2>
          <div className="grid gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-zinc-100 rounded-full flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-zinc-700">Analysis #{item}</h3>
                    <p className="text-sm text-zinc-600 mt-1">Pattern insights and connections...</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-zinc-100 px-2 py-1 rounded-full">Interpersonal</span>
                      <span className="text-xs bg-zinc-100 px-2 py-1 rounded-full">Cultural</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimeMachine;