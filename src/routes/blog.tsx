import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, Users, Calendar } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FAIRS, MASTERCLASSES, ACTIVITIES, type Fair, type Masterclass, type Activity } from "@/data/events";
import { useI18n } from "@/i18n/i18n";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Museum Shop" },
      { name: "description", content: "O'zbek madaniyati, muzeylari, hunarmandchiligi va tarixi haqida hikoyalar." },
    ],
  }),
  component: BlogPage,
});


function BlogPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Yarmarkalar */}
      <section className="bg-background pb-14" style={{ paddingTop: "calc(80px + 2.5rem)" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="mb-8 font-serif text-2xl text-foreground sm:text-3xl">Yarmarkalar</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FAIRS.map((f) => <FairCard key={f.id} fair={f} />)}
          </div>
        </div>
      </section>

      {/* Mahorat darslari */}
      <section className="border-t border-border/40 bg-background py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="mb-8 font-serif text-2xl text-foreground sm:text-3xl">Mahorat darslari</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {MASTERCLASSES.map((m) => <MasterclassCard key={m.id} item={m} />)}
          </div>
        </div>
      </section>

      {/* Tadbirlar */}
      <section className="border-t border-border/40 bg-background py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="mb-8 font-serif text-2xl text-foreground sm:text-3xl">Tadbirlar</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ACTIVITIES.map((a) => <ActivityCard key={a.id} item={a} />)}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ---- Fair card ---- */

function FairCard({ fair }: { fair: Fair }) {
  const { t } = useI18n();
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-smooth hover:border-primary/50 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={fair.image} alt={fair.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-primary/40 bg-background/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-primary backdrop-blur-md">
          {fair.city}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{fair.date}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{fair.location}</span>
        </div>
        <h3 className="mt-2 font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-primary">{fair.title}</h3>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">{fair.short}</p>
        <button className="mt-4 inline-flex items-center gap-1.5 self-start text-xs font-medium text-primary">
          <span className="border-b border-primary/40 pb-0.5 transition-all group-hover:border-primary">{t("event.details")}</span>
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </article>
  );
}

/* ---- Masterclass card ---- */

function MasterclassCard({ item }: { item: Masterclass }) {
  const { t } = useI18n();
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-smooth hover:border-primary/50 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-foreground/90 backdrop-blur-md">
          {item.craft}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-background/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-primary backdrop-blur-md">
          <Users className="h-2.5 w-2.5" />{item.spots} {t("event.spots")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{item.date}</span>
          <span>·</span>
          <span>{item.duration}</span>
        </div>
        <h3 className="mt-2 font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-primary">{item.title}</h3>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">{item.short}</p>
        <dl className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border/50 bg-background/40 px-3 py-2">
            <dt className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{t("event.instructor")}</dt>
            <dd className="mt-0.5 text-xs font-medium text-foreground">{item.instructor}</dd>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/40 px-3 py-2">
            <dt className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{t("event.level")}</dt>
            <dd className="mt-0.5 text-xs font-medium text-foreground">{item.level}</dd>
          </div>
        </dl>
        <button className="mt-4 w-full rounded-full bg-gradient-gold py-2 text-xs font-semibold text-primary-foreground transition-smooth hover:scale-[1.02]">
          {t("event.register")}
        </button>
      </div>
    </article>
  );
}

/* ---- Activity card ---- */

function ActivityCard({ item }: { item: Activity }) {
  const { t } = useI18n();
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-smooth hover:border-primary/50 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-foreground/90 backdrop-blur-md">
          {item.type}
        </span>
        {item.free && (
          <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-primary-foreground">
            {t("event.free")}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{item.date}</span>
        </div>
        <h3 className="mt-2 font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-primary">{item.title}</h3>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">{item.short}</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 text-primary" />{item.location}
        </div>
        <button className="mt-4 inline-flex items-center gap-1.5 self-start text-xs font-medium text-primary">
          <span className="border-b border-primary/40 pb-0.5 transition-all group-hover:border-primary">{t("event.details")}</span>
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </article>
  );
}
