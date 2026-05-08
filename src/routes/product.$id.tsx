import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag, ArrowLeft, ShieldCheck, Truck, Award } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { getProduct, getRelated, formatPrice, type Product } from "@/data/products";
import { useShop } from "@/store/shop";
import { toast } from "@/components/site/Toaster";
import { useI18n, useProductT } from "@/i18n/i18n";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product, related: getRelated(params.id) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Museum Shop` },
          { name: "description", content: loaderData.product.short },
          { property: "og:title", content: `${loaderData.product.name} — Museum Shop` },
          { property: "og:description", content: loaderData.product.short },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 pt-40 pb-32 text-center">
        <p className="eyebrow">— 404</p>
        <h1 className="mt-4 font-serif text-5xl">Mahsulot topilmadi</h1>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Kolleksiyaga qaytish
        </Link>
      </div>
      <Footer />
    </main>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const [qty, setQty] = useState(1);
  const liked = inWishlist(product.id);
  const { t } = useI18n();
  const tr = useProductT(product);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            {t("product.backToShop")}
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <img
                  src={product.image}
                  alt={tr.name}
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>
              <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-background/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-primary backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-shimmer" />
                {t("common.inspiredArtifact")}
              </span>
            </div>

            {/* Info */}
            <div>
              <p className="eyebrow">— {tr.museum}</p>
              <h1 className="mt-4 font-serif text-4xl leading-[1.1] sm:text-5xl">
                {tr.name}
              </h1>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-serif text-4xl text-primary">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-muted-foreground">{t("common.currency")}</span>
              </div>

              <div className="my-8 divider-gold" />

              <p className="text-base leading-relaxed text-foreground/80">
                {tr.description}
              </p>

              {/* Quantity + actions */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center rounded-full border border-border/70 bg-card/60">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label={t("common.decrease")}
                    className="grid h-12 w-12 place-items-center text-foreground/80 transition-colors hover:text-primary"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-serif text-lg">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    aria-label={t("common.increase")}
                    className="grid h-12 w-12 place-items-center text-foreground/80 transition-colors hover:text-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    addToCart(product.id, qty);
                    toast(t("toast.addedCart"));
                  }}
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-gold px-7 py-4 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.02] sm:flex-none"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {t("cta.addToCart")}
                </button>

                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast(liked ? t("toast.removedWish") : t("toast.addedWish"));
                  }}
                  aria-label={t("icon.wishlist")}
                  className={`grid h-12 w-12 place-items-center rounded-full border transition-smooth ${
                    liked
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-border/70 text-foreground/80 hover:border-primary hover:text-primary"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-accent" : ""}`} />
                </button>
              </div>

              {/* Trust */}
              <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { Icon: Award, label: t("product.trust.cert") },
                  { Icon: Truck, label: t("product.trust.shipping") },
                  { Icon: ShieldCheck, label: t("product.trust.return") },
                ].map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 p-3"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-xs text-foreground/80">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-background pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow">{t("product.related.eyebrow")}</p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                {t("product.related.title1")} <span className="italic text-primary">{t("product.related.title2")}</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}