import { apiClient, clearToken, setToken } from './client';

export interface ApiUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    user: ApiUser;
  };
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>('/api/v1/auth/login', {
      email,
      password,
    });
    if (res.data?.access_token) {
      setToken(res.data.access_token);
    }
    return res;
  },

  async register(payload: RegisterPayload): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>('/api/v1/auth/register', payload);
    if (res.data?.access_token) {
      setToken(res.data.access_token);
    }
    return res;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } finally {
      clearToken();
    }
  },

  async me(): Promise<ApiUser | null> {
    try {
      const res = await apiClient.get<{ data: ApiUser }>('/api/v1/auth/me');
      return res.data;
    } catch {
      return null;
    }
  },
};
