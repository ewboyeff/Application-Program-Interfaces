import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BLOG_POSTS, getPost } from "@/data/blog";
import { useI18n, useBlogT } from "@/i18n/i18n";

export const Route = createFileRoute("/blog/$id")({
  loader: ({ params }) => {
    const post = getPost(params.id);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Museum Shop` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:image", content: loaderData.post.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 pt-40 pb-32 text-center">
        <p className="eyebrow">— 404</p>
        <h1 className="mt-4 font-serif text-5xl">Maqola topilmadi</h1>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Blogga qaytish
        </Link>
      </div>
      <Footer />
    </main>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const others = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);
  const { t } = useI18n();
  const tr = useBlogT(post);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 lg:pt-40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10">
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            {t("blog.backToBlog")}
          </Link>

          <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-primary">
            <span>{tr.category}</span>
            <span>·</span>
            <span className="text-muted-foreground">{tr.date}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" /> {tr.readTime}
            </span>
          </div>
          <h1 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {tr.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {tr.excerpt}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-10">
          <div className="overflow-hidden rounded-2xl border border-border shadow-card">
            <img
              src={post.image}
              alt={tr.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10">
          <article className="space-y-6 text-base leading-[1.85] text-foreground/85 sm:text-lg">
            {tr.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </article>

          <div className="my-16 divider-gold" />

          <p className="font-serif text-2xl italic text-primary">
            {t("blog.quote")}
          </p>
        </div>
      </section>

      {/* More posts */}
      <section className="border-t border-border/50 bg-background py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="eyebrow">{t("blog.moreEyebrow")}</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            {t("blog.moreTitle1")} <span className="italic text-primary">{t("blog.moreTitle2")}</span>
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {others.map((p) => (
              <OtherPostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function OtherPostCard({ post }: { post: typeof BLOG_POSTS[number] }) {
  const tr = useBlogT(post);
  return (
    <Link to="/blog/$id" params={{ id: post.id }} className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-smooth hover:border-primary/50 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={post.image} alt={tr.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
      </div>
      <div className="p-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary">{tr.category}</div>
        <h3 className="mt-2 line-clamp-2 font-serif text-lg text-foreground transition-colors group-hover:text-primary">{tr.title}</h3>
      </div>
    </Link>
  );
}