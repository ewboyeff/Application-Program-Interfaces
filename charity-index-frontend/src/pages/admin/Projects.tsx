import React, { useState, useEffect } from 'react';
import {
  FolderOpen, Plus, Search, Edit2, Trash2,
  Calendar, TrendingUp, Users, CheckCircle2,
  Clock, AlertCircle, X, Save, Loader2,
} from 'lucide-react';
import { useDataStore } from '@/src/store/useDataStore';
import { useToast } from '@/src/context/ToastContext';
import { projectsApi, ProjectData } from '@/src/api/projects';
import { cn } from '@/src/lib/utils';

const STATUS_CONFIG = {
  active:    { label: 'Faol',          icon: TrendingUp,   color: 'bg-blue-50 text-blue-600',    dot: 'bg-blue-500' },
  completed: { label: 'Yakunlangan',   icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
  planned:   { label: 'Rejalashtirilgan', icon: Clock,     color: 'bg-amber-50 text-amber-600',  dot: 'bg-amber-500' },
};

interface FormState {
  fund_id: string;
  title_uz: string;
  title_en: string;
  status: 'planned' | 'active' | 'completed';
  budget: string;
  spent: string;
  beneficiaries_count: string;
  start_date: string;
  end_date: string;
  description_uz: string;
  description_en: string;
}

const EMPTY_FORM: FormState = {
  fund_id: '', title_uz: '', title_en: '', status: 'planned',
  budget: '0', spent: '0', beneficiaries_count: '0',
  start_date: '', end_date: '', description_uz: '', description_en: '',
};

export const AdminProjects: React.FC = () => {
  const { showToast } = useToast();
  const { funds } = useDataStore();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading]   = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<ProjectData | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [langTab, setLangTab] = useState<'uz' | 'en'>('uz');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    projectsApi.getList({ per_page: 100 })
      .then(res => setProjects(res.data ?? []))
      .catch(() => showToast('Loyihalarni yuklashda xatolik', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = projects.filter(p =>
    p.title_uz.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, fund_id: funds[0]?.id ?? '' });
    setLangTab('uz');
    setShowModal(true);
  };

  const openEdit = (p: ProjectData) => {
    setEditTarget(p);
    setLangTab('uz');
    setForm({
      fund_id: p.fund_id,
      title_uz: p.title_uz,
      title_en: (p as any).title_en ?? '',
      status: p.status,
      budget: String(p.budget),
      spent: String(p.spent),
      beneficiaries_count: String(p.beneficiaries_count),
      start_date: p.start_date ?? '',
      end_date: p.end_date ?? '',
      description_uz: p.description_uz ?? '',
      description_en: (p as any).description_en ?? '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.fund_id || !form.title_uz.trim()) {
      showToast("Fond va loyiha nomini to'ldiring", 'warning');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        fund_id: form.fund_id,
        title_uz: form.title_uz.trim(),
        title_en: form.title_en.trim() || undefined,
        status: form.status,
        budget: parseFloat(form.budget) || 0,
        spent: parseFloat(form.spent) || 0,
        beneficiaries_count: parseInt(form.beneficiaries_count) || 0,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
        description_uz: form.description_uz || undefined,
        description_en: form.description_en || undefined,
      };
      if (editTarget) {
        const res = await projectsApi.update(editTarget.id, payload);
        setProjects(prev => prev.map(p => p.id === editTarget.id ? res.data : p));
        showToast('Loyiha yangilandi', 'success');
      } else {
        const res = await projectsApi.create(payload);
        setProjects(prev => [res.data, ...prev]);
        showToast("Loyiha qo'shildi", 'success');
      }
      setShowModal(false);
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: ProjectData) => {
    if (!window.confirm(`"${p.title_uz}" loyihasini o'chirmoqchimisiz?`)) return;
    try {
      await projectsApi.delete(p.id);
      setProjects(prev => prev.filter(x => x.id !== p.id));
      showToast("Loyiha o'chirildi", 'success');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const getFundName = (id: string) =>
    funds.find(f => f.id === id)?.name_uz ?? "Noma'lum fond";

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('uz-UZ').format(n) + " so'm";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Loyihalar Boshqaruvi</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Fondlar tomonidan amalga oshirilayotgan loyihalarni boshqarish</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Yangi Loyiha
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Loyiha nomi bo'yicha qidirish..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-600/10 transition-all outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Loyiha</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Fond</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Byudjet</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sarflangan</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Foydalanuvchi</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-slate-300 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <FolderOpen className="w-12 h-12 opacity-20" />
                      <p className="text-sm font-bold">Hech qanday loyiha topilmadi</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(project => {
                  const progress = project.budget > 0
                    ? Math.min(100, Math.round((project.spent / project.budget) * 100))
                    : 0;
                  const cfg = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.planned;
                  return (
                    <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                            <FolderOpen className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{project.title_uz}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-medium">
                              {project.start_date && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {project.start_date}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-600 font-medium">{getFundName(project.fund_id)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          cfg.color
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-900 font-bold">{formatMoney(project.budget)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="text-xs text-slate-600 font-medium">{formatMoney(project.spent)}</span>
                          <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full", progress > 80 ? "bg-emerald-500" : "bg-blue-500")}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="flex items-center justify-center gap-1 text-xs text-slate-600 font-medium">
                          <Users className="w-3 h-3 text-slate-400" />
                          {project.beneficiaries_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(project)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-900">
                  {editTarget ? 'Loyihani tahrirlash' : 'Yangi loyiha'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                {/* Fund */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fond *</label>
                  <select
                    value={form.fund_id}
                    onChange={e => setForm(f => ({ ...f, fund_id: e.target.value }))}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                  >
                    <option value="">— Fondni tanlang —</option>
                    {funds.map(f => (
                      <option key={f.id} value={f.id}>{f.name_uz}</option>
                    ))}
                  </select>
                </div>

                {/* Language tab */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
                  {(['uz', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLangTab(lang)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                        langTab === lang ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      <span>{lang === 'uz' ? '🇺🇿' : '🇺🇸'}</span>
                      {lang === 'uz' ? "O'zbek" : 'English'}
                    </button>
                  ))}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {langTab === 'uz' ? 'Loyiha nomi *' : 'Project name (English)'}
                  </label>
                  {langTab === 'uz' ? (
                    <input
                      type="text"
                      value={form.title_uz}
                      onChange={e => setForm(f => ({ ...f, title_uz: e.target.value }))}
                      placeholder="Loyiha nomi (o'zbek tilida)"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form.title_en}
                      onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))}
                      placeholder="Project name (in English)"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                    />
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                  <div className="flex gap-3">
                    {(['planned', 'active', 'completed'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, status: s }))}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all",
                          form.status === s
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-slate-100 text-slate-500 hover:border-slate-200"
                        )}
                      >
                        {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget + Spent */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Byudjet (so'm)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.budget}
                      onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sarflangan (so'm)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.spent}
                      onChange={e => setForm(f => ({ ...f, spent: e.target.value }))}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Beneficiaries */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Foydalanuvchilar soni</label>
                  <input
                    type="number"
                    min="0"
                    value={form.beneficiaries_count}
                    onChange={e => setForm(f => ({ ...f, beneficiaries_count: e.target.value }))}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Boshlanish sanasi</label>
                    <input
                      type="date"
                      value={form.start_date}
                      onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tugash sanasi</label>
                    <input
                      type="date"
                      value={form.end_date}
                      onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {langTab === 'uz' ? 'Tavsif' : 'Description (English)'}
                  </label>
                  {langTab === 'uz' ? (
                    <textarea
                      value={form.description_uz}
                      onChange={e => setForm(f => ({ ...f, description_uz: e.target.value }))}
                      placeholder="Loyiha haqida qisqacha ma'lumot..."
                      rows={3}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none resize-none"
                    />
                  ) : (
                    <textarea
                      value={form.description_en}
                      onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))}
                      placeholder="Brief description of the project..."
                      rows={3}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none resize-none"
                    />
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
