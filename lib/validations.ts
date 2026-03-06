import { z } from "zod";

const currencySchema = z.enum(["USD", "CAD"]);
const transportSchema = z.enum(["Bus", "Vuelo interno", "Carro", "Otro"]);

export const legSchema = z.object({
  id: z.string(),
  origin: z.string(),
  destination: z.string(),
  airline: z.string(),
  date: z.string().optional().default(""),
  time: z.string().optional().default(""),
  timeArrival: z.string().optional().default(""),
  flightHours: z.number(),
  layoverHours: z.number(),
  price: z.union([z.string(), z.number()]).transform(String),
  currency: currencySchema,
  notes: z.string(),
});

export const routeSchema = z.object({
  id: z.string(),
  label: z.string(),
  legs: z.array(legSchema).min(1),
  domesticId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const domesticSchema = z.object({
  id: z.string(),
  label: z.string(),
  cityOrigin: z.string(),
  transport: transportSchema,
  durationHours: z.number(),
  price: z.union([z.string(), z.number()]).transform(String),
  currency: currencySchema,
  notes: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const prioritySchema = z.enum(["price", "comfort", "time", "balanced"]);

export const settingsSchema = z.object({
  priority: prioritySchema.optional(),
  displayCurrency: currencySchema.optional(),
  exchangeRateUSDToCAD: z.number().min(0.1).max(3).optional(),
});

export type RouteInput = z.infer<typeof routeSchema>;
export type DomesticInput = z.infer<typeof domesticSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
