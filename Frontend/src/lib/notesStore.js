import { create } from "zustand";
import { axiosInstance } from "../axios/axios.js";
import { toast } from "react-hot-toast";

export const useNotesStore = create((set, get) => ({
  notes: [],
  isLoading: false,
  isAdding: false,
  isUpdating: false,
  isDeleting: false,

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/notes/getNotes");
      set({ notes: response.data || [] });
    } catch (error) {
      console.error("Fetch Notes Error:", error);
      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.message || "Failed to fetch notes"
        );
      }
      set({ notes: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addNote: async (noteData) => {
    set({ isAdding: true });
    try {
      const response = await axiosInstance.post("/notes/addNotes", noteData);
      const newNote = response.data.note || response.data;
      set((state) => ({ notes: [newNote, ...state.notes] }));
      toast.success("Note added successfully!");
      return { success: true, note: newNote };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add note"
      );
      console.error("Add Note Error:", error);
      return { success: false };
    } finally {
      set({ isAdding: false });
    }
  },

  updateNote: async (noteId, noteData) => {
    set({ isUpdating: true });
    try {
      const response = await axiosInstance.put(
        `/notes/editNote/${noteId}`,
        noteData
      );
      const updatedNote = response.data.note || response.data;
      set((state) => ({
        notes: state.notes.map((note) =>
          note._id === noteId ? updatedNote : note
        ),
      }));
      toast.success("Note updated successfully!");
      return { success: true, note: updatedNote };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update note"
      );
      console.error("Update Note Error:", error);
      return { success: false };
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteNote: async (noteId) => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete(`/notes/deleteNote/${noteId}`);
      set((state) => ({
        notes: state.notes.filter((note) => note._id !== noteId),
      }));
      toast.success("Note deleted successfully!");
      return { success: true };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete note"
      );
      console.error("Delete Note Error:", error);
      return { success: false };
    } finally {
      set({ isDeleting: false });
    }
  },
}));

