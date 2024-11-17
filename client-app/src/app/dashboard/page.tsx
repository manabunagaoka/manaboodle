"use client";

import { useState } from 'react';
import { 
  LogOut,
  Pill,
  Rocket, 
  Settings
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import TextEditor from '../components/TextEditor';

interface MediaItem {
  type: 'image' | 'video' | 'audio';
  url: string;
}

interface Story {
  id: string;
  media: MediaItem[];
  content: string;
  date: Date;
}

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('capsule');
  const [isWriting, setIsWriting] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);

  const tabs = [
    { 
      id: 'capsule', 
      name: 'Time Capsule',
      description: 'Collect human stories and preserve them in secure datasets, creating a vault of Collective Human Universals.',
      icon: <Pill className="text-blue-400" size={20} />
    },
    { 
      id: 'timeMachine', 
      name: 'Time Machine',
      description: "Analyze contributors' past stories, codifying their experiences for cross-referencing and deeper insights.",
      icon: <Rocket className="text-purple-400" size={20} />
    },
    { 
      id: 'synchronicity', 
      name: 'Synchronicity Engine',
      description: 'Identify patterns across experiences, map future possibilities, and connect synchronicities from the past to potential futures.',
      icon: <Settings className="text-green-400" size={20} />
    }
  ];

  const handleLogout = () => {
    router.push('/');
  };

  const handleSaveStory = (content: { media: MediaItem[], text: string }) => {
    const newStory = {
      id: Date.now().toString(),
      media: content.media,
      content: content.text,
      date: new Date(),
    };
    setStories([newStory, ...stories]);
    setIsWriting(false);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      {/* Header */}
      <header className="bg-[#252526] fixed top-0 left-0 right-0 z-10 border-b border-[#3e3e42]">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">
            Manaboodle
          </h1>
          
          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1 rounded-md text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#37373d] text-white'
                    : 'text-gray-300 hover:bg-[#2d2d2d]'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-300 hover:bg-[#2d2d2d] rounded-md"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto p-4">
          {tabs.map((tab) => (
            activeTab === tab.id && (
              <div key={tab.id} className="space-y-4">
               // Replace the content area with this updated version:
<div className="bg-[#252526] rounded-lg border border-[#3e3e42] min-h-[400px] text-gray-300">
  {tab.id === 'capsule' ? (
    <>
      {isWriting && (
        <TextEditor
          onClose={() => setIsWriting(false)}
          onSave={handleSaveStory}
        />
      )}
      
      {/* Fixed Header Section */}
      <div className="sticky top-14 bg-[#252526] border-b border-[#3e3e42] z-10">
        {/* Description Block */}
        <div className="p-6">
          <div className="flex items-center gap-2">
            {tab.icon}
            <h2 className="text-xl font-semibold text-white">
              {tab.name}
            </h2>
          </div>
          <p className="text-gray-300 mt-2">{tab.description}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="px-6 pb-4">
          <div className="bg-[#2d2d2d] rounded-lg p-4">
            <div className="flex gap-4">
              <button 
                onClick={() => setIsWriting(true)}
                className="px-4 py-2 rounded-md text-white hover:bg-[#37373d] transition-colors"
              >
                Write
              </button>
              <button 
                className="px-4 py-2 rounded-md text-white hover:bg-[#37373d] transition-colors"
              >
                Record
              </button>
              <button 
                className="px-4 py-2 rounded-md text-white hover:bg-[#37373d] transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Display with padding for fixed header */}
      <div className="p-6">
        <div className="space-y-6">
          {stories.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No stories yet. Start by writing one!
            </div>
          ) : (
            stories.map((story) => (
              <div key={story.id} className="border border-[#3e3e42] rounded-lg overflow-hidden">
                {/* Media Section */}
                {story.media && story.media.length > 0 && (
                  <div className="border-b border-[#3e3e42]">
                    {story.media.map((media, index) => (
                      <div key={index} className="w-full">
                        {media.type === 'image' && (
                          <img 
                            src={media.url} 
                            alt="Story media" 
                            className="w-full h-auto max-h-96 object-cover"
                          />
                        )}
                        {media.type === 'video' && (
                          <video 
                            controls 
                            src={media.url} 
                            className="w-full"
                          />
                        )}
                        {media.type === 'audio' && (
                          <div className="bg-[#2d2d2d] p-4">
                            <audio 
                              controls 
                              src={media.url} 
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Content Section */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm text-gray-400">
                      {story.date.toLocaleDateString()} at {story.date.toLocaleTimeString()}
                    </div>
                    <div className="text-xs bg-[#37373d] px-2 py-1 rounded">
                      Private
                    </div>
                  </div>
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: story.content }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  ) : (
    <div className="text-center text-gray-500 py-8">
      Coming soon...
    </div>
  )}
</div>
              </div>
            )
          ))}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#252526] border-t border-[#3e3e42] z-10">
        <div className="flex justify-around items-center h-16 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full px-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-white bg-[#37373d]'
                  : 'text-gray-300 hover:bg-[#2d2d2d]'
              }`}
            >
              {tab.icon}
              <span className="text-xs text-center whitespace-normal mt-1">
                {tab.name}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}