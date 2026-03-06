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
    <div className="glass box-border w-full border-0 border-l-4 border-accent p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="mr-4 flex-1">
          <input
            value={route.label}
            onChange={(e) => onUpdateRoute("label", e.target.value)}
            placeholder="Ej: Vía Cancún con Copa"
            className="w-full border-b-[3px] border-accent bg-transparent pb-2 text-xl font-bold text-text-primary outline-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            aria-label="Guardar ruta"
            onClick={() => onSave(route)}
            className="rounded-sm border-2 border-success bg-success-bg px-5 py-3 text-base font-semibold text-success"
          >
            💾 Guardar
          </button>
          {canDelete && (
            <button
              type="button"
              aria-label="Eliminar ruta"
              onClick={onDelete}
              className="rounded-sm border-2 border-error bg-error-bg px-[18px] py-3 text-base font-semibold text-error"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {domestics.length > 0 && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-text-secondary">
            Trayecto nacional para esta ruta
          </label>
          <select
            value={route.domesticId ?? ""}
            onChange={(e) =>
              onUpdateRoute("domesticId", e.target.value || undefined)
            }
            className="w-full rounded-sm border-2 border-border bg-bg-card px-4 py-3.5 text-base text-text-primary outline-none"
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

      <div className="mb-4">
        <span className="text-lg font-bold text-accent">
          ✈️ Trayecto internacional · CCS → destino final
        </span>
        <div className="mt-1.5 text-[15px] text-text-secondary">
          Tramos de vuelo
        </div>
      </div>

      <div className="pl-1">
        {route.legs.map((leg, legIdx) => (
          <div
            key={leg.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, legIdx)}
            className="relative"
          >
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, legIdx)}
              onDragEnd={handleDragEnd}
              title="Arrastrar para reordenar"
              className="absolute right-3 top-3 z-[2] cursor-grab select-none rounded-sm border-2 border-border bg-bg px-2 py-1.5 text-base leading-none text-text-muted"
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
              <div className="mb-5 ml-5 flex max-w-[280px] items-center gap-3 rounded-sm border-2 border-dashed border-border bg-bg p-3 px-4">
                <span className="whitespace-nowrap text-sm font-semibold text-text-secondary">
                  ⏱️ Espera en conexión
                </span>
                <input
                  type="number"
                  value={leg.layoverHours}
                  onChange={(e) =>
                    onUpdateLeg(leg.id, "layoverHours", parseFloat(e.target.value) || 0)
                  }
                  placeholder="2"
                  min={0}
                  step={0.5}
                  className="w-[72px] rounded-sm border-2 border-border bg-bg-card px-3 py-2.5 text-base text-text-primary outline-none"
                />
                <span className="text-sm font-semibold text-text-secondary">h</span>
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
          className="mt-3 w-full rounded-sm border-2 border-dashed border-accent bg-blue-100 px-5 py-3 text-base font-semibold text-accent"
        >
          + Agregar tramo
        </button>
      ) : (
        <p className="mt-3 text-sm font-semibold text-text-muted">
          Máximo {maxLegsPerRoute} tramos por ruta.
        </p>
      )}

      {route.legs.some((l) => l.price) && (
        <div className="mt-4 flex items-center justify-end gap-3 rounded-md border-2 border-border bg-bg py-3 px-[18px]">
          <span className="text-[15px] font-semibold text-text-secondary">
            Subtotal vuelos
          </span>
          <span className="text-lg font-extrabold text-accent">
            {fmt(routeTotalCAD(route, exchangeRate), displayCurrency, exchangeRate)}
          </span>
        </div>
      )}
    </div>
  );
}
