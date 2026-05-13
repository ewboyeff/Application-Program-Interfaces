export function PageHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-background pt-28 pb-10 lg:pt-32 lg:pb-12">
      <div className="pointer-events-none absolute inset-0 bg-gradient-ember opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <p className="eyebrow animate-float-up">— {eyebrow}</p>
        <h1
          className="mt-3 max-w-3xl font-serif text-3xl leading-tight tracking-tight animate-float-up sm:text-4xl lg:text-5xl"
          style={{ animationDelay: "80ms" }}
        >
          {title}{" "}
          {highlight ? <span className="italic text-primary">{highlight}</span> : null}
        </h1>
        {subtitle ? (
          <p
            className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground animate-float-up sm:text-base"
            style={{ animationDelay: "160ms" }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}