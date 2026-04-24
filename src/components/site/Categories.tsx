import { useState } from "react";
import { useReveal } from "./useReveal";
import rishton from "@/assets/col-rishton.jpg";
import samarkand from "@/assets/col-samarkand.jpg";
import bukhara from "@/assets/col-bukhara.jpg";
import figurines from "@/assets/col-figurines.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";

type Item = { image: string; name: string; price: string; cat: string };

const ITEMS: Item[] = [
  { image: rishton, name: "Rishton lagan", price: "420 000", cat: "Keramika" },
  { image: samarkand, name: "Samarqand kosa", price: "560 000", cat: "Keramika" },
  { image: bukhara, name: "Buxoro marjon", price: "1 800 000", cat: "Zargarlik" },
  { image: figurines, name: "Bronza chavandoz", price: "920 000", cat: "Haykallar" },
  { image: p5, name: "Yog' chiroq", price: "740 000", cat: "Haykallar" },
  { image: p2, name: "Ipak ikat", price: "540 000", cat: "Milliy naqshlar" },
  { image: p4, name: "Suzani panel", price: "1 100 000", cat: "Milliy naqshlar" },
  { image: p3, name: "Yog'och lauh", price: "780 000", cat: "Milliy naqshlar" },
];

const TABS = ["Barchasi", "Keramika", "Zargarlik", "Haykallar", "Milliy naqshlar"] as const;

export function Categories() {
  const ref = useReveal<HTMLElement>();
  const [active, setActive] = useState<(typeof TABS)[number]>("Barchasi");

  const filtered = active === "Barchasi" ? ITEMS : ITEMS.filter((i) => i.cat === active);

  return (
    <section
      id="categories"
      ref={ref}
      className="relative bg-background py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="reveal mb-10 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">— Toifalar</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Sayohat <span className="italic text-primary">toifalar bo'ylab</span>
            </h2>
          </div>
        </div>

        <div className="reveal mb-12 flex flex-wrap items-center gap-2 border-b border-border/50">
          {TABS.map((t) => {
            const isActive = active === t;
            return (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`relative -mb-px px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
                <span
                  className={`absolute inset-x-3 bottom-0 h-px transition-all duration-500 ${
                    isActive ? "bg-primary opacity-100" : "bg-primary opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <a
              key={p.name + p.cat}
              href="#"
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
                  {p.cat}
                </span>
              </div>
              <div className="flex items-baseline justify-between p-4">
                <h3 className="font-serif text-sm text-foreground transition-colors group-hover:text-primary">
                  {p.name}
                </h3>
                <span className="font-serif text-sm text-primary">
                  {p.price}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}