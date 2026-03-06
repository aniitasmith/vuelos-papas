"use client";

import type { Route, Domestic, Leg } from "@/lib/types";
import { routeTotalCAD } from "@/lib/flightUtils";
import { LegEditor } from "./LegEditor";
import type { Currency } from "@/lib/types";

export function RouteForm({
  route,
  domestics,
  displayCurrency,
  exchangeRate,
  onUpdateRoute,
  onUpdateLeg,
  onAddLeg,
  onRemoveLeg,
  onSave,
  onDelete,
  canDelete,
}: {
  route: Route;
  domestics: Domestic[];
  displayCurrency: Currency;
  exchangeRate: number;
  onUpdateRoute: (field: keyof Route, value: string | undefined) => void;
  onUpdateLeg: (legId: string, field: keyof Leg, value: string | number) => void;
  onAddLeg: () => void;
  onRemoveLeg: (legId: string) => void;
  onSave: (r: Route) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const fmt = (cad: number) =>
    displayCurrency === "CAD"
      ? `CAD $${cad.toLocaleString("en", { maximumFractionDigits: 0 })}`
      : `USD $${(cad / exchangeRate).toLocaleString("en", { maximumFractionDigits: 0 })}`;

  return (
    <div
      style={{
        background: "#0a1520",
        border: "1px solid #1e2d3d",
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div style={{ flex: 1, marginRight: 12 }}>
          <input
            value={route.label}
            onChange={(e) => onUpdateRoute("label", e.target.value)}
            placeholder="Ej: Vía Cancún con Copa"
            style={{
              background: "transparent",
              border: "none",
              borderBottom: "1px solid #1e3d2d",
              color: "#e8f4f0",
              fontSize: 16,
              fontFamily: "'Playfair Display', serif",
              outline: "none",
              width: "100%",
              paddingBottom: 4,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onSave(route)}
            style={{
              background: "#0d2e1f",
              border: "1px solid #00c48c44",
              borderRadius: 6,
              padding: "4px 12px",
              color: "#00c48c",
              fontSize: 11,
              fontFamily: "'Courier Prime', monospace",
            }}
          >
            💾 Guardar
          </button>
          {canDelete && (
            <button
              onClick={onDelete}
              style={{
                background: "#1a0a0a",
                border: "1px solid #3d1e1e",
                borderRadius: 8,
                padding: "4px 10px",
                color: "#e05c5c",
                fontSize: 11,
                fontFamily: "'Courier Prime', monospace",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Domestic selector: which domestic leg applies to this route */}
      {domestics.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              fontSize: 10,
              color: "#4a9e7f",
              letterSpacing: 1,
              fontFamily: "'Courier Prime', monospace",
              textTransform: "uppercase" as const,
              display: "block",
              marginBottom: 4,
            }}
          >
            Trayecto nacional para esta ruta
          </label>
          <select
            value={route.domesticId ?? ""}
            onChange={(e) =>
              onUpdateRoute("domesticId", e.target.value || undefined)
            }
            style={{
              background: "#060e17",
              border: "1px solid #1e2d3d",
              borderRadius: 7,
              padding: "8px 12px",
              color: "#e8f4f0",
              fontSize: 14,
              fontFamily: "'Courier Prime', monospace",
              outline: "none",
              width: "100%",
            }}
          >
            <option value="">— Ninguno —</option>
            {domestics.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label || d.cityOrigin || "Sin nombre"} → CCS
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ paddingLeft: 4 }}>
        {route.legs.map((leg, legIdx) => (
          <LegEditor
            key={leg.id}
            leg={leg}
            idx={legIdx}
            total={route.legs.length}
            onChange={(field, value) => onUpdateLeg(leg.id, field, value)}
            onRemove={() => onRemoveLeg(leg.id)}
          />
        ))}
      </div>

      <button
        onClick={onAddLeg}
        style={{
          background: "transparent",
          border: "1px dashed #1e3d2d",
          borderRadius: 8,
          padding: "6px 16px",
          color: "#4a9e7f",
          fontSize: 11,
          fontFamily: "'Courier Prime', monospace",
          width: "100%",
          marginTop: 4,
        }}
      >
        + Agregar tramo
      </button>

      {route.legs.some((l) => l.price) && (
        <div
          style={{
            marginTop: 12,
            padding: "8px 12px",
            background: "#0a1218",
            borderRadius: 8,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Courier Prime', monospace",
              color: "#4a6a5a",
              fontSize: 11,
            }}
          >
            SUBTOTAL VUELOS
          </span>
          <span
            style={{
              fontFamily: "'Courier Prime', monospace",
              color: "#7abcd6",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {fmt(routeTotalCAD(route, exchangeRate))}
          </span>
        </div>
      )}
    </div>
  );
}
