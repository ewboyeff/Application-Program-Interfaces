import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Send, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { BoglanishModal } from '../modals/BoglanishModal';
import { useSettingsStore } from '@/src/store/useSettingsStore';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const [isBoglanishOpen, setIsBoglanishOpen] = useState(false);
  const { settings } = useSettingsStore();
  const { t } = useTranslation('footer');

  return (
    <footer className="bg-[#1E293B] text-white py-16 relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1920&q=80"
          alt="Uzbekistan Nature Footer"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-70 mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(180deg, rgba(30,41,59,1) 0%, rgba(15,23,42,0.95) 100%)'
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 50px)'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-[2]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                <Heart className="w-[18px] h-[18px] text-[#1E293B] fill-[#1E293B]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-base leading-tight">Charity Index</span>
                <span className="text-[#1A56DB] text-sm font-medium leading-tight">Uzbekistan</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              {t('description')}
            </p>
            <div className="flex items-center gap-3 mt-6">
              {settings.telegram ? (
                <a href={settings.telegram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Send className="w-4 h-4" />
                </a>
              ) : (
                <span className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center opacity-40 cursor-not-allowed">
                  <Send className="w-4 h-4" />
                </span>
              )}
              {settings.instagram ? (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              ) : (
                <span className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center opacity-40 cursor-not-allowed">
                  <Instagram className="w-4 h-4" />
                </span>
              )}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('platform')}</h4>
            <ul className="space-y-4">
              <li><Link to="/funds" className="text-slate-400 hover:text-white transition-colors text-sm">{t('catalogue')}</Link></li>
              <li><Link to="/ranking" className="text-slate-400 hover:text-white transition-colors text-sm">{t('ranking')}</Link></li>
              <li><Link to="/compare" className="text-slate-400 hover:text-white transition-colors text-sm">{t('compare')}</Link></li>
              <li><Link to="/news" className="text-slate-400 hover:text-white transition-colors text-sm">{t('news')}</Link></li>
              <li><Link to="/metodologiya" className="text-slate-400 hover:text-white transition-colors text-sm">{t('methodology')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('company')}</h4>
            <ul className="space-y-4">
              <li><Link to="/tadqiqot" className="text-slate-400 hover:text-white transition-colors text-sm">{t('research')}</Link></li>
              <li><Link to="/hamkorlik" className="text-slate-400 hover:text-white transition-colors text-sm">{t('partnership')}</Link></li>
              <li><Link to="/boglanish" className="text-slate-400 hover:text-white transition-colors text-sm">{t('contact')}</Link></li>
              <li>
                <button
                  onClick={() => setIsBoglanishOpen(true)}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('sendRequest')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('contacts')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{settings.email}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-white/10 my-12" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Charity Index Uzbekistan. {t('rights')}
          </p>
        </div>
      </div>

      <BoglanishModal
        isOpen={isBoglanishOpen}
        onClose={() => setIsBoglanishOpen(false)}
      />
    </footer>
  );
};
