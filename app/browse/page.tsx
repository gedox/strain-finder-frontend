"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getShops, getPopular } from "@/lib/api";
import type { Shop, PopularStrain } from "@/lib/api";
import AlphaNav from "@/components/AlphaNav";
import ShopCard from "@/components/ShopCard";
import CategoryFilter from "@/components/CategoryFilter";
import { CAT_COLORS } from "@/lib/colors";

export default function BrowsePage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [popular, setPopular] = useState<PopularStrain[]>([]);
  const [activeLetter, setActiveLetter] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    getShops().then(setShops).catch(() => {});
    getPopular().then(setPopular).catch(() => {});
  }, []);

  // Group shops by first letter
  const shopsByLetter: Record<string, Shop[]> = {};
  shops.forEach((shop) => {
    const letter = shop.name.charAt(0).toUpperCase();
    if (!shopsByLetter[letter]) shopsByLetter[letter] = [];
    shopsByLetter[letter].push(shop);
  });

  const availableLetters = new Set(Object.keys(shopsByLetter));

  const handleLetterSelect = (letter: string) => {
    setActiveLetter(letter);
    const el = letterRefs.current[letter];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Filter popular strains by category
  const filteredPopular =
    activeCategory === "all"
      ? popular
      : popular.filter((s) => s.category === activeCategory);

  const categories = ["all", ...Array.from(new Set(popular.map((s) => s.category)))];

  const handleStrainClick = (name: string) => {
    router.push(`/?q=${encodeURIComponent(name)}`);
  };

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
            Browse
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 700,
          marginBottom: 8,
        }}>
          Browse Strains &amp; Shops
        </h1>
      </div>

      {/* Popular strains with category filter */}
      {popular.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(240,237,230,0.3)",
            marginBottom: 16,
          }}>
            &mdash; popular strains
          </div>

          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {filteredPopular.map((s, i) => {
              const displayName = s.name_normalized
                .split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

              return (
                <div
                  key={i}
                  className="popular-tag"
                  onClick={() => handleStrainClick(displayName)}
                >
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: CAT_COLORS[s.category]?.bg || "#888",
                    display: "inline-block",
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 12 }}>{displayName}</span>
                  <span style={{ fontSize: 10, color: "rgba(240,237,230,0.3)" }}>
                    {s.shop_count} shop{s.shop_count !== 1 ? "s" : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Shops A-Z */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(240,237,230,0.3)",
          marginBottom: 16,
        }}>
          &mdash; coffeeshops A&ndash;Z
        </div>

        <AlphaNav
          activeLetter={activeLetter}
          onSelect={handleLetterSelect}
          availableLetters={availableLetters}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.keys(shopsByLetter)
            .sort()
            .map((letter) => (
              <div
                key={letter}
                ref={(el) => { letterRefs.current[letter] = el; }}
              >
                <div style={{
                  fontSize: 18,
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: "#C8F060",
                  marginBottom: 8,
                  marginTop: 16,
                }}>
                  {letter}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {shopsByLetter[letter].map((shop) => (
                    <ShopCard key={shop.slug} shop={shop} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
