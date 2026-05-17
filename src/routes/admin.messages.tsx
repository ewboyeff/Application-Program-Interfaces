import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Mail, Phone, MessageSquare, CheckCircle, Clock, Eye, X } from "lucide-react";
import { adminFetch } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessagesPage,
});

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  new:      { label: "Yangi",       color: "#d97706", bg: "rgba(217,119,6,0.1)" },
  read:     { label: "O'qildi",     color: "#2563eb", bg: "rgba(37,99,235,0.1)" },
  replied: { label: "Javob berildi", color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
};

interface Message {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  status: string;
  created_at: string;
}

function AdminMessagesPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Message | null>(null);

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const res = await adminFetch("/api/contact");
      if (!res.ok) throw new Error();
      return res.json();
    },
    staleTime: 15_000,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await adminFetch(`/api/contact/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  const newCount = messages.filter((m) => m.status === "new" || !m.status).length;

  return (
    <div style={{ backgroundColor: "#f8f7f4", minHeight: "100%", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c1917", margin: 0 }}>Murojatlar</h1>
          <p style={{ fontSize: 13, color: "#78716c", marginTop: 4 }}>
            Aloqa formi orqali yuborilgan xabarlar
          </p>
        </div>
        {newCount > 0 && (
          <span style={{ background: "#d97706", color: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>
            {newCount} yangi
          </span>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e7e5e4", overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#78716c" }}>Yuklanmoqda…</div>
        ) : messages.length === 0 ? (
          <div style={{ padding: 64, textAlign: "center" }}>
            <MessageSquare style={{ width: 40, height: 40, color: "#d6d3d1", margin: "0 auto 12px" }} />
            <p style={{ color: "#78716c", fontSize: 15 }}>Hali xabarlar yo'q</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f5f5f4", background: "#fafaf9" }}>
                <th style={TH}>Ism</th>
                <th style={TH}>Telefon</th>
                <th style={TH}>Xabar</th>
                <th style={TH}>Sana</th>
                <th style={TH}>Status</th>
                <th style={TH}></th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => {
                const st = STATUS_STYLE[msg.status] ?? STATUS_STYLE["new"];
                return (
                  <tr key={msg.id} style={{ borderBottom: "1px solid #f5f5f4" }}>
                    <td style={TD}>
                      <span style={{ fontWeight: 600, color: "#1c1917" }}>{msg.name}</span>
                      {msg.email && (
                        <div style={{ fontSize: 12, color: "#78716c", marginTop: 2 }}>{msg.email}</div>
                      )}
                    </td>
                    <td style={TD}>
                      <a href={`tel:${msg.phone}`} style={{ color: "#d97706", fontWeight: 500, fontSize: 13 }}>
                        {msg.phone}
                      </a>
                    </td>
                    <td style={{ ...TD, maxWidth: 280 }}>
                      <p style={{ fontSize: 13, color: "#44403c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                        {msg.message}
                      </p>
                    </td>
                    <td style={{ ...TD, whiteSpace: "nowrap", fontSize: 12, color: "#78716c" }}>
                      {new Date(msg.created_at).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </td>
                    <td style={TD}>
                      <select
                        value={msg.status || "new"}
                        onChange={(e) => updateStatus.mutate({ id: msg.id, status: e.target.value })}
                        style={{
                          background: st.bg, color: st.color, border: "none",
                          borderRadius: 20, padding: "3px 10px", fontSize: 12,
                          fontWeight: 600, cursor: "pointer", outline: "none",
                        }}
                      >
                        <option value="new">Yangi</option>
                        <option value="read">O'qildi</option>
                        <option value="replied">Javob berildi</option>
                      </select>
                    </td>
                    <td style={TD}>
                      <button
                        onClick={() => setSelected(msg)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#78716c", padding: 4 }}
                        title="Ko'rish"
                      >
                        <Eye style={{ width: 16, height: 16 }} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1c1917", margin: 0 }}>{selected.name}</h2>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#78716c" }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "#44403c" }}>
                <Phone style={{ width: 15, height: 15, color: "#d97706" }} />
                <a href={`tel:${selected.phone}`} style={{ color: "#d97706", fontWeight: 500 }}>{selected.phone}</a>
              </div>
              {selected.email && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "#44403c" }}>
                  <Mail style={{ width: 15, height: 15, color: "#78716c" }} />
                  <a href={`mailto:${selected.email}`} style={{ color: "#44403c" }}>{selected.email}</a>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#78716c" }}>
                <Clock style={{ width: 14, height: 14 }} />
                {new Date(selected.created_at).toLocaleString("uz-UZ")}
              </div>
              <div style={{ marginTop: 8, background: "#fafaf9", borderRadius: 10, padding: 16, border: "1px solid #f5f5f4" }}>
                <p style={{ fontSize: 14, color: "#1c1917", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{selected.message}</p>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {["new", "read", "replied"].map((s) => {
                  const st = STATUS_STYLE[s];
                  const active = (selected.status || "new") === s;
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        updateStatus.mutate({ id: selected.id, status: s });
                        setSelected({ ...selected, status: s });
                      }}
                      style={{
                        background: active ? st.bg : "#f5f5f4",
                        color: active ? st.color : "#78716c",
                        border: active ? `1px solid ${st.color}40` : "1px solid transparent",
                        borderRadius: 20, padding: "5px 14px", fontSize: 12,
                        fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TH: React.CSSProperties = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#78716c",
};

const TD: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 13,
  color: "#1c1917",
  verticalAlign: "middle",
};
