import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FolderOpen,
  FileText,
  Newspaper,
  Star,
  AlertTriangle,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  Handshake,
  Inbox,
  FlaskConical,
} from 'lucide-react';
import { useAdminAuthStore } from '@/src/store/useAdminAuthStore';
import { useDataStore } from '@/src/store/useDataStore';
import { cn } from '@/src/lib/utils';
import { ADMIN, ap } from '@/src/lib/adminPath';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, badge, active }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
        : "text-slate-400 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon className={cn("w-[18px] h-[18px]", active ? "text-white" : "text-slate-400 group-hover:text-white")} />
    <span className="text-sm font-medium">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
        {badge}
      </span>
    )}
  </Link>
);

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout } = useAdminAuthStore();
  const { reviews, complaints } = useDataStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;

  const handleLogout = () => {
    adminLogout();
    navigate(ap('/login'));
  };

  const _adminSegments = new Set(ADMIN.split('/').filter(Boolean));
  const breadcrumbs = location.pathname.split('/').filter(Boolean)
    .filter(seg => !_adminSegments.has(seg))
    .map(path => {
      const labels: Record<string, string> = {
        dashboard: 'Dashboard',
        funds: 'Fondlar',
        projects: 'Loyihalar',
        reports: 'Hisobotlar',
        news: 'Yangiliklar',
        reviews: 'Izohlar',
        complaints: 'Shikoyatlar',
        users: 'Foydalanuvchilar',
        indexes: 'Indeks omillari',
        settings: 'Sozlamalar',
        partners: 'Hamkorlar',
        applications: 'Murojaatlar',
        research: "Tadqiqot ma'lumotlari",
        new: 'Yangi',
      };
      return labels[path] || path;
    });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-[260px] bg-[#1E293B] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/20">
              CI
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight">Charity Index</h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {/* Group: Asosiy */}
          <div>
            <p className="px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Asosiy</p>
            <NavItem
              to={ap('/dashboard')}
              icon={LayoutDashboard}
              label="Dashboard"
              active={location.pathname === ap('/dashboard')}
            />
          </div>

          {/* Group: Boshqaruv */}
          <div>
            <p className="px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Boshqaruv</p>
            <div className="space-y-1">
              <NavItem
                to={ap('/funds')}
                icon={Building2}
                label="Fondlar"
                active={location.pathname.startsWith(ap('/funds'))}
              />
              <NavItem
                to={ap('/projects')}
                icon={FolderOpen}
                label="Loyihalar"
                active={location.pathname.startsWith(ap('/projects'))}
              />
              <NavItem
                to={ap('/reports')}
                icon={FileText}
                label="Hisobotlar"
                active={location.pathname.startsWith(ap('/reports'))}
              />
              <NavItem
                to={ap('/news')}
                icon={Newspaper}
                label="Yangiliklar"
                active={location.pathname.startsWith(ap('/news'))}
              />
              <NavItem
                to={ap('/partners')}
                icon={Handshake}
                label="Hamkorlar"
                active={location.pathname.startsWith(ap('/partners'))}
              />
              <NavItem
                to={ap('/applications')}
                icon={Inbox}
                label="Murojaatlar"
                active={location.pathname.startsWith(ap('/applications'))}
              />
            </div>
          </div>

          {/* Group: Moderatsiya */}
          <div>
            <p className="px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Moderatsiya</p>
            <div className="space-y-1">
              <NavItem
                to={ap('/reviews')}
                icon={Star}
                label="Izohlar"
                badge={pendingReviews}
                active={location.pathname.startsWith(ap('/reviews'))}
              />
              <NavItem
                to={ap('/complaints')}
                icon={AlertTriangle}
                label="Shikoyatlar"
                badge={pendingComplaints}
                active={location.pathname.startsWith(ap('/complaints'))}
              />
            </div>
          </div>

          {/* Group: Tizim */}
          <div>
            <p className="px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Tizim</p>
            <div className="space-y-1">
              <NavItem
                to={ap('/users')}
                icon={Users}
                label="Foydalanuvchilar"
                active={location.pathname.startsWith(ap('/users'))}
              />
              <NavItem
                to={ap('/indexes')}
                icon={BarChart3}
                label="Indeks omillari"
                active={location.pathname.startsWith(ap('/indexes'))}
              />
              <NavItem
                to={ap('/research')}
                icon={FlaskConical}
                label="Tadqiqot ma'lumotlari"
                active={location.pathname.startsWith(ap('/research'))}
              />
              <NavItem
                to={ap('/settings')}
                icon={Settings}
                label="Sozlamalar"
                active={location.pathname.startsWith(ap('/settings'))}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">Admin</p>
              <p className="text-slate-500 text-xs truncate">Superadmin</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
              title="Chiqish"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <nav className="flex items-center gap-2 text-sm text-slate-400 font-medium">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                  <span className={i === breadcrumbs.length - 1 ? "text-slate-900 font-bold" : ""}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Saytni ko'rish
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
