import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, User, Globe, Send, Instagram, Check, Plus, AlertTriangle, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Fund } from '@/src/types';
import { FundAvatar } from '@/src/components/ui/FundAvatar';
import { GradeBadge } from '@/src/components/ui/GradeBadge';
import { cn, assetUrl } from '@/src/lib/utils';
import { useCategoryName } from '@/src/hooks/useCategoryName';

interface FundHeroProps {
  fund: Fund;
  selected: boolean;
  onCompare: () => void;
  onComplaint: () => void;
  onDownloadPDF: () => void;
}

export const FundHero: React.FC<FundHeroProps> = ({ fund, selected, onCompare, onComplaint, onDownloadPDF }) => {
  const { t, i18n } = useTranslation('fund_detail');
  const getCategoryName = useCategoryName();

  return (
    <section className="bg-gradient-to-b from-[#0F172A] to-[#1E293B] relative overflow-hidden min-h-[320px]">
      {/* Background Decorations */}
      <div
        className="absolute top-0 right-0 w-96 h-96 blur-3xl opacity-15 rounded-full pointer-events-none"
        style={{ backgroundColor: fund.logo_color }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/50 mb-8">
          <Link to="/" className="hover:text-white transition-colors">{t('breadcrumb.home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/funds" className="hover:text-white transition-colors">{t('breadcrumb.funds')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white/80 truncate">{fund.name_uz}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT - Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-32 h-32 rounded-[28px] flex items-center justify-center border-[3px] overflow-hidden"
              style={{
                backgroundColor: `${fund.logo_color}33`,
                borderColor: `${fund.logo_color}66`,
              }}
            >
              {fund.logo_url ? (
                <img
                  src={assetUrl(fund.logo_url)}
                  alt={fund.name_uz}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-white">{fund.logo_initials}</span>
              )}
            </div>
            {fund.is_verified && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#1E293B] shadow-lg">
                <Check className="w-4 h-4 text-white stroke-[3]" />
              </div>
            )}
          </div>

          {/* CENTER - Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
              {fund.name_uz}
            </h1>

            <div className="flex flex-wrap gap-2 mt-3">
              <GradeBadge grade={fund.indexes.grade} />
              <span className="px-3 py-1 bg-white/10 text-white/80 text-xs font-bold rounded-full uppercase tracking-wider border border-white/5">
                {getCategoryName(fund.category)}
              </span>
              {fund.region && (
                <span className="px-3 py-1 bg-white/10 text-white/80 text-xs font-bold rounded-full uppercase tracking-wider border border-white/5">
                  {t(`regions.${fund.region}`, { ns: 'common', defaultValue: fund.region })}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{t('since', { year: fund.founded_year })}</span>
              </div>
              {fund.director && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0"
                    style={{ backgroundColor: fund.logo_color }}
                  >
                    {fund.director.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white/80 font-medium">{fund.director}</span>
                </div>
              )}
              {fund.website && (
                <a
                  href={fund.website.startsWith('http') ? fund.website : `https://${fund.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{t('website')}</span>
                </a>
              )}
              {fund.telegram && (
                <a
                  href={fund.telegram.startsWith('http') ? fund.telegram : `https://${fund.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </a>
              )}
              {fund.instagram && (
                <a
                  href={fund.instagram.startsWith('http') ? fund.instagram : `https://${fund.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              )}
            </div>

            <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-xl">
              {fund.description_uz}
            </p>
          </div>

          {/* RIGHT - Overall Score */}
          <div className="shrink-0 w-full lg:w-auto">
            <div className="bg-white/10 backdrop-blur-[20px] border border-white/20 rounded-[20px] p-6 min-w-[200px] text-center shadow-2xl">
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.1em]">
                {t('overallIndex')}
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-2">
                <span className="text-5xl font-black text-white tracking-tighter">
                  {fund.indexes.overall}
                </span>
                <span className="text-lg text-white/40 font-bold">/100</span>
              </div>
              <div className="flex justify-center mt-3">
                <GradeBadge grade={fund.indexes.grade} />
              </div>
              <div className="mt-4 text-[10px] text-white/40 font-medium uppercase tracking-widest">
                {t('lastCalculated')}: {fund.indexes.calculated_at
                  ? new Date(fund.indexes.calculated_at).toLocaleDateString(i18n.language === 'en' ? 'en-GB' : 'uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })
                  : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS BAR */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
          <button
            onClick={onCompare}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
              selected
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
            )}
          >
            {selected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {selected ? t('inCompare') : t('compare')}
          </button>

          <button
            onClick={onComplaint}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            {t('complaint')}
          </button>

          <button
            onClick={onDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-primary-600 text-primary-600 rounded-xl text-sm font-bold hover:bg-primary-50 transition-all"
          >
            <FileText className="w-4 h-4" />
            {t('downloadPDF')}
          </button>

        </div>
      </div>
    </section>
  );
};
