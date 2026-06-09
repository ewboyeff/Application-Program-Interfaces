import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  MessageSquare,
  Save,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/src/context/ToastContext';
import { complaintsApi } from '@/src/api/complaints';
import { Complaint } from '@/src/types';
import { cn } from '@/src/lib/utils';

export const AdminComplaints: React.FC = () => {
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    complaintsApi.getList({ per_page: 100 })
      .then(({ complaints }) => setComplaints(complaints))
      .catch(() => showToast('Shikoyatlarni yuklashda xatolik', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filteredComplaints = complaints.filter(c =>
    activeFilter === 'all' ? true : c.status === activeFilter
  );

  const handleExpand = (complaint: Complaint) => {
    if (expandedId === complaint.id) {
      setExpandedId(null);
    } else {
      setExpandedId(complaint.id);
      setSelectedStatus(complaint.status);
      setAdminNote('');
    }
  };

  const handleSave = async (id: string) => {
    try {
      await complaintsApi.update(id, selectedStatus, adminNote || undefined);
      setComplaints(prev =>
        prev.map(c => c.id === id ? { ...c, status: selectedStatus as Complaint['status'] } : c)
      );
      showToast('Shikoyat holati yangilandi', 'success');
      setExpandedId(null);
      setAdminNote('');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('uz-UZ', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shikoyatlar Boshqaruvi</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Fondlar ustidan tushgan shikoyatlarni ko'rib chiqish</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'pending',  label: 'Kutilayotgan', icon: Clock },
          { id: 'reviewed', label: "Ko'rilgan",    icon: MessageSquare },
          { id: 'resolved', label: 'Hal etilgan',  icon: CheckCircle2 },
          { id: 'all',      label: 'Barchasi',     icon: AlertTriangle },
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

      {/* Complaints List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-20 text-center">
          <Loader2 className="w-8 h-8 text-slate-300 animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white p-20 rounded-[32px] border border-slate-100 shadow-sm text-center">
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <AlertTriangle className="w-12 h-12 opacity-20" />
                <p className="text-sm font-bold">Hech qanday shikoyat topilmadi</p>
              </div>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className={cn(
                  "bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300",
                  expandedId === complaint.id ? "ring-2 ring-blue-600/10 shadow-lg" : "hover:border-slate-200"
                )}
              >
                <div
                  className="p-6 flex items-center justify-between cursor-pointer"
                  onClick={() => handleExpand(complaint)}
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                      complaint.status === 'pending'  ? "bg-rose-50 text-rose-600" :
                      complaint.status === 'reviewed' ? "bg-amber-50 text-amber-600" :
                      "bg-emerald-50 text-emerald-600"
                    )}>
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{complaint.reason}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {complaint.userName}
                        </span>
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(complaint.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      complaint.status === 'pending'  ? "bg-rose-50 text-rose-600" :
                      complaint.status === 'reviewed' ? "bg-amber-50 text-amber-600" :
                      "bg-emerald-50 text-emerald-600"
                    )}>
                      {complaint.status === 'pending'  ? 'Kutilmoqda' :
                       complaint.status === 'reviewed' ? "Ko'rilmoqda" : 'Hal etildi'}
                    </span>
                    {expandedId === complaint.id
                      ? <ChevronUp className="w-5 h-5 text-slate-400" />
                      : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {expandedId === complaint.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                      <p className="text-[10px] font-bold text-slate-900 mb-2 uppercase tracking-wider">Shikoyat tavsifi:</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{complaint.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Admin izohi</label>
                        <textarea
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          placeholder="Shikoyat bo'yicha ko'rilgan choralar..."
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 transition-all outline-none resize-none h-24"
                        />
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Holatni yangilash</label>
                          <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 text-sm text-slate-900 font-bold focus:bg-white focus:border-blue-600 transition-all outline-none"
                          >
                            <option value="pending">Kutilmoqda</option>
                            <option value="reviewed">Ko'rilmoqda</option>
                            <option value="resolved">Hal etildi</option>
                          </select>
                        </div>
                        <button
                          onClick={() => handleSave(complaint.id)}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                        >
                          <Save className="w-4 h-4" />
                          Saqlash
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
