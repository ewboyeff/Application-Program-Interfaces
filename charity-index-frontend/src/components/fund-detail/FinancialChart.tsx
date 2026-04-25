import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { reportsApi, Report } from '@/src/api/reports';
import { formatMoney, cn } from '@/src/lib/utils';

interface FinancialChartProps {
  fundId: string;
  className?: string;
}

function buildChartData(reports: Report[]) {
  // Group by year, preferring annual reports per year to avoid double-counting
  const byYear: Record<string, { annual: Report[]; other: Report[] }> = {};
  reports.forEach((r) => {
    const year = r.period_start
      ? new Date(r.period_start).getFullYear().toString()
      : r.period_end
      ? new Date(r.period_end).getFullYear().toString()
      : new Date(r.created_at).getFullYear().toString();
    if (!byYear[year]) byYear[year] = { annual: [], other: [] };
    if (r.report_type === 'annual') byYear[year].annual.push(r);
    else byYear[year].other.push(r);
  });

  return Object.entries(byYear)
    .map(([period, { annual, other }]) => {
      const source = annual.length > 0 ? annual : other;
      const income = source.reduce((s, r) => s + r.total_income, 0);
      const expense = source.reduce((s, r) => s + r.total_expense, 0);
      return {
        period,
        incomeMln: income / 1_000_000,
        expenseMln: expense / 1_000_000,
        income,
        expense,
      };
    })
    .sort((a, b) => a.period.localeCompare(b.period));
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ fundId, className }) => {
  const { t } = useTranslation('fund_detail');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#0F1E35] text-white p-4 border border-white/10 shadow-2xl rounded-2xl">
        <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">{t('chart.tooltipTitle', { year: label })}</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-bold text-white/70">{t('chart.income')}</span>
            </div>
            <span className="text-sm font-black text-white">{formatMoney(payload[0]?.payload?.income ?? 0)}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <span className="text-xs font-bold text-white/70">{t('chart.expense')}</span>
            </div>
            <span className="text-sm font-black text-white">{formatMoney(payload[1]?.payload?.expense ?? 0)}</span>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!fundId) return;
    setLoading(true);
    reportsApi.getList({ fund_id: fundId, per_page: 100 })
      .then(({ reports }) => setReports(reports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fundId]);

  const chartData = buildChartData(reports);
  const totalIncome = reports.reduce((s, r) => s + r.total_income, 0);
  const totalExpense = reports.reduce((s, r) => s + r.total_expense, 0);
  const efficiencyPct = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

  return (
    <div className={cn('rounded-[32px] overflow-hidden', className)} style={{ background: 'linear-gradient(145deg, #0D1B2E 0%, #0F2240 50%, #0A1628 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-6">
        <div>
          <h2 className="text-2xl font-black text-white">{t('chart.title')}</h2>
          <p className="text-sm text-white/40 font-medium mt-1">{t('chart.subtitle')}</p>
        </div>
        <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-cyan-400" />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-3 text-white/30">
          <Loader2 className="w-7 h-7 animate-spin" />
          <span className="text-sm">{t('chart.loading')}</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="py-20 text-center text-white/30 px-8 pb-8">
          <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">{t('chart.noFinancialData')}</p>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-8 mb-8">
            <div className="rounded-2xl p-5 text-white relative overflow-hidden group border border-cyan-500/20" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.05) 100%)' }}>
              <TrendingUp className="absolute top-4 right-4 w-10 h-10 text-cyan-400 opacity-20 group-hover:scale-110 transition-transform" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/70 mb-1">{t('chart.totalIncome')}</div>
              <div className="text-2xl font-black text-white">{formatMoney(totalIncome)}</div>
              <div className="mt-3 text-[10px] font-bold bg-cyan-500/15 w-fit px-2 py-0.5 rounded-lg text-cyan-300">
                {t('chart.basedOnReports', { count: reports.length })}
              </div>
            </div>
            <div className="rounded-2xl p-5 text-white relative overflow-hidden group border border-violet-500/20" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 100%)' }}>
              <TrendingDown className="absolute top-4 right-4 w-10 h-10 text-violet-400 opacity-20 group-hover:scale-110 transition-transform" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400/70 mb-1">{t('chart.totalExpense')}</div>
              <div className="text-2xl font-black text-white">{formatMoney(totalExpense)}</div>
              <div className="mt-3 text-[10px] font-bold bg-violet-500/15 w-fit px-2 py-0.5 rounded-lg text-violet-300">
                {t('chart.efficiency', { pct: efficiencyPct })}
              </div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="px-4 pt-2 pb-6 border-t border-white/5">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 24, left: 8, bottom: 0 }} barGap={8} barCategoryGap="40%">
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22D3EE" stopOpacity={1} />
                        <stop offset="100%" stopColor="#0891B2" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A78BFA" stopOpacity={1} />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="period"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 700 }}
                      dy={12}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700 }}
                      tickFormatter={(v) => v >= 1 ? `${v} ${t('chart.million')}` : v > 0 ? `${(v * 1000).toFixed(0)} ${t('chart.thousand')}` : '0'}
                      width={60}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 8 }} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ paddingBottom: 16, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}
                      formatter={(value) => value === 'incomeMln' ? t('chart.income') : t('chart.expense')}
                    />
                    <Bar dataKey="incomeMln" name="incomeMln" fill="url(#incomeGradient)" radius={[6, 6, 0, 0]} maxBarSize={48} isAnimationActive />
                    <Bar dataKey="expenseMln" name="expenseMln" fill="url(#expenseGradient)" radius={[6, 6, 0, 0]} maxBarSize={48} isAnimationActive />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
