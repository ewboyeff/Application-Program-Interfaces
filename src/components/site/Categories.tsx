import { useState } from "react";
import { useReveal } from "./useReveal";
import { Link } from "@tanstack/react-router";
import { useI18n, useCategoryT, useTypeT } from "@/i18n/i18n";
import { PRODUCTS, MOHIR_SUBCATS, MUZEY_SUBCATS, type MainType, type Category } from "@/data/products";
import { formatPrice } from "@/data/products";

type ActiveType = "all" | MainType;

export function Categories() {
  const ref = useReveal<HTMLElement>();
  const { t } = useI18n();
  const tCat = useCategoryT();
  const tType = useTypeT();

  const [activeType, setActiveType] = useState<ActiveType>("all");
  const [activeCat, setActiveCat] = useState<Category | "all">("all");

  const subcats =
    activeType === "MOHIR_QOLLAR"
      ? MOHIR_SUBCATS
      : activeType === "MUZEY_SUVENIRLARI"
      ? MUZEY_SUBCATS
      : [];

  const handleTypeChange = (type: ActiveType) => {
    setActiveType(type);
    setActiveCat("all");
  };

  const filtered = PRODUCTS.filter((p) => {
    if (activeType !== "all" && p.type !== activeType) return false;
    if (activeCat !== "all" && p.category !== activeCat) return false;
    return true;
  }).slice(0, 8);

  return (
    <section
      id="categories"
      ref={ref}
      className="relative bg-background py-16 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="reveal mb-8 flex flex-col items-start gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">{t("sec.categoriesEyebrow")}</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl lg:text-6xl">
              {t("sec.categoriesTitle1")}{" "}
              <span className="italic text-primary">{t("sec.categoriesTitle2")}</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden shrink-0 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/80 transition-smooth hover:border-primary hover:text-primary md:inline-flex"
          >
            {t("cta.viewCollection")}
          </Link>
        </div>

        {/* Level 1: Main type tabs */}
        <div className="reveal mb-4 flex flex-wrap items-center gap-2 border-b border-border/50">
          {(["all", "MOHIR_QOLLAR", "MUZEY_SUVENIRLARI"] as ActiveType[]).map((type) => {
            const isActive = activeType === type;
            const label = type === "all" ? t("type.all") : tType(type);
            return (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`relative -mb-px px-5 py-3 text-sm font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                <span
                  className={`absolute inset-x-3 bottom-0 h-[2px] rounded-full transition-all duration-500 ${
                    isActive ? "bg-primary opacity-100" : "bg-primary opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Level 2: Subcategory chips */}
        {subcats.length > 0 && (
          <div className="reveal mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCat("all")}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                activeCat === "all"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
            >
              {t("type.all")}
            </button>
            {subcats.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeCat === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                }`}
              >
                {tCat(cat)}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="reveal rounded-2xl border border-border/60 bg-card/40 p-16 text-center">
            <p className="font-serif text-2xl text-foreground">{t("shop.emptyTitle")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("shop.emptyHint")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="group block animate-float-up overflow-hidden rounded-xl border border-border/50 bg-card transition-smooth hover:border-primary/50"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80" />
                  <span className="absolute left-3 top-3 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-foreground/80 backdrop-blur-md">
                    {tCat(p.category)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between p-4">
                  <h3 className="font-serif text-sm text-foreground transition-colors group-hover:text-primary line-clamp-1">
                    {p.name}
                  </h3>
                  <span className="ml-2 shrink-0 font-serif text-sm text-primary">
                    {formatPrice(p.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="reveal mt-10 flex justify-center md:hidden">
          <Link
            to="/shop"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/80 transition-smooth hover:border-primary hover:text-primary"
          >
            {t("cta.viewCollection")}
          </Link>
        </div>
      </div>
    </section>
  );
}
