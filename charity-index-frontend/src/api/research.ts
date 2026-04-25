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
    statActive: '120+',
    statBeneficiaries: '850K+',
    statRaised: '₿ 45B',
    statTransparency: '68%',
    areaPcts: [38, 28, 19, 15],
    findingsValues: ['87 ta', '6 ta', '21 ta', '62.4', '+8.3%'],
  },
  analysis: {
    statNewFunds: '+23%',
    statOnlineReports: '+41%',
    statUserRatings: '+18%',
    growingChanges: ['+34%', '+29%', '+22%', '+17%'],
    avgValues: ['51.2 ball', '57.6 ball (+6.4)', '62.4 ball (+4.8)'],
  },
  comparison: {
    countryScores: [74, 61, 62, 48, 31],
    globalValues: ['58.3 ball', '79.1 ball', '55.2 ball', "2-o'rin"],
  },
};

export const researchApi = {
  get: () => apiClient.get<ResearchStats>('/api/v1/settings/research'),
  update: (data: ResearchStats) =>
    adminApiClient.put<ResearchStats>('/api/v1/settings/research', data),
};
