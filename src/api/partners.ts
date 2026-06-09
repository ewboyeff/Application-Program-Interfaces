import { apiClient, adminApiClient } from './client';
import { assetUrl } from '@/src/lib/utils';

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

interface DataResponse<T> {
  success: boolean;
  data: T;
}

export function resolveLogoUrl(url: string | null): string | null {
  return assetUrl(url) ?? null;
}

export const partnersApi = {
  listPublic: () =>
    apiClient.get<DataResponse<Partner[]>>('/api/v1/partners').then(r => r.data),

  listAll: () =>
    adminApiClient.get<DataResponse<Partner[]>>('/api/v1/partners/all').then(r => r.data),

  create: (data: { name: string; logo_url?: string; website_url?: string; is_active?: boolean; order_index?: number }) =>
    adminApiClient.post<DataResponse<Partner>>('/api/v1/partners', data).then(r => r.data),

  update: (id: string, data: Partial<{ name: string; logo_url: string | null; website_url: string | null; is_active: boolean; order_index: number }>) =>
    adminApiClient.put<DataResponse<Partner>>(`/api/v1/partners/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    adminApiClient.delete<void>(`/api/v1/partners/${id}`),
};
