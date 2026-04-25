import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Save,
  Info,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useToast } from '@/src/context/ToastContext';
import { indexesApi, ApiFactor, FactorsGrouped } from '@/src/api/indexes';
import { cn } from '@/src/lib/utils';

export const AdminIndexes: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [sections, setSections] = useState<FactorsGrouped>({
    transparency: [],
    openness: [],
    trust: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [addingTo, setAddingTo] = useState<keyof FactorsGrouped | null>(null);
  const [newFactor, setNewFactor] = useState({ name_uz: '', name_en: '', weight: 0 });

  useEffect(() => {
    indexesApi.getFactors()
      .then(setSections)
      .catch(() => showToast('Omillarni yuklashda xatolik', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const calculateSum = (factors: ApiFactor[]) =>
    factors.reduce((acc, f) => acc + Number(f.weight), 0);

  const handleWeightSave = async (
    section: keyof FactorsGrouped,
    factor: ApiFactor
  ) => {
    try {
      const updated = await indexesApi.updateFactor(factor.id, { weight: editValue });
      setSections(prev => ({
        ...prev,
        [section]: prev[section].map(f => f.id === factor.id ? { ...f, weight: updated.weight } : f),
      }));
      showToast('Og\'irlik yangilandi', 'success');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
    setEditingId(null);
  };

  const handleToggleActive = async (section: keyof FactorsGrouped, factor: ApiFactor) => {
    try {
      const updated = await indexesApi.updateFactor(factor.id, { is_active: !factor.is_active });
      setSections(prev => ({
        ...prev,
        [section]: prev[section].map(f => f.id === factor.id ? { ...f, is_active: updated.is_active } : f),
      }));
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const handleAddFactor = async (sectionKey: keyof FactorsGrouped) => {
    if (!newFactor.name_uz.trim() || newFactor.weight <= 0) {
      showToast('Omil nomi va og\'irligini kiriting', 'error');
      return;
    }
    try {
      const created = await indexesApi.createFactor({
        index_type: sectionKey,
        name_uz: newFactor.name_uz,
        name_en: newFactor.name_en || undefined,
        weight: newFactor.weight,
        order: sections[sectionKey].length + 1,
      });
      setSections(prev => ({ ...prev, [sectionKey]: [...prev[sectionKey], created] }));
      setNewFactor({ name_uz: '', name_en: '', weight: 0 });
      setAddingTo(null);
      showToast('Omil qo\'shildi', 'success');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const handleDeleteFactor = async (sectionKey: keyof FactorsGrouped, factorId: string) => {
    try {
      await indexesApi.deleteFactor(factorId);
      setSections(prev => ({ ...prev, [sectionKey]: prev[sectionKey].filter(f => f.id !== factorId) }));
      showToast('Omil o\'chirildi', 'success');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const handleRecalculate = () => {
    setIsCalculating(true);
    showToast('Omillar yangilandi. Har bir fond uchun "Indeks hisoblash" tugmasini bosing.', 'success');
    setTimeout(() => setIsCalculating(false), 1500);
  };

  const SectionTable = ({
    title,
    factors,
    sectionKey,
  }: {
    title: string;
    factors: ApiFactor[];
    sectionKey: keyof FactorsGrouped;
  }) => {
    const sum = Math.round(calculateSum(factors));
    const isError = sum !== 100;

    return (
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              sectionKey === 'transparency' ? "bg-blue-50 text-blue-600" :
              sectionKey === 'openness' ? "bg-emerald-50 text-emerald-600" :
              "bg-amber-50 text-amber-600"
            )}>
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          </div>
          <button
            onClick={() => { setAddingTo(sectionKey); setNewFactor({ name_uz: '', name_en: '', weight: 0 }); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Omil qo'shish
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Omil nomi</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Og'irlik %</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Faol</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {factors.map((factor) => (
                <tr key={factor.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700">{factor.name_uz}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingId === factor.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(Number(e.target.value))}
                          className="w-16 bg-white border border-blue-600 rounded-lg py-1 px-2 text-center text-sm font-bold outline-none"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleWeightSave(sectionKey, factor)}
                        />
                        <button onClick={() => handleWeightSave(sectionKey, factor)} className="text-emerald-500">
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingId(factor.id); setEditValue(Number(factor.weight)); }}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {Number(factor.weight)}%
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(sectionKey, factor)}
                      className={cn(
                        "w-10 h-5 rounded-full relative transition-all mx-auto block",
                        factor.is_active ? "bg-emerald-500" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all",
                        factor.is_active ? "left-[22px]" : "left-0.5"
                      )} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditingId(factor.id); setEditValue(Number(factor.weight)); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFactor(sectionKey, factor.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {addingTo === sectionKey && (
                <tr className="border-t bg-blue-50/50">
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      placeholder="Omil nomi (uz)"
                      value={newFactor.name_uz}
                      onChange={e => setNewFactor(p => ({ ...p, name_uz: e.target.value }))}
                      className="w-full border border-blue-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Factor name (en) — ixtiyoriy"
                      value={newFactor.name_en}
                      onChange={e => setNewFactor(p => ({ ...p, name_en: e.target.value }))}
                      className="w-full border border-blue-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500 mt-1"
                    />
                  </td>
                  <td className="px-6 py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="%"
                      value={newFactor.weight || ''}
                      onChange={e => setNewFactor(p => ({ ...p, weight: Number(e.target.value) }))}
                      className="w-16 border border-blue-300 rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-blue-500"
                    />
                  </td>
                  <td colSpan={2} className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleAddFactor(sectionKey)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" /> Saqlash
                      </button>
                      <button
                        onClick={() => setAddingTo(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              <tr className={cn("border-t font-bold", isError ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600")}>
                <td className="px-6 py-3 text-sm">Jami:</td>
                <td className="px-6 py-3 text-center text-sm">{sum}%</td>
                <td colSpan={2} className="px-6 py-3 text-right">
                  {isError ? (
                    <span className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider">
                      <AlertCircle className="w-3 h-3" />
                      Og'irliklar yig'indisi 100% bo'lishi shart
                    </span>
                  ) : (
                    <span className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" />
                      To'g'ri
                    </span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Indeks Omillari</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Fondlar reytingini hisoblash algoritmini boshqarish</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-600" />
          <p className="text-xs font-medium text-blue-900 leading-tight">
            Har bir bo'limdagi omillar og'irligi yig'indisi 100% bo'lishi kerak.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <SectionTable title="Shaffoflik (Transparency × 40%)" factors={sections.transparency} sectionKey="transparency" />
        <SectionTable title="Ochiqlik (Openness × 30%)" factors={sections.openness} sectionKey="openness" />
        <SectionTable title="Ishonchlilik (Trust × 30%)" factors={sections.trust} sectionKey="trust" />
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={handleRecalculate}
          disabled={isCalculating}
          className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all active:scale-95 disabled:bg-blue-400"
        >
          {isCalculating ? (
            <><Loader2 className="w-6 h-6 animate-spin" />Saqlanmoqda...</>
          ) : (
            <><Calculator className="w-6 h-6" />Omillarni saqlash</>
          )}
        </button>
      </div>
    </div>
  );
};
