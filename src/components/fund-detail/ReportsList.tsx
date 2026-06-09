import React, { useEffect, useState } from 'react';
import { FileText, Download, CheckCircle, FileCheck, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { reportsApi, Report, ReportType } from '@/src/api/reports';
import { useToast } from '@/src/context/ToastContext';
import { formatMoney, cn, assetUrl } from '@/src/lib/utils';

interface ReportsListProps {
  fundId: string;
  className?: string;
}

const TYPE_STYLE: Record<ReportType, { bg: string; text: string }> = {
  annual:    { bg: 'bg-indigo-100',  text: 'text-indigo-700' },
  quarterly: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  monthly:   { bg: 'bg-slate-200',   text: 'text-slate-600' },
};

function formatPeriod(r: Report): string {
  if (r.period_start && r.period_end) return `${r.period_start} — ${r.period_end}`;
  if (r.period_start) return r.period_start;
  if (r.period_end) return r.period_end;
  return '—';
}

export const ReportsList: React.FC<ReportsListProps> = ({ fundId, className }) => {
  const { t } = useTranslation('fund_detail');
  const { showToast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!fundId) return;
    setLoading(true);
    reportsApi.getList({ fund_id: fundId, per_page: 100 })
      .then(({ reports }) => setReports(reports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fundId]);

  const visible = showAll ? reports : reports.slice(0, 4);

  return (
    <div className={cn('bg-white shadow-card rounded-[32px] p-8 border border-slate-100', className)}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{t('reports.title')}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{t('reports.subtitle')}</p>
        </div>
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
          <FileCheck className="w-6 h-6 text-slate-400" />
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin" />
          <span className="text-sm">{t('reports.loading')}</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">{t('reports.noReportsYet')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visible.map((report) => {
              const typeConf = TYPE_STYLE[report.report_type];
              return (
                <div
                  key={report.id}
                  className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-primary-100 hover:shadow-lg hover:shadow-primary-600/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-primary-600 group-hover:border-primary-100 transition-all">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={cn('px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider', typeConf.bg, typeConf.text)}>
                          {t(`reports.${report.report_type}`)}
                        </span>
                        {report.is_verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50 shrink-0" />
                        )}
                        <span className="text-[11px] text-slate-400 font-bold">{formatPeriod(report)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="text-emerald-600">↑ {formatMoney(report.total_income)}</span>
                        <span className="text-rose-500">↓ {formatMoney(report.total_expense)}</span>
                      </div>
                    </div>
                  </div>

                  {report.file_url ? (
                    <a
                      href={assetUrl(report.file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 shrink-0 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all shadow-sm"
                      title="Yuklab olish"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      onClick={() => showToast(t('reports.fileUnavailable'), 'info')}
                      className="w-10 h-10 shrink-0 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-300 cursor-not-allowed shadow-sm"
                      title="Fayl yo'q"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {reports.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all"
            >
              {showAll ? t('reports.showLess') : t('reports.showAll', { count: reports.length })}
            </button>
          )}
        </>
      )}
    </div>
  );
};
