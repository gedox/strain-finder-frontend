"use client";

import { useState } from "react";
import { CAT_COLORS } from "@/lib/colors";
import { sortByPrice, type PriceSort } from "@/lib/sort";
import PriceSortToggle from "./PriceSortToggle";

interface Strain {
  id: number;
  name: string;
  name_normalized: string;
  price_per_gram: number | null;
  notes: string | null;
}

interface Props {
  menu: Record<string, Strain[]>;
  categoryOrder: string[];
}

export default function ShopMenuView({ menu, categoryOrder }: Props) {
  const [priceSort, setPriceSort] = useState<PriceSort>("off");
  const menuCategories = categoryOrder.filter((cat) => menu[cat]?.length > 0);

  if (menuCategories.length === 0) {
    return (
      <div style={{ padding: "40px 0", color: "rgba(240,237,230,0.3)", fontSize: 13 }}>
        No menu data available for this shop yet.
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <PriceSortToggle value={priceSort} onChange={setPriceSort} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {menuCategories.map((cat) => {
          const colors = CAT_COLORS[cat] || CAT_COLORS.other;
          const strains = sortByPrice(menu[cat], priceSort);

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
    </>
  );
}
