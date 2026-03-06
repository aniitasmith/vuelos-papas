"use client";

import { useState } from "react";
import type { Route, Domestic, Currency } from "@/lib/types";
import { fmt, toCAD, routeTotalCAD, routeTotalHours, routeStops } from "@/lib/flightUtils";
import { Pill } from "./ui/Pill";
import { ScoreBadge } from "./ui/ScoreBadge";

export function RouteCard({
  route,
  domestic,
  rank,
  score,
  isTop,
  displayCurrency,
  exchangeRate,
}: {
  route: Route;
  domestic: Domestic | null;
  rank: number;
  score: number;
  isTop: boolean;
  displayCurrency: Currency;
  exchangeRate: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const medals = ["🥇", "🥈", "🥉"];
  const totalCAD = routeTotalCAD(route, exchangeRate);
  const totalHours = routeTotalHours(route);
  const stops = routeStops(route);
  const domCAD = domestic?.price
    ? toCAD(domestic.price, domestic.currency, exchangeRate)
    : 0;
  const grandTotalCAD = totalCAD + domCAD;
  const addedDate = route.createdAt
    ? new Date(route.createdAt).toLocaleDateString("es-VE", {
        day: "2-digit",
        month: "short",
      })
    : "";

  const path = route.legs.length
    ? [route.legs[0].origin, ...route.legs.map((l) => l.destination)]
        .filter(Boolean)
        .join(" → ")
    : "Sin tramos";

  return (
    <div
      className="glass"
      style={{
        width: "100%",
        background: "var(--bg-card)",
        border: isTop ? "3px solid var(--success)" : "2px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "var(--card-padding)",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {isTop && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "var(--success)",
            color: "#fff",
            fontSize: "var(--section-title-size)",
            fontWeight: 800,
            padding: "var(--space-sm) 18px",
            borderBottomLeftRadius: "var(--radius-sm)",
          }}
        >
          Mejor opción
        </div>
      )}

      <div style={{ display: "flex", gap: "var(--space-xl)", alignItems: "flex-start" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            minWidth: 56,
          }}
        >
          <span style={{ fontSize: rank <= 3 ? 28 : 18, fontWeight: 700, color: "var(--text-secondary)" }}>
            {rank <= 3 ? medals[rank - 1] : `#${rank}`}
          </span>
          <ScoreBadge score={score} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
                {route.label || "Sin nombre"}
              </div>
              <div style={{ fontSize: 16, color: "var(--accent)", fontWeight: 600, marginTop: 4 }}>
                ✈️ {path}
              </div>
            </div>
            {addedDate && (
              <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600 }}>
                agregado {addedDate}
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap" as const,
              marginTop: 10,
            }}
          >
            <Pill icon="🔗" label={`${stops} conexión(es)`} />
            <Pill icon="✈️" label={`${route.legs.length} tramo(s)`} />
            <Pill icon="⏱" label={`${totalHours.toFixed(1)}h total`} accent />
            <Pill
              icon="💵"
              label={`Vuelos: ${fmt(totalCAD, displayCurrency, exchangeRate)}`}
              green
            />
            {domCAD > 0 && (
              <Pill
                icon="🚌"
                label={`Nacional: ${fmt(domCAD, displayCurrency, exchangeRate)}`}
                warn
              />
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap" as const,
              marginTop: 6,
            }}
          >
            {route.legs.map((l, i) => (
              <Pill
                key={l.id}
                dim
                icon={`${i + 1}.`}
                label={`${l.origin || "?"} → ${l.destination || "?"}: ${
                  l.price
                    ? fmt(
                        toCAD(l.price, l.currency, exchangeRate),
                        displayCurrency,
                        exchangeRate
                      )
                    : "sin precio"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setExpanded((e) => !e)}
            style={{
              marginTop: "var(--space-lg)",
              background: "#dbeafe",
              border: "2px solid var(--accent)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--btn-padding-y) 18px",
              color: "var(--accent)",
              fontSize: 15,
              fontWeight: "var(--label-weight)",
            }}
          >
            {expanded ? "▲ Ocultar detalle" : "▼ Ver detalle de tramos"}
          </button>

          {expanded && (
            <div
              style={{
                marginTop: "var(--space-md)",
                borderTop: "2px solid var(--border)",
                paddingTop: "var(--space-md)",
              }}
            >
              {route.legs.map((l, i) => (
                <div
                  key={l.id}
                  style={{
                    marginBottom: 10,
                    paddingLeft: 12,
                    borderLeft: "3px solid var(--accent)",
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--accent)", marginBottom: 6 }}>
                    Tramo {i + 1}: {l.origin || "?"} → {l.destination || "?"}
                    {l.airline && (
                      <span style={{ color: "var(--text-secondary)" }}> · {l.airline}</span>
                    )}
                  </div>
                  {(l.date || l.time || l.timeArrival) && (
                    <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 6 }}>
                      📅 {l.date ? new Date(l.date + "T12:00:00").toLocaleDateString("es-VE", { weekday: "short", day: "numeric", month: "short" }) : ""}
                      {(l.date && (l.time || l.timeArrival)) ? " · " : ""}
                      {l.time && l.timeArrival ? `🕐 Salida ${l.time} → Llegada ${l.timeArrival}` : l.time ? `🕐 Salida ${l.time}` : l.timeArrival ? `🕐 Llegada ${l.timeArrival}` : ""}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap" as const,
                    }}
                  >
                    {l.flightHours > 0 && (
                      <Pill icon="🕐" label={`${l.flightHours}h vuelo`} />
                    )}
                    {l.layoverHours > 0 && (
                      <Pill
                        icon="⏳"
                        label={`${l.layoverHours}h espera`}
                        accent
                      />
                    )}
                    {l.price && (
                      <Pill
                        icon="💵"
                        label={fmt(
                          toCAD(l.price, l.currency, exchangeRate),
                          displayCurrency,
                          exchangeRate
                        )}
                        green
                      />
                    )}
                  </div>
                  {l.notes && (
                    <div style={{ marginTop: 6, fontSize: 14, color: "var(--text-muted)", fontStyle: "italic" }}>
                      {l.notes}
                    </div>
                  )}
                </div>
              ))}

              {domestic?.price && (
                <div
                  style={{
                    marginTop: 8,
                    paddingLeft: 12,
                    borderLeft: "3px solid var(--warn)",
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--warn)", marginBottom: 6 }}>
                    Nacional: {domestic.cityOrigin || "Ciudad"} → CCS ·{" "}
                    {domestic.transport}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap" as const,
                    }}
                  >
                    {domestic.durationHours > 0 && (
                      <Pill icon="⏱" label={`${domestic.durationHours}h`} accent />
                    )}
                    <Pill
                      icon="💵"
                      label={fmt(domCAD, displayCurrency, exchangeRate)}
                      warn
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div
            style={{
              marginTop: "var(--space-xl)",
              paddingTop: "var(--space-lg)",
              borderTop: "2px solid var(--border)",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "var(--space-md)",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: "var(--section-title-weight)", color: "var(--text-secondary)" }}>
              Total
            </span>
            <span style={{ fontSize: 24, fontWeight: 800, color: "var(--success)" }}>
              {fmt(grandTotalCAD, displayCurrency, exchangeRate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
