"use client";

import type { Currency } from "@/lib/types";
import { PRIORITY_OPTIONS } from "@/lib/flightUtils";
import { CurrencyToggle } from "./ui/CurrencyToggle";
import { SaveStatus } from "./ui/SaveStatus";
import { InputField } from "./ui/InputField";

export function ConfigBar({
  priority,
  setPriority,
  displayCurrency,
  setDisplayCurrency,
  exchangeRate,
  setExchangeRate,
  saveStatus,
  errorMessage,
}: {
  priority: string;
  setPriority: (p: string) => void;
  displayCurrency: Currency;
  setDisplayCurrency: (c: Currency) => void;
  exchangeRate: number;
  setExchangeRate: (r: number) => void;
  saveStatus: "idle" | "saving" | "saved" | "error";
  errorMessage?: string | null;
}) {
  return (
    <div
      style={{
        background: "#0a1520",
        border: "1px solid #1e2d3d",
        borderRadius: 14,
        padding: "14px 18px",
        marginBottom: 18,
        display: "flex",
        gap: 16,
        flexWrap: "wrap" as const,
        alignItems: "flex-end",
      }}
    >
      <div style={{ flex: 1, minWidth: 200 }}>
        <div
          style={{
            fontSize: 10,
            color: "#4a9e7f",
            letterSpacing: 1,
            fontFamily: "'Courier Prime', monospace",
            marginBottom: 8,
            textTransform: "uppercase" as const,
          }}
        >
          Prioridad
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPriority(opt.value)}
              style={{
                background: priority === opt.value ? "#00c48c" : "#0f1923",
                border:
                  priority === opt.value
                    ? "1px solid #00c48c"
                    : "1px solid #1e2d3d",
                borderRadius: 20,
                padding: "5px 14px",
                fontSize: 12,
                color: priority === opt.value ? "#000" : "#7a9e8e",
                fontWeight: priority === opt.value ? 700 : 400,
                fontFamily: "'Courier Prime', monospace",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 5 }}>
        <div
          style={{
            fontSize: 10,
            color: "#4a9e7f",
            letterSpacing: 1,
            fontFamily: "'Courier Prime', monospace",
            textTransform: "uppercase" as const,
          }}
        >
          Ver en
        </div>
        <CurrencyToggle value={displayCurrency} onChange={setDisplayCurrency} />
      </div>
      <div style={{ minWidth: 100 }}>
        <div
          style={{
            fontSize: 10,
            color: "#4a9e7f",
            letterSpacing: 1,
            fontFamily: "'Courier Prime', monospace",
            marginBottom: 6,
            textTransform: "uppercase" as const,
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
      <SaveStatus status={saveStatus} errorMessage={errorMessage} />
    </div>
  );
}
