import { useRef } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useReveal } from "./useReveal";
import { Link } from "@tanstack/react-router";
import { useShop } from "@/store/shop";
import { toast } from "./Toaster";
import { useI18n, useProductT } from "@/i18n/i18n";
import { PRODUCTS as STATIC_PRODUCTS, formatPrice, type Product } from "@/data/products";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";

function FeaturedCard({ product }: { product: Product }) {
  const { addToCart } = useShop();
  const { t } = useI18n();
  const tr = useProductT(product);

  return (
    <article className="group relative w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-smooth hover:border-primary/50 sm:w-[320px]">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={tr.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur-md">
          <span className="h-1 w-1 rounded-full bg-primary animate-shimmer" />
          {tr.type}
        </span>

        <button
          aria-label={t("cta.addToCart")}
          onClick={(e) => {
            e.preventDefault();
            addToCart(product.id);
            toast(t("toast.addedCart"));
          }}
          className="absolute bottom-4 right-4 grid h-12 w-12 translate-y-3 place-items-center rounded-full bg-gradient-gold text-primary-foreground opacity-0 shadow-glow transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Plus className="h-5 w-5" />
        </button>
      </Link>

      <div className="space-y-2 p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {tr.category} · {product.museum}
        </p>
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="block font-serif text-lg leading-snug text-foreground transition-colors hover:text-primary"
        >
          {tr.name}
        </Link>
        <div className="flex items-baseline justify-between pt-2">
          <span className="font-serif text-xl text-primary">
            {formatPrice(product.price)}
            <span className="ml-1 text-xs text-muted-foreground">{t("common.currency")}</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {t("common.limited")}
          </span>
        </div>
      </div>
    </article>
  );
}

export function Featured() {
  const ref = useReveal<HTMLElement>();
  const scroller = useRef<HTMLDivElement | null>(null);
  const { t } = useI18n();

  const { data: apiProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
    staleTime: 30_000,
  });

  const products = (apiProducts.length > 0 ? apiProducts : STATIC_PRODUCTS).slice(0, 8);

  const scroll = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section
      id="featured"
      ref={ref}
      className="relative overflow-hidden bg-background py-16 sm:py-28 lg:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-ember opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-10 flex items-end justify-between gap-6 sm:mb-14">
          <div className="reveal">
            <p className="eyebrow">{t("sec.featuredEyebrow")}</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl lg:text-6xl">
              {t("sec.featuredTitle1")}{" "}
              <span className="italic text-primary">{t("sec.featuredTitle2")}</span>
            </h2>
          </div>

          <div className="reveal hidden items-center gap-3 sm:flex">
            <button
              onClick={() => scroll(-1)}
              aria-label="Chapga"
              className="grid h-11 w-11 place-items-center rounded-full border border-border/70 text-foreground/80 transition-smooth hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="O'ngga"
              className="grid h-11 w-11 place-items-center rounded-full border border-border/70 text-foreground/80 transition-smooth hover:border-primary hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="no-scrollbar reveal -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:gap-6 sm:px-6 sm:pb-6 lg:-mx-10 lg:px-10"
        >
          {products.map((p) => (
            <FeaturedCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}