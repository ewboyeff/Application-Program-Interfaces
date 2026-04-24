import React, { useState, useRef } from 'react';
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Star,
  Clock,
  X,
  Save,
  Loader2,
  ImageIcon,
  Upload,
  Link as LinkIcon,
} from 'lucide-react';
import { useDataStore } from '@/src/store/useDataStore';
import { News } from '@/src/types';
import { useToast } from '@/src/context/ToastContext';
import { newsApi } from '@/src/api/news';
import { cn, API_BASE, assetUrl } from '@/src/lib/utils';
import { getAdminToken } from '@/src/api/client';

const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-sky-600',
];

const EMPTY_FORM = {
  title_uz: '',
  title_en: '',
  content: '',
  content_en: '',
  fundId: '',
  image_url: '',
  source_url: '',
  gradient: GRADIENTS[0],
  read_time: 3,
  is_featured: false,
  active: true,
};

export const AdminNews: React.FC = () => {
  const { showToast } = useToast();
  const { news, funds, addNews, deleteNews, updateNews } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [langTab, setLangTab] = useState<'uz' | 'en'>('uz');
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BASE_URL = API_BASE;

  const filteredNews = news.filter(n =>
    (n.title_uz || n.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFundName = (id?: string | null) => {
    if (!id) return 'Umumiy';
    return funds.find(f => f.id === id)?.name_uz || 'Umumiy';
  };

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setLangTab('uz');
    setImagePreview(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (item: News) => {
    setEditingId(item.id);
    setLangTab('uz');
    setForm({
      title_uz: item.title_uz || item.title || '',
      title_en: item.title_en || '',
      content: item.content || '',
      content_en: item.content_en || '',
      fundId: item.fundId || '',
      image_url: (item as any).image_url || '',
      source_url: (item as any).source_url || '',
      gradient: item.gradient || GRADIENTS[0],
      read_time: item.read_time || 3,
      is_featured: item.is_featured || false,
      active: item.active,
    });
    const existingImg = (item as any).image_url;
    setImagePreview(assetUrl(existingImg) ?? null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setIsUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const token = getAdminToken();
      const res = await fetch(`${BASE_URL}/api/v1/uploads/image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw json;
      setForm(p => ({ ...p, image_url: json.data.url }));
      showToast('Rasm yuklandi', 'success');
    } catch {
      showToast('Rasm yuklashda xatolik', 'error');
      setImagePreview(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!form.title_uz.trim()) {
      showToast('Sarlavha majburiy', 'error');
      return;
    }
    if (!form.content.trim()) {
      showToast('Matn majburiy', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        title_uz: form.title_uz.trim(),
        title_en: form.title_en.trim() || undefined,
        content: form.content.trim(),
        content_en: form.content_en.trim() || undefined,
        fundId: form.fundId || undefined,
        image_url: form.image_url || undefined,
        source_url: form.source_url || undefined,
        gradient: form.gradient,
        read_time: form.read_time,
        is_featured: form.is_featured,
        active: form.active,
      };

      if (editingId) {
        const updated = await newsApi.update(editingId, payload);
        updateNews(editingId, updated);
        showToast('Yangilik yangilandi', 'success');
      } else {
        const created = await newsApi.create(payload);
        addNews(created);
        showToast("Yangilik qo'shildi", 'success');
      }
      setShowForm(false);
    } catch (err: any) {
      showToast(err?.error?.message || 'Xatolik yuz berdi', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Rostdan ham "${title}" yangiligini o'chirmoqchimisiz?`)) return;
    try {
      await newsApi.delete(id);
      deleteNews(id);
      showToast("Yangilik o'chirildi", 'success');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      await newsApi.update(id, { active: !current });
      updateNews(id, { active: !current });
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Yangiliklar Boshqaruvi</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Platformadagi yangiliklar va maqolalarni boshqarish</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Yangi Yangilik
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-lg p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? 'Yangilikni tahrirlash' : 'Yangi yangilik qo\'shish'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language tab switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
            {(['uz', 'en'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLangTab(lang)}
                className={cn(
                  "flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-bold transition-all",
                  langTab === lang ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <span>{lang === 'uz' ? '🇺🇿' : '🇺🇸'}</span>
                {lang === 'uz' ? "O'zbek" : 'English'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              {langTab === 'uz' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Sarlavha (O'zbek) *</label>
                    <input
                      type="text"
                      value={form.title_uz}
                      onChange={e => setForm(p => ({ ...p, title_uz: e.target.value }))}
                      placeholder="Yangilik sarlavhasi..."
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2.5 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Matn (O'zbek) *</label>
                    <textarea
                      rows={7}
                      value={form.content}
                      onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                      placeholder="Yangilik matni..."
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2.5 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Title (English)</label>
                    <input
                      type="text"
                      value={form.title_en}
                      onChange={e => setForm(p => ({ ...p, title_en: e.target.value }))}
                      placeholder="News headline..."
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2.5 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Content (English)</label>
                    <textarea
                      rows={7}
                      value={form.content_en}
                      onChange={e => setForm(p => ({ ...p, content_en: e.target.value }))}
                      placeholder="News content..."
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2.5 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Fond (ixtiyoriy)</label>
                <select
                  value={form.fundId}
                  onChange={e => setForm(p => ({ ...p, fundId: e.target.value }))}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2.5 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none transition-all"
                >
                  <option value="">Umumiy (fondga bog'lanmagan)</option>
                  {funds.map(f => (
                    <option key={f.id} value={f.id}>{f.name_uz}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Image upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-400" /> Yangilik rasmi
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-800 rounded-xl text-sm font-bold shadow-lg"
                      >
                        <Upload className="w-4 h-4" />
                        O'zgartirish
                      </button>
                      <button
                        type="button"
                        onClick={() => { setImagePreview(null); setForm(p => ({ ...p, image_url: '' })); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-lg"
                      >
                        <X className="w-4 h-4" />
                        O'chirish
                      </button>
                    </div>
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all disabled:opacity-50"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-7 h-7" />
                        <span className="text-sm font-bold">Rasm yuklash</span>
                        <span className="text-xs">JPG, PNG, WebP · max 10 MB</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Source URL */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-slate-400" /> Manba havolasi (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={form.source_url}
                  onChange={e => setForm(p => ({ ...p, source_url: e.target.value }))}
                  placeholder="https://kun.uz/..."
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2.5 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none transition-all"
                />
                <p className="text-[11px] text-slate-400 font-medium ml-1">Yangilik ko'rinishida "Manba" tugmasi sifatida chiqadi</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">O'qish vaqti (daqiqa)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={form.read_time}
                  onChange={e => setForm(p => ({ ...p, read_time: Number(e.target.value) }))}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2.5 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Gradient rangi</label>
                <div className="flex flex-wrap gap-2">
                  {GRADIENTS.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, gradient: g }))}
                      className={cn(
                        `w-8 h-8 rounded-lg bg-gradient-to-br ${g} transition-all`,
                        form.gradient === g ? 'ring-2 ring-offset-2 ring-blue-600 scale-110' : 'opacity-60 hover:opacity-100'
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, is_featured: !p.is_featured }))}
                    className={cn(
                      'w-10 h-5 rounded-full relative transition-all',
                      form.is_featured ? 'bg-amber-400' : 'bg-slate-200'
                    )}
                  >
                    <div className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all', form.is_featured ? 'left-[22px]' : 'left-0.5')} />
                  </button>
                  <span className="text-sm font-bold text-slate-700">Asosiy yangilik</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, active: !p.active }))}
                    className={cn(
                      'w-10 h-5 rounded-full relative transition-all',
                      form.active ? 'bg-emerald-500' : 'bg-slate-200'
                    )}
                  >
                    <div className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all', form.active ? 'left-[22px]' : 'left-0.5')} />
                  </button>
                  <span className="text-sm font-bold text-slate-700">Faol</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Sarlavha bo'yicha qidirish..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-600/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* News Table */}
      {filteredNews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">
            {searchQuery ? 'Qidiruv bo\'yicha natija topilmadi' : 'Hali yangiliklar qo\'shilmagan'}
          </p>
          {!searchQuery && (
            <button onClick={openNew} className="mt-4 text-blue-600 text-sm font-bold hover:underline">
              + Birinchi yangilikni qo'shish
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sarlavha</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Fond</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sana</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Faol</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredNews.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-xl shrink-0 bg-gradient-to-br', item.gradient || 'from-blue-500 to-indigo-600')} />
                        <div>
                          <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {item.title_uz || item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.read_time} daqiqa
                            </span>
                            {item.is_featured && (
                              <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                                <Star className="w-3 h-3 fill-amber-500" />
                                Asosiy
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 font-medium">{getFundName(item.fundId)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date ? new Date(item.date).toLocaleDateString('uz-UZ') : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleStatus(item.id, item.active)}
                        className={cn(
                          'p-1.5 rounded-lg transition-all',
                          item.active ? 'text-emerald-500 bg-emerald-50' : 'text-slate-300 bg-slate-50 hover:text-rose-500 hover:bg-rose-50'
                        )}
                      >
                        {item.active ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title_uz || item.title)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
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
        </div>
      )}
    </div>
  );
};
