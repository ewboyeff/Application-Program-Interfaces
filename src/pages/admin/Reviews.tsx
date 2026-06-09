import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { useDataStore } from '@/src/store/useDataStore';
import { useToast } from '@/src/context/ToastContext';
import { reviewsApi } from '@/src/api/reviews';
import { Review } from '@/src/types';
import { cn } from '@/src/lib/utils';

export const AdminReviews: React.FC = () => {
  const { showToast } = useToast();
  const { funds } = useDataStore();
  const [reviews, setReviews]       = useState<Review[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeFilter, setActiveFilter] = useState('pending');

  useEffect(() => {
    setLoading(true);
    reviewsApi.getAll({ per_page: 100 })
      .then(({ reviews }) => setReviews(reviews))
      .catch(() => showToast('Izohlarni yuklashda xatolik', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filteredReviews = reviews.filter((r) =>
    activeFilter === 'all' ? true : r.status === activeFilter
  );

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      if (status === 'approved') {
        await reviewsApi.approve(id);
        setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: 'approved' } : r));
      } else {
        await reviewsApi.delete(id);
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
      showToast(`Izoh ${status === 'approved' ? 'tasdiqlandi' : 'rad etildi'}`, 'success');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const getFundName = (id: string) =>
    funds.find((f) => f.id === id)?.name_uz || "Noma'lum fond";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Izohlar Moderatsiyasi</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Foydalanuvchilar tomonidan qoldirilgan fikrlarni nazorat qilish</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'pending', label: 'Kutilayotgan', icon: Clock },
          { id: 'approved', label: 'Tasdiqlangan', icon: CheckCircle2 },
          { id: 'rejected', label: 'Rad etilgan', icon: XCircle },
          { id: 'all', label: 'Barchasi', icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeFilter === tab.id 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Fond</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Foydalanuvchi</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Reyting</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Izoh</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sana</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-slate-300 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <MessageSquare className="w-12 h-12 opacity-20" />
                      <p className="text-sm font-bold">Hech qanday izoh topilmadi</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{getFundName(review.fundId)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {review.userName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{review.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-slate-900">{review.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-slate-600 line-clamp-2">{review.comment}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 font-medium">{review.date}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        review.status === 'approved' ? "bg-emerald-50 text-emerald-600" :
                        review.status === 'rejected' ? "bg-rose-50 text-rose-600" :
                        "bg-amber-50 text-amber-600"
                      )}>
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          review.status === 'approved' ? "bg-emerald-500" :
                          review.status === 'rejected' ? "bg-rose-500" :
                          "bg-amber-500"
                        )} />
                        {review.status === 'approved' ? 'Tasdiqlangan' : 
                         review.status === 'rejected' ? 'Rad etilgan' : 'Kutilmoqda'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {review.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(review.id, 'approved')}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Tasdiqlash"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(review.id, 'rejected')}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Rad etish"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
