import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, User, Check, Loader2, X, ArrowRight, Heart, Shield, BarChart3, Users } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/context/ToastContext';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';
import { usePlatformStats } from '@/src/hooks/usePlatformStats';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { t } = useTranslation('auth');
  const [fullName, setFullName]               = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [isLoading, setIsLoading]             = useState(false);
  const [agreeTerms, setAgreeTerms]           = useState(false);
  const [errors, setErrors]                   = useState<Record<string, string>>({});

  const panelFeatures   = t('panel.features',  { returnObjects: true }) as string[];
  const panelStatLabels = t('panel.statLabels', { returnObjects: true }) as string[];
  const strengthLabels  = t('register.strength', { returnObjects: true }) as string[];
  const featureIcons  = [Shield, BarChart3, Users];
  const featureColors = ['bg-blue-500/30', 'bg-indigo-500/30', 'bg-violet-500/30'];
  const { fundsNum, projectsNum, beneficiariesNum } = usePlatformStats();
  const statNums = [fundsNum, projectsNum, beneficiariesNum];
  const strengthColors = ['', '#DC2626', '#F59E0B', '#3B82F6', '#059669'];

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const getStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6)          s++;
    if (/[A-Z]/.test(password))        s++;
    if (/[0-9]/.test(password))        s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const strength = getStrength();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName)                    e.fullName        = t('register.validation.fullName');
    if (!email)                       e.email           = t('register.validation.email');
    if (!password)                    e.password        = t('register.validation.password');
    if (password !== confirmPassword) e.confirmPassword = t('register.validation.confirmPassword');
    if (!agreeTerms)                  e.terms           = t('register.validation.terms');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register(email, password, fullName);
      showToast(t('register.success'), 'success');
      navigate('/');
    } catch (err: any) {
      showToast(err?.error?.message || t('register.generalError'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase   = 'w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all';
  const inputNormal = 'border-slate-100 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]';
  const inputError  = 'border-red-400 bg-red-50 focus:border-red-500';

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* ── LEFT PANEL ── */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-12 relative overflow-hidden">
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

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-white text-4xl font-black leading-tight"
          >
            {t('panel.heading1')}<br />{t('panel.heading2')}
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-blue-200 text-sm leading-relaxed max-w-xs"
          >
            {t('panel.desc')}
          </motion.p>

          <div className="flex flex-col gap-3 pt-2">
            {panelFeatures.map((text, i) => {
              const Icon = featureIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3"
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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="relative z-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4"
        >
          {statNums.map((num, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.08 }}>
              <div className="text-white text-2xl font-black">{num}</div>
              <div className="text-blue-300 text-xs mt-0.5">{panelStatLabels[i]}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex items-center justify-center bg-white px-6 py-12 min-h-screen relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex md:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-slate-800">Charity Index</span>
          </Link>

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-7">
            <h2 className="text-3xl font-black text-slate-900 mb-1">{t('register.title')}</h2>
            <p className="text-slate-400 text-sm">{t('register.subtitle')}</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Full name */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">{t('register.fullName')}</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder={t('register.fullNamePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={cn(inputBase, errors.fullName ? inputError : inputNormal)}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">{t('register.email')}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(inputBase, errors.email ? inputError : inputNormal)}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">{t('register.password')}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('register.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(inputBase, 'pr-12', errors.password ? inputError : inputNormal)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-1 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: i <= strength ? strengthColors[strength] : '#E2E8F0' }} />
                    ))}
                  </div>
                  <p className="text-xs font-semibold" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </motion.div>

            {/* Confirm password */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">{t('register.confirmPassword')}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder={t('register.confirmPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(inputBase, 'pr-12', errors.confirmPassword ? inputError : inputNormal)}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && (
                <div className="flex items-center gap-1.5">
                  {password === confirmPassword ? (
                    <><Check className="w-3.5 h-3.5 text-emerald-500" /><span className="text-emerald-600 text-xs font-medium">{t('register.passwordMatch')}</span></>
                  ) : (
                    <><X className="w-3.5 h-3.5 text-red-500" /><span className="text-red-500 text-xs font-medium">{t('register.passwordNoMatch')}</span></>
                  )}
                </div>
              )}
            </motion.div>

            {/* Terms */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <div className="flex items-start gap-3 cursor-pointer" onClick={() => setAgreeTerms(!agreeTerms)}>
                <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${agreeTerms ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                  {agreeTerms && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-sm text-slate-500 leading-relaxed">
                  <Link to="/metodologiya" className="text-blue-600 font-semibold hover:underline" onClick={(e) => e.stopPropagation()}>
                    {t('register.termsLink')}
                  </Link>
                  {' '}{t('register.termsAnd')}
                </span>
              </div>
              {errors.terms && <p className="text-red-500 text-xs mt-1.5 ml-7">{errors.terms}</p>}
            </motion.div>

            {/* Submit */}
            <motion.button
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              whileHover={{ y: -2, boxShadow: '0 12px 28px rgba(59,130,246,0.35)' }}
              whileTap={{ y: 0 }}
              type="submit"
              disabled={isLoading}
              className="mt-1 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-2xl transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>{t('register.loading')}</span></>
              ) : (
                <><span>{t('register.submit')}</span><ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="my-5 flex items-center gap-3"
          >
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium px-2">{t('register.orDivider')}</span>
            <div className="flex-1 h-px bg-slate-100" />
          </motion.div>

          {/* Login link */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="text-center text-sm text-slate-500"
          >
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              {t('register.login')}
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
