import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ap } from '@/src/lib/adminPath';
import {
  ArrowLeft,
  Save,
  Globe,
  Send,
  Instagram,
  CheckCircle2,
  Calculator,
  Info,
  Link as LinkIcon,
  BarChart,
  Loader2,
  Upload,
  X,
  ImageIcon,
} from 'lucide-react';
import { useDataStore } from '@/src/store/useDataStore';
import { Fund } from '@/src/types';
import { useToast } from '@/src/context/ToastContext';
import { fundsApi } from '@/src/api/funds';
import { indexesApi, FactorsGrouped } from '@/src/api/indexes';
import { getAdminToken } from '@/src/api/client';
import { useCategoryStore } from '@/src/store/useCategoryStore';
import { cn, API_BASE, assetUrl } from '@/src/lib/utils';

export const AdminFundEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { funds, addFund, updateFund, fetchFunds } = useDataStore();
  
  const isEdit = !!id;
  const fund = funds.find(f => f.id === id);
  const { categories, regions, fetch: fetchCats, categoryIdByName, regionIdByName } = useCategoryStore();

  useEffect(() => { fetchCats(); }, []);

  const [activeTab, setActiveTab] = useState('basic');
  const [langTab, setLangTab] = useState<'uz' | 'en'>('uz');
  const [factors, setFactors] = useState<FactorsGrouped>({ transparency: [], openness: [], trust: [] });
  const [factorScores, setFactorScores] = useState<Record<string, number>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    indexesApi.getFactors().then(setFactors).catch(() => {});
  }, []);
  const [formData, setFormData] = useState<Fund>({
    id: '',
    slug: '',
    name_uz: '',
    name_ru: '',
    name_en: '',
    category: 'Ta\'lim',
    region: 'Toshkent',
    director: '',
    founded_year: new Date().getFullYear(),
    inn: '',
    registration: '',
    description_uz: '',
    logo_initials: '',
    logo_color: '#1A56DB',
    website: '',
    telegram: '',
    instagram: '',
    donation_url: '',
    is_verified: false,
    indexes: {
      transparency: 0,
      openness: 0,
      trust: 0,
      overall: 0,
      grade: 'unrated'
    },
    projects_count: 0,
    beneficiaries: 0,
    total_income: 0,
    total_spent: 0
  });

  useEffect(() => {
    if (isEdit && fund) {
      setFormData(fund);
      if (fund.logo_url) {
        setLogoPreview(assetUrl(fund.logo_url) ?? null);
      }
    }
  }, [isEdit, fund]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Live preview calculation (client-side only)
  const preview = useMemo(() => {
    const calcType = (typeFactors: typeof factors.transparency) =>
      typeFactors.reduce((acc, f) => acc + (factorScores[f.id] ?? 0) * Number(f.weight) / 100, 0);

    const t = calcType(factors.transparency);
    const o = calcType(factors.openness);
    const tr = calcType(factors.trust);
    const overall = Math.round(t * 0.4 + o * 0.3 + tr * 0.3);

    let grade = 'unrated';
    if (overall >= 90) grade = 'platinum';
    else if (overall >= 75) grade = 'gold';
    else if (overall >= 60) grade = 'silver';
    else if (overall >= 45) grade = 'bronze';

    return { transparency: Math.round(t), openness: Math.round(o), trust: Math.round(tr), overall, grade };
  }, [factors, factorScores]);

  const handleCalculate = async () => {
    if (!isEdit || !id) {
      showToast('Avval fondni saqlang, keyin indeksni hisoblang', 'error');
      return;
    }
    const scores = Object.entries(factorScores)
      .filter(([, score]) => (score as number) > 0)
      .map(([factor_id, score]) => ({ factor_id, score: score as number }));

    if (scores.length === 0) {
      showToast('Hech bo\'lmaganda bitta omil uchun ball kiriting', 'error');
      return;
    }

    setIsCalculating(true);
    try {
      const result = await indexesApi.calculateIndex(id, scores);
      updateFund(id, {
        indexes: {
          transparency: Number(result.transparency_score ?? result.transparency ?? 0),
          openness: Number(result.openness_score ?? result.openness ?? 0),
          trust: Number(result.trust_score ?? result.trust ?? 0),
          overall: Number(result.overall_score ?? result.overall ?? 0),
          grade: result.grade ?? 'unrated',
        },
      });
      showToast(`Indeks saqlandi: ${result.overall_score ?? result.overall ?? 0} (${(result.grade ?? 'unrated').toUpperCase()})`, 'success');
    } catch (err: any) {
      showToast(err?.error?.message || 'Indeks hisoblashda xatolik', 'error');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);

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
      const url: string = json.data.url;
      setFormData((prev: any) => ({ ...prev, logo_url: url }));
      showToast('Rasm yuklandi', 'success');
    } catch {
      showToast('Rasm yuklashda xatolik', 'error');
      setLogoPreview(null);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const category_id = categoryIdByName(formData.category) ?? undefined;
    const region_id = regionIdByName(formData.region) ?? undefined;

    const payload = {
      name_uz: formData.name_uz,
      name_en: formData.name_en || undefined,
      description_uz: formData.description_uz || undefined,
      description_en: (formData as any).description_en || undefined,
      director_name: formData.director || undefined,
      founded_year: formData.founded_year || undefined,
      logo_url: formData.logo_url || undefined,
      logo_initials: formData.logo_initials || undefined,
      logo_color: formData.logo_color || undefined,
      website_url: formData.website || undefined,
      telegram_url: formData.telegram || undefined,
      instagram_url: formData.instagram || undefined,
      donation_url: (formData as any).donation_url || undefined,
      category_id,
      region_id,
    };

    try {
      if (isEdit) {
        const updated = await fundsApi.update(id!, payload);
        updateFund(id!, updated);
        showToast('Fond muvaffaqiyatli yangilandi', 'success');
      } else {
        const created = await fundsApi.create(payload);
        addFund(created);
        showToast('Yangi fond muvaffaqiyatli qo\'shildi', 'success');
      }
      fetchFunds();
      navigate(ap('/funds'));
    } catch (err: any) {
      showToast(err?.error?.message || 'Xatolik yuz berdi', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(ap('/funds'))}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isEdit ? 'Fondni Tahrirlash' : 'Yangi Fond Qo\'shish'}
            </h1>
            <p className="text-slate-500 text-sm font-medium">Fond ma'lumotlarini to'ldiring va saqlang</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(ap('/funds'))}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Bekor qilish
          </button>
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Saqlash
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'basic', label: 'Asosiy Ma\'lumotlar', icon: Info },
          { id: 'media', label: 'Media va Havolalar', icon: LinkIcon },
          { id: 'index', label: 'Indeks Ballari', icon: BarChart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 lg:p-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Tab 1: Basic Info */}
          {activeTab === 'basic' && (
            <div className="space-y-8 animate-in fade-in duration-300">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {langTab === 'uz' ? (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Fond nomi (O'zbek) *</label>
                      <input
                        type="text"
                        name="name_uz"
                        value={formData.name_uz}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Fund name (English)</label>
                      <input
                        type="text"
                        name="name_en"
                        value={formData.name_en}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Kategoriya</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                    >
                      {categories.length > 0
                        ? categories.map(c => <option key={c.id} value={c.name_uz}>{c.name_uz}</option>)
                        : <option value={formData.category}>{formData.category}</option>}
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Rahbar ismi</label>
                    <input
                      type="text"
                      name="director"
                      value={formData.director}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Tashkil yili</label>
                      <input
                        type="number"
                        name="founded_year"
                        value={formData.founded_year}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Viloyat</label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                    >
                      {regions.length > 0
                        ? regions.map(r => <option key={r.id} value={r.name_uz}>{r.name_uz}</option>)
                        : <option value={formData.region}>{formData.region}</option>}
                    </select>
                  </div>
                </div>
              </div>
              {langTab === 'uz' ? (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Tavsif (O'zbek)</label>
                  <textarea
                    name="description_uz"
                    value={formData.description_uz}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none resize-none"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Description (English)</label>
                  <textarea
                    name="description_en"
                    value={(formData as any).description_en ?? ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none resize-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Media & Links */}
          {activeTab === 'media' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Logo Upload */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1">Fond logotipi</label>
                <div className="flex items-center gap-6">
                  {/* Preview box */}
                  <div
                    className="w-24 h-24 rounded-[20px] flex items-center justify-center border-2 border-dashed overflow-hidden shrink-0 transition-all"
                    style={{
                      backgroundColor: logoPreview ? 'transparent' : `${formData.logo_color}15`,
                      borderColor: logoPreview ? formData.logo_color : `${formData.logo_color}50`,
                    }}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 border-2 border-blue-200 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all disabled:opacity-60"
                    >
                      {isUploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {isUploadingLogo ? 'Yuklanmoqda...' : 'Rasm yuklash'}
                    </button>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null);
                          setFormData((prev: any) => ({ ...prev, logo_url: undefined }));
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="flex items-center gap-1.5 text-xs text-rose-500 font-bold hover:text-rose-700 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Rasmni olib tashlash
                      </button>
                    )}
                    <p className="text-[11px] text-slate-400 font-medium">JPG, PNG yoki WebP · Maksimal 5 MB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Veb-sayt</label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="example.uz"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Telegram</label>
                    <div className="relative group">
                      <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        name="telegram"
                        value={formData.telegram}
                        onChange={handleChange}
                        placeholder="t.me/example"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Instagram</label>
                    <div className="relative group">
                      <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        placeholder="instagram.com/example"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      ❤️ Xayriya havolasi
                      <span className="ml-2 text-[10px] font-normal text-slate-400 normal-case">"Xayriya" tugmasi bosganda ochiladi</span>
                    </label>
                    <div className="relative group">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="url"
                        name="donation_url"
                        value={(formData as any).donation_url ?? ''}
                        onChange={handleChange}
                        placeholder="https://donate.example.uz/fond-nomi"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        formData.is_verified ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"
                      )}>
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Fond tasdiqlangan</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Verified status</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData((prev: any) => ({ ...prev, is_verified: !prev.is_verified }))}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all duration-300",
                        formData.is_verified ? "bg-emerald-500" : "bg-slate-300"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                        formData.is_verified ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Index Scores */}
          {activeTab === 'index' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {!isEdit && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm text-amber-700 font-medium">
                  Indeks ballari faqat mavjud fondlar uchun kiritiladi. Avval fondni saqlang.
                </div>
              )}

              {/* Formula preview */}
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Shaffoflik ×40%', value: preview.transparency, color: 'blue' },
                  { label: 'Ochiqlik ×30%', value: preview.openness, color: 'emerald' },
                  { label: 'Ishonchlilik ×30%', value: preview.trust, color: 'amber' },
                ].map(({ label, value, color }) => (
                  <div key={label} className={cn(
                    "rounded-2xl p-4 border",
                    color === 'blue' ? 'bg-blue-50 border-blue-100' :
                    color === 'emerald' ? 'bg-emerald-50 border-emerald-100' :
                    'bg-amber-50 border-amber-100'
                  )}>
                    <div className={cn(
                      "text-2xl font-black",
                      color === 'blue' ? 'text-blue-600' :
                      color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'
                    )}>{value}</div>
                    <div className="text-xs font-bold text-slate-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>

              {/* Per-factor inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { key: 'transparency' as const, label: 'Shaffoflik', dot: 'bg-blue-500' },
                  { key: 'openness' as const, label: 'Ochiqlik', dot: 'bg-emerald-500' },
                  { key: 'trust' as const, label: 'Ishonchlilik', dot: 'bg-amber-500' },
                ].map(({ key, label, dot }) => (
                  <div key={key} className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', dot)} />
                      {label}
                    </h4>
                    <div className="space-y-2">
                      {factors[key].map(f => (
                        <div key={f.id} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                          <span className="flex-1 text-xs text-slate-600 font-medium truncate">{f.name_uz}</span>
                          <span className="text-[10px] text-slate-400 font-bold shrink-0">{Number(f.weight)}%</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={factorScores[f.id] ?? ''}
                            onChange={(e) => {
                              const v = Math.min(100, Math.max(0, Number(e.target.value)));
                              setFactorScores(prev => ({ ...prev, [f.id]: v }));
                            }}
                            placeholder="0"
                            className="w-14 bg-white border border-slate-200 rounded-lg py-1 px-2 text-center text-sm font-bold outline-none focus:border-blue-500"
                          />
                        </div>
                      ))}
                      {factors[key].length === 0 && (
                        <div className="text-xs text-slate-400 py-2">Yuklanmoqda...</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall result + save */}
              <div className="p-6 bg-blue-50 rounded-[24px] border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl shadow-sm border border-blue-100">
                    {preview.overall}
                  </div>
                  <div>
                    <p className="text-blue-900 font-bold text-lg">Umumiy Indeks (oldindan ko'rish)</p>
                    <p className="text-blue-600/70 text-sm font-medium">
                      T×40% + O×30% + I×30% = <span className="font-bold text-blue-700">{preview.overall}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">Daraja</p>
                    <p className="text-blue-600 font-black text-xl uppercase">{preview.grade}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCalculate}
                    disabled={isCalculating || !isEdit}
                    className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {isCalculating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
                    {isCalculating ? 'Saqlanmoqda...' : 'Hisoblash va Saqlash'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
