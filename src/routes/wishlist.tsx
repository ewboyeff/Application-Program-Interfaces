import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { useShop } from "@/store/shop";
import { getProduct } from "@/data/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Sevimlilar — Museum Shop" },
      { name: "description", content: "Saqlangan suvenirlaringiz." },
      { property: "og:title", content: "Sevimlilar — Museum Shop" },
      { property: "og:description", content: "Saqlangan suvenirlaringiz." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useShop();
  const items = wishlist.map((id) => getProduct(id)).filter(Boolean) as NonNullable<
    ReturnType<typeof getProduct>
  >[];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-24 lg:pt-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="eyebrow">— Sevimlilar</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] sm:text-6xl">
            Sizning <span className="italic text-primary">tanlovingiz</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm text-muted-foreground">
            Saqlangan buyumlar brauzeringizda mahalliy ravishda saqlanadi.
          </p>

          {items.length === 0 ? (
            <div className="mt-16 grid place-items-center rounded-2xl border border-border/60 bg-card/40 px-6 py-24 text-center">
              <Heart className="h-10 w-10 text-accent/70" />
              <p className="mt-6 font-serif text-2xl">Hali hech narsa saqlanmagan</p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Yoqqan buyumlarni yurakcha tugmasi orqali saqlang.
              </p>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                Kolleksiyaga o'tish
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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