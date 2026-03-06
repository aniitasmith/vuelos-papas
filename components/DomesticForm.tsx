"use client";

import type { Domestic } from "@/lib/types";
import { InputField } from "./ui/InputField";
import { SelectField } from "./ui/SelectField";
import { CurrencyToggle } from "./ui/CurrencyToggle";

export function DomesticForm({
  domestics,
  onUpdate,
  onAdd,
  onSave,
  onDelete,
}: {
  domestics: Domestic[];
  onUpdate: (id: string, field: keyof Domestic, value: string | number) => void;
  onAdd: () => void;
  onSave: (d: Domestic) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      style={{
        background: "#0b1210",
        border: "1px solid #2d2a1a",
        borderRadius: 14,
        padding: 18,
        marginBottom: 16,
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
        <div>
          <span
            style={{
              fontFamily: "'Courier Prime', monospace",
              color: "#f5a623",
              fontWeight: 700,
            }}
          >
            🚌 TRAYECTO NACIONAL · Ciudad → Caracas (CCS)
          </span>
          <div style={{ fontSize: 11, color: "#5a4a2a", marginTop: 2 }}>
            Transporte hasta Maiquetía
          </div>
        </div>
        <button
          onClick={onAdd}
          style={{
            background: "transparent",
            border: "1px dashed #3d2e0a",
            borderRadius: 8,
            padding: "5px 12px",
            color: "#f5a623",
            fontSize: 11,
            fontFamily: "'Courier Prime', monospace",
          }}
        >
          + Opción
        </button>
      </div>

      {domestics.map((d, idx) => (
        <div
          key={d.id}
          style={{
            background: "#060e0a",
            border: "1px solid #2a2510",
            borderRadius: 12,
            padding: 14,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontFamily: "'Courier Prime', monospace",
                color: "#f5a623",
                fontSize: 11,
              }}
            >
              Nacional #{idx + 1}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => onSave(d)}
                style={{
                  background: "#0d2e1f",
                  border: "1px solid #00c48c44",
                  borderRadius: 6,
                  padding: "3px 10px",
                  color: "#00c48c",
                  fontSize: 11,
                  fontFamily: "'Courier Prime', monospace",
                }}
              >
                💾 Guardar
              </button>
              {domestics.length > 1 && (
                <button
                  onClick={() => onDelete(d.id)}
                  style={{
                    background: "#1a0a0a",
                    border: "1px solid #3d1e1e",
                    borderRadius: 6,
                    padding: "3px 8px",
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 10,
            }}
          >
            <InputField
              small
              label="Descripción"
              value={d.label}
              onChange={(v) => onUpdate(d.id, "label", v)}
              placeholder="Bus Mérida-CCS"
            />
            <InputField
              small
              label="Ciudad origen"
              value={d.cityOrigin}
              onChange={(v) => onUpdate(d.id, "cityOrigin", v)}
              placeholder="Mérida"
            />
            <SelectField
              label="Transporte"
              value={d.transport}
              onChange={(v) => onUpdate(d.id, "transport", v)}
              options={["Bus", "Vuelo interno", "Carro", "Otro"]}
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
            <div>
              <InputField
                small
                label="Precio"
                value={d.price}
                onChange={(v) => onUpdate(d.id, "price", v)}
                type="number"
                placeholder="40"
                min="0"
              />
              <div style={{ marginTop: 5 }}>
                <CurrencyToggle
                  value={d.currency}
                  onChange={(v) => onUpdate(d.id, "currency", v)}
                />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
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
