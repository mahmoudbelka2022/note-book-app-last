import React, { useState, useEffect } from 'react';
import { Book } from 'lucide-react';
import AuthForm from './components/AuthForm';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import * as api from './utils/api';
import { Note } from './types';

function App() {
  const [user, setUser] = useState<string | null>(localStorage.getItem('username'));
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      const fetchedNotes = await api.getNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleAuth = async (username: string, password: string) => {
    try {
      setError('');
      if (authMode === 'login') {
        const { token, username: user } = await api.login(username, password);
        localStorage.setItem('token', token);
        localStorage.setItem('username', user);
        setUser(user);
      } else {
        await api.register(username, password);
        setAuthMode('login');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    setNotes([]);
    setActiveNote(null);
  };

  const handleSaveNote = async (note: { id: string; title: string; content: string }) => {
    try {
      let savedNote;
      if (note.id) {
        savedNote = await api.updateNote(note.id, note);
      } else {
        savedNote = await api.createNote(note);
      }
      
      setNotes(notes.map(n => n._id === savedNote._id ? savedNote : n));
      if (!note.id) {
        setNotes([savedNote, ...notes]);
      }
      setActiveNote(savedNote);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await api.deleteNote(noteId);
      setNotes(notes.filter(note => note._id !== noteId));
      if (activeNote?._id === noteId) {
        setActiveNote(null);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="text-blue-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-800">Notebook</h1>
          </div>
          <p className="text-gray-600">Your personal space for thoughts and ideas</p>
        </div>
        
        <AuthForm type={authMode} onSubmit={handleAuth} />
        
        {error && <p className="mt-4 text-red-500">{error}</p>}
        
        <p className="mt-6 text-gray-600">
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-blue-600 hover:underline"
          >
            {authMode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">Notebook</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user}</span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <NoteList
              notes={notes}
              activeNoteId={activeNote?._id || null}
              onNoteSelect={setActiveNote}
              onNoteDelete={handleDeleteNote}
            />
          </div>
          <div className="md:col-span-2">
            <NoteEditor
              note={activeNote}
              onSave={handleSaveNote}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;