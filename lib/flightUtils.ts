import type { Currency, Leg, Route, Domestic } from "./types";

export const PRIORITY_OPTIONS = [
  { value: "balanced", label: "⚖️ Balance" },
  { value: "price", label: "💰 Precio" },
  { value: "comfort", label: "🛋️ Comodidad" },
  { value: "time", label: "⏱️ Tiempo" },
];

export const WEIGHTS: Record<string, { price: number; stops: number; duration: number }> = {
  balanced: { price: 0.4, stops: 0.3, duration: 0.3 },
  price: { price: 0.7, stops: 0.15, duration: 0.15 },
  comfort: { price: 0.15, stops: 0.5, duration: 0.35 },
  time: { price: 0.2, stops: 0.2, duration: 0.6 },
};

export function toCAD(price: string | number, currency: Currency, exchangeRate: number): number {
  const n = parseFloat(String(price)) || 0;
  return currency === "CAD" ? n : n * exchangeRate;
}

export function toUSD(cad: number, exchangeRate: number): number {
  return cad / exchangeRate;
}

export function fmt(cad: number, displayCurrency: Currency, exchangeRate: number): string {
  if (displayCurrency === "CAD") {
    return `CAD $${cad.toLocaleString("en", { maximumFractionDigits: 0 })}`;
  }
  return `USD $${toUSD(cad, exchangeRate).toLocaleString("en", { maximumFractionDigits: 0 })}`;
}

export const uid = () => Math.random().toString(36).slice(2);
export const now = () => new Date().toISOString();

export function emptyLeg(): Leg {
  return {
    id: uid(),
    origin: "",
    destination: "",
    airline: "",
    flightHours: 0,
    layoverHours: 0,
    price: "",
    currency: "USD",
    notes: "",
  };
}

export function emptyRoute(): Route {
  return {
    id: uid(),
    label: "",
    legs: [emptyLeg(), emptyLeg()],
    createdAt: now(),
    updatedAt: now(),
  };
}

export function emptyDomestic(): Domestic {
  return {
    id: uid(),
    label: "",
    cityOrigin: "",
    transport: "Bus",
    durationHours: 0,
    price: "",
    currency: "USD",
    notes: "",
    createdAt: now(),
    updatedAt: now(),
  };
}

export function routeTotalCAD(route: Route, exchangeRate: number): number {
  return route.legs.reduce((s, l) => s + toCAD(l.price, l.currency, exchangeRate), 0);
}

export function routeTotalHours(route: Route): number {
  return route.legs.reduce((s, l) => s + (l.flightHours || 0) + (l.layoverHours || 0), 0);
}

export function routeStops(route: Route): number {
  return Math.max(0, route.legs.length - 1);
}
