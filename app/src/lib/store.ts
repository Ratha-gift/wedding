// src/lib/store.ts
import { create } from 'zustand';

// Optional: For persistence
import { persist } from 'zustand/middleware';

interface BearStore {
  bears: number;
  increase: () => void;
  reset: () => void;
}

export const useBearStore = create<BearStore>()(
  // Uncomment for persistence:
  // persist(
  (set) => ({
    bears: 0,
    increase: () => set((state) => ({ bears: state.bears + 1 })),
    reset: () => set({ bears: 0 }),
  })
  // { name: 'bear-storage' } // localStorage key
  // )
);