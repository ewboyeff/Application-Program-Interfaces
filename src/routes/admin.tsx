import { createFileRoute, Outlet, Link, useNavigate, redirect } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, Building2, ShoppingCart, Users, LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { getAdminSession, clearAdminSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const session = getAdminSession();
    if (!session) throw redirect({ to: "/admin/login" });
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Buyurtmalar", icon: ShoppingCart },
  { to: "/admin/products", label: "Mahsulotlar", icon: Package },
  { to: "/admin/museums", label: "Muzeylar", icon: Building2 },
  { to: "/admin/users", label: "Foydalanuvchilar", icon: Users },
];

function AdminLayout() {
  const navigate = useNavigate();
  const session = getAdminSession();
  const [open, setOpen] = useState(false);

  if (!session) return <Outlet />;

  const handleLogout = () => {
    clearAdminSession();
    navigate({ to: "/admin/login" });
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
          <span className="text-xs font-bold text-stone-900">M</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">Museum Shop</p>
          <p className="text-[10px] text-amber-400/70 uppercase tracking-widest">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Boshqaruv
        </p>
        {NAV.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={exact ? { exact: true } : undefined}
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white [&.active]:bg-amber-500/15 [&.active]:text-amber-400 [&.active]:shadow-[inset_0_0_0_1px_rgba(251,191,36,0.2)]"
          >
            <Icon className="h-4 w-4 shrink-0 transition-transform group-[&.active]:scale-110" />
            <span>{label}</span>
            <ChevronRight className="ml-auto h-3 w-3 opacity-0 transition-all group-hover:opacity-40 group-[&.active]:opacity-60" />
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-3">
        <div className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-400">
            <span className="text-xs font-bold">{(session.fullName || session.username)[0].toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">{session.fullName || session.username}</p>
            <p className="text-[10px] capitalize text-white/40">{session.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white/50 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-3.5 w-3.5" />
          Chiqish
        </button>
      </div>
    </div>
  );

  return (
    <div data-admin className="flex min-h-screen font-sans" style={{ backgroundColor: '#f8f7f4', color: '#1c1917' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden w-60 shrink-0 lg:flex lg:flex-col"
        style={{ background: 'linear-gradient(180deg, #1a1512 0%, #211c17 100%)', boxShadow: '4px 0 24px rgba(0,0,0,0.15)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside
            className="absolute left-0 top-0 h-full w-60 flex flex-col"
            style={{ background: 'linear-gradient(180deg, #1a1512 0%, #211c17 100%)' }}
          >
            <div className="absolute right-3 top-4">
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile topbar */}
        <header
          className="flex h-14 items-center gap-3 border-b px-4 lg:hidden"
          style={{ backgroundColor: '#fff', borderColor: '#e7e5e4' }}
        >
          <button
            onClick={() => setOpen(true)}
            className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-stone-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-amber-600">
              <span className="text-[9px] font-bold text-stone-900">M</span>
            </div>
            <span className="text-sm font-semibold text-stone-800">Museum Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
