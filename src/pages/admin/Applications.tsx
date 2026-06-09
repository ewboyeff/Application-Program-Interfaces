import React, { useState, useEffect } from 'react';
import { Inbox, Clock, CheckCircle2, XCircle, Loader2, Mail, MessageSquare } from 'lucide-react';
import { adminApiClient } from '@/src/api/client';
import { useToast } from '@/src/context/ToastContext';
import { cn } from '@/src/lib/utils';

interface Application {
  id: string;
  type: string;
  full_name: string;
  organization: string | null;
  phone: string | null;
  email: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; per_page: number; total_pages: number };
}

const TYPE_LABELS: Record<string, string> = {
  partner: 'Hamkor',
  sponsor: 'Homiy',
  volunteer: 'Volonter',
  media: 'Media',
  fond_qoshish: "Fond qo'shish",
  hamkorlik: 'Hamkorlik taklifi',
  texnik: 'Texnik muammo',
  other: 'Boshqa',
};

const TYPE_COLORS: Record<string, string> = {
  fond_qoshish: 'bg-violet-50 text-violet-700',
  hamkorlik: 'bg-blue-50 text-blue-700',
  texnik: 'bg-orange-50 text-orange-700',
  partner: 'bg-blue-50 text-blue-700',
  sponsor: 'bg-emerald-50 text-emerald-700',
  volunteer: 'bg-teal-50 text-teal-700',
  media: 'bg-pink-50 text-pink-700',
  other: 'bg-slate-100 text-slate-600',
};

const STATUS_CONFIG = {
  pending:  { label: 'Kutilmoqda', color: 'bg-amber-50 text-amber-600',  dot: 'bg-amber-500' },
  new:      { label: 'Yangi',       color: 'bg-blue-50 text-blue-600',    dot: 'bg-blue-500' },
  approved: { label: 'Qabul qilindi', color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
  rejected: { label: 'Rad etildi',  color: 'bg-rose-50 text-rose-600',    dot: 'bg-rose-500' },
};

export const AdminApplications: React.FC = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    adminApiClient
      .get<PaginatedResponse<Application>>('/api/v1/applications?per_page=100')
      .then((res) => setApplications(res.data ?? []))
      .catch(() => showToast('Murojaatlarni yuklashda xatolik', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter((a) =>
    activeFilter === 'all' ? true : a.status === activeFilter
  );

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

  const tabs = [
    { id: 'all',      label: 'Barchasi',       icon: Inbox,        count: applications.length },
    { id: 'new',      label: 'Yangi',           icon: Clock,        count: applications.filter(a => a.status === 'new').length },
    { id: 'pending',  label: 'Kutilayotgan',   icon: Clock,        count: applications.filter(a => a.status === 'pending').length },
    { id: 'approved', label: 'Qabul qilingan', icon: CheckCircle2, count: applications.filter(a => a.status === 'approved').length },
    { id: 'rejected', label: 'Rad etilgan',    icon: XCircle,      count: applications.filter(a => a.status === 'rejected').length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Murojaatlar</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Bog'lanish formasi va hamkorlik so'rovlari</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl w-fit flex-wrap">
        {tabs.filter(t => t.id === 'all' || t.count > 0).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeFilter === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                activeFilter === tab.id ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Ism</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Aloqa</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Mavzu</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sana</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Xabar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-slate-300 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Inbox className="w-12 h-12 opacity-20" />
                      <p className="text-sm font-bold">Hech qanday murojaat topilmadi</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const statusCfg = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.new;
                  const isExpanded = expandedId === app.id;
                  return (
                    <React.Fragment key={app.id}>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                              {app.full_name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{app.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            {app.email && (
                              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {app.email}
                              </div>
                            )}
                            {app.phone && (
                              <div className="text-xs text-slate-400">{app.phone}</div>
                            )}
                            {app.organization && (
                              <div className="text-xs text-slate-400">{app.organization}</div>
                            )}
                            {!app.email && !app.phone && !app.organization && (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-block px-2.5 py-1 text-xs font-bold rounded-full",
                            TYPE_COLORS[app.type] ?? 'bg-slate-100 text-slate-600'
                          )}>
                            {TYPE_LABELS[app.type] ?? app.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-400 font-medium">{formatDate(app.created_at)}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            statusCfg.color
                          )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {app.message ? (
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : app.id)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Xabarni ko'rish"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                      {isExpanded && app.message && (
                        <tr className="bg-blue-50/40">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="flex gap-3">
                              <MessageSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                              <p className="text-sm text-slate-700 leading-relaxed">{app.message}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
