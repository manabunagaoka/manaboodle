// src/components/sections/TimeCapsule.tsx
'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Users, 
  MapPin, 
  BookOpen, 
  Briefcase, 
  GraduationCap 
} from 'lucide-react';

const categories = [
  { id: 'forYou', label: 'For You' },
  { id: 'people', icon: Users, label: 'People' },
  { id: 'places', icon: MapPin, label: 'Places' },
  { id: 'history', icon: BookOpen, label: 'History' },
  { id: 'career', icon: Briefcase, label: 'Career' },
  { id: 'learning', icon: GraduationCap, label: 'Learning' }
];

export const TimeCapsule = () => {
  const [activeCategory, setActiveCategory] = useState('forYou');

  return (
    <div className="p-4 space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Time Capsule</h2>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
            <Plus size={16} />
            <span>Preserve Your Stories</span>
          </button>
          <button className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap
              ${activeCategory === category.id 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {category.icon && <category.icon size={16} />}
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Curated Content */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-800">Curated for You</h3>
        <p className="text-sm text-gray-600">Stories based on your interests</p>
      </div>

      {/* Story Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2, 3].map((story) => (
          <div key={story} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex-shrink-0"></div>
              <div>
                <h3 className="font-medium">Time Capsule #{story}</h3>
                <p className="text-sm text-gray-600 mt-1">A preserved moment of wisdom...</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Experience</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Growth</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};