"use client";

import type { Domestic } from "@/lib/types";
import { InputField } from "./ui/InputField";
import { SelectField } from "./ui/SelectField";
import { CurrencyToggle } from "./ui/CurrencyToggle";

const headerButtonStyle = {
  background: "var(--bg-card)",
  border: "2px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "var(--btn-padding-y) var(--btn-padding-x)",
  color: "var(--warn)",
  fontSize: 16,
  fontWeight: "var(--label-weight)" as const,
};

export function DomesticForm({
  domestics,
  onUpdate,
  onAdd,
  onSave,
  onDelete,
  expanded = true,
  onToggleCollapse,
}: {
  domestics: Domestic[];
  onUpdate: (id: string, field: keyof Domestic, value: string | number) => void;
  onAdd: () => void;
  onSave: (d: Domestic) => void;
  onDelete: (id: string) => void;
  expanded?: boolean;
  onToggleCollapse?: () => void;
}) {
  return (
    <div
      className="glass"
      style={{
        width: "100%",
        padding: "var(--card-padding)",
        marginBottom: "var(--space-xl)",
        borderLeft: "4px solid var(--warn)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: expanded ? "var(--space-lg)" : 0,
        }}
      >
        <div>
          <span style={{ fontSize: 18, color: "var(--warn)", fontWeight: "var(--section-title-weight)" }}>
            🚌 Trayecto nacional · Ciudad → Caracas (CCS)
          </span>
          <div style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: "var(--space-xs)" }}>
            Transporte hasta Maiquetía
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
          {expanded && (
            <button
              type="button"
              aria-label="Agregar opción de trayecto nacional"
              onClick={onAdd}
              style={{
                ...headerButtonStyle,
                background: "var(--warn-bg)",
                border: "2px dashed var(--warn)",
              }}
            >
              + Opción
            </button>
          )}
          {onToggleCollapse && (
            <button
              type="button"
              aria-label={expanded ? "Ocultar sección trayecto nacional" : "Mostrar sección trayecto nacional"}
              onClick={onToggleCollapse}
              style={headerButtonStyle}
            >
              {expanded ? "▲ Ocultar" : "▼ Mostrar"}
            </button>
          )}
        </div>
      </div>

      {expanded && domestics.map((d, idx) => (
        <div
          key={d.id}
          style={{
            background: "var(--bg)",
            border: "2px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "var(--card-padding)",
            marginBottom: "var(--space-lg)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "var(--space-lg)",
            }}
          >
            <span style={{ fontSize: 16, color: "var(--warn)", fontWeight: "var(--section-title-weight)" }}>
              Nacional #{idx + 1}
            </span>
            <div style={{ display: "flex", gap: "var(--space-md)" }}>
              <button
                type="button"
                aria-label="Guardar trayecto nacional"
                onClick={() => onSave(d)}
                style={{
                  background: "var(--success-bg)",
                  border: "2px solid var(--success)",
                  borderRadius: "var(--radius-sm)",
                  padding: "var(--btn-padding-y) 18px",
                  color: "var(--success)",
                  fontSize: 15,
                  fontWeight: "var(--label-weight)",
                }}
              >
                💾 Guardar
              </button>
              {domestics.length > 1 && (
                <button
                  type="button"
                  aria-label="Eliminar trayecto nacional"
                  onClick={() => onDelete(d.id)}
                  style={{
                    background: "var(--error-bg)",
                    border: "2px solid var(--error)",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--btn-padding-y) 14px",
                    color: "var(--error)",
                    fontSize: 15,
                    fontWeight: "var(--label-weight)",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "var(--space-lg)",
            }}
          >
            <InputField
              small
              label="Descripción"
              value={d.label}
              onChange={(v) => onUpdate(d.id, "label", v)}
              placeholder="Bus Mérida-CCS"
              required
            />
            <InputField
              small
              label="Ciudad origen"
              value={d.cityOrigin}
              onChange={(v) => onUpdate(d.id, "cityOrigin", v)}
              placeholder="Mérida"
              required
            />
            <SelectField
              label="Transporte"
              value={d.transport}
              onChange={(v) => onUpdate(d.id, "transport", v)}
              options={["Bus", "Vuelo interno", "Carro", "Otro"]}
              required
            />
            <InputField
              small
              label="Duración (h)"
              value={d.durationHours}
              onChange={(v) => onUpdate(d.id, "durationHours", v)}
              type="number"
              placeholder="5"
              min="0"
              step="0.5"
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
                  label="Precio"
                  value={d.price}
                  onChange={(v) => onUpdate(d.id, "price", v)}
                  type="number"
                  placeholder="40"
                  min="0"
                  required
                />
              </div>
              <CurrencyToggle
                value={d.currency}
                onChange={(v) => onUpdate(d.id, "currency", v)}
              />
            </div>
          </div>
          <div style={{ marginTop: "var(--space-md)" }}>
            <InputField
              small
              label="Notas"
              value={d.notes}
              onChange={(v) => onUpdate(d.id, "notes", v)}
              placeholder="Sale viernes en la noche..."
            />
          </div>
        </div>
      ))}
    </div>
  );
}
