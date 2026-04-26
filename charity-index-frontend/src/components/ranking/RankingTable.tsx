import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, ChevronsUpDown, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Fund } from '@/src/types';
import { FundAvatar } from '@/src/components/ui/FundAvatar';
import { GradeBadge } from '@/src/components/ui/GradeBadge';
import { VerifiedBadge } from '@/src/components/ui/VerifiedBadge';
import { getScoreColor, getScoreBg, cn } from '@/src/lib/utils';
import { useToast } from '@/src/context/ToastContext';
import { useCategoryName } from '@/src/hooks/useCategoryName';

type SortConfig = {
  key: keyof Fund['indexes'] | 'name_uz';
  direction: 'asc' | 'desc';
};

interface RankingTableProps {
  funds: Fund[];
  sortConfig: SortConfig;
  onSort: (key: SortConfig['key']) => void;
  rankOffset?: number;
}

export const RankingTable: React.FC<RankingTableProps> = ({ funds, sortConfig, onSort, rankOffset = 0 }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation('ranking');
  const getCategoryName = useCategoryName();

  const SortIcon = ({ columnKey }: { columnKey: SortConfig['key'] }) => {
    if (sortConfig.key !== columnKey) return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  const ScoreCell = ({ score }: { score: number }) => {
    const dotColor = score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500';
    const textColor = score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-rose-600';

    return (
      <div className="flex items-center justify-center gap-2">
        <div className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
        <span className={cn('font-bold text-sm', textColor)}>{score}</span>
      </div>
    );
  };

  const handleDonate = (fund: Fund) => {
    const url = fund.donation_url || fund.website;
    if (url) {
      const full = url.startsWith('http') ? url : `https://${url}`;
      window.open(full, '_blank', 'noopener,noreferrer');
    } else {
      showToast(`${fund.name_uz} fondining xayriya havolasi mavjud emas`, 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse min-w-[480px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="w-20 py-5 px-4 text-center text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('table.rank')}</th>
              <th className="py-5 px-4 text-left text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('table.fund')}</th>
              <th className="hidden md:table-cell py-5 px-4 text-left text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('table.category')}</th>
              <th className="hidden sm:table-cell w-28 py-5 px-4 text-center text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onSort('transparency')}>
                  {t('table.transparency')} <SortIcon columnKey="transparency" />
                </div>
              </th>
              <th className="hidden sm:table-cell w-28 py-5 px-4 text-center text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onSort('openness')}>
                  {t('table.openness')} <SortIcon columnKey="openness" />
                </div>
              </th>
              <th className="hidden sm:table-cell w-28 py-5 px-4 text-center text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onSort('trust')}>
                  {t('table.trust')} <SortIcon columnKey="trust" />
                </div>
              </th>
              <th className="w-28 py-5 px-4 text-center text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onSort('overall')}>
                  {t('table.overall')} <SortIcon columnKey="overall" />
                </div>
              </th>
              <th className="w-28 py-5 px-4 text-center text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('table.grade')}</th>
              <th className="w-36 py-5 px-4 text-right text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {funds.map((fund, index) => {
              const rank = rankOffset + index + 1;
              const overallScore = fund.indexes.overall;

              return (
                <motion.tr
                  key={fund.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/funds/${fund.slug}`)}
                  className="group hover:bg-slate-50/50 transition-all duration-200 cursor-pointer"
                >
                  <td className="py-5 px-4 text-center">
                    <div className="flex items-center justify-center">
                      {rank === 1 ? (
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100 text-base">🥇</div>
                      ) : rank === 2 ? (
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 text-base">🥈</div>
                      ) : rank === 3 ? (
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 text-base">🥉</div>
                      ) : (
                        <span className="text-sm font-bold text-slate-400">{rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <FundAvatar initials={fund.logo_initials} color={fund.logo_color} size="sm" className="shadow-sm" />
                        {fund.is_verified && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                            <VerifiedBadge isVerified={true} showText={false} className="scale-75" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-slate-900 tracking-tight truncate group-hover:text-blue-600 transition-colors">
                          {fund.name_uz}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium md:hidden">{getCategoryName(fund.category)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-5 px-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                      {getCategoryName(fund.category)}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell py-5 px-4 text-center">
                    <ScoreCell score={fund.indexes.transparency} />
                  </td>
                  <td className="hidden sm:table-cell py-5 px-4 text-center">
                    <ScoreCell score={fund.indexes.openness} />
                  </td>
                  <td className="hidden sm:table-cell py-5 px-4 text-center">
                    <ScoreCell score={fund.indexes.trust} />
                  </td>
                  <td className="py-5 px-4 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {overallScore}
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <GradeBadge grade={fund.indexes.grade} className="scale-90" />
                  </td>
                  <td className="py-5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDonate(fund);
                      }}
                      className="inline-flex items-center justify-center px-[10px] py-[4px] bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded-[8px] text-[11px] font-semibold hover:bg-[#059669] hover:text-white hover:border-[#059669] transition-all duration-150 whitespace-nowrap cursor-pointer"
                    >
                      ❤️ {t('donate')}
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
