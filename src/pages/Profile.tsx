import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Shield,
  Settings,
  History,
  ChevronRight,
  LogOut,
  Camera,
  CreditCard,
  Bell,
  Lock,
  Loader2,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/src/components/layout/Layout';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/context/ToastContext';
import { authApi } from '@/src/api/auth';
import { cn } from '@/src/lib/utils';

type TabType = 'personal' | 'donations' | 'settings';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation('profile');
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    region: user?.region || 'Toshkent sh.'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Password change form state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', next: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = t('personal.errors.fullName');
    }

    if (formData.phone && !/^\+998 \d{2} \d{3} \d{2} \d{2}$/.test(formData.phone)) {
      newErrors.phone = t('personal.errors.phone');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast(t('personal.errors.fullName'), 'error');
      return;
    }

    setSaving(true);
    try {
      await updateUser(formData);
      showToast(t('personal.save') + ' ✓', 'success');
    } catch {
      showToast(t('personal.errors.saveFailed'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const validatePassword = () => {
    const newErrors: { [key: string]: string } = {};
    if (!passwordData.current) newErrors.current = t('settings.passwordForm.errors.required');
    if (passwordData.next.length < 6) newErrors.next = t('settings.passwordForm.errors.tooShort');
    if (passwordData.confirm !== passwordData.next) newErrors.confirm = t('settings.passwordForm.errors.mismatch');
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setPasswordSaving(true);
    try {
      await authApi.changePassword(passwordData.current, passwordData.next);
      showToast(t('settings.passwordForm.success'), 'success');
      setPasswordData({ current: '', next: '', confirm: '' });
      setShowPasswordForm(false);
    } catch (err: any) {
      const code = err?.error?.code;
      showToast(
        code === 'WRONG_PASSWORD' ? t('settings.passwordForm.errors.wrongCurrent') : t('settings.passwordForm.errors.failed'),
        'error'
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Simple auto-formatting for phone number
    if (value.startsWith('+998') && value.length <= 17) {
      // Allow only digits after +998
      const digits = value.slice(4).replace(/\D/g, '');
      let formatted = '+998';
      if (digits.length > 0) formatted += ' ' + digits.slice(0, 2);
      if (digits.length > 2) formatted += ' ' + digits.slice(2, 5);
      if (digits.length > 5) formatted += ' ' + digits.slice(5, 7);
      if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);
      value = formatted;
    } else if (!value.startsWith('+998') && value.length > 0) {
      value = '+998 ' + value.replace(/\D/g, '').slice(0, 9);
    }

    setFormData({ ...formData, phone: value });
  };

  if (!user) return null;

  const tabs = [
    { id: 'personal',  label: t('tabs.personal'),  icon: UserIcon },
    { id: 'donations', label: t('tabs.donations'), icon: History },
    { id: 'settings',  label: t('tabs.settings'),  icon: Settings },
  ];

  return (
    <Layout>
      <div className="bg-[#F8FAFC] min-h-screen pb-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#1A56DB] to-[#1E3A8A] pt-12 pb-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                  {user.full_name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg text-[#1A56DB] hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-black text-white tracking-tight">{user.full_name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-white/90 text-sm backdrop-blur-sm">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-white/90 text-sm backdrop-blur-sm">
                    <Shield className="w-3.5 h-3.5" />
                    {user.role === 'admin' ? t('roles.admin') : t('roles.user')}
                  </div>
                </div>
              </div>

              <div className="md:ml-auto flex gap-3">
                <button 
                  onClick={() => logout()}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold backdrop-blur-sm transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 -mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all",
                        activeTab === tab.id
                          ? "bg-[#EFF6FF] text-[#1A56DB]"
                          : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
                      )}
                    >
                      <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-[#1A56DB]" : "text-[#94A3B8]")} />
                      {tab.label}
                      <ChevronRight className={cn("w-4 h-4 ml-auto transition-transform", activeTab === tab.id ? "rotate-90" : "")} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6">
                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm text-center">
                  <div className="text-2xl font-black text-[#1A56DB]">0</div>
                  <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mt-1">{t('stats.donations')}</div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden min-h-[500px]">
                {activeTab === 'personal' && (
                  <div className="p-8">
                    <h2 className="text-xl font-black text-[#1E293B] mb-6">{t('personal.title')}</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-[#374151] mb-2">{t('personal.fullName')}</label>
                          <input 
                            type="text" 
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className={cn(
                              "w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-sm text-[#1E293B] focus:border-[#1A56DB] outline-none transition-all",
                              errors.full_name ? "border-red-500" : "border-[#E2E8F0]"
                            )}
                          />
                          {errors.full_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.full_name}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#374151] mb-2">{t('personal.email')}</label>
                          <input 
                            type="email" 
                            value={user.email}
                            disabled
                            className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#94A3B8] cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#374151] mb-2">{t('personal.phone')}</label>
                          <input 
                            type="tel" 
                            placeholder="+998 90 123 45 67"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            className={cn(
                              "w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-sm text-[#1E293B] focus:border-[#1A56DB] outline-none transition-all",
                              errors.phone ? "border-red-500" : "border-[#E2E8F0]"
                            )}
                          />
                          {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#374151] mb-2">{t('personal.region')}</label>
                          <select 
                            value={formData.region}
                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] focus:border-[#1A56DB] outline-none transition-all"
                          >
                            <option>Toshkent sh.</option>
                            <option>Toshkent vil.</option>
                            <option>Samarqand</option>
                            <option>Buxoro</option>
                            <option>Farg'ona</option>
                            <option>Andijon</option>
                            <option>Namangan</option>
                            <option>Navoiy</option>
                            <option>Qashqadaryo</option>
                            <option>Surxondaryo</option>
                            <option>Jizzax</option>
                            <option>Sirdaryo</option>
                            <option>Xorazm</option>
                            <option>Qoraqalpog'iston R.</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-8 py-3.5 bg-[#1A56DB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                        >
                          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                          {t('personal.save')}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'donations' && (
                  <div className="p-8 text-center py-20">
                    <div className="w-20 h-20 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-4">
                      <History className="w-10 h-10 text-[#94A3B8]" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold mb-3">
                      <Clock className="w-3.5 h-3.5" />
                      {t('comingSoon')}
                    </div>
                    <h3 className="text-xl font-black text-[#1E293B]">{t('donations.empty')}</h3>
                    <p className="text-[#64748B] mt-2">{t('donations.emptyDesc')}</p>
                    <Link
                      to="/funds"
                      className="inline-block mt-6 px-6 py-3 bg-[#1A56DB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] transition-all"
                    >
                      {t('donations.viewFunds')}
                    </Link>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="p-8">
                    <h2 className="text-xl font-black text-[#1E293B] mb-8">{t('settings.title')}</h2>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                              <Bell className="w-5 h-5 text-[#94A3B8]" />
                            </div>
                            <div>
                              <div className="font-bold text-[#1E293B]">{t('settings.notifications')}</div>
                              <div className="text-xs text-[#64748B]">{t('settings.notificationsDesc')}</div>
                            </div>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            {t('comingSoon')}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                              <Lock className="w-5 h-5 text-[#1A56DB]" />
                            </div>
                            <div>
                              <div className="font-bold text-[#1E293B]">{t('settings.security')}</div>
                              <div className="text-xs text-[#64748B]">{t('settings.securityDesc')}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowPasswordForm((v) => !v)}
                            className="text-sm font-bold text-[#1A56DB] hover:underline"
                          >
                            {t('settings.change')}
                          </button>
                        </div>

                        {showPasswordForm && (
                          <form onSubmit={handleChangePassword} className="mt-5 pt-5 border-t border-[#E2E8F0] space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-[#374151] mb-1.5">{t('settings.passwordForm.current')}</label>
                              <input
                                type="password"
                                value={passwordData.current}
                                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                className={cn(
                                  "w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-[#1E293B] focus:border-[#1A56DB] outline-none transition-all",
                                  passwordErrors.current ? "border-red-500" : "border-[#E2E8F0]"
                                )}
                              />
                              {passwordErrors.current && <p className="text-red-500 text-xs mt-1 font-medium">{passwordErrors.current}</p>}
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[#374151] mb-1.5">{t('settings.passwordForm.next')}</label>
                              <input
                                type="password"
                                value={passwordData.next}
                                onChange={(e) => setPasswordData({ ...passwordData, next: e.target.value })}
                                className={cn(
                                  "w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-[#1E293B] focus:border-[#1A56DB] outline-none transition-all",
                                  passwordErrors.next ? "border-red-500" : "border-[#E2E8F0]"
                                )}
                              />
                              {passwordErrors.next && <p className="text-red-500 text-xs mt-1 font-medium">{passwordErrors.next}</p>}
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[#374151] mb-1.5">{t('settings.passwordForm.confirm')}</label>
                              <input
                                type="password"
                                value={passwordData.confirm}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                className={cn(
                                  "w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-[#1E293B] focus:border-[#1A56DB] outline-none transition-all",
                                  passwordErrors.confirm ? "border-red-500" : "border-[#E2E8F0]"
                                )}
                              />
                              {passwordErrors.confirm && <p className="text-red-500 text-xs mt-1 font-medium">{passwordErrors.confirm}</p>}
                            </div>
                            <button
                              type="submit"
                              disabled={passwordSaving}
                              className="px-6 py-2.5 bg-[#1A56DB] text-white rounded-xl text-sm font-bold hover:bg-[#1D4ED8] transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                            >
                              {passwordSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                              {t('settings.passwordForm.submit')}
                            </button>
                          </form>
                        )}
                      </div>

                      <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                              <CreditCard className="w-5 h-5 text-[#94A3B8]" />
                            </div>
                            <div>
                              <div className="font-bold text-[#1E293B]">{t('settings.payment')}</div>
                              <div className="text-xs text-[#64748B]">{t('settings.paymentDesc')}</div>
                            </div>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            {t('comingSoon')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-[#F1F5F9]">
                      <h3 className="text-sm font-bold text-red-600 mb-4">{t('settings.danger')}</h3>
                      <div className="flex items-center gap-3">
                        <button
                          disabled
                          className="px-6 py-3 border border-red-200 text-red-600 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed"
                        >
                          {t('settings.deleteAccount')}
                        </button>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {t('comingSoon')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
