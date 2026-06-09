import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/src/context/ToastContext';
import { useAuth } from '@/src/context/AuthContext';
import { complaintsApi } from '@/src/api/complaints';
import { cn } from '@/src/lib/utils';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundId: string;
  fundName: string;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ isOpen, onClose, fundId, fundName }) => {
  const { t } = useTranslation('fund_detail');
  const { showToast } = useToast();
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast(t('complaintModal.toast.loginRequired'), 'warning');
      return;
    }
    if (!reason) {
      showToast(t('complaintModal.toast.reasonRequired'), 'warning');
      return;
    }
    if (description.length < 20) {
      showToast(t('complaintModal.toast.descriptionRequired'), 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await complaintsApi.create(fundId, reason, description);
      showToast(t('complaintModal.toast.success'), 'success');
      onClose();
      setReason('');
      setDescription('');
    } catch {
      showToast(t('complaintModal.toast.error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const reasons = t('complaintModal.reasons', { returnObjects: true }) as string[];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl pointer-events-auto overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-red-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{t('complaintModal.title')}</h3>
                    <p className="text-xs text-red-600 font-medium">{fundName}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-red-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">{t('complaintModal.reasonLabel')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reasons.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReason(r)}
                        className={cn(
                          'px-4 py-2.5 rounded-xl text-sm font-medium border text-left transition-all',
                          reason === r
                            ? 'bg-red-50 border-red-600 text-red-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-red-200'
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t('complaintModal.descriptionLabel')}</label>
                  <textarea
                    placeholder={t('complaintModal.placeholder')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none min-h-[120px] transition-all"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="mt-1 text-[10px] text-slate-400 text-right">
                    {t('complaintModal.charCount', { count: description.length })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 border-2 border-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    {t('complaintModal.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? t('complaintModal.submitting') : t('complaintModal.submit')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
