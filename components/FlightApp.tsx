"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AppData, Currency, Priority } from "@/lib/types";
import { fmt } from "@/lib/flightUtils";
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
    <div className="min-h-screen w-full box-border px-page py-7">
      <SaveNotification
        status={effectiveSaveStatus}
        errorMessage={effectiveErrorMessage}
        context={effectiveSaveContext}
      />
      <div className="mx-auto w-full max-w-content">
        <div className="mb-6 text-center">
          <div className="mb-2 text-base font-bold text-accent">
            Comparador de rutas
          </div>
          <h1 className="m-0 text-4xl font-extrabold text-text-primary">
            ✈️ Vuelos para papás
          </h1>
          <p className="mt-3 text-lg font-semibold text-text-secondary">
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

        <div className="mb-4 flex items-center justify-between">
          <h2 className="m-0 text-2xl font-extrabold text-text-primary">
            Ingresar opciones
          </h2>
          <button
            type="button"
            onClick={() => setShowForm((s) => !s)}
            aria-label={showForm ? "Ocultar formulario de opciones" : "Mostrar formulario de opciones"}
            className="rounded-sm border-2 border-border bg-bg-card px-5 py-3 text-base font-semibold text-accent"
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

            <div className="mb-5 flex w-full flex-col gap-4">
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
                <p className="m-0 px-5 py-3 text-[15px] font-semibold text-text-muted">
                  Máximo {MAX_ROUTES} rutas. Eliminá una para agregar otra.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={addRoute}
                  aria-label="Agregar otra ruta"
                  className="rounded-md border-2 border-dashed border-accent bg-blue-100 p-5 text-lg font-bold text-accent"
                >
                  + Agregar otra ruta
                </button>
              )}
            </div>
          </>
        )}

        {scored.length > 0 && (
          <div className="w-full">
            <div className="mb-5 w-full border-t-2 border-border pt-6">
              <h2 className="m-0 text-[26px] font-extrabold text-text-primary">
                🏆 Ranking de rutas
              </h2>
            </div>

            <div className="glass mb-5 box-border w-full border-[3px] border-success bg-success-bg p-5">
              <div className="text-sm font-bold text-success">
                Recomendación
              </div>
              <div className="mt-1.5 text-2xl font-extrabold text-text-primary">
                {scored[0].route.label || "Ruta 1"}
              </div>
              <div className="mt-1.5 text-base font-semibold text-text-secondary">
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

            <div className="flex w-full flex-col gap-3">
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

            <div className="glass mt-6 box-border w-full p-5">
              <p className="m-0 text-base font-semibold leading-[1.8] text-text-secondary">
                💱 Tasa:{" "}
                <strong className="text-accent">1 USD = {exchangeRate} CAD</strong>{" "}
                · Actualizala en la barra de arriba.
                <br />
                💾 Los datos persisten en la nube — podés volver mañana y seguir
                comparando.
                <br />
                💡 Para adultos mayores considerá{" "}
                <strong className="text-success">🛋️ Comodidad</strong> — menos
                conexiones = menos estrés.
              </p>
            </div>
          </div>
        )}

        {scored.length === 0 && (
          <div className="py-12 px-6 text-center text-lg font-semibold text-text-muted">
            ↑ Completá y guardá al menos una ruta con precio para ver el ranking
          </div>
        )}
      </div>
    </div>
  );
}
