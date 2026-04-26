import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Fund } from '@/src/types';
import { FundAvatar } from '@/src/components/ui/FundAvatar';
import { GradeBadge } from '@/src/components/ui/GradeBadge';
import { VerifiedBadge } from '@/src/components/ui/VerifiedBadge';
import { getScoreColor, getScoreBg, cn, assetUrl } from '@/src/lib/utils';
import { useCategoryName } from '@/src/hooks/useCategoryName';
import { useCompareStore } from '@/src/store/compareStore';
import { useToast } from '@/src/context/ToastContext';

interface FundCardProps {
  fund: Fund;
  viewMode: 'grid' | 'list';
}

export const FundCard: React.FC<FundCardProps> = ({ fund, viewMode }) => {
  const navigate = useNavigate();
  const { addFund, removeFund, isSelected } = useCompareStore();
  const { showToast } = useToast();
  const { t } = useTranslation('funds');
  const getCategoryName = useCategoryName();
  const selected = isSelected(fund.id);

  const scoreItems = [
    { label: t('transparency'), score: fund.indexes.transparency },
    { label: t('openness'), score: fund.indexes.openness },
    { label: t('trust'), score: fund.indexes.trust },
  ];

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected) {
      removeFund(fund.id);
    } else {
      const result = addFund(fund);
      showToast(result.message, result.success ? 'success' : 'warning');
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        onClick={() => navigate(`/funds/${fund.slug}`)}
        whileHover={{ y: -4 }}
        className={cn(
          "bg-white rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
          "border-[1.5px] border-[#E2E8F0] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "cursor-pointer relative overflow-visible p-4 flex items-center gap-3 sm:gap-6",
          "hover:border-[#1A56DB] hover:shadow-[0_0_0_4px_rgba(26,86,219,0.08),0_20px_40px_rgba(26,86,219,0.12),0_8px_16px_rgba(0,0,0,0.08)]",
          "hover:bg-gradient-to-b hover:from-white hover:to-[#F8FBFF]",
          "before:content-[''] before:absolute before:inset-[-1px] before:rounded-[21px]",
          "before:bg-gradient-to-br before:from-[rgba(26,86,219,0.06)] before:to-[rgba(59,130,246,0.04)]",
          "before:z-[-1] before:blur-[8px] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
        )}
      >
        <FundAvatar initials={fund.logo_initials} color={fund.logo_color} imageUrl={assetUrl(fund.logo_url)} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-extrabold text-[17px] text-[#1E293B] tracking-[-0.3px] truncate group-hover:text-[#1A56DB] transition-colors duration-300">{fund.name_uz}</h3>
            <VerifiedBadge isVerified={fund.is_verified} />
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-[11px] font-bold rounded uppercase tracking-[0.8px] max-w-[130px] truncate">
              {getCategoryName(fund.category)}
            </span>
            <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-[11px] font-bold rounded uppercase tracking-[0.8px] max-w-[130px] truncate">
              {t(`regions.${fund.region}`, { ns: 'common', defaultValue: fund.region })}
            </span>
          </div>
          <p className="text-xs text-[#64748B] line-clamp-1 font-medium">{fund.description_uz}</p>
        </div>

        <div className="hidden sm:flex items-center gap-4 sm:gap-8 px-3 sm:px-6 border-x border-[#F1F5F9]">
          <div className="text-center">
            <div className={cn('text-[32px] font-black leading-none text-[#1E293B] transition-colors duration-300 group-hover:text-[#1A56DB]')}>
              {fund.indexes.overall}
            </div>
            <div className="text-[10px] text-[#94A3B8] uppercase font-black tracking-wider">{t('score')}</div>
          </div>
          <GradeBadge grade={fund.indexes.grade} />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCompare}
            className={cn(
              'p-2 rounded-lg border transition-all',
              selected
                ? 'bg-[#1A56DB] border-[#1A56DB] text-white'
                : 'border-[#E2E8F0] text-[#94A3B8] hover:border-[#1A56DB] hover:text-[#1A56DB]'
            )}
          >
            {selected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          <button className="p-2 text-[#94A3B8] hover:text-[#1A56DB] transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      onClick={() => navigate(`/funds/${fund.slug}`)}
      whileHover={{ y: -4 }}
      className={cn(
        "group bg-white rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
        "border-[1.5px] border-[#E2E8F0] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "cursor-pointer relative overflow-visible flex flex-col",
        "hover:border-[#1A56DB] hover:shadow-[0_0_0_4px_rgba(26,86,219,0.08),0_20px_40px_rgba(26,86,219,0.12),0_8px_16px_rgba(0,0,0,0.08)]",
        "hover:bg-gradient-to-b hover:from-white hover:to-[#F8FBFF]",
        "before:content-[''] before:absolute before:inset-[-1px] before:rounded-[21px]",
        "before:bg-gradient-to-br before:from-[rgba(26,86,219,0.06)] before:to-[rgba(59,130,246,0.04)]",
        "before:z-[-1] before:blur-[8px] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
      )}
    >
      <div className="h-1.5 w-full rounded-t-[20px]" style={{ backgroundColor: fund.logo_color }} />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          <FundAvatar initials={fund.logo_initials} color={fund.logo_color} imageUrl={assetUrl(fund.logo_url)} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-[17px] text-[#1E293B] tracking-[-0.3px] truncate group-hover:text-[#1A56DB] transition-colors duration-300">
              {fund.name_uz}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <GradeBadge grade={fund.indexes.grade} className="scale-90 origin-left" />
              <VerifiedBadge isVerified={fund.is_verified} className="scale-90 origin-left" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-[11px] font-bold rounded uppercase tracking-[0.8px] max-w-[140px] truncate">
            {getCategoryName(fund.category)}
          </span>
          <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-[11px] font-bold rounded uppercase tracking-[0.8px] max-w-[140px] truncate">
            {t(`regions.${fund.region}`, { ns: 'common', defaultValue: fund.region })}
          </span>
        </div>

        <p className="text-xs text-[#64748B] line-clamp-2 mb-4 font-medium">
          {fund.description_uz}
        </p>

        <div className="mt-auto">
          <div className="bg-[#F8FAFC] rounded-xl p-3 group-hover:bg-white transition-colors duration-300 border border-[#F1F5F9]">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-[0.7px]">{t('overall')}</span>
              <span className={cn('text-[20px] font-black leading-none transition-colors duration-300 text-[#1E293B] group-hover:text-[#1A56DB]')}>
                {fund.indexes.overall}
              </span>
            </div>
            <div className="space-y-1.5">
              {scoreItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-[0.4px] w-[96px] shrink-0 truncate">{item.label}</span>
                  <div className="flex-1 h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-300 group-hover:saturate-150', getScoreBg(item.score))}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-black text-[#1E293B] w-8 text-right shrink-0">{item.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F1F5F9]">
          <button
            onClick={handleCompare}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black border transition-all',
              selected
                ? 'bg-[#1A56DB] border-[#1A56DB] text-white'
                : 'border-[#E2E8F0] text-[#64748B] hover:border-[#1A56DB] hover:text-[#1A56DB]'
            )}
          >
            {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {selected ? t('compare.added') : t('compare.add')}
          </button>
          <span className="text-[14px] font-black text-[#1A56DB] flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
            {t('viewDetails')} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-[3px] transition-transform duration-300" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};
