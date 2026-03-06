"use client";

import { useEffect } from "react";
import type { Leg } from "@/lib/types";
import { flightHoursFromTimes } from "@/lib/flightUtils";
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
  const dep = leg.time ?? "";
  const arr = leg.timeArrival ?? "";
  const calculatedHours = flightHoursFromTimes(dep, arr);
  const hasBothTimes = Boolean(dep && arr);

  useEffect(() => {
    if (hasBothTimes && calculatedHours !== null) {
      onChange("flightHours", calculatedHours);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- omit onChange to avoid loops when parent re-renders
  }, [dep, arr, hasBothTimes, calculatedHours]);
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
            background: "linear-gradient(var(--accent), var(--text-muted))",
            opacity: 0.4,
            zIndex: 1,
          }}
        />
      )}
      <div
        className="glass"
        style={{
          padding: "var(--card-padding)",
          marginBottom: "var(--space-xl)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background:
                idx === 0 ? "var(--success-bg)" : isLast ? "#dbeafe" : "var(--warn-bg)",
              border: `2px solid ${idx === 0 ? "var(--success)" : isLast ? "var(--accent)" : "var(--warn)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 700,
              color: idx === 0 ? "var(--success)" : isLast ? "var(--accent)" : "var(--warn)",
              flexShrink: 0,
            }}
          >
            {idx + 1}
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-secondary)" }}>
            Tramo {idx + 1}
            {idx === 0 ? " · Salida" : isLast ? " · Llegada" : " · Conexión"}
          </span>
          {total > 2 && (
            <button
              onClick={onRemove}
              style={{
                marginLeft: "auto",
                background: "transparent",
                border: "none",
                color: "var(--error)",
                fontSize: 18,
                padding: "4px 8px",
                fontWeight: 600,
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div className="leg-origin-row">
          <InputField
            small
            label="Origen"
            value={leg.origin}
            onChange={(v) => onChange("origin", v)}
            placeholder="CCS"
            required
          />
          <div style={{ paddingBottom: 8, color: "var(--accent)", fontSize: 22, fontWeight: 700 }}>→</div>
          <InputField
            small
            label="Destino"
            value={leg.destination}
            onChange={(v) => onChange("destination", v)}
            placeholder="CUN"
            required
          />
          <div className="leg-airline-cell">
            <InputField
              small
              label="Aerolínea / Agencia"
              value={leg.airline}
              onChange={(v) => onChange("airline", v)}
              placeholder="Ej: Copa, Wingo..."
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "var(--space-md)",
          }}
        >
          <InputField
            small
            label="Fecha de vuelo"
            value={leg.date ?? ""}
            onChange={(v) => onChange("date", v)}
            type="date"
          />
          <InputField
            small
            label="Hora de salida"
            value={leg.time ?? ""}
            onChange={(v) => onChange("time", String(v))}
            type="time"
          />
          <InputField
            small
            label="Hora de llegada"
            value={leg.timeArrival ?? ""}
            onChange={(v) => onChange("timeArrival", String(v))}
            type="time"
          />
          <div
            style={{
              display: "flex",
              gap: "var(--space-md)",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 80px", minWidth: 80 }}>
              <InputField
                small
                label="Precio tramo"
                value={leg.price}
                onChange={(v) => onChange("price", v)}
                type="number"
                placeholder="280"
                min="0"
                required
              />
            </div>
            <CurrencyToggle
              value={leg.currency}
              onChange={(v) => onChange("currency", v)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label
              style={{
                fontSize: "var(--label-size)",
                fontWeight: "var(--label-weight)",
                color: "var(--text-secondary)",
              }}
            >
              Horas de vuelo
              {hasBothTimes ? (
                <span style={{ marginLeft: 6, fontWeight: 500, color: "var(--text-muted)" }}>
                  (calculado)
                </span>
              ) : (
                <span style={{ color: "var(--error)" }}> *</span>
              )}
            </label>
            <input
              type="number"
              value={leg.flightHours}
              onChange={(e) => onChange("flightHours", parseFloat(e.target.value) || 0)}
              placeholder="3.5"
              min={0}
              step={0.5}
              readOnly={hasBothTimes}
              style={{
                background: hasBothTimes ? "var(--bg)" : "var(--bg-card)",
                border: "2px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "12px 14px",
                color: "var(--text-primary)",
                fontSize: "var(--input-font)",
                outline: "none",
                width: "100%",
                cursor: hasBothTimes ? "default" : "text",
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: "var(--space-md)" }}>
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
