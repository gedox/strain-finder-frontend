"use client";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface Props {
  activeLetter: string;
  onSelect: (letter: string) => void;
  availableLetters?: Set<string>;
}

export default function AlphaNav({ activeLetter, onSelect, availableLetters }: Props) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 24 }}>
      {LETTERS.map((letter) => {
        const available = !availableLetters || availableLetters.has(letter);
        return (
          <button
            key={letter}
            className={`alpha-btn ${activeLetter === letter ? "active" : ""}`}
            onClick={() => available && onSelect(letter)}
            style={{ opacity: available ? 1 : 0.3 }}
            disabled={!available}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
