import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/src/components/layout/Layout';
import { FileText, BarChart3, TrendingUp, Globe, ChevronRight, X, Download, Newspaper } from 'lucide-react';
import { motion } from 'motion/react';
import { researchApi, ResearchStats, DEFAULT_RESEARCH_STATS } from '@/src/api/research';
import { indexesApi, FactorsGrouped } from '@/src/api/indexes';
import { apiClient } from '@/src/api/client';

type Factor = { name: string; weight: string };

const SCORE_LEVEL_STYLES = [
  { label: '👑 Platinum', bg: '#F5F3FF', color: '#7C3AED' },
  { label: '🥇 Gold',     bg: '#FFFBEB', color: '#B45309' },
  { label: '🥈 Silver',   bg: '#F8FAFC', color: '#475569' },
  { label: '🥉 Bronze',   bg: '#FFF7ED', color: '#92400E' },
  { label: '⚠️ Unrated',  bg: '#F8FAFC', color: '#94A3B8' },
];

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
  const areas       = t('report.areas',       { returnObjects: true }) as string[];
  const findingsRows = t('report.findingsRows', { returnObjects: true }) as Array<{ label: string; value: string }>;
  const areaColors  = ['#1A56DB', '#059669', '#7C3AED', '#F59E0B'];

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
const MethodologyDialog = ({ open, onOpenChange, factors }: { open: boolean; onOpenChange: (v: boolean) => void; factors: FactorsGrouped }) => {
  const { t } = useTranslation('tadqiqot');
  const scoreRanges = t('methodology.scoreRanges', { returnObjects: true }) as string[];

  const toFactors = (list: typeof factors.transparency): Factor[] =>
    list.map(f => ({ name: f.name_uz, weight: `${Number(f.weight)}%` }));

  const transparencyFactors = toFactors(factors.transparency);
  const opennessFactors     = toFactors(factors.openness);
  const trustFactors        = toFactors(factors.trust);

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
        <StatCard value={stats.analysis.statNewFunds}      label={t('analysis.statNewFunds')}     color="#059669" />
        <StatCard value={stats.analysis.statOnlineReports} label={t('analysis.statOnlineReports')} color="#1A56DB" />
        <StatCard value={stats.analysis.statUserRatings}   label={t('analysis.statUserRatings')}  color="#7C3AED" />
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
  const countries       = t('comparison.countries',        { returnObjects: true }) as string[];
  const globalRows      = t('comparison.globalRows',       { returnObjects: true }) as Array<{ label: string; value: string }>;
  const recommendations = t('comparison.recommendations',  { returnObjects: true }) as Array<{ text: string; priority: string }>;
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

// ── Dialog 5: Hisobot tanlov ──────────────────────────────────────────────────
const HisobotChoiceDialog = ({
  open, onOpenChange, onDownload, isGenerating,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onDownload: () => void;
  isGenerating: boolean;
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
        {/* Yillik */}
        <div className="rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 flex flex-col gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Download className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-black text-slate-900 text-[15px]">{t('reportSection.annual.title')}</p>
            <p className="text-xs text-slate-500 mt-1">{t('reportSection.annual.subtitle')}</p>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600 flex-1">
            {(t('reportSection.semi.includes', { returnObjects: true }) as string[]).map((item: string) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />{item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => { onDownload(); onOpenChange(false); }}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold rounded-xl py-3 hover:bg-blue-700 transition-colors text-sm disabled:opacity-70"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? t('reportSection.generating') : t('reportSection.annual.download')}
          </button>
        </div>

        {/* 6 Oylik */}
        <div className="rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 flex flex-col gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <Download className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-black text-slate-900 text-[15px]">{t('reportSection.semi.title')}</p>
            <p className="text-xs text-slate-500 mt-1">{t('reportSection.semi.subtitle')}</p>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600 flex-1">
            {(t('reportSection.semi.includes', { returnObjects: true }) as string[]).map((item: string) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />{item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => { onDownload(); onOpenChange(false); }}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold rounded-xl py-3 hover:bg-emerald-700 transition-colors text-sm disabled:opacity-70"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? t('reportSection.generating') : t('reportSection.semi.download')}
          </button>
        </div>
      </div>
    </BaseDialog>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const Tadqiqot = () => {
  const { t } = useTranslation('tadqiqot');
  const [openDialog, setOpenDialog] = useState<'report' | 'methodology' | 'analysis' | 'comparison' | 'hisobot' | null>(null);
  const [researchStats, setResearchStats] = useState<ResearchStats>(DEFAULT_RESEARCH_STATS);
  const [factors, setFactors] = useState<FactorsGrouped>({ transparency: [], openness: [], trust: [] });
  const [articles, setArticles] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load real factors from API
    indexesApi.getFactors().then(setFactors).catch(() => {});

    // Load real stats from public API
    Promise.all([
      apiClient.get<any>('/api/v1/stats/public').catch(() => null),
      apiClient.get<any>('/api/v1/indexes/ranking?per_page=100').catch(() => null),
      apiClient.get<any>('/api/v1/funds?per_page=100').catch(() => null),
    ]).then(([stats, ranking, fundsRes]) => {
      const funds: any[] = ranking?.data ?? [];
      const allFunds: any[] = fundsRes?.data ?? [];

      if (funds.length === 0) return;

      const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * 10) / 10 : 0;

      const overalls = funds.map((f: any) => Number(f.indexes?.overall_score ?? 0));
      const transparencies = funds.map((f: any) => Number(f.indexes?.transparency_score ?? 0));
      const opennesses = funds.map((f: any) => Number(f.indexes?.openness_score ?? 0));
      const trusts = funds.map((f: any) => Number(f.indexes?.trust_score ?? 0));

      // Count by grade
      const gradeCount = (grade: string) => funds.filter((f: any) => f.indexes?.grade === grade).length;

      // Category distribution
      const catMap: Record<string, number> = {};
      allFunds.forEach((f: any) => {
        const cat = f.category?.name_uz ?? 'Boshqa';
        catMap[cat] = (catMap[cat] ?? 0) + 1;
      });
      const total = allFunds.length || 1;
      const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 4);
      const areaPcts = topCats.map(([, n]) => Math.round(n / total * 100));

      const totalFunds = stats?.total_funds ?? funds.length;
      const verifiedFunds = stats?.verified_funds ?? funds.filter((f: any) => f.is_verified).length;

      setResearchStats({
        report: {
          statActive: `${totalFunds}`,
          statBeneficiaries: `${stats?.total_beneficiaries ?? 0}+`,
          statRaised: `${stats?.total_projects ?? 0}`,
          statTransparency: `${avg(transparencies)}%`,
          areaPcts: areaPcts.length ? areaPcts : [38, 28, 19, 15],
          findingsValues: [
            `${totalFunds} ta`,
            `${verifiedFunds} ta`,
            `${gradeCount('gold') + gradeCount('platinum')} ta`,
            `${avg(overalls)} ball`,
            `${avg(transparencies)} ball`,
          ],
        },
        analysis: {
          statNewFunds: `${totalFunds}`,
          statOnlineReports: `${verifiedFunds}`,
          statUserRatings: `${gradeCount('gold') + gradeCount('platinum')}`,
          growingChanges: [
            `${avg(transparencies)} ball`,
            `${avg(opennesses)} ball`,
            `${avg(trusts)} ball`,
            `${avg(overalls)} ball`,
          ],
          avgValues: [
            `${avg(transparencies)} ball`,
            `${avg(opennesses)} ball`,
            `${avg(trusts)} ball`,
          ],
        },
        comparison: DEFAULT_RESEARCH_STATS.comparison,
      });
    });

    // Load recent news/articles
    apiClient.get<any>('/api/v1/news?per_page=4').catch(() => null).then((res) => {
      if (res?.data?.length) setArticles(res.data);
    });
  }, []);

  const handleDownloadReport = async () => {
    setIsGenerating(true);
    try {
      const stats = researchStats;
      const reportWindow = window.open('', '_blank');
      if (!reportWindow) return;
      const now = new Date().toLocaleDateString('uz-UZ');
      reportWindow.document.write(`<!DOCTYPE html><html><head>
        <meta charset="UTF-8"><title>Xayriya Hisoboti ${now}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; color: #1e293b; }
          h1 { color: #1A56DB; border-bottom: 3px solid #1A56DB; padding-bottom: 12px; }
          h2 { color: #334155; margin-top: 32px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; }
          .card .num { font-size: 2rem; font-weight: 900; color: #1A56DB; }
          .card .lbl { font-size: 0.8rem; color: #64748b; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th { background: #1A56DB; color: white; padding: 10px; text-align: left; }
          td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
          .footer { margin-top: 48px; text-align: center; color: #94a3b8; font-size: 0.8rem; }
          @media print { button { display: none; } }
        </style>
      </head><body>
        <h1>🇺🇿 O'zbekiston Xayriya Indeksi — Hisobot</h1>
        <p>Sana: ${now} | Manba: xayriya.info</p>
        <h2>📊 Asosiy Ko'rsatkichlar</h2>
        <div class="grid">
          <div class="card"><div class="num">${stats.report.statActive}</div><div class="lbl">Jami fondlar</div></div>
          <div class="card"><div class="num">${stats.report.statTransparency}</div><div class="lbl">O'rtacha shaffoflik</div></div>
          <div class="card"><div class="num">${stats.report.statBeneficiaries}</div><div class="lbl">Benefitsiarlar</div></div>
          <div class="card"><div class="num">${stats.report.statRaised}</div><div class="lbl">Loyihalar soni</div></div>
        </div>
        <h2>📈 Indeks Natijalari</h2>
        <table>
          <tr><th>Ko'rsatkich</th><th>Qiymat</th></tr>
          ${stats.report.findingsValues.map((v, i) => {
            const labels = ['Jami fondlar', 'Tasdiqlangan fondlar', 'Yuqori daraja (Gold/Platinum)', "O'rtacha umumiy ball", "O'rtacha shaffoflik bali"];
            return `<tr><td>${labels[i] ?? ''}</td><td><strong>${v}</strong></td></tr>`;
          }).join('')}
        </table>
        <h2>🏆 Metodologiya</h2>
        <p>Umumiy = (Shaffoflik × 40%) + (Ochiqlik × 30%) + (Ishonchlilik × 30%)</p>
        <table>
          <tr><th>Daraja</th><th>Ball oralig'i</th></tr>
          <tr><td>👑 Platinum</td><td>90–100</td></tr>
          <tr><td>🥇 Gold</td><td>75–89</td></tr>
          <tr><td>🥈 Silver</td><td>60–74</td></tr>
          <tr><td>🥉 Bronze</td><td>45–59</td></tr>
          <tr><td>⚠️ Unrated</td><td>0–44</td></tr>
        </table>
        <div class="footer">© ${new Date().getFullYear()} Charity Index Uzbekistan — xayriya.info</div>
        <script>window.onload = () => window.print();</script>
      </body></html>`);
      reportWindow.document.close();
    } finally {
      setIsGenerating(false);
    }
  };

  type CardAction = 'report' | 'methodology' | 'analysis' | 'comparison' | 'hisobot' | 'article';

  const firstArticle = articles[0] ?? null;

  const researchCards: { icon: React.ReactNode; title: string; desc: string; tag: string; buttonText: string; action: CardAction }[] = [
    { icon: <FileText className="w-8 h-8" />,   title: t('cards.report.title'),      desc: t('cards.report.desc'),      tag: t('cards.report.tag'),      buttonText: t('cards.report.btn'),      action: 'report'      },
    { icon: <BarChart3 className="w-8 h-8" />,  title: t('cards.methodology.title'), desc: t('cards.methodology.desc'), tag: t('cards.methodology.tag'), buttonText: t('cards.methodology.btn'), action: 'methodology' },
    { icon: <TrendingUp className="w-8 h-8" />, title: t('cards.analysis.title'),    desc: t('cards.analysis.desc'),    tag: t('cards.analysis.tag'),    buttonText: t('cards.analysis.btn'),    action: 'analysis'    },
    { icon: <Globe className="w-8 h-8" />,      title: t('cards.comparison.title'),  desc: t('cards.comparison.desc'),  tag: t('cards.comparison.tag'),  buttonText: t('cards.comparison.btn'),  action: 'comparison'  },
    { icon: <Download className="w-8 h-8" />,   title: t('cards.hisobot.title'),     desc: t('cards.hisobot.desc'),     tag: t('cards.hisobot.tag'),     buttonText: t('cards.hisobot.btn'),     action: 'hisobot'     },
    {
      icon: <Newspaper className="w-8 h-8" />,
      title: firstArticle ? (firstArticle.title_uz ?? firstArticle.title ?? t('cards.article.title')) : t('cards.article.title'),
      desc:  firstArticle ? (firstArticle.excerpt ?? t('cards.article.desc')) : t('cards.article.desc'),
      tag:   t('cards.article.tag'),
      buttonText: firstArticle?.source_url ? t('articlesSection.download') : t('articlesSection.readMore'),
      action: 'article',
    },
  ];

  const accents = ['border-blue-500', 'border-violet-500', 'border-emerald-500', 'border-amber-500', 'border-rose-500', 'border-violet-400'];
  const iconBgs = ['bg-blue-50 text-blue-600', 'bg-violet-50 text-violet-600', 'bg-emerald-50 text-emerald-600', 'bg-amber-50 text-amber-600', 'bg-rose-50 text-rose-600', 'bg-violet-50 text-violet-500'];

  const handleCardClick = (action: CardAction) => {
    if (action === 'hisobot') {
      setOpenDialog('hisobot');
    } else if (action === 'article') {
      const fileUrl = firstArticle?.source_url;
      if (fileUrl) window.open(fileUrl, '_blank');
      else window.location.href = '/news';
    } else {
      setOpenDialog(action);
    }
  };

  return (
    <Layout>
      <div className="bg-[#F8FAFC] min-h-screen">
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

          {/* Research cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchCards.map((card, index) => (
              <motion.div
                key={card.action}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
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


          {/* Maqolalar */}
          {articles.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-7 bg-violet-500 rounded-full" />
                  <h2 className="text-2xl font-black text-[#1E293B]">{t('articlesSection.title')}</h2>
                </div>
                <Link to="/news" className="text-sm font-bold text-[#1A56DB] flex items-center gap-1 hover:gap-2 transition-all">
                  {t('articlesSection.viewAll')} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {articles.map((article: any, i: number) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
                        <Newspaper className="w-4 h-4 text-violet-600" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">
                        {article.category ?? t('articlesSection.tag')}
                      </span>
                    </div>
                    <h3 className="font-black text-[#1E293B] text-base leading-snug line-clamp-2">
                      {article.title_uz ?? article.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 flex-1">
                      {article.excerpt_uz ?? article.excerpt ?? ''}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-400 font-medium">
                        {article.date ? new Date(article.date).toLocaleDateString('uz-UZ') : ''}
                      </span>
                      {article.source_url && (
                        <a
                          href={article.source_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-3 h-3" /> {t('articlesSection.download')}
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      <ReportDialog        open={openDialog === 'report'}      onOpenChange={(v) => !v && setOpenDialog(null)} stats={researchStats} />
      <MethodologyDialog   open={openDialog === 'methodology'} onOpenChange={(v) => !v && setOpenDialog(null)} factors={factors} />
      <AnalysisDialog      open={openDialog === 'analysis'}    onOpenChange={(v) => !v && setOpenDialog(null)} stats={researchStats} />
      <ComparisonDialog    open={openDialog === 'comparison'}  onOpenChange={(v) => !v && setOpenDialog(null)} stats={researchStats} />
      <HisobotChoiceDialog open={openDialog === 'hisobot'}    onOpenChange={(v) => !v && setOpenDialog(null)} onDownload={handleDownloadReport} isGenerating={isGenerating} />
    </Layout>
  );
};

export default Tadqiqot;
