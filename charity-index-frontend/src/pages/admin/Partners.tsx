import React, { useState, useEffect, useRef } from 'react';
import {
  Handshake,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  Loader2,
  Globe,
  GripVertical,
  ImageIcon,
} from 'lucide-react';
import { useToast } from '@/src/context/ToastContext';
import { partnersApi, Partner, resolveLogoUrl } from '@/src/api/partners';
import { cn, API_BASE } from '@/src/lib/utils';
import { getAdminToken } from '@/src/api/client';

const EMPTY_FORM = { name: '', logo_url: '', website_url: '', is_active: true, order_index: 0 };

export const AdminPartners: React.FC = () => {
  const { showToast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const data = await partnersApi.listAll();
      setPartners(data);
    } catch {
      showToast('Hamkorlarni yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setLogoPreview(null);
    setShowForm(true);
  };

  const openEdit = (p: Partner) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      logo_url: p.logo_url ?? '',
      website_url: p.website_url ?? '',
      is_active: p.is_active,
      order_index: p.order_index,
    });
    setLogoPreview(resolveLogoUrl(p.logo_url));
    setShowForm(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    setIsUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const token = getAdminToken();
      const res = await fetch(`${API_BASE}/api/v1/uploads/logo`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw json;
      setForm(prev => ({ ...prev, logo_url: json.data.url }));
      showToast('Rasm yuklandi', 'success');
    } catch {
      showToast('Rasm yuklashda xatolik', 'error');
      setLogoPreview(null);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { showToast('Hamkor nomi majburiy', 'error'); return; }
    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        logo_url: form.logo_url || undefined,
        website_url: form.website_url || undefined,
        is_active: form.is_active,
        order_index: form.order_index,
      };
      if (editingId) {
        const updated = await partnersApi.update(editingId, payload);
        setPartners(prev => prev.map(p => p.id === editingId ? updated : p));
        showToast('Hamkor yangilandi', 'success');
      } else {
        const created = await partnersApi.create(payload);
        setPartners(prev => [...prev, created]);
        showToast('Hamkor qo\'shildi', 'success');
      }
      setShowForm(false);
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (p: Partner) => {
    if (!window.confirm(`"${p.name}" hamkorini o'chirmoqchimisiz?`)) return;
    try {
      await partnersApi.delete(p.id);
      setPartners(prev => prev.filter(x => x.id !== p.id));
      showToast('Hamkor o\'chirildi', 'success');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const handleToggleActive = async (p: Partner) => {
    try {
      const updated = await partnersApi.update(p.id, { is_active: !p.is_active });
      setPartners(prev => prev.map(x => x.id === p.id ? updated : x));
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hamkorlar</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            "Bizning hamkorlarimiz" bo'limini boshqarish
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Hamkor qo'shish
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-lg p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? 'Hamkorni tahrirlash' : 'Yangi hamkor'}
            </h2>
            <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Logo */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Logotip</label>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <ImageIcon className="w-7 h-7 text-slate-300" />
                  )}
                </div>
                <div className="space-y-2">
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" onChange={handleLogoUpload} />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all disabled:opacity-60"
                  >
                    {isUploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {isUploadingLogo ? 'Yuklanmoqda...' : 'Rasm yuklash'}
                  </button>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={() => { setLogoPreview(null); setForm(p => ({ ...p, logo_url: '' })); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="flex items-center gap-1 text-xs text-rose-500 font-bold hover:text-rose-700 transition-colors"
                    >
                      <X className="w-3 h-3" /> Olib tashlash
                    </button>
                  )}
                  <p className="text-[11px] text-slate-400">JPG, PNG, WebP, SVG · max 5 MB</p>
                </div>
              </div>
            </div>

            {/* Right: Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Hamkor nomi *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Masalan: UNICEF Uzbekistan"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2.5 px-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Veb-sayt URL</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={form.website_url}
                    onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))}
                    placeholder="https://example.uz"
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Tartib raqami</label>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={e => setForm(p => ({ ...p, order_index: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-2.5 px-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Holat</label>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
                    className={cn(
                      'w-full py-2.5 rounded-xl text-sm font-bold border-2 transition-all',
                      form.is_active
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    )}
                  >
                    {form.is_active ? 'Faol' : 'Nofaol'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
              Bekor qilish
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Saqlash
            </button>
          </div>
        </div>
      )}

      {/* Partners List */}
      {partners.length === 0 ? (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-16 text-center">
          <Handshake className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Hali hamkorlar qo'shilmagan</p>
          <button onClick={openNew} className="mt-4 text-blue-600 text-sm font-bold hover:underline">
            + Birinchi hamkorni qo'shish
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider w-8"></th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Hamkor</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Veb-sayt</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Tartib</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Holat</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {partners.map(p => (
                <tr key={p.id} className={cn('hover:bg-slate-50/50 transition-colors', !p.is_active && 'opacity-50')}>
                  <td className="px-3 py-4">
                    <GripVertical className="w-4 h-4 text-slate-300" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                        {p.logo_url ? (
                          <img src={resolveLogoUrl(p.logo_url)!} alt={p.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Handshake className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {p.website_url ? (
                      <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-medium truncate max-w-[200px] block">
                        {p.website_url.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-slate-300 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-slate-600">{p.order_index}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className={cn(
                        'w-10 h-5 rounded-full relative transition-all mx-auto block',
                        p.is_active ? 'bg-emerald-500' : 'bg-slate-200'
                      )}
                    >
                      <div className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all', p.is_active ? 'left-[22px]' : 'left-0.5')} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
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
  );
};
