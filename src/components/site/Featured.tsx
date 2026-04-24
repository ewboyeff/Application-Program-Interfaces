import { useRef } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useReveal } from "./useReveal";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

const PRODUCTS = [
  { image: p1, name: "Ko'k naqshli choynak", price: "320 000", museum: "Rishton State Museum" },
  { image: p2, name: "Ipak ikat ro'mol", price: "540 000", museum: "Margilon Atlas Museum" },
  { image: p3, name: "Yog'och lauh kitobligi", price: "780 000", museum: "Khiva Heritage Center" },
  { image: p4, name: "Suzani gilam (mini)", price: "1 200 000", museum: "Bukhara Suzani Hall" },
  { image: p5, name: "Bronza yog' chiroq", price: "920 000", museum: "Tashkent Applied Arts" },
  { image: p6, name: "Registon miniaturasi", price: "650 000", museum: "Samarkand Afrosiyob" },
];

export function Featured() {
  const ref = useReveal<HTMLElement>();
  const scroller = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section
      id="featured"
      ref={ref}
      className="relative overflow-hidden bg-background py-28 lg:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-ember opacity-50" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div className="reveal">
            <p className="eyebrow">— Tanlangan</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Mashhur <span className="italic text-primary">Suvenirlar</span>
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
          className="no-scrollbar reveal -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 lg:-mx-10 lg:px-10"
        >
          {PRODUCTS.map((p) => (
            <article
              key={p.name}
              className="group relative w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-smooth hover:border-primary/50 sm:w-[320px]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur-md">
                  <span className="h-1 w-1 rounded-full bg-primary animate-shimmer" />
                  Inspired by museum artifact
                </span>

                <button
                  aria-label="Savatga qo'shish"
                  className="absolute bottom-4 right-4 grid h-12 w-12 translate-y-3 place-items-center rounded-full bg-gradient-gold text-primary-foreground opacity-0 shadow-glow transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2 p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {p.museum}
                </p>
                <h3 className="font-serif text-lg leading-snug text-foreground">
                  {p.name}
                </h3>
                <div className="flex items-baseline justify-between pt-2">
                  <span className="font-serif text-xl text-primary">
                    {p.price}
                    <span className="ml-1 text-xs text-muted-foreground">so'm</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Cheklangan
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}