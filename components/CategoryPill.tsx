"use client";

import { CAT_COLORS } from "@/lib/colors";

export default function CategoryPill({ category }: { category: string }) {
  const colors = CAT_COLORS[category] || CAT_COLORS.other;
  return (
    <span
      className="pill"
      style={{ background: colors.bg, color: colors.text }}
    >
      {category}
    </span>
  );
}
