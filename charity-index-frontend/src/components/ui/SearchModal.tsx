import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fundsApi } from '@/src/api/funds';
import { Fund } from '@/src/types';
import { assetUrl } from '@/src/lib/utils';
import { FundAvatar } from './FundAvatar';
import { GradeBadge } from './GradeBadge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setActiveIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); setLoading(false); return; }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const { funds } = await fundsApi.getList({ search: q, per_page: 6 });
        setResults(funds);
        setActiveIndex(-1);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
  }, []);

  useEffect(() => {
    search(query);
  }, [query, search]);

  const goToFund = (fund: Fund) => {
    navigate(`/funds/${fund.slug}`);
    onClose();
  };

  const goToSearch = () => {
    if (!query.trim()) return;
    navigate(`/funds?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        goToFund(results[activeIndex]);
      } else {
        goToSearch();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl z-[70] px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
                {loading
                  ? <Loader2 className="w-5 h-5 text-blue-500 shrink-0 animate-spin" />
                  : <Search className="w-5 h-5 text-slate-400 shrink-0" />
                }
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Fond nomi bo'yicha qidiring..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 text-base text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="ml-1 text-xs font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded-lg hover:bg-slate-50"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              {results.length > 0 && (
                <ul className="py-2 max-h-80 overflow-y-auto">
                  {results.map((fund, i) => (
                    <li key={fund.id}>
                      <button
                        onClick={() => goToFund(fund)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          activeIndex === i ? 'bg-blue-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <FundAvatar
                          initials={fund.logo_initials}
                          color={fund.logo_color}
                          imageUrl={assetUrl(fund.logo_url)}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{fund.name_uz}</p>
                          <p className="text-xs text-slate-400 truncate">{fund.category} · {fund.region}</p>
                        </div>
                        <GradeBadge grade={fund.indexes.grade} className="shrink-0 scale-90" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* No results */}
              {!loading && query.trim() && results.length === 0 && (
                <div className="py-10 text-center text-slate-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">Natija topilmadi</p>
                </div>
              )}

              {/* Empty state hint */}
              {!query && (
                <div className="px-4 py-4 text-xs text-slate-400 font-medium">
                  Fond nomi yozing va natijalarni ko'ring
                </div>
              )}

              {/* Footer — view all */}
              {query.trim() && (
                <div className="border-t border-slate-100 px-4 py-3">
                  <button
                    onClick={goToSearch}
                    className="w-full flex items-center justify-between text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>"{query}" bo'yicha barcha natijalar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
