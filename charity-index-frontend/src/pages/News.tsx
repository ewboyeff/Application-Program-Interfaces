import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Search, Bell, Send, Clock, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout } from '@/src/components/layout/Layout';
import { News } from '@/src/types';
import { useDataStore } from '@/src/store/useDataStore';
import { NewsCard } from '@/src/components/news/NewsCard';
import { NewsDetail } from '@/src/components/news/NewsDetail';
import { useToast } from '@/src/context/ToastContext';
import { cn, formatDate } from '@/src/lib/utils';

export default function NewsPage() {
  const { showToast } = useToast();
  const { t } = useTranslation('news');

  const CATEGORIES = [
    { id: 'all', label: t('categories.all') },
    { id: 'Fond yangiligi', label: t('categories.fund') },
    { id: 'Platforma', label: t('categories.platform') },
  ];
  const { news: allNews } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [email, setEmail] = useState('');

  const featuredNews = allNews.filter(n => n.is_featured).slice(0, 2);
  const featuredIds = featuredNews.map(n => n.id);

  const filteredNews = useMemo(() => {
    return allNews.filter(news => {
      if (featuredIds.includes(news.id)) return false;
      const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || news.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allNews, searchQuery, activeCategory, featuredIds]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast(t('newsletter.comingSoon'), 'info');
    setEmail('');
  };

  return (
    <Layout>
      <div className="bg-[#F8FAFC] min-h-screen">
        {/* HEADER */}
        <div className="bg-[#EFF6FF] border-b border-[#E2E8F0] py-12 px-4">
          <div className="max-w-[1152px] mx-auto">
            <div className="flex items-center gap-2 text-sm text-[#64748B] mb-2">
              <Link to="/" className="hover:text-[#1A56DB] transition-colors">{t('breadcrumb.home')}</Link>
              <ChevronRight className="w-4 h-4" />
              <span>{t('title')}</span>
            </div>
            <h1 className="text-[36px] font-[800] text-[#1E293B] leading-tight">{t('title')}</h1>
            <p className="text-[#64748B] mt-2 font-medium">{t('subtitle')}</p>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="max-w-[1152px] mx-auto px-4 my-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar w-full md:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'px-5 py-2 rounded-[100px] text-sm transition-all whitespace-nowrap',
                  activeCategory === cat.id
                    ? 'bg-[#1A56DB] text-white font-[600]'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] cursor-pointer'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-[10px] bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] outline-none focus:border-[#1A56DB] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-[1152px] mx-auto px-4 pb-16">
          {/* FEATURED NEWS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {featuredNews.map((news) => (
              <motion.div
                key={news.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedNews(news)}
                className={cn(
                  "h-[280px] rounded-[20px] overflow-hidden relative cursor-pointer group",
                  news.gradient
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent z-10" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <span className="inline-block bg-white/20 text-white text-[11px] font-[700] px-3 py-1 rounded-[100px] mb-2">
                    {news.category === 'Fond yangiligi' ? t('categories.fund') :
                     news.category === 'Platforma'      ? t('categories.platform') :
                     t('categories.news')}
                  </span>
                  <h2 className="text-[20px] font-[700] text-white leading-[1.3] mb-3">
                    {news.title}
                  </h2>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-white/80">{news.fund_name || t('platform')}</span>
                    <span className="text-[12px] text-white/70 ml-auto">{formatDate(news.date)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* NEWS GRID */}
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredNews.map((news) => (
                  <motion.div
                    key={news.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full"
                  >
                    <NewsCard news={news} onClick={() => setSelectedNews(news)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-[#94A3B8]" />
              </div>
              <h3 className="text-xl font-bold text-[#1E293B]">{t('notFound')}</h3>
              <p className="text-[#64748B]">{t('notFoundDesc')}</p>
            </div>
          )}

          {/* NEWSLETTER SECTION */}
          <div className="mt-16 bg-[#1A56DB] rounded-[24px] p-12 text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <Bell className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-[28px] font-[800] text-white">{t('newsletter.title')}</h2>
              <p className="text-white/75 text-base mt-2 max-w-xl mx-auto">
                {t('newsletter.subtitle')}
              </p>
              
              <form onSubmit={handleSubscribe} className="max-w-[400px] mx-auto mt-6 flex">
                <input 
                  type="email"
                  placeholder={t('newsletter.placeholder')}
                  required
                  className="flex-1 px-4 py-[14px] bg-white rounded-l-[12px] text-sm text-[#1E293B] outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  type="submit"
                  className="px-6 py-[14px] bg-[#1E293B] text-white font-[700] rounded-r-[12px] hover:bg-black transition-all whitespace-nowrap"
                >
                  {t('newsletter.subscribe')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <NewsDetail news={selectedNews} onClose={() => setSelectedNews(null)} />
    </Layout>
  );
}
