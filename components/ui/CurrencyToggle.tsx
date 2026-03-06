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
        width: "fit-content",
        minWidth: 100,
        border: "2px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
        background: "var(--bg-card)",
      }}
    >
      {(["USD", "CAD"] as Currency[]).map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          style={{
            flex: "1 1 0",
            minWidth: 50,
            padding: "var(--btn-padding-y) 12px",
            fontSize: 15,
            fontWeight: 600,
            background: value === c ? "var(--accent)" : "transparent",
            color: value === c ? "#fff" : "var(--text-secondary)",
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
