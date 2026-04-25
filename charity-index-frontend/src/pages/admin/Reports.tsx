import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, Plus, Edit2, Trash2,
  TrendingUp, TrendingDown, CheckCircle2, XCircle, X, Loader2,
  Upload, Paperclip,
} from 'lucide-react';
import { useDataStore } from '@/src/store/useDataStore';
import { useToast } from '@/src/context/ToastContext';
import { reportsApi, Report, ReportType } from '@/src/api/reports';
import { cn } from '@/src/lib/utils';

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  annual: 'Yillik',
  quarterly: 'Choraklik',
  monthly: 'Oylik',
};

const EMPTY_FORM = {
  fund_id: '',
  report_type: 'annual' as ReportType,
  period_start: '',
  period_end: '',
  total_income: '',
  total_expense: '',
  file_url: '' as string,
  is_verified: false,
};

export const AdminReports: React.FC = () => {
  const { showToast } = useToast();
  const { funds, fetchFunds, fundsLoading } = useDataStore();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (funds.length === 0) fetchFunds();
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const { reports } = await reportsApi.getList({ per_page: 100 });
      setReports(reports);
    } catch {
      showToast('Hisobotlarni yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (r: Report) => {
    setForm({
      fund_id: r.fund_id,
      report_type: r.report_type,
      period_start: r.period_start ?? '',
      period_end: r.period_end ?? '',
      total_income: String(r.total_income),
      total_expense: String(r.total_expense),
      file_url: r.file_url ?? '',
      is_verified: r.is_verified,
    });
    setEditingId(r.id);
    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await reportsApi.uploadDocument(file);
      setForm(f => ({ ...f, file_url: url }));
      showToast('Fayl yuklandi', 'success');
    } catch {
      showToast('Fayl yuklashda xatolik', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.fund_id) return showToast('Fond tanlang', 'warning');
    if (!form.total_income) return showToast('Kirimni kiriting', 'warning');

    setSaving(true);
    try {
      const payload = {
        fund_id: form.fund_id,
        report_type: form.report_type,
        period_start: form.period_start || null,
        period_end: form.period_end || null,
        total_income: Number(form.total_income),
        total_expense: Number(form.total_expense),
        file_url: form.file_url || null,
        is_verified: form.is_verified,
      };

      if (editingId) {
        const updated = await reportsApi.update(editingId, payload);
        setReports((prev) => prev.map((r) => (r.id === editingId ? updated : r)));
        showToast('Hisobot yangilandi', 'success');
      } else {
        const created = await reportsApi.create(payload);
        setReports((prev) => [created, ...prev]);
        showToast("Hisobot qo'shildi", 'success');
      }
      setShowForm(false);
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVerify = async (id: string) => {
    try {
      const updated = await reportsApi.toggleVerify(id);
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
      showToast('Holat yangilandi', 'success');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hisobotni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await reportsApi.delete(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      showToast("Hisobot o'chirildi", 'success');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";

  const getFundName = (r: Report) =>
    r.fund?.name_uz ?? funds.find((f) => f.id === r.fund_id)?.name_uz ?? "Noma'lum fond";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Moliyaviy Hisobotlar</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Fondlar tomonidan taqdim etilgan moliyaviy hisobotlarni boshqarish
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Yangi Hisobot
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? 'Hisobotni tahrirlash' : 'Yangi hisobot'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Fund */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Fond</label>
                <select
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  value={form.fund_id}
                  onChange={(e) => setForm((f) => ({ ...f, fund_id: e.target.value }))}
                >
                  <option value="">Fond tanlang...</option>
                  {funds.map((fund) => (
                    <option key={fund.id} value={fund.id}>{fund.name_uz}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Hisobot turi</label>
                <select
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  value={form.report_type}
                  onChange={(e) => setForm((f) => ({ ...f, report_type: e.target.value as ReportType }))}
                >
                  <option value="annual">Yillik</option>
                  <option value="quarterly">Choraklik</option>
                  <option value="monthly">Oylik</option>
                </select>
              </div>

              {/* Period */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Davr boshi</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                    value={form.period_start}
                    onChange={(e) => setForm((f) => ({ ...f, period_start: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Davr oxiri</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                    value={form.period_end}
                    onChange={(e) => setForm((f) => ({ ...f, period_end: e.target.value }))}
                  />
                </div>
              </div>

              {/* Income / Expense */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Jami kirim (so'm)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                    value={form.total_income}
                    onChange={(e) => setForm((f) => ({ ...f, total_income: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Jami chiqim (so'm)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                    value={form.total_expense}
                    onChange={(e) => setForm((f) => ({ ...f, total_expense: e.target.value }))}
                  />
                </div>
              </div>

              {/* File upload */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Hisobot fayli (PDF, Word, Excel)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all disabled:opacity-50"
                  >
                    {uploading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Upload className="w-4 h-4" />}
                    {uploading ? 'Yuklanmoqda...' : 'Fayl tanlash'}
                  </button>
                  {form.file_url && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[160px]">{form.file_url.split('/').pop()}</span>
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, file_url: '' }))}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Verified */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                  checked={form.is_verified}
                  onChange={(e) => setForm((f) => ({ ...f, is_verified: e.target.checked }))}
                />
                <span className="text-sm font-medium text-slate-700">Tasdiqlangan</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
              >
                Bekor
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm font-medium">Yuklanmoqda...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
            <FileText className="w-10 h-10" />
            <span className="text-sm font-medium">Hozircha hisobotlar yo'q</span>
            <button
              onClick={openCreate}
              className="mt-2 px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all"
            >
              Birinchi hisobotni qo'shish
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Fond</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tur / Davr</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Kirim</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Chiqim</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Tasdiqlangan</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{getFundName(report)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                          {REPORT_TYPE_LABELS[report.report_type]}
                        </span>
                        <span className="text-sm font-medium text-slate-500">
                          {report.period_start
                            ? `${report.period_start}${report.period_end ? ' — ' + report.period_end : ''}`
                            : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {formatCurrency(report.total_income)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-rose-600 font-bold text-sm">
                        <TrendingDown className="w-3.5 h-3.5" />
                        {formatCurrency(report.total_expense)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleVerify(report.id)}
                        className={cn(
                          'p-1.5 rounded-lg transition-all',
                          report.is_verified
                            ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-slate-300 bg-slate-50 hover:text-rose-400 hover:bg-rose-50'
                        )}
                        title={report.is_verified ? 'Tasdiqni bekor qilish' : 'Tasdiqlash'}
                      >
                        {report.is_verified
                          ? <CheckCircle2 className="w-5 h-5" />
                          : <XCircle className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(report)}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
