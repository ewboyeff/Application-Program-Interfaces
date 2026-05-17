import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag, ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { getProduct, getMuseumProducts, formatPrice, type Product } from "@/data/products";
import { getMuseum, type Museum } from "@/data/museums";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { useShop } from "@/store/shop";
import { toast } from "@/components/site/Toaster";
import { useI18n, useProductT, useMuseumT } from "@/i18n/i18n";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    let product = null;
    let related: Product[] = [];
    try {
      product = await fetchProduct(params.id);
      if (product) {
        const allApi = await fetchProducts();
        related = allApi
          .filter((p) => p.id !== product!.id && p.museumId === product!.museumId)
          .concat(allApi.filter((p) => p.id !== product!.id && p.type === product!.type && p.museumId !== product!.museumId))
          .slice(0, 4);
      }
    } catch {
      // fallback to static data
    }
    if (!product) {
      product = getProduct(params.id) ?? null;
      if (!product) throw notFound();
      related = getMuseumProducts(product.museumId, product.id);
    }
    const museum = getMuseum(product.museumId);
    return { product, museum, related };
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
      <div className="mx-auto max-w-2xl px-4 pt-28 pb-20 text-center sm:px-6 sm:pt-40 sm:pb-32">
        <p className="eyebrow">— 404</p>
        <h1 className="mt-4 font-serif text-3xl sm:text-5xl">Mahsulot topilmadi</h1>
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

function MuseumCard({ museum }: { museum: Museum }) {
  const { t } = useI18n();
  const tr = useMuseumT(museum);
  return (
    <Link
      to="/museums/$id"
      params={{ id: museum.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 transition-smooth hover:border-primary/50 sm:flex-row"
    >
      <div className="relative h-44 shrink-0 overflow-hidden sm:h-auto sm:w-56">
        <img
          src={museum.image}
          alt={tr.name}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30 sm:bg-gradient-to-l" />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {tr.city}
          </div>
          <h3 className="mt-2 font-serif text-xl text-foreground transition-colors group-hover:text-primary">
            {tr.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-foreground/70">
            {tr.short}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-medium text-primary">
          {t("product.museum.link")}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function ProductPage() {
  const { product, museum, related } = Route.useLoaderData();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const [qty, setQty] = useState(1);
  const liked = inWishlist(product.id);
  const { t } = useI18n();
  const tr = useProductT(product);

  const specs = [
    product.maker ? { label: t("product.maker"), value: product.maker } : null,
    product.dimensions ? { label: t("product.dimensions"), value: product.dimensions } : null,
    { label: t("product.category"), value: tr.category },
    { label: t("product.type"), value: tr.type },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-24 pb-16 lg:pt-40 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            {t("product.backToShop")}
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-8 sm:mt-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
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
            <div className="flex flex-col">
              <p className="eyebrow">
                <span className="text-primary/60">— </span>
                {tr.type} · {tr.category}
              </p>
              <h1 className="mt-4 font-serif text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">
                {tr.name}
              </h1>
              <div className="mt-4 flex items-baseline gap-3 sm:mt-6">
                <span className="font-serif text-3xl text-primary sm:text-4xl">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-muted-foreground">{t("common.currency")}</span>
              </div>

              <div className="my-8 divider-gold" />

              <p className="text-base leading-relaxed text-foreground/80">
                {tr.description}
              </p>

              {/* Specs table */}
              {specs.length > 0 && (
                <dl className="mt-8 grid grid-cols-2 gap-3">
                  {specs.map(({ label, value }) => (
                    <div key={label} className="rounded-xl border border-border/50 bg-card/40 px-4 py-3">
                      <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</dt>
                      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* Quantity + actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
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
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-gold px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.02] sm:flex-none sm:px-7 sm:py-4"
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

            </div>
          </div>

          {/* Museum card */}
          {museum && (
            <div className="mt-10 sm:mt-16">
              <p className="eyebrow mb-6">{t("product.museum.eyebrow")}</p>
              <MuseumCard museum={museum} />
            </div>
          )}
        </div>
      </section>

      {/* Related — same museum */}
      {related.length > 0 && (
        <section className="bg-background pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">{t("product.related.eyebrow")}</p>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl">
                  {t("product.related.title1")}{" "}
                  <span className="italic text-primary">{t("product.related.title2")}</span>
                </h2>
              </div>
              {museum && (
                <Link
                  to="/museums/$id"
                  params={{ id: museum.id }}
                  className="hidden items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/80 transition-smooth hover:border-primary hover:text-primary sm:inline-flex"
                >
                  {t("product.museum.link")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
