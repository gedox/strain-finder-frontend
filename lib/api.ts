const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface StrainResult {
  strain_id: number;
  name: string;
  name_normalized: string;
  category: string;
  price_per_gram: number | null;
  notes: string | null;
  shop_slug: string;
  shop_name: string;
  shop_city: string;
}

export interface PopularStrain {
  name_normalized: string;
  category: string;
  shop_count: number;
}

export interface Shop {
  id: number;
  slug: string;
  name: string;
  address: string | null;
  city: string;
  last_menu_date: string | null;
  strain_count: number;
}

export interface ShopMenu {
  id: number;
  slug: string;
  name: string;
  address: string | null;
  city: string;
  last_menu_date: string | null;
  scraped_at: string | null;
  menu: Record<
    string,
    Array<{
      id: number;
      name: string;
      name_normalized: string;
      price_per_gram: number | null;
      notes: string | null;
    }>
  >;
}

export interface StatusInfo {
  last_scrape_at: string | null;
  shops_indexed: number;
  strains_indexed: number;
  shops_updated_last_run: number;
}

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, opts);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const searchStrains = (q: string, category?: string) => {
  const params = new URLSearchParams({ q });
  if (category) params.set("category", category);
  return apiFetch<StrainResult[]>(`/strains/search?${params}`, { cache: "no-store" });
};

export const getPopular = () =>
  apiFetch<PopularStrain[]>("/strains/popular", { next: { revalidate: 3600 } });

export const getShops = () =>
  apiFetch<Shop[]>("/coffeeshops", { next: { revalidate: 3600 } });

export const getShopMenu = (slug: string) =>
  apiFetch<ShopMenu>(`/coffeeshops/${slug}`, { next: { revalidate: 3600 } });

export const getCategories = () =>
  apiFetch<Record<string, number>>("/categories", { next: { revalidate: 3600 } });

export const getStatus = () =>
  apiFetch<StatusInfo>("/status", { next: { revalidate: 60 } });
