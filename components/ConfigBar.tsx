"use client";

import type { Currency, Priority } from "@/lib/types";
import { PRIORITY_OPTIONS } from "@/lib/flightUtils";
import { CurrencyToggle } from "./ui/CurrencyToggle";
import { InputField } from "./ui/InputField";

export function ConfigBar({
  priority,
  setPriority,
  displayCurrency,
  setDisplayCurrency,
  exchangeRate,
  setExchangeRate,
}: {
  priority: Priority;
  setPriority: (p: Priority) => void;
  displayCurrency: Currency;
  setDisplayCurrency: (c: Currency) => void;
  exchangeRate: number;
  setExchangeRate: (r: number) => void;
}) {
  return (
    <div className="glass mb-5 flex w-full flex-wrap items-end justify-between gap-6 p-5">
      <div className="min-w-0 flex-1 basis-[200px]">
        <div className="mb-2 text-sm font-bold text-text-secondary">
          Prioridad
        </div>
        <div className="flex flex-wrap gap-3">
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-label={`Prioridad: ${opt.label}`}
              aria-pressed={priority === opt.value}
              onClick={() => setPriority(opt.value as Priority)}
              className={`rounded-sm border-2 px-5 py-3 text-[15px] font-semibold ${
                priority === opt.value
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-bg text-text-secondary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-end justify-end gap-6">
        <div className="flex min-w-[90px] flex-col gap-2">
          <div className="text-sm font-bold text-text-secondary">
            Ver en
          </div>
          <CurrencyToggle value={displayCurrency} onChange={setDisplayCurrency} />
        </div>
        <div className="min-w-[140px]">
          <div className="mb-2 text-sm font-bold text-text-secondary">
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
      </div>
    </div>
  );
}
