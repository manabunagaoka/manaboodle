'use client';  // Add this at the top of the file

import React, { useState } from 'react';
// Rest of the code remains the same...
import { 
  Clock, 
  Rocket, 
  Sparkles, 
  Settings,
  UserCircle,
} from 'lucide-react';

const navigationItems = [
  { id: 'timeCapsule', icon: Clock, label: 'Time Capsule' },
  { id: 'timeMachine', icon: Rocket, label: 'Time Machine' },
  { id: 'synchronicity', icon: Sparkles, label: 'Synchronicity' }
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [activeSection, setActiveSection] = useState('timeCapsule');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-30">
    <div className="flex items-center justify-between p-4">
        <img 
        src="/images/logo.svg" 
        alt="Manaboodle" 
        className="h-8 w-auto"
        />
        <div className="flex items-center space-x-2">
        <button className="p-2">
            <Settings size={20} />
        </button>
        <button className="p-2">
            <UserCircle size={20} />
        </button>
        </div>
    </div>
    </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex h-screen">
            {/* Side Navigation */}
            <div className="w-64 border-r bg-white flex flex-col">
            <div className="p-4">
        <img 
        src="/images/logo.svg" 
        alt="Manaboodle" 
        className="h-8 w-auto"
        />
    </div>
          
          <nav className="flex-1 px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1
                    ${activeSection === item.id ? 'font-bold text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <UserCircle size={20} />
              <span>Settings</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Content Area */}
        <div className="pt-16 pb-20">
          {children}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
          <div className="flex justify-around px-2 py-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex flex-col items-center px-3 py-1
                    ${activeSection === item.id ? 'font-bold text-gray-900' : 'text-gray-600'}`}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};