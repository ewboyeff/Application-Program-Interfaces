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
    <section className="relative overflow-hidden border-b border-border/50 bg-background pt-32 pb-16 lg:pt-40 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-ember opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <p className="eyebrow animate-float-up">— {eyebrow}</p>
        <h1
          className="mt-5 max-w-4xl font-serif text-5xl leading-[1.05] tracking-tight animate-float-up sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          {title}{" "}
          {highlight ? <span className="italic text-primary">{highlight}</span> : null}
        </h1>
        {subtitle ? (
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground animate-float-up sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}