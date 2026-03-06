import { kv } from "@vercel/kv";
import { AppData, Route, Domestic } from "./types";

const DATA_KEY = "vuelos:data";

const DEFAULT_EXCHANGE_RATE = 1.39;

const defaultData = (): AppData => ({
  routes: [],
  domestics: [],
  priority: "price",
  displayCurrency: "USD",
  exchangeRateUSDToCAD: DEFAULT_EXCHANGE_RATE,
  lastUpdated: new Date().toISOString(),
});

export async function getData(): Promise<AppData> {
  try {
    const data = await kv.get<AppData>(DATA_KEY);
    const merged = data ?? defaultData();
    if (typeof merged.exchangeRateUSDToCAD !== "number") {
      merged.exchangeRateUSDToCAD = DEFAULT_EXCHANGE_RATE;
    }
    return merged;
  } catch {
    return defaultData();
  }
}

export async function saveData(data: AppData): Promise<void> {
  await kv.set(DATA_KEY, { ...data, lastUpdated: new Date().toISOString() });
}

export async function upsertRoute(route: Route): Promise<AppData> {
  const data = await getData();
  const idx = data.routes.findIndex((r) => r.id === route.id);
  if (idx >= 0) {
    data.routes[idx] = { ...route, updatedAt: new Date().toISOString() };
  } else {
    data.routes.push({ ...route, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  await saveData(data);
  return data;
}

export async function deleteRoute(id: string): Promise<AppData> {
  const data = await getData();
  data.routes = data.routes.filter((r) => r.id !== id);
  await saveData(data);
  return data;
}

export async function upsertDomestic(domestic: Domestic): Promise<AppData> {
  const data = await getData();
  const idx = data.domestics.findIndex((d) => d.id === domestic.id);
  if (idx >= 0) {
    data.domestics[idx] = { ...domestic, updatedAt: new Date().toISOString() };
  } else {
    data.domestics.push({ ...domestic, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  await saveData(data);
  return data;
}

export async function deleteDomestic(id: string): Promise<AppData> {
  const data = await getData();
  data.domestics = data.domestics.filter((d) => d.id !== id);
  await saveData(data);
  return data;
}

export async function updateSettings(
  settings: Partial<Pick<AppData, "priority" | "displayCurrency" | "exchangeRateUSDToCAD">>
): Promise<AppData> {
  const data = await getData();
  const updated = { ...data, ...settings };
  await saveData(updated);
  return updated;
}
