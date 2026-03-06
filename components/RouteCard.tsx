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
      style={{
        background: isTop ? "linear-gradient(135deg,#0f2027,#1a3a2a)" : "#0f1923",
        border: isTop ? "1.5px solid #00c48c" : "1px solid #1e2d3d",
        borderRadius: 16,
        padding: "18px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isTop && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "#00c48c",
            color: "#000",
            fontSize: 10,
            fontWeight: 700,
            padding: "4px 12px",
            borderBottomLeftRadius: 10,
            letterSpacing: 1,
            fontFamily: "'Courier Prime', monospace",
          }}
        >
          MEJOR OPCIÓN
        </div>
      )}

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            minWidth: 50,
          }}
        >
          <span
            style={{
              fontSize: rank <= 3 ? 22 : 15,
              fontFamily: "'Courier Prime', monospace",
              color: "#888",
            }}
          >
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
              gap: 4,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#e8f4f0",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {route.label || "Sin nombre"}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#00c48c",
                  fontFamily: "'Courier Prime', monospace",
                  marginTop: 2,
                  letterSpacing: 1,
                }}
              >
                ✈️ {path}
              </div>
            </div>
            {addedDate && (
              <span
                style={{
                  fontSize: 10,
                  color: "#3a5a4a",
                  fontFamily: "'Courier Prime', monospace",
                }}
              >
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
              marginTop: 10,
              background: "transparent",
              border: "1px solid #1e2d3d",
              borderRadius: 8,
              padding: "4px 12px",
              color: "#4a9e7f",
              fontSize: 11,
              fontFamily: "'Courier Prime', monospace",
            }}
          >
            {expanded ? "▲ Ocultar detalle" : "▼ Ver detalle de tramos"}
          </button>

          {expanded && (
            <div
              style={{
                marginTop: 12,
                borderTop: "1px solid #1e2d3d",
                paddingTop: 12,
              }}
            >
              {route.legs.map((l, i) => (
                <div
                  key={l.id}
                  style={{
                    marginBottom: 10,
                    paddingLeft: 12,
                    borderLeft: "2px solid #1e3d2d",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Courier Prime', monospace",
                      fontSize: 11,
                      color: "#4a9e7f",
                      marginBottom: 4,
                    }}
                  >
                    Tramo {i + 1}: {l.origin || "?"} → {l.destination || "?"}
                    {l.airline && (
                      <span style={{ color: "#6a8a7a" }}> · {l.airline}</span>
                    )}
                  </div>
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
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 11,
                        color: "#5a7a6a",
                        fontStyle: "italic",
                      }}
                    >
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
                    borderLeft: "2px solid #3d2e0a",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Courier Prime', monospace",
                      fontSize: 11,
                      color: "#f5a623",
                      marginBottom: 4,
                    }}
                  >
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
              marginTop: 14,
              paddingTop: 10,
              borderTop: "1px solid #1e2d3d33",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "'Courier Prime', monospace",
                color: "#6a8a7a",
                fontSize: 11,
              }}
            >
              TOTAL
            </span>
            <span
              style={{
                fontFamily: "'Courier Prime', monospace",
                color: "#00c48c",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {fmt(grandTotalCAD, displayCurrency, exchangeRate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
