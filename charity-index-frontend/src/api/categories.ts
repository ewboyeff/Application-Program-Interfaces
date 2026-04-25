import { apiClient } from './client';

export interface ApiCategory {
  id: string;
  name_uz: string;
  name_ru: string | null;
  name_en: string | null;
  slug: string;
  icon_url: string | null;
  is_active: boolean;
}

export interface ApiRegion {
  id: string;
  name_uz: string;
  name_ru: string | null;
  name_en: string | null;
  code: string;
}

interface DataResponse<T> { data: T }

export const categoriesApi = {
  async getCategories(): Promise<ApiCategory[]> {
    const res = await apiClient.get<DataResponse<ApiCategory[]>>('/api/v1/categories');
    return res.data ?? [];
  },

  async getRegions(): Promise<ApiRegion[]> {
    const res = await apiClient.get<DataResponse<ApiRegion[]>>('/api/v1/regions');
    return res.data ?? [];
  },

  async createCategory(data: Partial<ApiCategory>): Promise<ApiCategory> {
    const res = await apiClient.post<DataResponse<ApiCategory>>('/api/v1/categories', data);
    return res.data;
  },

  async updateCategory(id: string, data: Partial<ApiCategory>): Promise<ApiCategory> {
    const res = await apiClient.put<DataResponse<ApiCategory>>(`/api/v1/categories/${id}`, data);
    return res.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/categories/${id}`);
  },
};
