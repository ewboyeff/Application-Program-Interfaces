import React from 'react';
import { Globe, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { News } from '@/src/types';
import { cn, formatDate, assetUrl } from '@/src/lib/utils';

interface NewsCardProps {
  news: News;
  onClick: () => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  const { t } = useTranslation('news');

  const categoryLabel =
    news.category === 'Fond yangiligi' ? t('categories.fund') :
    news.category === 'Platforma'      ? t('categories.platform') :
    t('categories.news');

  return (
    <div
      onClick={onClick}
      className="h-full bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:translate-y-[-2px] hover:border-[#BFDBFE] transition-all duration-250 flex flex-col group"
    >
      {/* IMAGE AREA */}
      <div className={cn("h-[180px] relative bg-gradient-to-br overflow-hidden", news.gradient)}>
        {news.image_url && (
          <img
            src={assetUrl(news.image_url)}
            alt={news.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 left-3 bg-white rounded-[100px] px-[10px] py-1 text-[11px] font-[700] shadow-sm">
          <span className={cn(
            news.category === "Fond yangiligi" ? "text-[#1A56DB]" : "text-[#7C3AED]"
          )}>
            {categoryLabel}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-black/40 text-white text-[11px] px-2 py-[3px] rounded-[100px] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {t('readTime', { count: news.read_time })}
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-[#1E293B] text-[15px] font-[700] leading-[1.4] line-clamp-2 mb-2 group-hover:text-[#1A56DB] transition-colors">
          {news.title}
        </h3>
        
        <p className="text-[#64748B] text-[13px] leading-[1.6] line-clamp-2">
          {news.excerpt}
        </p>
        
        <div className="h-px bg-[#F1F5F9] w-full my-3" />
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            {news.fund_name ? (
              <>
                <div className="w-4 h-4 rounded-full bg-[#1A56DB]/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#1A56DB]" />
                </div>
                <span className="text-[#64748B] text-[12px] font-medium truncate max-w-[120px]">
                  {news.fund_name}
                </span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="text-[#64748B] text-[12px] font-medium">{t('platform')}</span>
              </>
            )}
          </div>
          
          <span className="text-[#94A3B8] text-[12px]">
            {formatDate(news.date)}
          </span>
        </div>
      </div>
    </div>
  );
};
