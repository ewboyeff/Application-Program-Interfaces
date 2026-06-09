import React, { useState } from 'react';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldAlert,
  Save,
  Trash2,
  Send,
  Instagram,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/src/context/ToastContext';
import { useSettingsStore } from '@/src/store/useSettingsStore';
import { adminApiClient } from '@/src/api/client';

export const AdminSettings: React.FC = () => {
  const { showToast } = useToast();
  const { settings, updateSettings } = useSettingsStore();
  const [platformSettings, setPlatformSettings] = useState({ ...settings });

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePlatformSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(platformSettings);
    showToast('Platforma sozlamalari saqlandi', 'success');
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast("Yangi parollar mos kelmadi", 'error');
      return;
    }
    if (passwords.new.length < 6) {
      showToast("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak", 'error');
      return;
    }
    setChangingPassword(true);
    try {
      await adminApiClient.post('/api/v1/auth/change-password', {
        current_password: passwords.current,
        new_password: passwords.new,
      });
      showToast("Parol muvaffaqiyatli yangilandi", 'success');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      const msg = err?.detail?.message || "Joriy parol noto'g'ri";
      showToast(msg, 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleResetData = () => {
    if (window.confirm('DIQQAT! Barcha ma\'lumotlarni tozalashni xohlaysizmi? Bu amalni ortga qaytarib bo\'lmaydi.')) {
      showToast('Barcha ma\'lumotlar tozalandi', 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tizim Sozlamalari</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Platforma va xavfsizlik sozlamalarini boshqarish</p>
      </div>

      {/* Platform Settings */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Platforma sozlamalari</h2>
        </div>
        <form onSubmit={handlePlatformSave} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Platforma nomi</label>
              <input 
                type="text" 
                value={platformSettings.name}
                onChange={(e) => setPlatformSettings({...platformSettings, name: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-3 px-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={platformSettings.email}
                  onChange={(e) => setPlatformSettings({...platformSettings, email: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={platformSettings.phone}
                  onChange={(e) => setPlatformSettings({...platformSettings, phone: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Manzil</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={platformSettings.address}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, address: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Telegram havolasi</label>
              <div className="relative">
                <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="url"
                  placeholder="https://t.me/..."
                  value={platformSettings.telegram}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, telegram: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Instagram havolasi</label>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={platformSettings.instagram}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, instagram: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Saqlash
            </button>
          </div>
        </form>
      </div>

      {/* Admin Account */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Admin hisobi</h2>
        </div>
        <div className="p-8 space-y-8">
          <div className="space-y-2 max-w-sm">
            <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
            <input 
              type="text" 
              value="admin"
              disabled
              className="w-full bg-slate-100 border-2 border-slate-100 rounded-2xl py-3 px-4 text-slate-400 font-bold cursor-not-allowed"
            />
          </div>
          
          <div className="pt-6 border-t border-slate-50">
            <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider text-[10px]">Parolni o'zgartirish</h3>
            <form onSubmit={handlePasswordSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Joriy parol</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-medium focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Yangi parol</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-medium focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tasdiqlash</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-medium focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-60"
                >
                  {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Parolni yangilash
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-50 rounded-[32px] border border-rose-100 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-sm border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <p className="text-rose-900 font-bold text-lg">Xavfli zona</p>
            <p className="text-rose-600/70 text-sm font-medium">Barcha ma'lumotlarni tozalash va tizimni qayta tiklash</p>
          </div>
        </div>
        <button 
          onClick={handleResetData}
          className="flex items-center gap-2 px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 shadow-xl shadow-rose-600/20 transition-all active:scale-95"
        >
          <Trash2 className="w-5 h-5" />
          Barcha ma'lumotlarni tozalash
        </button>
      </div>
    </div>
  );
};
