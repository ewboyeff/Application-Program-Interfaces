import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Plus, Equal, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Fund } from '@/src/types';
import { GradeBadge } from '@/src/components/ui/GradeBadge';
import { IndexCard } from './IndexCard';
import { RadarChart } from './RadarChart';
import { cn } from '@/src/lib/utils';
import { indexesApi, FundFactorScore } from '@/src/api/indexes';

interface IndexPanelProps {
  fund: Fund;
  className?: string;
}

export const IndexPanel: React.FC<IndexPanelProps> = ({ fund, className }) => {
  const [factorScores, setFactorScores] = useState<FundFactorScore[]>([]);
  const [factorMap, setFactorMap] = useState<Record<string, { name_uz: string; name_en: string | null; name_ru: string | null }>>({});
  const [loadingScores, setLoadingScores] = useState(true);
  const { t, i18n } = useTranslation('fund_detail');

  useEffect(() => {
    indexesApi.getFactors()
      .then((grouped) => {
        const map: Record<string, { name_uz: string; name_en: string | null; name_ru: string | null }> = {};
        Object.values(grouped).flat().forEach((f) => {
          map[f.id] = { name_uz: f.name_uz, name_en: f.name_en, name_ru: f.name_ru };
        });
        setFactorMap(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!fund.id) return;
    setLoadingScores(true);
    indexesApi.getFundScores(fund.id)
      .then((data) => setFactorScores(data.factor_scores))
      .catch(() => setFactorScores([]))
      .finally(() => setLoadingScores(false));
  }, [fund.id]);

  const lang = i18n.language;

  const byType = (type: 'transparency' | 'openness' | 'trust') =>
    factorScores
      .filter((f) => f.index_type === type)
      .map((f) => {
        const meta = factorMap[f.factor_id];
        const apiName = (lang === 'en' && meta?.name_en)
          ? meta.name_en
          : (lang === 'ru' && meta?.name_ru)
          ? meta.name_ru
          : null;
        const name = apiName || t(`factorNames.${f.factor_name_uz}`, { defaultValue: f.factor_name_uz });
        return { name, weight: Number(f.weight), score: Number(f.score) };
      });

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{t('indexMetrics')}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{t('weeklyUpdate')}</p>
        </div>
        {fund.indexes?.calculated_at && (
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <span>{t('lastCalculated')}: {new Date(fund.indexes.calculated_at).toLocaleDateString(i18n.language === 'en' ? 'en-GB' : 'uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            <RefreshCw className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* OVERALL SCORE BANNER */}
      <div className="bg-gradient-to-br from-[#1A56DB] to-[#0EA5E9] rounded-[32px] p-5 sm:p-8 md:p-10 flex flex-col lg:flex-row items-center gap-6 mb-8 shadow-xl shadow-blue-600/20 overflow-hidden">
        <div className="flex-1 min-w-0 text-center lg:text-left">
          <span className="text-white/80 text-xs font-bold uppercase tracking-[0.2em]">
            {t('overallScore')}
          </span>
          <div className="flex items-baseline justify-center lg:justify-start gap-2 mt-2">
            <span className="text-7xl font-black text-white tracking-tighter">
              {fund.indexes.overall}
            </span>
            <span className="text-3xl text-white/60 font-bold">/100</span>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-3 mt-4">
            <GradeBadge grade={fund.indexes.grade} />
            <span className="text-white/70 text-sm font-medium">
              {t(`gradeLabels.${fund.indexes.grade}`, { defaultValue: fund.indexes.grade })}
            </span>
          </div>
        </div>

        {/* Formula Display */}
        <div className="w-full lg:flex-1 overflow-x-auto">
          <div className="flex items-center justify-center gap-1 md:gap-2 min-w-max mx-auto">
            {[
              { labelKey: 'transparency', weight: '40%', score: fund.indexes.transparency },
              { labelKey: 'openness', weight: '30%', score: fund.indexes.openness },
              { labelKey: 'trust', weight: '30%', score: fund.indexes.trust },
            ].map((item, idx) => (
              <React.Fragment key={item.labelKey}>
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2 md:p-3 text-center w-[68px] sm:w-[76px] md:w-[88px] border border-white/10">
                  <div className="text-white/70 text-[7px] sm:text-[8px] font-bold uppercase tracking-wide mb-1 truncate">{t(item.labelKey)}</div>
                  <div className="text-white/40 text-[7px] sm:text-[8px] font-medium mb-1.5">×{item.weight}</div>
                  <div className="text-white font-black text-base sm:text-lg md:text-xl">{item.score}</div>
                </div>
                {idx < 2 && <Plus className="w-3 h-3 text-white/40 shrink-0" />}
              </React.Fragment>
            ))}
            <Equal className="w-3 h-3 text-white/40 shrink-0" />
            <div className="bg-white/25 backdrop-blur-md rounded-2xl p-2 md:p-3 text-center w-[68px] sm:w-[76px] md:w-[88px] border-2 border-white/40">
              <div className="text-white font-black text-lg sm:text-xl md:text-2xl">{fund.indexes.overall}</div>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="shrink-0 hidden 2xl:block">
          <RadarChart fund={fund} size={200} dark />
        </div>
      </div>

      {loadingScores ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <IndexCard
            title={t('transparency')}
            score={fund.indexes.transparency}
            factors={byType('transparency')}
            type="transparency"
          />
          <IndexCard
            title={t('openness')}
            score={fund.indexes.openness}
            factors={byType('openness')}
            type="openness"
          />
          <IndexCard
            title={t('trust')}
            score={fund.indexes.trust}
            factors={byType('trust')}
            type="trust"
          />
        </div>
      )}
    </div>
  );
};
