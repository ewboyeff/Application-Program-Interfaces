import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { PRODUCTS, MOHIR_SUBCATS, MUZEY_SUBCATS, type MainType, type Category } from "@/data/products";
import { useI18n, useTypeT } from "@/i18n/i18n";
import { fetchProducts } from "@/lib/api";
import zargarlikImg from "@/assets/mohir-qollar.jpg";
import rishtonImg from "@/assets/muzey-suvenirlar.jpg";
import catZargarlik from "@/assets/cat-zargarlik.jpg";
import catSopol from "@/assets/cat-sopol.jpg";
import catYogoch from "@/assets/cat-yogoch.jpg";
import catKiyimlar from "@/assets/cat-kiyimlar.jpg";
import catShopperlar from "@/assets/cat-shopperlar.jpg";
import catGilamalar from "@/assets/cat-gilamalar.jpg";
import catMiniatyuralar from "@/assets/cat-miniatyuralar.jpg";
import catKitoblar from "@/assets/cat-kitoblar.jpg";
import catBolalar from "@/assets/cat-bolalar.jpg";
import catPrintliIdishlar from "@/assets/cat-printli-idishlar.jpg";
import catPrintliKiyimlar from "@/assets/cat-printli-kiyimlar.jpg";
import catShopperlarMuzey from "@/assets/cat-shopperlar-muzey.jpg";
import catOtkritkalar from "@/assets/cat-otkritkalar.jpg";
import catBreloklar from "@/assets/cat-breloklar.jpg";
import catReplikalari from "@/assets/col-figurines.jpg";

const SUBCAT_IMAGES: Record<string, string> = {
  "Zargarlik buyumlari": catZargarlik,
  "Sopol buyumlar": catSopol,
  "Yog'och o'ymakorligi": catYogoch,
  "Kiyimlar": catKiyimlar,
  "Shopperlar": catShopperlar,
  "Gilamalar": catGilamalar,
  "Miniatyuralar": catMiniatyuralar,
  "Kitoblar va kataloglar": catKitoblar,
  "Bolalar uchun": catBolalar,
  "Bosma printli idishlar (muzey)": catPrintliIdishlar,
  "Bosma printli kiyimlar": catPrintliKiyimlar,
  "Shopperlar (muzey)": catShopperlarMuzey,
  "Otkritkalar": catOtkritkalar,
  "Breloklar va magnitlar": catBreloklar,
  "Muzey ashyolari replikalari": catReplikalari,
};

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Mahsulotlar — Museum Shop" },
      {
        name: "description",
        content: "Muzeylardan ilhomlangan suvenirlar to'liq kolleksiyasi: mohir qo'llar va muzey suvenirlari.",
      },
    ],
  }),
  component: ShopPage,
});

type Sort = "default" | "price-asc" | "price-desc";

function ShopPage() {
  const [activeType, setActiveType] = useState<MainType | null>(null);
  const [activeCat, setActiveCat] = useState<Category | "all">("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("default");
  const { t } = useI18n();
  const tType = useTypeT();

  const { data: apiProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
    staleTime: 30_000,
  });

  const allProducts = apiProducts.length > 0 ? apiProducts : PRODUCTS;

  const subcats = activeType === "MOHIR_QOLLAR"
    ? MOHIR_SUBCATS
    : activeType === "MUZEY_SUVENIRLARI"
    ? MUZEY_SUBCATS
    : [];

  const handleTypeChange = (type: MainType) => {
    setActiveType(type);
    setActiveCat("all");
    setQ("");
    setSort("default");
  };

  const handleBack = () => {
    setActiveType(null);
    setActiveCat("all");
    setQ("");
    setSort("default");
  };

  const handleBackToSubcats = () => {
    setActiveCat("all");
    setQ("");
    setSort("default");
  };

  const items = useMemo(() => {
    if (!activeType || activeCat === "all") return [];
    let list = allProducts.filter((p) => p.type === activeType && p.category === activeCat);
    const s = q.trim().toLowerCase();
    if (s) list = list.filter((p) =>
      p.name.toLowerCase().includes(s) ||
      p.museum.toLowerCase().includes(s) ||
      p.short.toLowerCase().includes(s),
    );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [activeType, activeCat, q, sort, allProducts]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Step 1: Landing — two main category cards */}
      {!activeType && (
        <section className="bg-background" style={{ paddingTop: "calc(80px + 2.5rem)", paddingBottom: "5rem" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <p className="eyebrow">{t("nav.shop")}</p>
            <h1 className="mt-2 font-serif text-2xl leading-tight tracking-tight sm:text-3xl">
              Kategoriyani <span className="italic text-primary">tanlang</span>
            </h1>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <CategoryCard
                image={zargarlikImg}
                title={tType("MOHIR_QOLLAR")}
                onClick={() => handleTypeChange("MOHIR_QOLLAR")}
              />
              <CategoryCard
                image={rishtonImg}
                title={tType("MUZEY_SUVENIRLARI")}
                onClick={() => handleTypeChange("MUZEY_SUVENIRLARI")}
              />
            </div>
          </div>
        </section>
      )}

      {/* Step 2: Subcategory cards */}
      {activeType && activeCat === "all" && (
        <section className="bg-background pb-16" style={{ paddingTop: "calc(80px + 1.5rem)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mb-8 flex items-center gap-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm text-foreground/70 transition-smooth hover:border-primary hover:text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("nav.shop")}
              </button>
              <h1 className="font-serif text-2xl sm:text-3xl">{tType(activeType)}</h1>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {subcats.map((cat) => {
                const img = SUBCAT_IMAGES[cat] ?? allProducts.find((p) => p.type === activeType && p.category === cat)?.image;
                return (
                  <SubcatCard
                    key={cat}
                    name={cat}
                    image={img}
                    onClick={() => setActiveCat(cat)}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Products */}
      {activeType && activeCat !== "all" && (
        <section className="bg-background pb-16" style={{ paddingTop: "calc(80px + 1.5rem)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            {/* Breadcrumb nav */}
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {t("nav.shop")}
              </button>
              <span className="text-muted-foreground/40">/</span>
              <button
                onClick={handleBackToSubcats}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {tType(activeType)}
              </button>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-sm text-foreground">{activeCat}</span>
            </div>

            {/* Toolbar */}
            <div className="mb-8 flex flex-col gap-4">
              <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative max-w-md flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t("shop.searchPh")}
                    className="w-full rounded-full border border-border/70 bg-card/60 py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className="rounded-full border border-border/70 bg-card/60 px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  >
                    <option value="default">{t("shop.sortDefault")}</option>
                    <option value="price-asc">{t("shop.sortAsc")}</option>
                    <option value="price-desc">{t("shop.sortDesc")}</option>
                  </select>
                </div>
              </div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {items.length} {t("shop.count")}
              </p>
            </div>

            {items.length === 0 ? (
              <div className="rounded-2xl border border-border/60 bg-card/40 p-16 text-center">
                <p className="font-serif text-2xl text-foreground">{t("shop.emptyTitle")}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t("shop.emptyHint")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

function CategoryCard({
  image,
  title,
  onClick,
}: {
  image: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 text-left shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-108"
        />
        {/* Dark base overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        {/* Gold shimmer overlay — fades in on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-primary/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        {/* Top-right sparkle dot */}
        <span className="absolute right-5 top-5 h-2 w-2 rounded-full bg-primary opacity-0 shadow-[0_0_8px_3px_hsl(var(--primary)/0.6)] transition-all duration-500 group-hover:opacity-100" />
      </div>

      {/* Info panel */}
      <div className="relative flex flex-col items-center overflow-hidden px-7 py-6 text-center transition-colors duration-500">
        {/* Animated gradient bg behind the panel */}
        <div className="absolute inset-0 bg-gradient-to-b from-card/70 to-card/90 transition-all duration-500 group-hover:from-primary/10 group-hover:to-card/90" />
        {/* Content */}
        <div className="relative z-10">
          <h2 className="font-serif text-2xl leading-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-3xl">
            {title}
          </h2>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
            <span className="border-b border-primary/40 pb-0.5 transition-all duration-300 group-hover:border-primary">
              Ko'rish
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>

      {/* Animated border glow line at bottom */}
      <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-gold scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
    </button>
  );
}

function SubcatCard({
  name,
  image,
  onClick,
}: {
  name: string;
  image?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-border/50 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-card to-muted" />
        )}
        {/* Strong gradient covers bottom 50% */}
        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black via-black/80 to-transparent" />
        {/* Hover gold shimmer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {/* Text pushed to bottom */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-6 text-center">
          <p className="font-serif text-lg leading-snug text-white transition-colors group-hover:text-primary">
            {name}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
            <span className="border-b border-primary/40 pb-0.5 transition-all duration-300 group-hover:border-primary">Ko'rish</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-gold scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
    </button>
  );
}
