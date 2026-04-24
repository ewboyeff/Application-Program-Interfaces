import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Frontend-only cart + wishlist store backed by localStorage.
 * Cross-tab sync via the storage event.
 */

const CART_KEY = "ms_cart_v1";
const WISH_KEY = "ms_wishlist_v1";

export type CartItem = { id: string; qty: number };

type ShopContextValue = {
  cart: CartItem[];
  cartCount: number;
  wishlist: string[];
  wishlistCount: number;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
};

const ShopContext = createContext<ShopContextValue | null>(null);

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  return safeParse<T>(window.localStorage.getItem(key), fallback);
}

function writeLocal(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (avoid SSR mismatch)
  useEffect(() => {
    setCart(readLocal<CartItem[]>(CART_KEY, []));
    setWishlist(readLocal<string[]>(WISH_KEY, []));
    setHydrated(true);
  }, []);

  // Persist + cross-tab sync
  useEffect(() => {
    if (!hydrated) return;
    writeLocal(CART_KEY, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeLocal(WISH_KEY, wishlist);
  }, [wishlist, hydrated]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setCart(safeParse<CartItem[]>(e.newValue, []));
      if (e.key === WISH_KEY) setWishlist(safeParse<string[]>(e.newValue, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, qty: Math.min(99, i.qty + qty) } : i,
        );
      }
      return [...prev, { id, qty: Math.max(1, qty) }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, qty) } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const inWishlist = useCallback(
    (id: string) => wishlist.includes(id),
    [wishlist],
  );

  const value = useMemo<ShopContextValue>(
    () => ({
      cart,
      cartCount: cart.reduce((acc, i) => acc + i.qty, 0),
      wishlist,
      wishlistCount: wishlist.length,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      toggleWishlist,
      inWishlist,
    }),
    [
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      toggleWishlist,
      inWishlist,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    // Safe SSR fallback — rendered tree never mutates
    return {
      cart: [],
      cartCount: 0,
      wishlist: [],
      wishlistCount: 0,
      addToCart: () => {},
      removeFromCart: () => {},
      setQty: () => {},
      clearCart: () => {},
      toggleWishlist: () => {},
      inWishlist: () => false,
    };
  }
  return ctx;
}