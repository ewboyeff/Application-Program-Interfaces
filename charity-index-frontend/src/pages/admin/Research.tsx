import React, { useEffect, useRef, useState } from 'react';
import { FileText, TrendingUp, Globe, Save, Loader2, RotateCcw, Upload, X, Download } from 'lucide-react';
import { useToast } from '@/src/context/ToastContext';
import { researchApi, ResearchStats, DEFAULT_RESEARCH_STATS } from '@/src/api/research';
import { reportsApi } from '@/src/api/reports';
import { API_BASE } from '@/src/lib/utils';

const inputCls =
  'w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 px-3 text-slate-900 font-medium focus:bg-white focus:border-blue-500 transition-all outline-none text-sm';

const labelCls = 'text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block';

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function SectionCard({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
      <div className={`p-6 border-b border-slate-50 flex items-center gap-3 ${color}`}>
        <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

export const AdminResearch: React.FC = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState<ResearchStats>(DEFAULT_RESEARCH_STATS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAnnual, setUploadingAnnual] = useState(false);
  const [uploadingHalf, setUploadingHalf] = useState(false);
  const annualInputRef = useRef<HTMLInputElement>(null);
  const halfInputRef = useRef<HTMLInputElement>(null);

  const handleUploadReport = async (type: 'annual' | 'half', file: File) => {
    const setUploading = type === 'annual' ? setUploadingAnnual : setUploadingHalf;
    const field = type === 'annual' ? 'annual_report_url' : 'half_year_report_url';
    setUploading(true);
    try {
      const url = await reportsApi.uploadDocument(file);
      setStats(prev => ({
        ...prev,
        report: { ...prev.report, [field]: url },
      }));
      showToast('Fayl yuklandi — Saqlash tugmasini bosing', 'success');
    } catch {
      showToast('Fayl yuklashda xatolik', 'error');
    } finally {
      setUploading(false);
    }
  };

  const resolveUrl = (url?: string) =>
    url ? (url.startsWith('http') ? url : `${API_BASE}${url}`) : '';

  useEffect(() => {
    researchApi
      .get()
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (path: string[], value: string | number) => {
    setStats((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as ResearchStats;
      let obj: any = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
  };

  const setArr = (path: string[], idx: number, value: string | number) => {
    setStats((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as ResearchStats;
      let obj: any = next;
      for (const key of path) obj = obj[key];
      obj[idx] = value;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await researchApi.update(stats);
      showToast("Tadqiqot ma'lumotlari saqlandi", 'success');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Barcha ma'lumotlarni asl holatiga qaytarishni xohlaysizmi?")) {
      setStats(DEFAULT_RESEARCH_STATS);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const reportAreaLabels = ['Bolalar va ta\'lim', 'Tibbiyot va sog\'liqni saqlash', 'Ijtimoiy yordam', 'Favqulodda yordam'];
  const findingsLabels = ['Reytingdagi fondlar soni', 'Platinum darajasidagi fondlar', 'Gold darajasidagi fondlar', 'O\'rtacha indeks ball', 'Oldingi yilga nisbatan o\'sish'];
  const avgLabels = ['2024 yil o\'rtacha', '2025 yil o\'rtacha', '2026 yil o\'rtacha'];
  const growingLabels = ['Raqamli hisobot yuritish', 'Ijtimoiy tarmoq faolligi', 'Donor shaffoflik darajasi', 'Mustaqil audit o\'tkazish'];
  const countryLabels = ['🇰🇿 Qozog\'iston', '🇰🇬 Qirg\'iziston', '🇺🇿 O\'zbekiston', '🇹🇯 Tojikiston', '🇹🇲 Turkmaniston'];
  const globalLabels = ['Dunyo o\'rtacha shaffoflik indeksi', 'Rivojlangan davlatlar o\'rtacha', 'Markaziy Osiyo o\'rtacha', 'O\'zbekiston pozitsiyasi (mintaqada)'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tadqiqot Ma'lumotlari</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Tadqiqot sahifasidagi statistik ko'rsatkichlarni tahrirlash</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Qayta tiklash
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-60 text-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Saqlash
          </button>
        </div>
      </div>

      {/* REPORT FILES */}
      <SectionCard icon={<Download className="w-5 h-5 text-rose-600" />} title="Hisobot fayllari (PDF)" color="bg-rose-50/50">
        <p className="text-xs text-slate-400 font-medium -mt-2">Foydalanuvchilar yuklab oladigan haqiqiy PDF fayllarni yuklang. Har hafta yangilanishi mumkin.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Annual */}
          <div className="space-y-3 p-4 rounded-2xl border-2 border-rose-100 bg-rose-50/40">
            <p className="text-sm font-bold text-slate-700">Yillik Hisobot 2026</p>
            {stats.report.annual_report_url ? (
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-rose-200">
                <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                <a
                  href={resolveUrl(stats.report.annual_report_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 font-medium truncate flex-1 hover:underline"
                >
                  {stats.report.annual_report_url.split('/').pop()}
                </a>
                <button
                  type="button"
                  onClick={() => setStats(p => ({ ...p, report: { ...p.report, annual_report_url: '' } }))}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Fayl yuklanmagan</p>
            )}
            <input ref={annualInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadReport('annual', f); }} />
            <button
              type="button"
              disabled={uploadingAnnual}
              onClick={() => annualInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-all disabled:opacity-60"
            >
              {uploadingAnnual ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploadingAnnual ? 'Yuklanmoqda...' : 'PDF yuklash'}
            </button>
          </div>

          {/* Half-year */}
          <div className="space-y-3 p-4 rounded-2xl border-2 border-cyan-100 bg-cyan-50/40">
            <p className="text-sm font-bold text-slate-700">6 Oylik Hisobot (Yan–Iyn 2026)</p>
            {stats.report.half_year_report_url ? (
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-cyan-200">
                <FileText className="w-4 h-4 text-cyan-500 shrink-0" />
                <a
                  href={resolveUrl(stats.report.half_year_report_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 font-medium truncate flex-1 hover:underline"
                >
                  {stats.report.half_year_report_url.split('/').pop()}
                </a>
                <button
                  type="button"
                  onClick={() => setStats(p => ({ ...p, report: { ...p.report, half_year_report_url: '' } }))}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Fayl yuklanmagan</p>
            )}
            <input ref={halfInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadReport('half', f); }} />
            <button
              type="button"
              disabled={uploadingHalf}
              onClick={() => halfInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm font-bold hover:bg-cyan-700 transition-all disabled:opacity-60"
            >
              {uploadingHalf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploadingHalf ? 'Yuklanmoqda...' : 'PDF yuklash'}
            </button>
          </div>
        </div>
      </SectionCard>

      {/* REPORT */}
      <SectionCard icon={<FileText className="w-5 h-5 text-blue-600" />} title="Yillik hisobot statistikasi" color="bg-blue-50/50">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Asosiy ko'rsatkichlar</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FieldGroup label="Faol fondlar">
              <input
                className={inputCls}
                value={stats.report.statActive}
                onChange={(e) => set(['report', 'statActive'], e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Foyda ko'ruvchilar">
              <input
                className={inputCls}
                value={stats.report.statBeneficiaries}
                onChange={(e) => set(['report', 'statBeneficiaries'], e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Jami mablag'">
              <input
                className={inputCls}
                value={stats.report.statRaised}
                onChange={(e) => set(['report', 'statRaised'], e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="O'rtacha shaffoflik">
              <input
                className={inputCls}
                value={stats.report.statTransparency}
                onChange={(e) => set(['report', 'statTransparency'], e.target.value)}
              />
            </FieldGroup>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Faoliyat sohalari foizi (%)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reportAreaLabels.map((lbl, i) => (
              <FieldGroup key={lbl} label={lbl}>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={inputCls}
                  value={stats.report.areaPcts[i]}
                  onChange={(e) => setArr(['report', 'areaPcts'], i, Number(e.target.value))}
                />
              </FieldGroup>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Asosiy xulosalar qiymatlari</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {findingsLabels.map((lbl, i) => (
              <FieldGroup key={lbl} label={lbl}>
                <input
                  className={inputCls}
                  value={stats.report.findingsValues[i] ?? ''}
                  onChange={(e) => setArr(['report', 'findingsValues'], i, e.target.value)}
                />
              </FieldGroup>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* ANALYSIS */}
      <SectionCard icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} title="Trendlar tahlili statistikasi" color="bg-emerald-50/50">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Asosiy ko'rsatkichlar</p>
          <div className="grid grid-cols-3 gap-4">
            <FieldGroup label="Yangi fondlar">
              <input
                className={inputCls}
                value={stats.analysis.statNewFunds}
                onChange={(e) => set(['analysis', 'statNewFunds'], e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Online hisobotlar">
              <input
                className={inputCls}
                value={stats.analysis.statOnlineReports}
                onChange={(e) => set(['analysis', 'statOnlineReports'], e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Foydalanuvchi reytinglari">
              <input
                className={inputCls}
                value={stats.analysis.statUserRatings}
                onChange={(e) => set(['analysis', 'statUserRatings'], e.target.value)}
              />
            </FieldGroup>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Yil bo'yicha o'rtacha indeks</p>
          <div className="grid grid-cols-3 gap-4">
            {avgLabels.map((lbl, i) => (
              <FieldGroup key={lbl} label={lbl}>
                <input
                  className={inputCls}
                  value={stats.analysis.avgValues[i] ?? ''}
                  onChange={(e) => setArr(['analysis', 'avgValues'], i, e.target.value)}
                />
              </FieldGroup>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Eng ko'p o'sgan yo'nalishlar foizi</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {growingLabels.map((lbl, i) => (
              <FieldGroup key={lbl} label={lbl}>
                <input
                  className={inputCls}
                  value={stats.analysis.growingChanges[i] ?? ''}
                  onChange={(e) => setArr(['analysis', 'growingChanges'], i, e.target.value)}
                />
              </FieldGroup>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* COMPARISON */}
      <SectionCard icon={<Globe className="w-5 h-5 text-violet-600" />} title="Xalqaro taqqoslash statistikasi" color="bg-violet-50/50">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Mintaqa davlatlari indeksi (0–100)</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {countryLabels.map((lbl, i) => (
              <FieldGroup key={lbl} label={lbl}>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={inputCls}
                  value={stats.comparison.countryScores[i]}
                  onChange={(e) => setArr(['comparison', 'countryScores'], i, Number(e.target.value))}
                />
              </FieldGroup>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Global tendentsiyalar qiymatlari</p>
          <div className="grid grid-cols-2 gap-4">
            {globalLabels.map((lbl, i) => (
              <FieldGroup key={lbl} label={lbl}>
                <input
                  className={inputCls}
                  value={stats.comparison.globalValues[i] ?? ''}
                  onChange={(e) => setArr(['comparison', 'globalValues'], i, e.target.value)}
                />
              </FieldGroup>
            ))}
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Saqlash
        </button>
      </div>
    </div>
  );
};
