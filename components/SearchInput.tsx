"use client";

import { useRef, useState, useEffect } from "react";

const PLACEHOLDERS = [
  "Skittles...",
  "Amnesia Haze...",
  "OG Kush...",
  "Moroccan Hash...",
  "Wedding Cake...",
];

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
}

export default function SearchInput({ value, onChange, onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phText, setPhText] = useState("");

  useEffect(() => {
    let i = 0;
    let dir = 1;
    let pidx = 0;
    let current = "";

    const tick = () => {
      const word = PLACEHOLDERS[pidx];
      if (dir === 1) {
        current = word.slice(0, i + 1);
        i++;
        if (i > word.length) { dir = -1; i = word.length; }
      } else {
        current = word.slice(0, i - 1);
        i--;
        if (i <= 0) { dir = 1; i = 0; pidx = (pidx + 1) % PLACEHOLDERS.length; }
      }
      setPhText(current);
    };

    const interval = setInterval(tick, 90);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="search-wrapper"
      onClick={() => inputRef.current?.focus()}
      style={{ marginBottom: 32 }}
    >
      <div style={{
        fontSize: 12,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(240,237,230,0.25)",
        marginBottom: 12,
      }}>
        &mdash; search strain
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          ref={inputRef}
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />
        {!value && (
          <div style={{
            position: "absolute",
            left: 0,
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 5vw, 52px)",
            fontStyle: "italic",
            color: "rgba(240,237,230,0.2)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
          }}>
            {phText}<span className="cursor-blink" />
          </div>
        )}
      </div>
    </div>
  );
}
