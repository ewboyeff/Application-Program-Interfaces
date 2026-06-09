import { apiClient, adminApiClient } from './client';

export interface ApiFactor {
  id: string;
  index_type: 'transparency' | 'openness' | 'trust';
  name_uz: string;
  name_ru: string | null;
  name_en: string | null;
  weight: number;
  is_active: boolean;
  order: number;
}

export interface FactorsGrouped {
  transparency: ApiFactor[];
  openness: ApiFactor[];
  trust: ApiFactor[];
}

export interface FundFactorScore {
  factor_id: string;
  index_type: 'transparency' | 'openness' | 'trust';
  factor_name_uz: string;
  weight: number;
  score: number;
  note: string | null;
}

export interface FundIndexScores {
  fund_id: string;
  transparency_score: number;
  openness_score: number;
  trust_score: number;
  overall_score: number;
  grade: string;
  calculated_at: string | null;
  factor_scores: FundFactorScore[];
}

interface DataResponse<T> { data: T }

export const indexesApi = {
  async getFactors(): Promise<FactorsGrouped> {
    const res = await apiClient.get<DataResponse<FactorsGrouped>>('/api/v1/indexes/factors');
    return res.data;
  },

  async getFundScores(fundId: string): Promise<FundIndexScores> {
    const res = await apiClient.get<DataResponse<FundIndexScores>>(`/api/v1/indexes/${fundId}/scores`);
    return res.data;
  },

  async updateFactor(id: string, data: { weight?: number; is_active?: boolean; name_uz?: string }): Promise<ApiFactor> {
    const res = await adminApiClient.put<DataResponse<ApiFactor>>(`/api/v1/indexes/factors/${id}`, data);
    return res.data;
  },

  async calculateIndex(fundId: string, scores: { factor_id: string; score: number }[]): Promise<FundIndexScores> {
    const res = await adminApiClient.post<DataResponse<FundIndexScores>>(`/api/v1/indexes/${fundId}/calculate`, { scores });
    return res.data;
  },

  async createFactor(data: {
    index_type: 'transparency' | 'openness' | 'trust';
    name_uz: string;
    name_ru?: string;
    name_en?: string;
    weight: number;
    order?: number;
  }): Promise<ApiFactor> {
    const res = await adminApiClient.post<DataResponse<ApiFactor>>('/api/v1/indexes/factors', data);
    return res.data;
  },

  async deleteFactor(factorId: string): Promise<void> {
    await adminApiClient.delete(`/api/v1/indexes/factors/${factorId}`);
  },
};
