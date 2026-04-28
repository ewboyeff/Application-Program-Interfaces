import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { BLOG_POSTS, type BlogPost } from "@/data/blog";
import { useI18n, useBlogT } from "@/i18n/i18n";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Museum Shop" },
      {
        name: "description",
        content:
          "O'zbek madaniyati, muzeylari, hunarmandchiligi va tarixi haqida hikoyalar.",
      },
      { property: "og:title", content: "Blog — Museum Shop" },
      { property: "og:description", content: "O'zbek madaniyati va tarixi haqida hikoyalar." },
    ],
  }),
  component: BlogPage,
});

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

      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <FeaturedCard post={featured} />

          {/* Grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <SmallCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

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
        <img src={post.image} alt={tr.title} className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
      </div>
      <div className="flex flex-col justify-center p-8 lg:p-12">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-primary">
          <span>{tr.category}</span><span>·</span>
          <span className="text-muted-foreground">{tr.date}</span><span>·</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" />{tr.readTime}</span>
        </div>
        <h2 className="mt-5 font-serif text-3xl leading-tight text-foreground transition-colors group-hover:text-primary sm:text-4xl lg:text-5xl">{tr.title}</h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">{tr.excerpt}</p>
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary">
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
        <img src={post.image} alt={tr.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
        <span className="absolute left-4 top-4 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.22em] text-foreground/90 backdrop-blur-md">{tr.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>{tr.date}</span><span>·</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{tr.readTime}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 font-serif text-xl leading-snug text-foreground transition-colors group-hover:text-primary">{tr.title}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{tr.excerpt}</p>
      </div>
    </Link>
  );
}