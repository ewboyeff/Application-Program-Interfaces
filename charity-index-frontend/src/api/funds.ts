import { Fund, Project } from '../types';
import { apiClient } from './client';

// ---------------------------------------------------------------------------
// Backend response → Frontend type transformers
// ---------------------------------------------------------------------------

function mapIndexes(idx: any) {
  if (!idx) {
    return { transparency: 0, openness: 0, trust: 0, overall: 0, grade: 'unrated' as const, calculated_at: undefined };
  }
  return {
    transparency: Number(idx.transparency_score ?? 0),
    openness: Number(idx.openness_score ?? 0),
    trust: Number(idx.trust_score ?? 0),
    overall: Number(idx.overall_score ?? 0),
    grade: idx.grade ?? 'unrated',
    calculated_at: idx.calculated_at ?? undefined,
  };
}

export function mapFund(f: any): Fund {
  return {
    id: f.id,
    slug: f.slug,
    name_uz: f.name_uz ?? '',
    name_ru: f.name_ru ?? '',
    name_en: f.name_en ?? '',
    category: f.category?.name_uz ?? '',
    region: f.region?.name_uz ?? '',
    director: f.director_name ?? '',
    founded_year: f.founded_year ?? 0,
    description_uz: f.description_uz ?? '',
    description_en: f.description_en ?? undefined,
    logo_url: f.logo_url ?? undefined,
    logo_initials: f.logo_initials ?? '',
    logo_color: f.logo_color ?? '#1A56DB',
    website: f.website_url ?? '',
    telegram: f.telegram_url ?? '',
    instagram: f.instagram_url ?? undefined,
    donation_url: f.donation_url ?? undefined,
    inn: f.inn ?? '',
    registration: f.registration_number ?? '',
    is_verified: f.is_verified ?? false,
    indexes: mapIndexes(f.indexes),
    // These are not in FundListItem — will be 0 unless from FundDetail or separate call
    projects_count: f.projects_count ?? 0,
    beneficiaries: 0,
    total_income: 0,
    total_spent: 0,
  };
}

export function mapProject(p: any): Project {
  return {
    id: p.id,
    title: p.title_uz ?? p.title_ru ?? '',
    title_uz: p.title_uz ?? undefined,
    fundId: p.fund_id,
    status: p.status,
    budget: Number(p.budget ?? 0),
    spent: Number(p.spent ?? 0),
    beneficiaries: p.beneficiaries_count ?? 0,
    region: p.region?.name_uz ?? '',
    start_date: p.start_date ?? '',
    end_date: p.end_date ?? '',
  };
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: { page: number; per_page: number; total: number; total_pages: number };
}

interface DataResponse<T> {
  success: boolean;
  data: T;
}

export const platformStatsApi = {
  async get(): Promise<{ funds: number; projects: number; beneficiaries: number }> {
    // Step 1: get all funds (public endpoint)
    const fundsRes = await apiClient.get<PaginatedResponse<any>>('/api/v1/funds?per_page=100');
    const raw = fundsRes.data ?? [];
    const fundsTotal = fundsRes.meta?.total ?? raw.length;
    const projects = raw.reduce((s: number, f: any) => s + (f.projects_count ?? 0), 0);

    // Step 2: sum beneficiaries_count from each fund's projects in parallel
    const beneficiaries = await Promise.all(
      raw.map((f: any) =>
        apiClient
          .get<PaginatedResponse<any>>(`/api/v1/funds/${f.id}/projects?per_page=100`)
          .then((r) =>
            (r.data ?? []).reduce(
              (s: number, p: any) => s + (p.beneficiaries_count ?? 0),
              0,
            ),
          )
          .catch(() => 0),
      ),
    ).then((counts) => counts.reduce((a, b) => a + b, 0));

    return { funds: fundsTotal, projects, beneficiaries };
  },
};

export const fundsApi = {
  async getList(params?: {
    page?: number;
    per_page?: number;
    category_id?: string;
    region_id?: string;
    grade?: string;
    is_verified?: boolean;
    status?: string;
    sort?: string;
    search?: string;
  }): Promise<{ funds: Fund[]; total: number }> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.per_page) qs.set('per_page', String(params.per_page));
    if (params?.category_id) qs.set('category_id', params.category_id);
    if (params?.region_id) qs.set('region_id', params.region_id);
    if (params?.grade) qs.set('grade', params.grade);
    if (params?.is_verified !== undefined) qs.set('is_verified', String(params.is_verified));
    if (params?.status) qs.set('status', params.status);
    if (params?.sort) qs.set('sort', params.sort);
    if (params?.search) qs.set('q', params.search);

    const path = `/api/v1/funds?${qs.toString()}`;
    const res = await apiClient.get<PaginatedResponse<any>>(path);
    return {
      funds: (res.data ?? []).map(mapFund),
      total: res.meta?.total ?? 0,
    };
  },

  async getBySlug(slug: string): Promise<Fund> {
    const res = await apiClient.get<DataResponse<any>>(`/api/v1/funds/${slug}`);
    return mapFund(res.data);
  },

  async getProjects(fundId: string): Promise<Project[]> {
    const res = await apiClient.get<DataResponse<any[]>>(`/api/v1/funds/${fundId}/projects`);
    return (res.data ?? []).map(mapProject);
  },

  async create(data: Partial<Fund> & { category_id?: string; region_id?: string }): Promise<Fund> {
    const res = await apiClient.post<DataResponse<any>>('/api/v1/funds', data);
    return mapFund(res.data);
  },

  async update(id: string, data: Partial<Fund> & { category_id?: string; region_id?: string }): Promise<Fund> {
    const res = await apiClient.put<DataResponse<any>>(`/api/v1/funds/${id}`, data);
    return mapFund(res.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/funds/${id}`);
  },

  async verify(id: string): Promise<Fund> {
    const res = await apiClient.post<DataResponse<any>>(`/api/v1/funds/${id}/verify`);
    return mapFund(res.data);
  },

  async getRanking(params?: {
    page?: number;
    per_page?: number;
    category_id?: string;
    region_id?: string;
    grade?: string;
  }): Promise<{ funds: Fund[]; total: number }> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.per_page) qs.set('per_page', String(params.per_page));
    if (params?.category_id) qs.set('category_id', params.category_id);
    if (params?.region_id) qs.set('region_id', params.region_id);
    if (params?.grade) qs.set('grade', params.grade);

    const res = await apiClient.get<PaginatedResponse<any>>(`/api/v1/indexes/ranking?${qs.toString()}`);
    return {
      funds: (res.data ?? []).map(mapFund),
      total: res.meta?.total ?? 0,
    };
  },
};
