"use client";

import { useState } from 'react';
import { 
  Bold, Italic, Link as LinkIcon, 
  Image, X
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

interface EditorProps {
  onClose: () => void;
  onSave: (content: { media: MediaItem[], text: string }) => void;
}

interface MediaItem {
  type: 'image' | 'video' | 'audio';
  url: string;
}

export default function TextEditor({ onClose, onSave }: EditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 underline',
        },
      }),
    ],
    content: '',
  });

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        if (file.type.startsWith('image/')) {
          setMediaItems(prev => [...prev, { type: 'image', url: result }]);
        } else if (file.type.startsWith('video/')) {
          setMediaItems(prev => [...prev, { type: 'video', url: result }]);
        } else if (file.type.startsWith('audio/')) {
          setMediaItems(prev => [...prev, { type: 'audio', url: result }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#252526] w-full max-w-2xl rounded-lg shadow-xl m-4 max-h-[90vh] overflow-y-auto">
        {/* Editor Header */}
        <div className="border-b border-[#3e3e42] p-4 flex justify-between items-center sticky top-0 bg-[#252526]">
          <h3 className="text-white font-medium">New Story</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Media Upload */}
        <div className="p-4 border-b border-[#3e3e42]">
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            multiple
            onChange={handleMediaUpload}
            className="hidden"
            id="media-upload"
          />
          <label 
            htmlFor="media-upload"
            className="block p-4 border-2 border-dashed border-[#3e3e42] rounded-lg text-center cursor-pointer hover:bg-[#2d2d2d]"
          >
            <div className="text-gray-300">
              <Image className="mx-auto mb-2" size={24} />
              Click to upload media
              <br />
              <span className="text-sm text-gray-500">
                Images, videos, or audio files
              </span>
            </div>
          </label>
        </div>

        {/* Media Preview */}
        {mediaItems.length > 0 && (
          <div className="p-4 border-b border-[#3e3e42] space-y-4">
            {mediaItems.map((media, index) => (
              <div key={index} className="relative">
                {media.type === 'image' && (
                  <img 
                    src={media.url} 
                    alt="Preview" 
                    className="w-full rounded-lg"
                  />
                )}
                {media.type === 'video' && (
                  <video 
                    src={media.url} 
                    controls 
                    className="w-full rounded-lg"
                  />
                )}
                {media.type === 'audio' && (
                  <audio 
                    src={media.url} 
                    controls 
                    className="w-full"
                  />
                )}
                <button
                  onClick={() => removeMedia(index)}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/75"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Editor Toolbar */}
        <div className="border-b border-[#3e3e42] p-2 flex flex-wrap gap-1 sticky top-14 bg-[#252526]">
          <button 
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-[#37373d] ${
              editor?.isActive('bold') ? 'text-white bg-[#37373d]' : 'text-gray-300'
            }`}
          >
            <Bold size={18} />
          </button>
          <button 
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-[#37373d] ${
              editor?.isActive('italic') ? 'text-white bg-[#37373d]' : 'text-gray-300'
            }`}
          >
            <Italic size={18} />
          </button>
          <div className="w-px bg-[#3e3e42] mx-1" />
          <button 
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-2 rounded hover:bg-[#37373d] ${
              editor?.isActive('link') ? 'text-white bg-[#37373d]' : 'text-gray-300'
            }`}
          >
            <LinkIcon size={18} />
          </button>
        </div>

        {/* Link Input */}
        {showLinkInput && (
          <div className="p-2 bg-[#1e1e1e] flex gap-2 sticky top-[104px]">
            <input
              type="url"
              placeholder="Enter URL..."
              className="flex-1 bg-[#2d2d2d] border border-[#3e3e42] rounded px-3 py-1 text-white text-sm"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  let url = linkUrl;
                  if (!/^https?:\/\//i.test(url)) {
                    url = `https://${url}`;
                  }
                  editor?.chain().focus().setLink({ href: url }).run();
                  setShowLinkInput(false);
                  setLinkUrl('');
                }
              }}
            />
            <button 
              onClick={() => {
                let url = linkUrl;
                if (!/^https?:\/\//i.test(url)) {
                  url = `https://${url}`;
                }
                editor?.chain().focus().setLink({ href: url }).run();
                setShowLinkInput(false);
                setLinkUrl('');
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Add
            </button>
            <button 
              onClick={() => setShowLinkInput(false)}
              className="px-2 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Editor Area */}
        <div className="p-4">
          <EditorContent 
            editor={editor} 
            className="prose prose-invert max-w-none"
          />
          <style jsx global>{`
            .ProseMirror {
              min-height: 200px;
              padding: 1rem;
              background: #1e1e1e;
              border: 1px solid #3e3e42;
              border-radius: 0.375rem;
              color: white;
              outline: none;
            }
            .ProseMirror p.is-editor-empty:first-child::before {
              color: #4b5563;
              content: attr(data-placeholder);
              float: left;
              height: 0;
              pointer-events: none;
            }
          `}</style>
        </div>

        {/* Footer */}
        <div className="border-t border-[#3e3e42] p-4 flex justify-between items-center sticky bottom-0 bg-[#252526]">
          <div className="text-gray-400 text-sm">
            All stories are private by default
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({
                media: mediaItems,
                text: editor?.getHTML() || ''
              })}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}