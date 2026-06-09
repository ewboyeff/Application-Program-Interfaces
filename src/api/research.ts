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
    statActive: '156+',
    statBeneficiaries: '1.2M+',
    statRaised: '₿ 78B',
    statTransparency: '74%',
    areaPcts: [40, 27, 20, 13],
    findingsValues: ['124 ta', '11 ta', '38 ta', '68.7', '+10.5%'],
  },
  analysis: {
    statNewFunds: '+31%',
    statOnlineReports: '+58%',
    statUserRatings: '+27%',
    growingChanges: ['+47%', '+38%', '+31%', '+24%'],
    avgValues: ['62.4 ball', '65.8 ball (+3.4)', '68.7 ball (+2.9)'],
  },
  comparison: {
    countryScores: [79, 65, 69, 51, 33],
    globalValues: ['61.2 ball', '82.4 ball', '58.7 ball', "2-o'rin"],
  },
};

export const researchApi = {
  get: () => apiClient.get<ResearchStats>('/api/v1/settings/research'),
  update: (data: ResearchStats) =>
    adminApiClient.put<ResearchStats>('/api/v1/settings/research', data),
};
