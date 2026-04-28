import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { type Product, formatPrice } from "@/data/products";
import { useShop } from "@/store/shop";
import { toast } from "./Toaster";
import { useI18n, useProductT } from "@/i18n/i18n";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const liked = inWishlist(product.id);
  const { t } = useI18n();
  const tr = useProductT(product);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-smooth hover:border-primary/50 hover:-translate-y-1">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative block aspect-[4/5] overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur-md">
          <span className="h-1 w-1 rounded-full bg-primary animate-shimmer" />
          {t("common.inspiredArtifact")}
        </span>
      </Link>

      <button
        aria-label={t("icon.wishlist")}
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
          toast(liked ? t("toast.removedWish") : t("toast.addedWish"));
        }}
        className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-smooth ${
          liked
            ? "border-accent bg-accent/20 text-accent"
            : "border-border/70 bg-background/60 text-foreground/80 hover:border-primary hover:text-primary"
        }`}
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-accent" : ""}`} />
      </button>

      <div className="space-y-2 p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {tr.category} · {tr.museum}
        </p>
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="block font-serif text-lg leading-snug text-foreground transition-colors hover:text-primary"
        >
          {tr.name}
        </Link>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {tr.short}
        </p>

        <div className="flex items-center justify-between pt-3">
          <span className="font-serif text-xl text-primary">
            {formatPrice(product.price)}
            <span className="ml-1 text-xs text-muted-foreground">{t("common.currency")}</span>
          </span>
          <button
            onClick={() => {
              addToCart(product.id);
              toast(t("toast.addedCart"));
            }}
            aria-label={t("cta.addToCart")}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-3 py-2 text-xs font-semibold text-primary-foreground transition-smooth hover:scale-[1.03]"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("cta.addToCart")}
          </button>
        </div>
      </div>
    </article>
  );
}