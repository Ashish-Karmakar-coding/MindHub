import { create } from 'zustand';
import { axiosInstance } from "../axios/axios.js";

export const useLinkStore = create((set, get) => ({
  links: [],
  loading: false,
  error: null,

  fetchLinks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/Links/get-link');
      
      console.log('Fetch Links Response:', response);
      
      // Backend returns array directly
      const linksData = Array.isArray(response.data) ? response.data : [];
      
      set({ links: linksData, loading: false });
    } catch (error) {
      console.error('Error fetching links:', error);
      
      // Handle 404 as empty array (no links found)
      if (error.response?.status === 404) {
        set({ links: [], loading: false, error: null });
      } else {
        set({ 
          error: error.response?.data?.message || error.message || 'Failed to fetch links',
          loading: false,
          links: []
        });
      }
    }
  },

  addLink: async (url) => {
    set({ error: null });
    try {
      const response = await axiosInstance.post('/Links/add-link', { url });
      
      console.log('Add Link Response:', response);
      
      // Backend returns { message: '...', link: {...} }
      const newLink = response.data.link;
      
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
      // FIX: Send linkId as URL parameter, not request body
      const response = await axiosInstance.delete(`/Links/delete-link/${linkId}`);

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