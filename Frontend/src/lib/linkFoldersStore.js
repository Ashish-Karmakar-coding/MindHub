import { create } from 'zustand';
import { axiosInstance } from '../axios/axios.js';
import { toast } from 'react-hot-toast';

export const useLinkFoldersStore = create((set, get) => ({
  linkFolders: [],
  isLoadingFolders: false,
  isCreatingFolder: false,
  isDeletingFolder: false,

  fetchLinkFolders: async () => {
    set({ isLoadingFolders: true });
    try {
      const response = await axiosInstance.get('/link-folders');
      set({ linkFolders: response.data });
    } catch (error) {
      console.error('Fetch Link Folders Error:', error);
    } finally {
      set({ isLoadingFolders: false });
    }
  },

  createLinkFolder: async (name) => {
    set({ isCreatingFolder: true });
    try {
      const response = await axiosInstance.post('/link-folders', { name });
      const folder = response.data.folder;
      set((state) => ({ linkFolders: [folder, ...state.linkFolders] }));
      toast.success('Folder created!');
      return { success: true, folder };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create folder');
      return { success: false };
    } finally {
      set({ isCreatingFolder: false });
    }
  },

  deleteLinkFolder: async (folderId) => {
    set({ isDeletingFolder: true });
    try {
      await axiosInstance.delete(`/link-folders/${folderId}`);
      set((state) => ({ linkFolders: state.linkFolders.filter((f) => f._id !== folderId) }));
      toast.success('Folder deleted. Links are now ungrouped.');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete folder');
      return { success: false };
    } finally {
      set({ isDeletingFolder: false });
    }
  },
}));
