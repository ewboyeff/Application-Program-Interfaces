import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, ApiUser } from '../api/auth';
import { clearToken, tryRefresh } from '../api/client';
import { useInactivityTimeout } from '../hooks/useInactivityTimeout';

const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin' | 'moderator' | 'fund_rep';
  phone?: string;
  region?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

function toUser(api: ApiUser): User {
  return {
    id: api.id,
    email: api.email,
    full_name: api.full_name ?? '',
    role: api.role as User['role'],
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // On mount: try to restore session via HttpOnly refresh cookie
  useEffect(() => {
    const init = async () => {
      const refreshed = await tryRefresh();
      if (refreshed) {
        try {
          const apiUser = await authApi.me();
          if (apiUser) setUser(toUser(apiUser));
          else clearToken();
        } catch {
          clearToken();
        }
      }
      setIsAuthReady(true);
    };
    init();
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    clearToken();
    setUser(null);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setUser(toUser(res.data.user));
  };

  const register = async (email: string, password: string, full_name: string) => {
    const res = await authApi.register({ email, password, full_name });
    setUser(toUser(res.data.user));
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  // Auto-logout after 30 minutes of inactivity
  useInactivityTimeout(logout, INACTIVITY_MS, !!user);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAuthReady, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
