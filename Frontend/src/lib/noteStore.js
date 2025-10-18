import { create } from "zustand";
import { axiosInstance } from "../axios/axios.js";
import { toast } from "react-hot-toast";

export const useNoteStore = create((set, get) => ({
  notes: [],
  loading: false,
  isAdding: false,
  isEditing: false,
  editingNote: null,
  showAddForm: false,

  // Form states
  title: "",
  content: "",

  // Setters for form states
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setShowAddForm: (show) => set({ showAddForm: show }),
  setEditingNote: (note) => set({ editingNote: note }),

  // Fetch all notes
  fetchNotes: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/notes/getNotes');
      set({ notes: response.data });
    } catch (error) {
      console.error('Error fetching notes:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch notes');
      }
    } finally {
      set({ loading: false });
    }
  },

  // Add new note
  addNote: async (title, content) => {
    set({ isAdding: true });
    try {
      const response = await axiosInstance.post('/notes/addNotes', {
        title: title.trim(),
        content: content.trim()
      });
      
      set((state) => ({ 
        notes: [response.data.note, ...state.notes],
        title: "",
        content: "",
        showAddForm: false
      }));
      
      toast.success('Note added successfully');
      return response.data.note;
    } catch (error) {
      console.error('Error adding note:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add note. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isAdding: false });
    }
  },

  // Edit note
  editNote: async (noteId, title, content) => {
    set({ isEditing: true });
    try {
      const response = await axiosInstance.put(`/notes/editNote/${noteId}`, {
        title: title.trim(),
        content: content.trim()
      });
      
      set((state) => ({
        notes: state.notes.map(note => 
          note._id === noteId ? response.data.note : note
        ),
        editingNote: null,
        title: "",
        content: "",
        showAddForm: false
      }));
      
      toast.success('Note updated successfully');
      return response.data.note;
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error(error.response?.data?.message || 'Failed to update note');
      throw error;
    } finally {
      set({ isEditing: false });
    }
  },

  // Delete note
  deleteNote: async (noteId) => {
    try {
      await axiosInstance.delete(`/notes/deleteNote/${noteId}`);
      
      set((state) => ({
        notes: state.notes.filter(note => note._id !== noteId)
      }));
      
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(error.response?.data?.message || 'Failed to delete note');
      throw error;
    }
  },

  // Start editing a note
  startEditing: (note) => {
    set({
      editingNote: note,
      title: note.title,
      content: note.content || '',
      showAddForm: true
    });
  },

  // Cancel form
  cancelForm: () => {
    set({
      showAddForm: false,
      editingNote: null,
      title: "",
      content: ""
    });
  },

  // Open add form
  openAddForm: () => {
    set({
      showAddForm: true,
      editingNote: null,
      title: "",
      content: ""
    });
  }
}));