"use client";

import type { Route, Domestic, Leg } from "@/lib/types";
import { routeTotalCAD, fmt } from "@/lib/flightUtils";
import { LegEditor } from "./LegEditor";
import type { Currency } from "@/lib/types";

const DRAG_DATA_KEY = "leg-index";

export function RouteForm({
  route,
  domestics,
  displayCurrency,
  exchangeRate,
  onUpdateRoute,
  onUpdateLeg,
  onAddLeg,
  onRemoveLeg,
  onReorderLegs,
  onSave,
  onDelete,
  canDelete,
  canAddLeg = true,
  maxLegsPerRoute = 10,
}: {
  route: Route;
  domestics: Domestic[];
  displayCurrency: Currency;
  exchangeRate: number;
  onUpdateRoute: (field: keyof Route, value: string | undefined) => void;
  onUpdateLeg: (legId: string, field: keyof Leg, value: string | number) => void;
  onAddLeg: () => void;
  onRemoveLeg: (legId: string) => void;
  onReorderLegs: (fromIndex: number, toIndex: number) => void;
  onSave: (r: Route) => void;
  onDelete: () => void;
  canDelete: boolean;
  canAddLeg?: boolean;
  maxLegsPerRoute?: number;
}) {
  const handleDragStart = (e: React.DragEvent, legIdx: number) => {
    e.dataTransfer.setData(DRAG_DATA_KEY, String(legIdx));
    e.dataTransfer.effectAllowed = "move";
    (e.target as HTMLElement).style.cursor = "grabbing";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.cursor = "grab";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData(DRAG_DATA_KEY), 10);
    if (Number.isNaN(fromIndex) || fromIndex === toIndex) return;
    onReorderLegs(fromIndex, toIndex);
  };

  return (
    <div
      className="glass"
      style={{
        width: "100%",
        padding: "var(--card-padding)",
        boxSizing: "border-box",
        borderLeft: "4px solid var(--accent)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-lg)",
        }}
      >
        <div style={{ flex: 1, marginRight: "var(--space-lg)" }}>
          <input
            value={route.label}
            onChange={(e) => onUpdateRoute("label", e.target.value)}
            placeholder="Ej: Vía Cancún con Copa"
            style={{
              background: "transparent",
              border: "none",
              borderBottom: "3px solid var(--accent)",
              color: "var(--text-primary)",
              fontSize: 20,
              fontWeight: 700,
              outline: "none",
              width: "100%",
              paddingBottom: "var(--space-sm)",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "var(--space-md)" }}>
          <button
            type="button"
            aria-label="Guardar ruta"
            onClick={() => onSave(route)}
            style={{
              background: "var(--success-bg)",
              border: "2px solid var(--success)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--btn-padding-y) var(--btn-padding-x)",
              color: "var(--success)",
              fontSize: 16,
              fontWeight: "var(--label-weight)",
            }}
          >
            💾 Guardar
          </button>
          {canDelete && (
            <button
              type="button"
              aria-label="Eliminar ruta"
              onClick={onDelete}
              style={{
                background: "var(--error-bg)",
                border: "2px solid var(--error)",
                borderRadius: "var(--radius-sm)",
                padding: "var(--btn-padding-y) 18px",
                color: "var(--error)",
                fontSize: 16,
                fontWeight: "var(--label-weight)",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {domestics.length > 0 && (
        <div style={{ marginBottom: "var(--space-lg)" }}>
          <label
            style={{
              fontSize: "var(--label-size)",
              fontWeight: "var(--label-weight)",
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: "var(--space-sm)",
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
              background: "var(--bg-card)",
              border: "2px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "14px 16px",
              color: "var(--text-primary)",
              fontSize: "var(--input-font)",
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

      <div style={{ marginBottom: "var(--space-lg)" }}>
        <span style={{ fontSize: 18, color: "var(--accent)", fontWeight: "var(--section-title-weight)" }}>
          ✈️ Trayecto internacional · CCS → destino final
        </span>
        <div style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: "var(--space-xs)" }}>
          Tramos de vuelo
        </div>
      </div>

      <div style={{ paddingLeft: 4 }}>
        {route.legs.map((leg, legIdx) => (
          <div
            key={leg.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, legIdx)}
            style={{ position: "relative" }}
          >
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, legIdx)}
              onDragEnd={handleDragEnd}
              title="Arrastrar para reordenar"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                cursor: "grab",
                padding: "6px 8px",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg)",
                border: "2px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: 16,
                lineHeight: 1,
                zIndex: 2,
                userSelect: "none",
              }}
            >
              ⋮⋮
            </div>
            <LegEditor
              leg={leg}
              idx={legIdx}
              total={route.legs.length}
              onChange={(field, value) => onUpdateLeg(leg.id, field, value)}
              onRemove={() => onRemoveLeg(leg.id)}
            />
            {legIdx < route.legs.length - 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-md)",
                  marginBottom: "var(--space-xl)",
                  padding: "var(--space-md) var(--space-lg)",
                  background: "var(--bg)",
                  border: "2px dashed var(--border)",
                  borderRadius: "var(--radius-sm)",
                  marginLeft: 20,
                  maxWidth: 280,
                }}
              >
                <span style={{ fontSize: "var(--label-size)", fontWeight: "var(--label-weight)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                  ⏱️ Espera en conexión
                </span>
                <input
                  type="number"
                  value={leg.layoverHours}
                  onChange={(e) => onUpdateLeg(leg.id, "layoverHours", parseFloat(e.target.value) || 0)}
                  placeholder="2"
                  min={0}
                  step={0.5}
                  style={{
                    width: 72,
                    padding: "10px 12px",
                    border: "2px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-card)",
                    color: "var(--text-primary)",
                    fontSize: "var(--input-font)",
                    outline: "none",
                  }}
                />
                <span style={{ fontSize: "var(--label-size)", color: "var(--text-secondary)", fontWeight: 600 }}>h</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {canAddLeg ? (
        <button
          type="button"
          aria-label="Agregar tramo de vuelo"
          onClick={onAddLeg}
          style={{
            background: "#dbeafe",
            border: "2px dashed var(--accent)",
            borderRadius: "var(--radius-sm)",
            padding: "var(--btn-padding-y) var(--btn-padding-x)",
            color: "var(--accent)",
            fontSize: 16,
            fontWeight: "var(--label-weight)",
            width: "100%",
            marginTop: "var(--space-md)",
          }}
        >
          + Agregar tramo
        </button>
      ) : (
        <p
          style={{
            marginTop: "var(--space-md)",
            fontSize: 14,
            color: "var(--text-muted)",
            fontWeight: 600,
          }}
        >
          Máximo {maxLegsPerRoute} tramos por ruta.
        </p>
      )}

      {route.legs.some((l) => l.price) && (
        <div
          style={{
            marginTop: "var(--space-lg)",
            padding: "var(--btn-padding-y) 18px",
            background: "var(--bg)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "var(--space-md)",
            alignItems: "center",
            border: "2px solid var(--border)",
          }}
        >
          <span style={{ fontSize: 15, fontWeight: "var(--label-weight)", color: "var(--text-secondary)" }}>
            Subtotal vuelos
          </span>
          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)" }}>
            {fmt(routeTotalCAD(route, exchangeRate), displayCurrency, exchangeRate)}
          </span>
        </div>
      )}
    </div>
  );
}
