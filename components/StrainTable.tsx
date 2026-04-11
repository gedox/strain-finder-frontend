"use client";

import type { StrainResult } from "@/lib/api";
import CategoryPill from "./CategoryPill";
import { formatShopName } from "@/lib/format";

interface Props {
  results: StrainResult[];
  query: string;
}

export default function StrainTable({ results, query }: Props) {
  if (results.length === 0) {
    return (
      <div style={{ padding: "40px 0", color: "rgba(240,237,230,0.3)", fontSize: 13 }}>
        No shops found stocking this strain right now.
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 60 }}>
      <div style={{
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(240,237,230,0.3)",
        marginBottom: 16,
      }}>
        {results.length} shop{results.length !== 1 ? "s" : ""} currently stocking &ldquo;{query}&rdquo;
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {results.map((r, i) => (
          <a
            key={`${r.strain_id}-${r.shop_slug}`}
            href={`/shop/${r.shop_slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className="result-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 17,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                  }}>
                    {formatShopName(r.shop_name)}
                  </span>
                  <CategoryPill category={r.category} />
                </div>
                <div style={{
                  fontSize: 12,
                  color: "rgba(240,237,230,0.4)",
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                }}>
                  <span>{r.name}</span>
                  {r.notes && <span>{r.notes}</span>}
                  {r.last_scraped_at && (
                    <span style={{ color: "rgba(200,240,96,0.5)" }}>
                      Updated {new Date(r.last_scraped_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                {r.price_per_gram != null ? (
                  <>
                    <div style={{ fontSize: 22, fontWeight: 500, color: "#C8F060" }}>
                      &euro;{r.price_per_gram}
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
          </a>
        ))}
      </div>
    </div>
  );
}
