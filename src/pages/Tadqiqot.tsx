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
  open, onOpenChange, onDownload,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onDownload: (type: 'annual' | 'halfyear') => void;
}) => {
  const { t } = useTranslation('tadqiqot');
  return (
    <BaseDialog
      open={open} onOpenChange={onOpenChange}
      title={t('reportSection.title')}
      subtitle={t('reportSection.chooseSubtitle')}
      headerBg="bg-rose-50" headerBorder="border-rose-100"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => { onDownload('annual'); onOpenChange(false); }}
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
          onClick={() => { onDownload('halfyear'); onOpenChange(false); }}
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
  const [openDialog, setOpenDialog] = useState<'report' | 'methodology' | 'analysis' | 'comparison' | 'hisobot' | 'maqolalar' | null>(null);
  const [researchStats, setResearchStats] = useState<ResearchStats>(DEFAULT_RESEARCH_STATS);
  const [factors, setFactors] = useState<FactorsGrouped | null>(null);
  const [articles, setArticles] = useState<News[]>([]);

  useEffect(() => {
    researchApi.get().then(setResearchStats).catch(() => {});
    indexesApi.getFactors().then(setFactors).catch(() => {});
    newsApi.getList({ per_page: 6 }).then(({ news }) => setArticles(news)).catch(() => {});
  }, []);

  const handleDownloadReport = async (type: 'annual' | 'halfyear') => {
    const { default: jsPDF } = await import('jspdf');
    const year = new Date().getFullYear();
    const isAnnual = type === 'annual';
    const period = isAnnual
      ? year + '-yilgi yillik hisobot'
      : year + '-yil birinchi yarmi (Yanvar-Iyun)';
    const reportTitle = isAnnual
      ? 'Yillik Xayriya Hisoboti ' + year
      : 'Yarim Yillik Xayriya Hisoboti ' + year;
    const filename = isAnnual
      ? 'Yillik_Xayriya_Hisoboti_' + year + '.pdf'
      : '6_Oylik_Hisobot_' + year + '.pdf';
    const dateStr = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });

    const areaLabels = ["Ta'lim va ilm", "Ijtimoiy yordam", "Sog'liqni saqlash", "Ekologiya va muhit"];
    const areaColors = ['#1A56DB', '#059669', '#7C3AED', '#F59E0B'];
    const areaPcts = researchStats.report.areaPcts;
    const findingsData = [
      { label: "Hisobot bergan fondlar soni",    value: researchStats.report.findingsValues[0] ?? '124 ta' },
      { label: "Platinum darajasidagi fondlar",  value: researchStats.report.findingsValues[1] ?? '11 ta'  },
      { label: "Faol loyihalari bo'lgan fondlar", value: researchStats.report.findingsValues[2] ?? '38 ta'  },
      { label: "O'rtacha shaffoflik indeksi",    value: researchStats.report.findingsValues[3] ?? '68.7'   },
      { label: "Yil davomida o'sish",            value: researchStats.report.findingsValues[4] ?? '+10.5%' },
    ];
    const ctryData = [
      { name: "Qozog'iston", score: researchStats.comparison.countryScores[0] ?? 79 },
      { name: 'Toshkent',    score: researchStats.comparison.countryScores[1] ?? 65 },
      { name: 'Samarqand',   score: researchStats.comparison.countryScores[2] ?? 69 },
      { name: "Farg'ona",    score: researchStats.comparison.countryScores[3] ?? 51 },
      { name: 'Xorazm',      score: researchStats.comparison.countryScores[4] ?? 33 },
    ];

    const hex = (h: string): [number, number, number] => [
      parseInt(h.slice(1, 3), 16),
      parseInt(h.slice(3, 5), 16),
      parseInt(h.slice(5, 7), 16),
    ];

    const doc = new jsPDF('p', 'mm', 'a4');
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 18;
    const CW = W - M * 2;

    // CAF-style helpers
    const fc = (r: number, g: number, b: number) => doc.setFillColor(r, g, b);
    const tc = (r: number, g: number, b: number) => doc.setTextColor(r, g, b);
    const dc = (r: number, g: number, b: number) => doc.setDrawColor(r, g, b);
    // Strip chars outside Latin-1 range that Helvetica can't render
    const s = (str: string) => str
      .replace(/[ʼ‘’ʹ]/g, "'")
      .replace(/[₿€£¥]/g, '')
      .replace(/[^ -ÿ]/g, '');

    // Palette
    const TD: [number,number,number] = [11, 61, 54];    // teal dark
    const TM: [number,number,number] = [21, 92, 79];    // teal mid
    const TL: [number,number,number] = [232, 245, 241]; // teal light
    const RA: [number,number,number] = [232, 75, 43];   // red accent
    const WH: [number,number,number] = [255, 255, 255]; // white
    const DT: [number,number,number] = [20, 40, 35];    // dark text
    const MG: [number,number,number] = [100, 116, 139]; // mid gray
    const LG: [number,number,number] = [248, 250, 252]; // light gray
    const BR: [number,number,number] = [210, 230, 225]; // border
    const LC: [number,number,number] = [160, 210, 195]; // light cyan

    // ── PAGE 1: COVER ───────────────────────────────────────────────────────────
    fc(...TD); doc.rect(0, 0, W, H, 'F');
    fc(...RA); doc.rect(0, 0, W, 4, 'F');
    fc(...RA); doc.rect(0, 4, 3, 100, 'F');
    fc(21, 92, 79); doc.circle(W - 20, -15, 58, 'F');
    fc(11, 61, 54); doc.circle(W - 20, -15, 43, 'F');

    // Logo
    fc(...RA); doc.roundedRect(M, 14, 14, 14, 3, 3, 'F');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); tc(...WH);
    doc.text('CI', M + 7, 23.5, { align: 'center' });
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); tc(...WH);
    doc.text('xayriya.info', M + 18, 22.5);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); tc(...LC);
    doc.text("Charity Index — O'zbekiston", M + 18, 28);

    // Period badge
    fc(...RA); doc.roundedRect(W - M - 66, 14, 66, 10, 2.5, 2.5, 'F');
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(...WH);
    doc.text(period, W - M - 3, 20.5, { align: 'right' });

    dc(21, 92, 79); doc.setLineWidth(0.5); doc.line(M, 36, W - M, 36);

    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); tc(...LC);
    doc.text("O'ZBEKISTON XAYRIYA SEKTORI — RASMIY HISOBOT", M, 55);

    doc.setFontSize(38); doc.setFont('helvetica', 'bold'); tc(...WH);
    doc.text(isAnnual ? "YILLIK XAYRIYA" : "YARIM YILLIK", M, 76);
    tc(...LC);
    doc.text(isAnnual ? ("HISOBOTI " + year) : ("XAYRIYA HISOBOTI " + year), M, 94);

    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); tc(...LC);
    doc.text("O'zbekiston xayriya fondlarining shaffoflik,", M, 110, { maxWidth: CW * 0.7 });
    doc.text("samaradorlik va jamoatchilik ishonchiga ta'siri", M, 117, { maxWidth: CW * 0.7 });
    doc.text("bo'yicha kompleks tahlil.", M, 124, { maxWidth: CW * 0.7 });

    // Cover KPI cards
    const kpiY = 152;
    const kpiCardW = (CW - 8) / 3;
    const kpis = [
      { val: researchStats.report.statActive,        lbl: "FAOL FONDLAR",     sub: "ro'yxatga olingan" },
      { val: researchStats.report.statBeneficiaries, lbl: "FOYDALANUVCHILAR", sub: "xizmatdan foydalangan" },
      { val: researchStats.report.statTransparency,  lbl: "SHAFFOFLIK",       sub: "o'rtacha indeks balli" },
    ];
    kpis.forEach((k, i) => {
      const kx = M + i * (kpiCardW + 4);
      fc(...TM); doc.roundedRect(kx, kpiY, kpiCardW, 46, 4, 4, 'F');
      fc(...RA); doc.roundedRect(kx, kpiY, kpiCardW, 3.5, 1, 1, 'F');
      doc.setFontSize(26); doc.setFont('helvetica', 'bold'); tc(...WH);
      doc.text(s(String(k.val)), kx + 7, kpiY + 22);
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); tc(...LC);
      doc.text(k.lbl, kx + 7, kpiY + 32);
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); tc(100, 160, 145);
      doc.text(k.sub, kx + 7, kpiY + 39);
    });

    // Cover footer
    fc(7, 40, 35); doc.rect(0, H - 22, W, 22, 'F');
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); tc(100, 160, 145);
    doc.text('Tayyorlangan: ' + dateStr, M, H - 10);
    doc.setFontSize(8.5); doc.setFont('helvetica', 'bold'); tc(...LC);
    doc.text('xayriya.info platformasi', W - M, H - 15, { align: 'right' });
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); tc(51, 85, 77);
    doc.text('(c) ' + year + ' Barcha huquqlar himoyalangan', W - M, H - 9, { align: 'right' });

    // ── PAGE 2: KEY STATS + DISTRIBUTION ────────────────────────────────────────
    doc.addPage();
    fc(...TD); doc.rect(0, 0, W, 14, 'F');
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(...LC);
    doc.text('XAYRIYA.INFO — ' + reportTitle.toUpperCase(), M, 9.5);
    doc.text('1-bet', W - M, 9.5, { align: 'right' });
    let y2 = 22;

    // Section 01
    fc(...RA); doc.roundedRect(M, y2, 10, 10, 2, 2, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); tc(...WH);
    doc.text('01', M + 5, y2 + 7, { align: 'center' });
    doc.setFontSize(15); doc.setFont('helvetica', 'bold'); tc(...DT);
    doc.text("Asosiy Ko'rsatkichlar", M + 14, y2 + 7.5);
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); tc(...MG);
    doc.text(period + " natijalariga ko'ra", M + 14, y2 + 13.5);
    y2 += 20;

    const statCardsData = [
      { val: researchStats.report.statActive,        lbl: "Faol ro'yxatga olingan fondlar", col: TD },
      { val: researchStats.report.statBeneficiaries, lbl: "Jami foyda ko'ruvchilar",         col: TM },
      { val: researchStats.report.statRaised,        lbl: "Yig'ilgan va sarflangan mablag'", col: RA },
      { val: researchStats.report.statTransparency,  lbl: "O'rtacha shaffoflik indeksi",     col: [245, 158, 11] as [number,number,number] },
    ];
    const sCardW = (CW - 6) / 2;
    const sCardH = 32;
    statCardsData.forEach((sc, i) => {
      const cx = M + (i % 2) * (sCardW + 6);
      const cy = y2 + Math.floor(i / 2) * (sCardH + 5);
      fc(...sc.col); doc.roundedRect(cx, cy, sCardW, sCardH, 3, 3, 'F');
      doc.setFontSize(20); doc.setFont('helvetica', 'bold'); tc(...WH);
      doc.text(s(String(sc.val)), cx + 7, cy + 15);
      doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); tc(200, 230, 220);
      doc.text(sc.lbl, cx + 7, cy + 25, { maxWidth: sCardW - 12 });
    });
    y2 += 2 * sCardH + 5 + 14;

    // Section 02
    fc(...RA); doc.roundedRect(M, y2, 10, 10, 2, 2, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); tc(...WH);
    doc.text('02', M + 5, y2 + 7, { align: 'center' });
    doc.setFontSize(15); doc.setFont('helvetica', 'bold'); tc(...DT);
    doc.text("Faoliyat Yo'nalishlari Taqsimoti", M + 14, y2 + 7.5);
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); tc(...MG);
    doc.text("Xayriya fondlarining asosiy sohalari bo'yicha foiz ulushi", M + 14, y2 + 13.5);
    y2 += 20;

    fc(...LG); doc.roundedRect(M, y2, CW, 64, 3, 3, 'F');
    dc(...BR); doc.setLineWidth(0.3); doc.roundedRect(M, y2, CW, 64, 3, 3, 'S');
    const aLblW = 54;
    const aBarMaxW = CW - aLblW - 24;
    const barColors2: Array<[number,number,number]> = [TD, RA, [249, 115, 22], [245, 158, 11]];
    areaLabels.forEach((lbl, i) => {
      const by = y2 + 9 + i * 13.5;
      doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); tc(55, 75, 70);
      doc.text(lbl, M + 8, by + 4.5);
      const pct = areaPcts[i] ?? 0;
      const bw = (pct / 100) * aBarMaxW;
      fc(...barColors2[i]); doc.roundedRect(M + 8 + aLblW, by, Math.max(bw, 1), 7.5, 1.5, 1.5, 'F');
      doc.setFontSize(8); doc.setFont('helvetica', 'bold');
      doc.setTextColor(barColors2[i][0], barColors2[i][1], barColors2[i][2]);
      doc.text(pct + '%', M + 8 + aLblW + bw + 3, by + 5.5);
    });

    // ── PAGE 3: FINDINGS + TRENDS ─────────────────────────────────────────────
    doc.addPage();
    fc(...TD); doc.rect(0, 0, W, 14, 'F');
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(...LC);
    doc.text('XAYRIYA.INFO — ' + reportTitle.toUpperCase(), M, 9.5);
    doc.text('2-bet', W - M, 9.5, { align: 'right' });
    let y3 = 22;

    // Section 03
    fc(...RA); doc.roundedRect(M, y3, 10, 10, 2, 2, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); tc(...WH);
    doc.text('03', M + 5, y3 + 7, { align: 'center' });
    doc.setFontSize(15); doc.setFont('helvetica', 'bold'); tc(...DT);
    doc.text('Asosiy Natijalar', M + 14, y3 + 7.5);
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); tc(...MG);
    doc.text("Tadqiqot davomida aniqlangan muhim ko'rsatkichlar", M + 14, y3 + 13.5);
    y3 += 20;

    // Findings table
    fc(...TD); doc.roundedRect(M, y3, CW, 9, 2, 2, 'F');
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(...LC);
    doc.text("KO'RSATKICH", M + 5, y3 + 6);
    doc.text('QIYMAT', M + CW - 5, y3 + 6, { align: 'right' });
    y3 += 9;

    findingsData.forEach((row, i) => {
      const rH = 12;
      if (i % 2 === 0) { doc.setFillColor(246, 252, 250); } else { fc(...WH); }
      doc.rect(M, y3, CW, rH, 'F');
      dc(...BR); doc.setLineWidth(0.3); doc.line(M, y3 + rH, M + CW, y3 + rH);
      doc.setFontSize(9); doc.setFont('helvetica', 'normal'); tc(40, 70, 60);
      doc.text(row.label, M + 5, y3 + 8.5);
      const sv = s(row.value);
      const vw = doc.getTextWidth(sv) + 10;
      fc(...TL); doc.roundedRect(M + CW - vw - 4, y3 + 2, vw, 7.5, 2, 2, 'F');
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); tc(...TM);
      doc.text(sv, M + CW - 4 - vw / 2, y3 + 8, { align: 'center' });
      y3 += rH;
    });
    y3 += 14;

    // Section 04
    fc(...RA); doc.roundedRect(M, y3, 10, 10, 2, 2, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); tc(...WH);
    doc.text('04', M + 5, y3 + 7, { align: 'center' });
    doc.setFontSize(15); doc.setFont('helvetica', 'bold'); tc(...DT);
    doc.text("O'sish Tendensiyalari", M + 14, y3 + 7.5);
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); tc(...MG);
    doc.text("O'tgan yilga nisbatan asosiy o'zgarishlar", M + 14, y3 + 13.5);
    y3 += 20;

    const trends = [
      { val: researchStats.analysis.statNewFunds,      lbl: "Yangi fondlar soni o'sishi" },
      { val: researchStats.analysis.statOnlineReports, lbl: "Onlayn hisobot berish o'sishi" },
      { val: researchStats.analysis.statUserRatings,   lbl: "Foydalanuvchi baholashlari o'sishi" },
    ];
    const tCardW = (CW - 8) / 3;
    trends.forEach((tr, i) => {
      const tx = M + i * (tCardW + 4);
      fc(...TM); doc.roundedRect(tx, y3, tCardW, 34, 3, 3, 'F');
      fc(...RA); doc.roundedRect(tx, y3, tCardW, 3.5, 1, 1, 'F');
      doc.setFontSize(22); doc.setFont('helvetica', 'bold'); tc(...WH);
      doc.text(s(String(tr.val)), tx + 7, y3 + 19);
      doc.setFontSize(8); doc.setFont('helvetica', 'normal'); tc(180, 220, 210);
      doc.text(tr.lbl, tx + 7, y3 + 28, { maxWidth: tCardW - 12 });
    });
    y3 += 42;

    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); tc(40, 70, 60);
    doc.text("O'RTACHA INDEKS BALLI — KO'P YILLIK DINAMIKA", M, y3 + 4);
    y3 += 10;

    const avgVals = researchStats.analysis.avgValues;
    if (avgVals.length > 0) {
      const tlCardW = (CW - (avgVals.length - 1) * 4) / avgVals.length;
      avgVals.forEach((val, i) => {
        const tlYear = year - (avgVals.length - 1 - i);
        const tx = M + i * (tlCardW + 4);
        const isLast = i === avgVals.length - 1;
        if (isLast) { fc(...TD); } else { fc(...TL); }
        doc.roundedRect(tx, y3, tlCardW, 24, 3, 3, 'F');
        doc.setFontSize(13); doc.setFont('helvetica', 'bold');
        if (isLast) { tc(...WH); } else { tc(...TM); }
        doc.text(s(String(val)), tx + tlCardW / 2, y3 + 12, { align: 'center' });
        doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
        if (isLast) { tc(...LC); } else { tc(...MG); }
        doc.text(tlYear + '-yil', tx + tlCardW / 2, y3 + 19, { align: 'center' });
      });
    }

    // ── PAGE 4: COMPARISON ──────────────────────────────────────────────────────
    doc.addPage();
    fc(...TD); doc.rect(0, 0, W, 14, 'F');
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(...LC);
    doc.text('XAYRIYA.INFO — ' + reportTitle.toUpperCase(), M, 9.5);
    doc.text('3-bet', W - M, 9.5, { align: 'right' });
    let y4 = 22;

    // Section 05
    fc(...RA); doc.roundedRect(M, y4, 10, 10, 2, 2, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); tc(...WH);
    doc.text('05', M + 5, y4 + 7, { align: 'center' });
    doc.setFontSize(15); doc.setFont('helvetica', 'bold'); tc(...DT);
    doc.text('Hududiy va Global Taqqoslash', M + 14, y4 + 7.5);
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); tc(...MG);
    doc.text("Viloyatlar kesimida va xalqaro ko'rsatkichlar bilan solishtirish", M + 14, y4 + 13.5);
    y4 += 20;

    const col2W = (CW - 8) / 2;

    // Left panel: regions
    fc(...LG); doc.roundedRect(M, y4, col2W, 92, 3, 3, 'F');
    dc(...BR); doc.setLineWidth(0.3); doc.roundedRect(M, y4, col2W, 92, 3, 3, 'S');
    fc(...TD); doc.roundedRect(M, y4, col2W, 11, 2, 2, 'F');
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(...LC);
    doc.text("VILOYATLAR VA MINTAQALAR", M + 6, y4 + 7.5);
    const rLblW = 32;
    const rBarMax = col2W - rLblW - 20;
    const cColors2: Array<[number,number,number]> = [RA, TD, TM, [100, 140, 130], [140, 180, 170]];
    ctryData.forEach((c, i) => {
      const by = y4 + 15 + i * 14;
      doc.setFontSize(8); doc.setFont('helvetica', 'normal'); tc(40, 70, 60);
      doc.text(s(c.name), M + 6, by + 5);
      const bw2 = (c.score / 100) * rBarMax;
      const col3 = cColors2[i];
      doc.setFillColor(col3[0], col3[1], col3[2]);
      doc.roundedRect(M + 6 + rLblW, by, Math.max(bw2, 1), 7, 1.5, 1.5, 'F');
      doc.setFontSize(8); doc.setFont('helvetica', 'bold');
      doc.setTextColor(col3[0], col3[1], col3[2]);
      doc.text(String(c.score), M + 6 + rLblW + bw2 + 3, by + 5.5);
    });

    // Right panel: global
    const globalData = [
      { lbl: "O'zbekiston o'rtacha bali", val: researchStats.comparison.globalValues[0] ?? '61.2 ball' },
      { lbl: 'Mintaqaviy eng yuqori ball', val: researchStats.comparison.globalValues[1] ?? '82.4 ball' },
      { lbl: "Mintaqaviy o'rtacha",        val: researchStats.comparison.globalValues[2] ?? '58.7 ball' },
      { lbl: "Mintaqaviy o'rin",           val: researchStats.comparison.globalValues[3] ?? "2-o'rin" },
    ];
    const rx2 = M + col2W + 8;
    fc(...LG); doc.roundedRect(rx2, y4, col2W, 92, 3, 3, 'F');
    dc(...BR); doc.setLineWidth(0.3); doc.roundedRect(rx2, y4, col2W, 92, 3, 3, 'S');
    fc(...TD); doc.roundedRect(rx2, y4, col2W, 11, 2, 2, 'F');
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(...LC);
    doc.text('GLOBAL TAQQOSLASH', rx2 + 6, y4 + 7.5);
    globalData.forEach((g, i) => {
      const gy = y4 + 15 + i * 18;
      if (i > 0) {
        dc(...BR); doc.setLineWidth(0.3); doc.line(rx2 + 4, gy, rx2 + col2W - 4, gy);
      }
      doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); tc(...MG);
      doc.text(g.lbl, rx2 + 6, gy + 9);
      const sg = s(g.val);
      const vw2 = doc.getTextWidth(sg) + 10;
      fc(...TL); doc.roundedRect(rx2 + col2W - vw2 - 6, gy + 2, vw2, 8, 2, 2, 'F');
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); tc(...TM);
      doc.text(sg, rx2 + col2W - 6 - vw2 / 2, gy + 8, { align: 'center' });
    });

    // Dark teal footer
    fc(...TD); doc.rect(0, H - 22, W, 22, 'F');
    fc(...RA); doc.rect(0, H - 22, W, 2, 'F');
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); tc(...LC);
    doc.text('xayriya.info', M, H - 10);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); tc(100, 160, 145);
    doc.text("Charity Index Platformasi — O'zbekiston", M, H - 5);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); tc(100, 160, 145);
    doc.text(reportTitle, W - M, H - 10, { align: 'right' });
    doc.text('(c) ' + year + " xayriya.info. Barcha huquqlar himoyalangan.", W - M, H - 5, { align: 'right' });

    doc.save(filename);
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
      <HisobotChoiceDialog open={openDialog === 'hisobot'}     onOpenChange={(v) => !v && setOpenDialog(null)} onDownload={handleDownloadReport} />
      <MaqolalarDialog     open={openDialog === 'maqolalar'}   onOpenChange={(v) => !v && setOpenDialog(null)} articles={articles} />
    </Layout>
  );
};

export default Tadqiqot;
