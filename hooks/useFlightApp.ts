"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import type { AppData, Route, Leg, Domestic, Currency, Priority } from "@/lib/types";
import {
  toCAD,
  now,
  emptyLeg,
  emptyRoute,
  emptyDomestic,
  routeTotalCAD,
  routeTotalHours,
  routeStops,
  WEIGHTS,
} from "@/lib/flightUtils";

export type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

export function useRoutes(initialRoutes: Route[]) {
  const [routes, setRoutes] = useState<Route[]>(
    initialRoutes?.length ? initialRoutes : [emptyRoute()]
  );

  const updateRoute = useCallback(
    (routeId: string, field: keyof Route, value: string | undefined) =>
      setRoutes((rs) =>
        rs.map((r) =>
          r.id === routeId ? { ...r, [field]: value, updatedAt: now() } : r
        )
      ),
    []
  );

  const updateLeg = useCallback(
    (routeId: string, legId: string, field: keyof Leg, value: string | number) =>
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
      ),
    []
  );

  const addLeg = useCallback((routeId: string) => {
    setRoutes((rs) =>
      rs.map((r) => {
        if (r.id !== routeId) return r;
        const lastLeg = r.legs[r.legs.length - 1];
        const newLeg = {
          ...emptyLeg(),
          origin: lastLeg?.destination ? String(lastLeg.destination).trim() : "",
        };
        return { ...r, updatedAt: now(), legs: [...r.legs, newLeg] };
      })
    );
  }, []);

  const removeLeg = useCallback((routeId: string, legId: string) => {
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
  }, []);

  const reorderLegs = useCallback(
    (routeId: string, fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      setRoutes((rs) =>
        rs.map((r) => {
          if (r.id !== routeId) return r;
          const newLegs = [...r.legs];
          const [removed] = newLegs.splice(fromIndex, 1);
          newLegs.splice(toIndex, 0, removed);
          return { ...r, updatedAt: now(), legs: newLegs };
        })
      );
    },
    []
  );

  const addRoute = useCallback(() => {
    setRoutes((rs) => [...rs, emptyRoute()]);
  }, []);

  return {
    routes,
    setRoutes,
    updateRoute,
    updateLeg,
    addLeg,
    removeLeg,
    reorderLegs,
    addRoute,
  };
}

export function useDomestics(initialDomestics: Domestic[]) {
  const [domestics, setDomestics] = useState<Domestic[]>(
    initialDomestics?.length ? initialDomestics : [emptyDomestic()]
  );

  const updateDomestic = useCallback(
    (id: string, field: keyof Domestic, value: string | number) =>
      setDomestics((ds) =>
        ds.map((d) =>
          d.id === id ? { ...d, [field]: value, updatedAt: now() } : d
        )
      ),
    []
  );

  const addDomestic = useCallback(() => {
    setDomestics((ds) => [...ds, emptyDomestic()]);
  }, []);

  return { domestics, setDomestics, updateDomestic, addDomestic };
}

export function useScoredRoutes(
  routes: Route[],
  domestics: Domestic[],
  priority: Priority,
  exchangeRate: number
) {
  const getDomesticForRoute = useCallback(
    (route: Route): Domestic | null => {
      if (route.domesticId) {
        const d = domestics.find((x) => x.id === route.domesticId);
        if (d) return d;
      }
      return domestics[0] ?? null;
    },
    [domestics]
  );

  return useMemo(() => {
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
  }, [routes, getDomesticForRoute, priority, exchangeRate]);
}

export type SaveContext = "route" | "domestic" | "config";

function getSaveContextFromEndpoint(endpoint: string): SaveContext {
  if (endpoint.includes("flights")) return "route";
  if (endpoint.includes("domestic")) return "domestic";
  return "config";
}

const SAVING_DELAY_MS = 400;

export function usePersist(
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>,
  setDomestics: React.Dispatch<React.SetStateAction<Domestic[]>>
) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveContext, setSaveContext] = useState<SaveContext | null>(null);
  const savingDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(
    async (
      endpoint: string,
      method: string,
      body: unknown,
      onSuccess?: (data: AppData) => void
    ) => {
      const context = getSaveContextFromEndpoint(endpoint);
      setSaveContext(context);
      setErrorMessage(null);

      if (savingDelayRef.current) clearTimeout(savingDelayRef.current);
      setSaveStatus("pending");
      savingDelayRef.current = setTimeout(() => {
        savingDelayRef.current = null;
        setSaveStatus("saving");
      }, SAVING_DELAY_MS);

      try {
        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (savingDelayRef.current) {
          clearTimeout(savingDelayRef.current);
          savingDelayRef.current = null;
        }
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
            setSaveContext(null);
          }, 4000);
          return;
        }
        const appData = data as AppData;
        if (appData.routes?.length) setRoutes(appData.routes);
        else setRoutes([emptyRoute()]);
        if (appData.domestics?.length) setDomestics(appData.domestics);
        else setDomestics([emptyDomestic()]);
        onSuccess?.(appData);
        setSaveStatus("saved");
        setTimeout(() => {
          setSaveStatus("idle");
          setSaveContext(null);
        }, 2000);
      } catch {
        if (savingDelayRef.current) {
          clearTimeout(savingDelayRef.current);
          savingDelayRef.current = null;
        }
        setErrorMessage("Error de red. ¿Tenés conexión?");
        setSaveStatus("error");
        setTimeout(() => {
          setSaveStatus("idle");
          setErrorMessage(null);
          setSaveContext(null);
        }, 4000);
      }
    },
    [setRoutes, setDomestics]
  );

  return { persist, saveStatus, errorMessage, saveContext, setErrorMessage };
}
