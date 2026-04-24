import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Bosh sahifa", href: "#home" },
  { label: "Kolleksiya", href: "#collections" },
  { label: "Muzeylar", href: "#story" },
  { label: "Blog", href: "#featured" },
  { label: "Aloqa", href: "#footer" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <a href="#home" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-primary/40 text-primary transition-smooth group-hover:bg-primary/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 10 12 3l9 7M5 10v9h14v-9M9 19v-6h6v6" />
            </svg>
          </span>
          <span className="font-serif text-xl tracking-wide">
            <span className="text-foreground">Museum</span>{" "}
            <span className="text-primary italic">Shop</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <IconBtn label="Qidirish"><Search className="h-4 w-4" /></IconBtn>
          <IconBtn label="Sevimlilar"><Heart className="h-4 w-4" /></IconBtn>
          <IconBtn label="Savat" badge={2}><ShoppingBag className="h-4 w-4" /></IconBtn>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menyu"
            className="ml-1 grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/80 transition-smooth hover:border-primary hover:text-primary lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-border/30 py-3 text-sm font-medium text-foreground/80 last:border-0 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function IconBtn({
  children,
  label,
  badge,
}: {
  children: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      aria-label={label}
      className="relative grid h-10 w-10 place-items-center rounded-full border border-border/60 text-foreground/80 transition-smooth hover:border-primary hover:bg-primary/5 hover:text-primary"
    >
      {children}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
          {badge}
        </span>
      ) : null}
    </button>
  );
}