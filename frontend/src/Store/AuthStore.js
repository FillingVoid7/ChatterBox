import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        firstName,
        lastName,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        message: "Signup successful!",
      });
    } catch (error) {
      let errorMessage = "Error signing up";
      if (error.response && error.response.data) {
        if (error.response.data.message.includes("already exists")) {
          errorMessage = "User already exists";
        } else {
          errorMessage = error.response.data.message || "Error signing up";
        }
      }
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },


  verifyEmail: async (code) => {
    set({ isLoading: true, error: null })
    try {
      console.log(`Sending verification code:${code}`)
      const response = await axios.post(`${API_URL}/verify-email`, { code })
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      })
      return response.data
    } catch (error) {
      let errorMessage = "Error verifying email"
      if (error.response && error.response.data) {
        console.error('API response error:', error.message)
        errorMessage = error.response.data.message || errorMessage
      }
      set({
        error: errorMessage,
        isLoading: false,
      })
      throw new Error(errorMessage)
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        message: "Login successful!",
      });
    } catch (error) {
      let errorMessage = "Error logging in";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || "Error logging in";
      }
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({
        message: response.data.message,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = "Error sending reset password email";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({
        message: response.data.message,
        isLoading: false,
        error: null,
      });
      return response.data
    } catch (error) {
      let errorMessage = "Error resetting password";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  setError: (error) => set({ error }),
}));
