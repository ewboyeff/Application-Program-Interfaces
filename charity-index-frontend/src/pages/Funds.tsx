import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/context/LanguageContext';
import { Search, LayoutGrid, List, Filter, X, ChevronDown, RotateCcw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout } from '@/src/components/layout/Layout';
import { FundCard } from '@/src/components/funds/FundCard';
import { FundCardSkeleton } from '@/src/components/ui/Skeleton';
import { cn } from '@/src/lib/utils';
import { useCompareStore } from '@/src/store/compareStore';
import { FundAvatar } from '@/src/components/ui/FundAvatar';
import { useDataStore } from '@/src/store/useDataStore';
import { useCategoryStore } from '@/src/store/useCategoryStore';
import { useCategoryName } from '@/src/hooks/useCategoryName';

const PAGE_SIZE = 9;

const GRADES = [
  { id: 'platinum', label: 'Platinum' },
  { id: 'gold', label: 'Gold' },
  { id: 'silver', label: 'Silver' },
  { id: 'bronze', label: 'Bronze' },
];

export default function Funds() {
  const { t } = useTranslation('funds');
  const { language } = useLanguage();
  const { funds } = useDataStore();
  const { categories, regions } = useCategoryStore();
  const getCategoryName = useCategoryName();
  const fundName = (f: typeof funds[0]) => (language === 'en' && f.name_en) ? f.name_en : f.name_uz;
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    (localStorage.getItem('ciu_view_mode') as 'grid' | 'list') || 'grid'
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'newest'>('rating');
  const [currentPage, setCurrentPage] = useState(1);

  const { selectedFunds, clearFunds, removeFund } = useCompareStore();

  useEffect(() => {
    localStorage.setItem('ciu_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) setSearch(query);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (selectedRegions.length > 0) count++;
    if (selectedGrade) count++;
    if (verifiedOnly) count++;
    return count;
  }, [selectedCategories, selectedRegions, selectedGrade, verifiedOnly]);

  const filteredFunds = useMemo(() => {
    let result = funds.filter((fund) => {
      const matchesSearch = fundName(fund).toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(fund.category);
      const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(fund.region);
      const matchesGrade = !selectedGrade || fund.indexes.grade === selectedGrade;
      const matchesVerified = !verifiedOnly || fund.is_verified;

      return matchesSearch && matchesCategory && matchesRegion && matchesGrade && matchesVerified;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.indexes.overall - a.indexes.overall;
      if (sortBy === 'name') return fundName(a).localeCompare(fundName(b));
      return 0; // 'newest' not implemented in mock data
    });

    return result;
  }, [search, selectedCategories, selectedRegions, selectedGrade, verifiedOnly, sortBy]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1); }, [search, selectedCategories, selectedRegions, selectedGrade, verifiedOnly, sortBy]);

  const totalPages = Math.ceil(filteredFunds.length / PAGE_SIZE);
  const paginatedFunds = filteredFunds.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const delta = 2;
    const range: (number | '...')[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  }, [totalPages, currentPage]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedRegions([]);
    setSelectedGrade(null);
    setVerifiedOnly(false);
    setSearch('');
    setSearchParams({});
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleRegion = (reg: string) => {
    setSelectedRegions(prev => 
      prev.includes(reg) ? prev.filter(r => r !== reg) : [...prev, reg]
    );
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-white border-b border-[#E2E8F0] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
              <Link to="/" className="hover:text-[#1A56DB] transition-colors">{t('breadcrumb.home')}</Link>
              <span>/</span>
              <span className="text-[#64748B]">{t('breadcrumb.funds')}</span>
            </div>
            <h1 className="text-3xl font-black text-[#1E293B]">{t('title')}</h1>
            <p className="text-[#64748B] font-medium">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-[#1E293B]">{t('filters.title')}</h3>
                  {activeFilterCount > 0 && (
                    <span className="bg-[#1A56DB] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs text-[#94A3B8] hover:text-[#1A56DB] flex items-center gap-1 transition-colors font-bold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {t('filters.clear')}
                  </button>
                )}
              </div>

              <div className="space-y-8">
                {/* Category */}
                <div>
                  <h4 className="text-xs font-black text-[#94A3B8] uppercase tracking-widest mb-4">{t('filters.category')}</h4>
                  <div className="space-y-3">
                    {categories.map(cat => (
                      <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={selectedCategories.includes(cat.name_uz)}
                            onChange={() => toggleCategory(cat.name_uz)}
                          />
                          <div className="w-5 h-5 border-2 border-[#E2E8F0] rounded-md peer-checked:bg-[#1A56DB] peer-checked:border-[#1A56DB] transition-all" />
                          <CheckIcon className="absolute w-3.5 h-3.5 text-white left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-sm text-[#64748B] group-hover:text-[#1E293B] transition-colors font-medium">{getCategoryName(cat.name_uz)}</span>
                        <span className="ml-auto text-[10px] font-black text-[#CBD5E1]">
                          {funds.filter(f => f.category === cat.name_uz).length}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Region */}
                <div>
                  <h4 className="text-xs font-black text-[#94A3B8] uppercase tracking-widest mb-4">{t('filters.region')}</h4>
                  <div className="space-y-3">
                    {regions.map(reg => (
                      <label key={reg.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={selectedRegions.includes(reg.name_uz)}
                            onChange={() => toggleRegion(reg.name_uz)}
                          />
                          <div className="w-5 h-5 border-2 border-[#E2E8F0] rounded-md peer-checked:bg-[#1A56DB] peer-checked:border-[#1A56DB] transition-all" />
                          <CheckIcon className="absolute w-3.5 h-3.5 text-white left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-sm text-[#64748B] group-hover:text-[#1E293B] transition-colors font-medium">{t(`regions.${reg.name_uz}`, { ns: 'common', defaultValue: reg.name_uz })}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Grade */}
                <div>
                  <h4 className="text-xs font-black text-[#94A3B8] uppercase tracking-widest mb-4">{t('filters.grade')}</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="grade"
                        className="peer sr-only"
                        checked={selectedGrade === null}
                        onChange={() => setSelectedGrade(null)}
                      />
                      <div className="w-5 h-5 border-2 border-[#E2E8F0] rounded-full peer-checked:border-[#1A56DB] peer-checked:border-[6px] transition-all" />
                      <span className="text-sm text-[#64748B] group-hover:text-[#1E293B] transition-colors font-medium">{t('filters.allGrades')}</span>
                    </label>
                    {GRADES.map(grade => (
                      <label key={grade.id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="grade"
                          className="peer sr-only"
                          checked={selectedGrade === grade.id}
                          onChange={() => setSelectedGrade(grade.id)}
                        />
                        <div className="w-5 h-5 border-2 border-[#E2E8F0] rounded-full peer-checked:border-[#1A56DB] peer-checked:border-[6px] transition-all" />
                        <span className="text-sm text-[#64748B] group-hover:text-[#1E293B] transition-colors font-medium">{grade.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Verified Toggle */}
                <div className="pt-4 border-t border-[#F1F5F9]">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm font-bold text-[#374151]">{t('filters.verifiedOnly')}</span>
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                    />
                    <div className="w-10 h-5 bg-[#E2E8F0] rounded-full peer-checked:bg-[#1A56DB] relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input 
                  type="text"
                  placeholder={t('filters.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-transparent rounded-xl text-sm text-[#1E293B] focus:bg-white focus:border-[#1A56DB] transition-all outline-none placeholder:text-[#94A3B8]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn('p-1.5 rounded-lg transition-all', viewMode === 'grid' ? 'bg-white shadow-sm text-[#1A56DB]' : 'text-[#94A3B8] hover:text-[#1E293B]')}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn('p-1.5 rounded-lg transition-all', viewMode === 'list' ? 'bg-white shadow-sm text-[#1A56DB]' : 'text-[#94A3B8] hover:text-[#1E293B]')}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <select 
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm font-bold text-[#374151] outline-none focus:border-[#1A56DB] transition-all"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="rating">{t('sort.rating')}</option>
                  <option value="name">{t('sort.nameAZ')}</option>
                  <option value="newest">{t('sort.newest')}</option>
                </select>

                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-[#64748B] font-medium">
                {t('foundCount', { count: filteredFunds.length })}
              </p>
            </div>

            {/* Fund Grid/List */}
            {isLoading ? (
              <div className={cn(
                'grid gap-5',
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
              )}>
                {[...Array(6)].map((_, i) => (
                  <FundCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredFunds.length > 0 ? (
                  <motion.div 
                    layout
                    className={cn(
                      'grid gap-5',
                      viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
                    )}
                  >
                    {paginatedFunds.map((fund, index) => (
                      <motion.div
                        key={fund.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <FundCard fund={fund} viewMode={viewMode} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center"
                  >
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-[#1E293B] mb-2">{t('noResults')}</h3>
                    <p className="text-[#64748B] mb-8 font-medium">{t('noResultsDesc')}</p>
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-2 bg-[#1A56DB] text-white font-black rounded-xl hover:bg-[#1D4ED8] transition-all"
                    >
                      {t('clearFilters')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#E2E8F0] text-[#94A3B8] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    &lt;
                  </button>
                  {pageNumbers.map((num, i) =>
                    num === '...' ? (
                      <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-[#94A3B8] text-sm font-bold">…</span>
                    ) : (
                      <button
                        key={num}
                        onClick={() => setCurrentPage(num as number)}
                        className={cn(
                          'w-10 h-10 flex items-center justify-center rounded-xl text-sm font-black transition-all',
                          currentPage === num
                            ? 'bg-[#1A56DB] text-white shadow-sm shadow-blue-600/20'
                            : 'border border-[#E2E8F0] text-[#64748B] hover:border-[#1A56DB] hover:text-[#1A56DB]'
                        )}
                      >
                        {num}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#E2E8F0] text-[#94A3B8] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    &gt;
                  </button>
                </div>
                <p className="text-xs text-[#94A3B8] font-black uppercase tracking-wider">
                  {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredFunds.length)} / {filteredFunds.length} {t('foundCount', { count: filteredFunds.length }).replace(/^\d+ /, '')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare Floating Bar */}
      <AnimatePresence>
        {selectedFunds.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E293B] text-white py-4 pb-safe shadow-2xl border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {selectedFunds.map(fund => (
                    <div key={fund.id} className="relative group">
                      <FundAvatar 
                        initials={fund.logo_initials} 
                        color={fund.logo_color} 
                        size="sm" 
                        className="border-2 border-[#1E293B]" 
                      />
                      <button 
                        onClick={() => removeFund(fund.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  {t('compare.barSelected', { count: selectedFunds.length })}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={clearFunds}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {t('compare.barClear')}
                </button>
                <Link
                  to="/compare"
                  className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all flex items-center gap-2"
                >
                  {t('compare.barStart')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Filter Bottom Sheet */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-900">{t('filters.title')}</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-slate-100 rounded-full">
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                <div className="space-y-8 pb-24">
                  {/* Same content as sidebar */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('filters.category')}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => toggleCategory(cat.name_uz)}
                          className={cn(
                            'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                            selectedCategories.includes(cat.name_uz) ? 'bg-primary-50 border-primary-600 text-primary-600' : 'bg-white border-slate-200 text-slate-600'
                          )}
                        >
                          {getCategoryName(cat.name_uz)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('filters.region')}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {regions.map(reg => (
                        <button
                          key={reg.id}
                          onClick={() => toggleRegion(reg.name_uz)}
                          className={cn(
                            'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                            selectedRegions.includes(reg.name_uz) ? 'bg-primary-50 border-primary-600 text-primary-600' : 'bg-white border-slate-200 text-slate-600'
                          )}
                        >
                          {t(`regions.${reg.name_uz}`, { ns: 'common', defaultValue: reg.name_uz })}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('filters.grade')}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {GRADES.map(grade => (
                        <button 
                          key={grade.id}
                          onClick={() => setSelectedGrade(grade.id)}
                          className={cn(
                            'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                            selectedGrade === grade.id ? 'bg-primary-50 border-primary-600 text-primary-600' : 'bg-white border-slate-200 text-slate-600'
                          )}
                        >
                          {grade.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-lg"
                  >
                    {t('filters.applyFilters')}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
