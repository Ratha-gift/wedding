import { create } from 'zustand';
interface BearStore {
  bears: number;
  increase: () => void;
  reset: () => void;
}
export const useBearStore = create<BearStore>()(
  (set) => ({
    bears: 0,
    increase: () => set((state) => ({ bears: state.bears + 1 })),
    reset: () => set({ bears: 0 }),
  })
 
);