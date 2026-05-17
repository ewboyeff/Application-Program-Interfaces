import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, ShoppingBag, LogOut, Package, ChevronRight, MapPin, Truck } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { getSession, getToken, clearSession, apiFetch } from "@/lib/auth";
import { formatPrice } from "@/data/products";

const API = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profil — Museum Shop" }] }),
  component: ProfilePage,
});

interface Order {
  id: string;
  total_price: number;
  status: string;
  delivery_method: string;
  address: string | null;
  created_at: string;
  items: { qty: number; price: number; product_id: string; name: string; image_url: string }[];
}

const STATUS_LABEL: Record<string, string> = {
  new: "Yangi",
  confirmed: "Tasdiqlangan",
  shipped: "Jo'natilgan",
  delivered: "Yetkazilgan",
  cancelled: "Bekor qilingan",
};

const STATUS_COLOR: Record<string, string> = {
  new: "text-primary border-primary/40 bg-primary/10",
  confirmed: "text-blue-400 border-blue-400/40 bg-blue-400/10",
  shipped: "text-amber-400 border-amber-400/40 bg-amber-400/10",
  delivered: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  cancelled: "text-destructive border-destructive/40 bg-destructive/10",
};

function ProfilePage() {
  const navigate = useNavigate();
  const session = getSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"orders" | "info">("orders");

  useEffect(() => {
    if (!session) { navigate({ to: "/login" }); return; }
    apiFetch("/api/users/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (!session) return null;

  const handleLogout = () => {
    clearSession();
    navigate({ to: "/" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section style={{ paddingTop: "calc(80px + 2.5rem)" }} className="pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10">

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-serif text-2xl">
                  {session.fullName || "Foydalanuvchi"}
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">{session.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
              Chiqish
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-1 rounded-full border border-border/50 bg-card/40 p-1 w-fit">
            {(["orders", "info"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-gradient-gold text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "orders" ? "Buyurtmalar" : "Ma'lumotlar"}
              </button>
            ))}
          </div>

          {/* Orders tab */}
          {tab === "orders" && (
            <div>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-28 animate-pulse rounded-2xl border border-border/40 bg-card/40" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-border/50 bg-card/40 p-16 text-center">
                  <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-muted-foreground/40" />
                  <p className="font-serif text-xl text-foreground">Buyurtmalar yo'q</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hali birorta mahsulot sotib olmadingiz
                  </p>
                  <Link
                    to="/shop"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground"
                  >
                    Mahsulotlarga o'tish
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="overflow-hidden rounded-2xl border border-border/50 bg-card/40"
                    >
                      {/* Order header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Package className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-sm font-medium">
                              {new Date(order.created_at).toLocaleDateString("uz-UZ", {
                                day: "numeric", month: "long", year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-lg text-primary">
                            {formatPrice(order.total_price)} so'm
                          </span>
                          <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${STATUS_COLOR[order.status] || STATUS_COLOR.new}`}>
                            {STATUS_LABEL[order.status] || order.status}
                          </span>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="divide-y divide-border/30">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 px-6 py-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border/40 bg-card">
                              {item.image_url && (
                                <img
                                  src={item.image_url.startsWith("http") ? item.image_url : `${API}${item.image_url}`}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.name || item.product_id}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.qty} dona × {formatPrice(item.price)} so'm
                              </p>
                            </div>
                            <Link
                              to="/product/$id"
                              params={{ id: item.product_id }}
                              className="text-xs text-primary hover:underline"
                            >
                              Ko'rish
                            </Link>
                          </div>
                        ))}
                      </div>

                      {/* Delivery info */}
                      {(order.delivery_method || order.address) && (
                        <div className="flex items-center gap-2 border-t border-border/40 px-6 py-3 text-xs text-muted-foreground">
                          {order.delivery_method === "pickup" ? (
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <Truck className="h-3.5 w-3.5 shrink-0" />
                          )}
                          {order.address || (order.delivery_method === "pickup" ? "O'zi olib ketadi" : "Yetkazib berish")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info tab */}
          {tab === "info" && (
            <div className="rounded-2xl border border-border/50 bg-card/40 p-8">
              <div className="space-y-6">
                <InfoRow label="To'liq ism" value={session.fullName || "—"} />
                <InfoRow label="Email" value={session.email} />
                <InfoRow label="Telefon" value={session.phone || "—"} />
              </div>
              <div className="mt-8 border-t border-border/40 pt-6">
                <p className="text-xs text-muted-foreground">
                  Ma'lumotlarni o'zgartirish funksiyasi tez orada qo'shiladi.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/30 pb-4 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
