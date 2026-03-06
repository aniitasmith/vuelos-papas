export type Currency = "USD" | "CAD";
export type Transport = "Bus" | "Vuelo interno" | "Carro" | "Otro";

/** Un tramo individual dentro de una ruta: ej CCS→CUN o CUN→YYZ */
export interface Leg {
  id: string;
  origin: string;       // ej "CCS"
  destination: string;  // ej "CUN"
  airline: string;      // puede ser aerolínea, agencia, o combo
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
  priority: string;
  displayCurrency: Currency;
  /** Tasa de cambio USD → CAD (ej: 1.39). Se usa para normalizar precios. */
  exchangeRateUSDToCAD: number;
  lastUpdated: string;
}
