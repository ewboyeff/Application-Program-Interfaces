import { ArrowUpRight } from "lucide-react";
import { useReveal } from "./useReveal";
import { Link } from "@tanstack/react-router";
import rishton from "@/assets/col-rishton.jpg";
import samarkand from "@/assets/col-samarkand.jpg";
import bukhara from "@/assets/col-bukhara.jpg";
import figurines from "@/assets/col-figurines.jpg";

const ITEMS = [
  {
    id: "rishton-lagan",
    image: rishton,
    title: "Rishton keramika",
    desc: "Feruza va ko'k naqshlardagi an'anaviy laganlar — qo'lda chizilgan.",
    tag: "01",
  },
  {
    id: "samarkand-kosa",
    image: samarkand,
    title: "Samarqand naqshli idishlar",
    desc: "Oltin va lojuvardning XV asr saroylaridan ilhomlangan uyg'unligi.",
    tag: "02",
  },
  {
    id: "bukhara-marjon",
    image: bukhara,
    title: "Buxoro zargarlik buyumlari",
    desc: "Filigran kumush, qizil agat va feruza — amir saroyi xazinasidan.",
    tag: "03",
  },
  {
    id: "bronza-chavandoz",
    image: figurines,
    title: "Miniature haykalchalar",
    desc: "Buyuk Ipak yo'li jangchilarining bronza siymolari.",
    tag: "04",
  },
];

export function Collections() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="collections"
      ref={ref}
      className="relative bg-background py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">— Yangiliklar</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Yangi <span className="italic text-primary">kolleksiyalar</span>
            </h2>
          </div>
          <p className="reveal max-w-md text-sm leading-relaxed text-muted-foreground md:text-right">
            Har bir buyum — O'zbekiston hududidan topilgan haqiqiy eksponatga
            sodiq qo'lda tayyorlangan zamonaviy talqin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <Link
              key={item.title}
              to="/product/$id"
              params={{ id: item.id }}
              className="reveal group relative block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-smooth hover:border-primary/50 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full scale-105 object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-br from-accent-deep/0 to-accent-deep/0 transition-all duration-700 group-hover:from-accent-deep/20" />
                <span className="absolute left-5 top-5 font-serif text-xs italic text-primary/80">
                  N° {item.tag}
                </span>
                <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-primary/40 bg-background/40 text-primary opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-serif text-xl text-foreground transition-colors group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}