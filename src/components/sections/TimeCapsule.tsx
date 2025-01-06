'use client';

import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  BookOpen, 
  Briefcase, 
  GraduationCap,
  Plus,
  Search,
  PenLine,
  Mic,
  Video,
  Upload
} from 'lucide-react';

const categories = [
  { id: 'yourStories', label: 'Your Stories', color: '#FF6B6B' },
  { id: 'people', icon: Users, label: 'People', color: '#FFD93D' },
  { id: 'places', icon: MapPin, label: 'Places', color: '#8DD3E7' },
  { id: 'history', icon: BookOpen, label: 'History', color: '#90D04F' },
  { id: 'career', icon: Briefcase, label: 'Career', color: '#FF9ECD' },
  { id: 'learning', icon: GraduationCap, label: 'Learning', color: '#8DD3E7' }
];

const TimeCapsule = () => {
  const [activeCategory, setActiveCategory] = useState('yourStories');

  return (
    <div className="space-y-6 px-4">
      {/* Mobile Only - Title and Search */}
      <div className="lg:hidden flex items-center justify-between w-full mt-4">
        <div className="flex-1 flex justify-center">
          <h2 className="text-base font-bold text-zinc-800">Time Capsule</h2>
        </div>
        <button className="p-2 rounded-full bg-gray-100 text-zinc-700 hover:bg-gray-200">
          <Search size={20} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
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
            {category.icon && <category.icon size={16} />}
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Tell Your Story Card */}
      <div className="bg-white p-6 rounded-lg border border-zinc-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-red-50 p-3 rounded-full">
            <Plus size={24} className="text-[#FF6B6B]" />
          </div>
          <h3 className="text-lg font-medium text-zinc-700">Tell Your Story</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100">
            <div className="flex items-center justify-center space-x-3">
              <PenLine size={20} className="text-zinc-600" />
              <span className="text-sm text-zinc-700">Write</span>
            </div>
          </button>
          <button className="p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100">
            <div className="flex items-center justify-center space-x-3">
              <Mic size={20} className="text-zinc-600" />
              <span className="text-sm text-zinc-700">Record Audio</span>
            </div>
          </button>
          <button className="p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100">
            <div className="flex items-center justify-center space-x-3">
              <Video size={20} className="text-zinc-600" />
              <span className="text-sm text-zinc-700">Record Video</span>
            </div>
          </button>
          <button className="p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100">
            <div className="flex items-center justify-center space-x-3">
              <Upload size={20} className="text-zinc-600" />
              <span className="text-sm text-zinc-700">Upload File</span>
            </div>
          </button>
        </div>
      </div>

      {/* Story Grid */}
      <div className="grid gap-4">
        {[1, 2, 3].map((story) => (
          <div key={story} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-zinc-700">Time Capsule #{story}</h3>
                <p className="text-sm text-zinc-600 mt-1">A preserved moment of wisdom...</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-zinc-100 px-2 py-1 rounded-full">Experience</span>
                  <span className="text-xs bg-zinc-100 px-2 py-1 rounded-full">Growth</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeCapsule;