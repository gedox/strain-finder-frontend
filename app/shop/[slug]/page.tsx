import { getShopMenu } from "@/lib/api";
import { notFound } from "next/navigation";
import { CAT_COLORS } from "@/lib/colors";

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
  const menuCategories = categoryOrder.filter((cat) => shop.menu[cat]?.length > 0);

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
          {shop.name}
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
      {menuCategories.length === 0 ? (
        <div style={{ padding: "40px 0", color: "rgba(240,237,230,0.3)", fontSize: 13 }}>
          No menu data available for this shop yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {menuCategories.map((cat) => {
            const colors = CAT_COLORS[cat] || CAT_COLORS.other;
            const strains = shop.menu[cat];

            return (
              <div key={cat}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 100,
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      background: colors.bg,
                      color: colors.text,
                    }}
                  >
                    {cat}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(240,237,230,0.25)" }}>
                    {strains.length} strain{strains.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {strains.map((strain) => (
                    <div
                      key={strain.id}
                      style={{
                        border: "1px solid rgba(240,237,230,0.08)",
                        borderRadius: 2,
                        padding: "14px 20px",
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        alignItems: "center",
                        gap: 12,
                        background: "rgba(255,255,255,0.02)",
                      }}
                    >
                      <div>
                        <div style={{
                          fontSize: 15,
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 700,
                          marginBottom: 4,
                        }}>
                          {strain.name}
                        </div>
                        {strain.notes && (
                          <div style={{ fontSize: 11, color: "rgba(240,237,230,0.35)" }}>
                            {strain.notes}
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {strain.price_per_gram != null ? (
                          <>
                            <div style={{ fontSize: 20, fontWeight: 500, color: "#C8F060" }}>
                              &euro;{strain.price_per_gram}
                            </div>
                            <div style={{
                              fontSize: 10,
                              color: "rgba(240,237,230,0.3)",
                              letterSpacing: "0.05em",
                            }}>
                              per gram
                            </div>
                          </>
                        ) : (
                          <div style={{ fontSize: 12, color: "rgba(240,237,230,0.2)" }}>
                            &mdash;
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
