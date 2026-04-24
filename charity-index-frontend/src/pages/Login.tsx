import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Check, Loader2, ArrowRight, Heart, Shield, BarChart3, Users, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/context/ToastContext';
import { useTranslation } from 'react-i18next';
import { usePlatformStats } from '@/src/hooks/usePlatformStats';
import { cn } from '@/src/lib/utils';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000;
const LOCKOUT_KEY  = 'ciu_user_lockout';

interface LockoutData { attempts: number; lockedUntil: string | null }

function readLockout(): LockoutData {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    if (raw) return JSON.parse(raw) as LockoutData;
  } catch { /* ignore */ }
  return { attempts: 0, lockedUntil: null };
}
function writeLockout(data: LockoutData) { localStorage.setItem(LOCKOUT_KEY, JSON.stringify(data)); }
function clearLockout() { localStorage.removeItem(LOCKOUT_KEY); }

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [attempts, setAttempts]       = useState(0);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  const [countdown, setCountdown]     = useState(0);

  const panelFeatures   = t('panel.features',   { returnObjects: true }) as string[];
  const panelStatLabels = t('panel.statLabels',  { returnObjects: true }) as string[];
  const featureIcons = [Shield, BarChart3, Users];
  const featureColors = ['bg-blue-500/30', 'bg-indigo-500/30', 'bg-violet-500/30'];
  const { fundsNum, projectsNum, beneficiariesNum } = usePlatformStats();
  const statNums = [fundsNum, projectsNum, beneficiariesNum];

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // Restore lockout from localStorage on mount
  useEffect(() => {
    const data = readLockout();
    if (data.lockedUntil) {
      const until = new Date(data.lockedUntil);
      if (until > new Date()) { setLockedUntil(until); setAttempts(data.attempts); }
      else clearLockout();
    }
  }, []);

  // Countdown while locked
  useEffect(() => {
    if (!lockedUntil) return;
    const tick = setInterval(() => {
      const ms = lockedUntil.getTime() - Date.now();
      if (ms <= 0) { setLockedUntil(null); setAttempts(0); clearLockout(); }
      else setCountdown(Math.ceil(ms / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [lockedUntil]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isLocked = !!(lockedUntil && lockedUntil > new Date());

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsLoading(true);
    try {
      await login(email, password);
      clearLockout();
      showToast(t('login.welcome'), 'success');
      navigate('/');
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = new Date(Date.now() + LOCKOUT_MS);
        setLockedUntil(until);
        writeLockout({ attempts: newAttempts, lockedUntil: until.toISOString() });
        showToast(`${MAX_ATTEMPTS} ta noto'g'ri urinish. Kirish 15 daqiqaga bloklandi.`, 'error');
      } else {
        writeLockout({ attempts: newAttempts, lockedUntil: null });
        const remaining = MAX_ATTEMPTS - newAttempts;
        const msg = err?.error?.message || t('login.wrongCredentials');
        showToast(`${msg} (${remaining} ta urinish qoldi)`, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [attempts, email, isLocked, login, navigate, password, showToast, t]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* ── LEFT PANEL ── */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-12 relative overflow-hidden">

        {/* Animated blobs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-28 -right-28 w-[380px] h-[380px] rounded-full bg-white"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-indigo-400"
        />
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 right-8 w-32 h-32 rounded-full bg-blue-500/20 blur-xl"
        />

        {/* Dot grid pattern */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" className="relative z-10 flex items-center gap-3 w-fit">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
              <Heart className="w-5 h-5 text-blue-600 fill-blue-600" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-none">Charity Index</div>
              <div className="text-blue-200 text-xs mt-0.5">Uzbekistan</div>
            </div>
          </Link>
        </motion.div>

        {/* Main content */}
        <div className="relative z-10 space-y-6">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-2 h-2 bg-emerald-400 rounded-full"
              />
              <span className="text-white/90 text-xs font-semibold">{t('panel.badge')}</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-white text-4xl font-black leading-tight"
          >
            {t('panel.heading1')}<br />{t('panel.heading2')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-blue-200 text-sm leading-relaxed max-w-xs"
          >
            {t('panel.desc')}
          </motion.p>

          {/* Feature cards */}
          <div className="flex flex-col gap-3 pt-2">
            {panelFeatures.map((text, i) => {
              const Icon = featureIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 hover:bg-white/12 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-xl ${featureColors[i]} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/85 text-sm font-medium">{text}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="relative z-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4"
        >
          {statNums.map((num, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.08 }}
            >
              <div className="text-white text-2xl font-black">{num}</div>
              <div className="text-blue-300 text-xs mt-0.5">{panelStatLabels[i]}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex items-center justify-center bg-white px-6 py-12 min-h-screen relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex md:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-slate-800">Charity Index</span>
          </Link>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-black text-slate-900 mb-1">{t('login.title')}</h2>
            <p className="text-slate-400 text-sm">{t('login.subtitle')}</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Lockout banner */}
            {isLocked && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-sm font-medium">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-700">Kirish vaqtincha bloklangan.</p>
                  <p className="text-2xl font-black tabular-nums text-amber-800 mt-1">{formatCountdown(countdown)}</p>
                </div>
              </div>
            )}

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="flex flex-col gap-1.5"
            >
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">{t('login.email')}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLocked || isLoading}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="flex flex-col gap-1.5"
            >
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">{t('login.password')}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked || isLoading}
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {/* Remember + Forgot */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}
                >
                  {rememberMe && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-sm text-slate-500">{t('login.rememberMe')}</span>
              </label>
              <button
                type="button"
                onClick={() => showToast(t('login.forgotSoon'), 'info')}
                className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                {t('login.forgotPassword')}
              </button>
            </motion.div>

            {/* Attempt indicator */}
            {attempts > 0 && !isLocked && (
              <div className="flex gap-1.5">
                {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                  <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors', i < attempts ? 'bg-rose-400' : 'bg-slate-200')} />
                ))}
              </div>
            )}

            {/* Submit */}
            <motion.button
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              whileHover={!isLocked && !isLoading ? { y: -2, boxShadow: '0 12px 28px rgba(59,130,246,0.35)' } : {}}
              whileTap={!isLocked && !isLoading ? { y: 0 } : {}}
              type="submit"
              disabled={isLoading || isLocked}
              className="mt-1 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-2xl transition-colors hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>{t('login.loading')}</span></>
              ) : isLocked ? (
                <span>Bloklangan — {formatCountdown(countdown)}</span>
              ) : (
                <><span>{t('login.submit')}</span><ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            className="my-6 flex items-center gap-3"
          >
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium px-2">{t('login.orDivider')}</span>
            <div className="flex-1 h-px bg-slate-100" />
          </motion.div>

          {/* Register */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-center text-sm text-slate-500"
          >
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              {t('login.register')}
            </Link>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="text-center text-xs text-slate-400 mt-5 leading-relaxed"
          >
            {t('login.termsPrefix')}{' '}
            <Link to="/metodologiya" className="underline hover:text-slate-600 transition-colors">
              {t('login.termsLink')}
            </Link>
            {' '}{t('login.termsSuffix')}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
