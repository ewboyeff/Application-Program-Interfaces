import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useReveal } from "./useReveal";
import { useI18n } from "@/i18n/i18n";
import museum from "@/assets/story-museum.jpg";

export function Story() {
  const ref = useReveal<HTMLElement>();
  const { t } = useI18n();
  return (
    <section
      id="story"
      ref={ref}
      className="relative overflow-hidden bg-background py-16 sm:py-28 lg:py-36"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:gap-14 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        {/* Image */}
        <div className="reveal relative">
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-card">
            <img
              src={museum}
              alt="O'zbekiston muzeyi interyeri"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover object-center transition-transform duration-[2000ms] ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-transparent" />
          </div>

          {/* Floating quote card */}
          <div className="absolute -bottom-8 -right-4 hidden max-w-xs rounded-2xl border border-primary/30 bg-card/90 p-6 shadow-glow backdrop-blur-xl sm:block lg:-right-8">
            <p className="font-serif text-base italic leading-relaxed text-foreground">
              {t("story.quote")}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-primary">
                {t("story.curators")}
              </span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="reveal">
          <p className="eyebrow">{t("sec.storyEyebrow")}</p>
          <h2 className="mt-4 font-serif text-3xl leading-[1.1] tracking-tight sm:text-4xl lg:text-6xl">
            {t("story.title1")} <br />
            <span className="italic text-primary">{t("story.titleHighlight")}</span>.
          </h2>
          <div className="my-8 divider-gold" />
          <p className="text-base leading-relaxed text-foreground/75">
            {t("story.p1")}
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {t("story.p2")}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border/50 pt-6 sm:mt-10 sm:gap-6 sm:pt-8">
            {[
              { v: "100%", l: t("story.stat1") },
              { v: "14", l: t("story.stat2") },
              { v: "Asl", l: t("story.stat3") },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-serif text-2xl text-primary">{s.v}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/museums"
            className="group mt-10 inline-flex items-center gap-3 text-sm font-medium text-primary"
          >
            <span className="border-b border-primary/40 pb-1 transition-all group-hover:border-primary">
              {t("cta.viewMuseums")}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}