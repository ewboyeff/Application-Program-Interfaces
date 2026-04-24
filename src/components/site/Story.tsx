import { ArrowRight } from "lucide-react";
import { useReveal } from "./useReveal";
import museum from "@/assets/story-museum.jpg";

export function Story() {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      id="story"
      ref={ref}
      className="relative overflow-hidden bg-background py-28 lg:py-36"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        {/* Image */}
        <div className="reveal relative">
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-card">
            <img
              src={museum}
              alt="O'zbekiston muzeyi interyeri"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-transparent" />
          </div>

          {/* Floating quote card */}
          <div className="absolute -bottom-8 -right-4 hidden max-w-xs rounded-2xl border border-primary/30 bg-card/90 p-6 shadow-glow backdrop-blur-xl sm:block lg:-right-8">
            <p className="font-serif text-base italic leading-relaxed text-foreground">
              "Tarix — bu zamon ichidagi nafas. Biz uni qo'lga olamiz."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-primary">
                Kuratorlar jamoasi
              </span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="reveal">
          <p className="eyebrow">— Bizning hikoyamiz</p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Har bir buyum — <br />
            <span className="italic text-primary">tarix</span>.
          </h2>
          <div className="my-8 divider-gold" />
          <p className="text-base leading-relaxed text-foreground/75">
            Bu suvenirlar O'zbekiston muzeylaridagi haqiqiy eksponatlardan
            ilhomlangan. Toshkent, Samarqand, Buxoro va Xivaning eng nodir
            ashyolari — kuratorlar nazoratida zamonaviy ustalar tomonidan
            qayta tug'iladi.
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Har bir buyum o'z sertifikati, kelib chiqish hikoyasi va muzey
            arxividagi raqami bilan birga keladi. Siz uyga oddiy suvenir emas
            — asrlar nafasini olib kelasiz.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/50 pt-8">
            {[
              { v: "100%", l: "Qo'lda yasalgan" },
              { v: "14", l: "Muzey hamkor" },
              { v: "Asl", l: "Sertifikatlangan" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-serif text-2xl text-primary">{s.v}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          <a
            href="#collections"
            className="group mt-10 inline-flex items-center gap-3 text-sm font-medium text-primary"
          >
            <span className="border-b border-primary/40 pb-1 transition-all group-hover:border-primary">
              Kolleksiyaga o'tish
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}