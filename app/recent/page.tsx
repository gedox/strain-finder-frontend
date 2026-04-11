"use client";

import { useEffect, useState } from "react";
import { getRecentMenus } from "@/lib/api";
import type { RecentMenusResponse } from "@/lib/api";
import { formatShopName } from "@/lib/format";
import LoadingBar from "@/components/LoadingBar";

export default function RecentMenusPage() {
  const [data, setData] = useState<RecentMenusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRecentMenus(5)
      .then((d) => setData(d))
      .catch((e) => setError(e?.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const menus = data?.menus ?? [];
  const referenceTime = data?.reference_time
    ? new Date(data.reference_time)
    : null;
  const windowStart = data?.window_start ? new Date(data.window_start) : null;

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
          <span style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(240,237,230,0.3)",
          }}>
            Recent Menus
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          marginBottom: 16,
        }}>
          Freshly updated.<br />
          <span style={{ color: "#C8F060" }}>Last 5 days.</span>
        </h1>

        <p style={{ fontSize: 13, color: "rgba(240,237,230,0.4)", lineHeight: 1.6, maxWidth: 500 }}>
          Coffeeshops whose menus were scraped in the last five days.
          {referenceTime && windowStart && (
            <>
              {" "}
              Window:{" "}
              <span style={{ color: "rgba(200,240,96,0.7)" }}>
                {windowStart.toLocaleDateString()} &rarr;{" "}
                {referenceTime.toLocaleDateString()}
              </span>
              .
            </>
          )}
        </p>
      </div>

      {loading && <LoadingBar />}

      {error && (
        <div style={{ padding: "40px 0", color: "rgba(240,120,120,0.7)", fontSize: 13 }}>
          Couldn&rsquo;t load recent menus: {error}
        </div>
      )}

      {!loading && !error && menus.length === 0 && (
        <div style={{ padding: "40px 0", color: "rgba(240,237,230,0.3)", fontSize: 13 }}>
          No menus updated in this window yet.
        </div>
      )}

      {!loading && menus.length > 0 && (
        <div style={{ marginBottom: 60 }}>
          <div style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(240,237,230,0.3)",
            marginBottom: 16,
          }}>
            {menus.length} shop{menus.length !== 1 ? "s" : ""} updated
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {menus.map((m, i) => (
              <a
                key={m.slug}
                href={`/shop/${m.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="result-card"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <span style={{
                        fontSize: 17,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                      }}>
                        {formatShopName(m.name)}
                      </span>
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: "rgba(240,237,230,0.4)",
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                    }}>
                      {m.address && <span>{m.address}</span>}
                      <span>{m.strain_count} strains</span>
                      {m.menu_date && <span>Menu dated {m.menu_date}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {m.scraped_at && (
                      <>
                        <div style={{ fontSize: 15, fontWeight: 500, color: "#C8F060" }}>
                          {new Date(m.scraped_at).toLocaleDateString()}
                        </div>
                        <div style={{
                          fontSize: 10,
                          color: "rgba(240,237,230,0.3)",
                          letterSpacing: "0.05em",
                        }}>
                          scraped
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
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
