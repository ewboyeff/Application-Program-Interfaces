import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/src/components/layout/Layout';
import {
  FileText, BarChart3, TrendingUp, Globe, ChevronRight, X, Download, Newspaper,
} from 'lucide-react';
import { motion } from 'motion/react';
import { researchApi, ResearchStats, DEFAULT_RESEARCH_STATS } from '@/src/api/research';
import { indexesApi, FactorsGrouped } from '@/src/api/indexes';
import { newsApi } from '@/src/api/news';
import { News } from '@/src/types';
import { assetUrl, API_BASE } from '@/src/lib/utils';
import { useDataStore } from '@/src/store/useDataStore';

const resolveMediaUrl = (url: string) =>
  url.startsWith('http') ? url : `${API_BASE}${url}`;

type Factor = { name: string; weight: string };

const SCORE_LEVEL_STYLES = [
  { label: '👑 Platinum', bg: '#F5F3FF', color: '#7C3AED' },
  { label: '🥇 Gold',     bg: '#FFFBEB', color: '#B45309' },
  { label: '🥈 Silver',   bg: '#F8FAFC', color: '#475569' },
  { label: '🥉 Bronze',   bg: '#FFF7ED', color: '#92400E' },
  { label: '⚠️ Unrated',  bg: '#F8FAFC', color: '#94A3B8' },
];

const weightPct = (w: number) => w <= 1 ? `${Math.round(w * 100)}%` : `${Math.round(w)}%`;

const FactorSection = ({ title, color, factors }: { title: string; color: string; factors: Factor[] }) => (
  <section>
    <h3 className="mb-3 text-[16px] font-bold" style={{ color }}>{title}</h3>
    <div>
      {factors.map((f) => (
        <div key={f.name} className="flex items-center justify-between border-b border-[#F1F5F9] py-[10px]">
          <span className="text-[14px] text-[#1E293B]">{f.name}</span>
          <span className="rounded-full px-[10px] py-[2px] text-[12px] font-bold" style={{ backgroundColor: '#EFF6FF', color }}>
            {f.weight}
          </span>
        </div>
      ))}
    </div>
  </section>
);

function BaseDialog({
  open, onOpenChange, title, subtitle, headerBg, headerBorder, children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle: string;
  headerBg: string;
  headerBorder: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation('tadqiqot');
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] flex max-h-[85vh] w-[calc(100vw-2rem)] max-w-[700px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl outline-none">
          <div className={`border-b px-6 py-5 flex items-start justify-between ${headerBg} ${headerBorder}`}>
            <div>
              <Dialog.Title className="text-[20px] font-extrabold text-[#1E293B]">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-[13px] text-[#64748B]">{subtitle}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 rounded-xl hover:bg-black/10 transition-colors ml-4 shrink-0">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">{children}</div>
          <div className="border-t border-[#E2E8F0] px-6 py-4 text-right">
            <Dialog.Close asChild>
              <button className="rounded-[10px] bg-[#1A56DB] px-6 py-2.5 font-semibold text-white hover:bg-[#1D4ED8] transition-colors">
                {t('close')}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function StatCard({ value, label, color = '#1A56DB' }: { value: string; label: string; color?: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 text-center">
      <div className="text-3xl font-black mb-1" style={{ color }}>{value}</div>
      <div className="text-xs font-semibold text-slate-500">{label}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[15px] font-bold text-[#1E293B] mb-3">{children}</h3>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
  );
}

// ── Dialog 1: Annual Report ───────────────────────────────────────────────────
const ReportDialog = ({
  open, onOpenChange, stats,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  stats: ResearchStats;
}) => {
  const { t } = useTranslation('tadqiqot');
  const areas        = t('report.areas',       { returnObjects: true }) as string[];
  const findingsRows = t('report.findingsRows', { returnObjects: true }) as Array<{ label: string; value: string }>;
  const areaColors   = ['#1A56DB', '#059669', '#7C3AED', '#F59E0B'];

  return (
    <BaseDialog
      open={open} onOpenChange={onOpenChange}
      title={t('report.title')}
      subtitle={t('report.subtitle')}
      headerBg="bg-blue-50" headerBorder="border-blue-100"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard value={stats.report.statActive}        label={t('report.statActive')}        />
        <StatCard value={stats.report.statBeneficiaries} label={t('report.statBeneficiaries')} color="#059669" />
        <StatCard value={stats.report.statRaised}        label={t('report.statRaised')}        color="#7C3AED" />
        <StatCard value={stats.report.statTransparency}  label={t('report.statTransparency')}  color="#B45309" />
      </div>

      <div>
        <SectionTitle>{t('report.distributionTitle')}</SectionTitle>
        <div className="space-y-2">
          {areas.map((label, i) => (
            <div key={label}>
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span>{label}</span>
                <span className="font-bold" style={{ color: areaColors[i] }}>{stats.report.areaPcts[i]}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${stats.report.areaPcts[i]}%`, background: areaColors[i] }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>{t('report.findingsTitle')}</SectionTitle>
        <div className="space-y-0 rounded-2xl border border-slate-100 overflow-hidden bg-white px-4">
          {findingsRows.map((row, i) => (
            <InfoRow key={row.label} label={row.label} value={stats.report.findingsValues[i] ?? row.value} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
        <span className="font-bold">{t('report.notePrefix')}</span> {t('report.noteText')}
      </div>
    </BaseDialog>
  );
};

// ── Dialog 2: Methodology ────────────────────────────────────────────────────
const MethodologyDialog = ({
  open, onOpenChange, factors,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  factors: FactorsGrouped | null;
}) => {
  const { t } = useTranslation('tadqiqot');
  const scoreRanges = t('methodology.scoreRanges', { returnObjects: true }) as string[];

  const tFallback = t('methodology.factors.transparency', { returnObjects: true }) as string[];
  const oFallback = t('methodology.factors.openness',     { returnObjects: true }) as string[];
  const trFallback = t('methodology.factors.trust',       { returnObjects: true }) as string[];

  const transparencyFactors: Factor[] = factors
    ? factors.transparency.map(f => ({ name: f.name_uz, weight: weightPct(f.weight) }))
    : tFallback.map((name, i) => ({ name, weight: ['25%', '20%', '20%', '20%', '15%'][i] ?? '20%' }));

  const opennessFactors: Factor[] = factors
    ? factors.openness.map(f => ({ name: f.name_uz, weight: weightPct(f.weight) }))
    : oFallback.map((name, i) => ({ name, weight: ['20%', '20%', '15%', '20%', '25%'][i] ?? '20%' }));

  const trustFactors: Factor[] = factors
    ? factors.trust.map(f => ({ name: f.name_uz, weight: weightPct(f.weight) }))
    : trFallback.map((name, i) => ({ name, weight: ['25%', '20%', '20%', '20%', '15%'][i] ?? '20%' }));

  return (
    <BaseDialog
      open={open} onOpenChange={onOpenChange}
      title={t('methodology.title')}
      subtitle={t('methodology.subtitle')}
      headerBg="bg-blue-50" headerBorder="border-blue-100"
    >
      <section>
        <SectionTitle>{t('methodology.formulaTitle')}</SectionTitle>
        <div className="rounded-[16px] bg-[#1E293B] px-6 py-6 text-center">
          <div className="font-mono text-[15px] leading-8 text-white">
            <div>{t('methodology.formulaLine1')}</div>
            <div>{t('methodology.formulaLine2')}</div>
            <div>{t('methodology.formulaLine3')}</div>
          </div>
          <div className="mt-3 text-[13px] text-white/60">(95×0.40) + (88×0.30) + (90×0.30) = 91.4 ≈ 92</div>
        </div>
      </section>

      <section>
        <SectionTitle>{t('methodology.scoreLevelsTitle')}</SectionTitle>
        <div>
          {SCORE_LEVEL_STYLES.map((item, i) => (
            <div key={item.label} className="mb-2 flex items-center gap-3 rounded-[10px] px-4 py-[10px]" style={{ background: item.bg }}>
              <span className="text-[14px] font-bold" style={{ color: item.color }}>{item.label}</span>
              <span className="ml-auto text-[14px]" style={{ color: item.color }}>{scoreRanges[i]}</span>
            </div>
          ))}
        </div>
      </section>

      <FactorSection title={t('methodology.transparencyTitle')} color="#1A56DB" factors={transparencyFactors} />
      <FactorSection title={t('methodology.opennessTitle')}     color="#059669" factors={opennessFactors} />
      <FactorSection title={t('methodology.trustTitle')}        color="#7C3AED" factors={trustFactors} />
    </BaseDialog>
  );
};

// ── Dialog 3: Trends 2023-2024 ───────────────────────────────────────────────
const AnalysisDialog = ({
  open, onOpenChange, stats,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  stats: ResearchStats;
}) => {
  const { t } = useTranslation('tadqiqot');
  const avgRows    = t('analysis.avgRows',    { returnObjects: true }) as Array<{ label: string; value: string }>;
  const growing    = t('analysis.growing',    { returnObjects: true }) as string[];
  const challenges = t('analysis.challenges', { returnObjects: true }) as string[];
  const growingColors  = ['#059669', '#1A56DB', '#7C3AED', '#F59E0B'];

  return (
    <BaseDialog
      open={open} onOpenChange={onOpenChange}
      title={t('analysis.title')}
      subtitle={t('analysis.subtitle')}
      headerBg="bg-emerald-50" headerBorder="border-emerald-100"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard value={stats.analysis.statNewFunds}      label={t('analysis.statNewFunds')}      color="#059669" />
        <StatCard value={stats.analysis.statOnlineReports} label={t('analysis.statOnlineReports')} color="#1A56DB" />
        <StatCard value={stats.analysis.statUserRatings}   label={t('analysis.statUserRatings')}   color="#7C3AED" />
      </div>

      <div>
        <SectionTitle>{t('analysis.avgTitle')}</SectionTitle>
        <div className="space-y-0 rounded-2xl border border-slate-100 bg-white overflow-hidden px-4">
          {avgRows.map((row, i) => (
            <InfoRow key={row.label} label={row.label} value={stats.analysis.avgValues[i] ?? row.value} />
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>{t('analysis.growingTitle')}</SectionTitle>
        <div className="space-y-2">
          {growing.map((label, i) => (
            <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
              <span className="text-sm text-slate-700">{label}</span>
              <span className="text-sm font-black" style={{ color: growingColors[i] }}>{stats.analysis.growingChanges[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>{t('analysis.challengesTitle')}</SectionTitle>
        <div className="space-y-2">
          {challenges.map((item, i) => (
            <div key={i} className="flex gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <span className="text-red-400 font-bold shrink-0">•</span>
              <span className="text-sm text-red-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </BaseDialog>
  );
};

// ── Dialog 4: International Comparison ───────────────────────────────────────
const ComparisonDialog = ({
  open, onOpenChange, stats,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  stats: ResearchStats;
}) => {
  const { t } = useTranslation('tadqiqot');
  const countries       = t('comparison.countries',       { returnObjects: true }) as string[];
  const globalRows      = t('comparison.globalRows',      { returnObjects: true }) as Array<{ label: string; value: string }>;
  const recommendations = t('comparison.recommendations', { returnObjects: true }) as Array<{ text: string; priority: string }>;
  const highLabel       = t('comparison.high');
  const countryColors   = ['#F59E0B', '#059669', '#1A56DB', '#94A3B8', '#94A3B8'];

  return (
    <BaseDialog
      open={open} onOpenChange={onOpenChange}
      title={t('comparison.title')}
      subtitle={t('comparison.subtitle')}
      headerBg="bg-violet-50" headerBorder="border-violet-100"
    >
      <div>
        <SectionTitle>{t('comparison.regionalTitle')}</SectionTitle>
        <div className="space-y-2">
          {countries.map((country, i) => (
            <div key={country}>
              <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                <span>{country}</span>
                <span className="font-bold" style={{ color: countryColors[i] }}>{stats.comparison.countryScores[i]}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${stats.comparison.countryScores[i]}%`, background: countryColors[i] }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>{t('comparison.globalTitle')}</SectionTitle>
        <div className="space-y-0 rounded-2xl border border-slate-100 bg-white overflow-hidden px-4">
          {globalRows.map((row, i) => (
            <InfoRow key={row.label} label={row.label} value={stats.comparison.globalValues[i] ?? row.value} />
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>{t('comparison.recommendationsTitle')}</SectionTitle>
        <div className="space-y-2">
          {recommendations.map(({ text, priority }) => (
            <div key={text} className="flex items-start gap-3 rounded-xl bg-violet-50 border border-violet-100 px-4 py-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${priority === highLabel ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                {priority}
              </span>
              <span className="text-sm text-slate-700">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </BaseDialog>
  );
};

// ── Dialog 5: Hisobot Choice ─────────────────────────────────────────────────
const HisobotChoiceDialog = ({
  open, onOpenChange, annualUrl, halfYearUrl, onFallback,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  annualUrl?: string;
  halfYearUrl?: string;
  onFallback: () => void;
}) => {
  const { t } = useTranslation('tadqiqot');

  const handleDownload = (url?: string) => {
    if (url) {
      const a = document.createElement('a');
      a.href = url.startsWith('http') ? url : `${API_BASE}${url}`;
      a.download = '';
      a.target = '_blank';
      a.click();
    } else {
      onFallback();
    }
    onOpenChange(false);
  };

  return (
    <BaseDialog
      open={open} onOpenChange={onOpenChange}
      title={t('reportSection.title')}
      subtitle={t('reportSection.chooseSubtitle')}
      headerBg="bg-rose-50" headerBorder="border-rose-100"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => handleDownload(annualUrl)}
          className="flex flex-col items-start gap-3 p-5 rounded-2xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:border-rose-400 transition-all text-left"
        >
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Download className="w-6 h-6 text-rose-600" />
          </div>
          <div className="flex-1">
            <div className="font-black text-slate-800 text-[15px]">{t('reportSection.annual')}</div>
            <div className="text-xs text-slate-500 mt-1 leading-relaxed">{t('reportSection.annualDesc')}</div>
          </div>
          <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> {t('reportSection.download')}
          </span>
        </button>

        <button
          onClick={() => handleDownload(halfYearUrl)}
          className="flex flex-col items-start gap-3 p-5 rounded-2xl border-2 border-cyan-200 bg-cyan-50 hover:bg-cyan-100 hover:border-cyan-400 transition-all text-left"
        >
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Download className="w-6 h-6 text-cyan-600" />
          </div>
          <div className="flex-1">
            <div className="font-black text-slate-800 text-[15px]">{t('reportSection.halfYear')}</div>
            <div className="text-xs text-slate-500 mt-1 leading-relaxed">{t('reportSection.halfYearDesc')}</div>
          </div>
          <span className="text-xs font-bold text-cyan-600 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> {t('reportSection.download')}
          </span>
        </button>
      </div>
    </BaseDialog>
  );
};

// ── Dialog 6: Maqolalar ───────────────────────────────────────────────────────
const MaqolalarDialog = ({
  open, onOpenChange, articles,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  articles: News[];
}) => {
  const { t } = useTranslation('tadqiqot');
  return (
    <BaseDialog
      open={open} onOpenChange={onOpenChange}
      title={t('articlesSection.title')}
      subtitle={t('articlesSection.subtitle')}
      headerBg="bg-amber-50" headerBorder="border-amber-100"
    >
      {articles.length === 0 ? (
        <div className="py-12 text-center">
          <Newspaper className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">{t('articlesSection.empty')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map(article => {
            const fileUrl = article.source_url || article.file_url;
            return (
              <div key={article.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-all">
                <div className="flex-1 min-w-0">
                  {article.category && (
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{article.category}</div>
                  )}
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">
                    {article.title_uz ?? article.title}
                  </h4>
                  {article.excerpt && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                  )}
                </div>
                {fileUrl && (
                  <a
                    href={resolveMediaUrl(fileUrl)}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {t('articlesSection.download')}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </BaseDialog>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const Tadqiqot = () => {
  const { t } = useTranslation('tadqiqot');
  const { funds } = useDataStore();
  const [openDialog, setOpenDialog] = useState<'report' | 'methodology' | 'analysis' | 'comparison' | 'hisobot' | 'maqolalar' | null>(null);
  const [researchStats, setResearchStats] = useState<ResearchStats>(DEFAULT_RESEARCH_STATS);
  const [factors, setFactors] = useState<FactorsGrouped | null>(null);
  const [articles, setArticles] = useState<News[]>([]);

  useEffect(() => {
    researchApi.get().then(setResearchStats).catch(() => {});
    indexesApi.getFactors().then(setFactors).catch(() => {});
    newsApi.getList({ per_page: 6 }).then(({ news }) => setArticles(news)).catch(() => {});
  }, []);

  const handleDownloadReport = () => {
    const w = window.open('', '_blank');
    if (!w) return;

    const sorted = [...funds].sort((a, b) => b.indexes.overall - a.indexes.overall);
    const top20 = sorted.slice(0, 20);
    const gradeLabel: Record<string, string> = {
      platinum: '👑 Platinum', gold: '🥇 Gold', silver: '🥈 Silver', bronze: '🥉 Bronze', unrated: '—',
    };
    const fundRows = top20.map((f, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${f.name_uz}</td>
        <td>${f.category ?? '—'}</td>
        <td>${f.indexes.overall}</td>
        <td>${gradeLabel[f.indexes.grade] ?? '—'}</td>
        <td>${f.indexes.transparency}</td>
        <td>${f.indexes.openness}</td>
        <td>${f.indexes.trust}</td>
      </tr>`).join('');

    w.document.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>Xayriya Hisoboti 2026 — Charity Index</title>
<style>
  body{font-family:'Segoe UI',sans-serif;padding:40px;max-width:960px;margin:0 auto;color:#1e293b}
  h1{color:#1A56DB;font-size:28px;margin-bottom:4px}
  h2{color:#334155;font-size:18px;margin-top:36px;margin-bottom:12px;border-bottom:2px solid #e2e8f0;padding-bottom:8px}
  .meta{color:#64748b;font-size:14px;margin-bottom:32px}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
  .stat{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;text-align:center}
  .stat-value{font-size:24px;font-weight:900;color:#1A56DB}
  .stat-label{font-size:12px;color:#64748b;margin-top:4px}
  table{width:100%;border-collapse:collapse;margin-top:12px;font-size:13px}
  th{background:#1A56DB;color:white;padding:10px 12px;text-align:left}
  td{border-bottom:1px solid #f1f5f9;padding:9px 12px}
  tr:hover td{background:#f8fafc}
  .footer{margin-top:40px;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px}
  @media print{button{display:none}}
</style>
</head><body>
<h1>O'zbekistonda Xayriya Holati 2026</h1>
<p class="meta">Charity Index platformasi — Mustaqil baholash hisoboti &nbsp;|&nbsp; Sana: ${new Date().toLocaleDateString('uz-UZ')}</p>

<div class="stats">
  <div class="stat"><div class="stat-value">${researchStats.report.statActive}</div><div class="stat-label">Faol xayriya fondlari</div></div>
  <div class="stat"><div class="stat-value">${researchStats.report.statBeneficiaries}</div><div class="stat-label">Foyda ko'ruvchilar</div></div>
  <div class="stat"><div class="stat-value">${researchStats.report.statRaised}</div><div class="stat-label">Jami yig'ilgan mablag'</div></div>
  <div class="stat"><div class="stat-value">${researchStats.report.statTransparency}</div><div class="stat-label">O'rtacha shaffoflik</div></div>
</div>

<h2>Asosiy xulosalar</h2>
<table><thead><tr><th>Ko'rsatkich</th><th>Qiymat</th></tr></thead><tbody>
  <tr><td>Reytingdagi fondlar soni</td><td>${researchStats.report.findingsValues[0] ?? funds.length + ' ta'}</td></tr>
  <tr><td>Platinum darajasidagi fondlar</td><td>${researchStats.report.findingsValues[1] ?? funds.filter(f=>f.indexes.grade==='platinum').length + ' ta'}</td></tr>
  <tr><td>Gold darajasidagi fondlar</td><td>${researchStats.report.findingsValues[2] ?? funds.filter(f=>f.indexes.grade==='gold').length + ' ta'}</td></tr>
  <tr><td>O'rtacha indeks ball</td><td>${researchStats.report.findingsValues[3] ?? '—'}</td></tr>
  <tr><td>Oldingi yilga nisbatan o'sish</td><td>${researchStats.report.findingsValues[4] ?? '—'}</td></tr>
</tbody></table>

<h2>Top ${top20.length} ta fond reytingi</h2>
<table>
  <thead><tr><th>#</th><th>Fond nomi</th><th>Kategoriya</th><th>Umumiy ball</th><th>Daraja</th><th>Shaffoflik</th><th>Ochiqlik</th><th>Ishonchlilik</th></tr></thead>
  <tbody>${fundRows || '<tr><td colspan="8" style="text-align:center;color:#94a3b8">Ma\'lumot yuklanmadi</td></tr>'}</tbody>
</table>

<div class="footer">
  © ${new Date().getFullYear()} xayriya.info &nbsp;|&nbsp; Charity Index — O'zbekiston xayriya fondlarini mustaqil baholash platformasi
</div>
</body></html>`);

    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  };

  type CardAction = 'report' | 'methodology' | 'analysis' | 'comparison' | 'hisobot' | 'maqolalar';

  const researchCards: Array<{
    icon: React.ReactNode;
    title: string;
    desc: string;
    tag: string;
    buttonText: string;
    action: CardAction;
  }> = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: t('cards.report.title'),
      desc: t('cards.report.desc'),
      tag: t('cards.report.tag'),
      buttonText: t('cards.report.btn'),
      action: 'report',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('cards.methodology.title'),
      desc: t('cards.methodology.desc'),
      tag: t('cards.methodology.tag'),
      buttonText: t('cards.methodology.btn'),
      action: 'methodology',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('cards.analysis.title'),
      desc: t('cards.analysis.desc'),
      tag: t('cards.analysis.tag'),
      buttonText: t('cards.analysis.btn'),
      action: 'analysis',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('cards.comparison.title'),
      desc: t('cards.comparison.desc'),
      tag: t('cards.comparison.tag'),
      buttonText: t('cards.comparison.btn'),
      action: 'comparison',
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: t('cards.hisobot.title'),
      desc: t('cards.hisobot.desc'),
      tag: t('cards.hisobot.tag'),
      buttonText: t('cards.hisobot.btn'),
      action: 'hisobot' as CardAction,
    },
    {
      icon: <Newspaper className="w-8 h-8" />,
      title: t('cards.maqolalar.title'),
      desc: t('cards.maqolalar.desc'),
      tag: t('cards.maqolalar.tag'),
      buttonText: t('cards.maqolalar.btn'),
      action: 'maqolalar' as CardAction,
    },
  ];

  const accents  = [
    'border-blue-500',
    'border-violet-500',
    'border-emerald-500',
    'border-amber-500',
    'border-rose-500',
    'border-cyan-500',
  ];
  const iconBgs  = [
    'bg-blue-50 text-blue-600',
    'bg-violet-50 text-violet-600',
    'bg-emerald-50 text-emerald-600',
    'bg-amber-50 text-amber-600',
    'bg-rose-50 text-rose-600',
    'bg-cyan-50 text-cyan-600',
  ];

  const handleCardClick = (action: CardAction) => {
    setOpenDialog(action);
  };

  return (
    <Layout>
      <div className="bg-[#F8FAFC] min-h-screen">
        {/* Header */}
        <div className="bg-[#EFF6FF] py-12 border-b border-blue-100">
          <div className="max-w-5xl mx-auto px-4">
            <nav className="flex text-sm text-[#64748B] mb-4">
              <Link to="/" className="hover:text-[#1A56DB] transition-colors">{t('breadcrumb.home')}</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-[#1E293B] font-medium">{t('breadcrumb.current')}</span>
            </nav>
            <h1 className="text-4xl font-black text-[#1E293B] mb-4">{t('title')}</h1>
            <p className="text-lg text-[#64748B] max-w-2xl font-medium">{t('subtitle')}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
          {/* 6-card grid — 3 × 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchCards.map((card, index) => (
              <motion.div
                key={card.action}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className={`group flex flex-col overflow-hidden rounded-[28px] border-t-4 ${accents[index]} border border-[#E2E8F0] bg-white shadow-sm hover:-translate-y-2 hover:shadow-2xl transition-all duration-500`}
              >
                <div className="flex flex-col flex-1 p-8">
                  <div className={`mb-8 inline-flex items-center justify-center rounded-2xl p-4 w-fit transition-transform duration-500 group-hover:scale-110 ${iconBgs[index]}`}>
                    {card.icon}
                  </div>
                  <span className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-fit">
                    {card.tag}
                  </span>
                  <h3 className="mb-4 text-2xl font-black leading-tight text-[#1E293B]">{card.title}</h3>
                  <p className="text-base font-medium leading-relaxed text-slate-500 flex-1">{card.desc}</p>
                </div>
                <div className="px-8 pb-8">
                  <button
                    type="button"
                    onClick={() => handleCardClick(card.action)}
                    className="group/btn flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1A56DB] py-4 font-black text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-[#1D4ED8]"
                  >
                    <span>{card.buttonText}</span>
                    {card.action.startsWith('download') ? (
                      <Download className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      <ReportDialog        open={openDialog === 'report'}      onOpenChange={(v) => !v && setOpenDialog(null)} stats={researchStats} />
      <MethodologyDialog   open={openDialog === 'methodology'} onOpenChange={(v) => !v && setOpenDialog(null)} factors={factors} />
      <AnalysisDialog      open={openDialog === 'analysis'}    onOpenChange={(v) => !v && setOpenDialog(null)} stats={researchStats} />
      <ComparisonDialog    open={openDialog === 'comparison'}  onOpenChange={(v) => !v && setOpenDialog(null)} stats={researchStats} />
      <HisobotChoiceDialog open={openDialog === 'hisobot'}     onOpenChange={(v) => !v && setOpenDialog(null)} annualUrl={researchStats.report.annual_report_url} halfYearUrl={researchStats.report.half_year_report_url} onFallback={handleDownloadReport} />
      <MaqolalarDialog     open={openDialog === 'maqolalar'}   onOpenChange={(v) => !v && setOpenDialog(null)} articles={articles} />
    </Layout>
  );
};

export default Tadqiqot;
