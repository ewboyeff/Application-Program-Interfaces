import { apiClient, adminApiClient } from './client';

export interface ResearchStats {
  report: {
    statActive: string;
    statBeneficiaries: string;
    statRaised: string;
    statTransparency: string;
    areaPcts: number[];
    findingsValues: string[];
  };
  analysis: {
    statNewFunds: string;
    statOnlineReports: string;
    statUserRatings: string;
    growingChanges: string[];
    avgValues: string[];
  };
  comparison: {
    countryScores: number[];
    globalValues: string[];
  };
}

export const DEFAULT_RESEARCH_STATS: ResearchStats = {
  report: {
    statActive: '—',
    statBeneficiaries: '—',
    statRaised: '—',
    statTransparency: '—',
    areaPcts: [0, 0, 0, 0],
    findingsValues: ['—', '—', '—', '—', '—'],
  },
  analysis: {
    statNewFunds: '—',
    statOnlineReports: '—',
    statUserRatings: '—',
    growingChanges: ['—', '—', '—', '—'],
    avgValues: ['—', '—', '—'],
  },
  comparison: {
    countryScores: [0, 0, 0, 0, 0],
    globalValues: ['—', '—', '—', '—'],
  },
};

export const researchApi = {
  get: () => apiClient.get<ResearchStats>('/api/v1/settings/research'),
  update: (data: ResearchStats) =>
    adminApiClient.put<ResearchStats>('/api/v1/settings/research', data),
};
