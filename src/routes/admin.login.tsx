import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { saveAdminSession, getAdminSession } from "@/lib/admin-auth";

const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: () => {
    if (getAdminSession()) throw redirect({ to: "/admin" });
  },
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Xatolik"); return; }
      saveAdminSession(data.token, {
        id: data.admin.id,
        username: data.admin.username,
        fullName: data.admin.fullName || data.admin.username,
        role: data.admin.role,
      });
      navigate({ to: "/admin" });
    } catch {
      setError("Serverga ulanib bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-admin
      className="relative flex min-h-screen items-center justify-center overflow-hidden font-sans"
      style={{ background: 'linear-gradient(135deg, #1a1512 0%, #0f0c09 50%, #1a1512 100%)' }}
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #d97706 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #d97706 0%, transparent 70%)' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative w-full max-w-sm px-4">
        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
          }}
        >
          {/* Logo */}
          <div className="mb-8 text-center">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              <span className="text-xl font-bold text-stone-900">M</span>
            </div>
            <h1 className="text-xl font-bold text-white">Museum Shop</h1>
            <p className="mt-1 text-xs text-white/40 uppercase tracking-[0.2em]">Boshqaruv paneli</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50 uppercase tracking-wider">
                Login
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                required
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(251,191,36,0.5)';
                  e.target.style.background = 'rgba(255,255,255,0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.06)';
                }}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50 uppercase tracking-wider">
                Parol
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(251,191,36,0.5)';
                  e.target.style.background = 'rgba(255,255,255,0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.06)';
                }}
              />
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-xs text-red-300"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl py-3 text-sm font-semibold text-stone-900 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 24px rgba(217,119,6,0.35)' }}
            >
              {loading ? "Kirish..." : "Kirish"}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-white/20">
            Museum Shop Uzbekistan © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
