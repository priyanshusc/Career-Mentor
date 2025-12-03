import { create } from 'zustand';

// Get tokens from localStorage if they exist
const initialAccessToken = localStorage.getItem('accessToken');
const initialRefreshToken = localStorage.getItem('refreshToken');

export const useAuthStore = create((set) => ({
  // State
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  isLoggedIn: !!initialAccessToken,

  // Actions
  login: (access, refresh) => {
    // Save tokens to localStorage
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);

    // Update state
    set({
      accessToken: access,
      refreshToken: refresh,
      isLoggedIn: true,
    });
  },

  logout: () => {
    // Remove tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Update state
    set({
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    });
  },
}));