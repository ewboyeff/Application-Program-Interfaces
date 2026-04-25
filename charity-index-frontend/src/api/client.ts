// ---------------------------------------------------------------------------
// In-memory token storage — never touches localStorage, safe from XSS
// ---------------------------------------------------------------------------
let _accessToken: string | null = null;
let _adminToken: string | null = null;

export const getToken        = (): string | null => _accessToken;
export const setToken        = (token: string): void => { _accessToken = token; };
export const clearToken      = (): void => { _accessToken = null; };

export const getAdminToken   = (): string | null => _adminToken;
export const setAdminToken   = (token: string): void => { _adminToken = token; };
export const clearAdminToken = (): void => { _adminToken = null; };

// ---------------------------------------------------------------------------
// Base URL
// ---------------------------------------------------------------------------
const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  'http://localhost:8000';

// ---------------------------------------------------------------------------
// Refresh — uses HttpOnly cookie set by backend on login
// ---------------------------------------------------------------------------
export async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const json = await res.json();
    const newToken = json?.data?.access_token;
    if (newToken) { setToken(newToken); return true; }
    return false;
  } catch {
    return false;
  }
}

export async function tryAdminRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const json = await res.json();
    const newToken = json?.data?.access_token;
    if (newToken) { setAdminToken(newToken); return true; }
    return false;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Core request function
// ---------------------------------------------------------------------------
async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers, credentials: 'include' });

  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(path, options, false);
    clearToken();
  }

  if (res.status === 204) return undefined as T;
  const json = await res.json();
  if (!res.ok) throw json;
  return json as T;
}

// ---------------------------------------------------------------------------
// Admin request function
// ---------------------------------------------------------------------------
async function adminRequest<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers, credentials: 'include' });

  if (res.status === 401 && retry) {
    const refreshed = await tryAdminRefresh();
    if (refreshed) return adminRequest<T>(path, options, false);
    clearAdminToken();
  }

  if (res.status === 204) return undefined as T;
  const json = await res.json();
  if (!res.ok) throw json;
  return json as T;
}

// ---------------------------------------------------------------------------
// Public API client
// ---------------------------------------------------------------------------
export const apiClient = {
  get:    <T>(path: string)                  => request<T>(path, { method: 'GET' }),
  post:   <T>(path: string, body?: unknown)  => request<T>(path, { method: 'POST',  body: body !== undefined ? JSON.stringify(body) : undefined }),
  put:    <T>(path: string, body?: unknown)  => request<T>(path, { method: 'PUT',   body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch:  <T>(path: string, body?: unknown)  => request<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string)                  => request<T>(path, { method: 'DELETE' }),
};

// ---------------------------------------------------------------------------
// Admin API client
// ---------------------------------------------------------------------------
export const adminApiClient = {
  get:    <T>(path: string)                  => adminRequest<T>(path, { method: 'GET' }),
  post:   <T>(path: string, body?: unknown)  => adminRequest<T>(path, { method: 'POST',  body: body !== undefined ? JSON.stringify(body) : undefined }),
  put:    <T>(path: string, body?: unknown)  => adminRequest<T>(path, { method: 'PUT',   body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch:  <T>(path: string, body?: unknown)  => adminRequest<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string)                  => adminRequest<T>(path, { method: 'DELETE' }),
};
