"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAllStrains, getPopular } from "@/lib/api";
import type { PopularStrain } from "@/lib/api";
import AlphaNav from "@/components/AlphaNav";
import CategoryFilter from "@/components/CategoryFilter";
import { CAT_COLORS } from "@/lib/colors";

export default function BrowsePage() {
  const router = useRouter();
  const [allStrains, setAllStrains] = useState<PopularStrain[]>([]);
  const [popular, setPopular] = useState<PopularStrain[]>([]);
  const [activeLetter, setActiveLetter] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    getAllStrains().then(setAllStrains).catch(() => {});
    getPopular().then(setPopular).catch(() => {});
  }, []);

  const toDisplayName = (name: string) =>
    name
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // Filter strains by category
  const filteredStrains =
    activeCategory === "all"
      ? allStrains
      : allStrains.filter((s) => s.category === activeCategory);

  // Group strains by first letter
  const strainsByLetter: Record<string, PopularStrain[]> = {};
  filteredStrains.forEach((strain) => {
    const letter = strain.name_normalized.charAt(0).toUpperCase();
    if (!strainsByLetter[letter]) strainsByLetter[letter] = [];
    strainsByLetter[letter].push(strain);
  });

  const availableLetters = new Set(Object.keys(strainsByLetter));

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

  const categories = [
    "all",
    ...Array.from(new Set(allStrains.map((s) => s.category))),
  ];

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
            letterSpacing: "0.1em",
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
          Browse Strains
        </h1>
      </div>

      {/* Popular strains */}
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

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {filteredPopular.map((s, i) => (
              <div
                key={i}
                className="popular-tag"
                onClick={() => handleStrainClick(toDisplayName(s.name_normalized))}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: CAT_COLORS[s.category]?.bg || "#888",
                  display: "inline-block",
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 12 }}>{toDisplayName(s.name_normalized)}</span>
                <span style={{ fontSize: 10, color: "rgba(240,237,230,0.3)" }}>
                  {s.shop_count} shop{s.shop_count !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category filter + Strains A-Z */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(240,237,230,0.3)",
          marginBottom: 16,
        }}>
          &mdash; all strains A&ndash;Z
        </div>

        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />

        <AlphaNav
          activeLetter={activeLetter}
          onSelect={handleLetterSelect}
          availableLetters={availableLetters}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.keys(strainsByLetter)
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
                  {strainsByLetter[letter].map((strain, i) => (
                    <div
                      key={i}
                      onClick={() => handleStrainClick(toDisplayName(strain.name_normalized))}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                        background: "rgba(240,237,230,0.03)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(240,237,230,0.07)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(240,237,230,0.03)")}
                    >
                      <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: CAT_COLORS[strain.category]?.bg || "#888",
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 14, flex: 1 }}>
                        {toDisplayName(strain.name_normalized)}
                      </span>
                      <span style={{
                        fontSize: 11,
                        color: "rgba(240,237,230,0.3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>
                        {strain.category}
                      </span>
                      <span style={{ fontSize: 11, color: "rgba(240,237,230,0.3)" }}>
                        {strain.shop_count} shop{strain.shop_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
