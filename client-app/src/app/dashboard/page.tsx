"use client";

import { useState } from 'react';
import { Menu, LogOut } from 'lucide-react'; // Add LogOut import
import { useRouter } from 'next/navigation'; // Add this import

export default function Dashboard() {
  const router = useRouter(); // Add this
  const [activeTab, setActiveTab] = useState('experiences');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Add logout function
  const handleLogout = () => {
    router.push('/'); // This will redirect to the login page
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
          <nav className="flex flex-c