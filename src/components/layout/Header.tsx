import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, Search, Globe2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, assetUrl } from '@/src/lib/utils';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/context/ToastContext';
import { useLanguage, Language } from '@/src/context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { fundsApi } from '@/src/api/funds';
import { Fund } from '@/src/types';
import { FundAvatar } from '@/src/components/ui/FundAvatar';

const NAV_LINKS = [
  { name: 'funds', href: '/funds' },
  { name: 'ranking', href: '/ranking' },
  { name: 'compare', href: '/compare' },
  { name: 'news', href: '/news' },
  { name: 'research', href: '/tadqiqot' },
  { name: 'partnership', href: '/hamkorlik' },
];

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Fund[]>([]);
  const [searching, setSearching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation('nav');
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const languages: { id: Language; label: string; flag: string }[] = [
    { id: 'uz', label: 'O\'zbekcha', flag: '🇺🇿' },
    { id: 'en', label: 'English', flag: '🇺🇸' },
  ];

  useEffect(() => { setIsMenuOpen(false); }, [location]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  };

  const doSearch = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); setSearching(false); return; }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const { funds } = await fundsApi.getList({ search: q, per_page: 5 });
        setResults(funds);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 280);
  }, []);

  useEffect(() => { doSearch(query); }, [query, doSearch]);

  const goToFund = (fund: Fund) => {
    navigate(`/funds/${fund.slug}`);
    closeSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') closeSearch();
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/funds?search=${encodeURIComponent(query.trim())}`);
      closeSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white border-b border-slate-200 shadow-nav">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#1A56DB] flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-sm">CI</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#1E293B] text-base leading-tight">Charity Index</span>
            <span className="text-[#1A56DB] text-xs font-medium leading-tight">Uzbekistan</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm font-medium transition-all py-5 border-b-2',
                  isActive
                    ? 'text-[#1A56DB] border-[#1A56DB]'
                    : 'text-[#64748B] border-transparent hover:text-[#1E293B]'
                )}
              >
                {t(link.name)}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">

          {/* Inline Search */}
          <div ref={wrapperRef} className="relative hidden sm:block">
            <div className="flex items-center gap-2 h-9 w-40 md:w-52 bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-blue-400 focus-within:bg-white transition-colors">
              {searching
                ? <Loader2 className="w-4 h-4 text-blue-500 shrink-0 animate-spin" />
                : <Search className="w-4 h-4 text-slate-400 shrink-0" />
              }
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={t('searchPlaceholder')}
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none min-w-0"
              />
              {query && (
                <button onClick={() => setQuery('')} className="shrink-0 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown results */}
            <AnimatePresence>
              {searchOpen && (query.trim().length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-11 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  {results.length > 0 ? (
                    <ul className="py-1.5">
                      {results.map((fund) => (
                        <li key={fund.id}>
                          <button
                            onClick={() => goToFund(fund)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left transition-colors"
                          >
                            <FundAvatar
                              initials={fund.logo_initials}
                              color={fund.logo_color}
                              imageUrl={assetUrl(fund.logo_url)}
                              size="xs"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">{fund.name_uz}</p>
                              <p className="text-xs text-slate-400 truncate">{fund.category}</p>
                            </div>
                          </button>
                        </li>
                      ))}
                      <li className="border-t border-slate-100">
                        <button
                          onClick={() => { navigate(`/funds?search=${encodeURIComponent(query)}`); closeSearch(); }}
                          className="w-full px-3 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 text-left transition-colors"
                        >
                          {t('viewAll', { ns: 'common', defaultValue: 'View all results' })} →
                        </button>
                      </li>
                    </ul>
                  ) : searching ? (
                    <div className="py-6 flex justify-center text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  ) : (
                    <div className="py-5 text-center text-xs text-slate-400 font-medium">
                      {t('noResults', { ns: 'common', defaultValue: 'No results found' })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="p-2 text-[#64748B] hover:bg-slate-100 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              aria-label="Tilni o'zgartirish"
            >
              <Globe2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-card-hover border border-slate-100 py-2 z-20"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          setLanguage(lang.id);
                          setIsLangOpen(false);
                          showToast(`${lang.label} tanlandi`, 'success');
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                          language === lang.id
                            ? "bg-blue-50 text-[#1A56DB] font-bold"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <span>{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden sm:block h-5 w-px bg-slate-200 mx-1" />

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full bg-blue-50 text-[#1A56DB] flex items-center justify-center font-bold text-sm hover:bg-blue-100 transition-colors"
              >
                {user?.full_name.charAt(0)}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-slate-100 py-2 z-20"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <UserIcon className="w-4 h-4" />
                        {t('profile')}
                      </Link>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        onClick={() => { logout(); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('logout')}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold text-[#1A56DB] border border-[#1A56DB] rounded-lg hover:bg-blue-50 transition-colors"
            >
              {t('login')}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 md:hidden overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'px-4 py-3 rounded-lg text-base font-bold transition-colors',
                      location.pathname.startsWith(link.href)
                        ? 'bg-blue-50 text-[#1A56DB]'
                        : 'text-[#64748B] hover:bg-slate-50'
                    )}
                  >
                    {t(link.name)}
                  </Link>
                ))}
                <div className="h-px bg-slate-100 my-2" />
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="mt-2 w-full py-3 text-center font-bold text-white bg-[#1A56DB] rounded-lg shadow-sm hover:bg-[#1D4ED8] transition-colors"
                  >
                    {t('login')}
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
