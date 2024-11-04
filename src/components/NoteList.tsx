import React from 'react';
import { Notebook, Trash2 } from 'lucide-react';
import { Note } from '../types';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (noteId: string) => void;
}

export default function NoteList({ notes, activeNoteId, onNoteSelect, onNoteDelete }: NoteListProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Your Notes</h2>
        <button
          onClick={() => onNoteSelect({ id: '', title: '', content: '', createdAt: '', updatedAt: '' })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          New Note
        </button>
      </div>
      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              activeNoteId === note.id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
          >
            <div
              className="flex items-center gap-3 flex-1"
              onClick={() => onNoteSelect(note)}
            >
              <Notebook className="text-gray-500" size={20} />
              <div>
                <h3 className="font-medium text-gray-800">{note.title || 'Untitled'}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNoteDelete(note.id);
              }}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
            >
              <Trash2 className="text-red-500" size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}