import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n/i18n";
import hero1 from "@/assets/hero-statue.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";

const SLIDES = [
  {
    image: hero1,
    eyebrow: "Buxoro · Po-i-Kalon",
    title: "Shahar — Tarix Nafasi",
    sub: "O'zbekiston qadimiy shaharlari va muzeylaridan ilhomlangan kolleksiya",
  },
  {
    image: hero2,
    eyebrow: "Rishton keramikasi · XIX asr",
    title: "Ko'k naqsh — Abadiy hikoya",
    sub: "Qo'lda chizilgan an'anaviy laganlar — Rishton ustalari merosidan",
  },
  {
    image: hero3,
    eyebrow: "Samarqand keramikasi · XV asr",
    title: "Naqshlar tilidagi rivoyat",
    sub: "Qizil, ko'k va sariq ranglarning saroyona uyg'unligi",
  },
  {
    image: hero4,
    eyebrow: "Buxoro zargarligi · XIX asr",
    title: "Oltinda muhrlangan afsona",
    sub: "Filigran oltin va marjon — amir saroyi xazinasidan ilhom",
  },
];

export function Hero() {
  const [active, setActive] = useState(0);
  const { t } = useI18n();

  const go = useCallback((dir: number) => {
    setActive((i) => (i + dir + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden bg-background pt-20"
    >
      {/* Slides */}
      <div className="absolute inset-0 -z-10">
        {SLIDES.map((s, i) => (
          <div
            key={s.image}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className={`h-full w-full object-contain object-right p-6 sm:p-10 lg:p-14 ${
                i === active ? "animate-ken-burns" : ""
              }`}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </div>
        ))}
      </div>

      {/* Layered overlays */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-vignette" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-ember" />
      <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-full max-w-3xl bg-gradient-to-r from-background via-background/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-fade-bottom" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p key={`eb-${active}`} className="eyebrow animate-float-up">
            <span className="mr-3 inline-block h-px w-8 translate-y-[-4px] bg-primary align-middle" />
            {SLIDES[active].eyebrow}
          </p>

          <h1
            key={`t-${active}`}
            className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-foreground animate-float-up sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
          >
            {SLIDES[active].title.split(" — ").map((part, idx, arr) => (
              <span key={idx}>
                {idx === arr.length - 1 && arr.length > 1 ? (
                  <span className="italic text-primary">{part}</span>
                ) : (
                  part
                )}
                {idx < arr.length - 1 ? <span className="text-primary"> — </span> : null}
              </span>
            ))}
          </h1>

          <p
            key={`s-${active}`}
            className="mt-7 max-w-xl text-base leading-relaxed text-foreground/75 animate-float-up sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            {SLIDES[active].sub}
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-4 animate-float-up"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-gold px-7 py-4 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.02] hover:shadow-[0_0_50px_-8px_oklch(0.78_0.16_65/0.6)]"
            >
              {t("cta.viewCollection")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-4 text-sm font-medium text-foreground/80 transition-smooth hover:border-primary hover:text-primary"
            >
              {t("cta.readStory")}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 flex items-center gap-10 border-t border-border/50 pt-6">
            {[
              { v: "120+", l: t("hero.stat.exhibits") },
              { v: "14", l: t("hero.stat.museums") },
              { v: "1989", l: t("hero.stat.founded") },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-serif text-2xl text-primary">{s.v}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slider controls */}
      <div className="absolute bottom-10 right-6 z-10 flex items-center gap-3 lg:right-10">
        <button
          onClick={() => go(-1)}
          aria-label={t("hero.prev")}
          className="grid h-11 w-11 place-items-center rounded-full border border-border/70 bg-background/40 text-foreground/80 backdrop-blur transition-smooth hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slayd ${i + 1}`}
              className={`h-px transition-all duration-500 ${
                i === active ? "w-10 bg-primary" : "w-5 bg-foreground/30"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          aria-label={t("hero.next")}
          className="grid h-11 w-11 place-items-center rounded-full border border-border/70 bg-background/40 text-foreground/80 backdrop-blur transition-smooth hover:border-primary hover:text-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}