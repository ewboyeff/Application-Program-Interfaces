import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ap } from '@/src/lib/adminPath';
import {
  Building2,
  FolderOpen,
  Users,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Loader2,
  Inbox,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { adminApiClient } from '@/src/api/client';
import { FundAvatar } from '@/src/components/ui/FundAvatar';
import { GradeBadge } from '@/src/components/ui/GradeBadge';
import { cn } from '@/src/lib/utils';

interface DashboardStats {
  total_funds: number;
  total_projects: number;
  total_users: number;
  total_applications: number;
  pending_reviews: number;
  pending_complaints: number;
  funds_by_grade: {
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
    unrated: number;
  };
  recent_funds: {
    id: string;
    name_uz: string;
    logo_initials: string;
    logo_color: string;
    category: string;
    grade: string;
    overall: number;
    is_active: boolean;
    slug: string;
  }[];
}

const StatCard = ({ icon: Icon, label, value, sub, color, loading }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110', color)}>
        <Icon className="w-6 h-6" />
      </div>
      {sub && (
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold">
          {sub}
        </div>
      )}
    </div>
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      {loading ? (
        <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse" />
      ) : (
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
      )}
    </div>
  </div>
);

const GRADE_COLORS: Record<string, string> = {
  platinum: '#8B5CF6',
  gold: '#F59E0B',
  silver: '#6B7280',
  bronze: '#B45309',
  unrated: '#E2E8F0',
};

const GRADE_LABELS: Record<string, string> = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
  unrated: "Baholanmagan",
};

const BarChart3 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
  </svg>
);

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiClient
      .get<DashboardStats>('/api/v1/stats/dashboard')
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const gradeData = stats
    ? Object.entries(stats.funds_by_grade)
        .filter(([, v]) => v > 0)
        .map(([grade, value]) => ({
          name: GRADE_LABELS[grade] ?? grade,
          value,
          color: GRADE_COLORS[grade] ?? '#E2E8F0',
        }))
    : [];

  const pendingTotal = stats ? stats.pending_reviews + stats.pending_complaints : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Building2}
          label="Jami Fondlar"
          value={`${stats?.total_funds ?? 0} ta`}
          color="bg-blue-50 text-blue-600"
          loading={loading}
        />
        <StatCard
          icon={FolderOpen}
          label="Jami Loyihalar"
          value={`${stats?.total_projects ?? 0} ta`}
          color="bg-emerald-50 text-emerald-600"
          loading={loading}
        />
        <StatCard
          icon={Users}
          label="Foydalanuvchilar"
          value={`${stats?.total_users ?? 0} ta`}
          color="bg-orange-50 text-orange-600"
          loading={loading}
        />
        <StatCard
          icon={AlertTriangle}
          label="Kutilayotgan"
          value={`${pendingTotal} ta`}
          sub="izoh + shikoyat"
          color="bg-rose-50 text-rose-600"
          loading={loading}
        />
      </div>

      {/* Charts & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funds by Grade */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Fondlar daraja bo'yicha
          </h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
            </div>
          ) : gradeData.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-slate-300 gap-3">
              <BarChart3 className="w-12 h-12 opacity-30" />
              <p className="text-sm font-medium">Ma'lumot yo'q</p>
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Applications summary */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Tizim statistikasi
          </h3>
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {[
                { label: "Jami fondlar", value: stats?.total_funds ?? 0, color: "bg-blue-500", max: Math.max(stats?.total_funds ?? 1, 1) },
                { label: "Jami loyihalar", value: stats?.total_projects ?? 0, color: "bg-emerald-500", max: Math.max(stats?.total_projects ?? 1, 1) },
                { label: "Foydalanuvchilar", value: stats?.total_users ?? 0, color: "bg-orange-400", max: Math.max(stats?.total_users ?? 1, 1) },
                { label: "Murojaatlar", value: stats?.total_applications ?? 0, color: "bg-violet-500", max: Math.max(stats?.total_applications ?? 1, 1) },
                { label: "Kutilayotgan izohlar", value: stats?.pending_reviews ?? 0, color: "bg-amber-400", max: Math.max(stats?.pending_reviews ?? 1, 1) },
                { label: "Kutilayotgan shikoyatlar", value: stats?.pending_complaints ?? 0, color: "bg-rose-500", max: Math.max(stats?.pending_complaints ?? 1, 1) },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                    <span className="text-sm font-black text-slate-900">{item.value}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", item.color)}
                      style={{ width: item.value === 0 ? '2px' : '100%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link
            to={ap('/applications')}
            className="mt-6 flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-2xl text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors group"
          >
            <span className="flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              Murojaatlarni ko'rish
            </span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Recent Funds Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">So'nggi qo'shilgan fondlar</h3>
          <Link to={ap('/funds')} className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1">
            Barchasini ko'rish
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Fond</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Kategoriya</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Indeks</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Daraja</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <Loader2 className="w-8 h-8 text-slate-300 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : !stats?.recent_funds?.length ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-slate-400 text-sm">
                    Hali fond qo'shilmagan
                  </td>
                </tr>
              ) : (
                stats.recent_funds.map((fund) => (
                  <tr key={fund.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <FundAvatar initials={fund.logo_initials} color={fund.logo_color} size="sm" />
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {fund.name_uz}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        {fund.category || '—'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className="text-sm font-bold text-slate-900">{fund.overall}</span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <GradeBadge grade={fund.grade as any} className="scale-90" />
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        fund.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", fund.is_active ? "bg-emerald-500" : "bg-slate-400")} />
                        {fund.is_active ? "Faol" : "Nofaol"}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <Link
                        to={ap(`/funds/${fund.id}`)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-bold"
                      >
                        Tahrirlash
                      </Link>
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
