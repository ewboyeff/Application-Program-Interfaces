import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ChevronRight, Trophy, Medal, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { Layout } from '@/src/components/layout/Layout';
import { RankingTable } from '@/src/components/ranking/RankingTable';
import { cn, getScoreColor } from '@/src/lib/utils';
import { useDataStore } from '@/src/store/useDataStore';
import { useCategoryStore } from '@/src/store/useCategoryStore';
import { useCategoryName } from '@/src/hooks/useCategoryName';
import { Fund } from '@/src/types';

type SortConfig = {
  key: keyof Fund['indexes'] | 'name_uz';
  direction: 'asc' | 'desc';
};

export default function Ranking() {
  const { t } = useTranslation('ranking');
  const navigate = useNavigate();
  const { funds } = useDataStore();
  const { categories } = useCategoryStore();
  const getCategoryName = useCategoryName();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'overall', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const filteredAndSortedFunds = useMemo(() => {
    let result = funds.filter(fund => {
      const matchesSearch = fund.name_uz.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'Barchasi' || fund.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      let valA: any, valB: any;
      
      if (sortConfig.key === 'name_uz') {
        valA = a.name_uz;
        valB = b.name_uz;
      } else {
        valA = a.indexes[sortConfig.key as keyof Fund['indexes']];
        valB = b.indexes[sortConfig.key as keyof Fund['indexes']];
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [search, activeCategory, sortConfig]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedFunds.length / PAGE_SIZE);
  const paginatedFunds = filteredAndSortedFunds.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const pageNumbers: (number | '...')[] = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  const stats = useMemo(() => {
    const gradeItems = [
      { label: 'Platinum', count: funds.filter(f => f.indexes.grade === 'platinum').length, color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30', text: 'text-blue-300', emoji: '🏆' },
      { label: 'Gold',     count: funds.filter(f => f.indexes.grade === 'gold').length,     color: 'from-amber-500/20 to-amber-600/20', border: 'border-amber-500/30', text: 'text-amber-300', emoji: '🥇' },
      { label: 'Silver',   count: funds.filter(f => f.indexes.grade === 'silver').length,   color: 'from-slate-400/20 to-slate-500/20', border: 'border-slate-400/30', text: 'text-slate-300', emoji: '🥈' },
      { label: 'Bronze',   count: funds.filter(f => f.indexes.grade === 'bronze').length,   color: 'from-orange-500/20 to-orange-600/20', border: 'border-orange-500/30', text: 'text-orange-300', emoji: '🥉' },
    ];
    const avgScore = funds.length
      ? Math.round(funds.reduce((s, f) => s + f.indexes.overall, 0) / funds.length * 10) / 10
      : 0;
    return { gradeItems: gradeItems.filter(g => g.count > 0), total: funds.length, avgScore };
  }, [funds]);

  return (
    <Layout>
      {/* Page Header */}
      <div className="relative bg-[#0F172A] py-10 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] -ml-48 -mb-48" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4"
            >
              <Trophy className="w-4 h-4" />
              <span>{t('independentSystem')}</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              {t('title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{t('titleHighlight')}</span>
            </h1>
            
            <p className="text-slate-400 font-medium text-lg max-w-2xl mb-10">
              {t('subtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {/* Total funds */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
                <Trophy className="w-4 h-4 text-white/70" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">{t('totalFunds')}</span>
                  <span className="text-sm font-bold text-white">{t('fundCount', { count: stats.total })}</span>
                </div>
              </div>
              {/* Average score */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-lg">
                <Medal className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 mb-1">{t('avgScore')}</span>
                  <span className="text-sm font-bold text-emerald-300">{stats.avgScore}</span>
                </div>
              </div>
              {/* Grade counts — only those with count > 0 */}
              {stats.gradeItems.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 rounded-2xl border backdrop-blur-md shadow-lg',
                    item.color, item.border, item.text
                  )}
                >
                  <span className="text-base leading-none">{item.emoji}</span>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">{item.label}</span>
                    <span className="text-sm font-bold">{t('fundCount', { count: item.count })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-16 relative z-20">
        {/* Filter Bar */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 p-3 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto p-1">
            <button
              onClick={() => setActiveCategory('Barchasi')}
              className={cn(
                'px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap',
                activeCategory === 'Barchasi'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              {t('categories.all')}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name_uz)}
                className={cn(
                  'px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap',
                  activeCategory === cat.name_uz
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                {getCategoryName(cat.name_uz)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto pr-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border border-transparent rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Ranking Table */}
        {filteredAndSortedFunds.length > 0 ? (
          <RankingTable
            funds={paginatedFunds}
            rankOffset={(currentPage - 1) * PAGE_SIZE}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        ) : (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-[#CBD5E1]" />
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] mb-2">{t('noFunds')}</h3>
            <p className="text-[#64748B] mb-8 font-medium">{t('noFundsDesc')}</p>
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory('Barchasi');
              }}
              className="px-6 py-2 bg-[#1A56DB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              {t('clearFilters')}
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#E2E8F0] text-[#94A3B8] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              {pageNumbers.map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-[#94A3B8] text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={cn(
                      'w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all',
                      currentPage === p
                        ? 'bg-[#1A56DB] text-white shadow-sm'
                        : 'border border-[#E2E8F0] text-[#64748B] hover:border-[#1A56DB] hover:text-[#1A56DB]'
                    )}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#E2E8F0] text-[#94A3B8] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
            <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">
              {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredAndSortedFunds.length)} / {filteredAndSortedFunds.length} ta fond
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
