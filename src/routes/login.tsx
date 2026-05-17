import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { saveSession } from "@/lib/auth";

const API = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Kirish — Museum Shop" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Xatolik yuz berdi"); return; }
      saveSession(data.token, data.user);
      navigate({ to: "/profile" });
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="flex min-h-screen items-center justify-center px-4 pt-20 pb-16 sm:px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="eyebrow mb-2">Xush kelibsiz</p>
            <h1 className="font-serif text-3xl">Kirish</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Profilingizga kiring
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-card backdrop-blur-sm sm:p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-border/70 bg-background/60 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Parol
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border/70 bg-background/60 py-3 pl-11 pr-11 text-sm outline-none transition-colors focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-gold py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? "Tekshirilmoqda..." : "Kirish"}
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Akkaunt yo'qmi?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Ro'yxatdan o'tish
              </Link>
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
