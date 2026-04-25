import { create } from 'zustand';
import { categoriesApi, ApiCategory, ApiRegion } from '../api/categories';

interface CategoryState {
  categories: ApiCategory[];
  regions: ApiRegion[];
  loaded: boolean;
  fetch: () => Promise<void>;
  // Helper: find category_id by name
  categoryIdByName: (name: string) => string | undefined;
  regionIdByName: (name: string) => string | undefined;
}

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  categories: [],
  regions: [],
  loaded: false,

  fetch: async () => {
    if (get().loaded) return;
    try {
      const [categories, regions] = await Promise.all([
        categoriesApi.getCategories(),
        categoriesApi.getRegions(),
      ]);
      set({ categories, regions, loaded: true });
    } catch (err) {
      console.error('useCategoryStore fetch failed:', err);
    }
  },

  categoryIdByName: (name) =>
    get().categories.find(
      (c) => c.name_uz === name || c.name_ru === name || c.name_en === name
    )?.id,

  regionIdByName: (name) =>
    get().regions.find(
      (r) => r.name_uz === name || r.name_ru === name || r.name_en === name
    )?.id,
}));
