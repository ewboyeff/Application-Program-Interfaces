const API = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

export interface UserSession {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
}

export function getSession(): UserSession | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function getToken(): string | null {
  return localStorage.getItem("user_token");
}

export function saveSession(token: string, user: UserSession) {
  localStorage.setItem("user_token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("user_token");
  localStorage.removeItem("user");
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  return fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}
