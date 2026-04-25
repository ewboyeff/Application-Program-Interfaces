import React from 'react';
import { X, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Fund } from '@/src/types';
import { FundAvatar } from '@/src/components/ui/FundAvatar';
import { GradeBadge } from '@/src/components/ui/GradeBadge';
import { useCompareStore } from '@/src/store/compareStore';
import { formatMoney, formatNumber, assetUrl } from '@/src/lib/utils';

interface CompareTableProps {
  funds: Fund[];
}

function resolveLogoUrl(url?: string | null): string | undefined {
  return assetUrl(url);
}

const COLORS = [
  {
    header: 'bg-blue-600',
    colBg: 'bg-blue-50',
    bestBg: 'bg-blue-100',
    bar: 'bg-blue-500',
    text: 'text-blue-700',
    border: 'border-blue-300',
    topBorder: 'border-t-blue-500',
  },
  {
    header: 'bg-emerald-600',
    colBg: 'bg-emerald-50',
    bestBg: 'bg-emerald-100',
    bar: 'bg-emerald-500',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    topBorder: 'border-t-emerald-500',
  },
  {
    header: 'bg-amber-500',
    colBg: 'bg-amber-50',
    bestBg: 'bg-amber-100',
    bar: 'bg-amber-500',
    text: 'text-amber-700',
    border: 'border-amber-300',
    topBorder: 'border-t-amber-500',
  },
];

export const CompareTable: React.FC<CompareTableProps> = ({ funds }) => {
  const { removeFund } = useCompareStore();
  const { t } = useTranslation('compare');

  const getMaxValue = (path: string): number => {
    const values = funds.map((f) => {
      const parts = path.split('.');
      let val: any = f;
      parts.forEach((p) => (val = val?.[p]));
      return Number(val) || 0;
    });
    return Math.max(...values);
  };

  const isBest = (value: number, path: string): boolean => {
    if (funds.length < 2) return false;
    const max = getMaxValue(path);
    return max > 0 && value === max;
  };

  const bestFundIdx =
    funds.length >= 2
      ? funds.reduce((bestIdx, fund, idx) =>
          fund.indexes.overall > funds[bestIdx].indexes.overall ? idx : bestIdx
        , 0)
      : -1;

  const getValue = (fund: Fund, path: string): any => {
    const parts = path.split('.');
    let val: any = fund;
    parts.forEach((p) => (val = val?.[p]));
    return val;
  };

  const SectionHeader = ({ label }: { label: string }) => (
    <tr>
      <td
        colSpan={funds.length + 1}
        className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 border-y border-slate-200"
      >
        {label}
      </td>
    </tr>
  );

  const ScoreRow = ({ label, path }: { label: string; path: string }) => (
    <tr className="border-b border-slate-100">
      <td className="sticky left-0 z-10 py-4 px-5 text-sm font-semibold text-slate-700 bg-white min-w-[160px] border-r border-slate-200">
        {label}
      </td>
      {funds.map((fund, i) => {
        const score = Number(getValue(fund, path)) || 0;
        const best = isBest(score, path);
        const c = COLORS[i];
        return (
          <td
            key={fund.id}
            className={`py-4 px-6 text-center min-w-[200px] ${c.colBg} border-r border-slate-100`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5">
                {best && <Trophy className="w-3.5 h-3.5 text-yellow-500" />}
                <span className={`text-lg font-black ${best ? c.text : 'text-slate-800'}`}>
                  {score}
                </span>
              </div>
              <div className="w-20 h-2 bg-white/70 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full ${c.bar} rounded-full transition-all`}
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
              </div>
            </div>
          </td>
        );
      })}
    </tr>
  );

  const DataRow = ({
    label,
    path,
    formatter = (v: any) => (v !== null && v !== undefined && v !== '' ? v : '—'),
  }: {
    label: string;
    path: string;
    formatter?: (v: any) => any;
  }) => (
    <tr className="border-b border-slate-100">
      <td className="sticky left-0 z-10 py-3.5 px-5 text-sm font-semibold text-slate-700 bg-white min-w-[160px] border-r border-slate-200">
        {label}
      </td>
      {funds.map((fund, i) => {
        const value = getValue(fund, path);
        const c = COLORS[i];
        return (
          <td
            key={fund.id}
            className={`py-3.5 px-6 text-center text-sm font-medium text-slate-700 min-w-[200px] ${c.colBg} border-r border-slate-100`}
          >
            {formatter(value)}
          </td>
        );
      })}
    </tr>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-slate-50 min-w-[160px] border-r border-slate-200 border-b border-slate-200" />
              {funds.map((fund, i) => {
                const c = COLORS[i];
                const isTop = i === bestFundIdx;
                return (
                  <th
                    key={fund.id}
                    className={`min-w-[200px] p-0 border-r border-slate-200 relative`}
                  >
                    {/* Colored top strip */}
                    <div className={`${c.header} h-1.5 w-full`} />
                    <div className={`${c.colBg} px-6 py-5 relative`}>
                      <button
                        onClick={() => removeFund(fund.id)}
                        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex flex-col items-center gap-2.5">
                        <FundAvatar
                          initials={fund.logo_initials}
                          color={fund.logo_color}
                          size="md"
                          imageUrl={resolveLogoUrl(fund.logo_url)}
                          className={`ring-2 ring-white shadow-md`}
                        />
                        <div className={`text-sm font-bold text-slate-800 truncate max-w-[140px] text-center`}>
                          {fund.name_uz}
                        </div>
                        <GradeBadge grade={fund.indexes.grade} />
                        <div className="h-[26px] flex items-center justify-center">
                          {isTop && funds.length >= 2 && (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${c.colBg} border ${c.border} ${c.text} text-[11px] font-bold rounded-full`}>
                              <Trophy className="w-3 h-3 text-yellow-500" />
                              {t('best')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <SectionHeader label={t('indexMetrics')} />
            <ScoreRow label={t('totalScore')} path="indexes.overall" />
            <ScoreRow label={t('transparency')} path="indexes.transparency" />
            <ScoreRow label={t('openness')} path="indexes.openness" />
            <ScoreRow label={t('trust')} path="indexes.trust" />

            {/* Grade row */}
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 z-10 py-3.5 px-5 text-sm font-semibold text-slate-700 bg-white min-w-[160px] border-r border-slate-200">
                {t('grade')}
              </td>
              {funds.map((fund, i) => {
                const c = COLORS[i];
                return (
                  <td
                    key={fund.id}
                    className={`py-3.5 px-6 text-center min-w-[200px] ${c.colBg} border-r border-slate-100`}
                  >
                    <div className="flex justify-center">
                      <GradeBadge grade={fund.indexes.grade} />
                    </div>
                  </td>
                );
              })}
            </tr>

            <SectionHeader label={t('generalInfo')} />

            {/* Verified row */}
            <tr className="border-b border-slate-100">
              <td className="sticky left-0 z-10 py-3.5 px-5 text-sm font-semibold text-slate-700 bg-white min-w-[160px] border-r border-slate-200">
                {t('verified')}
              </td>
              {funds.map((fund, i) => {
                const c = COLORS[i];
                return (
                  <td
                    key={fund.id}
                    className={`py-3.5 px-6 text-center min-w-[200px] ${c.colBg} border-r border-slate-100`}
                  >
                    <div className="flex justify-center">
                      {fund.is_verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                          ✓ {t('yes')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200 text-slate-500 text-xs font-bold rounded-full">
                          — {t('no')}
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            <DataRow label={t('category')} path="category" />
            <DataRow label={t('region')} path="region" />
            <DataRow label={t('foundedYear')} path="founded_year" formatter={(v) => v || '—'} />
            <DataRow
              label={t('activityPeriod')}
              path="founded_year"
              formatter={(v) => (v && v > 0 ? `${new Date().getFullYear() - v} ${t('year')}` : '—')}
            />

            <SectionHeader label={t('statistics')} />
            <DataRow label={t('projects')} path="projects_count" formatter={(v) => v ?? '—'} />
            <DataRow label={t('beneficiaries')} path="beneficiaries" formatter={(v) => (v ? formatNumber(v) : '—')} />
            <DataRow label={t('totalIncome')} path="total_income" formatter={(v) => (v ? formatMoney(v) : '0 UZS')} />
            <DataRow label={t('totalSpent')} path="total_spent" formatter={(v) => (v ? formatMoney(v) : '0 UZS')} />
          </tbody>
        </table>
      </div>
    </div>
  );
};
