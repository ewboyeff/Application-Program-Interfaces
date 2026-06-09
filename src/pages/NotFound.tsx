import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation('notFound');

  const QUICK_LINKS = [
    { key: 'funds',     path: '/funds' },
    { key: 'ranking',   path: '/ranking' },
    { key: 'news',      path: '/news' },
    { key: 'tadqiqot',  path: '/tadqiqot' },
  ];

  return (
    <main className="relative min-h-screen bg-[#F8FAFC] px-6 py-24 text-center flex flex-col items-center justify-center overflow-hidden">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute left-6 top-6 flex items-center gap-2 cursor-pointer"
        aria-label={t('backHome')}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#1A56DB] text-[14px] font-bold text-white">
          CI
        </div>
        <span className="text-[15px] font-bold text-[#1E293B]">Charity Index</span>
      </button>

      <section className="mx-auto flex max-w-[560px] flex-col items-center">
        <div className="bg-gradient-to-br from-[#1A56DB] to-[#60A5FA] bg-clip-text text-[80px] font-black leading-none text-transparent sm:text-[120px]">
          404
        </div>

        <svg
          viewBox="0 0 120 120"
          className="mx-auto mt-6 h-[120px] w-[120px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="26" stroke="#CBD5E1" strokeWidth="6" />
          <path d="M68 68L92 92" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
          <circle cx="42" cy="45" r="2.5" fill="#CBD5E1" />
          <circle cx="58" cy="45" r="2.5" fill="#CBD5E1" />
          <path
            d="M41 60C44.5 55.5 55.5 55.5 59 60"
            stroke="#CBD5E1"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <h1 className="mt-6 text-[28px] font-extrabold text-[#1E293B]">{t('title')}</h1>

        <p className="mt-3 max-w-[400px] text-[16px] leading-[1.6] text-[#64748B]">
          {t('subtitle')}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-[12px] bg-[#1A56DB] px-7 py-3 text-[15px] font-bold text-white transition-all hover:-translate-y-[1px] hover:bg-[#1D4ED8]"
          >
            {t('backHome')}
          </button>

          <button
            type="button"
            onClick={() => navigate('/funds')}
            className="rounded-[12px] border-[1.5px] border-[#E2E8F0] px-7 py-3 text-[15px] font-semibold text-[#64748B] transition-colors hover:border-[#1A56DB] hover:text-[#1A56DB]"
          >
            {t('viewFunds')}
          </button>
        </div>

        <div className="mt-12">
          <p className="mb-3 text-[13px] text-[#94A3B8]">{t('quickLinks')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_LINKS.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] text-[#64748B] transition-colors hover:border-[#1A56DB] hover:text-[#1A56DB]"
              >
                {t(`links.${item.key}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="absolute bottom-6 text-[13px] text-[#CBD5E1]">
        © 2025 Charity Index Uzbekistan
      </footer>
    </main>
  );
}
