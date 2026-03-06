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
      className={`glass relative w-full overflow-hidden rounded-md p-5 box-border ${
        isTop ? "border-[3px] border-success" : "border-2 border-border"
      }`}
    >
      {isTop && (
        <div className="absolute right-0 top-0 rounded-bl-sm bg-success px-[18px] py-2 text-sm font-extrabold text-white">
          Mejor opción
        </div>
      )}

      <div className="flex items-start gap-5">
        <div className="flex min-w-[56px] flex-col items-center gap-2">
          <span
            className={`font-bold text-text-secondary ${
              rank <= 3 ? "text-[28px]" : "text-lg"
            }`}
          >
            {rank <= 3 ? medals[rank - 1] : `#${rank}`}
          </span>
          <ScoreBadge score={score} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-[22px] font-extrabold text-text-primary">
                {route.label || "Sin nombre"}
              </div>
              <div className="mt-1 text-base font-semibold text-accent">
                ✈️ {path}
              </div>
            </div>
            {addedDate && (
              <span className="text-sm font-semibold text-text-muted">
                agregado {addedDate}
              </span>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
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

          <div className="mt-1.5 flex flex-wrap gap-1.5">
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
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-4 rounded-sm border-2 border-accent bg-blue-100 px-[18px] py-3 text-[15px] font-semibold text-accent"
          >
            {expanded ? "▲ Ocultar detalle" : "▼ Ver detalle de tramos"}
          </button>

          {expanded && (
            <div className="mt-3 border-t-2 border-border pt-3">
              {route.legs.map((l, i) => (
                <div
                  key={l.id}
                  className="mb-2.5 border-l-[3px] border-accent pl-3"
                >
                  <div className="mb-1.5 text-[15px] font-semibold text-accent">
                    Tramo {i + 1}: {l.origin || "?"} → {l.destination || "?"}
                    {l.airline && (
                      <span className="text-text-secondary"> · {l.airline}</span>
                    )}
                  </div>
                  {(l.date || l.time || l.timeArrival) && (
                    <div className="mb-1.5 text-sm text-text-secondary">
                      📅{" "}
                      {l.date
                        ? new Date(l.date + "T12:00:00").toLocaleDateString(
                            "es-VE",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            }
                          )
                        : ""}
                      {l.date && (l.time || l.timeArrival) ? " · " : ""}
                      {l.time && l.timeArrival
                        ? `🕐 Salida ${l.time} → Llegada ${l.timeArrival}`
                        : l.time
                          ? `🕐 Salida ${l.time}`
                          : l.timeArrival
                            ? `🕐 Llegada ${l.timeArrival}`
                            : ""}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {l.flightHours > 0 && (
                      <Pill icon="🕐" label={`${l.flightHours}h vuelo`} />
                    )}
                    {l.layoverHours > 0 && (
                      <Pill icon="⏳" label={`${l.layoverHours}h espera`} accent />
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
                    <div className="mt-1.5 text-sm italic text-text-muted">
                      {l.notes}
                    </div>
                  )}
                </div>
              ))}

              {domestic?.price && (
                <div className="mt-2 border-l-[3px] border-warn pl-3">
                  <div className="mb-1.5 text-[15px] font-semibold text-warn">
                    Nacional: {domestic.cityOrigin || "Ciudad"} → CCS ·{" "}
                    {domestic.transport}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {domestic.durationHours > 0 && (
                      <Pill
                        icon="⏱"
                        label={`${domestic.durationHours}h`}
                        accent
                      />
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

          <div className="mt-5 flex items-center justify-end gap-3 border-t-2 border-border pt-4">
            <span className="text-base font-bold text-text-secondary">
              Total
            </span>
            <span className="text-2xl font-extrabold text-success">
              {fmt(grandTotalCAD, displayCurrency, exchangeRate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
