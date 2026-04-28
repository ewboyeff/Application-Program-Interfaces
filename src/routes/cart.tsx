import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useShop } from "@/store/shop";
import { getProduct, formatPrice } from "@/data/products";
import { toast } from "@/components/site/Toaster";
import { useI18n, useProductT } from "@/i18n/i18n";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Savat — Museum Shop" },
      { name: "description", content: "Tanlangan suvenirlaringiz savati." },
      { property: "og:title", content: "Savat — Museum Shop" },
      { property: "og:description", content: "Tanlangan suvenirlaringiz savati." },
    ],
  }),
  component: CartPage,
});

const SHIPPING = 50000;

function CartPage() {
  const { cart, setQty, removeFromCart, clearCart } = useShop();
  const { t } = useI18n();

  const items = cart
    .map((c) => {
      const product = getProduct(c.id);
      return product ? { product, qty: c.qty } : null;
    })
    .filter((x): x is { product: ReturnType<typeof getProduct> & object; qty: number } => x !== null);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const total = items.length > 0 ? subtotal + SHIPPING : 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-24 lg:pt-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="eyebrow">{t("cart.eyebrow")}</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] sm:text-6xl">
            {t("cart.title1")} <span className="italic text-primary">{t("cart.title2")}</span>
          </h1>

          {items.length === 0 ? (
            <div className="mt-16 grid place-items-center rounded-2xl border border-border/60 bg-card/40 px-6 py-24 text-center">
              <ShoppingBag className="h-10 w-10 text-primary/70" />
              <p className="mt-6 font-serif text-2xl">{t("cart.empty")}</p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {t("cart.emptyHint")}
              </p>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                {t("cart.goShop")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
              {/* Items */}
              <div className="space-y-4">
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
                  onClick={() => {
                    clearCart();
                    toast(t("toast.cartCleared"));
                  }}
                  className="text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-accent"
                >
                  {t("cart.clear")}
                </button>
              </div>

              {/* Summary */}
              <aside className="h-fit rounded-2xl border border-primary/30 bg-card/80 p-7 shadow-glow lg:sticky lg:top-28">
                <p className="eyebrow">{t("cart.summaryEyebrow")}</p>
                <h3 className="mt-3 font-serif text-2xl">{t("cart.summary")}</h3>

                <dl className="mt-6 space-y-3 text-sm">
                  <Row label={t("cart.products")} value={`${formatPrice(subtotal)} ${t("common.currency")}`} />
                  <Row label={t("cart.shipping")} value={`${formatPrice(SHIPPING)} ${t("common.currency")}`} />
                </dl>
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
                  onClick={() => toast(t("toast.orderPlaced"))}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-4 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.02]"
                >
                  {t("cart.checkout")}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-4 text-center text-[11px] text-muted-foreground">
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

function CartRow({
  product,
  qty,
  onDec,
  onInc,
  onRemove,
}: {
  product: NonNullable<ReturnType<typeof getProduct>>;
  qty: number;
  onDec: () => void;
  onInc: () => void;
  onRemove: () => void;
}) {
  const { t } = useI18n();
  const tr = useProductT(product);
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 transition-smooth hover:border-primary/40 sm:flex-row sm:items-center">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block h-28 w-28 shrink-0 overflow-hidden rounded-xl"
      >
        <img
          src={product.image}
          alt={tr.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </Link>

      <div className="flex-1 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {tr.category}
        </p>
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="block font-serif text-lg text-foreground transition-colors hover:text-primary"
        >
          {tr.name}
        </Link>
        <p className="text-sm text-primary">
          {formatPrice(product.price)}{" "}
          <span className="text-xs text-muted-foreground">{t("common.currency")}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-border/70">
          <button
            onClick={onDec}
            aria-label={t("common.decrease")}
            className="grid h-9 w-9 place-items-center text-foreground/80 transition-colors hover:text-primary"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button
            onClick={onInc}
            aria-label={t("common.increase")}
            className="grid h-9 w-9 place-items-center text-foreground/80 transition-colors hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="hidden w-28 text-right font-serif text-base text-foreground sm:block">
          {formatPrice(product.price * qty)}
        </p>
        <button
          onClick={onRemove}
          aria-label={t("common.remove")}
          className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-foreground/60 transition-colors hover:border-accent hover:text-accent"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}