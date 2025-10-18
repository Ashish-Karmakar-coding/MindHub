import { create } from 'zustand';
import axios from 'axios';

const useLinkStore = create((set, get) => ({
  links: [],
  loading: false,
  error: null,

  fetchLinks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/links', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      set({ links: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch links',
        loading: false 
      });
    }
  },

  addLink: async (url) => {
    set({ error: null });
    try {
      const response = await axios.post('/api/links', 
        { url },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Add the new link to the beginning of the list
      set((state) => ({ 
        links: [response.data.link, ...state.links],
      }));
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add link';
      set({ error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useLinkStore;