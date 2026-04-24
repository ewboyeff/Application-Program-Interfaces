import { apiClient, adminApiClient } from './client';

export interface ProjectData {
  id: string;
  fund_id: string;
  title_uz: string;
  title_ru: string | null;
  title_en: string | null;
  description_uz: string | null;
  status: 'planned' | 'active' | 'completed';
  budget: number;
  spent: number;
  currency: string;
  beneficiaries_count: number;
  start_date: string | null;
  end_date: string | null;
  region: { id: string; name_uz: string } | null;
  created_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; per_page: number; total_pages: number };
}
interface DataResponse<T> { data: T }

export const projectsApi = {
  // Public — used on fund detail page
  getByFund(fundId: string, per_page = 100) {
    return apiClient.get<PaginatedResponse<ProjectData>>(
      `/api/v1/funds/${fundId}/projects?per_page=${per_page}`
    );
  },

  // Admin — list all projects
  getList(params?: { fund_id?: string; page?: number; per_page?: number }) {
    const qs = new URLSearchParams();
    if (params?.fund_id)  qs.set('fund_id', params.fund_id);
    if (params?.page)     qs.set('page', String(params.page));
    if (params?.per_page) qs.set('per_page', String(params.per_page));
    return adminApiClient.get<PaginatedResponse<ProjectData>>(`/api/v1/projects?${qs}`);
  },

  create(data: {
    fund_id: string;
    title_uz: string;
    status?: string;
    budget?: number;
    spent?: number;
    beneficiaries_count?: number;
    start_date?: string;
    end_date?: string;
    description_uz?: string;
  }) {
    return adminApiClient.post<DataResponse<ProjectData>>('/api/v1/projects', data);
  },

  update(id: string, data: Partial<{
    title_uz: string;
    status: string;
    budget: number;
    spent: number;
    beneficiaries_count: number;
    start_date: string;
    end_date: string;
    description_uz: string;
  }>) {
    return adminApiClient.put<DataResponse<ProjectData>>(`/api/v1/projects/${id}`, data);
  },

  delete(id: string) {
    return adminApiClient.delete(`/api/v1/projects/${id}`);
  },
};
