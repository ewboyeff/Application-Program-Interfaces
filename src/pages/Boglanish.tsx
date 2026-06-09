import React, { useState, useRef } from 'react';
import { Layout } from '@/src/components/layout/Layout';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useToast } from '@/src/context/ToastContext';
import { motion } from 'motion/react';
import { apiClient } from '@/src/api/client';
import { useTranslation } from 'react-i18next';

const Boglanish = () => {
  const { showToast } = useToast();
  const { t } = useTranslation('boglanish');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setIsSubmitting(true);
    try {
      await apiClient.post('/api/v1/applications', {
        type: data.get('subject') as string,
        full_name: data.get('full_name') as string,
        email: data.get('email') as string,
        message: data.get('message') as string,
      });
      showToast(t('form.success'), 'success');
      form.reset();
    } catch {
      showToast(t('form.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5 text-primary-600" />, label: t('info.email'), value: 'info@charityindex.uz' },
    { icon: <Phone className="w-5 h-5 text-primary-600" />, label: t('info.phone'), value: '+998 71 123 45 67' },
    { icon: <MapPin className="w-5 h-5 text-primary-600" />, label: t('info.address'), value: "Toshkent shahri, Mirzo Ulug'bek tumani" },
    { icon: <Clock className="w-5 h-5 text-primary-600" />, label: t('info.hours'), value: t('info.hoursValue') },
  ];

  return (
    <Layout>
      <div className="bg-primary-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{t('title')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('form.submit')}</h2>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('form.fullName')}</label>
                  <input
                    required
                    name="full_name"
                    type="text"
                    placeholder={t('form.fullName')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('form.email')}</label>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="example@mail.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('form.subject')}</label>
                  <select
                    name="subject"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none bg-white"
                  >
                    <option value="fond_qoshish">{t('subject.fond_qoshish')}</option>
                    <option value="hamkorlik">{t('subject.hamkorlik')}</option>
                    <option value="texnik">{t('subject.texnik')}</option>
                    <option value="other">{t('subject.other')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('form.message')}</label>
                  <textarea
                    required
                    name="message"
                    placeholder={t('form.messagePlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all h-28 resize-none"
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg"
                >
                  {isSubmitting ? t('form.submitting') : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('form.submit')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('info.email')}</h2>
              <div className="grid grid-cols-1 gap-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100/50">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{info.label}</div>
                      <div className="text-slate-900 font-semibold">{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-blue-600 rounded-3xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Ijtimoiy tarmoqlar</h3>
                <p className="text-blue-100 text-sm mb-6">Bizni kuzatib boring va yangiliklardan xabardor bo'ling</p>
                <div className="flex gap-3">
                  {['Telegram', 'Instagram', 'Facebook', 'LinkedIn'].map(social => (
                    <button key={social} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">
                      {social}
                    </button>
                  ))}
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Boglanish;
