export type PriceSort = "off" | "asc" | "desc";

export function sortByPrice<T extends { price_per_gram: number | null }>(
  items: T[],
  mode: PriceSort
): T[] {
  if (mode === "off") return items;
  const sign = mode === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    if (a.price_per_gram == null && b.price_per_gram == null) return 0;
    if (a.price_per_gram == null) return 1;
    if (b.price_per_gram == null) return -1;
    return (a.price_per_gram - b.price_per_gram) * sign;
  });
}
