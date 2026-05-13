import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Building2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/museums")({
  component: AdminMuseumsPage,
});

const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

interface Museum {
  id: string;
  region: string | null;
  image_url: string | null;
  translations: Record<string, { name: string; city: string; short: string | null }> | null;
}

const empty = {
  id: "", region: "",
  name_uz: "", city_uz: "", short_uz: "",
  name_ru: "", city_ru: "",
  name_en: "", city_en: "",
};

function AdminMuseumsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: museums = [], isLoading } = useQuery<Museum[]>({
    queryKey: ["admin-museums"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/museums");
      if (!res.ok) throw new Error();
      return res.json();
    },
    staleTime: 30_000,
  });

  const addMuseum = useMutation({
    mutationFn: async (f: typeof empty & { image?: File }) => {
      const fd = new FormData();
      Object.entries(f).forEach(([k, v]) => { if (k !== "image" && v) fd.append(k, v as string); });
      if (f.image) fd.append("image", f.image);
      const res = await adminFetch("/api/admin/museums", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-museums"] }); setModal(null); setImageFile(null); },
  });

  const editMuseum = useMutation({
    mutationFn: async ({ id, f, image }: { id: string; f: typeof empty; image?: File }) => {
      const fd = new FormData();
      Object.entries(f).forEach(([k, v]) => { if (k !== "id" && v) fd.append(k, v as string); });
      if (image) fd.append("image", image);
      const res = await adminFetch(`/api/admin/museums/${id}`, { method: "PUT", body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-museums"] }); setModal(null); setImageFile(null); },
  });

  const deleteMuseum = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/api/admin/museums/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-museums"] }); setDeleteId(null); },
  });

  const openAdd = () => { setForm(empty); setImageFile(null); setModal("add"); };
  const openEdit = (m: Museum) => {
    const tr = m.translations || {};
    setEditId(m.id);
    setForm({
      id: m.id, region: m.region || "",
      name_uz: tr.uz?.name || "", city_uz: tr.uz?.city || "", short_uz: tr.uz?.short || "",
      name_ru: tr.ru?.name || "", city_ru: tr.ru?.city || "",
      name_en: tr.en?.name || "", city_en: tr.en?.city || "",
    });
    setImageFile(null);
    setModal("edit");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal === "add") addMuseum.mutate({ ...form, image: imageFile || undefined });
    else editMuseum.mutate({ id: editId, f: form, image: imageFile || undefined });
  };

  const saving = addMuseum.isPending || editMuseum.isPending;
  const err = (addMuseum.error || editMuseum.error) as Error | null;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: '#d97706' }}>— Boshqaruv</p>
          <h1 className="mt-1 text-2xl font-bold" style={{ color: '#1c1917' }}>Muzeylar</h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1c1917', boxShadow: '0 4px 16px rgba(217,119,6,0.3)' }}
        >
          <Plus className="h-4 w-4" />
          Qo'shish
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm" style={{ color: '#a8a29e' }}>Yuklanmoqda...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {museums.map((m) => {
            const tr = m.translations?.uz;
            const imgSrc = m.image_url ? (m.image_url.startsWith("http") ? m.image_url : `${BASE}${m.image_url}`) : null;
            return (
              <div
                key={m.id}
                className="group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ backgroundColor: '#fff', border: '1px solid #e7e5e4', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              >
                {/* Image */}
                <div className="relative h-36 overflow-hidden">
                  {imgSrc ? (
                    <img src={imgSrc} alt={tr?.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1512, #2d2419)' }}>
                      <Building2 className="h-10 w-10 opacity-20" style={{ color: '#f59e0b' }} />
                    </div>
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <span className="rounded-lg px-2 py-0.5 text-[10px] font-mono text-white/60" style={{ background: 'rgba(0,0,0,0.4)' }}>
                      {m.id}
                    </span>
                    {m.region && (
                      <span className="rounded-lg px-2 py-0.5 text-[10px] font-medium text-white/70" style={{ background: 'rgba(0,0,0,0.4)' }}>
                        {m.region}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate" style={{ color: '#1c1917' }}>{tr?.name || m.id}</h3>
                      {tr?.city && <p className="text-xs mt-0.5" style={{ color: '#a8a29e' }}>{tr.city}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <ActionBtn onClick={() => openEdit(m)} color="#d97706"><Pencil className="h-3.5 w-3.5" /></ActionBtn>
                      <ActionBtn onClick={() => setDeleteId(m.id)} color="#dc2626" hover="rgba(220,38,38,0.08)"><Trash2 className="h-3.5 w-3.5" /></ActionBtn>
                    </div>
                  </div>
                  {tr?.short && (
                    <p className="mt-2.5 text-xs leading-relaxed line-clamp-2" style={{ color: '#78716c' }}>{tr.short}</p>
                  )}
                  <div className="mt-3 flex gap-1">
                    {["uz","ru","en"].map((lang) => {
                      const has = m.translations?.[lang]?.name;
                      return (
                        <span
                          key={lang}
                          className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                          style={{ color: has ? '#16a34a' : '#d1ccc9', backgroundColor: has ? 'rgba(22,163,74,0.08)' : 'rgba(209,204,201,0.15)' }}
                        >
                          {lang}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="my-8 w-full max-w-lg overflow-hidden rounded-2xl" style={{ backgroundColor: '#fff', boxShadow: '0 32px 64px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #f5f5f4' }}>
              <h3 className="font-semibold" style={{ color: '#1c1917' }}>
                {modal === "add" ? "Yangi muzey qo'shish" : "Muzeyni tahrirlash"}
              </h3>
              <button onClick={() => setModal(null)} className="grid h-8 w-8 place-items-center rounded-xl hover:bg-stone-100" style={{ color: '#a8a29e' }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="divide-y overflow-y-auto max-h-[70vh]" style={{ borderColor: '#f5f5f4' }}>
              <div className="p-6 space-y-4">
                {modal === "add" && (
                  <FormField label="Muzey ID (slug)" required>
                    <input
                      value={form.id}
                      onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                      placeholder="history-uz"
                      required
                      className="field font-mono"
                    />
                  </FormField>
                )}
                <FormField label="Viloyat / Mintaqa">
                  <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="Toshkent" className="field" />
                </FormField>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇺🇿</span>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#d97706' }}>O'zbekcha (majburiy)</p>
                </div>
                <FormField label="Nomi" required>
                  <input value={form.name_uz} onChange={(e) => setForm({ ...form, name_uz: e.target.value })} placeholder="O'zbekiston Tarixi Muzeyi" required className="field" />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Shahar">
                    <input value={form.city_uz} onChange={(e) => setForm({ ...form, city_uz: e.target.value })} placeholder="Toshkent" className="field" />
                  </FormField>
                </div>
                <FormField label="Qisqa tavsif">
                  <textarea value={form.short_uz} onChange={(e) => setForm({ ...form, short_uz: e.target.value })} rows={2} placeholder="Muzey haqida qisqacha..." className="field resize-none" />
                </FormField>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇷🇺</span>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a8a29e' }}>Ruscha (ixtiyoriy)</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Nomi"><input value={form.name_ru} onChange={(e) => setForm({ ...form, name_ru: e.target.value })} className="field" /></FormField>
                  <FormField label="Shahar"><input value={form.city_ru} onChange={(e) => setForm({ ...form, city_ru: e.target.value })} className="field" /></FormField>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇬🇧</span>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a8a29e' }}>Inglizcha (ixtiyoriy)</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Nomi"><input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="field" /></FormField>
                  <FormField label="Shahar"><input value={form.city_en} onChange={(e) => setForm({ ...form, city_en: e.target.value })} className="field" /></FormField>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <FormField label="Rasm (ixtiyoriy)">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-sm file:rounded-xl file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
                    style={{ color: '#78716c' }}
                  />
                </FormField>

                {err && (
                  <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.15)' }}>
                    {err.message}
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setModal(null)}
                    className="flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors hover:bg-stone-50"
                    style={{ border: '1px solid #e7e5e4', color: '#78716c' }}>
                    Bekor
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1c1917', boxShadow: '0 4px 12px rgba(217,119,6,0.3)' }}>
                    {saving ? "Saqlanmoqda..." : modal === "add" ? "Qo'shish" : "Saqlash"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: '#fff', boxShadow: '0 32px 64px rgba(0,0,0,0.2)' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(220,38,38,0.08)' }}>
              <Trash2 className="h-5 w-5" style={{ color: '#dc2626' }} />
            </div>
            <h3 className="mt-4 font-semibold" style={{ color: '#1c1917' }}>Muzeyni o'chirish</h3>
            <p className="mt-1.5 text-sm" style={{ color: '#78716c' }}>
              <span className="font-mono font-semibold" style={{ color: '#1c1917' }}>{deleteId}</span> muzeyini o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl py-2.5 text-sm font-medium"
                style={{ border: '1px solid #e7e5e4', color: '#78716c' }}>
                Bekor
              </button>
              <button onClick={() => deleteMuseum.mutate(deleteId)} disabled={deleteMuseum.isPending}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60"
                style={{ backgroundColor: '#dc2626', color: '#fff', boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }}>
                {deleteMuseum.isPending ? "..." : "O'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .field {
          width: 100%;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          border: 1px solid #e7e5e4;
          color: #1c1917;
          background: #fafaf9;
        }
        .field:focus { border-color: #d97706; background: #fff; }
        .field::placeholder { color: #d1ccc9; }
      `}</style>
    </div>
  );
}

function ActionBtn({ onClick, color, hover, children }: { onClick: () => void; color: string; hover?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="grid h-7 w-7 place-items-center rounded-lg transition-colors"
      style={{ color, border: '1px solid #f5f5f4' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = hover || `${color}12`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
    >
      {children}
    </button>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: '#a8a29e' }}>
        {label}{required && <span style={{ color: '#d97706' }}> *</span>}
      </label>
      {children}
    </div>
  );
}
