import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { MUSEUMS, type Museum } from "@/data/museums";
import { useI18n, useMuseumT } from "@/i18n/i18n";

export const Route = createFileRoute("/museums")({
  head: () => ({
    meta: [
      { title: "Muzeylar — Museum Shop" },
      {
        name: "description",
        content:
          "O'zbekiston muzeylari: Amir Temur, State Museum of History, Savitsky va Bukhara Ark.",
      },
      { property: "og:title", content: "Muzeylar — Museum Shop" },
      {
        property: "og:description",
        content: "O'zbekiston muzeylari va ularning suvenir kolleksiyalari.",
      },
    ],
  }),
  component: MuseumsPage,
});

function MuseumsPage() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <PageHeader
        eyebrow={t("mus.headerEyebrow")}
        title={t("mus.headerTitle")}
        highlight={t("mus.headerHighlight")}
        subtitle={t("mus.headerSub")}
      />

      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:px-10">
          {MUSEUMS.map((m) => (
            <MuseumCard key={m.id} m={m} />
          ))}
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
      <div className="relative aspect-[16/10] overflow-hidden">
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
      </div>
      <div className="p-7">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-primary">
          <MapPin className="h-3 w-3" />
          {tr.city} · {t("mus.founded")}: {tr.founded}
        </div>
        <h3 className="mt-3 font-serif text-2xl text-foreground transition-colors group-hover:text-primary sm:text-3xl">
          {tr.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {tr.description}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-5">
          <div className="text-xs text-muted-foreground">
            <span className="font-serif text-primary">{m.exhibits}</span> {t("mus.exhibits")}
          </div>
          <Link to="/shop" className="group/link inline-flex items-center gap-2 text-sm font-medium text-primary">
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