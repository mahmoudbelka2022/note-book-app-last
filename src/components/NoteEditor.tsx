import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface NoteEditorProps {
  note: {
    id: string;
    title: string;
    content: string;
  } | null;
  onSave: (note: { id: string; title: string; content: string }) => void;
}

export default function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note]);

  const handleSave = () => {
    onSave({
      id: note?.id || crypto.randomUUID(),
      title,
      content
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg p-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="text-2xl font-bold mb-4 p-2 border-b border-gray-200 focus:border-blue-500 focus:outline-none"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your note..."
        className="flex-1 resize-none p-2 focus:outline-none"
      />
      <button
        onClick={handleSave}
        className="mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Save size={20} />
        Save Note
      </button>
    </div>
  );
}