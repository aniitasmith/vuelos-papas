"use client";

import type { Domestic } from "@/lib/types";
import { InputField } from "./ui/InputField";
import { SelectField } from "./ui/SelectField";
import { CurrencyToggle } from "./ui/CurrencyToggle";

const btnBase =
  "rounded-sm border-2 px-5 py-3 text-base font-semibold";
const btnWarn = "border-[var(--warn)] bg-bg-card text-warn";
const btnSuccess = "rounded-sm border-2 border-success bg-success-bg px-[18px] py-3 text-[15px] font-semibold text-success";
const btnError = "rounded-sm border-2 border-error bg-error-bg px-3.5 py-3 text-[15px] font-semibold text-error";

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
    <div className="glass mb-5 box-border w-full border-0 border-l-4 border-warn p-5">
      <div
        className={`flex items-center justify-between ${expanded ? "mb-4" : "mb-0"}`}
      >
        <div>
          <span className="text-lg font-bold text-warn">
            🚌 Trayecto nacional · Ciudad → Caracas (CCS)
          </span>
          <div className="mt-1.5 text-[15px] text-text-secondary">
            Transporte hasta Maiquetía
          </div>
        </div>
        <div className="flex items-center gap-2">
          {expanded && (
            <button
              type="button"
              aria-label="Agregar opción de trayecto nacional"
              onClick={onAdd}
              className={`${btnBase} border-dashed border-warn bg-warn-bg text-warn`}
            >
              + Opción
            </button>
          )}
          {onToggleCollapse && (
            <button
              type="button"
              aria-label={
                expanded
                  ? "Ocultar sección trayecto nacional"
                  : "Mostrar sección trayecto nacional"
              }
              onClick={onToggleCollapse}
              className={`${btnBase} ${btnWarn}`}
            >
              {expanded ? "▲ Ocultar" : "▼ Mostrar"}
            </button>
          )}
        </div>
      </div>

      {expanded &&
        domestics.map((d, idx) => (
          <div
            key={d.id}
            className="mb-4 rounded-md border-2 border-border bg-bg p-5"
          >
            <div className="mb-4 flex justify-between">
              <span className="text-base font-bold text-warn">
                Nacional #{idx + 1}
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label="Guardar trayecto nacional"
                  onClick={() => onSave(d)}
                  className={btnSuccess}
                >
                  💾 Guardar
                </button>
                {domestics.length > 1 && (
                  <button
                    type="button"
                    aria-label="Eliminar trayecto nacional"
                    onClick={() => onDelete(d.id)}
                    className={btnError}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
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
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[80px] flex-1 basis-[80px]">
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
            <div className="mt-3">
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
