import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, MapPin, Users, Calendar } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { BLOG_POSTS, type BlogPost } from "@/data/blog";
import { FAIRS, MASTERCLASSES, ACTIVITIES, type Fair, type Masterclass, type Activity } from "@/data/events";
import { useI18n, useBlogT } from "@/i18n/i18n";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Museum Shop" },
      { name: "description", content: "O'zbek madaniyati, muzeylari, hunarmandchiligi va tarixi haqida hikoyalar." },
    ],
  }),
  component: BlogPage,
});

function SectionHead({ eyebrow, t1, t2 }: { eyebrow: string; t1: string; t2: string }) {
  return (
    <div className="mb-8">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-2xl leading-tight tracking-tight sm:text-3xl">
        {t1} <span className="italic text-primary">{t2}</span>
      </h2>
    </div>
  );
}

function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <PageHeader
        eyebrow={t("blog.headerEyebrow")}
        title={t("blog.headerTitle")}
        highlight={t("blog.headerHighlight")}
        subtitle={t("blog.headerSub")}
      />

      {/* Blog posts */}
      <section className="bg-background pt-8 pb-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <FeaturedCard post={featured} />
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <SmallCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Yarmarkalar */}
      <section className="border-t border-border/40 bg-background py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHead eyebrow={t("blog.fairs.eyebrow")} t1={t("blog.fairs.title1")} t2={t("blog.fairs.title2")} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FAIRS.map((f) => <FairCard key={f.id} fair={f} />)}
          </div>
        </div>
      </section>

      {/* Mahorat darslari */}
      <section className="border-t border-border/40 bg-background py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHead eyebrow={t("blog.masterclass.eyebrow")} t1={t("blog.masterclass.title1")} t2={t("blog.masterclass.title2")} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {MASTERCLASSES.map((m) => <MasterclassCard key={m.id} item={m} />)}
          </div>
        </div>
      </section>

      {/* Tadbirlar */}
      <section className="border-t border-border/40 bg-background py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHead eyebrow={t("blog.events.eyebrow")} t1={t("blog.events.title1")} t2={t("blog.events.title2")} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ACTIVITIES.map((a) => <ActivityCard key={a.id} item={a} />)}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ---- Blog cards ---- */

function FeaturedCard({ post }: { post: BlogPost }) {
  const tr = useBlogT(post);
  const { t } = useI18n();
  return (
    <Link
      to="/blog/$id"
      params={{ id: post.id }}
      className="group relative grid grid-cols-1 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-smooth hover:border-primary/50 lg:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
        <img src={post.image} alt={tr.title} className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>
      <div className="flex flex-col justify-center p-7 lg:p-10">
        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-primary">
          <span>{tr.category}</span><span>·</span>
          <span className="text-muted-foreground">{tr.date}</span><span>·</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" />{tr.readTime}</span>
        </div>
        <h2 className="mt-4 font-serif text-2xl leading-snug text-foreground transition-colors group-hover:text-primary sm:text-3xl lg:text-4xl">{tr.title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">{tr.excerpt}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
          <span className="border-b border-primary/40 pb-0.5">{t("blog.read")}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

function SmallCard({ post }: { post: BlogPost }) {
  const tr = useBlogT(post);
  return (
    <Link to="/blog/$id" params={{ id: post.id }} className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-smooth hover:border-primary/50 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={post.image} alt={tr.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.22em] text-foreground/90 backdrop-blur-md">{tr.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>{tr.date}</span><span>·</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{tr.readTime}</span>
        </div>
        <h3 className="mt-2 line-clamp-2 font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-primary">{tr.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">{tr.excerpt}</p>
      </div>
    </Link>
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
