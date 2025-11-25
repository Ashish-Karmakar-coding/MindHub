import { create } from "zustand";
import { axiosInstance } from "../axios/axios.js";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/users/check-user");
      set({ authUser: response.data.user || response.data });
    } catch (error) {
      console.error("Check Auth Error:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/users/signup", data);
      set({ authUser: response.data.user || response.data });
      toast.success("Sign Up Successful!");
      return { success: true };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Sign up Failed. Please try again."
      );
      console.error("Sign Up Error:", error);
      return { success: false };
    } finally {
      set({ isSigningUp: false });
    }
  },

  Login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/users/login", data);
      set({ authUser: response.data.user || response.data });
      toast.success("Log In Successful!");
      return { success: true };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Log in Failed. Please try again."
      );
      console.error("Log in Error:", error);
      return { success: false };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/users/logout");
      set({ authUser: null });
      toast.success("Log Out Successful!");
    } catch (error) {
      console.error("Log Out Error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/users/update", data);
      set({ authUser: response.data.user || response.data });
      toast.success("Profile Updated Successfully!");
      return { success: true };
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Profile Update Failed. Please try again."
      );
      console.error("Update Profile Error:", error);
      return { success: false };
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));

