import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Truck, Zap, MapPin, Phone, Check, UserCircle } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useShop } from "@/store/shop";
import { getProduct, formatPrice, type Product } from "@/data/products";
import { fetchProducts } from "@/lib/api";
import { toast } from "@/components/site/Toaster";
import { useI18n, useProductT } from "@/i18n/i18n";
import { getSession, getToken } from "@/lib/auth";

const API = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Savat — Museum Shop" },
      { name: "description", content: "Tanlangan suvenirlaringiz savati." },
    ],
  }),
  component: CartPage,
});

type DeliveryMethod = "standard" | "express" | "pickup";

const DELIVERY_OPTIONS: { id: DeliveryMethod; icon: React.ElementType; label: string; sub: string; price: number; badge?: string }[] = [
  { id: "standard", icon: Truck, label: "Oddiy yetkazib berish", sub: "2–3 ish kuni", price: 50000 },
  { id: "express", icon: Zap, label: "Tezkor yetkazib berish", sub: "Bugun yoki ertaga", price: 80000, badge: "Tez" },
  { id: "pickup", icon: MapPin, label: "O'zi olib ketish", sub: "Muzey Shop ofisi, Toshkent", price: 0, badge: "Bepul" },
];

function CartPage() {
  const { cart, setQty, removeFromCart, clearCart } = useShop();
  const { t } = useI18n();
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [guestName, setGuestName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const session = getSession();

  const { data: apiProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
    staleTime: 30_000,
  });

  const resolveProduct = (id: string): Product | undefined => {
    const fromApi = apiProducts.find((p) => p.id === id);
    if (fromApi) return fromApi;
    return getProduct(id) ?? undefined;
  };

  const items = cart
    .map((c) => {
      const product = resolveProduct(c.id);
      return product ? { product, qty: c.qty } : null;
    })
    .filter((x): x is { product: Product; qty: number } => x !== null);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const shipping = items.length > 0 ? (DELIVERY_OPTIONS.find((d) => d.id === delivery)?.price ?? 0) : 0;
  const total = items.length > 0 ? subtotal + shipping : 0;

  const handleCheckout = async () => {
    if (delivery !== "pickup" && !phone.trim()) {
      toast("Telefon raqamingizni kiriting"); return;
    }
    if (!session && !guestName.trim()) {
      toast("Ismingizni kiriting"); return;
    }
    setSubmitting(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customerName: session?.fullName || guestName,
          customerPhone: delivery === "pickup" ? (phone || "—") : phone,
          deliveryMethod: delivery,
          address: delivery !== "pickup" ? address : null,
          totalPrice: total,
          items: items.map((i) => ({
            productId: i.product.id,
            qty: i.qty,
            price: i.product.price,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      clearCart();
      setOrdered(true);
    } catch {
      toast("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <p className="eyebrow">{t("cart.eyebrow")}</p>
          <h1 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
            {t("cart.title1")} <span className="italic text-primary">{t("cart.title2")}</span>
          </h1>

          {ordered ? (
            <div className="mt-14 grid place-items-center rounded-2xl border border-primary/40 bg-primary/5 px-6 py-20 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                <Check className="h-7 w-7" />
              </div>
              <p className="mt-6 font-serif text-2xl">Buyurtmangiz qabul qilindi!</p>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Tez orada siz bilan bog'lanamiz. Buyurtma holatini profilingizdan kuzatishingiz mumkin.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Link to="/shop" className="inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2.5 text-sm text-foreground/70 hover:text-primary transition-colors">
                  Xarid qilishni davom ettirish
                </Link>
                {session && (
                  <Link to="/profile" className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
                    Profilga o'tish <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-14 grid place-items-center rounded-2xl border border-border/60 bg-card/40 px-6 py-20 text-center">
              <ShoppingBag className="h-9 w-9 text-primary/70" />
              <p className="mt-5 font-serif text-xl">{t("cart.empty")}</p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("cart.emptyHint")}</p>
              <Link
                to="/shop"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                {t("cart.goShop")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">

              {/* LEFT: items + delivery */}
              <div className="space-y-6">
                {/* Cart items */}
                <div className="space-y-3">
                  {items.map(({ product, qty }) => (
                    <CartRow
                      key={product.id}
                      product={product}
                      qty={qty}
                      onDec={() => setQty(product.id, qty - 1)}
                      onInc={() => setQty(product.id, qty + 1)}
                      onRemove={() => {
                        removeFromCart(product.id);
                        toast(t("toast.removedCart"));
                      }}
                    />
                  ))}
                  <button
                    onClick={() => { clearCart(); toast(t("toast.cartCleared")); }}
                    className="text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-accent"
                  >
                    {t("cart.clear")}
                  </button>
                </div>

                {/* Delivery section */}
                <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-primary">— Yetkazib berish</p>
                  <h3 className="mt-1.5 font-serif text-xl text-foreground">Usul va manzil</h3>

                  {/* Delivery method cards */}
                  <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {DELIVERY_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const active = delivery === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setDelivery(opt.id)}
                          className={`relative flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-all duration-300 ${
                            active
                              ? "border-primary bg-primary/8 shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
                              : "border-border/60 bg-background/40 hover:border-primary/40"
                          }`}
                        >
                          {/* Badge */}
                          {opt.badge && (
                            <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                              opt.id === "pickup" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                            }`}>
                              {opt.badge}
                            </span>
                          )}
                          {/* Check */}
                          <span className={`absolute left-3 top-3 grid h-4 w-4 place-items-center rounded-full border transition-all ${
                            active ? "border-primary bg-primary" : "border-border/60"
                          }`}>
                            {active && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                          </span>
                          <Icon className={`mt-4 h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`text-xs font-medium leading-snug ${active ? "text-foreground" : "text-foreground/75"}`}>
                            {opt.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{opt.sub}</span>
                          <span className={`mt-1 text-xs font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
                            {opt.price === 0 ? "Bepul" : `${formatPrice(opt.price)} so'm`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Guest name (agar kirmagan bo'lsa) */}
                  {!session && (
                    <div className="mt-5">
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        Ismingiz *
                      </label>
                      <div className="relative">
                        <UserCircle className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <input
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Ism Familiya"
                          className="w-full rounded-xl border border-border/70 bg-background/60 py-2.5 pl-9 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/60"
                        />
                      </div>
                    </div>
                  )}
                  {session && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5">
                      <UserCircle className="h-4 w-4 text-primary" />
                      <span className="text-xs text-foreground/80">
                        <span className="text-primary font-medium">{session.fullName || session.email}</span> sifatida buyurtma bermoqdasiz
                      </span>
                    </div>
                  )}

                  {/* Address + phone (hidden for pickup) */}
                  {delivery !== "pickup" && (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                          Yetkazib berish manzili
                        </label>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                          <input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Shahar, ko'cha, uy raqami"
                            className="w-full rounded-xl border border-border/70 bg-background/60 py-2.5 pl-9 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/60"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                          Telefon raqam *
                        </label>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                          <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+998 XX XXX XX XX"
                            className="w-full rounded-xl border border-border/70 bg-background/60 py-2.5 pl-9 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/60"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                          Izoh (ixtiyoriy)
                        </label>
                        <input
                          placeholder="Qo'shimcha ma'lumot"
                          className="w-full rounded-xl border border-border/70 bg-background/60 py-2.5 px-4 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/60"
                        />
                      </div>
                    </div>
                  )}

                  {delivery === "pickup" && (
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-xs font-medium text-foreground">Muzey Shop ofisi</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Toshkent sh., Amir Temur xiyoboni, Davlat Tarix Muzeyi, 1-qavat
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Ish vaqti: Du–Sha, 09:00–18:00
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Summary */}
              <aside className="h-fit rounded-2xl border border-primary/30 bg-card/80 p-6 shadow-glow lg:sticky lg:top-28">
                <p className="eyebrow">{t("cart.summaryEyebrow")}</p>
                <h3 className="mt-2 font-serif text-xl">{t("cart.summary")}</h3>

                <dl className="mt-5 space-y-3 text-sm">
                  <Row label={t("cart.products")} value={`${formatPrice(subtotal)} ${t("common.currency")}`} />
                  <Row
                    label={t("cart.shipping")}
                    value={shipping === 0 ? "Bepul" : `${formatPrice(shipping)} ${t("common.currency")}`}
                    highlight={shipping === 0}
                  />
                </dl>

                {/* Selected method info */}
                <div className="mt-4 rounded-xl border border-border/50 bg-background/40 px-4 py-3">
                  {(() => {
                    const opt = DELIVERY_OPTIONS.find((d) => d.id === delivery)!;
                    const Icon = opt.icon;
                    return (
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground">{opt.sub}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="my-5 divider-gold" />
                <dl className="flex items-baseline justify-between">
                  <dt className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {t("cart.total")}
                  </dt>
                  <dd className="font-serif text-3xl text-primary">
                    {formatPrice(total)}
                    <span className="ml-1 text-xs text-muted-foreground">{t("common.currency")}</span>
                  </dd>
                </dl>

                <button
                  onClick={handleCheckout}
                  disabled={submitting}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.02] disabled:opacity-60"
                >
                  {submitting ? "Yuborilmoqda..." : t("cart.checkout")}
                  {!submitting && <ArrowRight className="h-4 w-4" />}
                </button>

                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  {t("cart.trust")}
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={highlight ? "font-medium text-primary" : "text-foreground"}>{value}</dd>
    </div>
  );
}

function CartRow({
  product, qty, onDec, onInc, onRemove,
}: {
  product: Product;
  qty: number;
  onDec: () => void;
  onInc: () => void;
  onRemove: () => void;
}) {
  const { t } = useI18n();
  const tr = useProductT(product);
  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 transition-smooth hover:border-primary/40 sm:flex-row sm:items-center">
      <Link to="/product/$id" params={{ id: product.id }} className="block h-24 w-24 shrink-0 overflow-hidden rounded-xl">
        <img src={product.image} alt={tr.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </Link>
      <div className="flex-1 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{tr.category}</p>
        <Link to="/product/$id" params={{ id: product.id }} className="block font-serif text-base text-foreground transition-colors hover:text-primary">
          {tr.name}
        </Link>
        <p className="text-sm text-primary">
          {formatPrice(product.price)}{" "}
          <span className="text-xs text-muted-foreground">{t("common.currency")}</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-border/70">
          <button onClick={onDec} aria-label={t("common.decrease")} className="grid h-8 w-8 place-items-center text-foreground/80 transition-colors hover:text-primary">
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-7 text-center text-sm">{qty}</span>
          <button onClick={onInc} aria-label={t("common.increase")} className="grid h-8 w-8 place-items-center text-foreground/80 transition-colors hover:text-primary">
            <Plus className="h-3 w-3" />
          </button>
        </div>
        <p className="hidden w-24 text-right font-serif text-sm text-foreground sm:block">
          {formatPrice(product.price * qty)}
        </p>
        <button onClick={onRemove} aria-label={t("common.remove")} className="grid h-8 w-8 place-items-center rounded-full border border-border/60 text-foreground/60 transition-colors hover:border-accent hover:text-accent">
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
