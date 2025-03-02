import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import config from '../config';

interface AuthState {
  token?: string;
  user?: any;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get): AuthState => ({
      login: async (email: string, password: string): Promise<void> => {
        const response = await fetch(`${config.BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          throw new Error('Login failed');
        }
        const data = await response.json();
        set({ token: data.token });
      },
      register: async (email: string, password: string): Promise<void> => {
        const response = await fetch(`${config.BACKEND_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          throw new Error('Registration failed');
        }
      },
      logout: () => set({ token: undefined, user: undefined }),
    }),
    {
      name: 'auth-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
