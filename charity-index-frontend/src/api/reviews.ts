import { Review } from '../types';
import { apiClient, adminApiClient } from './client';

function mapReview(r: any): Review {
  return {
    id: r.id,
    fundId: r.fund_id,
    userName: r.user_full_name || 'Foydalanuvchi',
    rating: r.rating,
    comment: r.comment ?? '',
    date: r.created_at ?? '',
    status: r.is_approved ? 'approved' : 'pending',
  };
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; per_page: number; total_pages: number };
}
interface DataResponse<T> { data: T }

export const reviewsApi = {
  async getByFund(fundId: string, page = 1, per_page = 50): Promise<Review[]> {
    const res = await apiClient.get<PaginatedResponse<any>>(
      `/api/v1/funds/${fundId}/reviews?page=${page}&per_page=${per_page}`
    );
    return (res.data ?? []).map(mapReview);
  },

  async getAll(params?: { is_approved?: boolean; page?: number; per_page?: number }): Promise<{ reviews: Review[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.is_approved !== undefined) query.set('is_approved', String(params.is_approved));
    if (params?.page)     query.set('page', String(params.page));
    if (params?.per_page) query.set('per_page', String(params.per_page));
    const res = await adminApiClient.get<PaginatedResponse<any>>(`/api/v1/reviews?${query}`);
    return {
      reviews: (res.data ?? []).map(mapReview),
      total: res.meta?.total ?? 0,
    };
  },

  async create(fundId: string, rating: number, comment?: string): Promise<Review> {
    const res = await apiClient.post<DataResponse<any>>(
      `/api/v1/funds/${fundId}/reviews`,
      { rating, comment }
    );
    return mapReview(res.data);
  },

  async approve(reviewId: string): Promise<Review> {
    const res = await adminApiClient.put<DataResponse<any>>(`/api/v1/reviews/${reviewId}/approve`);
    return mapReview(res.data);
  },

  async delete(reviewId: string): Promise<void> {
    await adminApiClient.delete(`/api/v1/reviews/${reviewId}`);
  },
};
