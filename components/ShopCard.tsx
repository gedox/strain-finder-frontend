"use client";

import type { Shop } from "@/lib/api";
import { formatShopName } from "@/lib/format";

interface Props {
  shop: Shop;
}

export default function ShopCard({ shop }: Props) {
  return (
    <a href={`/shop/${shop.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="shop-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{
              fontSize: 16,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              marginBottom: 6,
            }}>
              {formatShopName(shop.name)}
            </div>
            {shop.address && (
              <div style={{ fontSize: 12, color: "rgba(240,237,230,0.4)" }}>
                {shop.address}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: "#C8F060" }}>
              {shop.strain_count}
            </div>
            <div style={{ fontSize: 10, color: "rgba(240,237,230,0.3)" }}>
              strains
            </div>
          </div>
        </div>
        {shop.last_menu_date && (
          <div style={{ marginTop: 8, fontSize: 11, color: "rgba(240,237,230,0.25)" }}>
            Menu: {shop.last_menu_date}
          </div>
        )}
      </div>
    </a>
  );
}
