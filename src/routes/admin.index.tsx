import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Building2, Users, ShoppingCart, Clock, ArrowUpRight, TrendingUp } from "lucide-react";
import { adminFetch } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

interface Stats {
  products: number;
  museums: number;
  users: number;
  orders: number;
  pendingOrders: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  total_price: number;
  status: string;
  created_at: string;
  delivery_method: string;
}

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "Yangi",       color: "#d97706", bg: "rgba(217,119,6,0.1)" },
  processing: { label: "Jarayonda",  color: "#2563eb", bg: "rgba(37,99,235,0.1)" },
  shipped:    { label: "Jo'natildi", color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
  delivered:  { label: "Yetkazildi", color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  cancelled:  { label: "Bekor",      color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
};

const CARDS = [
  { key: "orders",        label: "Jami buyurtmalar",  icon: ShoppingCart, color: "#2563eb", light: "rgba(37,99,235,0.08)",  to: "/admin/orders" },
  { key: "pendingOrders", label: "Yangi buyurtmalar", icon: Clock,        color: "#d97706", light: "rgba(217,119,6,0.08)", to: "/admin/orders" },
  { key: "products",      label: "Mahsulotlar",       icon: Package,      color: "#16a34a", light: "rgba(22,163,74,0.08)", to: "/admin/products" },
  { key: "museums",       label: "Muzeylar",          icon: Building2,    color: "#7c3aed", light: "rgba(124,58,237,0.08)",to: "/admin/museums" },
  { key: "users",         label: "Foydalanuvchilar",  icon: Users,        color: "#db2777", light: "rgba(219,39,119,0.08)",to: "/admin/users" },
];

function AdminDashboard() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/stats");
      if (!res.ok) throw new Error();
      return res.json();
    },
    staleTime: 30_000,
  });

  const { data: ordersData } = useQuery<{ orders: Order[] }>({
    queryKey: ["admin-orders", { page: 1, limit: 8 }],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/orders?limit=8");
      if (!res.ok) throw new Error();
      return res.json();
    },
    staleTime: 15_000,
  });

  const recent = ordersData?.orders ?? [];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: '#d97706' }}>
            — Bosh sahifa
          </p>
          <h1 className="mt-1 text-2xl font-bold" style={{ color: '#1c1917' }}>Dashboard</h1>
        </div>
        <div
          className="hidden rounded-xl px-4 py-2 text-xs font-medium sm:block"
          style={{ background: 'rgba(217,119,6,0.1)', color: '#d97706', border: '1px solid rgba(217,119,6,0.2)' }}
        >
          {new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        {CARDS.map(({ key, label, icon: Icon, color, light, to }) => (
          <Link
            key={key}
            to={to}
            className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ backgroundColor: '#fff', border: '1px solid #e7e5e4', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: light }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" style={{ color }} />
            </div>
            <p className="mt-4 text-2xl font-bold" style={{ color: '#1c1917' }}>
              {stats ? (stats as any)[key].toLocaleString() : "—"}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: '#78716c' }}>{label}</p>
            <div
              className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
              style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
            />
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{ backgroundColor: '#fff', border: '1px solid #e7e5e4', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #f5f5f4' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'rgba(37,99,235,0.08)' }}
            >
              <TrendingUp className="h-4 w-4" style={{ color: '#2563eb' }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: '#1c1917' }}>So'nggi buyurtmalar</h2>
              <p className="text-[11px]" style={{ color: '#a8a29e' }}>Real vaqt ma'lumotlari</p>
            </div>
          </div>
          <Link
            to="/admin/orders"
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors hover:bg-stone-50"
            style={{ color: '#d97706' }}
          >
            Barchasi <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #f5f5f4' }}>
                {["Mijoz", "Telefon", "Summa", "Usul", "Status", "Sana"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#a8a29e' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: '#a8a29e' }}>
                    Buyurtmalar yo'q
                  </td>
                </tr>
              ) : (
                recent.map((o, i) => {
                  const s = STATUS[o.status] ?? { label: o.status, color: "#78716c", bg: "rgba(120,113,108,0.1)" };
                  const delivery: Record<string, string> = { standard: "Oddiy", express: "Tezkor", pickup: "O'zi" };
                  return (
                    <tr
                      key={o.id}
                      className="transition-colors hover:bg-stone-50/60"
                      style={{ borderBottom: i < recent.length - 1 ? '1px solid #fafaf9' : 'none' }}
                    >
                      <td className="px-6 py-3.5">
                        <span className="text-sm font-medium" style={{ color: '#1c1917' }}>
                          {o.customer_name || "Mehmon"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-sm" style={{ color: '#78716c' }}>
                        {o.customer_phone}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-sm font-semibold" style={{ color: '#1c1917' }}>
                          {Number(o.total_price).toLocaleString()}
                          <span className="ml-0.5 text-xs font-normal" style={{ color: '#a8a29e' }}>so'm</span>
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs" style={{ color: '#a8a29e' }}>
                        {delivery[o.delivery_method] || o.delivery_method}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold"
                          style={{ color: s.color, backgroundColor: s.bg }}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs" style={{ color: '#a8a29e' }}>
                        {new Date(o.created_at).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
