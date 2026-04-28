import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { useI18n, useCategoryT } from "@/i18n/i18n";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Kolleksiya — Museum Shop" },
      {
        name: "description",
        content:
          "Muzeylardan ilhomlangan suvenirlar to'liq kolleksiyasi: keramika, zargarlik, haykallar va milliy naqshlar.",
      },
      { property: "og:title", content: "Kolleksiya — Museum Shop" },
      {
        property: "og:description",
        content: "Muzeylardan ilhomlangan suvenirlar to'liq kolleksiyasi.",
      },
    ],
  }),
  component: ShopPage,
});

type Sort = "default" | "price-asc" | "price-desc";

function ShopPage() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("Barchasi");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("default");
  const { t } = useI18n();
  const tCat = useCategoryT();

  const items = useMemo(() => {
    let list = PRODUCTS.slice();
    if (active !== "Barchasi") list = list.filter((p) => p.category === active);
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.museum.toLowerCase().includes(s) ||
          p.short.toLowerCase().includes(s),
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [active, q, sort]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <PageHeader
        eyebrow={t("shop.headerEyebrow")}
        title={t("shop.headerTitle")}
        highlight={t("shop.headerHighlight")}
        subtitle={t("shop.headerSub")}
      />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Toolbar */}
          <div className="mb-10 flex flex-col gap-6">
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
                <label className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {t("shop.sort")}
                </label>
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

            <div className="flex flex-wrap items-center gap-2 border-b border-border/50">
              {CATEGORIES.map((c) => {
                const isActive = active === c;
                return (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    className={`relative -mb-px px-4 py-3 text-sm font-medium transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tCat(c)}
                    <span
                      className={`absolute inset-x-3 bottom-0 h-px transition-all duration-500 ${
                        isActive ? "bg-primary opacity-100" : "bg-primary opacity-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {items.length} {t("shop.count")}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card/40 p-16 text-center">
              <p className="font-serif text-2xl text-foreground">{t("shop.emptyTitle")}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("shop.emptyHint")}
              </p>
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

      <Footer />
    </main>
  );
}