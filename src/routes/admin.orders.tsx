import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { adminFetch } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

const STATUSES = [
  { value: "",           label: "Hammasi",     color: "#78716c" },
  { value: "pending",    label: "Yangi",       color: "#d97706" },
  { value: "processing", label: "Jarayonda",  color: "#2563eb" },
  { value: "shipped",    label: "Jo'natildi", color: "#7c3aed" },
  { value: "delivered",  label: "Yetkazildi", color: "#16a34a" },
  { value: "cancelled",  label: "Bekor",      color: "#dc2626" },
];

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "Yangi",       color: "#d97706", bg: "rgba(217,119,6,0.1)" },
  processing: { label: "Jarayonda",  color: "#2563eb", bg: "rgba(37,99,235,0.1)" },
  shipped:    { label: "Jo'natildi", color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
  delivered:  { label: "Yetkazildi", color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  cancelled:  { label: "Bekor",      color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
};

const DELIVERY: Record<string, string> = { standard: "Oddiy", express: "Tezkor", pickup: "O'zi oladi" };

interface OrderItem { product_id: string; product_name: string; qty: number; price: number; image_url: string }
interface Order {
  id: string; customer_name: string; customer_phone: string; user_email: string | null;
  user_name: string | null; delivery_method: string; address: string | null;
  total_price: number; status: string; created_at: string; items: OrderItem[];
}

function AdminOrdersPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);
  const LIMIT = 25;

  const { data, isLoading } = useQuery<{ orders: Order[]; total: number }>({
    queryKey: ["admin-orders", { status: statusFilter, page }],
    queryFn: async () => {
      const p = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (statusFilter) p.set("status", statusFilter);
      const res = await adminFetch(`/api/admin/orders?${p}`);
      if (!res.ok) throw new Error();
      return res.json();
    },
    staleTime: 15_000,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await adminFetch(`/api/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const orders = data?.orders ?? [];
  const total = data?.total ?? 0;
  const pages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: '#d97706' }}>— Boshqaruv</p>
        <h1 className="mt-1 text-2xl font-bold" style={{ color: '#1c1917' }}>Buyurtmalar</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const active = statusFilter === s.value;
          return (
            <button
              key={s.value}
              onClick={() => { setStatusFilter(s.value); setPage(1); }}
              className="rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200"
              style={active
                ? { backgroundColor: s.color, color: '#fff', boxShadow: `0 4px 12px ${s.color}40` }
                : { backgroundColor: '#fff', color: '#78716c', border: '1px solid #e7e5e4' }
              }
            >
              {s.label}
            </button>
          );
        })}
        <span className="ml-auto self-center text-xs" style={{ color: '#a8a29e' }}>
          Jami: {total} ta
        </span>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{ backgroundColor: '#fff', border: '1px solid #e7e5e4', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #f5f5f4' }}>
                {["#", "Mijoz", "Telefon", "Yetkazish", "Summa", "Status", "Sana", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#a8a29e' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="py-16 text-center text-sm" style={{ color: '#a8a29e' }}>Yuklanmoqda...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-sm" style={{ color: '#a8a29e' }}>Buyurtmalar yo'q</td></tr>
              ) : (
                orders.map((o, i) => {
                  const s = STATUS_STYLE[o.status] ?? { label: o.status, color: "#78716c", bg: "rgba(120,113,108,0.1)" };
                  return (
                    <tr
                      key={o.id}
                      className="transition-colors hover:bg-stone-50/70 cursor-pointer"
                      style={{ borderBottom: i < orders.length - 1 ? '1px solid #fafaf9' : 'none' }}
                      onClick={() => setSelected(o)}
                    >
                      <td className="px-5 py-3.5 text-xs font-mono" style={{ color: '#a8a29e' }}>
                        #{o.id.slice(0, 6)}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium" style={{ color: '#1c1917' }}>{o.customer_name || o.user_name || "Mehmon"}</p>
                        {o.user_email && <p className="text-[11px]" style={{ color: '#a8a29e' }}>{o.user_email}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#78716c' }}>{o.customer_phone}</td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: '#a8a29e' }}>{DELIVERY[o.delivery_method] || o.delivery_method}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold" style={{ color: '#1c1917' }}>
                          {Number(o.total_price).toLocaleString()}
                        </span>
                        <span className="ml-0.5 text-[11px]" style={{ color: '#a8a29e' }}>so'm</span>
                      </td>
                      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value })}
                          className="rounded-full px-3 py-1 text-[11px] font-semibold cursor-pointer border-0 outline-none appearance-none"
                          style={{ color: s.color, backgroundColor: s.bg }}
                        >
                          {STATUSES.filter((st) => st.value).map((st) => (
                            <option key={st.value} value={st.value}>{st.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: '#a8a29e' }}>
                        {new Date(o.created_at).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-5 py-3.5">
                        <Eye className="h-4 w-4" style={{ color: '#d1ccc9' }} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: '1px solid #f5f5f4' }}>
            <p className="text-xs" style={{ color: '#a8a29e' }}>
              {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} / {total}
            </p>
            <div className="flex gap-1.5">
              <PagBtn disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></PagBtn>
              <PagBtn disabled={page >= pages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></PagBtn>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div
            className="my-8 w-full max-w-lg overflow-hidden rounded-2xl"
            style={{ backgroundColor: '#fff', boxShadow: '0 32px 64px rgba(0,0,0,0.2)' }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid #f5f5f4' }}
            >
              <div>
                <h3 className="font-semibold" style={{ color: '#1c1917' }}>Buyurtma #{selected.id.slice(0, 8)}</h3>
                <p className="text-xs" style={{ color: '#a8a29e' }}>
                  {new Date(selected.created_at).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="grid h-8 w-8 place-items-center rounded-xl transition-colors hover:bg-stone-100"
                style={{ color: '#a8a29e' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Mijoz", value: selected.customer_name || selected.user_name || "Mehmon" },
                  { label: "Telefon", value: selected.customer_phone },
                  ...(selected.user_email ? [{ label: "Email", value: selected.user_email }] : []),
                  { label: "Yetkazib berish", value: DELIVERY[selected.delivery_method] || selected.delivery_method },
                  ...(selected.address ? [{ label: "Manzil", value: selected.address }] : []),
                  { label: "Jami summa", value: `${Number(selected.total_price).toLocaleString()} so'm` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-3" style={{ backgroundColor: '#fafaf9', border: '1px solid #f5f5f4' }}>
                    <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#a8a29e' }}>{label}</p>
                    <p className="mt-0.5 text-sm font-medium" style={{ color: '#1c1917' }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#a8a29e' }}>Mahsulotlar</p>
                <div className="space-y-2">
                  {selected.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl p-3"
                      style={{ border: '1px solid #f5f5f4' }}
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url.startsWith("http") ? item.image_url : `${BASE}${item.image_url}`}
                          alt={item.product_name}
                          className="h-12 w-12 rounded-lg object-cover shrink-0"
                          style={{ border: '1px solid #f5f5f4' }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#1c1917' }}>{item.product_name}</p>
                        <p className="text-xs" style={{ color: '#a8a29e' }}>
                          {item.qty} × {Number(item.price).toLocaleString()} so'm
                        </p>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: '#1c1917' }}>
                        {(item.qty * Number(item.price)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#a8a29e' }}>Status o'zgartirish</p>
                <select
                  value={selected.status}
                  onChange={(e) => {
                    updateStatus.mutate({ id: selected.id, status: e.target.value });
                    setSelected({ ...selected, status: e.target.value });
                  }}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  style={{ border: '1px solid #e7e5e4', backgroundColor: '#fafaf9', color: '#1c1917' }}
                >
                  {STATUSES.filter((s) => s.value).map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PagBtn({ disabled, onClick, children }: { disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-lg transition-colors disabled:opacity-30"
      style={{ border: '1px solid #e7e5e4', color: '#78716c', backgroundColor: disabled ? '#fafaf9' : '#fff' }}
    >
      {children}
    </button>
  );
}
