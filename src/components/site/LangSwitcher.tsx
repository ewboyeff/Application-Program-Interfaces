import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { LANGS, useI18n, type Lang } from "@/i18n/i18n";

export function LangSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LANGS.find((l) => l.code === lang);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70 backdrop-blur transition-colors hover:border-primary/60 hover:text-primary"
      >
        {current?.label}
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[80px] overflow-hidden rounded-xl border border-border/60 bg-background/95 shadow-card backdrop-blur-xl">
          {LANGS.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                onClick={() => { setLang(l.code as Lang); setOpen(false); }}
                className={`flex w-full items-center px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:bg-card hover:text-foreground"
                }`}
              >
                {l.label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
