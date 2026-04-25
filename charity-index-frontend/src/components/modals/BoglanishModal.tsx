import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/src/context/ToastContext';
import { cn } from '@/src/lib/utils';

interface BoglanishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BoglanishModal: React.FC<BoglanishModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Xabaringiz yuborildi! ✓', 'success');
    onClose();
    setFormData({ name: '', email: '', message: '' });
  };

  const infoCards = [
    { icon: Mail, text: 'info@charityindex.uz' },
    { icon: Phone, text: '+998 71 123 45 67' },
    { icon: MapPin, text: "Toshkent, O'zbekiston" },
    { icon: Clock, text: 'Dushanba-Juma: 9:00 - 18:00' },
  ];

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
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl pointer-events-auto overflow-hidden relative"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#EFF6FF]">
                <h3 className="text-xl font-bold text-[#1E293B]">Bog'lanish</h3>
                <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                  <X className="w-5 h-5 text-[#64748B]" />
                </button>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Left Side: Form */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-bold text-[#1E293B]">Xabar yuborish</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-[#374151] mb-2">Ismingiz</label>
                        <input
                          type="text"
                          placeholder="Ismingizni kiriting"
                          required
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#1E293B] focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#374151] mb-2">Email</label>
                        <input
                          type="email"
                          placeholder="Email manzilingiz"
                          required
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#1E293B] focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#374151] mb-2">Xabaringiz</label>
                        <textarea
                          placeholder="Xabaringizni yozing..."
                          required
                          className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-[#1E293B] focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none h-32 transition-all resize-none"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-[#1A56DB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-600/20"
                      >
                        Xabar Yuborish
                      </button>
                    </form>
                  </div>

                  {/* Right Side: Contact Info */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-bold text-[#1E293B]">Aloqa ma'lumotlari</h4>
                    <div className="space-y-4">
                      {infoCards.map((card, idx) => (
                        <div key={idx} className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-100">
                          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">
                            {idx === 0 ? 'EMAIL' : idx === 1 ? 'TELEFON' : idx === 2 ? 'MANZIL' : 'ISH VAQTI'}
                          </div>
                          <div className="flex items-center gap-3">
                            <card.icon className="w-4 h-4 text-[#1A56DB] shrink-0" />
                            <span className="text-sm text-[#1E293B] font-bold">{card.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        Savollaringiz bo'lsa, biz bilan bog'laning. Mutaxassislarimiz sizga 24 soat ichida javob berishadi.
                      </p>
                    </div>
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
