import { create } from 'zustand';

interface KeywordState {
  showPopover: boolean;
  setShowPopover: (show: boolean) => void;
  togglePopover: () => void;
}

export const useKeywordStore = create<KeywordState>((set) => ({
  showPopover: true,
  setShowPopover: (show) => set({ showPopover: show }),
  togglePopover: () => set((state) => ({ showPopover: !state.showPopover })),
})); 