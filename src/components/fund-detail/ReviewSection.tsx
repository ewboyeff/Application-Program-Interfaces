import React, { useState, useEffect } from 'react';
import { Star, Send, LogIn, MessageSquare, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/context/ToastContext';
import { reviewsApi } from '@/src/api/reviews';
import { Review } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface ReviewSectionProps {
  fundId: string;
  className?: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ fundId, className }) => {
  const { t } = useTranslation('fund_detail');
  const { user } = useAuth();
  const { showToast } = useToast();

  const [reviews, setReviews]         = useState<Review[]>([]);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [rating, setRating]           = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment]         = useState('');

  useEffect(() => {
    setLoading(true);
    reviewsApi.getByFund(fundId)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [fundId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { showToast(t('reviews.toast.ratingRequired'), 'warning'); return; }
    setSubmitting(true);
    try {
      await reviewsApi.create(fundId, rating, comment || undefined);
      showToast(t('reviews.toast.success'), 'success');
      setRating(0);
      setComment('');
    } catch (err: any) {
      const msg = err?.error?.message || t('reviews.toast.error');
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Compute stats from real reviews
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews
    : 0;

  const ratingStats = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  const formatDate = (iso: string) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return iso; }
  };

  return (
    <div className={cn('bg-white shadow-card rounded-[32px] p-8 border border-slate-100', className)}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{t('reviews.title')}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{t('reviews.subtitle')}</p>
        </div>
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-slate-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
            <div className="bg-slate-50 rounded-[24px] p-8 text-center flex flex-col items-center justify-center border border-slate-100">
              <div className="text-6xl font-black text-slate-900 tracking-tighter mb-2">
                {totalReviews > 0 ? avgRating.toFixed(1) : '—'}
              </div>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={cn('w-5 h-5', s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')} />
                ))}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {totalReviews > 0 ? t('reviews.basedOnReviews', { count: totalReviews }) : t('reviews.noReviewsYet')}
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-center space-y-3">
              {ratingStats.map((stat) => (
                <div key={stat.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 w-10">
                    <span className="text-xs font-black text-slate-600">{stat.stars}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: totalReviews > 0 ? `${(stat.count / totalReviews) * 100}%` : '0%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-amber-400 rounded-full"
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-400 w-8 text-right">{stat.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="text-center py-10 mb-8 text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">{t('reviews.noReviewsApproved')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 relative">
                  <div className="absolute left-0 top-6 bottom-6 w-1 bg-amber-400 rounded-r-full" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{review.userName}</h4>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={cn('w-3 h-3', s <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  {review.comment && (
                    <blockquote className="text-sm text-slate-600 leading-relaxed italic">
                      "{review.comment}"
                    </blockquote>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Submit form */}
          <div className="bg-slate-900 rounded-[24px] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-[80px] rounded-full pointer-events-none" />
            {!user ? (
              <div className="text-center py-6 relative z-10">
                <h3 className="text-xl font-black mb-2">{t('reviews.loginCta.title')}</h3>
                <p className="text-white/50 text-sm mb-8">{t('reviews.loginCta.subtitle')}</p>
                <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20">
                  <LogIn className="w-5 h-5" />
                  {t('reviews.loginCta.button')}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h3 className="text-xl font-black mb-1">{t('reviews.form.title')}</h3>
                    <p className="text-white/50 text-sm">{t('reviews.form.subtitle')}</p>
                  </div>
                  <div className="flex gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button"
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(s)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star className={cn('w-8 h-8 transition-colors', (hoverRating || rating) >= s ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-white/20')} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative mb-6">
                  <textarea
                    placeholder={t('reviews.form.placeholder')}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none min-h-[120px] transition-all"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full sm:w-auto px-10 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-100 transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? t('reviews.form.submitting') : t('reviews.form.submit')}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
};
