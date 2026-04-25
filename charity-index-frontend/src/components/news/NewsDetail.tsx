import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Send, Link as LinkIcon, ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { News } from '@/src/types';
import { MOCK_FUNDS } from '@/src/data/mockData';
import { FundAvatar } from '@/src/components/ui/FundAvatar';
import { GradeBadge } from '@/src/components/ui/GradeBadge';
import { useToast } from '@/src/context/ToastContext';
import { cn, formatDate, assetUrl } from '@/src/lib/utils';

interface NewsDetailProps {
  news: News | null;
  onClose: () => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ news, onClose }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation('news');

  if (!news) return null;

  const fund = news.fund_slug ? MOCK_FUNDS.find(f => f.slug === news.fund_slug) : null;

  const categoryLabel =
    news.category === 'Fond yangiligi' ? t('categories.fund') :
    news.category === 'Platforma'      ? t('categories.platform') :
    t('categories.news');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(t('detail.linkCopied'), 'success');
  };

  const handleNavigateToFund = () => {
    if (news.fund_slug) {
      onClose();
      navigate(`/funds/${news.fund_slug}`);
    }
  };

  return (
    <AnimatePresence>
      {news && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-[600px] rounded-[24px] shadow-2xl pointer-events-auto overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header Image Area */}
              <div className={cn("h-[200px] shrink-0 relative overflow-hidden bg-gradient-to-br", news.gradient)}>
                {news.image_url && (
                  <img
                    src={assetUrl(news.image_url)}
                    alt={news.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all z-20"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="bg-white text-[#1A56DB] px-3 py-1 rounded-[100px] font-[700] text-[12px]">
                    {categoryLabel}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <h2 className="text-[22px] font-[800] text-[#1E293B] leading-[1.3] mb-4">
                  {news.title}
                </h2>

                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-[#64748B] text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(news.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#64748B] text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{t('readTime', { count: news.read_time })}</span>
                  </div>
                  {fund && (
                    <div 
                      onClick={handleNavigateToFund}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <FundAvatar initials={fund.logo_initials} color={fund.logo_color} size="xs" />
                      <span className="text-[#1A56DB] font-[600] text-sm group-hover:underline">
                        {news.fund_name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-[#E2E8F0] w-full mb-4" />

                {/* Article Content */}
                <div className="text-[#374151] text-[15px] leading-[1.8] whitespace-pre-wrap">
                  {news.content}
                </div>

                {/* Source link */}
                {news.source_url && (
                  <a
                    href={news.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-600 font-medium hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all w-fit"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span>{t('detail.source')}: <span className="font-bold">{new URL(news.source_url).hostname.replace('www.', '')}</span></span>
                  </a>
                )}

                {/* Fund Card */}
                {fund && (
                  <div className="mt-5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[16px] p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <FundAvatar initials={fund.logo_initials} color={fund.logo_color} size="sm" />
                      <div>
                        <h4 className="font-bold text-[#1E293B] text-sm">{fund.name_uz}</h4>
                        <GradeBadge grade={fund.indexes.grade} className="scale-75 origin-left" />
                      </div>
                    </div>
                    <button 
                      onClick={handleNavigateToFund}
                      className="text-[#1A56DB] text-xs font-bold flex items-center gap-1 hover:underline"
                    >
                      {t('detail.viewFund')}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Share Row */}
                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[#64748B] text-[14px] font-medium">{t('detail.share')}</span>
                  <div className="flex items-center gap-3">
                    <button className="p-2 text-[#64748B] hover:text-[#1A56DB] hover:bg-[#EFF6FF] rounded-lg transition-all">
                      <Send className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] text-xs font-bold rounded-lg hover:bg-[#EFF6FF] hover:text-[#1A56DB] transition-all"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {t('detail.copyLink')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
