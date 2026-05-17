import type { Product, MainType } from "@/data/products";

export const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000";

export interface ApiProduct {
  id: string;
  type: MainType;
  category: string;
  price: number;
  image_url: string;
  museum_id: string | null;
  maker: string | null;
  dimensions: string | null;
  in_stock: boolean;
  name: string;
  short: string;
  description: string;
  museum_name: string | null;
}

function mapProduct(p: ApiProduct): Product {
  const imageUrl = p.image_url?.startsWith("http") ? p.image_url : `${BASE}${p.image_url}`;
  return {
    id: p.id,
    name: p.name || "",
    type: p.type,
    category: p.category as Product["category"],
    price: p.price,
    image: imageUrl,
    museum: p.museum_name || "",
    museumId: p.museum_id || "",
    maker: p.maker || undefined,
    dimensions: p.dimensions || undefined,
    short: p.short || "",
    description: p.description || "",
  };
}

export async function fetchProducts(type?: MainType, lang = "uz"): Promise<Product[]> {
  const params = new URLSearchParams({ lang });
  if (type) params.set("type", type);
  const res = await fetch(`${BASE}/api/products?${params}`);
  if (!res.ok) throw new Error("API xatosi");
  const data: ApiProduct[] = await res.json();
  return data.map(mapProduct);
}

export async function fetchProduct(id: string, lang = "uz"): Promise<Product | null> {
  const res = await fetch(`${BASE}/api/products/${id}?lang=${lang}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("API xatosi");
  const data: ApiProduct = await res.json();
  return mapProduct(data);
}
