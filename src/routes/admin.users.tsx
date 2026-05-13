import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { adminFetch } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  order_count: number;
}

function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const LIMIT = 25;

  const { data, isLoading } = useQuery<{ users: User[]; total: number }>({
    queryKey: ["admin-users", { page, search }],
    queryFn: async () => {
      const p = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (search) p.set("search", search);
      const res = await adminFetch(`/api/admin/users?${p}`);
      if (!res.ok) throw new Error("Error");
      return res.json();
    },
    staleTime: 30_000,
  });

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const pages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: '#d97706' }}>— Boshqaruv</p>
          <h1 className="mt-1 text-2xl font-bold" style={{ color: '#1c1917' }}>Foydalanuvchilar</h1>
        </div>
        <form
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all"
          style={{ backgroundColor: '#fff', border: '1px solid #e7e5e4', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }}
          onFocus={(e) => { (e.currentTarget as HTMLFormElement).style.borderColor = '#d97706'; }}
          onBlur={(e) => { (e.currentTarget as HTMLFormElement).style.borderColor = '#e7e5e4'; }}
        >
          <Search className="h-3.5 w-3.5 shrink-0" style={{ color: '#a8a29e' }} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Email yoki ism bo'yicha..."
            className="w-52 bg-transparent text-sm outline-none"
            style={{ color: '#1c1917' }}
          />
        </form>
      </div>

      {/* Stats bar */}
      <div
        className="flex items-center gap-3 rounded-2xl px-5 py-3.5"
        style={{ backgroundColor: '#fff', border: '1px solid #e7e5e4', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: 'rgba(219,39,119,0.08)' }}
        >
          <Users className="h-4 w-4" style={{ color: '#db2777' }} />
        </div>
        <span className="text-sm font-medium" style={{ color: '#1c1917' }}>
          Jami <span className="font-bold">{total}</span> ta foydalanuvchi
        </span>
        {search && (
          <button
            onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
            className="ml-auto rounded-lg px-3 py-1 text-xs font-medium transition-colors"
            style={{ backgroundColor: 'rgba(217,119,6,0.08)', color: '#d97706', border: '1px solid rgba(217,119,6,0.2)' }}
          >
            Filterni tozalash
          </button>
        )}
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
                {["Foydalanuvchi", "Telefon", "Buyurtmalar", "Ro'yxatdan o'tgan"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: '#a8a29e' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-sm" style={{ color: '#a8a29e' }}>
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-sm" style={{ color: '#a8a29e' }}>
                    {search ? "Topilmadi" : "Foydalanuvchilar yo'q"}
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-stone-50/70"
                    style={{ borderBottom: i < users.length - 1 ? '1px solid #fafaf9' : 'none' }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                          style={{
                            background: 'linear-gradient(135deg, rgba(219,39,119,0.15), rgba(219,39,119,0.05))',
                            color: '#db2777',
                            border: '1px solid rgba(219,39,119,0.15)',
                          }}
                        >
                          {(u.full_name || u.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#1c1917' }}>
                            {u.full_name || "—"}
                          </p>
                          <p className="text-[11px]" style={{ color: '#a8a29e' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: '#78716c' }}>
                      {u.phone || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
                        style={
                          u.order_count > 0
                            ? { backgroundColor: 'rgba(22,163,74,0.1)', color: '#16a34a' }
                            : { backgroundColor: 'rgba(120,113,108,0.1)', color: '#78716c' }
                        }
                      >
                        {u.order_count} ta
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: '#a8a29e' }}>
                      {new Date(u.created_at).toLocaleDateString("uz-UZ", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderTop: '1px solid #f5f5f4' }}
          >
            <p className="text-xs" style={{ color: '#a8a29e' }}>
              {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} / {total}
            </p>
            <div className="flex gap-1.5">
              <PagBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </PagBtn>
              <PagBtn disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </PagBtn>
            </div>
          </div>
        )}
      </div>
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
