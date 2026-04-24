import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { useAdminAuthStore } from '@/src/store/useAdminAuthStore';
import { cn } from '@/src/lib/utils';
import { ap } from '@/src/lib/adminPath';

const MAX_ATTEMPTS      = 5;
const LOCKOUT_MS        = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_KEY       = 'ciu_admin_lockout';

interface LockoutData { attempts: number; lockedUntil: string | null }

function readLockout(): LockoutData {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    if (raw) return JSON.parse(raw) as LockoutData;
  } catch { /* ignore */ }
  return { attempts: 0, lockedUntil: null };
}

function writeLockout(data: LockoutData) {
  localStorage.setItem(LOCKOUT_KEY, JSON.stringify(data));
}

function clearLockout() {
  localStorage.removeItem(LOCKOUT_KEY);
}

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAdminAuthStore();

  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState('');
  const [attempts, setAttempts]         = useState(0);
  const [lockedUntil, setLockedUntil]   = useState<Date | null>(null);
  const [countdown, setCountdown]       = useState(0);

  // Restore lockout state from localStorage on mount
  useEffect(() => {
    const data = readLockout();
    if (data.lockedUntil) {
      const until = new Date(data.lockedUntil);
      if (until > new Date()) {
        setLockedUntil(until);
        setAttempts(data.attempts);
      } else {
        clearLockout();
      }
    }
  }, []);

  // Countdown timer while locked
  useEffect(() => {
    if (!lockedUntil) return;
    const tick = setInterval(() => {
      const ms = lockedUntil.getTime() - Date.now();
      if (ms <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setError('');
        clearLockout();
      } else {
        setCountdown(Math.ceil(ms / 1000));
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [lockedUntil]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (lockedUntil && lockedUntil > new Date()) {
      setError(`Kirish vaqtincha bloklangan. ${formatCountdown(countdown)} dan keyin urinib ko'ring.`);
      return;
    }

    setIsLoading(true);
    const success = await adminLogin(username, password);
    setIsLoading(false);

    if (success) {
      clearLockout();
      navigate(ap('/dashboard'));
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= MAX_ATTEMPTS) {
      const until = new Date(Date.now() + LOCKOUT_MS);
      setLockedUntil(until);
      writeLockout({ attempts: newAttempts, lockedUntil: until.toISOString() });
      setError(`${MAX_ATTEMPTS} ta noto'g'ri urinish. Kirish 15 daqiqaga bloklandi.`);
    } else {
      writeLockout({ attempts: newAttempts, lockedUntil: null });
      const remaining = MAX_ATTEMPTS - newAttempts;
      setError(`Login yoki parol noto'g'ri. Yana ${remaining} ta urinish qoldi.`);
    }
  }, [adminLogin, attempts, countdown, lockedUntil, navigate, password, username]);

  const isLocked = !!(lockedUntil && lockedUntil > new Date());

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[400px] relative z-10">
        <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-6">
              <Lock className="w-3 h-3" />
              🔐 Admin Panel
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Charity Index</h1>
            <p className="text-slate-500 text-sm font-medium">Admin boshqaruv paneli</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className={cn(
                "border rounded-2xl p-4 flex items-start gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300",
                isLocked
                  ? "bg-amber-50 border-amber-100 text-amber-700"
                  : "bg-rose-50 border-rose-100 text-rose-600"
              )}>
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p>{error}</p>
                  {isLocked && (
                    <p className="mt-1 text-lg font-black tabular-nums">{formatCountdown(countdown)}</p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Login</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  disabled={isLocked || isLoading}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Parol</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLocked || isLoading}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Attempt indicator */}
            {attempts > 0 && !isLocked && (
              <div className="flex gap-1.5 justify-center">
                {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      i < attempts ? "bg-rose-400" : "bg-slate-200"
                    )}
                  />
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Tekshirilmoqda...</>
              ) : isLocked ? (
                `Bloklangan — ${formatCountdown(countdown)}`
              ) : (
                'Kirish'
              )}
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-8 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Asosiy saytga qaytish
          </button>
        </div>
      </div>
    </div>
  );
};

const AlertTriangle = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/><path d="M12 17h.01"/>
  </svg>
);
