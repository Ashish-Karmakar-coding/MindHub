import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Loader } from 'lucide-react';
import { useNotesStore } from '../lib/notesStore';

export const Notes = () => {
  const { notes, isLoading, isAdding, isUpdating, isDeleting, fetchNotes, addNote, updateNote, deleteNote } = useNotesStore();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAdd = async () => {
    if (formData.title.trim() && formData.content.trim()) {
      const result = await addNote({
        title: formData.title.trim(),
        content: formData.content.trim()
      });
      if (result.success) {
        setFormData({ title: '', content: '' });
        setIsAddingNote(false);
      }
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setFormData({ title: note.title, content: note.content || '' });
  };

  const handleUpdate = async () => {
    if (formData.title.trim() && formData.content.trim()) {
      const result = await updateNote(editingId, {
        title: formData.title.trim(),
        content: formData.content.trim()
      });
      if (result.success) {
        setEditingId(null);
        setFormData({ title: '', content: '' });
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
    }
  };

  const handleCancel = () => {
    setIsAddingNote(false);
    setEditingId(null);
    setFormData({ title: '', content: '' });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">My Notes</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">{notes.length} {notes.length === 1 ? 'note' : 'notes'} total</p>
          </div>
          {!isAddingNote && !editingId && (
            <button
              onClick={() => setIsAddingNote(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition duration-200 font-medium w-full sm:w-auto justify-center disabled:opacity-50"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Add Note</span>
            </button>
          )}
        </div>

        {/* Notes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {notes.length === 0 ? (
              <div className="col-span-full text-center py-8 sm:py-12">
                <p className="text-gray-400 text-base sm:text-lg">No notes yet. Create your first note!</p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-700 hover:border-gray-600 transition duration-200"
                >
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-white flex-1 pr-2 line-clamp-2">
                      {note.title}
                    </h3>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(note)}
                        className="text-blue-400 hover:text-blue-300 transition duration-200 p-1 disabled:opacity-50"
                        title="Edit note"
                        disabled={isUpdating || isDeleting}
                      >
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="text-red-400 hover:text-red-300 transition duration-200 p-1 disabled:opacity-50"
                        title="Delete note"
                        disabled={isUpdating || isDeleting}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 whitespace-pre-wrap line-clamp-4">
                    {note.content || ''}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Popup Modal for Add/Edit Form with Blur Background */}
      {(isAddingNote || editingId) && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-2xl mx-auto border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                {isAddingNote ? 'Add New Note' : 'Edit Note'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition duration-200 p-1 rounded-full hover:bg-gray-700"
                disabled={isAdding || isUpdating}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter note title"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  autoFocus
                  disabled={isAdding || isUpdating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter note content"
                  rows="4"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                  disabled={isAdding || isUpdating}
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={isAddingNote ? handleAdd : handleUpdate}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 rounded-lg transition duration-200 font-medium text-sm sm:text-base order-2 sm:order-1 disabled:opacity-50"
                  disabled={isAdding || isUpdating || !formData.title.trim() || !formData.content.trim()}
                >
                  {isAdding || isUpdating ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isAddingNote ? 'Add Note' : 'Save Changes'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-6 py-2.5 rounded-lg transition duration-200 font-medium text-sm sm:text-base order-1 sm:order-2 disabled:opacity-50"
                  disabled={isAdding || isUpdating}
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}