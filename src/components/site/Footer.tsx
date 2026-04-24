import { Instagram, Facebook, Youtube, Send, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative border-t border-border/60 bg-background pt-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* CTA strip */}
        <div className="mb-20 grid grid-cols-1 items-center gap-10 rounded-2xl border border-primary/30 bg-gradient-to-br from-card to-background p-8 shadow-glow lg:grid-cols-2 lg:p-12">
          <div>
            <p className="eyebrow">— Yangiliklar</p>
            <h3 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
              Yangi <span className="italic text-primary">eksponatlar</span> haqida birinchi bo'lib biling.
            </h3>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full items-center gap-2 rounded-full border border-border/70 bg-background/60 p-2 backdrop-blur"
          >
            <input
              type="email"
              required
              placeholder="E-pochta manzilingiz"
              className="flex-1 bg-transparent px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-3 text-sm font-semibold text-primary-foreground transition-smooth hover:scale-[1.02]">
              Obuna
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-10 pb-14 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <a href="#home" className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-primary/40 text-primary">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 10 12 3l9 7M5 10v9h14v-9M9 19v-6h6v6" />
                </svg>
              </span>
              <span className="font-serif text-xl">
                <span className="text-foreground">Museum</span>{" "}
                <span className="text-primary italic">Shop</span>
              </span>
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              O'zbekistonning tarixiy merosini uyingizga olib keluvchi noyob
              suvenirlar do'koni.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border/70 text-foreground/70 transition-smooth hover:border-primary hover:text-primary"
                  aria-label="Ijtimoiy tarmoq"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Do'kon"
            links={["Yangi kolleksiya", "Keramika", "Zargarlik", "Haykallar", "Milliy naqshlar"]}
          />
          <FooterCol
            title="Muzey"
            links={["Bizning hikoya", "Hamkor muzeylar", "Kuratorlar", "Sertifikat", "Press"]}
          />
          <FooterCol
            title="Yordam"
            links={["Aloqa", "Yetkazib berish", "Qaytarish", "FAQ", "Maxfiylik"]}
          />
        </div>

        <div className="divider-gold" />

        <div className="flex flex-col items-center justify-between gap-4 py-8 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Museum Shop Uzbekistan. Barcha huquqlar himoyalangan.</p>
          <p className="font-serif italic">
            Toshkent · Samarqand · Buxoro · Xiva
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-serif text-sm uppercase tracking-[0.22em] text-primary">
        {title}
      </h4>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="group inline-flex items-center gap-1.5 text-sm text-foreground/70 transition-colors hover:text-primary"
            >
              {l}
              <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}