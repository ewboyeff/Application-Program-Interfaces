import { create } from 'zustand';
import { Fund, Project, News, Review, Complaint } from '@/src/types';
import { fundsApi } from '@/src/api/funds';
import { newsApi } from '@/src/api/news';
import { reviewsApi } from '@/src/api/reviews';
import { complaintsApi } from '@/src/api/complaints';

interface DataState {
  funds: Fund[];
  projects: Project[];
  news: News[];
  reviews: Review[];
  complaints: Complaint[];

  // Loading states
  fundsLoading: boolean;
  newsLoading: boolean;

  // Actions — setters (for local updates after mutations)
  setFunds: (funds: Fund[]) => void;
  addFund: (fund: Fund) => void;
  updateFund: (id: string, fund: Partial<Fund>) => void;
  deleteFund: (id: string) => void;

  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  setNews: (news: News[]) => void;
  addNews: (news: News) => void;
  updateNews: (id: string, news: Partial<News>) => void;
  deleteNews: (id: string) => void;

  setReviews: (reviews: Review[]) => void;
  updateReviewStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;

  setComplaints: (complaints: Complaint[]) => void;
  updateComplaintStatus: (id: string, status: 'pending' | 'reviewed' | 'resolved') => void;

  // API fetch actions
  fetchFunds: () => Promise<void>;
  fetchNews: () => Promise<void>;
  fetchReviews: (fundId: string) => Promise<void>;
  fetchComplaints: () => Promise<void>;
}

export const useDataStore = create<DataState>()((set) => ({
  funds: [],
  projects: [],
  news: [],
  reviews: [],
  complaints: [],
  fundsLoading: false,
  newsLoading: false,

  // --- Setters ---
  setFunds: (funds) => set({ funds }),
  addFund: (fund) => set((s) => ({ funds: [fund, ...s.funds] })),
  updateFund: (id, updated) =>
    set((s) => ({ funds: s.funds.map((f) => (f.id === id ? { ...f, ...updated } : f)) })),
  deleteFund: (id) => set((s) => ({ funds: s.funds.filter((f) => f.id !== id) })),

  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((s) => ({ projects: [project, ...s.projects] })),
  updateProject: (id, updated) =>
    set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...updated } : p)) })),
  deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

  setNews: (news) => set({ news }),
  addNews: (item) => set((s) => ({ news: [item, ...s.news] })),
  updateNews: (id, updated) =>
    set((s) => ({ news: s.news.map((n) => (n.id === id ? { ...n, ...updated } : n)) })),
  deleteNews: (id) => set((s) => ({ news: s.news.filter((n) => n.id !== id) })),

  setReviews: (reviews) => set({ reviews }),
  updateReviewStatus: (id, status) =>
    set((s) => ({ reviews: s.reviews.map((r) => (r.id === id ? { ...r, status } : r)) })),

  setComplaints: (complaints) => set({ complaints }),
  updateComplaintStatus: (id, status) =>
    set((s) => ({ complaints: s.complaints.map((c) => (c.id === id ? { ...c, status } : c)) })),

  // --- API fetch actions ---
  fetchFunds: async () => {
    set({ fundsLoading: true });
    try {
      const { funds } = await fundsApi.getList({ per_page: 100 });
      set({ funds });
    } catch (err) {
      console.error('fetchFunds failed:', err);
    } finally {
      set({ fundsLoading: false });
    }
  },

  fetchNews: async () => {
    set({ newsLoading: true });
    try {
      const { news } = await newsApi.getList({ per_page: 50 });
      set({ news });
    } catch (err) {
      console.error('fetchNews failed:', err);
    } finally {
      set({ newsLoading: false });
    }
  },

  fetchReviews: async (fundId: string) => {
    try {
      const reviews = await reviewsApi.getByFund(fundId);
      set({ reviews });
    } catch (err) {
      console.error('fetchReviews failed:', err);
    }
  },

  fetchComplaints: async () => {
    try {
      const { complaints } = await complaintsApi.getList({ per_page: 100 });
      set({ complaints });
    } catch (err) {
      console.error('fetchComplaints failed:', err);
    }
  },
}));
