import { LANGS, useI18n, type Lang } from "@/i18n/i18n";

export function LangSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className={`inline-flex items-center rounded-full border border-border/60 bg-background/40 px-1 py-1 text-[11px] font-medium tracking-[0.18em] backdrop-blur ${className}`}
    >
      {LANGS.map((l, i) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
            aria-pressed={active}
            className={`relative rounded-full px-2.5 py-1 transition-all duration-300 ${
              active
                ? "bg-gradient-gold text-primary-foreground shadow-glow"
                : "text-foreground/60 hover:text-primary"
            } ${i > 0 ? "ml-0.5" : ""}`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}