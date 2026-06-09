import { create } from 'zustand';
import { Fund } from '@/src/types';

interface CompareState {
  selectedFunds: Fund[];
  addFund: (fund: Fund) => { success: boolean; message: string };
  removeFund: (id: string) => void;
  clearFunds: () => void;
  isSelected: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  selectedFunds: [],
  addFund: (fund: Fund) => {
    const { selectedFunds } = get();
    if (selectedFunds.some((f) => f.id === fund.id)) {
      return { success: false, message: 'Fond allaqachon qo\'shilgan' };
    }
    if (selectedFunds.length >= 3) {
      return { success: false, message: 'Maksimal 3 ta fond tanlash mumkin' };
    }
    set({ selectedFunds: [...selectedFunds, fund] });
    return { success: true, message: 'Fond taqqoslashga qo\'shildi' };
  },
  removeFund: (id: string) => {
    set({ selectedFunds: get().selectedFunds.filter((f) => f.id !== id) });
  },
  clearFunds: () => set({ selectedFunds: [] }),
  isSelected: (id: string) => get().selectedFunds.some((f) => f.id === id),
}));
