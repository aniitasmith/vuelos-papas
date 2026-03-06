"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { AppData, Route, Leg, Domestic, Currency } from "@/lib/types";
import {
  toCAD,
  fmt,
  now,
  emptyLeg,
  emptyRoute,
  emptyDomestic,
  routeTotalCAD,
  routeTotalHours,
  routeStops,
  WEIGHTS,
} from "@/lib/flightUtils";
import { ConfigBar } from "./ConfigBar";
import { DomesticForm } from "./DomesticForm";
import { RouteForm } from "./RouteForm";
import { RouteCard } from "./RouteCard";

const DEFAULT_EXCHANGE_RATE = 1.39;

export default function FlightApp({ initialData }: { initialData: AppData }) {
  const [routes, setRoutes] = useState<Route[]>(
    initialData.routes?.length ? initialData.routes : [emptyRoute()]
  );
  const [domestics, setDomestics] = useState<Domestic[]>(
    initialData.domestics?.length ? initialData.domestics : [emptyDomestic()]
  );
  const [priority, setPriority] = useState(initialData.priority ?? "price");
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(
    initialData.displayCurrency ?? "USD"
  );
  const [exchangeRate, setExchangeRate] = useState<number>(
    typeof initialData.exchangeRateUSDToCAD === "number"
      ? initialData.exchangeRateUSDToCAD
      : DEFAULT_EXCHANGE_RATE
  );
  const [showForm, setShowForm] = useState(true);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priority,
          displayCurrency,
          exchangeRateUSDToCAD: exchangeRate,
        }),
      }).catch(() => {});
    }, 600);
    return () => clearTimeout(t);
  }, [priority, displayCurrency, exchangeRate]);

  const persist = useCallback(
    async (endpoint: string, method: string, body: unknown) => {
      setSaveStatus("saving");
      setErrorMessage(null);
      try {
        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg =
            typeof data?.error === "string"
              ? data.error
              : "Error al guardar. Revisá los datos.";
          setErrorMessage(msg);
          setSaveStatus("error");
          setTimeout(() => {
            setSaveStatus("idle");
            setErrorMessage(null);
          }, 4000);
          return;
        }
        setRoutes(
          (data as AppData).routes?.length
            ? (data as AppData).routes
            : [emptyRoute()]
        );
        setDomestics(
          (data as AppData).domestics?.length
            ? (data as AppData).domestics
            : [emptyDomestic()]
        );
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setErrorMessage("Error de red. ¿Tenés conexión?");
        setSaveStatus("error");
        setTimeout(() => {
          setSaveStatus("idle");
          setErrorMessage(null);
        }, 4000);
      }
    },
    []
  );

  const updateRoute = (routeId: string, field: keyof Route, value: string | undefined) =>
    setRoutes((rs) =>
      rs.map((r) =>
        r.id === routeId ? { ...r, [field]: value, updatedAt: now() } : r
      )
    );

  const updateLeg = (
    routeId: string,
    legId: string,
    field: keyof Leg,
    value: string | number
  ) =>
    setRoutes((rs) =>
      rs.map((r) =>
        r.id !== routeId
          ? r
          : {
              ...r,
              updatedAt: now(),
              legs: r.legs.map((l) =>
                l.id === legId ? { ...l, [field]: value } : l
              ),
            }
      )
    );

  const addLeg = (routeId: string) =>
    setRoutes((rs) =>
      rs.map((r) =>
        r.id !== routeId
          ? r
          : { ...r, updatedAt: now(), legs: [...r.legs, emptyLeg()] }
      )
    );

  const removeLeg = (routeId: string, legId: string) =>
    setRoutes((rs) =>
      rs.map((r) =>
        r.id !== routeId
          ? r
          : {
              ...r,
              updatedAt: now(),
              legs: r.legs.filter((l) => l.id !== legId),
            }
      )
    );

  const updateDomestic = (
    id: string,
    field: keyof Domestic,
    value: string | number
  ) =>
    setDomestics((ds) =>
      ds.map((d) =>
        d.id === id ? { ...d, [field]: value, updatedAt: now() } : d
      )
    );

  const getDomesticForRoute = (route: Route): Domestic | null => {
    if (route.domesticId) {
      const d = domestics.find((x) => x.id === route.domesticId);
      if (d) return d;
    }
    return domestics[0] ?? null;
  };

  const scored = useMemo(() => {
    const valid = routes.filter((r) =>
      r.legs.some((l) => l.price && parseFloat(String(l.price)) > 0)
    );
    if (!valid.length) return [];

    const combined = valid.map((r) => {
      const dom = getDomesticForRoute(r);
      const flightCAD = routeTotalCAD(r, exchangeRate);
      const domCAD = dom?.price
        ? toCAD(dom.price, dom.currency, exchangeRate)
        : 0;
      return {
        route: r,
        domestic: dom,
        totalCAD: flightCAD + domCAD,
        totalHours: routeTotalHours(r),
        stops: routeStops(r),
      };
    });

    const prices = combined.map((c) => c.totalCAD);
    const stops = combined.map((c) => c.stops);
    const hours = combined.map((c) => c.totalHours);
    const norm = (v: number, min: number, max: number) =>
      max === min ? 1 : 1 - (v - min) / (max - min);
    const w = WEIGHTS[priority] ?? WEIGHTS.price;
    const [minP, maxP] = [Math.min(...prices), Math.max(...prices)];
    const [minS, maxS] = [Math.min(...stops), Math.max(...stops)];
    const [minH, maxH] = [Math.min(...hours), Math.max(...hours)];

    return combined
      .map((c) => ({
        ...c,
        score: Math.round(
          (norm(c.totalCAD, minP, maxP) * w.price +
            norm(c.stops, minS, maxS) * w.stops +
            norm(c.totalHours, minH, maxH) * w.duration) *
            100
        ),
      }))
      .sort((a, b) => b.score - a.score);
  }, [routes, domestics, priority, exchangeRate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060e17",
        color: "#c8ddd5",
        padding: "28px 16px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              fontSize: 11,
              color: "#00c48c",
              letterSpacing: 3,
              fontFamily: "'Courier Prime', monospace",
              marginBottom: 6,
            }}
          >
            COMPARADOR DE RUTAS
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32,
              margin: 0,
              color: "#e8f4f0",
            }}
          >
            ✈️ Vuelos para mis papás
          </h1>
          <p style={{ color: "#4a7a6a", marginTop: 6, fontSize: 13 }}>
            Venezuela → Caracas (CCS) → Toronto (YYZ)
          </p>
        </div>

        <ConfigBar
          priority={priority}
          setPriority={setPriority}
          displayCurrency={displayCurrency}
          setDisplayCurrency={setDisplayCurrency}
          exchangeRate={exchangeRate}
          setExchangeRate={setExchangeRate}
          saveStatus={saveStatus}
          errorMessage={errorMessage}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#e8f4f0",
              margin: 0,
              fontSize: 20,
            }}
          >
            Ingresar opciones
          </h2>
          <button
            onClick={() => setShowForm((s) => !s)}
            style={{
              background: "transparent",
              border: "1px solid #1e2d3d",
              borderRadius: 8,
              padding: "5px 12px",
              color: "#4a9e7f",
              fontSize: 12,
              fontFamily: "'Courier Prime', monospace",
            }}
          >
            {showForm ? "▲ Ocultar" : "▼ Mostrar"}
          </button>
        </div>

        {showForm && (
          <>
            <DomesticForm
              domestics={domestics}
              onUpdate={updateDomestic}
              onAdd={() => setDomestics((ds) => [...ds, emptyDomestic()])}
              onSave={(d) => persist("/api/domestic", "POST", d)}
              onDelete={(id) => persist("/api/domestic", "DELETE", { id })}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: 16,
                marginBottom: 20,
              }}
            >
              {routes.map((route) => (
                <RouteForm
                  key={route.id}
                  route={route}
                  domestics={domestics}
                  displayCurrency={displayCurrency}
                  exchangeRate={exchangeRate}
                  onUpdateRoute={(field, value) =>
                    updateRoute(route.id, field, value)
                  }
                  onUpdateLeg={(legId, field, value) =>
                    updateLeg(route.id, legId, field, value)
                  }
                  onAddLeg={() => addLeg(route.id)}
                  onRemoveLeg={(legId) => removeLeg(route.id, legId)}
                  onSave={(r) => persist("/api/flights", "POST", r)}
                  onDelete={() =>
                    persist("/api/flights", "DELETE", { id: route.id })
                  }
                  canDelete={routes.length > 1}
                />
              ))}

              <button
                onClick={() => setRoutes((rs) => [...rs, emptyRoute()])}
                style={{
                  background: "transparent",
                  border: "2px dashed #1e3d2d",
                  borderRadius: 14,
                  padding: 14,
                  color: "#00c48c",
                  fontSize: 13,
                  fontFamily: "'Courier Prime', monospace",
                }}
              >
                + Agregar otra ruta
              </button>
            </div>
          </>
        )}

        {scored.length > 0 && (
          <div>
            <div
              style={{
                borderTop: "1px solid #1e2d3d",
                paddingTop: 20,
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#e8f4f0",
                  margin: 0,
                  fontSize: 22,
                }}
              >
                🏆 Ranking de rutas
              </h2>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg,#002a1a,#001a2a)",
                border: "1px solid #00c48c44",
                borderRadius: 14,
                padding: "14px 20px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#4a9e7f",
                  letterSpacing: 1,
                  fontFamily: "'Courier Prime', monospace",
                }}
              >
                RECOMENDACIÓN
              </div>
              <div
                style={{
                  fontSize: 19,
                  color: "#e8f4f0",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                {scored[0].route.label || "Ruta 1"}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#4a9e7f",
                  marginTop: 4,
                  fontFamily: "'Courier Prime', monospace",
                }}
              >
                {[
                  scored[0].route.legs[0]?.origin,
                  ...scored[0].route.legs.map((l) => l.destination),
                ]
                  .filter(Boolean)
                  .join(" → ")}{" "}
                · {scored[0].stops} conexión(es) ·{" "}
                {scored[0].totalHours.toFixed(1)}h ·{" "}
                {fmt(
                  scored[0].totalCAD,
                  displayCurrency,
                  exchangeRate
                )}{" "}
                total
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: 12,
              }}
            >
              {scored.map((c, i) => (
                <RouteCard
                  key={c.route.id}
                  route={c.route}
                  domestic={c.domestic}
                  rank={i + 1}
                  score={c.score}
                  isTop={i === 0}
                  displayCurrency={displayCurrency}
                  exchangeRate={exchangeRate}
                />
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                padding: "12px 16px",
                background: "#0a1520",
                borderRadius: 10,
                border: "1px solid #1e2d3d",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "#4a6a5a",
                  fontFamily: "'Courier Prime', monospace",
                  lineHeight: 1.9,
                }}
              >
                💱 Tasa: <strong style={{ color: "#4a9e7f" }}>1 USD = {exchangeRate} CAD</strong> ·
                Actualizala en la barra de arriba.<br />
                💾 Los datos persisten en la nube — podés volver mañana y seguir
                comparando.<br />
                💡 Para adultos mayores considerá{" "}
                <strong style={{ color: "#00c48c" }}>🛋️ Comodidad</strong> —
                menos conexiones = menos estrés.
              </p>
            </div>
          </div>
        )}

        {scored.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#2a4a3a",
              fontFamily: "'Courier Prime', monospace",
            }}
          >
            ↑ Completá y guardá al menos una ruta con precio para ver el ranking
          </div>
        )}
      </div>
    </div>
  );
}
