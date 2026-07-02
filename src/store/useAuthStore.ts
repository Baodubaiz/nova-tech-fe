import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser } from '@/types/auth';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (user: AuthUser, accessToken: string, refreshToken?: string) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  updateUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('novatech_access_token', accessToken);
          if (refreshToken) {
            localStorage.setItem('novatech_refresh_token', refreshToken);
          }
          localStorage.setItem('novatech_user', JSON.stringify(user));
          
          // Set cookie for middleware/SSR
          document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
        set({ 
          user, 
          accessToken, 
          refreshToken: refreshToken || null, 
          isAuthenticated: true 
        });
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('novatech_access_token');
          localStorage.removeItem('novatech_refresh_token');
          localStorage.removeItem('novatech_user');
          
          // Remove cookie
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false 
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      updateUser: (user) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('novatech_user', JSON.stringify(user));
        }
        set({ user });
      },
    }),
    {
      name: 'novatech-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist user, accessToken, refreshToken, isAuthenticated
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
