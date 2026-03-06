"use client";

import { useEffect, useRef } from "react";
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

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (hasBothTimes && calculatedHours !== null) {
      onChangeRef.current("flightHours", calculatedHours);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only sync flightHours from times
  }, [dep, arr, hasBothTimes, calculatedHours]);

  const badgeStyle =
    idx === 0
      ? "border-success bg-success-bg text-success"
      : isLast
        ? "border-accent bg-blue-100 text-accent"
        : "border-warn bg-warn-bg text-warn";

  return (
    <div className="relative">
      {!isLast && (
        <div
          className="absolute left-5 -bottom-[18px] z-[1] h-[18px] w-0.5 opacity-40"
          style={{
            background: "linear-gradient(var(--accent), var(--text-muted))",
          }}
        />
      )}
      <div className="glass mb-5 p-5">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-base font-bold ${badgeStyle}`}
          >
            {idx + 1}
          </div>
          <span className="text-[15px] font-semibold text-text-secondary">
            Tramo {idx + 1}
            {idx === 0 ? " · Salida" : isLast ? " · Llegada" : " · Conexión"}
          </span>
          {total > 2 && (
            <button
              type="button"
              onClick={onRemove}
              className="ml-auto border-none bg-transparent px-2 py-1 text-lg font-semibold text-error"
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
          <div className="pb-2 text-[22px] font-bold text-accent">→</div>
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

        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 items-start">
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
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[80px] flex-1 basis-[80px]">
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
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-secondary">
              Horas de vuelo
              {hasBothTimes ? (
                <span className="ml-1.5 font-medium text-text-muted">
                  (calculado)
                </span>
              ) : (
                <span className="text-error"> *</span>
              )}
            </label>
            <input
              type="number"
              value={leg.flightHours}
              onChange={(e) =>
                onChange("flightHours", parseFloat(e.target.value) || 0)
              }
              placeholder="3.5"
              min={0}
              step={0.5}
              readOnly={hasBothTimes}
              className={`w-full rounded-sm border-2 border-border px-3.5 py-3 text-base text-text-primary outline-none ${
                hasBothTimes ? "cursor-default bg-bg" : "bg-bg-card"
              }`}
            />
          </div>
        </div>

        <div className="mt-3">
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
