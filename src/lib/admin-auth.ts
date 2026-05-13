const TOKEN_KEY = "ms_admin_token";
const SESSION_KEY = "ms_admin_session";
const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

export interface AdminSession {
  id: string;
  username: string;
  fullName: string;
  role: string;
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveAdminSession(token: string, admin: AdminSession) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(admin));
  } catch {}
}

export function clearAdminSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const existing = (options.headers || {}) as Record<string, string>;
  return fetch(`${BASE}${path}`, { ...options, headers: { ...headers, ...existing } });
}
