import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface AuthUser {
  user_id: number;
  first_name?: string;
  last_name?: string;
  user_name: string;
  email?: string;
  image_profile?: string;
  role_id?: number;
  role_name?: string;
}

interface AuthStore {
  islogin: boolean;
  token?: string;
  user?: AuthUser;
  onLogin: (token: string, user: AuthUser) => void;
  onLogout: () => void;
  setUser: (user: AuthUser) => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      islogin: false,
      token: undefined,
      user: undefined,
      onLogin: (token, user) => set({ islogin: true, token, user }),
      onLogout: () => set({ islogin: false, token: undefined, user: undefined }),
      setUser: (user) => set({ user }),
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        islogin: state.islogin,
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);
