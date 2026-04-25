import { News } from '../types';
import { apiClient } from './client';

function mapNews(n: any): News {
  const content = n.content_uz ?? n.content_ru ?? n.content_en ?? '';
  return {
    id: n.id,
    category: 'Yangiliklar',
    title: n.title_uz ?? n.title_ru ?? '',
    title_uz: n.title_uz ?? undefined,
    title_en: n.title_en ?? undefined,
    excerpt: content.length > 200 ? content.slice(0, 200) + '...' : content,
    content,
    content_en: n.content_en ?? undefined,
    fund_slug: null,
    fund_name: null,
    fundId: n.fund_id ?? null,
    date: n.published_at ?? n.created_at ?? '',
    read_time: n.read_time ?? 3,
    gradient: n.gradient ?? 'from-blue-500 to-indigo-600',
    image_url: n.image_url ?? null,
    source_url: n.source_url ?? null,
    is_featured: n.is_featured ?? false,
    active: n.is_active ?? true,
  };
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; per_page: number; total: number; total_pages: number };
}
interface DataResponse<T> { data: T }

export const newsApi = {
  async getList(params?: {
    page?: number;
    per_page?: number;
    is_featured?: boolean;
  }): Promise<{ news: News[]; total: number }> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.per_page) qs.set('per_page', String(params.per_page));
    if (params?.is_featured !== undefined) qs.set('is_featured', String(params.is_featured));

    const res = await apiClient.get<PaginatedResponse<any>>(`/api/v1/news?${qs.toString()}`);
    return { news: (res.data ?? []).map(mapNews), total: res.meta?.total ?? 0 };
  },

  async getById(id: string): Promise<News> {
    const res = await apiClient.get<DataResponse<any>>(`/api/v1/news/${id}`);
    return mapNews(res.data);
  },

  async create(data: Partial<News> & Record<string, any>): Promise<News> {
    const res = await apiClient.post<DataResponse<any>>('/api/v1/news', {
      title_uz: data.title_uz ?? data.title,
      title_en: data.title_en || undefined,
      content_uz: data.content,
      content_en: data.content_en || undefined,
      image_url: data.image_url || undefined,
      source_url: data.source_url || undefined,
      gradient: data.gradient,
      read_time: data.read_time,
      is_featured: data.is_featured,
      is_active: data.active,
      fund_id: data.fundId || undefined,
    });
    return mapNews(res.data);
  },

  async update(id: string, data: Partial<News> & Record<string, any>): Promise<News> {
    const payload: Record<string, any> = {};
    if (data.title_uz !== undefined) payload.title_uz = data.title_uz;
    if (data.title !== undefined) payload.title_uz = data.title;
    if (data.title_en !== undefined) payload.title_en = data.title_en || null;
    if (data.content !== undefined) payload.content_uz = data.content;
    if (data.content_en !== undefined) payload.content_en = data.content_en || null;
    if (data.gradient !== undefined) payload.gradient = data.gradient;
    if (data.read_time !== undefined) payload.read_time = data.read_time;
    if (data.is_featured !== undefined) payload.is_featured = data.is_featured;
    if (data.active !== undefined) payload.is_active = data.active;
    if (data.fundId !== undefined) payload.fund_id = data.fundId || null;
    if (data.image_url !== undefined) payload.image_url = data.image_url || null;
    if (data.source_url !== undefined) payload.source_url = data.source_url || null;

    const res = await apiClient.put<DataResponse<any>>(`/api/v1/news/${id}`, payload);
    return mapNews(res.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/news/${id}`);
  },
};
