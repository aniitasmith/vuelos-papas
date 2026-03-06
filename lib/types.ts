export type Currency = "USD" | "CAD";
export type Transport = "Bus" | "Vuelo interno" | "Carro" | "Otro";
export type Priority = "price" | "comfort" | "time" | "balanced";

/** Un tramo individual dentro de una ruta: ej CCS→CUN o CUN→YYZ */
export interface Leg {
  id: string;
  origin: string;       // ej "CCS"
  destination: string;  // ej "CUN"
  airline: string;      // puede ser aerolínea, agencia, o combo
  /** Fecha del vuelo (YYYY-MM-DD). Opcional por compatibilidad con datos existentes. */
  date?: string;
  /** Hora de salida (HH:MM). Opcional por compatibilidad con datos existentes. */
  time?: string;
  /** Hora de llegada (HH:MM). Opcional. Si hay salida y llegada, las horas de vuelo se calculan automáticamente. */
  timeArrival?: string;
  flightHours: number;
  layoverHours: number; // espera DESPUÉS de este tramo antes del siguiente
  price: string;
  currency: Currency;
  notes: string;
}

/** Una ruta completa = N tramos encadenados */
export interface Route {
  id: string;
  label: string;        // nombre libre: "Vía Cancún", "Copa directo", etc.
  legs: Leg[];
  domesticId?: string;  // id del trayecto nacional que aplica a esta ruta
  createdAt: string;
  updatedAt: string;
}

export interface Domestic {
  id: string;
  label: string;
  cityOrigin: string;
  transport: Transport;
  durationHours: number;
  price: string;
  currency: Currency;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  routes: Route[];
  domestics: Domestic[];
  priority: Priority;
  displayCurrency: Currency;
  /** Tasa de cambio USD → CAD (ej: 1.39). Se usa para normalizar precios. */
  exchangeRateUSDToCAD: number;
  lastUpdated: string;
}
