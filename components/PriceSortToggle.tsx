"use client";

import type { PriceSort } from "@/lib/sort";

interface Props {
  value: PriceSort;
  onChange: (v: PriceSort) => void;
}

const NEXT: Record<PriceSort, PriceSort> = { off: "asc", asc: "desc", desc: "off" };
const LABEL: Record<PriceSort, string> = {
  off: "Price",
  asc: "Price \u2191",
  desc: "Price \u2193",
};

export default function PriceSortToggle({ value, onChange }: Props) {
  return (
    <button
      className={`filter-btn ${value !== "off" ? "active" : ""}`}
      onClick={() => onChange(NEXT[value])}
    >
      Sort by {LABEL[value]}
    </button>
  );
}
