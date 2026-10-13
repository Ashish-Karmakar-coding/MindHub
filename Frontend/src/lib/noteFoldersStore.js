import { create } from 'zustand';
import { axiosInstance } from '../axios/axios.js';
import { toast } from 'react-hot-toast';

export const useNoteFoldersStore = create((set, get) => ({
  noteFolders: [],
  isLoadingFolders: false,
  isCreatingFolder: false,
  isDeletingFolder: false,

  fetchNoteFolders: async () => {
    set({ isLoadingFolders: true });
    try {
      const response = await axiosInstance.get('/note-folders');
      set({ noteFolders: response.data });
    } catch (error) {
      console.error('Fetch Note Folders Error:', error);
    } finally {
      set({ isLoadingFolders: false });
    }
  },

  createNoteFolder: async (name) => {
    set({ isCreatingFolder: true });
    try {
      const response = await axiosInstance.post('/note-folders', { name });
      const folder = response.data.folder;
      set((state) => ({ noteFolders: [folder, ...state.noteFolders] }));
      toast.success('Folder created!');
      return { success: true, folder };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create folder');
      return { success: false };
    } finally {
      set({ isCreatingFolder: false });
    }
  },

  deleteNoteFolder: async (folderId) => {
    set({ isDeletingFolder: true });
    try {
      await axiosInstance.delete(`/note-folders/${folderId}`);
      set((state) => ({ noteFolders: state.noteFolders.filter((f) => f._id !== folderId) }));
      toast.success('Folder deleted. Notes are now ungrouped.');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete folder');
      return { success: false };
    } finally {
      set({ isDeletingFolder: false });
    }
  },
}));
