import { getShopMenu } from "@/lib/api";
import { notFound } from "next/navigation";
import { formatShopName } from "@/lib/format";
import ShopMenuView from "@/components/ShopMenuView";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShopPage({ params }: PageProps) {
  const { slug } = await params;
  let shop;
  try {
    shop = await getShopMenu(slug);
  } catch {
    notFound();
  }

  if (!shop) notFound();

  const categoryOrder = ["sativa", "indica", "hybrid", "hash", "edible", "pre-roll", "other"];

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <a
            href="/"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(200,240,96,0.7)",
              textDecoration: "none",
            }}
          >
            &larr; Search
          </a>
          <span style={{ width: 32, height: 1, background: "rgba(200,240,96,0.3)", display: "inline-block" }} />
          <a
            href="/browse"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(240,237,230,0.3)",
              textDecoration: "none",
            }}
          >
            Browse
          </a>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(28px, 4vw, 52px)",
          fontWeight: 700,
          marginBottom: 8,
        }}>
          {formatShopName(shop.name)}
        </h1>

        {shop.address && (
          <p style={{ fontSize: 13, color: "rgba(240,237,230,0.4)", marginBottom: 4 }}>
            {shop.address}
          </p>
        )}

        <div style={{
          fontSize: 12,
          color: "rgba(240,237,230,0.3)",
          display: "flex",
          gap: 16,
          marginTop: 8,
        }}>
          {shop.last_menu_date && <span>Menu: {shop.last_menu_date}</span>}
          {shop.scraped_at && (
            <span>Scraped: {new Date(shop.scraped_at).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {/* Menu by category */}
      <ShopMenuView menu={shop.menu} categoryOrder={categoryOrder} />

      {/* Footer */}
      <div style={{
        marginTop: 60,
        paddingTop: 24,
        borderTop: "1px solid rgba(240,237,230,0.06)",
        fontSize: 11,
        color: "rgba(240,237,230,0.2)",
        letterSpacing: "0.05em",
      }}>
        Data via Amsterdam Coffeeshop Menus community
      </div>
    </>
  );
}
