import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, Trash2, ChevronRight, Plus, Search, X, ArrowLeft, Scale } from 'lucide-react';
import { Layout } from '@/src/components/layout/Layout';
import { useCompareStore } from '@/src/store/compareStore';
import { useDataStore } from '@/src/store/useDataStore';
import { useToast } from '@/src/context/ToastContext';
import { FundAvatar } from '@/src/components/ui/FundAvatar';
import { GradeBadge } from '@/src/components/ui/GradeBadge';
import { Fund } from '@/src/types';
import { CompareRadar } from '@/src/components/compare/CompareRadar';
import { CompareTable } from '@/src/components/compare/CompareTable';
import { assetUrl } from '@/src/lib/utils';

function resolveLogoUrl(url?: string | null): string | undefined {
  return assetUrl(url);
}

function AddFundDropdown({ onAdd }: { onAdd: (fund: Fund) => void }) {
  const { funds, fetchFunds, fundsLoading } = useDataStore();
  const { selectedFunds } = useCompareStore();
  const { t } = useTranslation('compare');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (funds.length === 0 && !fundsLoading) fetchFunds();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results = funds
    .filter(f => f.name_uz.toLowerCase().includes(search.toLowerCase()) && !selectedFunds.some(sf => sf.id === f.id))
    .slice(0, 6);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-1.5 px-3 py-2 border-2 border-dashed border-slate-300 text-slate-500 text-sm font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
      >
        <Plus className="w-4 h-4" /> {t('addFund')}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-lg outline-none placeholder:text-slate-400 text-slate-800"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          {fundsLoading ? (
            <div className="p-6 text-center text-slate-400 text-sm">{t('loading')}</div>
          ) : results.length > 0 ? (
            <div className="py-1 max-h-64 overflow-y-auto">
              {results.map(fund => (
                <div
                  key={fund.id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => { onAdd(fund); setOpen(false); setSearch(''); }}
                >
                  <FundAvatar initials={fund.logo_initials} color={fund.logo_color} size="sm" imageUrl={resolveLogoUrl(fund.logo_url)} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-800 truncate">{fund.name_uz}</div>
                    <GradeBadge grade={fund.indexes.grade} className="scale-75 origin-left" />
                  </div>
                  <span className="text-sm font-black text-blue-600 shrink-0">{fund.indexes.overall}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-sm">{t('notFound')}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Compare() {
  const { selectedFunds, clearFunds, addFund, removeFund } = useCompareStore();
  const { showToast } = useToast();
  const { t } = useTranslation('compare');
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (selectedFunds.length >= 2) setShowResults(true);
  }, []);

  useEffect(() => {
    if (selectedFunds.length < 2) setShowResults(false);
  }, [selectedFunds.length]);

  const handleAdd = (fund: Fund) => {
    const result = addFund(fund);
    showToast(result.message, result.success ? 'success' : 'warning');
  };

  const canCompare = selectedFunds.length >= 2;

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-blue-200 mb-3">
            <Link to="/" className="hover:text-white transition-colors">{t('breadcrumb.home')}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{t('breadcrumb.compare')}</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black leading-tight">{t('title')}</h1>
              <p className="text-blue-200 text-sm mt-2">{t('subtitle')}</p>
            </div>
            <Link to="/funds" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all">
              <ArrowLeft className="w-4 h-4" /> {t('catalog')}
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">

          {/* Fund Selection Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('selected')}</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-black rounded-full">{selectedFunds.length}/3</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Fund slots */}
              {[0, 1, 2].map(i => {
                const fund = selectedFunds[i];
                if (fund) {
                  return (
                    <div key={fund.id} className="flex items-center gap-2.5 pl-2 pr-3 py-2 bg-blue-50 border border-blue-200 rounded-2xl">
                      <FundAvatar initials={fund.logo_initials} color={fund.logo_color} size="xs" imageUrl={resolveLogoUrl(fund.logo_url)} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate max-w-[100px]">{fund.name_uz}</p>
                        <p className="text-[10px] font-black text-blue-600">{fund.indexes.overall} {t('totalScore')}</p>
                      </div>
                      <button onClick={() => removeFund(fund.id)} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                }
                return (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                    <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center">
                      <Plus className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-medium">{t('slot', { num: i + 1 })}</span>
                  </div>
                );
              })}

              {selectedFunds.length < 3 && (
                <AddFundDropdown onAdd={handleAdd} />
              )}

              <div className="ml-auto flex items-center gap-2">
                {selectedFunds.length > 0 && (
                  <button
                    onClick={() => { clearFunds(); setShowResults(false); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-red-500 text-sm font-bold hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" /> {t('clear')}
                  </button>
                )}
                {canCompare && (
                  <button
                    onClick={() => setShowResults(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/30"
                  >
                    <Scale className="w-4 h-4" /> {t('compare')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          {showResults && canCompare ? (
            <div className="space-y-5">

              {/* Fund Summary Cards */}
              <div className={`grid gap-4 ${selectedFunds.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {selectedFunds.map((fund, i) => {
                  const colors = ['bg-blue-600', 'bg-emerald-500', 'bg-amber-500'];
                  const borderColors = ['border-blue-200', 'border-emerald-200', 'border-amber-200'];
                  const bgColors = ['bg-blue-50', 'bg-emerald-50', 'bg-amber-50'];
                  return (
                    <div key={fund.id} className={`bg-white rounded-2xl border-2 ${borderColors[i]} shadow-sm overflow-hidden`}>
                      <div className={`${colors[i]} px-5 py-3 flex items-center gap-3`}>
                        <FundAvatar initials={fund.logo_initials} color={fund.logo_color} size="sm" imageUrl={resolveLogoUrl(fund.logo_url)} className="border-2 border-white/30" />
                        <div className="min-w-0">
                          <p className="text-white font-bold text-sm truncate">{fund.name_uz}</p>
                          <GradeBadge grade={fund.indexes.grade} className="scale-75 origin-left" />
                        </div>
                      </div>
                      <div className={`${bgColors[i]} px-5 py-4 text-center`}>
                        <div className="text-4xl font-black text-slate-800">{fund.indexes.overall}</div>
                        <div className="text-xs text-slate-500 font-bold mt-1">{t('totalScore')}</div>
                      </div>
                      <div className="px-5 py-3 space-y-2">
                        {[
                          { label: t('transparency'), val: fund.indexes.transparency },
                          { label: t('openness'), val: fund.indexes.openness },
                          { label: t('trust'), val: fund.indexes.trust },
                        ].map(item => (
                          <div key={item.label} className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">{item.label}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.val}%` }} />
                              </div>
                              <span className="font-bold text-slate-700 w-8 text-right">{item.val}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Radar Chart */}
              <CompareRadar funds={selectedFunds} />

              {/* Comparison Table */}
              <CompareTable funds={selectedFunds} />
            </div>
          ) : canCompare && !showResults ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-20 text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Scale className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{t('states.readyTitle', { count: selectedFunds.length })}</h2>
              <p className="text-slate-500 text-sm mb-8">{t('states.readyDesc')}</p>
              <button
                onClick={() => setShowResults(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 text-base"
              >
                <Scale className="w-5 h-5" /> {t('startCompare')}
              </button>
            </div>
          ) : selectedFunds.length === 1 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-20 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">{t('states.needOne')}</h2>
              <p className="text-slate-500 text-sm">{t('states.needOneDesc')}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-14 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">{t('states.selectTwo')}</h2>
              <p className="text-slate-500 text-sm mb-10 max-w-sm mx-auto">{t('states.selectTwoDesc')}</p>

              {/* Step-by-step guide */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
                {[
                  { step: '1', icon: '🔍', label: t('guide.step1') },
                  { step: '2', icon: '➕', label: t('guide.step2') },
                  { step: '3', icon: '📊', label: t('guide.step3') },
                ].map(({ step, icon, label }) => (
                  <div key={step} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-black">{step}</div>
                    <span className="text-2xl">{icon}</span>
                    <p className="text-xs text-slate-600 font-medium text-center">{label}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/funds')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
              >
                {t('states.goCatalog')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
