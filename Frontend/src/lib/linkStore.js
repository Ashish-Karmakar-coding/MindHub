import { create } from 'zustand';
import { axiosInstance } from "../axios/axios.js";

export const useLinkStore = create((set, get) => ({
  links: [],
  loading: false,
  error: null,

  fetchLinks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/links/get-link');
      
      console.log('Fetch Links Response:', response); // Debug log
      
      // Handle different response structures
      let linksData = [];
      if (Array.isArray(response.data)) {
        linksData = response.data;
      } else if (response.data && Array.isArray(response.data.links)) {
        linksData = response.data.links;
      } else if (response.data && response.data.data) {
        linksData = response.data.data;
      }
      
      set({ links: linksData, loading: false });
    } catch (error) {
      console.error('Error fetching links:', error);
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to fetch links',
        loading: false,
        links: []
      });
    }
  },

  addLink: async (url) => {
    set({ error: null });
    try {
      const response = await axiosInstance.post('/links/add-link', { url });
      
      console.log('Add Link Response:', response); // Debug log
      
      // Handle different response structures
      const newLink = response.data.link || response.data.data || response.data;
      
      if (newLink) {
        set((state) => ({ 
          links: [newLink, ...state.links],
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error adding link:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add link';
      set({ error: errorMessage });
      throw error;
    }
  },

  deleteLink: async (linkId) => {
    set({ error: null });
    try {
      // Your delete route expects linkId in the request body, not URL params
      const response = await axiosInstance.delete('/links/delete-link', {
        data: { linkId } // Send linkId in the request body
      });

      // Remove the deleted link from state
      set((state) => ({
        links: state.links.filter(link => link._id !== linkId)
      }));

      return response.data;
    } catch (error) {
      console.error('Error deleting link:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete link';
      set({ error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));