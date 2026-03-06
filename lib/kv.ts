import { kv } from "@vercel/kv";
import { AppData, Route, Domestic, Priority } from "./types";

const VALID_PRIORITIES: Priority[] = ["price", "comfort", "time", "balanced"];

function normalizeAppData(merged: AppData): AppData {
  if (typeof merged.exchangeRateUSDToCAD !== "number") {
    merged.exchangeRateUSDToCAD = DEFAULT_EXCHANGE_RATE;
  }
  if (merged.priority && !VALID_PRIORITIES.includes(merged.priority as Priority)) {
    merged.priority = "price";
  }
  return merged;
}

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

/** In-memory fallback when KV env vars are missing (e.g. local dev without .env) */
const memoryStore = new Map<string, AppData>();

function hasKvEnv(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getData(): Promise<AppData> {
  if (!hasKvEnv()) {
    const stored = memoryStore.get(DATA_KEY);
    return normalizeAppData(stored ?? defaultData());
  }
  try {
    const data = await kv.get<AppData>(DATA_KEY);
    return normalizeAppData(data ?? defaultData());
  } catch {
    const stored = memoryStore.get(DATA_KEY);
    return normalizeAppData(stored ?? defaultData());
  }
}

export async function saveData(data: AppData): Promise<void> {
  const toSave = { ...data, lastUpdated: new Date().toISOString() };
  if (!hasKvEnv()) {
    memoryStore.set(DATA_KEY, toSave);
    return;
  }
  try {
    await kv.set(DATA_KEY, toSave);
  } catch {
    memoryStore.set(DATA_KEY, toSave);
  }
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
