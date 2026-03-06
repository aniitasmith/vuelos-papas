"use client";

import type { Currency } from "@/lib/types";

export function CurrencyToggle({
  value,
  onChange,
}: {
  value: Currency;
  onChange: (v: Currency) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid #1e2d3d",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {(["USD", "CAD"] as Currency[]).map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          style={{
            padding: "5px 12px",
            fontSize: 11,
            fontFamily: "'Courier Prime', monospace",
            background: value === c ? "#00c48c" : "#0a1520",
            color: value === c ? "#000" : "#4a9e7f",
            fontWeight: value === c ? 700 : 400,
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
