"use client";

import { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('experiences');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    router.push('/');
  };

  const tabs = [
    { id: 'experiences', name: 'Experience Mapper' },
    { id: 'analysis', name: 'Analysis' },
    { id: 'connections', name: 'Connections' },
    { id: 'vault', name: 'Vault' }
  ];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-700">
            Manaboodle
          </h1>
          
          <div className="flex items-center gap-4">
            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  } font-medium text-sm`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>

            {/* Logout button - visible on desktop */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200">
          <nav className="flex flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500'
                } px-4 py-3 text-left hover:bg-gray-50`}
              >
                {tab.name}
              </button>
            ))}
            {/* Logout button in mobile menu */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 text-left text-gray-500 hover:bg-gray-50"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Content area */}
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {activeTab === 'experiences' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Experience Mapper</h2>
            <p>Record and reflect on your journey</p>
          </div>
        )}
        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Analysis</h2>
            <p>Discover patterns in your experiences</p>
          </div>
        )}
        {activeTab === 'connections' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Connections</h2>
            <p>Connect with others on similar paths</p>
          </div>
        )}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Vault</h2>
            <p>Securely store your experiences</p>
          </div>
        )}
      </div>
    </main>
  );
}