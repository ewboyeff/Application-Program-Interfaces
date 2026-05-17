import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, Menu, X, LogIn, UserCircle } from "lucide-react";
import { useShop } from "@/store/shop";
import { SearchOverlay } from "./SearchOverlay";
import { useI18n } from "@/i18n/i18n";
import { LangSwitcher } from "./LangSwitcher";
import { getSession } from "@/lib/auth";

type NavItem = { key: string; to: "/" | "/shop" | "/museums" | "/blog" | "/about" };

const NAV_ITEMS: NavItem[] = [
  { key: "nav.home", to: "/" },
  { key: "nav.shop", to: "/shop" },
  { key: "nav.museums", to: "/museums" },
  { key: "nav.blog", to: "/blog" },
  { key: "nav.about", to: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, wishlistCount } = useShop();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const session = getSession();
  const { t } = useI18n();

  // Force solid bg on inner pages where there is no full-bleed hero behind navbar
  const forceSolid = pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || forceSolid
          ? "backdrop-blur-xl bg-background/80 border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-primary/40 text-primary transition-smooth group-hover:bg-primary/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 10 12 3l9 7M5 10v9h14v-9M9 19v-6h6v6" />
            </svg>
          </span>
          <span className="font-serif text-xl tracking-wide">
            <span className="text-foreground">Museum</span>{" "}
            <span className="text-primary italic">Shop</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="group relative text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
            >
              {t(item.key)}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <LangSwitcher className="hidden sm:inline-flex" />
          <IconBtn label={t("icon.search")} onClick={() => setSearchOpen(true)}>
            <Search className="h-4 w-4" />
          </IconBtn>
          <IconBtn label={t("icon.wishlist")} to="/wishlist" badge={wishlistCount || undefined}>
            <Heart className="h-4 w-4" />
          </IconBtn>
          <IconBtn label={t("icon.cart")} to="/cart" badge={cartCount || undefined}>
            <ShoppingBag className="h-4 w-4" />
          </IconBtn>
          {session ? (
            <Link
              to="/profile"
              className="hidden items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/10 sm:inline-flex"
            >
              <UserCircle className="h-3 w-3" />
              {session.fullName?.split(" ")[0] || "Profil"}
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:border-primary/60 hover:text-primary sm:inline-flex"
            >
              <LogIn className="h-3 w-3" />
              Kirish
            </Link>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={t("icon.menu")}
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
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="border-b border-border/30 py-3 text-sm font-medium text-foreground/80 last:border-0 hover:text-primary"
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-4 sm:hidden">
            {session ? (
              <Link to="/profile" className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <UserCircle className="h-4 w-4" />
                {session.fullName?.split(" ")[0] || "Profil"}
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-primary">
                <LogIn className="h-4 w-4" />
                Kirish
              </Link>
            )}
            <LangSwitcher />
          </div>
        </nav>
      </div>
    </header>
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function IconBtn({
  children,
  label,
  badge,
  to,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  badge?: number;
  to?: "/cart" | "/wishlist";
  onClick?: () => void;
}) {
  const cls =
    "relative grid h-10 w-10 place-items-center rounded-full border border-border/60 text-foreground/80 transition-smooth hover:border-primary hover:bg-primary/5 hover:text-primary";
  const inner = (
    <>
      {children}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
          {badge}
        </span>
      ) : null}
    </>
  );
  if (to) {
    return (
      <Link to={to} aria-label={label} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button aria-label={label} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}