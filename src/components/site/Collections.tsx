import { ArrowUpRight } from "lucide-react";
import { useReveal } from "./useReveal";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/i18n/i18n";
import { fetchProducts } from "@/lib/api";
import { PRODUCTS } from "@/data/products";
import rishton from "@/assets/col-rishton.jpg";
import samarkand from "@/assets/col-samarkand.jpg";
import bukhara from "@/assets/col-bukhara.jpg";
import figurines from "@/assets/col-figurines.jpg";

const FALLBACK = [
  { id: "rishton-lagan",   image: rishton,    title: "Rishton keramika",          desc: "Feruza va ko'k naqshlardagi an'anaviy laganlar — qo'lda chizilgan." },
  { id: "samarkand-kosa",  image: samarkand,  title: "Samarqand naqshli idishlar", desc: "Oltin va lojuvardning XV asr saroylaridan ilhomlangan uyg'unligi." },
  { id: "bukhara-marjon",  image: bukhara,    title: "Buxoro zargarlik buyumlari", desc: "Filigran kumush, qizil agat va feruza — amir saroyi xazinasidan." },
  { id: "buxoro-shahri",   image: figurines,  title: "Buxoro tarixiy shahri",      desc: "Po-i-Kalon majmuasi va minoralar — qadimgi shahar siymosidan suvenirlar." },
];

export function Collections() {
  const ref = useReveal<HTMLElement>();
  const { t } = useI18n();

  const { data: apiProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
    staleTime: 30_000,
  });

  const source = apiProducts.length > 0 ? apiProducts : PRODUCTS;
  const latest = source.slice(0, 4);

  const items = latest.length >= 4
    ? latest.map((p, i) => ({
        id: p.id,
        image: p.image,
        title: p.name,
        desc: p.short,
        tag: String(i + 1).padStart(2, "0"),
        blend: false,
      }))
    : FALLBACK.map((f, i) => ({ ...f, tag: String(i + 1).padStart(2, "0"), blend: i < 3 }));

  return (
    <section
      id="collections"
      ref={ref}
      className="relative bg-background py-16 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">{t("sec.collectionsEyebrow")}</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl lg:text-6xl">
              {t("sec.collectionsTitle1")}{" "}
              <span className="italic text-primary">{t("sec.collectionsTitle2")}</span>
            </h2>
          </div>
          <p className="reveal max-w-md text-sm leading-relaxed text-muted-foreground md:text-right">
            {t("sec.collectionsLead")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.id}
              to="/product/$id"
              params={{ id: item.id }}
              className="reveal group relative block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-smooth hover:border-primary/50 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-card">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full scale-105 object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-95" />
                <span className="absolute left-5 top-5 font-serif text-xs italic text-primary/80">
                  N° {item.tag}
                </span>
                <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-primary/40 bg-background/40 text-primary opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-serif text-xl text-foreground transition-colors group-hover:text-primary line-clamp-2">
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
