import React, { useState, useEffect } from 'react';
import { Layout } from '@/src/components/layout/Layout';
import { useTranslation } from 'react-i18next';
import { Building2, Handshake, Newspaper, Check, ChevronRight, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '@/src/context/ToastContext';
import { apiClient } from '@/src/api/client';
import { partnersApi, Partner, resolveLogoUrl } from '@/src/api/partners';

const Hamkorlik = () => {
  const { showToast } = useToast();
  const { t } = useTranslation('hamkorlik');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: '', organization: '', phone: '', message: '' });
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    partnersApi.listPublic().then(setPartners).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const partnerTypes = [
    {
      id: 'fond',
      icon: <Building2 className="w-12 h-12 text-primary-600 mb-6" />,
      title: t('types.fond.title'),
      desc: t('types.fond.desc'),
      features: t('types.fond.features', { returnObjects: true }) as string[],
      buttonText: t('types.fond.button'),
    },
    {
      id: 'investor',
      icon: <Handshake className="w-12 h-12 text-primary-600 mb-6" />,
      title: t('types.investor.title'),
      desc: t('types.investor.desc'),
      features: t('types.investor.features', { returnObjects: true }) as string[],
      buttonText: t('types.investor.button'),
    },
    {
      id: 'media',
      icon: <Newspaper className="w-12 h-12 text-primary-600 mb-6" />,
      title: t('types.media.title'),
      desc: t('types.media.desc'),
      features: t('types.media.features', { returnObjects: true }) as string[],
      buttonText: t('types.media.button'),
    },
  ];

  const handleOpenModal = (typeTitle: string) => {
    setSelectedType(typeTitle);
    setForm({ full_name: '', organization: '', phone: '', message: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/v1/applications', {
        type: selectedType ?? 'other',
        ...form,
      });
      setIsModalOpen(false);
      showToast(t('modal.success'), "success");
    } catch {
      showToast(t('modal.error'), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-[#F8FAFC] min-h-screen">
        <div className="bg-[#EFF6FF] py-12 border-b border-blue-100">
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-4xl font-black text-[#1E293B] mb-4">{t('title')}</h1>
            <p className="text-lg text-[#64748B] max-w-2xl font-medium">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-[32px] p-8 border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-center md:justify-start p-5 bg-primary-50 rounded-2xl w-fit mb-8 group-hover:scale-110 transition-transform duration-500 text-primary-600">
                    {type.icon}
                  </div>
                  
                  <h3 className="text-2xl font-black text-[#1E293B] mb-4 group-hover:text-[#1A56DB] transition-colors">
                    {type.title}
                  </h3>
                  
                  <p className="text-[#64748B] mb-8 text-sm leading-relaxed font-medium">
                    {type.desc}
                  </p>
                  
                  <ul className="space-y-4 mb-10 flex-1">
                    {type.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3 text-sm text-[#64748B]">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleOpenModal(type.title)}
                    className="w-full py-4 bg-[#1A56DB] text-white rounded-2xl font-black hover:bg-[#1D4ED8] transition-all duration-300 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>{type.buttonText}</span>
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24">
            <h2 className="text-3xl font-black text-[#1E293B] mb-8">{t('other.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(t('other.items', { returnObjects: true }) as Array<{ title: string; desc: string }>).map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                  <h4 className="font-black text-[#1E293B] mb-2">{item.title}</h4>
                  <p className="text-sm text-[#64748B] font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[#1E3A8A] font-bold">{t('other.cta')}</p>
              <button
                onClick={() => handleOpenModal(t('title'))}
                className="px-8 py-3 bg-[#1A56DB] text-white rounded-xl font-black hover:bg-[#1D4ED8] transition-all whitespace-nowrap"
              >
                {t('other.ctaButton')}
              </button>
            </div>
          </div>

          {partners.length > 0 && (
            <div className="mt-24 pt-16 border-t border-slate-200">
              <h2 className="text-3xl font-black text-[#1E293B] mb-12 text-center">{t('partners')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                {partners.map((partner) => {
                  const logoUrl = resolveLogoUrl(partner.logo_url);
                  const inner = (
                    <div className="border border-[#E2E8F0] rounded-2xl p-5 flex flex-col items-center justify-center gap-3 bg-white hover:border-primary-300 hover:shadow-md transition-all group h-full">
                      {logoUrl ? (
                        <img src={logoUrl} alt={partner.name} className="h-10 max-w-full object-contain" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                          <Handshake className="w-5 h-5 text-primary-400" />
                        </div>
                      )}
                      <span className="text-[#64748B] text-[11px] font-bold uppercase tracking-widest group-hover:text-[#1A56DB] transition-colors text-center leading-tight">
                        {partner.name}
                      </span>
                    </div>
                  );
                  return partner.website_url ? (
                    <a key={partner.id} href={partner.website_url} target="_blank" rel="noopener noreferrer">
                      {inner}
                    </a>
                  ) : (
                    <div key={partner.id}>{inner}</div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-[#1E293B]">{t('modal.title')}</h2>
                    <p className="text-sm text-[#64748B] font-medium mt-1">{selectedType}</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-[#64748B]" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-[#374151] mb-2">{t('modal.fullName')}</label>
                    <input
                      required
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder={t('modal.fullNamePlaceholder')}
                      className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-sm text-[#1E293B] focus:border-[#1A56DB] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#374151] mb-2">{t('modal.organization')}</label>
                    <input
                      required
                      type="text"
                      name="organization"
                      value={form.organization}
                      onChange={handleChange}
                      placeholder={t('modal.organizationPlaceholder')}
                      className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-sm text-[#1E293B] focus:border-[#1A56DB] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#374151] mb-2">{t('modal.phone')}</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t('modal.phonePlaceholder')}
                      className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-sm text-[#1E293B] focus:border-[#1A56DB] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#374151] mb-2">{t('modal.message')}</label>
                    <textarea
                      rows={3}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t('modal.messagePlaceholder')}
                      className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-sm text-[#1E293B] focus:border-[#1A56DB] outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-[#1A56DB] text-white rounded-2xl font-black hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{t('modal.submit')}</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Hamkorlik;
