import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MUSEUMS, ALL_REGIONS, type Museum } from "@/data/museums";
import { useI18n, useMuseumT } from "@/i18n/i18n";

export const Route = createFileRoute("/museums/")({
  head: () => ({
    meta: [
      { title: "Muzeylar — Museum Shop" },
      {
        name: "description",
        content: "O'zbekiston muzeylari: Amir Temur, State Museum of History, Savitsky va Bukhara Ark.",
      },
    ],
  }),
  component: MuseumsPage,
});

function MuseumsPage() {
  const { t } = useI18n();
  const [activeRegion, setActiveRegion] = useState<string>("all");

  const filtered =
    activeRegion === "all"
      ? MUSEUMS
      : MUSEUMS.filter((m) => m.region === activeRegion);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="bg-background pb-24" style={{ paddingTop: "calc(80px + 2rem)" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-10">

          {/* Title */}
          <div className="mb-10">
            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {t("mus.headerTitle")}{" "}
              <span className="italic text-primary">{t("mus.headerHighlight")}</span>
            </h1>
          </div>

          {/* Region filter */}
          <div className="no-scrollbar mb-10 -mx-6 flex items-center gap-2 overflow-x-auto px-6 lg:-mx-10 lg:px-10">
            <button
              onClick={() => setActiveRegion("all")}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                activeRegion === "all"
                  ? "bg-gradient-gold text-primary-foreground shadow-glow"
                  : "border border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {t("type.all")}
            </button>

            <span className="mx-1 h-4 w-px shrink-0 bg-border/50" />

            {ALL_REGIONS.map((region) => {
              const count = MUSEUMS.filter((m) => m.region === region).length;
              const isActive = activeRegion === region;
              return (
                <button
                  key={region}
                  onClick={() => count > 0 && setActiveRegion(region)}
                  className={`group shrink-0 inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : count > 0
                      ? "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground cursor-pointer"
                      : "border-border/30 text-muted-foreground/35 cursor-not-allowed"
                  }`}
                >
                  {count > 0 && <MapPin className="h-2.5 w-2.5" />}
                  {region}
                  {count > 0 && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] leading-none ${
                      isActive ? "bg-primary/20 text-primary" : "bg-border/60 text-muted-foreground"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card/40 p-16 text-center">
              <p className="font-serif text-2xl text-foreground">Tez orada</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Bu viloyatdagi muzeylar qo'shilmoqda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filtered.map((m) => (
                <MuseumCard key={m.id} m={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function MuseumCard({ m }: { m: Museum }) {
  const { t } = useI18n();
  const tr = useMuseumT(m);
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-smooth hover:border-primary/50 hover:-translate-y-1">
      <Link to="/museums/$id" params={{ id: m.id }} className="relative block aspect-[16/10] overflow-hidden">
        <img
          src={m.image}
          alt={tr.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-primary/40 bg-background/40 text-primary opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Link>
      <div className="p-7">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-primary">
          <MapPin className="h-3 w-3" />
          {tr.city} · {t("mus.founded")}: {tr.founded}
        </div>
        <Link to="/museums/$id" params={{ id: m.id }}>
          <h3 className="mt-3 font-serif text-2xl text-foreground transition-colors group-hover:text-primary sm:text-3xl">
            {tr.name}
          </h3>
        </Link>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {tr.description}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-5">
          <div className="text-xs text-muted-foreground">
            <span className="font-serif text-primary">{m.exhibits}</span>{" "}
            {t("mus.exhibits")}
          </div>
          <Link
            to="/museums/$id"
            params={{ id: m.id }}
            className="group/link inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <span className="border-b border-primary/40 pb-0.5 transition-all group-hover/link:border-primary">
              {t("mus.viewSouvenirs")}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
