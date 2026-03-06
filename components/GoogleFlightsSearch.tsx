"use client";

import { useState } from "react";

const GOOGLE_FLIGHTS_BASE = "https://www.google.com/travel/flights";

function buildGoogleFlightsUrl(origin: string, destination: string, outbound?: string, returnDate?: string): string {
  const o = (origin || "CCS").toUpperCase();
  const d = (destination || "YYZ").toUpperCase();
  if (!outbound) {
    const q = `Flights to ${d} from ${o}`;
    return `${GOOGLE_FLIGHTS_BASE}?q=${encodeURIComponent(q)}`;
  }
  const q = returnDate
    ? `Flights to ${d} from ${o} on ${outbound} through ${returnDate}`
    : `Flights to ${d} from ${o} on ${outbound}`;
  return `${GOOGLE_FLIGHTS_BASE}?q=${encodeURIComponent(q)}`;
}

const inputClass =
  "w-full rounded-sm border-2 border-border bg-bg-card px-4 py-3.5 text-base text-text-primary outline-none";
const labelClass = "mb-1.5 block text-sm font-semibold text-text-secondary";

export function GoogleFlightsSearch() {
  const [origin, setOrigin] = useState("CCS");
  const [destination, setDestination] = useState("YYZ");
  const [outbound, setOutbound] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const url = buildGoogleFlightsUrl(origin, destination, outbound || undefined, returnDate || undefined);

  const openSearch = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="glass mb-5 box-border w-full border-l-4 border-accent p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-[28px]">🔍</span>
        <span className="text-lg font-bold text-accent">
          Buscador de vuelos
        </span>
      </div>
      <p className="mb-5 text-base font-semibold text-text-secondary">
        Abre Google Flights con la ruta y fechas que elijas. No hay API: solo un enlace directo.
      </p>
      <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
        <div>
          <label className={labelClass}>Origen</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            placeholder="CCS"
            maxLength={3}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Destino</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            placeholder="YYZ"
            maxLength={3}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Ida</label>
          <input
            type="date"
            value={outbound}
            onChange={(e) => setOutbound(e.target.value)}
            min={today}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Vuelta</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={outbound || today}
            className={inputClass}
          />
        </div>
      </div>
      <button
        type="button"
        aria-label="Abrir búsqueda en Google Flights en nueva pestaña"
        onClick={openSearch}
        className="inline-flex cursor-pointer items-center gap-3 rounded-sm border-none bg-accent px-7 py-3 text-lg font-bold text-white"
      >
        🔍 Buscar en Google Flights
      </button>
    </div>
  );
}
