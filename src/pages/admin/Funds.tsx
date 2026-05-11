import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ap } from '@/src/lib/adminPath';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useDataStore } from '@/src/store/useDataStore';
import { useCategoryStore } from '@/src/store/useCategoryStore';
import { FundAvatar } from '@/src/components/ui/FundAvatar';
import { GradeBadge } from '@/src/components/ui/GradeBadge';
import { fundsApi } from '@/src/api/funds';
import { cn } from '@/src/lib/utils';

export const AdminFunds: React.FC = () => {
  const navigate = useNavigate();
  const { funds, deleteFund, updateFund, fetchFunds } = useDataStore();
  const { categories, fetch: fetchCategories } = useCategoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [recalculating, setRecalculating] = useState<string | null>(null);

  useEffect(() => { fetchCategories(); }, []);

  const filteredFunds = funds
    .filter(fund => {
      const matchesSearch = fund.name_uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           fund.inn.includes(searchQuery);
      const matchesCategory = categoryFilter === 'all' || fund.category === categoryFilter;
      const matchesVerified = verifiedFilter === 'all'
        ? true
        : verifiedFilter === 'verified'
          ? fund.is_verified
          : !fund.is_verified;
      return matchesSearch && matchesCategory && matchesVerified;
    })
    .sort((a, b) => {
      // Tasdiqlanmaganlar yuqorida
      if (!a.is_verified && b.is_verified) return -1;
      if (a.is_verified && !b.is_verified) return 1;
      return 0;
    });

  const toggleSelectAll = () => {
    if (selectedFunds.length === filteredFunds.length) {
      setSelectedFunds([]);
    } else {
      setSelectedFunds(filteredFunds.map(f => f.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedFunds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Rostdan ham "${name}" fondini o'chirmoqchimisiz?`)) return;
    try {
      await fundsApi.delete(id);
      deleteFund(id);
      await fetchFunds();
    } catch (err: any) {
      alert(err?.error?.message || 'Xatolik yuz berdi');
    }
  };

  const toggleVerified = async (id: string, current: boolean) => {
    try {
      await fundsApi.verify(id);
      updateFund(id, { is_verified: true });
      await fetchFunds();
    } catch (err: any) {
      alert(err?.error?.message || 'Xatolik yuz berdi');
    }
  };

  const handleRecalculate = async (id: string) => {
    setRecalculating(id);
    try {
      const updated = await fundsApi.recalculateIndex(id);
      updateFund(id, { indexes: updated.indexes });
    } catch (err: any) {
      alert(err?.error?.message || 'Indeks hisoblashda xatolik');
    } finally {
      setRecalculating(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Fondlar Boshqaruvi</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Platformadagi barcha xayriya fondlarini boshqarish</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" />
            Eksport
          </button>
          <button 
            onClick={() => navigate(ap('/funds/new'))}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Yangi Fond
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Fond nomi yoki INN bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-600/10 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600/10 transition-all outline-none min-w-[160px]"
          >
            <option value="all">Barcha kategoriyalar</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name_uz}>{cat.name_uz}</option>
            ))}
          </select>
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value as 'all' | 'verified' | 'unverified')}
            className="bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600/10 transition-all outline-none min-w-[160px]"
          >
            <option value="all">Barcha fondlar</option>
            <option value="unverified">⏳ Tasdiqlanmagan</option>
            <option value="verified">✅ Tasdiqlangan</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFunds.length > 0 && (
        <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
          <span className="text-sm font-bold">{selectedFunds.length} ta fond tanlandi</span>
          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all">
              Statusni o'zgartirish
            </button>
            <button className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 rounded-lg text-xs font-bold transition-all">
              O'chirish
            </button>
          </div>
        </div>
      )}

      {/* Funds Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedFunds.length === filteredFunds.length && filteredFunds.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Fond</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Kategoriya</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Viloyat</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Indeks</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Daraja</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Tasdiqlangan</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFunds.map((fund) => (
                <tr key={fund.id} className={cn(
                  "hover:bg-slate-50/50 transition-colors group",
                  selectedFunds.includes(fund.id) && "bg-blue-50/30"
                )}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedFunds.includes(fund.id)}
                      onChange={() => toggleSelect(fund.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FundAvatar initials={fund.logo_initials} color={fund.logo_color} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{fund.name_uz}</p>
                        <p className="text-[10px] text-slate-400 font-medium">INN: {fund.inn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                      {fund.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">{fund.region}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-slate-900">{fund.indexes.overall}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <GradeBadge grade={fund.indexes.grade} className="scale-90" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleVerified(fund.id, fund.is_verified)}
                      className={cn(
                        "p-1.5 rounded-lg transition-all",
                        fund.is_verified ? "text-emerald-500 bg-emerald-50" : "text-slate-300 bg-slate-50 hover:text-rose-500 hover:bg-rose-50"
                      )}
                    >
                      {fund.is_verified ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Faol
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRecalculate(fund.id)}
                        disabled={recalculating === fund.id}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-50"
                        title="Indeksni qayta hisoblash"
                      >
                        <RefreshCw className={cn("w-4 h-4", recalculating === fund.id && "animate-spin")} />
                      </button>
                      <a
                        href={`/funds/${fund.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Ko'rish"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => navigate(ap(`/funds/${fund.id}`))}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fund.id, fund.name_uz)}
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

        {/* Pagination */}
        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Jami {filteredFunds.length} tadan 1-10 ko'rsatilmoqda
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all">2</button>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
