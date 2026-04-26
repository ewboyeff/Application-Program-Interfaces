import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCategoryName } from '@/src/hooks/useCategoryName';
import { useLanguage } from '@/src/context/LanguageContext';
import { Search, ArrowRight, BarChart3, CheckCircle2, ChevronRight, Calendar, ChevronDown, TrendingUp } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { Layout } from '@/src/components/layout/Layout';
import { SectionTitle } from '@/src/components/ui/SectionTitle';
import { FundAvatar } from '@/src/components/ui/FundAvatar';
import { GradeBadge } from '@/src/components/ui/GradeBadge';
import { VerifiedBadge } from '@/src/components/ui/VerifiedBadge';
import { getScoreBg, cn, formatDate, assetUrl } from '@/src/lib/utils';
import { useDataStore } from '@/src/store/useDataStore';
import { apiClient } from '@/src/api/client';

interface PublicStats {
  total_funds: number;
  verified_funds: number;
  total_projects: number;
  total_beneficiaries: number;
}

const Counter = ({ value, duration = 1.5 }: { value: number | string, duration?: number }) => {
  const count = useMotionValue(0);
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;
  const rounded = useTransform(count, (latest) => {
    const val = Math.round(latest);
    if (typeof value === 'string' && value.includes('+')) {
      return new Intl.NumberFormat('en-US').format(val) + '+';
    }
    return new Intl.NumberFormat('en-US').format(val);
  });

  useEffect(() => {
    const controls = animate(count, numericValue, { duration });
    return controls.stop;
  }, [numericValue, duration, count]);

  return <motion.span>{rounded}</motion.span>;
};

export default function Home() {
  const navigate = useNavigate();
  const { funds, news } = useDataStore();
  const { t } = useTranslation('home');
  const getCategoryName = useCategoryName();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fundName = (f: typeof funds[0]) => (language === 'en' && f.name_en) ? f.name_en : f.name_uz;
  const fundDesc = (f: typeof funds[0]) => (language === 'en' && (f as any).description_en) ? (f as any).description_en : f.description_uz;
  const searchRef = useRef<HTMLDivElement>(null);
  const [publicStats, setPublicStats] = useState<PublicStats>({
    total_funds: 0,
    verified_funds: 0,
    total_projects: 0,
    total_beneficiaries: 0,
  });

  useEffect(() => {
    apiClient.get<PublicStats>('/api/v1/stats/public')
      .then((res) => { if (res && typeof res === 'object') setPublicStats(res as PublicStats); })
      .catch(() => {});
  }, []);

  const filteredSuggestions = funds.filter(fund =>
    fundName(fund).toLowerCase().includes(searchQuery.toLowerCase()) ||
    fund.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/funds?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const topFunds = [...funds]
    .sort((a, b) => b.indexes.overall - a.indexes.overall)
    .slice(0, 3);

  const homeNews = news.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="min-h-[90vh] sm:min-h-screen flex items-center relative overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          {/* Layer 1 — Image (Nature Landscape) */}
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80" 
            alt="Uzbekistan Nature Landscape"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          
          {/* Layer 2 — Gradient Overlay (Darker for contrast) */}
          <div 
            className="absolute inset-0 z-[1]"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(15,23,42,0.9) 40%, rgba(26,86,219,0.8) 100%)'
            }}
          />

          {/* Fallback Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 50px)'
            }}
          />
        </div>

        {/* Background Decorations */}
        <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(#3B82F6_center,transparent)] opacity-15 rounded-full pointer-events-none z-[1]" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[radial-gradient(#059669_center,transparent)] opacity-10 rounded-full pointer-events-none z-[1]" />
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 z-[1]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="max-w-5xl mx-auto px-4 py-14 sm:py-24 w-full relative z-[2] text-center flex flex-col items-center">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center max-w-3xl mx-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight">
              {t('hero.line1')} <br />
              {t('hero.line2')} <br />
              <span className="bg-gradient-to-r from-[#60A5FA] to-[#34D399] bg-clip-text text-transparent drop-shadow-sm">
                {t('hero.line3')}
              </span>
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 sm:mt-6 text-base sm:text-xl text-white max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Search Container */}
          <div className="mt-6 sm:mt-10 w-full max-w-2xl mx-auto relative" ref={searchRef}>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSearch}
              className="bg-white/12 backdrop-blur-[20px] border-[1.5px] border-white/25 rounded-[20px] p-2 pl-5 flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 focus-within:border-white/50 focus-within:bg-white/18 focus-within:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_4px_rgba(255,255,255,0.08)]"
            >
              <Search className="w-5 h-5 text-white/60 shrink-0" />
              <input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                className="flex-1 bg-transparent border-none outline-none text-white text-base font-normal placeholder:text-white/50 focus:ring-0"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 1);
                }}
                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
              />
              <div className="w-px h-6 bg-white/20 shrink-0" />
              <button
                type="submit"
                className="bg-white text-[#1A56DB] rounded-[12px] w-10 h-10 sm:w-auto sm:h-auto sm:rounded-[14px] sm:px-7 sm:py-3 sm:gap-2 font-bold text-[15px] cursor-pointer shrink-0 flex items-center justify-center hover:bg-[#F0F7FF] hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
              >
                <Search className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">{t('hero.searchButton')}</span>
              </button>
            </motion.form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden z-50 text-left"
              >
                <div className="py-2">
                  {filteredSuggestions.map((fund) => (
                    <div
                      key={fund.id}
                      onClick={() => {
                        navigate(`/funds/${fund.slug}`);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <FundAvatar initials={fund.logo_initials} color={fund.logo_color} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{fundName(fund)}</div>
                        <div className="text-xs text-slate-400">{fund.category}</div>
                      </div>
                      <div className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold",
                        getScoreBg(fund.indexes.overall).replace('bg-', 'bg-opacity-10 text-')
                      )}>
                        {fund.indexes.overall}
                      </div>
                    </div>
                  ))}
                </div>
                <div 
                  onClick={() => navigate(`/funds?search=${encodeURIComponent(searchQuery)}`)}
                  className="px-4 py-2.5 border-t border-slate-100 text-primary-600 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  {t('topFunds.viewAll')} →
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 flex justify-center items-center gap-2 flex-wrap"
          >
            <span className="text-sm text-white/40">{t('hero.popular')}:</span>
            {[
              { label: t('hero.tags.education'), emoji: "🎓", to: "/funds?category=talim" },
              { label: t('hero.tags.verified'),  emoji: "✅", to: "/funds?verified=true" },
              { label: t('hero.tags.topRating'), emoji: "🏆", to: "/ranking" },
              { label: t('hero.tags.ecology'),   emoji: "💚", to: "/funds?category=ekologiya" },
            ].map((tag) => (
              <Link
                key={tag.label}
                to={tag.to}
                className="bg-white/8 border border-white/15 text-white/75 rounded-full px-3.5 py-1.5 text-[13px] hover:bg-white/15 hover:text-white hover:border-white/30 transition-all duration-200 flex items-center gap-1.5"
              >
                <img src={`https://emojicdn.elk.sh/${tag.emoji}?style=apple`} alt={tag.emoji} className="w-3.5 h-3.5" referrerPolicy="no-referrer" />
                {tag.label}
              </Link>
            ))}
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 sm:mt-12 bg-white/6 border border-white/10 rounded-[20px] p-4 sm:p-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto w-full"
          >
            {[
              { value: publicStats.total_funds, label: t('stats.activeFunds') },
              { value: publicStats.total_projects, label: t('stats.projects') },
              { value: publicStats.total_beneficiaries, label: t('stats.beneficiaries') },
              { value: publicStats.verified_funds, label: t('stats.verified') },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className={cn(
                  "text-center px-2",
                  index !== 3 && "border-r border-white/10"
                )}
              >
                <span className="text-2xl font-black text-white block">
                  <Counter value={stat.value} />
                </span>
                <span className="text-[12px] text-white/80 mt-0.5 block">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          >
            <ChevronDown className="w-6 h-6 text-white/40" />
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{t('hero.scrollHint')}</span>
          </motion.div>
        </div>
      </section>

      {/* Top Funds Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80"
            alt="Nature Valley"
            className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-white/90" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <SectionTitle title={t('topFunds.title')} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topFunds.map((fund, index) => (
              <motion.div
                key={fund.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate(`/funds/${fund.slug}`)}
                className={cn(
                  "group relative bg-white rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
                  "border-[1.5px] border-[#E2E8F0] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  "cursor-pointer overflow-visible",
                  "hover:border-[#1A56DB] hover:shadow-[0_0_0_4px_rgba(26,86,219,0.08),0_20px_40px_rgba(26,86,219,0.12),0_8px_16px_rgba(0,0,0,0.08)]",
                  "hover:bg-gradient-to-b hover:from-white hover:to-[#F8FBFF]",
                  "before:content-[''] before:absolute before:inset-[-1px] before:rounded-[21px]",
                  "before:bg-gradient-to-br before:from-[rgba(26,86,219,0.06)] before:to-[rgba(59,130,246,0.04)]",
                  "before:z-[-1] before:blur-[8px] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                )}
              >
                <div className="h-1.5 w-full rounded-t-[20px]" style={{ backgroundColor: fund.logo_color }} />
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <FundAvatar initials={fund.logo_initials} color={fund.logo_color} imageUrl={assetUrl(fund.logo_url)} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-[17px] text-[#1E293B] tracking-[-0.3px] truncate group-hover:text-[#1A56DB] transition-colors duration-300">
                        {fundName(fund)}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <GradeBadge grade={fund.indexes.grade} />
                        <VerifiedBadge isVerified={fund.is_verified} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-[11px] font-bold rounded uppercase tracking-[0.8px]">{getCategoryName(fund.category)}</span>
                    <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-[11px] font-bold rounded uppercase tracking-[0.8px]">{t(`regions.${fund.region}`, { ns: 'common', defaultValue: fund.region })}</span>
                  </div>

                  <p className="text-sm text-[#64748B] line-clamp-2 mb-6 font-medium">{fundDesc(fund)}</p>

                  <div className="bg-[#F8FAFC] rounded-xl p-4 mb-6 group-hover:bg-white transition-colors duration-300">
                    <div className="text-center mb-4">
                      <span className="text-[32px] font-black text-[#1E293B] group-hover:text-[#1A56DB] transition-colors duration-300">{fund.indexes.overall}</span>
                      <span className="text-sm text-[#94A3B8] ml-1">/100</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: t('transparency', { ns: 'fund_detail' }), score: fund.indexes.transparency },
                        { label: t('openness', { ns: 'fund_detail' }), score: fund.indexes.openness },
                        { label: t('trust', { ns: 'fund_detail' }), score: fund.indexes.trust },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-[11px] font-bold text-[#475569] mb-1 uppercase tracking-[0.6px]">
                            <span>{item.label}</span>
                            <span className="text-[13px] font-extrabold text-[#1E293B]">{item.score}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.score}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={cn('h-full rounded-full transition-all duration-300 group-hover:saturate-150', getScoreBg(item.score))}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
                    <span className="text-sm text-[#64748B] font-bold">{fund.projects_count} {t('topFunds.projects', { defaultValue: 'loyiha' })}</span>
                    <span className="text-[14px] font-black text-[#1A56DB] flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t('topFunds.details', { defaultValue: 'Batafsil' })} <ChevronRight className="w-4 h-4 group-hover:translate-x-[3px] transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Image Layer (Nature Hills) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80" 
            alt="Nature Hills"
            className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-50/90" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <SectionTitle
            title={t('howItWorks.title')}
            centered
          />

          <div className="max-w-5xl mx-auto relative">
            {/* Connector lines (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-px border-t-2 border-dashed border-slate-200 -translate-y-12 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                {
                  step: "01",
                  icon: Search,
                  title: t('howItWorks.step1.title'),
                  text: t('howItWorks.step1.text'),
                  color: "bg-blue-50 text-[#1A56DB]"
                },
                {
                  step: "02",
                  icon: BarChart3,
                  title: t('howItWorks.step2.title'),
                  text: t('howItWorks.step2.text'),
                  color: "bg-emerald-50 text-emerald-600"
                },
                {
                  step: "03",
                  icon: CheckCircle2,
                  title: t('howItWorks.step3.title'),
                  text: t('howItWorks.step3.text'),
                  color: "bg-amber-50 text-amber-600"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm', item.color)}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Step {item.step}</span>
                  <h4 className="text-xl font-black text-[#1E293B] mb-3">{item.title}</h4>
                  <p className="text-[#64748B] text-sm leading-relaxed px-4 font-medium">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner Section */}
      <section className="py-24 bg-gradient-to-br from-primary-900 to-black text-white relative overflow-hidden">
        {/* Background Image Layer (Nature Mountains) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80" 
            alt="Nature Mountains"
            className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        {/* Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-30 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 relative z-[1]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: "🏛️", value: publicStats.total_funds, label: t('statsSection.activeFunds') },
              { icon: "✅", value: publicStats.verified_funds, label: t('statsSection.verified') },
              { icon: "📋", value: publicStats.total_projects, label: t('statsSection.projects') },
              { icon: "👥", value: publicStats.total_beneficiaries, label: t('statsSection.beneficiaries') },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  <img src={`https://emojicdn.elk.sh/${stat.icon}?style=apple`} alt={stat.icon} className="w-12 h-12 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" referrerPolicy="no-referrer" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
                  <Counter value={stat.value} />
                </div>
                <div className="text-white text-sm mt-3 uppercase tracking-[0.2em] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Image Layer (Nature Forest) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80" 
            alt="Nature Forest"
            className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-white/95" />
        </div>

        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30 -ml-48 -mb-48 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <SectionTitle
            title={t('news.title')}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {homeNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate('/news')}
                className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-pointer"
              >
                <div className={cn('h-44 relative bg-gradient-to-br', news.gradient)}>
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider border border-white/30">
                    {news.category}
                  </span>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-black text-[#1E293B] mb-3 line-clamp-2 group-hover:text-[#1A56DB] transition-colors">
                    {news.title}
                  </h4>
                  <p className="text-sm text-[#64748B] mb-6 line-clamp-2 font-medium">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
                    <div className="flex items-center gap-2 text-[#94A3B8] text-xs font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(news.date)}</span>
                    </div>
                    <span className="text-sm font-black text-[#1A56DB] flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t('topFunds.details')} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/news')}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#1A56DB] text-[#1A56DB] font-black rounded-xl hover:bg-blue-50 transition-all"
            >
              {t('news.viewAll')} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1E293B] relative overflow-hidden">
        {/* Background Image Layer (Nature Lake) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1920&q=80" 
            alt="Nature Lake"
            className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#1E293B]/90" />
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -mr-32 -mt-32 z-[1]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl -ml-32 -mb-32 z-[1]" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-10 font-medium">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-10 py-4 bg-white text-[#1E293B] font-black rounded-xl hover:bg-slate-100 transition-all shadow-lg"
              >
                {t('cta.addFund')}
              </button>
              <button
                onClick={() => navigate('/hamkorlik')}
                className="w-full sm:w-auto px-10 py-4 border-2 border-white/20 text-white font-black rounded-xl hover:bg-white/10 transition-all"
              >
                {t('cta.learnMore')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
