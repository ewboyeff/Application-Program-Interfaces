import { Complaint } from '../types';
import { apiClient, adminApiClient } from './client';

function mapComplaint(c: any): Complaint {
  return {
    id: c.id,
    fundId: c.fund_id,
    userName: c.user_full_name || 'Foydalanuvchi',
    reason: c.reason,
    description: c.description ?? '',
    date: c.created_at ?? '',
    status: c.status,
  };
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number };
}
interface DataResponse<T> { data: T }

export const complaintsApi = {
  async getList(params?: {
    status?: string;
    fund_id?: string;
    page?: number;
    per_page?: number;
  }): Promise<{ complaints: Complaint[]; total: number }> {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.fund_id) qs.set('fund_id', params.fund_id);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.per_page) qs.set('per_page', String(params.per_page));

    const res = await adminApiClient.get<PaginatedResponse<any>>(`/api/v1/complaints?${qs.toString()}`);
    return {
      complaints: (res.data ?? []).map(mapComplaint),
      total: res.meta?.total ?? 0,
    };
  },

  async create(fundId: string, reason: string, description?: string): Promise<Complaint> {
    const res = await apiClient.post<DataResponse<any>>(
      `/api/v1/funds/${fundId}/complaints`,
      { reason, description }
    );
    return mapComplaint(res.data);
  },

  async update(id: string, status: string, admin_note?: string): Promise<Complaint> {
    const res = await adminApiClient.put<DataResponse<any>>(
      `/api/v1/complaints/${id}`,
      { status, admin_note }
    );
    return mapComplaint(res.data);
  },
};
