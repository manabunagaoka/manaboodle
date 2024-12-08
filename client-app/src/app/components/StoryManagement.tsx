import React, { useState } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import { MediaItem } from '../../page';

interface Story {
  id: string;
  title: string;
  content: string;
}

interface Story {
  id: string;
  title: string;
  content: string;
  media: MediaItem[];
  date: Date;
}

interface StoryManagementProps {
  stories?: Story[];
  onUpdateStory?: (story: Story) => void;
  onDeleteStory?: (id: string) => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStory, setEditedStory] = useState(story);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedStory(story);
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdate(editedStory);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${story.title}"? This action cannot be undone.`)) {
      onDelete(story.id);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-[#252526] border-[#3e3e42]">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editedStory.title}
            onChange={(e) => setEditedStory({ ...editedStory, title: e.target.value })}
            className="w-full p-2 bg-[#37373d] text-gray-300 rounded-md mb-2 border border-[#3e3e42]"
          />
          <textarea
            value={editedStory.content}
            onChange={(e) => setEditedStory({ ...editedStory, content: e.target.value })}
            className="w-full p-2 bg-[#37373d] text-gray-300 rounded-md h-32 border border-[#3e3e42]"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center px-3 py-1 rounded bg-[#37373d] text-gray-300 hover:bg-[#2d2d2d]"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-3 py-1 rounded bg-[#0078d4] text-white hover:bg-[#006abc]"
            >
              <Check className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-200">{story.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-gray-200 rounded-md hover:bg-[#37373d]"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-[#37373d]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-gray-300">{story.content}</p>
        </div>
      )}
    </div>
  );
};

const StoryManagement: React.FC<StoryManagementProps> = ({ 
  stories = [], 
  onUpdateStory = () => {}, 
  onDeleteStory = () => {} 
}) => {
  if (!stories || !Array.isArray(stories)) {
    return (
      <div className="p-4 text-gray-500">
        No stories available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stories.length === 0 ? (
        <div className="p-4 text-gray-500">
          No stories have been created yet
        </div>
      ) : (
        stories.map((story) => (
          <StoryItem
            key={story.id}
            story={story}
            onUpdate={onUpdateStory}
            onDelete={onDeleteStory}
          />
        ))
      )}
    </div>
  );
};

export default StoryManagement;