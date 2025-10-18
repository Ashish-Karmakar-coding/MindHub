import { create } from 'zustand';
import { axiosInstance } from "../axios/axios.js";


export const useLinkStore = create((set, get) => ({
  links: [],
  loading: false,
  error: null,

  fetchLinks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/links/get-link', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Ensure links is always an array
      const linksData = Array.isArray(response.data) ? response.data : [];
      set({ links: linksData, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch links',
        loading: false,
        links: [] // Reset links on error
      });
    }
  },

  addLink: async (url) => {
    set({ error: null });
    try {
      const response = await axiosInstance.post('/links/add-link', 
        { url },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Add the new link to the beginning of the list
      if (response.data.link) {
        set((state) => ({ 
          links: [response.data.link, ...state.links],
        }));
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add link';
      set({ error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));