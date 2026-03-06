"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AppData, Currency, Priority } from "@/lib/types";
import { fmt, emptyRoute, emptyDomestic } from "@/lib/flightUtils";
import { useRoutes } from "@/hooks/useFlightApp";
import { useDomestics } from "@/hooks/useFlightApp";
import { useScoredRoutes } from "@/hooks/useFlightApp";
import { usePersist } from "@/hooks/useFlightApp";
import { ConfigBar } from "./ConfigBar";
import { DomesticForm } from "./DomesticForm";
import { RouteForm } from "./RouteForm";
import { RouteCard } from "./RouteCard";
import { SaveNotification } from "./ui/SaveNotification";

const DEFAULT_EXCHANGE_RATE = 1.39;
const MAX_ROUTES = 20;
const MAX_LEGS_PER_ROUTE = 10;

export default function FlightApp({ initialData }: { initialData: AppData }) {
  const [priority, setPriority] = useState<Priority>(
    (initialData.priority as Priority) ?? "price"
  );
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(
    initialData.displayCurrency ?? "USD"
  );
  const [exchangeRate, setExchangeRate] = useState<number>(
    typeof initialData.exchangeRateUSDToCAD === "number"
      ? initialData.exchangeRateUSDToCAD
      : DEFAULT_EXCHANGE_RATE
  );
  const [showForm, setShowForm] = useState(true);
  const [showDomesticSection, setShowDomesticSection] = useState(true);
  const [configSaveStatus, setConfigSaveStatus] = useState<
    "idle" | "pending" | "saving" | "saved" | "error"
  >("idle");
  const [configErrorMessage, setConfigErrorMessage] = useState<string | null>(
    null
  );
  const configSavingDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    routes,
    setRoutes,
    updateRoute,
    updateLeg,
    addLeg,
    removeLeg,
    reorderLegs,
    addRoute,
  } = useRoutes(initialData.routes ?? []);

  const { domestics, setDomestics, updateDomestic, addDomestic } = useDomestics(
    initialData.domestics ?? []
  );

  const { persist, saveStatus, errorMessage, saveContext } = usePersist(
    setRoutes,
    setDomestics
  );

  const scored = useScoredRoutes(routes, domestics, priority, exchangeRate);

  const CONFIG_SAVING_DELAY_MS = 400;

  useEffect(() => {
    const t = setTimeout(() => {
      setConfigErrorMessage(null);
      setConfigSaveStatus("pending");
      if (configSavingDelayRef.current) clearTimeout(configSavingDelayRef.current);
      configSavingDelayRef.current = setTimeout(() => {
        configSavingDelayRef.current = null;
        setConfigSaveStatus("saving");
      }, CONFIG_SAVING_DELAY_MS);

      fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priority,
          displayCurrency,
          exchangeRateUSDToCAD: exchangeRate,
        }),
      })
        .then(async (res) => {
          if (configSavingDelayRef.current) {
            clearTimeout(configSavingDelayRef.current);
            configSavingDelayRef.current = null;
          }
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            const msg =
              typeof data?.error === "string"
                ? data.error
                : "Error al guardar la configuración.";
            setConfigErrorMessage(msg);
            setConfigSaveStatus("error");
            setTimeout(() => {
              setConfigSaveStatus("idle");
              setConfigErrorMessage(null);
            }, 4000);
            return;
          }
          setConfigSaveStatus("saved");
          setTimeout(() => setConfigSaveStatus("idle"), 2000);
        })
        .catch(() => {
          if (configSavingDelayRef.current) {
            clearTimeout(configSavingDelayRef.current);
            configSavingDelayRef.current = null;
          }
          setConfigErrorMessage("Error de red al guardar configuración.");
          setConfigSaveStatus("error");
          setTimeout(() => {
            setConfigSaveStatus("idle");
            setConfigErrorMessage(null);
          }, 4000);
        });
    }, 600);
    return () => {
      clearTimeout(t);
      if (configSavingDelayRef.current) {
        clearTimeout(configSavingDelayRef.current);
        configSavingDelayRef.current = null;
      }
    };
  }, [priority, displayCurrency, exchangeRate]);

  const effectiveSaveStatus =
    saveStatus !== "idle" ? saveStatus : configSaveStatus;
  const effectiveErrorMessage = errorMessage ?? configErrorMessage;
  const effectiveSaveContext: "route" | "domestic" | "config" | null =
    saveStatus !== "idle" ? saveContext : configSaveStatus !== "idle" ? "config" : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "28px var(--page-padding)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <SaveNotification
        status={effectiveSaveStatus}
        errorMessage={effectiveErrorMessage}
        context={effectiveSaveContext}
      />
      <div
        style={{
          width: "100%",
          maxWidth: "var(--max-width)",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "var(--space-2xl)",
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: "var(--accent)",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Comparador de rutas
          </div>
          <h1
            style={{
              fontSize: 36,
              margin: 0,
              color: "var(--text-primary)",
              fontWeight: 800,
            }}
          >
            ✈️ Vuelos para papás
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "var(--space-md)",
              fontSize: 18,
              fontWeight: "var(--label-weight)",
            }}
          >
            Caracas (CCS) → Toronto (YYZ)
          </p>
        </div>

        <ConfigBar
          priority={priority}
          setPriority={setPriority}
          displayCurrency={displayCurrency}
          setDisplayCurrency={setDisplayCurrency}
          exchangeRate={exchangeRate}
          setExchangeRate={setExchangeRate}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-lg)",
          }}
        >
          <h2
            style={{
              color: "var(--text-primary)",
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            Ingresar opciones
          </h2>
          <button
            type="button"
            onClick={() => setShowForm((s) => !s)}
            aria-label={showForm ? "Ocultar formulario de opciones" : "Mostrar formulario de opciones"}
            style={{
              background: "var(--bg-card)",
              border: "2px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--btn-padding-y) var(--btn-padding-x)",
              color: "var(--accent)",
              fontSize: 16,
              fontWeight: "var(--label-weight)",
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
              onAdd={addDomestic}
              onSave={(d) => persist("/api/domestic", "POST", d)}
              onDelete={(id) => persist("/api/domestic", "DELETE", { id })}
              expanded={showDomesticSection}
              onToggleCollapse={() => setShowDomesticSection((s) => !s)}
            />

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column" as const,
                gap: "var(--space-lg)",
                marginBottom: "var(--space-xl)",
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
                  onReorderLegs={(fromIndex: number, toIndex: number) =>
                    reorderLegs(route.id, fromIndex, toIndex)
                  }
                  onSave={(r) => persist("/api/flights", "POST", r)}
                  onDelete={() =>
                    persist("/api/flights", "DELETE", { id: route.id })
                  }
                  canDelete={routes.length > 1}
                  canAddLeg={route.legs.length < MAX_LEGS_PER_ROUTE}
                  maxLegsPerRoute={MAX_LEGS_PER_ROUTE}
                />
              ))}

              {routes.length >= MAX_ROUTES ? (
                <p
                  style={{
                    padding: "var(--space-md) var(--space-xl)",
                    color: "var(--text-muted)",
                    fontSize: 15,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Máximo {MAX_ROUTES} rutas. Eliminá una para agregar otra.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={addRoute}
                  aria-label="Agregar otra ruta"
                  style={{
                    background: "#dbeafe",
                    border: "2px dashed var(--accent)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-xl)",
                    color: "var(--accent)",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  + Agregar otra ruta
                </button>
              )}
            </div>
          </>
        )}

        {scored.length > 0 && (
          <div style={{ width: "100%" }}>
            <div
              style={{
                width: "100%",
                borderTop: "2px solid var(--border)",
                paddingTop: "var(--space-2xl)",
                marginBottom: "var(--space-xl)",
              }}
            >
              <h2
                style={{
                  color: "var(--text-primary)",
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 800,
                }}
              >
                🏆 Ranking de rutas
              </h2>
            </div>

            <div
              className="glass"
              style={{
                width: "100%",
                background: "var(--success-bg)",
                border: "3px solid var(--success)",
                padding: "var(--card-padding)",
                marginBottom: "var(--space-xl)",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: "var(--section-title-size)",
                  color: "var(--success)",
                  fontWeight: "var(--section-title-weight)",
                }}
              >
                Recomendación
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  marginTop: "var(--space-xs)",
                }}
              >
                {scored[0].route.label || "Ruta 1"}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "var(--text-secondary)",
                  marginTop: "var(--space-xs)",
                  fontWeight: "var(--label-weight)",
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
                width: "100%",
                display: "flex",
                flexDirection: "column" as const,
                gap: "var(--space-md)",
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
              className="glass"
              style={{
                width: "100%",
                marginTop: "var(--space-2xl)",
                padding: "var(--card-padding)",
                boxSizing: "border-box",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                  fontWeight: "var(--label-weight)",
                }}
              >
                💱 Tasa:{" "}
                <strong style={{ color: "var(--accent)" }}>
                  1 USD = {exchangeRate} CAD
                </strong>{" "}
                · Actualizala en la barra de arriba.
                <br />
                💾 Los datos persisten en la nube — podés volver mañana y seguir
                comparando.
                <br />
                💡 Para adultos mayores considerá{" "}
                <strong style={{ color: "var(--success)" }}>
                  🛋️ Comodidad
                </strong>{" "}
                — menos conexiones = menos estrés.
              </p>
            </div>
          </div>
        )}

        {scored.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px var(--space-2xl)",
              color: "var(--text-muted)",
              fontSize: 18,
              fontWeight: "var(--label-weight)",
            }}
          >
            ↑ Completá y guardá al menos una ruta con precio para ver el ranking
          </div>
        )}
      </div>
    </div>
  );
}
