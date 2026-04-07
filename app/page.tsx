"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { searchStrains, getPopular, getStatus, getShops } from "@/lib/api";
import type { StrainResult, PopularStrain, StatusInfo, Shop } from "@/lib/api";
import { formatShopName } from "@/lib/format";
import SearchInput from "@/components/SearchInput";
import StrainTable from "@/components/StrainTable";
import PriceSortToggle from "@/components/PriceSortToggle";
import PopularStrains from "@/components/PopularStrains";
import LoadingBar from "@/components/LoadingBar";
import { sortByPrice, type PriceSort } from "@/lib/sort";

export default function HomePage() {
  return (
    <Suspense>
      <HomePageInner />
    </Suspense>
  );
}

function HomePageInner() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<StrainResult[] | null>(null);
  const [popular, setPopular] = useState<PopularStrain[]>([]);
  const [status, setStatus] = useState<StatusInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [priceSort, setPriceSort] = useState<PriceSort>("off");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [shops, setShops] = useState<Shop[]>([]);
  const [shopQuery, setShopQuery] = useState("");
  const [shopOpen, setShopOpen] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPopular().then(setPopular).catch(() => {});
    getStatus().then(setStatus).catch(() => {});
    getShops().then(setShops).catch(() => {});
  }, []);

  // Close shop dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      setActiveFilter("all");
      setPriceSort("off");
      return;
    }
    setLoading(true);
    try {
      const data = await searchStrains(q);
      setResults(data);
      setActiveFilter("all");
      setPriceSort("off");
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search if ?q= param is present
  useEffect(() => {
    if (initialQ) doSearch(initialQ);
  }, [initialQ, doSearch]);

  const handleChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const handleSelectPopular = (name: string) => {
    setQuery(name);
    doSearch(name);
  };

  const filtered = results
    ? sortByPrice(
        activeFilter !== "all" ? results.filter((r) => r.category === activeFilter) : results,
        priceSort,
      )
    : null;

  const categories = results
    ? ["all", ...Array.from(new Set(results.map((r) => r.category)))]
    : [];

  const filteredShops = shopQuery.trim()
    ? shops.filter((s) =>
        formatShopName(s.name).toLowerCase().includes(shopQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 60 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(200,240,96,0.7)",
            }}>
              Amsterdam
            </span>
            <span style={{ width: 32, height: 1, background: "rgba(200,240,96,0.3)", display: "inline-block" }} />
            <span style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(240,237,230,0.3)",
            }}>
              Strain Finder
            </span>
          </div>

          {/* Coffeeshop search — top right */}
          <div ref={shopRef} style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(240,237,230,0.05)",
                border: "1px solid rgba(200,240,96,0.4)",
                borderRadius: 6,
                padding: "5px 10px",
                cursor: "text",
                transition: "border-color 0.15s",
                ...(shopOpen ? { borderColor: "rgba(200,240,96,0.4)" } : {}),
              }}
              onClick={() => setShopOpen(true)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,230,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={shopQuery}
                onChange={(e) => { setShopQuery(e.target.value); setShopOpen(true); }}
                onFocus={() => setShopOpen(true)}
                placeholder="Find a coffeeshop"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "rgba(240,237,230,0.8)",
                  fontSize: 12,
                  letterSpacing: "0.02em",
                  width: 130,
                }}
              />
            </div>

            {/* Dropdown results */}
            {shopOpen && shopQuery.trim() && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                width: 240,
                background: "#1a1a18",
                border: "1px solid rgba(240,237,230,0.1)",
                borderRadius: 8,
                overflow: "hidden",
                zIndex: 100,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}>
                {filteredShops.length === 0 ? (
                  <div style={{
                    padding: "12px 14px",
                    fontSize: 12,
                    color: "rgba(240,237,230,0.3)",
                  }}>
                    No shops found
                  </div>
                ) : (
                  filteredShops.map((shop) => (
                    <a
                      key={shop.slug}
                      href={`/shop/${shop.slug}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "9px 14px",
                        fontSize: 12,
                        color: "rgba(240,237,230,0.75)",
                        textDecoration: "none",
                        transition: "background 0.12s",
                        borderBottom: "1px solid rgba(240,237,230,0.04)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200,240,96,0.07)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span>{formatShopName(shop.name)}</span>
                      <span style={{
                        fontSize: 10,
                        color: "rgba(240,237,230,0.25)",
                      }}>
                        {shop.strain_count} strains
                      </span>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(36px, 6vw, 72px)",
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          marginBottom: 16,
        }}>
          Find your strain.<br />
          <span style={{ color: "#C8F060" }}>Right now.</span>
        </h1>

        <p style={{ fontSize: 13, color: "rgba(240,237,230,0.4)", lineHeight: 1.6, maxWidth: 440 }}>
          Live data from community-uploaded menus across every coffeeshop in Amsterdam.
          Updated automatically. No guessing.
        </p>

        <div style={{ marginTop: 16 }}>
          <a
            href="/browse"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              fontSize: 12,
              fontWeight: 500,
              color: "#C8F060",
              background: "transparent",
              border: "1px solid rgba(200,240,96,0.4)",
              borderRadius: 4,
              textDecoration: "none",
              letterSpacing: "0.05em",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(200,240,96,0.8)"; e.currentTarget.style.color = "#d4f88a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(200,240,96,0.4)"; e.currentTarget.style.color = "#C8F060"; }}
          >
            Browse all shops &amp; strains &rarr;
          </a>
        </div>
      </div>

      {/* Search */}
      <SearchInput
        value={query}
        onChange={handleChange}
        onSubmit={() => doSearch(query)}
      />

      {/* Loading */}
      {loading && <LoadingBar />}

      {/* Category filters */}
      {results && results.length > 0 && categories.length >= 3 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Price sort (own row, distinct shape) */}
      {results && results.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <PriceSortToggle value={priceSort} onChange={setPriceSort} />
        </div>
      )}

      {/* Results */}
      {filtered !== null && !loading && (
        <StrainTable results={filtered} query={query} />
      )}

      {/* Popular strains (before search) */}
      {results === null && popular.length > 0 && (
        <PopularStrains strains={popular} onSelect={handleSelectPopular} />
      )}

      {/* Footer */}
      <div style={{
        marginTop: 80,
        paddingTop: 24,
        borderTop: "1px solid rgba(240,237,230,0.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 11,
        color: "rgba(240,237,230,0.2)",
        letterSpacing: "0.05em",
        flexWrap: "wrap",
        gap: 8,
      }}>
        <span>Data via Amsterdam Coffeeshop Menus community</span>
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#C8F060",
            display: "inline-block",
            animation: "blink 2s ease infinite",
          }} />
          Live{status ? ` \u2014 ${status.shops_indexed} shops indexed` : ""}
        </span>
      </div>
    </>
  );
}
