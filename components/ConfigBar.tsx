"use client";

import type { Currency, Priority } from "@/lib/types";
import { PRIORITY_OPTIONS } from "@/lib/flightUtils";
import { CurrencyToggle } from "./ui/CurrencyToggle";
import { InputField } from "./ui/InputField";

export function ConfigBar({
  priority,
  setPriority,
  displayCurrency,
  setDisplayCurrency,
  exchangeRate,
  setExchangeRate,
}: {
  priority: Priority;
  setPriority: (p: Priority) => void;
  displayCurrency: Currency;
  setDisplayCurrency: (c: Currency) => void;
  exchangeRate: number;
  setExchangeRate: (r: number) => void;
}) {
  return (
    <div
      className="glass"
      style={{
        width: "100%",
        padding: "var(--card-padding)",
        marginBottom: "var(--space-xl)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: "var(--space-2xl)",
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 200px" }}>
        <div
          style={{
            fontSize: "var(--section-title-size)",
            fontWeight: "var(--section-title-weight)",
            color: "var(--text-secondary)",
            marginBottom: "var(--space-sm)",
          }}
        >
          Prioridad
        </div>
        <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap" as const }}>
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-label={`Prioridad: ${opt.label}`}
              aria-pressed={priority === opt.value}
              onClick={() => setPriority(opt.value as Priority)}
              style={{
                background: priority === opt.value ? "var(--accent)" : "var(--bg)",
                border: `2px solid ${priority === opt.value ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--radius-sm)",
                padding: "var(--btn-padding-y) var(--btn-padding-x)",
                fontSize: 15,
                fontWeight: "var(--label-weight)",
                color: priority === opt.value ? "#fff" : "var(--text-secondary)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-2xl)",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "var(--space-sm)", minWidth: 90 }}>
          <div
            style={{
              fontSize: "var(--section-title-size)",
              fontWeight: "var(--section-title-weight)",
              color: "var(--text-secondary)",
            }}
          >
            Ver en
          </div>
          <CurrencyToggle value={displayCurrency} onChange={setDisplayCurrency} />
        </div>
        <div style={{ minWidth: 140 }}>
          <div
            style={{
              fontSize: "var(--section-title-size)",
              fontWeight: "var(--section-title-weight)",
              color: "var(--text-secondary)",
              marginBottom: "var(--space-sm)",
            }}
          >
            Tasa 1 USD = CAD
          </div>
          <InputField
            small
            type="number"
            label=""
            value={exchangeRate}
            onChange={(v) => setExchangeRate(Number(v) || 1.39)}
            placeholder="1.39"
            step="0.01"
            min="0.1"
          />
        </div>
      </div>
    </div>
  );
}
