import { apiClient, adminApiClient, getAdminToken } from './client';

const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  'http://localhost:8000';

export type ReportType = 'annual' | 'quarterly' | 'monthly';

export interface Report {
  id: string;
  fund_id: string;
  fund?: { id: string; name_uz: string; logo_initials: string | null; logo_color: string | null };
  report_type: ReportType;
  period_start: string | null;
  period_end: string | null;
  total_income: number;
  total_expense: number;
  file_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; per_page: number; total: number; total_pages: number };
}
interface DataResponse<T> { data: T }

export const reportsApi = {
  async getList(params?: { page?: number; per_page?: number; fund_id?: string }): Promise<{ reports: Report[]; total: number }> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.per_page) qs.set('per_page', String(params.per_page));
    if (params?.fund_id) qs.set('fund_id', params.fund_id);

    const res = await apiClient.get<PaginatedResponse<any>>(`/api/v1/reports?${qs.toString()}`);
    return {
      reports: (res.data ?? []).map(mapReport),
      total: res.meta?.total ?? 0,
    };
  },

  async uploadDocument(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAdminToken();
    const res = await fetch(`${BASE_URL}/api/v1/uploads/document`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw await res.json();
    const json = await res.json();
    return json.data.url as string;
  },

  async create(data: {
    fund_id: string;
    report_type: ReportType;
    period_start?: string | null;
    period_end?: string | null;
    total_income: number;
    total_expense: number;
    file_url?: string | null;
    is_verified?: boolean;
  }): Promise<Report> {
    const res = await adminApiClient.post<DataResponse<any>>('/api/v1/reports', data);
    return mapReport(res.data);
  },

  async update(id: string, data: Partial<{
    fund_id: string;
    report_type: ReportType;
    period_start: string | null;
    period_end: string | null;
    total_income: number;
    total_expense: number;
    file_url: string | null;
    is_verified: boolean;
  }>): Promise<Report> {
    const res = await adminApiClient.put<DataResponse<any>>(`/api/v1/reports/${id}`, data);
    return mapReport(res.data);
  },

  async toggleVerify(id: string): Promise<Report> {
    const res = await adminApiClient.patch<DataResponse<any>>(`/api/v1/reports/${id}/verify`);
    return mapReport(res.data);
  },

  async delete(id: string): Promise<void> {
    await adminApiClient.delete(`/api/v1/reports/${id}`);
  },
};

function mapReport(r: any): Report {
  return {
    id: r.id,
    fund_id: r.fund_id,
    fund: r.fund ?? undefined,
    report_type: r.report_type,
    period_start: r.period_start ?? null,
    period_end: r.period_end ?? null,
    total_income: Number(r.total_income ?? 0),
    total_expense: Number(r.total_expense ?? 0),
    file_url: r.file_url ?? null,
    is_verified: r.is_verified ?? false,
    created_at: r.created_at ?? '',
    updated_at: r.updated_at ?? '',
  };
}
