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
    <div className="flex min-w-[100px] w-fit overflow-hidden rounded-sm border-2 border-border bg-bg-card">
      {(["USD", "CAD"] as Currency[]).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`min-w-[50px] flex-1 px-3 py-3 text-sm font-semibold ${
            value === c ? "bg-accent text-white" : "bg-transparent text-text-secondary"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
