import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { PRODUCTS, formatPrice } from "@/data/products";
import { useI18n } from "@/i18n/i18n";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.museum.toLowerCase().includes(s),
    ).slice(0, 8);
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-background/95 backdrop-blur-2xl animate-float-up">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <p className="eyebrow">{t("search.eyebrow")}</p>
          <button
            onClick={onClose}
            aria-label={t("search.close")}
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/80 transition-smooth hover:border-primary hover:text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 flex items-center gap-4 border-b border-border/60 pb-4">
          <Search className="h-5 w-5 text-primary" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent font-serif text-2xl text-foreground outline-none placeholder:text-muted-foreground sm:text-3xl"
          />
        </div>

        <div className="mt-8 flex-1 overflow-y-auto">
          {q.trim() === "" ? (
            <div className="text-sm text-muted-foreground">
              {t("search.hint")}
            </div>
          ) : results.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {t("search.empty")}
            </div>
          ) : (
            <ul className="divide-y divide-border/50">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    onClick={onClose}
                    className="group flex items-center gap-4 py-4 transition-colors hover:bg-card/40"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-serif text-base text-foreground transition-colors group-hover:text-primary">
                        {p.name}
                      </div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {p.category} · {p.museum}
                      </div>
                    </div>
                    <div className="font-serif text-primary">
                      {formatPrice(p.price)}{" "}
                      <span className="text-xs text-muted-foreground">{t("common.currency")}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}