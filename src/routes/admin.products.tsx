import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, X } from "lucide-react";
import { adminFetch } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

interface ApiProduct {
  id: string; name: string; short: string; type: string; category: string;
  price: number; image_url: string; museum_id: string | null;
  museum_name: string | null; in_stock: boolean; created_at: string;
}

const TYPE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  MUZEY_SUVENIRLARI: { label: "Muzey Suvenirlari", color: "#d97706", bg: "rgba(217,119,6,0.1)" },
  MOHIR_QOLLAR:      { label: "Mohir Qo'llar",     color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
};

function AdminProductsPage() {
  const qc = useQueryClient();
  const [typeFilter, setTypeFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("true");
  const [search, setSearch] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const LIMIT = 50;

  const { data, isLoading } = useQuery<{ products: ApiProduct[]; total: number }>({
    queryKey: ["admin-products", { type: typeFilter, stock: stockFilter, search, page }],
    queryFn: async () => {
      const p = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (typeFilter) p.set("type", typeFilter);
      if (stockFilter) p.set("stock", stockFilter);
      if (search) p.set("search", search);
      const res = await adminFetch(`/api/admin/products?${p}`);
      if (!res.ok) throw new Error();
      return res.json();
    },
    staleTime: 20_000,
  });

  const toggleStock = useMutation({
    mutationFn: async ({ id, inStock }: { id: string; inStock: boolean }) => {
      const res = await adminFetch(`/api/products/${id}`, { method: "PUT", body: JSON.stringify({ in_stock: inStock }) });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, price, name_uz, short_uz }: { id: string; price: number; name_uz: string; short_uz: string }) => {
      const res = await adminFetch(`/api/products/${id}`, { method: "PUT", body: JSON.stringify({ price, name_uz, short_uz }) });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      setEditing(null);
    },
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const pages = Math.ceil(total / LIMIT);

  const FilterBtn = ({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: React.ReactNode; color?: string }) => (
    <button
      onClick={onClick}
      className="rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200"
      style={active
        ? { backgroundColor: color || '#1c1917', color: '#fff', boxShadow: `0 4px 12px ${color || '#1c1917'}30` }
        : { backgroundColor: '#fff', color: '#78716c', border: '1px solid #e7e5e4' }
      }
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: '#d97706' }}>— Boshqaruv</p>
          <h1 className="mt-1 text-2xl font-bold" style={{ color: '#1c1917' }}>Mahsulotlar</h1>
        </div>
        <div
          className="hidden rounded-xl px-3.5 py-2 text-xs font-semibold sm:flex items-center gap-1.5"
          style={{ backgroundColor: 'rgba(217,119,6,0.08)', color: '#d97706', border: '1px solid rgba(217,119,6,0.15)' }}
        >
          <Plus className="h-3.5 w-3.5" />
          Telegram bot orqali qo'shish
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterBtn active={typeFilter === ""} onClick={() => { setTypeFilter(""); setPage(1); }}>Hammasi</FilterBtn>
        <FilterBtn active={typeFilter === "MUZEY_SUVENIRLARI"} onClick={() => { setTypeFilter("MUZEY_SUVENIRLARI"); setPage(1); }} color="#d97706">Muzey Suvenirlari</FilterBtn>
        <FilterBtn active={typeFilter === "MOHIR_QOLLAR"} onClick={() => { setTypeFilter("MOHIR_QOLLAR"); setPage(1); }} color="#7c3aed">Mohir Qo'llar</FilterBtn>

        <div className="h-5 w-px mx-1" style={{ backgroundColor: '#e7e5e4' }} />

        <FilterBtn active={stockFilter === ""} onClick={() => { setStockFilter(""); setPage(1); }}>Barchasi</FilterBtn>
        <FilterBtn active={stockFilter === "true"} onClick={() => { setStockFilter("true"); setPage(1); }} color="#16a34a">Sotuvda</FilterBtn>
        <FilterBtn active={stockFilter === "false"} onClick={() => { setStockFilter("false"); setPage(1); }} color="#78716c">Arxiv</FilterBtn>

        <form
          className="ml-auto flex items-center gap-2 rounded-xl px-3.5 py-2"
          style={{ border: '1px solid #e7e5e4', backgroundColor: '#fff' }}
          onSubmit={(e) => { e.preventDefault(); setSearch(inputVal); setPage(1); }}
        >
          <Search className="h-3.5 w-3.5 shrink-0" style={{ color: '#a8a29e' }} />
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Qidirish..."
            className="w-32 text-sm outline-none placeholder:text-stone-300"
            style={{ color: '#1c1917', background: 'transparent' }}
          />
        </form>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{ backgroundColor: '#fff', border: '1px solid #e7e5e4', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: '1px solid #f5f5f4' }}
        >
          <p className="text-xs" style={{ color: '#a8a29e' }}>Jami: <span className="font-semibold" style={{ color: '#1c1917' }}>{total}</span> ta mahsulot</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #f5f5f4' }}>
                {["Mahsulot", "Tur", "Muzey", "Narx", "Holat", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#a8a29e' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="py-16 text-center text-sm" style={{ color: '#a8a29e' }}>Yuklanmoqda...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-sm" style={{ color: '#a8a29e' }}>Mahsulotlar yo'q</td></tr>
              ) : (
                products.map((p, i) => {
                  const ts = TYPE_STYLE[p.type];
                  return (
                    <tr
                      key={p.id}
                      className="transition-colors hover:bg-stone-50/60"
                      style={{
                        borderBottom: i < products.length - 1 ? '1px solid #fafaf9' : 'none',
                        opacity: p.in_stock ? 1 : 0.55,
                      }}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image_url?.startsWith("http") ? p.image_url : `${BASE}${p.image_url}`}
                            alt={p.name}
                            className="h-10 w-10 rounded-xl object-cover shrink-0"
                            style={{ border: '1px solid #f5f5f4' }}
                          />
                          <div>
                            <p className="text-sm font-medium line-clamp-1" style={{ color: '#1c1917' }}>{p.name}</p>
                            <p className="text-[11px]" style={{ color: '#a8a29e' }}>{p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold"
                          style={{ color: ts?.color || '#78716c', backgroundColor: ts?.bg || 'rgba(120,113,108,0.1)' }}
                        >
                          {ts?.label || p.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: '#a8a29e' }}>{p.museum_name || "—"}</td>
                      <td className="px-5 py-3">
                        <span className="text-sm font-semibold" style={{ color: '#1c1917' }}>
                          {Number(p.price).toLocaleString()}
                        </span>
                        <span className="ml-0.5 text-[11px]" style={{ color: '#a8a29e' }}>so'm</span>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => toggleStock.mutate({ id: p.id, inStock: !p.in_stock })}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors"
                          style={p.in_stock
                            ? { color: '#16a34a', backgroundColor: 'rgba(22,163,74,0.08)' }
                            : { color: '#a8a29e', backgroundColor: 'rgba(120,113,108,0.08)' }
                          }
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.in_stock ? '#16a34a' : '#d1ccc9' }} />
                          {p.in_stock ? "Sotuvda" : "Arxiv"}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setEditing(p)}
                          className="grid h-8 w-8 place-items-center rounded-xl transition-colors"
                          style={{ color: '#a8a29e', border: '1px solid #f5f5f4' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f4'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
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
            <p className="text-xs" style={{ color: '#a8a29e' }}>{(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} / {total}</p>
            <div className="flex gap-1.5">
              <PagBtn disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></PagBtn>
              <PagBtn disabled={page >= pages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></PagBtn>
            </div>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <EditModal
          product={editing}
          onClose={() => setEditing(null)}
          onSave={(price, name_uz, short_uz) => updateProduct.mutate({ id: editing.id, price, name_uz, short_uz })}
          saving={updateProduct.isPending}
        />
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
      style={{ border: '1px solid #e7e5e4', color: '#78716c' }}
    >
      {children}
    </button>
  );
}

function EditModal({ product, onClose, onSave, saving }: {
  product: ApiProduct; onClose: () => void;
  onSave: (price: number, name: string, short: string) => void; saving: boolean;
}) {
  const [name, setName] = useState(product.name || "");
  const [short, setShort] = useState(product.short || "");
  const [price, setPrice] = useState(String(product.price));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl" style={{ backgroundColor: '#fff', boxShadow: '0 32px 64px rgba(0,0,0,0.2)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #f5f5f4' }}>
          <h3 className="font-semibold" style={{ color: '#1c1917' }}>Mahsulotni tahrirlash</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-xl hover:bg-stone-100" style={{ color: '#a8a29e' }}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(parseInt(price), name, short); }}>
          {[
            { label: "Nomi (uz)", value: name, onChange: setName, type: "text", required: true },
          ].map(({ label, value, onChange, type, required }) => (
            <div key={label}>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: '#a8a29e' }}>{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                style={{ border: '1px solid #e7e5e4', color: '#1c1917' }}
                onFocus={(e) => e.target.style.borderColor = '#d97706'}
                onBlur={(e) => e.target.style.borderColor = '#e7e5e4'}
              />
            </div>
          ))}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: '#a8a29e' }}>Qisqa tavsif</label>
            <textarea
              value={short}
              onChange={(e) => setShort(e.target.value)}
              rows={2}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-all"
              style={{ border: '1px solid #e7e5e4', color: '#1c1917' }}
              onFocus={(e) => e.target.style.borderColor = '#d97706'}
              onBlur={(e) => e.target.style.borderColor = '#e7e5e4'}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: '#a8a29e' }}>Narx (so'm)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              required
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
              style={{ border: '1px solid #e7e5e4', color: '#1c1917' }}
              onFocus={(e) => e.target.style.borderColor = '#d97706'}
              onBlur={(e) => e.target.style.borderColor = '#e7e5e4'}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors hover:bg-stone-50"
              style={{ border: '1px solid #e7e5e4', color: '#78716c' }}>
              Bekor
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1c1917', boxShadow: '0 4px 12px rgba(217,119,6,0.3)' }}>
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
