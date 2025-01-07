'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Clock, 
  Rocket, 
  Sparkles, 
  UserCircle,
  Search
} from 'lucide-react';

const navigationItems = [
  { id: 'time-capsule', icon: Clock, label: 'Time Capsule', path: '/time-capsule' },
  { id: 'time-machine', icon: Rocket, label: 'Time Machine', path: '/time-machine' },
  { id: 'synchronicity', icon: Sparkles, label: 'Synchronicity', path: '/synchronicity' }
];

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Function to handle navigation
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Function to get current page title
  const getCurrentPageTitle = () => {
    switch (pathname) {
      case '/time-capsule':
        return 'Time Capsule';
      case '/time-machine':
        return 'Time Machine';
      case '/synchronicity':
        return 'Synchronicity';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-30">
        <div className="flex items-center justify-between p-4">
          <img 
            src="/images/logo.svg" 
            alt="Manaboodle" 
            className="h-12 w-auto"
          />
          <button className="p-2 text-zinc-600 hover:text-zinc-800">
            <UserCircle size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Side Navigation */}
        <div className="w-64 border-r border-zinc-200 bg-white flex flex-col">
          <div className="p-4">
            <img 
              src="/images/logo.svg" 
              alt="Manaboodle" 
              className="h-12 w-auto"
            />
          </div>
          
          <nav className="flex-1 px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1
                    ${isActive 
                      ? 'bg-blue-50 text-zinc-800 font-bold' 
                      : 'text-zinc-600 hover:bg-gray-50'}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-zinc-200">
            <div className="flex items-center space-x-3 text-zinc-600 hover:text-zinc-800">
              <UserCircle size={20} />
              <span>Settings</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <div className="p-6 border-b border-zinc-200">
            <div className="flex items-center relative">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-zinc-800 text-center">
                  {getCurrentPageTitle()}
                </h1>
              </div>
              <button className="absolute right-0 p-2 rounded-full bg-gray-100 text-zinc-700 hover:bg-gray-200">
                <Search size={20} />
              </button>
            </div>
          </div>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen">
        <div className="pt-16 pb-20 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
          {children}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
          <div className="flex justify-around px-4 py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex flex-col items-center px-6 py-2 rounded-full transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-zinc-800 to-zinc-900 text-white' 
                      : 'text-zinc-600'}`}
                >
                  <Icon size={isActive ? 20 : 18} />
                  <span className={`text-xs mt-1 ${isActive ? 'font-medium' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MainLayout;