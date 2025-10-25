import React, { useEffect } from 'react';
import { useAuthStore } from '../lib/authStore';
import { useNoteStore } from '../lib/noteStore';
import { toast } from 'react-hot-toast';

function Notes() {
  const { authUser } = useAuthStore();
  const {
    notes,
    loading,
    isAdding,
    isEditing,
    editingNote,
    showAddForm,
    title,
    content,
    fetchNotes,
    addNote,
    editNote,
    deleteNote,
    startEditing,
    cancelForm,
    openAddForm,
    setTitle,
    setContent
  } = useNoteStore();

  // Fetch notes on component mount
  useEffect(() => {
    if (authUser) {
      fetchNotes();
    }
  }, [authUser, fetchNotes]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    await addNote(title, content);
  };

  const handleEditNote = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    await editNote(editingNote._id, title, content);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    await deleteNote(noteId);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 overflow-hidden">
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-white">Your Notes</h2>
            <p className="mt-1 text-white/60">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center justify-center py-2 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Note
          </button>
        </div>

        {/* Notes List - Takes full remaining space */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 flex-1 overflow-hidden">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <p className="mt-2 text-white/70">Loading notes...</p>
              </div>
            </div>
          ) : notes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-white/80 text-lg font-semibold">No notes yet</p>
              <p className="text-white/50 text-sm mt-1">Click "Add Note" to create your first note</p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto pr-2">
              <div className="grid gap-4">
                {notes.map((note) => (
                  <div key={note._id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/15 hover:shadow-2xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-medium text-white">{note.title}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(note)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition-all duration-200"
                          title="Edit note"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Delete note"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {note.content && (
                      <p className="text-white/80 mb-3 whitespace-pre-wrap">{note.content}</p>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-white/50">
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </h3>
              <form onSubmit={editingNote ? handleEditNote : handleAddNote} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 p-2.5"
                    placeholder="Enter note title"
                    required
                    autoFocus
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-white/80 mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="4"
                    className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 p-2.5 resize-none"
                    placeholder="Enter your note content..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isAdding || isEditing}
                    className="flex-1 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(isAdding || isEditing) ? (
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
                    className="px-6 py-2.5 border border-white/20 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 transition-all duration-200"
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