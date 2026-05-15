import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { type Product } from "@/data/products";
import { useShop } from "@/store/shop";
import { toast } from "./Toaster";
import { useI18n, useProductT } from "@/i18n/i18n";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, inWishlist } = useShop();
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

      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block space-y-2 p-5"
      >
        <p className="text-[11px] uppercase tracking-[0.22em] text-primary/80">
          {tr.type}
        </p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {tr.category}
        </p>
        <p className="font-serif text-xl leading-snug text-foreground transition-colors group-hover:text-primary">
          {tr.name}
        </p>
      </Link>
    </article>
  );
}