"use client";

import type { Leg } from "@/lib/types";
import { InputField } from "./ui/InputField";
import { CurrencyToggle } from "./ui/CurrencyToggle";

export function LegEditor({
  leg,
  idx,
  total,
  onChange,
  onRemove,
}: {
  leg: Leg;
  idx: number;
  total: number;
  onChange: (field: keyof Leg, value: string | number) => void;
  onRemove: () => void;
}) {
  const isLast = idx === total - 1;
  return (
    <div style={{ position: "relative" }}>
      {!isLast && (
        <div
          style={{
            position: "absolute",
            left: 20,
            bottom: -18,
            width: 2,
            height: 18,
            background: "linear-gradient(#1e3d2d,#1e2d3d)",
            zIndex: 1,
          }}
        />
      )}
      <div
        style={{
          background: "#0a1520",
          border: "1px solid #1a2d3d",
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background:
                idx === 0 ? "#003d20" : isLast ? "#003040" : "#2a1a00",
              border: `1px solid ${idx === 0 ? "#00c48c" : isLast ? "#4a9e7f" : "#f5a623"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontFamily: "'Courier Prime', monospace",
              color: idx === 0 ? "#00c48c" : isLast ? "#4a9e7f" : "#f5a623",
              flexShrink: 0,
            }}
          >
            {idx + 1}
          </div>
          <span
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: 11,
              color: "#4a6a5a",
            }}
          >
            TRAMO {idx + 1}
            {idx === 0 ? " · SALIDA" : isLast ? " · LLEGADA" : " · CONEXIÓN"}
          </span>
          {total > 2 && (
            <button
              onClick={onRemove}
              style={{
                marginLeft: "auto",
                background: "transparent",
                border: "none",
                color: "#e05c5c",
                fontSize: 12,
                padding: "2px 6px",
                fontFamily: "'Courier Prime', monospace",
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 8,
            alignItems: "end",
            marginBottom: 12,
          }}
        >
          <InputField
            small
            label="Origen"
            value={leg.origin}
            onChange={(v) => onChange("origin", v)}
            placeholder="CCS"
          />
          <div style={{ paddingBottom: 8, color: "#4a6a5a", fontSize: 18 }}>→</div>
          <InputField
            small
            label="Destino"
            value={leg.destination}
            onChange={(v) => onChange("destination", v)}
            placeholder="CUN"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 10,
          }}
        >
          <InputField
            small
            label="Aerolínea / Agencia"
            value={leg.airline}
            onChange={(v) => onChange("airline", v)}
            placeholder="Ej: Copa, Wingo..."
          />
          <div>
            <InputField
              small
              label="Precio tramo"
              value={leg.price}
              onChange={(v) => onChange("price", v)}
              type="number"
              placeholder="280"
              min="0"
            />
            <div style={{ marginTop: 5 }}>
              <CurrencyToggle
                value={leg.currency}
                onChange={(v) => onChange("currency", v)}
              />
            </div>
          </div>
          <InputField
            small
            label="Horas de vuelo"
            value={leg.flightHours}
            onChange={(v) => onChange("flightHours", v)}
            type="number"
            placeholder="3.5"
            min="0"
            step="0.5"
          />
          {!isLast && (
            <InputField
              small
              label="Espera en conexión (h)"
              value={leg.layoverHours}
              onChange={(v) => onChange("layoverHours", v)}
              type="number"
              placeholder="2"
              min="0"
              step="0.5"
            />
          )}
        </div>

        <div style={{ marginTop: 10 }}>
          <InputField
            small
            label="Notas del tramo"
            value={leg.notes}
            onChange={(v) => onChange("notes", v)}
            placeholder="Ej: precio válido hasta 15 mar, incluye maleta..."
          />
        </div>
      </div>
    </div>
  );
}
