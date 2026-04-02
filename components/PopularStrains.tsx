"use client";

import type { PopularStrain } from "@/lib/api";
import { CAT_COLORS } from "@/lib/colors";

interface Props {
  strains: PopularStrain[];
  onSelect: (name: string) => void;
}

export default function PopularStrains({ strains, onSelect }: Props) {
  return (
    <div>
      <div style={{
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(240,237,230,0.3)",
        marginBottom: 16,
      }}>
        &mdash; trending now
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {strains.map((s, i) => {
          const dotColor = CAT_COLORS[s.category]?.bg || "#888";
          // Display name: capitalize first letters
          const displayName = s.name_normalized
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

          return (
            <div
              key={i}
              className="popular-tag"
              onClick={() => onSelect(displayName)}
            >
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: dotColor,
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
  );
}
