import React from 'react';
import { Layout } from '@/src/components/layout/Layout';
import { Eye, Globe, Shield } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';

const Metodologiya = () => {
  const { t } = useTranslation('metodologiya');

  const GRADE_ROWS = [
    { range: '90-100', label: '👑 Platinum', color: 'bg-purple-100 text-purple-600', dot: 'bg-purple-500' },
    { range: '75-89',  label: '🥇 Gold',     color: 'bg-amber-100 text-amber-600',   dot: 'bg-amber-500' },
    { range: '60-74',  label: '🥈 Silver',   color: 'bg-slate-100 text-slate-600',   dot: 'bg-slate-500' },
    { range: '45-59',  label: '🥉 Bronze',   color: 'bg-orange-100 text-orange-600', dot: 'bg-orange-500' },
    { range: '0-44',   label: '⚠️ Unrated',  color: 'bg-slate-100 text-slate-400',   dot: 'bg-slate-300' },
  ];

  return (
    <Layout>
      <div className="bg-primary-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{t('pageTitle')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl">{t('pageSubtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Section 1 — Formula */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('formula.title')}</h2>
          <div className="bg-[#1E293B] rounded-2xl p-8 text-center shadow-xl">
            <div className="text-white font-mono text-xl md:text-2xl leading-relaxed">
              {t('formula.text')}
            </div>
            <div className="mt-6 text-white/70 font-mono text-sm md:text-base">
              {t('formula.example')}
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{t('scoreLevels.title')}</h3>
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="py-4 px-6 text-xs font-bold uppercase text-slate-400 tracking-wider">{t('scoreLevels.scoreCol')}</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase text-slate-400 tracking-wider">{t('scoreLevels.levelCol')}</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase text-slate-400 tracking-wider">{t('scoreLevels.colorCol')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {GRADE_ROWS.map((row) => (
                    <tr key={row.range} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-700">{row.range}</td>
                      <td className="py-4 px-6 font-extrabold text-slate-900">{row.label}</td>
                      <td className="py-4 px-6">
                        <div className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', row.color)}>
                          <div className={cn('w-1.5 h-1.5 rounded-full', row.dot)} />
                          {row.color.split(' ')[1].split('-')[0]}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 2 — Transparency */}
        <section className="mb-12">
          <div className="bg-white shadow-xl rounded-3xl p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-600">{t('transparency.title')}</h2>
                  <p className="text-slate-500 text-sm">{t('transparency.subtitle')}</p>
                </div>
              </div>
              <div className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">
                {t('transparency.badge')}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-3 px-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('scoreLevels.levelCol')}</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('weight')}</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('method')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {[
                    { key: 'reports', weight: '25%' },
                    { key: 'expenses', weight: '20%' },
                    { key: 'results', weight: '20%' },
                    { key: 'audit', weight: '20%' },
                    { key: 'donors', weight: '15%' },
                  ].map((row) => (
                    <tr key={row.key}>
                      <td className="py-3 px-4 font-semibold text-slate-700">{t(`transparency.factors.${row.key}`)}</td>
                      <td className="py-3 px-4 font-bold text-blue-600">{row.weight}</td>
                      <td className="py-3 px-4 text-slate-500">{t(`transparency.methods.${row.key}`)}</td>
                    </tr>
                  ))}
                  <tr className="bg-primary-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{t('transparency.factors.total')}</td>
                    <td className="py-3 px-4 font-bold text-primary-600">100%</td>
                    <td className="py-3 px-4" />
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <div className="text-blue-800 font-mono text-sm space-y-1">
                <div className="font-bold mb-2">{t('transparency.formula')}</div>
                <div className="text-blue-600/80">{t('transparency.example')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 — Openness */}
        <section className="mb-12">
          <div className="bg-white shadow-xl rounded-3xl p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-600">{t('openness.title')}</h2>
                  <p className="text-slate-500 text-sm">{t('openness.subtitle')}</p>
                </div>
              </div>
              <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 uppercase tracking-wider">
                {t('openness.badge')}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-3 px-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('scoreLevels.levelCol')}</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('weight')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {[
                    { key: 'website', weight: '20%' },
                    { key: 'social',  weight: '20%' },
                    { key: 'media',   weight: '15%' },
                    { key: 'contact', weight: '20%' },
                    { key: 'news',    weight: '25%' },
                  ].map((row) => (
                    <tr key={row.key}>
                      <td className="py-3 px-4 font-semibold text-slate-700">{t(`openness.factors.${row.key}`)}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{row.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <div className="text-emerald-800 font-mono text-sm">{t('openness.formula')}</div>
            </div>
          </div>
        </section>

        {/* Section 4 — Trust */}
        <section className="mb-16">
          <div className="bg-white shadow-xl rounded-3xl p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-purple-600">{t('trust.title')}</h2>
                  <p className="text-slate-500 text-sm">{t('trust.subtitle')}</p>
                </div>
              </div>
              <div className="px-4 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-full border border-purple-100 uppercase tracking-wider">
                {t('trust.badge')}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-3 px-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('scoreLevels.levelCol')}</th>
                    <th className="py-3 px-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('weight')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {[
                    { key: 'registration', weight: '25%' },
                    { key: 'activity',     weight: '20%' },
                    { key: 'users',        weight: '20%' },
                    { key: 'complaints',   weight: '20%' },
                    { key: 'partners',     weight: '15%' },
                  ].map((row) => (
                    <tr key={row.key}>
                      <td className="py-3 px-4 font-semibold text-slate-700">{t(`trust.factors.${row.key}`)}</td>
                      <td className="py-3 px-4 font-bold text-purple-600">{row.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
              <div className="text-purple-800 font-mono text-sm">{t('trust.formula')}</div>
            </div>
          </div>
        </section>

        {/* Section 5 — Update schedule */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">{t('update.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['step1', 'step2', 'step3'] as const).map((step, i) => (
              <div key={step} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center relative">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold absolute -top-5 left-1/2 -translate-x-1/2 shadow-lg">
                  {i + 1}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 mt-4">{t(`update.${step}.title`)}</h4>
                <p className="text-sm text-slate-500">{t(`update.${step}.desc`)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Metodologiya;
