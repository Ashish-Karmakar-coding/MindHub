import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../lib/authStore.js';
import { axiosInstance } from '../axios/axios.js';
import { toast } from 'react-hot-toast';


function Notes() {
  const { authUser } = useAuthStore();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch notes on component mount
  useEffect(() => {
    if (authUser) {
      fetchNotes();
    }
  }, [authUser]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/notes/getNotes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsAdding(true);
    try {
      const response = await axiosInstance.post('/notes/addNotes', {
        title,
        content
      });
      
      setNotes(prevNotes => [response.data.note, ...prevNotes]);
      setTitle('');
      setContent('');
      setShowAddForm(false);
      toast.success('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(error.response?.data?.message || 'Failed to add note');
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditNote = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      await axiosInstance.put(`/notes/editNote/${editingNote._id}`, {
        title,
        content
      });
      
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note._id === editingNote._id 
            ? { ...note, title, content, updatedAt: new Date().toISOString() }
            : note
        )
      );
      
      setEditingNote(null);
      setTitle('');
      setContent('');
      toast.success('Note updated successfully');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error(error.response?.data?.message || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/notes/deleteNote/${noteId}`);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(error.response?.data?.message || 'Failed to delete note');
    }
  };

  const startEditing = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content || '');
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
  };

  const openAddForm = () => {
    setShowAddForm(true);
    setEditingNote(null);
    setTitle('');
    setContent('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 overflow-hidden">
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-white">Your Notes</h2>
            <p className="mt-1 text-gray-400">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Note
          </button>
        </div>

        {/* Notes List - Takes full remaining space */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 flex-1 overflow-hidden">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <p className="mt-2 text-gray-400">Loading notes...</p>
              </div>
            </div>
          ) : notes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 text-lg">No notes yet</p>
              <p className="text-gray-500 text-sm mt-1">Click "Add Note" to create your first note</p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto pr-2">
              <div className="grid gap-4">
                {notes.map((note) => (
                  <div key={note._id} className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-medium text-white">{note.title}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(note)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-600 rounded transition-colors duration-200"
                          title="Edit note"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded transition-colors duration-200"
                          title="Delete note"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {note.content && (
                      <p className="text-gray-300 mb-3 whitespace-pre-wrap">{note.content}</p>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Created: {formatDate(note.createdAt)}</span>
                      {note.updatedAt !== note.createdAt && (
                        <span>Updated: {formatDate(note.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Note Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </h3>
              <form onSubmit={editingNote ? handleEditNote : handleAddNote} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 p-2.5"
                    placeholder="Enter note title"
                    required
                    autoFocus
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="4"
                    className="w-full rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 p-2.5 resize-none"
                    placeholder="Enter your note content..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="flex-1 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingNote ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      editingNote ? 'Update Note' : 'Add Note'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="px-6 py-2.5 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;