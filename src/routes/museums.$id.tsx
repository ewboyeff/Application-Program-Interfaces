import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Building2, Sparkles } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { getMuseum } from "@/data/museums";
import { getProductsByMuseum, type Product } from "@/data/products";
import { useI18n, useMuseumT } from "@/i18n/i18n";

export const Route = createFileRoute("/museums/$id")({
  loader: ({ params }) => {
    const museum = getMuseum(params.id);
    if (!museum) throw notFound();
    const products = getProductsByMuseum(museum.id);
    return { museum, products };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.museum.name} — Museum Shop` },
          { name: "description", content: loaderData.museum.description },
          { property: "og:title", content: `${loaderData.museum.name} — Museum Shop` },
          { property: "og:description", content: loaderData.museum.description },
          { property: "og:image", content: loaderData.museum.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 pt-40 pb-32 text-center">
        <p className="eyebrow">— 404</p>
        <h1 className="mt-4 font-serif text-5xl">Muzey topilmadi</h1>
        <Link
          to="/museums"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Muzeylar ro'yxati
        </Link>
      </div>
      <Footer />
    </main>
  ),
  component: MuseumDetailPage,
});

function MuseumDetailPage() {
  const { museum, products } = Route.useLoaderData();
  const { t } = useI18n();
  const tr = useMuseumT(museum);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-32 pb-16 lg:pt-40">
        <div className="absolute inset-0 -z-10">
          <img src={museum.image} alt={tr.name} className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link
            to="/museums"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            {t("mus.back")}
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow inline-flex items-center gap-2">
                <MapPin className="h-3 w-3" /> {tr.city}
              </p>
              <h1 className="mt-4 font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
                {tr.name}
              </h1>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
                {tr.description}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-border/50 pt-6">
                <Stat icon={<Building2 className="h-3.5 w-3.5" />} label={t("mus.founded")} value={tr.founded} />
                <Stat icon={<Sparkles className="h-3.5 w-3.5" />} label={t("mus.exhibits")} value={museum.exhibits} />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-card">
              <img src={museum.image} alt={tr.name} className="aspect-[5/4] h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{t("mus.detail.eyebrow")}</p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                {t("mus.detail.title1")} <span className="italic text-primary">{tr.name}</span>
              </h2>
            </div>
          </div>
          {products.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card/40 p-16 text-center">
              <p className="font-serif text-2xl">{t("mus.detail.empty")}</p>
              <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground">
                {t("cart.goShop")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="mt-1 font-serif text-2xl text-primary">{value}</div>
    </div>
  );
}