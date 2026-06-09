import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth';
import { clearToken, setAdminToken, clearAdminToken, tryAdminRefresh } from '../api/client';

interface AdminAuthState {
  isAdminAuthenticated: boolean;
  adminUser: { id: string; email: string; full_name: string } | null;
  adminLogin: (usernameOrEmail: string, password: string) => Promise<boolean>;
  adminLogout: () => Promise<void>;
  checkAdminSession: () => Promise<boolean>;
}

function resolveEmail(input: string): string {
  if (input.includes('@')) return input;
  if (input === 'admin') return 'admin@charityindex.uz';
  return `${input}@charityindex.uz`;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminUser: null,

      // Called on mount to silently restore session via HttpOnly cookie
      checkAdminSession: async () => {
        const refreshed = await tryAdminRefresh();
        if (!refreshed) {
          clearAdminToken();
          set({ isAdminAuthenticated: false, adminUser: null });
          return false;
        }
        return true;
      },

      adminLogin: async (usernameOrEmail, password) => {
        try {
          const email = resolveEmail(usernameOrEmail);
          const res = await authApi.login(email, password);
          const { user } = res.data;

          if (user.role !== 'admin' && user.role !== 'moderator') {
            clearToken();
            return false;
          }

          setAdminToken(res.data.access_token);
          set({
            isAdminAuthenticated: true,
            adminUser: { id: user.id, email: user.email, full_name: user.full_name ?? '' },
          });
          return true;
        } catch {
          return false;
        }
      },

      adminLogout: async () => {
        try { await authApi.logout(); } catch { /* ignore */ }
        clearAdminToken();
        set({ isAdminAuthenticated: false, adminUser: null });
      },
    }),
    {
      name: 'ciu_admin_auth',
      // Only persist user info — token stays in-memory only
      partialize: (state) => ({
        isAdminAuthenticated: state.isAdminAuthenticated,
        adminUser: state.adminUser,
      }),
    }
  )
);
