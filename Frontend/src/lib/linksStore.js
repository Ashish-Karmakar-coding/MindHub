import { create } from "zustand";
import { axiosInstance } from "../axios/axios.js";
import { toast } from "react-hot-toast";

export const useLinksStore = create((set, get) => ({
  links: [],
  isLoading: false,
  isAdding: false,
  isDeleting: false,

  fetchLinks: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/links/get-link");
      set({ links: response.data || [] });
    } catch (error) {
      console.error("Fetch Links Error:", error);
      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.message || "Failed to fetch links"
        );
      }
      set({ links: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addLink: async (linkData) => {
    set({ isAdding: true });
    try {
      const response = await axiosInstance.post("/links/add-link", linkData);
      const newLink = response.data.link || response.data;
      set((state) => ({ links: [newLink, ...state.links] }));
      toast.success("Link added successfully!");
      return { success: true, link: newLink };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add link"
      );
      console.error("Add Link Error:", error);
      return { success: false };
    } finally {
      set({ isAdding: false });
    }
  },

  deleteLink: async (linkId) => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete(`/links/delete-link/${linkId}`);
      set((state) => ({
        links: state.links.filter((link) => link._id !== linkId),
      }));
      toast.success("Link deleted successfully!");
      return { success: true };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete link"
      );
      console.error("Delete Link Error:", error);
      return { success: false };
    } finally {
      set({ isDeleting: false });
    }
  },
}));

