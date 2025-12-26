import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User, InstructorProfile } from '@/types';
import { authAPI } from '@/lib/api';

interface AuthState {
  user: User | null;
  instructorProfile: InstructorProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string, type?: 'student' | 'instructor' | 'admin') => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      instructorProfile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password, type = 'student') => {
        set({ isLoading: true, error: null });
        try {
          let response;
          
          if (type === 'instructor') {
            response = await authAPI.instructorLogin({ email, password });
          } else if (type === 'admin') {
            response = await authAPI.adminLogin({ email, password });
          } else {
            response = await authAPI.login({ email, password });
          }
          
          const { user, accessToken, refreshToken, instructorProfile } = response.data.data;
          
          // Store tokens
          Cookies.set('accessToken', accessToken, { expires: 1 / 96 }); // 15 min
          Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 days
          
          set({
            user,
            instructorProfile: instructorProfile || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Login failed',
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(data);
          const { user, accessToken, refreshToken } = response.data.data;
          
          Cookies.set('accessToken', accessToken, { expires: 1 / 96 });
          Cookies.set('refreshToken', refreshToken, { expires: 7 });
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Registration failed',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          // Continue with logout even if API call fails
        }
        
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        
        set({
          user: null,
          instructorProfile: null,
          isAuthenticated: false,
        });
      },

      fetchUser: async () => {
        const token = Cookies.get('accessToken');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        
        set({ isLoading: true });
        try {
          const response = await authAPI.getMe();
          const { user, instructorProfile } = response.data.data;
          
          set({
            user,
            instructorProfile: instructorProfile || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          set({
            user: null,
            instructorProfile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.updateProfile(data);
          set({
            user: response.data.data.user,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Update failed',
          });
          throw error;
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
