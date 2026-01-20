import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthStore {

  islogin : boolean;
  token?: string;
  onLogin: (token:string) => void;
   onLogout: () => void;
}
export const useAuth = create<AuthStore>()(

   persist(
  (set) => ({
    islogin: false,
    token: undefined,
    onLogin: (token:string) => set({ islogin: true, token }),
    onLogout: () => set({ islogin: false ,  token: undefined})
  }),{
    name:"auth",
    storage: createJSONStorage(() => localStorage),
    partialize:(state)=> ({
     islogin: state.islogin,
     token: state.token
    }),

  })

);