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

  const inputStyle = {
    width: "100%" as const,
    background: "var(--bg-card)",
    border: "2px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "14px 16px",
    color: "var(--text-primary)",
    fontSize: "var(--input-font)",
    outline: "none",
  };
  const labelStyle = {
    display: "block" as const,
    fontSize: "var(--label-size)",
    fontWeight: "var(--label-weight)",
    color: "var(--text-secondary)",
    marginBottom: "var(--space-xs)",
  };

  return (
    <div
      className="glass"
      style={{
        width: "100%",
        padding: "var(--card-padding)",
        marginBottom: "var(--space-xl)",
        borderLeft: "4px solid var(--accent)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <span style={{ fontSize: 28 }}>🔍</span>
        <span style={{ fontSize: 18, color: "var(--accent)", fontWeight: "var(--section-title-weight)" }}>
          Buscador de vuelos
        </span>
      </div>
      <p style={{ margin: "0 0 var(--space-xl) 0", fontSize: 16, color: "var(--text-secondary)", fontWeight: "var(--label-weight)" }}>
        Abre Google Flights con la ruta y fechas que elijas. No hay API: solo un enlace directo.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "var(--space-lg)",
          marginBottom: "var(--space-xl)",
        }}
      >
        <div>
          <label style={labelStyle}>Origen</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            placeholder="CCS"
            maxLength={3}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Destino</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            placeholder="YYZ"
            maxLength={3}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Ida</label>
          <input
            type="date"
            value={outbound}
            onChange={(e) => setOutbound(e.target.value)}
            min={today}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Vuelta</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={outbound || today}
            style={inputStyle}
          />
        </div>
      </div>
      <button
        type="button"
        aria-label="Abrir búsqueda en Google Flights en nueva pestaña"
        onClick={openSearch}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-md)",
          background: "var(--accent)",
          border: "none",
          borderRadius: "var(--radius-sm)",
          padding: "var(--btn-padding-y) 28px",
          color: "#fff",
          fontSize: 18,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        🔍 Buscar en Google Flights
      </button>
    </div>
  );
}
