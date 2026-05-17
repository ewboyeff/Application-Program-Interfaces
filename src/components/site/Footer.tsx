import { Instagram, Facebook, Youtube, Send, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/i18n";

type FooterLink = { label: string; to: "/" | "/shop" | "/museums" | "/blog" | "/contact" | "/cart" | "/wishlist" | "/about" };

export function Footer() {
  const { t } = useI18n();
  return (
    <footer id="footer" className="relative border-t border-border/60 bg-background pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">

        {/* Newsletter CTA */}
        <div className="mb-12 grid grid-cols-1 items-center gap-6 rounded-2xl border border-primary/25 bg-gradient-to-br from-card to-background p-6 shadow-glow lg:grid-cols-2 lg:p-8">
          <div>
            <p className="eyebrow">{t("sec.newsletterEyebrow")}</p>
            <h3 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">
              {t("sec.newsletter")}
            </h3>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full items-center gap-2 rounded-full border border-border/70 bg-background/60 p-1.5 backdrop-blur"
          >
            <input
              type="email"
              required
              placeholder={t("sec.emailPh")}
              className="flex-1 bg-transparent px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-smooth hover:scale-[1.02]">
              {t("cta.subscribe")}
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-8 pb-10 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-primary/40 text-primary">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 10 12 3l9 7M5 10v9h14v-9M9 19v-6h6v6" />
                </svg>
              </span>
              <span className="font-serif text-lg">
                <span className="text-foreground">Museum</span>{" "}
                <span className="italic text-primary">Shop</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-8 w-8 place-items-center rounded-full border border-border/70 text-foreground/60 transition-smooth hover:border-primary hover:text-primary"
                  aria-label="Ijtimoiy tarmoq"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title={t("footer.shop")}
            links={[
              { label: t("footer.newCollection"), to: "/shop" },
              { label: t("icon.wishlist"), to: "/wishlist" },
              { label: t("icon.cart"), to: "/cart" },
            ]}
          />
          <FooterCol
            title={t("footer.museum")}
            links={[
              { label: t("footer.partnerMuseums"), to: "/museums" },
              { label: t("nav.blog"), to: "/blog" },
            ]}
          />
          <FooterCol
            title={t("footer.help")}
            links={[
              { label: t("footer.about"), to: "/about" },
              { label: t("nav.contact"), to: "/contact" },
            ]}
          />
        </div>

        <div className="divider-gold" />

        <div className="flex flex-col items-center justify-between gap-3 py-6 text-[11px] text-muted-foreground sm:flex-row">
          <p>{t("footer.rights")}</p>
          <p className="font-serif italic">{t("footer.cities")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="group inline-flex items-center gap-1.5 text-xs text-foreground/65 transition-colors hover:text-primary"
            >
              {l.label}
              <ArrowRight className="h-2.5 w-2.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
