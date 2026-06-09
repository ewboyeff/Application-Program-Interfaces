import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Edit2,
  Trash2,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/src/context/ToastContext';
import { apiClient } from '@/src/api/client';
import { cn } from '@/src/lib/utils';

interface ApiUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  fund_id: string | null;
  last_login: string | null;
  created_at: string;
}

export const AdminUsers: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{ data: ApiUser[]; meta: any }>('/api/v1/users?per_page=100');
      setUsers((res as any).data ?? []);
    } catch (err) {
      showToast('Foydalanuvchilarni yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleStatus = async (user: ApiUser) => {
    try {
      await apiClient.put(`/api/v1/users/${user.id}`, { is_active: !user.is_active });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
      showToast('Foydalanuvchi holati yangilandi', 'success');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await apiClient.put(`/api/v1/users/${id}`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
      showToast('Foydalanuvchi roli yangilandi', 'success');
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Rostdan ham "${name}" foydalanuvchisini o'chirmoqchimisiz?`)) return;
    try {
      await apiClient.delete(`/api/v1/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast('Foydalanuvchi o\'chirildi', 'success');
    } catch (err: any) {
      showToast(err?.error?.message || 'Xatolik yuz berdi', 'error');
    }
  };

  const filtered = users.filter(u =>
    (u.full_name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Foydalanuvchilar Boshqaruvi</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Tizim foydalanuvchilari va ularning huquqlarini boshqarish</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Ism yoki email bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-600/10 transition-all outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Foydalanuvchi</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Rol</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Faol</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Oxirgi kirish</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {(user.full_name ?? user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {user.full_name || '—'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={cn(
                          "bg-slate-50 border-none rounded-lg py-1 px-2 text-[10px] font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-600/10",
                          user.role === 'admin' ? "text-blue-600" :
                          user.role === 'moderator' ? "text-purple-600" :
                          user.role === 'fund_rep' ? "text-emerald-600" :
                          "text-slate-600"
                        )}
                      >
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="fund_rep">Fond vakili</option>
                        <option value="user">Foydalanuvchi</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={cn(
                          "p-1.5 rounded-lg transition-all",
                          user.is_active ? "text-emerald-500 bg-emerald-50" : "text-slate-300 bg-slate-50 hover:text-rose-500 hover:bg-rose-50"
                        )}
                      >
                        {user.is_active ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {user.last_login ? new Date(user.last_login).toLocaleDateString('uz') : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user.id, user.full_name ?? user.email)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-400 text-sm">
                      <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                      Foydalanuvchilar topilmadi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
